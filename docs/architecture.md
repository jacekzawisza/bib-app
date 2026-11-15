# Architekturentscheidungen

## Gewählter Stack

| Bereich | Entscheidung | Begründung |
|---|---|---|
| Framework | Next.js 16 | App-Router, TypeScript out of the box |
| Datenbank | SQLite (lokal) | Kein Server nötig, passt zur Bibliotheksgröße |
| ORM | Prisma 7 | Typsicherer Zugriff, Migrationen |
| Adapter | `@prisma/adapter-better-sqlite3` | Notwendig für Prisma 7 mit SQLite |
| Sprache | TypeScript | Typsicherheit im gesamten Stack |

## Ordnerstruktur

```
bib-app/
├── app/                  # Next.js App Router (Seiten und API-Routen)
├── lib/                  # Shared Code (Prisma-Client, Hilfsfunktionen)
├── prisma/
│   ├── schema.prisma     # Datenmodell
│   └── migrations/       # Automatische Migrationen
├── docs/                 # Dokumentation (Backlog, Architektur, Entscheidungen)
├── generated/prisma/     # Generierter Prisma Client (nicht von Hand ändern)
├── prisma.config.ts      # Prisma-7-Konfiguration
└── .env                  # DATABASE_URL
```

## Datenbank

- SQLite-Datei: `prisma/dev.db`
- Verbindung über `PrismaBetterSqlite3`-Adapter
- Migrationen mit `npx prisma migrate dev`

## Nächste Schritte

- Feature F-001: Exemplar ausleihen und zurückgeben
