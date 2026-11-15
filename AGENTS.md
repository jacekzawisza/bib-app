# AGENTS.md

Briefing für den Coding-Agenten. Lies diese Datei zu Beginn jeder Session, danach `SPEC.md` und `docs/backlog.md`.

## Projekt

Stadtteilbibliothek Nord – Verwaltung von Büchern, Exemplaren, Lesern, Ausleihen, Gebühren und Vormerkungen. Fachliche Grundlage ist `SPEC.md` im Repo-Root. Ändere die SPEC.md nie ohne Rückfrage.

## Stack

- Framework: Next.js
- Datenbank: SQLite über Prisma 7 (lokale Datei, kein Server). Installieren mit `npm install prisma@7 @prisma/client@7`, keine Vorabversion.
- Start: `npm run dev`, danach http://localhost:3000

## Arbeitsweise

- Ein Feature pro Session, Feature-IDs aus `docs/backlog.md` (z. B. F-001).
- Erst einen Plan zeigen, dann bauen, wenn ich zustimme.
- Starte die App selbst und prüfe, dass sie läuft. Lies Fehler im Terminal und behebe sie.
- Schreib für jede Business Rule aus der SPEC.md mindestens einen Test.
- Änderungen am Datenmodell immer als Prisma-Migration (`npx prisma migrate dev`), nie die Datenbankdatei von Hand ändern.
- Erkläre mir in zwei Sätzen, was du geändert hast, auf Deutsch und ohne Fachjargon.

## Backlog (`docs/backlog.md`)

- Ein Feature ist ein Ablauf, den eine Person in der App von Anfang bis Ende durchspielen kann, z. B. „Exemplar ausleihen und zurückgeben“. Datenmodell, Oberfläche, Regeln und Tests gehören in dieses Feature.
- **Keine eigenen Features** für Datenmodell, einzelne Entitäten oder Felder, Rollen und Rechte, Layout, Design oder Projekt-Setup. Das entsteht beim ersten Feature, das es braucht.
- Insgesamt **8 bis 15 Features**, davon **Phase 1 höchstens 5**. Werden es mehr, fass zusammen und frag mich, bevor du neue Features anlegst.
- Jedes Feature nennt die Business Rules (BR) und Entitäten aus der SPEC.md, die es abdeckt.
- Format: Tabelle mit ID (F-001 …), Name, Phase, Status (offen, in Arbeit, fertig), BR/Entitäten.

## Kurzbefehle

- **„Doku“**: Trag Entscheidungen in `docs/decisions.md` ein (Datum, was, warum) und aktualisiere den Status in `docs/backlog.md`.
- **„commit“**: `git add -A`, Commit mit Feature-ID in der Nachricht (z. B. `feat: F-001 Exemplar anlegen`), dann `git push`.

## Nicht tun

- Keine Matrikelnummern oder echten Personendaten ins Repo.
- Keine API-Keys in Dateien schreiben.
- Nicht mehrere Features auf einmal bauen.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
