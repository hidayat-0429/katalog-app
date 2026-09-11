import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Etira Mushrooms | Pasokan Jamur B2B PT Eka Timur Raya",
  description: "Sistem pemesanan pasokan jamur olahan kaleng & pouch steril, jamur segar panen harian, dan produk pangan beku langsung dari pabrik PT Eka Timur Raya, Pasuruan.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={jakarta.variable} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans bg-white dark:bg-dark-bg text-charcoal dark:text-dark-text antialiased transition-colors duration-200">
        <Providers>
          <Navbar />
          <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            {children}
          </main>

          {/* Clean, Honest Footer */}
          <footer className="border-t border-border dark:border-dark-border bg-bg-subtle dark:bg-dark-bg-subtle mt-auto transition-colors duration-200">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Brand Info */}
                <div>
                  <Link href="/" className="inline-block text-lg font-bold tracking-tight text-charcoal dark:text-dark-text">
                    Etira Mushrooms
                  </Link>
                  <p className="text-xs font-semibold text-sage dark:text-dark-sage mt-0.5">
                    PT Eka Timur Raya — Pasuruan, Jawa Timur
                  </p>
                  <p className="text-xs text-charcoal-muted dark:text-dark-muted mt-2.5 leading-relaxed max-w-sm">
                    Produsen dan pemasok terpercaya jamur kancing segar, olahan kaleng, pouch retort steril, dan produk beku untuk industri kuliner, katering, dan Horeka.
                  </p>
                </div>

                {/* Navigasi */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-dark-muted mb-3">
                    Navigasi Katalog
                  </h4>
                  <div className="flex flex-col gap-2 text-sm">
                    <Link href="/#katalog" className="text-charcoal dark:text-dark-text hover:text-sage dark:hover:text-dark-sage transition-colors">
                      Daftar Komoditas &amp; Kemasan
                    </Link>
                    <Link href="/login" className="text-charcoal dark:text-dark-text hover:text-sage dark:hover:text-dark-sage transition-colors">
                      Masuk ke Portal Pemesan
                    </Link>
                    <Link href="/register" className="text-charcoal dark:text-dark-text hover:text-sage dark:hover:text-dark-sage transition-colors">
                      Pendaftaran Mitra Bisnis
                    </Link>
                  </div>
                </div>

                {/* Layanan & Hubungi Kami */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-muted dark:text-dark-muted mb-3">
                    Kantor &amp; Pabrik Pengolahan
                  </h4>
                  <div className="space-y-1.5 text-xs text-charcoal-muted dark:text-dark-muted">
                    <p className="leading-relaxed">
                      Jl. Raya Nongkojajar KM 1.4 Purwodadi, Pasuruan 67163, Jawa Timur, Indonesia
                    </p>
                    <p className="pt-1">
                      <span className="font-medium text-charcoal dark:text-dark-text">Telp:</span> +62 343 613650
                    </p>
                    <p>
                      <span className="font-medium text-charcoal dark:text-dark-text">WhatsApp:</span> +62 811-3503-650
                    </p>
                    <p>
                      <span className="font-medium text-charcoal dark:text-dark-text">Email:</span> marketing@etiramushrooms.com
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-border dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-charcoal-muted dark:text-dark-muted">
                <p>&copy; {new Date().getFullYear()} PT Eka Timur Raya (Etira Mushrooms). Seluruh hak cipta dilindungi.</p>
                <p>Pasokan langsung pabrik &amp; perkebunan jamur</p>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
