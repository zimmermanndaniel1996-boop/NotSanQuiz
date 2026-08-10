"use client";

import { useState } from "react";
import { useStudent } from "../context/StudentContext";

export default function RequireStudent({ children }) {
  const { student, loading, login } = useStudent();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return null;
  }

  if (student) {
    return children;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await login(name, password);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
    }
  }

  return (
    <main>
      <div className="page-header">
        <h1>Willkommen</h1>
        <p>Wie heißt du bzw. wie lautet dein Kürzel?</p>
      </div>

      <form onSubmit={handleSubmit} className="name-form">
        <input
          type="text"
          className="name-input"
          placeholder="z. B. MaxM"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          maxLength={40}
        />
        <input
          type="password"
          className="name-input"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          maxLength={60}
        />
        <button type="submit" className="primary-button" disabled={submitting}>
          {submitting ? "Einen Moment..." : "Loslegen"}
        </button>
      </form>

      {error && <p className="name-error">{error}</p>}

      <p className="name-hint">
        Neu hier? Vergib beim ersten Mal einfach ein Passwort für deinen Namen
        – das brauchst du dann bei jedem weiteren Login wieder.
      </p>
    </main>
  );
}
