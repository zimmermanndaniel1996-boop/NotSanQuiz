"use client";

import { useEffect, useState } from "react";
import { useStudent } from "../context/StudentContext";
import { getProgressForStudent } from "../lib/progressApi";
import QuizGame from "./QuizGame";

export default function SchnellquizLoader() {
  const { student } = useStudent();
  const [selectedQuestions, setSelectedQuestions] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getProgressForStudent(student.id)
      .then((progressMap) =>
        // Auswahl passiert serverseitig, damit der Browser nie den
        // kompletten Fragenpool (mit Lösungen) laden muss.
        fetch("/api/schnellquiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ progress: progressMap }),
        }).then((res) => {
          if (!res.ok) throw new Error("Schnellquiz konnte nicht geladen werden.");
          return res.json();
        })
      )
      .then(({ questions }) => {
        if (!cancelled) setSelectedQuestions(questions);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [student.id]);

  if (error) {
    return (
      <main>
        <div className="page-header">
          <h1>Schnellquiz</h1>
        </div>
        <p className="name-error">
          Fragen konnten nicht geladen werden: {error}
        </p>
      </main>
    );
  }

  if (!selectedQuestions) {
    return (
      <main>
        <div className="page-header">
          <h1>Schnellquiz</h1>
          <p>Fragen werden ausgewählt …</p>
        </div>
      </main>
    );
  }

  return <QuizGame title="Schnellquiz" questions={selectedQuestions} />;
}
