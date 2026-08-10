# NotSan Quiz-Trainer

Eine einfache Web-App, mit der sich Notfallsanitäter-Auszubildende per Multiple-Choice-Quiz
selbst testen können. Aktuell nur mit Platzhalter-Fragen – das Grundgerüst.

## Was ist schon da?

- Startseite mit drei Kacheln: Pharmakologie, Traumatologie, Kardiologie
- Klick auf eine Kachel öffnet ein Quiz mit 2 Platzhalter-Fragen (4 Antworten, eine richtig)
- Nach jeder Antwort: Feedback "Richtig" / "Leider falsch" + kurze Erklärung
- Am Ende: Ergebnis (z. B. "1 von 2 richtig") mit Möglichkeit, nochmal zu starten
- Responsives Design: funktioniert auf Handy und PC

## Schritt 1: Node.js installieren (einmalig)

Node.js ist das Programm, das im Hintergrund läuft, damit du die Web-App auf deinem
Computer starten kannst. Ohne Node.js funktioniert nichts.

1. Gehe auf https://nodejs.org
2. Lade die Version mit der Bezeichnung "LTS" herunter (empfohlen für die meisten Nutzer)
3. Installiere sie wie ein normales Windows-Programm (immer "Weiter" klicken)
4. Danach den Computer bzw. das Terminal einmal neu starten

## Schritt 2: Die App zum ersten Mal starten

Öffne ein Terminal (z. B. PowerShell) in diesem Ordner und führe nacheinander aus:

```
npm install
```

Das lädt alle benötigten Bausteine herunter (dauert beim ersten Mal 1-2 Minuten).
Das musst du nur einmal machen (bzw. wieder, wenn sich die Liste der Bausteine ändert).

```
npm run dev
```

Das startet die App auf deinem Computer. Danach im Browser öffnen:

```
http://localhost:3000
```

Du solltest jetzt die Startseite mit den drei Kacheln sehen. Zum Beenden im Terminal
`Strg + C` drücken.

**Hinweis:** Wenn du Node.js gerade erst installiert hast und `npm` als "nicht gefunden"
gemeldet wird, schließe das Terminal-Fenster einmal komplett und öffne ein neues
(oder starte den Computer neu). Windows übernimmt den neuen Pfad zu Node.js erst in
neu geöffneten Fenstern.

## Schritt 3: Eigene Fragen eintragen

Alle Fragen stehen in einer einzigen Datei: `data/questions.js`

Dort findest du für jede Kategorie ein Objekt mit einer Liste von Fragen. Jede Frage
sieht so aus:

```js
{
  question: "Deine Frage hier?",
  options: ["Antwort A", "Antwort B", "Antwort C", "Antwort D"],
  correctIndex: 1, // 0 = A, 1 = B, 2 = C, 3 = D -> hier ist B richtig
  explanation: "Kurze Erklärung, warum B richtig ist.",
}
```

Du kannst einfach weitere solche Fragen-Blöcke in die Liste kopieren (durch Komma
getrennt) oder die Platzhalter-Texte ersetzen. Speichern reicht – die Seite aktualisiert
sich automatisch, solange `npm run dev` läuft.

Neue Kategorie hinzufügen: einen neuen Eintrag nach dem gleichen Muster wie
`pharmakologie`, `traumatologie`, `kardiologie` in `data/questions.js` ergänzen. Sie
erscheint dann automatisch als neue Kachel auf der Startseite.

## Schritt 4: Später kostenlos im Internet veröffentlichen

Wenn die App fertig ist, kannst du sie kostenlos hosten, z. B. mit Vercel
(die Firma hinter Next.js, dafür gemacht):

1. Lege dein Projekt in ein kostenloses GitHub-Konto (github.com)
2. Gehe auf https://vercel.com, melde dich mit dem GitHub-Konto an
3. Wähle "Neues Projekt importieren" und wähle dein GitHub-Repository aus
4. Vercel erkennt automatisch, dass es eine Next.js-App ist, und veröffentlicht sie
5. Du bekommst eine kostenlose Internet-Adresse (z. B. notsanquiz.vercel.app)

Das machen wir gemeinsam, sobald die App fertig ist – du musst das jetzt noch nicht tun.

## Aufbau der Dateien (kurz erklärt)

- `app/page.js` – die Startseite mit den Kacheln
- `app/quiz/[category]/page.js` – die Quiz-Seite (wird für jede Kategorie wiederverwendet)
- `components/QuizGame.js` – die eigentliche Quiz-Logik (Fragen anzeigen, Antworten prüfen)
- `components/CategoryTile.js` – eine einzelne Kachel auf der Startseite
- `data/questions.js` – hier stehen alle Fragen und Kategorien (das wirst du am meisten bearbeiten)
- `app/globals.css` – das Design (Farben, Größen, responsives Layout)
