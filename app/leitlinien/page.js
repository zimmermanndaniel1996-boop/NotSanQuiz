import Link from "next/link";
import RequireStudent from "../../components/RequireStudent";
import leitlinien from "../../data/leitlinien";

export default function LeitlinienPage() {
  return (
    <RequireStudent>
      <main>
        <Link href="/" className="back-link">
          ← Zurück zum Hauptmenü
        </Link>

        <div className="page-header">
          <h1>Leitlinien</h1>
          <p>Aktuelle Leitlinien zum Nachschlagen</p>
        </div>

        <div className="leitlinien-list">
          {leitlinien.length === 0 && <p>Noch keine Leitlinien hinterlegt.</p>}
          {leitlinien.map((item) => (
            <a
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="leitlinie-card"
            >
              <div className="leitlinie-title">{item.title}</div>
              {item.description && (
                <div className="leitlinie-desc">{item.description}</div>
              )}
              <div className="leitlinie-link-hint">Öffnet in neuem Tab ↗</div>
            </a>
          ))}
        </div>
      </main>
    </RequireStudent>
  );
}
