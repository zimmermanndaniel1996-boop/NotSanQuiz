"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useStudent } from "../context/StudentContext";
import { recordAnswer } from "../lib/progressApi";
import { getQuestionCode } from "../lib/questionCode";

// Mischt eine Liste in zufälliger Reihenfolge (Fisher-Yates-Verfahren)
function shuffleArray(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Mischt nur die Anzeigereihenfolge der Antworten, damit die richtige
// Antwort nicht immer an derselben Position steht. Welche Antwort richtig
// ist, weiß hier niemand - das prüft ausschließlich der Server
// (siehe /api/check-answer), damit die Lösung nie im Browser-Bundle landet.
function shuffleOptionsOnly(question) {
  return { ...question, options: shuffleArray(question.options) };
}

async function checkAnswer(questionId, options, selectedIndex) {
  const res = await fetch("/api/check-answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questionId, options, selectedIndex }),
  });
  if (!res.ok) throw new Error("Antwort konnte nicht geprüft werden.");
  return res.json();
}

export default function QuizGame({
  title,
  questions,
  shuffle = false,
  backHref = "/",
  backLabel = "Zurück zum Hauptmenü",
}) {
  // Die zufällige Mischung darf erst im Browser passieren, nicht beim
  // serverseitigen Rendern - sonst weichen Server- und Browser-Ausgabe
  // voneinander ab (Hydration-Fehler). Deshalb: zuerst unangetastet
  // anzeigen, danach (useEffect) im Browser mischen.
  const [mounted, setMounted] = useState(false);
  const [orderedQuestions, setOrderedQuestions] = useState(questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [checking, setChecking] = useState(false);
  const [answerResult, setAnswerResult] = useState(null);
  const [checkError, setCheckError] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (shuffle) {
      setOrderedQuestions(shuffleArray(questions));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rawQuestion = orderedQuestions[currentIndex];
  const currentQuestion = useMemo(
    () => (mounted && rawQuestion ? shuffleOptionsOnly(rawQuestion) : rawQuestion),
    [mounted, rawQuestion]
  );
  const hasSelected = selectedOption !== null;
  const hasResult = answerResult !== null;
  const { student } = useStudent();

  async function handleSelect(optionIndex) {
    if (hasSelected || checking) return;
    setSelectedOption(optionIndex);
    setCheckError(null);
    setChecking(true);
    try {
      const result = await checkAnswer(currentQuestion.id, currentQuestion.options, optionIndex);
      setAnswerResult(result);
      if (result.correct) {
        setScore((s) => s + 1);
      }
      recordAnswer(student.id, currentQuestion.id, result.correct).catch((err) => {
        console.error("Fortschritt konnte nicht gespeichert werden:", err.message);
      });
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

  function handleRestart() {
    if (shuffle) {
      setOrderedQuestions(shuffleArray(questions));
    }
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswerResult(null);
    setCheckError(null);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    return (
      <main>
        <div className="page-header">
          <h1>{title}</h1>
        </div>
        <div className="result-box">
          <p>Quiz abgeschlossen!</p>
          <div className="score">
            {score} von {orderedQuestions.length} richtig
          </div>
          <button className="primary-button" onClick={handleRestart}>
            Nochmal versuchen
          </button>
          <Link href="/" className="secondary-button">
            Zurück zum Hauptmenü
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Link href={backHref} className="back-link">
        ← {backLabel}
      </Link>

      <div className="page-header">
        <h1>{title}</h1>
      </div>

      <div className="quiz-progress">
        Frage {currentIndex + 1} von {orderedQuestions.length}
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
          <strong>{answerResult.correct ? "Richtig!" : "Leider falsch."}</strong>
          <p>{answerResult.explanation}</p>
        </div>
      )}

      {hasResult && (
        <button className="primary-button" onClick={handleNext}>
          {currentIndex + 1 < orderedQuestions.length ? "Nächste Frage" : "Quiz beenden"}
        </button>
      )}
    </main>
  );
}
