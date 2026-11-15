import { PrismaClient } from "../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Bestehende Daten löschen (Reihenfolge wegen Fremdschlüssel)
  await prisma.gebuehr.deleteMany();
  await prisma.vormerkung.deleteMany();
  await prisma.ausleihe.deleteMany();
  await prisma.exemplar.deleteMany();
  await prisma.buch.deleteMany();
  await prisma.leser.deleteMany();

  // Bücher
  const buch1 = await prisma.buch.create({
    data: {
      isbn: "978-3-16-148410-0",
      titel: "Der Herr der Ringe",
      autor: "J.R.R. Tolkien",
      erscheinungsjahr: 1954,
    },
  });

  const buch2 = await prisma.buch.create({
    data: {
      isbn: "978-0-14-028333-4",
      titel: "1984",
      autor: "George Orwell",
      erscheinungsjahr: 1949,
    },
  });

  const buch3 = await prisma.buch.create({
    data: {
      isbn: "978-3-551-75000-6",
      titel: "Die Siedler von Catan",
      autor: "Klaus Teuber",
      erscheinungsjahr: 1995,
    },
  });

  // Exemplare mit Standort
  await prisma.exemplar.createMany({
    data: [
      { exemplarNr: "B-001", standort: "Regal A1", medientyp: "Buch", status: "verfuegbar", buchIsbn: buch1.isbn },
      { exemplarNr: "B-002", standort: "Regal A1", medientyp: "Buch", status: "verfuegbar", buchIsbn: buch1.isbn },
      { exemplarNr: "B-003", standort: "Regal A2", medientyp: "Buch", status: "verfuegbar", buchIsbn: buch2.isbn },
      { exemplarNr: "S-001", standort: "Regal S1", medientyp: "Spiel", status: "verfuegbar", buchIsbn: buch3.isbn },
      { exemplarNr: "S-002", standort: "Regal S1", medientyp: "Spiel", status: "verfuegbar", buchIsbn: buch3.isbn },
    ],
  });

  // Leser
  await prisma.leser.createMany({
    data: [
      { leserNr: "L-001", name: "Anna Müller", geburtsdatum: new Date("1990-05-12"), ausweisGueltigBis: new Date("2027-12-31") },
      { leserNr: "L-002", name: "Ben Schmidt", geburtsdatum: new Date("2015-08-20"), ausweisGueltigBis: new Date("2026-06-30") },
    ],
  });

  console.log("Seed-Daten angelegt.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
