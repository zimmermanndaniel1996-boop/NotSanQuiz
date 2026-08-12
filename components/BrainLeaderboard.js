"use client";

import { useEffect, useState } from "react";

export default function BrainLeaderboard() {
  const [entries, setEntries] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/brain/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setEntries(data.leaderboard);
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="brain-leaderboard">
      <h3>Bestenliste diese Woche</h3>
      {error && <p className="name-error">{error}</p>}
      {!error && entries === null && <p className="pal-tab-hint">Lädt …</p>}
      {entries && entries.length === 0 && (
        <p className="pal-tab-hint">Noch keine Punkte diese Woche – sei die/der Erste!</p>
      )}
      {entries && entries.length > 0 && (
        <ol className="brain-leaderboard-list">
          {entries.map((entry, index) => (
            <li key={index} className="brain-leaderboard-row">
              <span className="brain-leaderboard-rank">{index + 1}.</span>
              <span className="brain-leaderboard-name">
                {entry.name}
                {index === 0 && (
                  <span className="brain-crown" aria-hidden="true">
                    👑
                  </span>
                )}
              </span>
              <span className="brain-leaderboard-score">{entry.score}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
