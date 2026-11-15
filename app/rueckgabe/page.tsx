import { prisma } from "@/lib/prisma";
import { rueckgabe } from "@/lib/actions/ausleihe";

export const dynamic = "force-dynamic";

export default async function RueckgabePage() {
  const aktiveAusleihen = await prisma.ausleihe.findMany({
    where: { zurueckAm: null },
    include: {
      leser: true,
      exemplar: { include: { buch: true } },
    },
    orderBy: { ausgeliehenAm: "desc" },
  });

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Exemplar zurücknehmen</h1>
      {aktiveAusleihen.length === 0 ? (
        <p className="text-gray-500">Keine aktiven Ausleihen.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Exemplar</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Titel</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Leser</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Standort</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Ausgeliehen</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Fällig</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {aktiveAusleihen.map((a) => (
                <tr key={a.id} className="transition hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{a.exemplar.exemplarNr}</td>
                  <td className="px-4 py-3">{a.exemplar.buch.titel}</td>
                  <td className="px-4 py-3">{a.leser.name}</td>
                  <td className="px-4 py-3 text-gray-500">{a.exemplar.standort}</td>
                  <td className="px-4 py-3 text-gray-500">{a.ausgeliehenAm.toLocaleDateString("de-DE")}</td>
                  <td className="px-4 py-3 text-gray-500">{a.faelligAm.toLocaleDateString("de-DE")}</td>
                  <td className="px-4 py-3">
                    <form action={rueckgabe}>
                      <input type="hidden" name="ausleiheId" value={a.id} />
                      <button
                        type="submit"
                        className="rounded bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-green-700"
                      >
                        Zurücknehmen
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
