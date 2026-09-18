import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://etiramushrooms.com"),
  title: "Etira Mushrooms | Pasokan Jamur B2B PT Eka Timur Raya",
  description: "Sistem pemesanan pasokan jamur olahan kaleng & pouch steril, jamur segar panen harian, dan produk pangan beku langsung dari pabrik PT Eka Timur Raya, Pasuruan.",
  keywords: [
    "jamur kancing", "supplier jamur", "jamur kaleng", "jamur pouch steril",
    "etira mushrooms", "eka timur raya", "pabrik jamur pasuruan", "B2B jamur"
  ],
  openGraph: {
    title: "Etira Mushrooms | Pasokan Jamur B2B",
    description: "Pemesanan pasokan jamur olahan kaleng & pouch steril, langsung dari pabrik PT Eka Timur Raya.",
    type: "website",
    locale: "id_ID",
    siteName: "Etira Mushrooms",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Etira Mushrooms - Pasokan Jamur B2B",
      },
    ],
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${bricolage.variable} ${figtree.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen font-sans bg-bg text-charcoal antialiased transition-colors duration-200">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
