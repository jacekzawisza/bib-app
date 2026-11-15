# Entscheidungen

## 2026-11-15 – F-001 Exemplar ausleihen und zurückgeben

- **Actions**: Server Actions (`lib/actions/ausleihe.ts`) mit `"use server"` – Formular-Action per `<form action>`
- **Leihfrist**: Wird serverseitig in der Action berechnet (21 Tage Buch, 7 Tage Spiel)
- **Max-Ausleihen-Prüfung**: Zählt aktive Ausleihen (`zurueckAm: null`) vor dem Anlegen
- **Tests**: Vitest mit eigener Test-Datenbank (`prisma/test.db`), Schema via `prisma db push`
- **Seed**: Eigenständiges Skript (`prisma/seed.ts`) mit tsx ausführbar

## 2026-11-15 – Standort an Exemplar

- **Feld**: `standort` (String) am Exemplar, benennt das Regal (z. B. "Regal A1")
- **SPEC.md**: Entität Exemplar um Attribut `standort` ergänzt
- **Migration**: `prisma migrate dev` mit Default-Wert "Regal A1" für bestehende Zeilen
- **UI**: Standort wird in der Ausleihe- und Rückgabe-Liste angezeigt

## 2026-11-15 – Tailwind CSS & Layout

- **Styling**: Tailwind CSS v4 mit `@tailwindcss/postcss` – laut Next.js-Doku der Standard-Weg
- **PostCSS-Konfiguration**: `postcss.config.mjs` mit `@tailwindcss/postcss`-Plugin
- **Globals**: `app/globals.css` mit `@import 'tailwindcss'`, importiert im Root-Layout
- **Layout**: Einheitlicher Header mit Navigation, max-width 4xl, hellem Hintergrund (`bg-gray-50`)
- **Architektur-Doku**: `docs/architecture.md` mit Projektstruktur und Styling-Konventionen

## 2026-11-15 – Tests auf Server Actions umgestellt

- **Problem**: Ursprüngliche Tests testeten Prisma-Direktzugriffe, nicht die echten Server Actions
- **Lösung**: `DATABASE_URL` wird in Tests per `process.env` gesetzt; `lib/prisma.ts` greift auf diese Umgebungsvariable zurück
- **Mocking**: `next/cache` (revalidatePath) und `next/navigation` (redirect) werden in Tests gemockt
- **Abdeckung**: 10 Tests – 6 für Business Rules (BR1, BR3) plus 4 Fehlerfälle (leere Felder, nicht verfügbar, doppelte Rückgabe)
