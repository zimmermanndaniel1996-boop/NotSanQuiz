"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useStudent } from "../context/StudentContext";
import { getProgressForStudent } from "../lib/progressApi";
import { percentSecure, percentStarted } from "../lib/progressStats";
import { getCategoryColor } from "../lib/categoryColors";
import ProgressRing from "./ProgressRing";
import SinusRhythmStrip from "./SinusRhythmStrip";
import BrainLeaderboard from "./BrainLeaderboard";

export default function HomeContent({ categories }) {
  const { student, logout } = useStudent();
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getProgressForStudent(student.id)
      .then((map) => {
        if (!cancelled) setProgress(map);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [student.id]);

  return (
    <main>
      <div className="account-bar">
        Angemeldet als <strong>{student.name}</strong>
        <button type="button" className="logout-link" onClick={logout}>
          Abmelden
        </button>
      </div>

      <div className="page-header">
        <h1>Notsan Quiz</h1>
        <p>Prüfe deinen Wissensstand</p>
        <div className="rhythm-strip-wrap">
          <SinusRhythmStrip />
        </div>
      </div>

      <div className="mode-primary-grid">
        <Link href="/quiz/schnell" className="mode-tile-primary">
          <span className="emoji">⚡</span>
          <span className="mode-title">Schnellquiz</span>
          <span className="mode-desc">20 gemischte Fragen aus allen Fachbereichen</span>
        </Link>

        <Link href="/brain" className="mode-tile-primary">
          <span className="emoji">👑</span>
          <span className="mode-title">The Brain</span>
          <span className="mode-desc">30 Fragen, Punkte für Tempo &amp; Richtigkeit</span>
        </Link>
      </div>

      <BrainLeaderboard />

      <div className="mode-grid">
        <Link href="/fachbereiche" className="mode-tile">
          <span className="emoji">📚</span>
          <span className="mode-title">Fachbereichs-Quiz</span>
          <span className="mode-desc">Fragen aus einem gewählten Fachbereich</span>
        </Link>

        <Link href="/leitlinien" className="mode-tile">
          <span className="emoji">📋</span>
          <span className="mode-title">Leitlinien</span>
          <span className="mode-desc">Aktuelle Leitlinien nachschlagen</span>
        </Link>

        <Link href="/feedback" className="mode-tile">
          <span className="emoji">💬</span>
          <span className="mode-title">Feedback</span>
          <span className="mode-desc">Sag uns, was du von der App hältst</span>
        </Link>
      </div>

      <div className="progress-section">
        <h2>Dein Fortschritt (sicher gelernt)</h2>
        {error && <p className="name-error">{error}</p>}
        <div className="progress-ring-grid">
          {categories.map((category) => {
            const percent =
              progress === null ? 0 : percentSecure(category.questionIds, progress);
            const started =
              progress === null ? 0 : percentStarted(category.questionIds, progress);
            return (
              <ProgressRing
                key={category.slug}
                percent={percent}
                color={getCategoryColor(category.slug)}
                label={`${category.emoji} ${category.title}`}
                sublabel={`${Math.round(started)}% schon geübt`}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}
