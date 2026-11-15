/*
  Warnings:

  - Added the required column `standort` to the `exemplar` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_exemplar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "exemplar_nr" TEXT NOT NULL,
    "standort" TEXT NOT NULL DEFAULT 'Regal A1',
    "medientyp" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "buch_isbn" TEXT NOT NULL,
    CONSTRAINT "exemplar_buch_isbn_fkey" FOREIGN KEY ("buch_isbn") REFERENCES "Buch" ("isbn") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_exemplar" ("buch_isbn", "exemplar_nr", "id", "medientyp", "status") SELECT "buch_isbn", "exemplar_nr", "id", "medientyp", "status" FROM "exemplar";
DROP TABLE "exemplar";
ALTER TABLE "new_exemplar" RENAME TO "exemplar";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
