"use client";

import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "notsanquiz_student";

const StudentContext = createContext(null);

export function StudentProvider({ children }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setStudent(JSON.parse(stored));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  // Meldet einen Schüler an: die eigentliche Prüfung (Name + Passwort,
  // ggf. neuen Account anlegen) läuft serverseitig über /api/login, damit
  // der Passwort-Hash nie an den Browser geht (siehe app/api/login/route.js).
  async function login(name, password) {
    const trimmedName = name.trim();
    if (!trimmedName) return { error: "Bitte gib einen Namen oder ein Kürzel ein." };

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmedName, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { error: data.error || "Anmeldung fehlgeschlagen." };
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data.student));
    setStudent(data.student);
    return { error: null };
  }

  function logout() {
    window.localStorage.removeItem(STORAGE_KEY);
    setStudent(null);
  }

  return (
    <StudentContext.Provider value={{ student, loading, login, logout }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error("useStudent muss innerhalb von StudentProvider verwendet werden");
  return ctx;
}
