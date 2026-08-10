"use client";

import { useState } from "react";
import Link from "next/link";
import { useStudent } from "../context/StudentContext";
import { supabase } from "../lib/supabaseClient";

export default function FeedbackForm() {
  const { student } = useStudent();
  const [message, setMessage] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    setError(null);

    const { error: insertError } = await supabase.from("feedback_responses").insert({
      student_id: anonymous ? null : student.id,
      student_name: anonymous ? null : student.name,
      is_anonymous: anonymous,
      message: message.trim(),
    });

    setSubmitting(false);
    if (insertError) {
      setError("Feedback konnte nicht gespeichert werden: " + insertError.message);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <main>
        <div className="page-header">
          <h1>Danke!</h1>
        </div>
        <div className="result-box">
          <p>Dein Feedback wurde gespeichert.</p>
          <Link href="/" className="secondary-button">
            Zurück zum Hauptmenü
          </Link>
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
        <h1>Feedback</h1>
        <p>Sag uns, was du von der App hältst</p>
      </div>

      <form onSubmit={handleSubmit} className="survey-form">
        <textarea
          className="survey-textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={8}
          placeholder="Schreib hier frei, was dir auffällt..."
          autoFocus
        />

        <label className="anonymous-toggle">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
          />
          Anonym abschicken (dein Login-Name wird dann nicht gespeichert)
        </label>

        {error && <p className="name-error">{error}</p>}

        <button type="submit" className="primary-button" disabled={submitting || !message.trim()}>
          {submitting ? "Wird gesendet..." : "Feedback abschicken"}
        </button>
      </form>
    </main>
  );
}
