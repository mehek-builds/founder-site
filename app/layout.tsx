import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import "./scenes.css";
import CursorMoon from "../components/CursorMoon";

// Light, high-contrast editorial serif (the creative voice). Airy display cuts.
const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display-loaded",
  display: "swap",
});

// Quiet neutral grotesque — body and every small functional label. Variable
// weight, subset locally so we control spacing and it renders the same on
// every OS (no more system-font drift).
const text = localFont({
  src: [
    {
      path: "./fonts/GeneralSans-Variable.woff2",
      weight: "200 700",
      style: "normal",
    },
    {
      path: "./fonts/GeneralSans-VariableItalic.woff2",
      weight: "200 700",
      style: "italic",
    },
  ],
  variable: "--font-text-loaded",
  display: "swap",
});

const SITE = "https://mehek-site.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Mehek Mandal: building products",
  description:
    "A live record of the work, with receipts.",
  openGraph: {
    title: "Mehek Mandal: building products",
    description:
      "A live record of the work, with receipts.",
    url: SITE,
    siteName: "Mehek Mandal",
    images: ["/og.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mehek Mandal: building products",
    description:
      "A live record of the work, with receipts.",
    creator: "@MehekBuilds",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${text.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Flag JS on immediately so the reduced-motion static twin never flashes. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('js')}}catch(e){}`,
          }}
        />
        <style>{`:root{--font-display:var(--font-display-loaded),"Instrument Serif",Georgia,"Times New Roman",serif;--font-text:var(--font-text-loaded),"General Sans",ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}`}</style>
      </head>
      <body>
        {children}
        <div className="grade" aria-hidden="true" />
        <CursorMoon />
      </body>
    </html>
  );
}
