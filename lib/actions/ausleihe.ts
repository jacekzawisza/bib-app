"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function ausleihen(formData: FormData) {
  const leserId = Number(formData.get("leserId"));
  const exemplarId = Number(formData.get("exemplarId"));

  if (!leserId || !exemplarId) {
    throw new Error("Leser und Exemplar müssen angegeben werden.");
  }

  // Exemplar mit Buch laden
  const exemplar = await prisma.exemplar.findUnique({
    where: { id: exemplarId },
    include: { buch: true },
  });

  if (!exemplar) {
    throw new Error("Exemplar nicht gefunden.");
  }

  if (exemplar.status !== "verfuegbar") {
    throw new Error("Exemplar ist nicht verfügbar.");
  }

  // BR3: Max 10 aktive Ausleihen pro Leser
  const aktiveAusleihen = await prisma.ausleihe.count({
    where: { leserId, zurueckAm: null },
  });

  if (aktiveAusleihen >= 10) {
    throw new Error("Dieser Leser hat bereits 10 Exemplare ausgeliehen (Maximalgrenze).");
  }

  // BR1: Leihfrist 21 Tage für Bücher, 7 Tage für Spiele
  const leihfristTage = exemplar.medientyp === "Spiel" ? 7 : 21;
  const jetzt = new Date();
  const faellig = new Date(jetzt);
  faellig.setDate(faellig.getDate() + leihfristTage);

  await prisma.ausleihe.create({
    data: {
      leserId,
      exemplarId,
      ausgeliehenAm: jetzt,
      faelligAm: faellig,
    },
  });

  await prisma.exemplar.update({
    where: { id: exemplarId },
    data: { status: "verliehen" },
  });

  revalidatePath("/");
  revalidatePath("/ausleihe");
  redirect("/");
}

export async function rueckgabe(formData: FormData) {
  const ausleiheId = Number(formData.get("ausleiheId"));

  if (!ausleiheId) {
    throw new Error("Ausleihe-ID muss angegeben werden.");
  }

  const ausleihe = await prisma.ausleihe.findUnique({
    where: { id: ausleiheId },
    include: { exemplar: true },
  });

  if (!ausleihe) {
    throw new Error("Ausleihe nicht gefunden.");
  }

  if (ausleihe.zurueckAm) {
    throw new Error("Dieses Exemplar wurde bereits zurückgegeben.");
  }

  await prisma.ausleihe.update({
    where: { id: ausleiheId },
    data: { zurueckAm: new Date() },
  });

  await prisma.exemplar.update({
    where: { id: ausleihe.exemplarId },
    data: { status: "verfuegbar" },
  });

  revalidatePath("/");
  revalidatePath("/rueckgabe");
  redirect("/");
}
