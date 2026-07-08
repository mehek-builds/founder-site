import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mehek Mandal (mehek-builds)",
  description:
    "Founder. I ship a product a week and write about it. Ventures, inventions, leadership, and content, all on one graph.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
