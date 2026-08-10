import { supabase } from "./supabaseClient";

// Holt den Lernfortschritt eines Schülers als Nachschlage-Objekt:
// { [questionId]: { level, timesCorrect, timesWrong } }
export async function getProgressForStudent(studentId) {
  const { data, error } = await supabase
    .from("progress")
    .select("question_id, level, times_correct, times_wrong")
    .eq("student_id", studentId);

  if (error) throw error;

  const map = {};
  for (const row of data) {
    map[row.question_id] = {
      level: row.level,
      timesCorrect: row.times_correct,
      timesWrong: row.times_wrong,
    };
  }
  return map;
}

// Trägt das Ergebnis einer beantworteten Frage ein (Leitner-Prinzip):
// richtig -> Stufe +1 (max. 5), falsch -> zurück auf Stufe 1.
export async function recordAnswer(studentId, questionId, correct) {
  const { data: existing, error: findError } = await supabase
    .from("progress")
    .select("id, level, times_correct, times_wrong")
    .eq("student_id", studentId)
    .eq("question_id", questionId)
    .maybeSingle();

  if (findError) throw findError;

  if (!existing) {
    const { error } = await supabase.from("progress").insert({
      student_id: studentId,
      question_id: questionId,
      level: correct ? 2 : 1,
      times_correct: correct ? 1 : 0,
      times_wrong: correct ? 0 : 1,
      last_reviewed_at: new Date().toISOString(),
    });
    if (error) throw error;
    return;
  }

  const newLevel = correct ? Math.min(existing.level + 1, 5) : 1;
  const { error } = await supabase
    .from("progress")
    .update({
      level: newLevel,
      times_correct: existing.times_correct + (correct ? 1 : 0),
      times_wrong: existing.times_wrong + (correct ? 0 : 1),
      last_reviewed_at: new Date().toISOString(),
    })
    .eq("id", existing.id);
  if (error) throw error;
}

// Holt alle Schüler mitsamt ihrem gesamten Fortschritt
// (für den PAL-Bereich).
export async function getAllStudentsWithProgress() {
  const { data: students, error: studentsError } = await supabase
    .from("students")
    .select("id, name, created_at")
    .order("name");
  if (studentsError) throw studentsError;

  const { data: progress, error: progressError } = await supabase
    .from("progress")
    .select("student_id, question_id, level, times_correct, times_wrong");
  if (progressError) throw progressError;

  const progressByStudent = {};
  for (const row of progress) {
    if (!progressByStudent[row.student_id]) progressByStudent[row.student_id] = [];
    progressByStudent[row.student_id].push(row);
  }

  return students.map((s) => ({
    ...s,
    progress: progressByStudent[s.id] || [],
  }));
}
