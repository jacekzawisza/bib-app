import type { Metadata } from "next";

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
      <body>{children}</body>
    </html>
  );
}
