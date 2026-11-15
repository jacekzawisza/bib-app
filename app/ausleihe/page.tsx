import { prisma } from "@/lib/prisma";
import { ausleihen } from "@/lib/actions/ausleihe";

export const dynamic = "force-dynamic";

export default async function AusleihePage() {
  const leser = await prisma.leser.findMany({ orderBy: { name: "asc" } });
  const exemplare = await prisma.exemplar.findMany({
    where: { status: "verfuegbar" },
    include: { buch: true },
    orderBy: { exemplarNr: "asc" },
  });

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Exemplar ausleihen</h1>
      <form action={ausleihen} className="space-y-5">
        <div>
          <label htmlFor="leserId" className="mb-1 block text-sm font-medium text-gray-700">
            Leser
          </label>
          <select
            id="leserId"
            name="leserId"
            required
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Bitte wählen</option>
            {leser.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} ({l.leserNr})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="exemplarId" className="mb-1 block text-sm font-medium text-gray-700">
            Exemplar
          </label>
          <select
            id="exemplarId"
            name="exemplarId"
            required
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Bitte wählen</option>
            {exemplare.map((e) => (
              <option key={e.id} value={e.id}>
                {e.exemplarNr} – {e.buch.titel} ({e.medientyp}) – {e.standort}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Ausleihen
        </button>
      </form>
    </div>
  );
}
