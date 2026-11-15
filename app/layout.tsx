import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stadtteilbibliothek Nord",
  description: "Verwaltung der Stadtteilbibliothek Nord",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-3">
            <a href="/" className="text-lg font-semibold tracking-tight">
              📚 Stadtteilbibliothek Nord
            </a>
            <nav className="ml-auto flex gap-3 text-sm">
              <a href="/ausleihe" className="rounded px-3 py-1.5 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900">
                Ausleihen
              </a>
              <a href="/rueckgabe" className="rounded px-3 py-1.5 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900">
                Rückgabe
              </a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
