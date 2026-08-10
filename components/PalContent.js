"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PAL_PASSWORD } from "../lib/palConfig";
import { getAllStudentsWithProgress } from "../lib/progressApi";
import { percentSecure, percentStarted, progressRowsToMap } from "../lib/progressStats";
import ProgressRing from "./ProgressRing";

const SESSION_KEY = "notsanquiz_pal_auth";

export default function PalContent({ categories }) {
  const [checkedSession, setCheckedSession] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState(null);

  const [students, setStudents] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  useEffect(() => {
    if (window.sessionStorage.getItem(SESSION_KEY) === "true") {
      setAuthenticated(true);
    }
    setCheckedSession(true);
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    getAllStudentsWithProgress()
      .then(setStudents)
      .catch((err) => setLoadError(err.message));
  }, [authenticated]);

  function handlePasswordSubmit(e) {
    e.preventDefault();
    if (passwordInput === PAL_PASSWORD) {
      window.sessionStorage.setItem(SESSION_KEY, "true");
      setAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError("Falsches Passwort.");
    }
  }

  if (!checkedSession) return null;

  if (!authenticated) {
    return (
      <main>
        <Link href="/" className="back-link">
          ← Zurück zum Hauptmenü
        </Link>
        <div className="page-header">
          <h1>PAL-Bereich</h1>
          <p>Bitte Passwort eingeben</p>
        </div>
        <form onSubmit={handlePasswordSubmit} className="pal-password-form">
          <input
            type="password"
            className="name-input"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            autoFocus
          />
          <button type="submit" className="primary-button">
            Bestätigen
          </button>
        </form>
        {authError && <p className="name-error">{authError}</p>}
      </main>
    );
  }

  if (loadError) {
    return (
      <main>
        <div className="page-header">
          <h1>PAL-Bereich</h1>
        </div>
        <p className="name-error">Fehler beim Laden: {loadError}</p>
      </main>
    );
  }

  if (!students) {
    return (
      <main>
        <div className="page-header">
          <h1>PAL-Bereich</h1>
          <p>Lädt …</p>
        </div>
      </main>
    );
  }

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  if (selectedStudent) {
    return (
      <StudentDetail
        student={selectedStudent}
        categories={categories}
        onBack={() => setSelectedStudentId(null)}
      />
    );
  }

  return (
    <main>
      <Link href="/" className="back-link">
        ← Zurück zum Hauptmenü
      </Link>
      <div className="page-header">
        <h1>PAL-Bereich</h1>
        <p>
          {students.length}{" "}
          {students.length === 1 ? "angemeldeter Schüler" : "angemeldete Schüler"}
        </p>
      </div>
      <div className="student-list">
        {students.length === 0 && <p>Noch keine Schüler angemeldet.</p>}
        {students.map((s) => {
          const progressMap = progressRowsToMap(s.progress);
          return (
            <button
              key={s.id}
              className="student-row"
              onClick={() => setSelectedStudentId(s.id)}
            >
              <div className="student-row-name">{s.name}</div>
              <div className="student-row-categories">
                {categories.map((c) => (
                  <span key={c.slug}>
                    {c.emoji} {Math.round(percentSecure(c.questionIds, progressMap))}%
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </main>
  );
}

function StudentDetail({ student, categories, onBack }) {
  const [lookup, setLookup] = useState(null);

  useEffect(() => {
    // Fragetexte (ohne Lösung) werden erst hier geladen, statt sie über
    // den kompletten Fragenpool ins PAL-Bundle mitzuschleppen.
    fetch("/api/pal/lookup")
      .then((res) => res.json())
      .then((data) => setLookup(data.lookup))
      .catch(() => setLookup({}));
  }, []);

  const progressMap = progressRowsToMap(student.progress);
  const lowLevelEntries = student.progress
    .filter((row) => row.level <= 2)
    .map((row) => ({ ...row, info: lookup?.[row.question_id] }))
    .filter((row) => row.info)
    .sort((a, b) => a.level - b.level);
  const totalPracticed = student.progress.reduce(
    (sum, row) => sum + row.times_correct + row.times_wrong,
    0
  );

  return (
    <main>
      <button type="button" onClick={onBack} className="back-link back-button">
        ← Zurück zur Übersicht
      </button>
      <div className="page-header">
        <h1>{student.name}</h1>
        <p>Insgesamt {totalPracticed}x geübt</p>
      </div>

      <div className="progress-section">
        <h2>Fortschritt (sicher gelernt)</h2>
        <div className="progress-ring-grid">
          {categories.map((c) => (
            <ProgressRing
              key={c.slug}
              percent={percentSecure(c.questionIds, progressMap)}
              label={`${c.emoji} ${c.title}`}
              sublabel={`${Math.round(percentStarted(c.questionIds, progressMap))}% schon geübt`}
            />
          ))}
        </div>
      </div>

      <div className="student-detail-box">
        <h2>Fragen auf niedriger Lernstufe ({lowLevelEntries.length})</h2>
        {lookup === null && <p>Lädt …</p>}
        {lookup !== null && lowLevelEntries.length === 0 && (
          <p>Keine Fragen auf niedriger Stufe – sehr gut!</p>
        )}
        {lowLevelEntries.map((entry) => (
          <div key={entry.question_id} className="low-level-question">
            {entry.info.categoryEmoji} {entry.info.question}
            <span className="level-tag">Stufe {entry.level}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
