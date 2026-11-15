export default function Home() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h1 className="text-2xl font-bold tracking-tight">Stadtteilbibliothek Nord</h1>
        <p className="mt-1 text-gray-600">Willkommen im Verwaltungssystem.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <a
          href="/ausleihe"
          className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
        >
          <span className="text-lg font-semibold">Exemplar ausleihen</span>
          <p className="mt-1 text-sm text-gray-500">Ein Exemplar an einen Leser ausleihen</p>
        </a>
        <a
          href="/rueckgabe"
          className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
        >
          <span className="text-lg font-semibold">Exemplar zurücknehmen</span>
          <p className="mt-1 text-sm text-gray-500">Ein ausgeliehenes Exemplar zurückbuchen</p>
        </a>
      </div>
    </div>
  );
}
