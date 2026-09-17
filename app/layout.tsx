import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Link from "next/link";

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
      <body className="min-h-screen flex flex-col font-sans bg-bg text-charcoal antialiased transition-colors duration-200">
        <Providers>
          <Navbar />
          <main className="flex-1 w-full">
            {children}
          </main>

          {/* Corporate Minimalist Footer */}
          <footer className="border-t border-stone-200 dark:border-stone-800 bg-[#faf9f6] dark:bg-[#141715] text-stone-600 dark:text-stone-400 mt-auto transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                {/* Brand Info */}
                <div className="md:col-span-2">
                  <Link href="/" className="inline-block text-lg font-bold tracking-tight text-[#1f2421] dark:text-stone-100 hover:text-[#1b382b] transition-colors">
                    ETIRA MUSHROOMS
                  </Link>
                  <p className="text-xs font-semibold text-[#1b382b] dark:text-emerald-400 mt-0.5 tracking-wider uppercase">
                    PT Eka Timur Raya &bull; Pasuruan, Jawa Timur
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-3.5 leading-relaxed max-w-md">
                    Produsen dan pemasok terpercaya jamur kancing segar panen harian, olahan kaleng steril, pouch retort, dan produk beku untuk industri kuliner, restoran, katering, dan Horeka di seluruh Indonesia.
                  </p>
                </div>

                {/* Navigasi */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1f2421] dark:text-stone-200 mb-4">
                    Navigasi
                  </h4>
                  <div className="flex flex-col gap-2.5 text-xs sm:text-sm">
                    <Link href="/?katalog=semua" className="text-stone-600 dark:text-stone-400 hover:text-[#1b382b] dark:hover:text-white transition-colors">
                      Katalog Produk
                    </Link>
                    <Link href="/tentang" className="text-stone-600 dark:text-stone-400 hover:text-[#1b382b] dark:hover:text-white transition-colors">
                      Tentang Perusahaan
                    </Link>
                    <Link href="/kontak" className="text-stone-600 dark:text-stone-400 hover:text-[#1b382b] dark:hover:text-white transition-colors">
                      Kontak &amp; Pemesanan
                    </Link>
                    <Link href="/login" className="text-stone-600 dark:text-stone-400 hover:text-[#1b382b] dark:hover:text-white transition-colors">
                      Portal Masuk Mitra
                    </Link>
                  </div>
                </div>

                {/* Layanan & Kontak */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1f2421] dark:text-stone-200 mb-4">
                    Kantor &amp; Fasilitas
                  </h4>
                  <div className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
                    <p className="leading-relaxed">
                      Jl. Raya Nongkojajar KM 1.4 Purwodadi, Pasuruan 67163, Jawa Timur
                    </p>
                    <p className="pt-1">
                      <span className="font-semibold text-stone-800 dark:text-stone-200">WhatsApp:</span> +{process.env.NEXT_PUBLIC_ADMIN_PHONE || "6285816172367"}
                    </p>
                    <p>
                      <span className="font-semibold text-stone-800 dark:text-stone-200">Email:</span> {process.env.NEXT_PUBLIC_COMPANY_EMAIL || "nurhidayat2329@gmail.com"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-stone-200 dark:border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
                <p>&copy; {new Date().getFullYear()} PT Eka Timur Raya (Etira Mushrooms). Seluruh hak cipta dilindungi.</p>
                <p className="text-stone-600 dark:text-stone-400 font-medium">Pasokan Langsung Pabrik &amp; Perkebunan Jamur</p>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
