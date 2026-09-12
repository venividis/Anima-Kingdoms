import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anima Kingdoms",
  description: "An inhabited creative world: connect music, architecture, companions and settlement life.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
