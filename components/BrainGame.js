"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useStudent } from "../context/StudentContext";
import { getQuestionCode } from "../lib/questionCode";
import BrainLeaderboard from "./BrainLeaderboard";

// Mischt eine Liste in zufälliger Reihenfolge (Fisher-Yates-Verfahren)
function shuffleArray(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function shuffleOptionsOnly(question) {
  return { ...question, options: shuffleArray(question.options) };
}

async function checkBrainAnswer(questionId, options, selectedIndex, elapsedMs) {
  const res = await fetch("/api/brain/check-answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questionId, options, selectedIndex, elapsedMs }),
  });
  if (!res.ok) throw new Error("Antwort konnte nicht geprüft werden.");
  return res.json();
}

async function submitBrainScore(studentId, studentName, score) {
  await fetch("/api/brain/submit-score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId, studentName, score }),
  });
}

export default function BrainGame({ questions }) {
  const { student } = useStudent();
  const [mounted, setMounted] = useState(false);
  const [orderedQuestions, setOrderedQuestions] = useState(questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [checking, setChecking] = useState(false);
  const [answerResult, setAnswerResult] = useState(null);
  const [checkError, setCheckError] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [questionStartedAt, setQuestionStartedAt] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setOrderedQuestions(shuffleArray(questions));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rawQuestion = orderedQuestions[currentIndex];
  const currentQuestion = useMemo(
    () => (mounted && rawQuestion ? shuffleOptionsOnly(rawQuestion) : rawQuestion),
    [mounted, rawQuestion]
  );

  // Startzeitpunkt für den Zeitbonus - wird gesetzt, sobald eine neue
  // Frage angezeigt wird (erst nach dem Mischen, siehe oben).
  useEffect(() => {
    if (mounted && currentQuestion && !finished) {
      setQuestionStartedAt(Date.now());
    }
  }, [mounted, currentQuestion?.id, finished]);

  const hasSelected = selectedOption !== null;
  const hasResult = answerResult !== null;

  async function handleSelect(optionIndex) {
    if (hasSelected || checking) return;
    setSelectedOption(optionIndex);
    setCheckError(null);
    setChecking(true);
    const elapsedMs = Date.now() - (questionStartedAt || Date.now());
    try {
      const result = await checkBrainAnswer(
        currentQuestion.id,
        currentQuestion.options,
        optionIndex,
        elapsedMs
      );
      setAnswerResult(result);
      setScore((s) => s + result.points);
    } catch (err) {
      setCheckError(err.message);
      setSelectedOption(null);
    } finally {
      setChecking(false);
    }
  }

  function handleNext() {
    setSelectedOption(null);
    setAnswerResult(null);
    setCheckError(null);
    if (currentIndex + 1 < orderedQuestions.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setFinished(true);
    }
  }

  useEffect(() => {
    if (finished && !submitted) {
      setSubmitted(true);
      submitBrainScore(student.id, student.name, score).catch((err) => {
        console.error("Punktzahl konnte nicht gespeichert werden:", err.message);
      });
    }
  }, [finished, submitted, student.id, student.name, score]);

  if (finished) {
    return (
      <main>
        <div className="page-header">
          <h1>The Brain</h1>
        </div>
        <div className="result-box">
          <p>Runde abgeschlossen!</p>
          <div className="score">{score} Punkte</div>
          <Link href="/" className="secondary-button">
            Zurück zum Hauptmenü
          </Link>
        </div>
        <div className="progress-section">
          <BrainLeaderboard />
        </div>
      </main>
    );
  }

  return (
    <main>
      <Link href="/" className="back-link">
        ← Zurück zum Hauptmenü
      </Link>

      <div className="page-header">
        <h1>The Brain</h1>
      </div>

      <div className="quiz-progress">
        Frage {currentIndex + 1} von {orderedQuestions.length} · {score} Punkte
      </div>

      <div className="quiz-question">
        {currentQuestion.id && (
          <span className="question-code">{getQuestionCode(currentQuestion.id)}</span>
        )}
        <h2>{currentQuestion.question}</h2>
      </div>

      <div className="answer-list">
        {currentQuestion.options.map((option, index) => {
          let className = "answer-button";
          if (hasResult) {
            if (index === answerResult.correctIndex) {
              className += " correct";
            } else if (index === selectedOption) {
              className += " wrong";
            }
          }
          return (
            <button
              key={index}
              className={className}
              onClick={() => handleSelect(index)}
              disabled={hasSelected}
            >
              {option}
            </button>
          );
        })}
      </div>

      {checking && !hasResult && <p className="quiz-progress">Wird geprüft …</p>}

      {checkError && <p className="name-error">{checkError}</p>}

      {hasResult && (
        <div className={`feedback-box ${answerResult.correct ? "correct" : "wrong"}`}>
          <strong>
            {answerResult.correct ? `Richtig! +${answerResult.points} Punkte` : "Leider falsch."}
          </strong>
          <p>{answerResult.explanation}</p>
        </div>
      )}

      {hasResult && (
        <button className="primary-button" onClick={handleNext}>
          {currentIndex + 1 < orderedQuestions.length ? "Nächste Frage" : "Runde beenden"}
        </button>
      )}
    </main>
  );
}
