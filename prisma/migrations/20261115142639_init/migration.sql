-- CreateTable
CREATE TABLE "Buch" (
    "isbn" TEXT NOT NULL PRIMARY KEY,
    "titel" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "erscheinungsjahr" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "exemplar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "exemplar_nr" TEXT NOT NULL,
    "medientyp" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "buch_isbn" TEXT NOT NULL,
    CONSTRAINT "exemplar_buch_isbn_fkey" FOREIGN KEY ("buch_isbn") REFERENCES "Buch" ("isbn") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "leser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "leser_nr" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "geburtsdatum" DATETIME NOT NULL,
    "ausweis_gueltig_bis" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ausleihe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "leser_id" INTEGER NOT NULL,
    "exemplar_id" INTEGER NOT NULL,
    "ausgeliehen_am" DATETIME NOT NULL,
    "faellig_am" DATETIME NOT NULL,
    "zurueck_am" DATETIME,
    CONSTRAINT "ausleihe_leser_id_fkey" FOREIGN KEY ("leser_id") REFERENCES "leser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ausleihe_exemplar_id_fkey" FOREIGN KEY ("exemplar_id") REFERENCES "exemplar" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "gebuehr" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ausleihe_id" INTEGER NOT NULL,
    "betrag" REAL NOT NULL,
    "bezahlt" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "gebuehr_ausleihe_id_fkey" FOREIGN KEY ("ausleihe_id") REFERENCES "ausleihe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "vormerkung" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "leser_id" INTEGER NOT NULL,
    "buch_isbn" TEXT NOT NULL,
    "vorgemerkt_am" DATETIME NOT NULL,
    CONSTRAINT "vormerkung_leser_id_fkey" FOREIGN KEY ("leser_id") REFERENCES "leser" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "vormerkung_buch_isbn_fkey" FOREIGN KEY ("buch_isbn") REFERENCES "Buch" ("isbn") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Mitarbeiter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "rolle" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "leser_leser_nr_key" ON "leser"("leser_nr");

-- CreateIndex
CREATE UNIQUE INDEX "gebuehr_ausleihe_id_key" ON "gebuehr"("ausleihe_id");
