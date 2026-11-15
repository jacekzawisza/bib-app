# Architektur · Stadtteilbibliothek Nord

## Stack

- **Framework**: Next.js 16 (App Router)
- **Sprache**: TypeScript
- **Datenbank**: SQLite (lokal via Prisma 7 + better-sqlite3)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`)
- **Tests**: Vitest

## Projektstruktur

```
bib-app/
├── app/                    # Next.js App Router (Seiten + Layout)
│   ├── layout.tsx          # Root-Layout mit Navigation und Tailwind-Import
│   ├── page.tsx            # Startseite
│   ├── globals.css         # Tailwind-Import (@import 'tailwindcss')
│   ├── ausleihe/page.tsx   # Exemplar ausleihen (Formular)
│   └── rueckgabe/page.tsx  # Exemplar zurücknehmen (Tabelle)
├── lib/
│   ├── prisma.ts           # Prisma-Client (Singleton)
│   └── actions/
│       └── ausleihe.ts     # Server Actions: ausleihen(), rueckgabe()
├── prisma/
│   ├── schema.prisma       # Datenmodell
│   ├── seed.ts             # Seed-Daten
│   ├── migrations/         # Prisma-Migrationen
│   └── dev.db              # SQLite-Datenbank (lokal)
├── tests/
│   └── ausleihe.test.ts    # Vitest-Tests für F-001
├── generated/prisma/       # Generierter Prisma-Client
├── postcss.config.mjs      # PostCSS mit @tailwindcss/postcss
├── vitest.config.ts        # Vitest-Konfiguration
└── docs/
    ├── architecture.md     # Diese Datei
    ├── backlog.md          # Feature-Backlog
    └── decisions.md        # Architekturentscheidungen
```

## Styling-Konventionen (Tailwind)

- **Layout**: Maximale Breite `max-w-4xl`, horizontal zentriert (`mx-auto`)
- **Karten**: Weiße Box mit abgerundeten Ecken (`rounded-xl border border-gray-200 bg-white p-6`)
- **Formulare**: Einheitliche Select-Felder mit `rounded-lg border border-gray-300 px-3 py-2`
- **Buttons**:
  - Primär: `rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white`
  - Zurücknehmen: `rounded bg-green-600 px-3 py-1.5 text-xs font-medium text-white`
- **Tabellen**: Gerahmt (`rounded-lg border`), Kopfzeile grau (`bg-gray-50`), Zebrastreifen via `divide-y`
- **Navigation**: Top-Header mit `border-b`, Links mit Hover-Effekt
- **Responsive**: Auf der Startseite `grid gap-4 sm:grid-cols-2` für zwei Spalten auf größeren Bildschirmen
