import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import path from "path";

// DATABASE_URL setzen, BEVOR die Actions importiert werden
const TEST_DB_PATH = path.join(__dirname, "..", "prisma", "test.db");
process.env.DATABASE_URL = `file:${TEST_DB_PATH}`;

import { PrismaClient } from "../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// Next.js-Mocks
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const redirectMock = vi.fn();
vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    redirectMock(url);
    throw new Error("NEXT_REDIRECT");
  },
}));

function createPrisma() {
  const adapter = new PrismaBetterSqlite3({ url: TEST_DB_PATH });
  return new PrismaClient({ adapter });
}

function formDataFromObj(obj: Record<string, string | number>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(obj)) {
    fd.set(key, String(value));
  }
  return fd;
}

describe("F-001: Exemplar ausleihen und zurückgeben", () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = createPrisma();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.gebuehr.deleteMany();
    await prisma.ausleihe.deleteMany();
    await prisma.vormerkung.deleteMany();
    await prisma.exemplar.deleteMany();
    await prisma.buch.deleteMany();
    await prisma.leser.deleteMany();
    vi.clearAllMocks();
  });

  async function setupBuch(isbn: string, titel: string, medientyp: "Buch" | "Spiel") {
    const buch = await prisma.buch.create({
      data: { isbn, titel, autor: "Test Autor", erscheinungsjahr: 2020 },
    });
    const exemplar = await prisma.exemplar.create({
      data: {
        exemplarNr: `T-${isbn}-1`,
        standort: "Regal Test",
        medientyp,
        status: "verfuegbar",
        buchIsbn: buch.isbn,
      },
    });
    return { buch, exemplar };
  }

  async function setupLeser(leserNr: string) {
    return prisma.leser.create({
      data: {
        leserNr,
        name: "Test Leser",
        geburtsdatum: new Date("1990-01-01"),
        ausweisGueltigBis: new Date("2030-12-31"),
      },
    });
  }

  // ---------- BR1: Leihfrist ----------

  describe("BR1: Leihfrist", () => {
    it("sollte bei einem Buch 21 Tage Leihfrist setzen", async () => {
      const { ausleihen } = await import("@/lib/actions/ausleihe");
      const leser = await setupLeser("L-BR1-B");
      const { exemplar } = await setupBuch("978-br1-buch", "Test Buch", "Buch");

      await expect(
        ausleihen(formDataFromObj({ leserId: leser.id, exemplarId: exemplar.id }))
      ).rejects.toThrow("NEXT_REDIRECT");

      const ausleihe = await prisma.ausleihe.findFirst({
        where: { leserId: leser.id, exemplarId: exemplar.id },
      });
      expect(ausleihe).not.toBeNull();

      const diffMs = ausleihe!.faelligAm.getTime() - ausleihe!.ausgeliehenAm.getTime();
      const diffTage = diffMs / (1000 * 60 * 60 * 24);
      expect(diffTage).toBeGreaterThanOrEqual(20);
      expect(diffTage).toBeLessThanOrEqual(22);
    });

    it("sollte bei einem Spiel 7 Tage Leihfrist setzen", async () => {
      const { ausleihen } = await import("@/lib/actions/ausleihe");
      const leser = await setupLeser("L-BR1-S");
      const { exemplar } = await setupBuch("978-br1-spiel", "Test Spiel", "Spiel");

      await expect(
        ausleihen(formDataFromObj({ leserId: leser.id, exemplarId: exemplar.id }))
      ).rejects.toThrow("NEXT_REDIRECT");

      const ausleihe = await prisma.ausleihe.findFirst({
        where: { leserId: leser.id, exemplarId: exemplar.id },
      });
      expect(ausleihe).not.toBeNull();

      const diffMs = ausleihe!.faelligAm.getTime() - ausleihe!.ausgeliehenAm.getTime();
      const diffTage = diffMs / (1000 * 60 * 60 * 24);
      expect(diffTage).toBeGreaterThanOrEqual(6);
      expect(diffTage).toBeLessThanOrEqual(8);
    });
  });

  // ---------- BR3: Max 10 Ausleihen ----------

  describe("BR3: Maximal 10 aktive Ausleihen", () => {
    it("sollte 10 aktive Ausleihen erlauben", async () => {
      const { ausleihen } = await import("@/lib/actions/ausleihe");
      const leser = await setupLeser("L-BR3-10");

      for (let i = 0; i < 10; i++) {
        const { exemplar } = await setupBuch(`978-br3-ok-${i}`, `Buch ${i}`, "Buch");
        await expect(
          ausleihen(formDataFromObj({ leserId: leser.id, exemplarId: exemplar.id }))
        ).rejects.toThrow("NEXT_REDIRECT");
      }

      const aktive = await prisma.ausleihe.count({
        where: { leserId: leser.id, zurueckAm: null },
      });
      expect(aktive).toBe(10);
    });

    it("sollte die 11. Ausleihe mit Fehler ablehnen", async () => {
      const { ausleihen } = await import("@/lib/actions/ausleihe");
      const leser = await setupLeser("L-BR3-11");

      for (let i = 0; i < 10; i++) {
        const { exemplar } = await setupBuch(`978-br3-no-${i}`, `Buch ${i}`, "Buch");
        await expect(
          ausleihen(formDataFromObj({ leserId: leser.id, exemplarId: exemplar.id }))
        ).rejects.toThrow("NEXT_REDIRECT");
      }

      const { exemplar } = await setupBuch("978-br3-11", "Buch 11", "Buch");
      await expect(
        ausleihen(formDataFromObj({ leserId: leser.id, exemplarId: exemplar.id }))
      ).rejects.toThrow("Dieser Leser hat bereits 10 Exemplare ausgeliehen (Maximalgrenze).");
    });
  });

  // ---------- Exemplar-Status ----------

  describe("Exemplar-Status", () => {
    it("sollte Exemplar nach Ausleihe auf 'verliehen' setzen", async () => {
      const { ausleihen } = await import("@/lib/actions/ausleihe");
      const leser = await setupLeser("L-STAT1");
      const { exemplar } = await setupBuch("978-status-1", "Test Status", "Buch");

      await expect(
        ausleihen(formDataFromObj({ leserId: leser.id, exemplarId: exemplar.id }))
      ).rejects.toThrow("NEXT_REDIRECT");

      const aktualisiert = await prisma.exemplar.findUnique({ where: { id: exemplar.id } });
      expect(aktualisiert?.status).toBe("verliehen");
    });

    it("sollte Exemplar nach Rückgabe wieder auf 'verfuegbar' setzen", async () => {
      const { ausleihen, rueckgabe } = await import("@/lib/actions/ausleihe");
      const leser = await setupLeser("L-STAT2");
      const { exemplar } = await setupBuch("978-status-2", "Test Rückgabe", "Buch");

      await expect(
        ausleihen(formDataFromObj({ leserId: leser.id, exemplarId: exemplar.id }))
      ).rejects.toThrow("NEXT_REDIRECT");

      const ausleihe = await prisma.ausleihe.findFirst({
        where: { leserId: leser.id, exemplarId: exemplar.id },
      });

      await expect(
        rueckgabe(formDataFromObj({ ausleiheId: ausleihe!.id }))
      ).rejects.toThrow("NEXT_REDIRECT");

      const aktualisiert = await prisma.exemplar.findUnique({ where: { id: exemplar.id } });
      expect(aktualisiert?.status).toBe("verfuegbar");
    });
  });

  // ---------- Fehlerfälle ----------

  describe("Fehlerfälle", () => {
    it("sollte Fehler werfen, wenn Leser oder Exemplar fehlen", async () => {
      const { ausleihen } = await import("@/lib/actions/ausleihe");
      await expect(ausleihen(new FormData())).rejects.toThrow(
        "Leser und Exemplar müssen angegeben werden."
      );
    });

    it("sollte Fehler werfen, wenn Exemplar nicht verfügbar ist", async () => {
      const { ausleihen } = await import("@/lib/actions/ausleihe");
      const leser = await setupLeser("L-ERR1");
      const { exemplar } = await setupBuch("978-err-1", "Test Fehler", "Buch");

      await prisma.exemplar.update({
        where: { id: exemplar.id },
        data: { status: "verliehen" },
      });

      await expect(
        ausleihen(formDataFromObj({ leserId: leser.id, exemplarId: exemplar.id }))
      ).rejects.toThrow("Exemplar ist nicht verfügbar.");
    });

    it("sollte Fehler werfen, wenn Ausleihe-ID bei Rückgabe fehlt", async () => {
      const { rueckgabe } = await import("@/lib/actions/ausleihe");
      await expect(rueckgabe(new FormData())).rejects.toThrow(
        "Ausleihe-ID muss angegeben werden."
      );
    });

    it("sollte Fehler werfen bei Rückgabe einer bereits zurückgegebenen Ausleihe", async () => {
      const { ausleihen, rueckgabe } = await import("@/lib/actions/ausleihe");
      const leser = await setupLeser("L-ERR2");
      const { exemplar } = await setupBuch("978-err-2", "Test Doppel", "Buch");

      await expect(
        ausleihen(formDataFromObj({ leserId: leser.id, exemplarId: exemplar.id }))
      ).rejects.toThrow("NEXT_REDIRECT");

      const ausleihe = await prisma.ausleihe.findFirst({
        where: { leserId: leser.id, exemplarId: exemplar.id },
      });

      await expect(
        rueckgabe(formDataFromObj({ ausleiheId: ausleihe!.id }))
      ).rejects.toThrow("NEXT_REDIRECT");

      await expect(
        rueckgabe(formDataFromObj({ ausleiheId: ausleihe!.id }))
      ).rejects.toThrow("Dieses Exemplar wurde bereits zurückgegeben.");
    });
  });
});
