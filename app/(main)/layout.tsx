import AppSidebar from "@/components/AppSidebar";
import Link from "next/link";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Fixed Sidebar */}
      <AppSidebar />

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[260px]">
        <main className="flex-1 w-full">
          {/* Mobile top spacer so content doesn't hide behind hamburger */}
          <div className="lg:hidden h-14" />
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-stone-200 dark:border-stone-800 bg-[#faf9f6] dark:bg-[#141715] text-stone-600 dark:text-stone-400 transition-colors duration-200">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12 sm:py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Brand Info */}
              <div className="md:col-span-1">
                <Link href="/" className="inline-block text-base font-bold tracking-tight text-[#1f2421] dark:text-stone-100 hover:text-[#1b382b] transition-colors">
                  ETIRA MUSHROOMS
                </Link>
                <p className="text-[10px] font-semibold text-[#1b382b] dark:text-emerald-400 mt-0.5 tracking-wider uppercase">
                  PT Eka Timur Raya · Pasuruan
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-3 leading-relaxed">
                  Produsen dan pemasok terpercaya jamur kancing segar, olahan kaleng steril, pouch retort, dan produk beku untuk industri kuliner dan Horeka di seluruh Indonesia.
                </p>
              </div>

              {/* Navigasi */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1f2421] dark:text-stone-200 mb-4">
                  Navigasi
                </h4>
                <div className="flex flex-col gap-2.5 text-xs sm:text-sm">
                  <Link href="/?katalog=semua" className="text-stone-600 dark:text-stone-400 hover:text-[#1b382b] dark:hover:text-white transition-colors">Katalog Produk</Link>
                  <Link href="/tentang" className="text-stone-600 dark:text-stone-400 hover:text-[#1b382b] dark:hover:text-white transition-colors">Tentang Perusahaan</Link>
                  <Link href="/kontak" className="text-stone-600 dark:text-stone-400 hover:text-[#1b382b] dark:hover:text-white transition-colors">Kontak & Pemesanan</Link>
                  <Link href="/login" className="text-stone-600 dark:text-stone-400 hover:text-[#1b382b] dark:hover:text-white transition-colors">Portal Masuk Mitra</Link>
                </div>
              </div>

              {/* Kantor */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1f2421] dark:text-stone-200 mb-4">
                  Kantor & Fasilitas
                </h4>
                <div className="space-y-2 text-xs text-stone-600 dark:text-stone-400">
                  <p className="leading-relaxed">
                    Jl. Raya Nongkojajar KM 1.4 Purwodadi, Pasuruan 67163, Jawa Timur
                  </p>
                  <p className="pt-1">
                    <span className="font-semibold text-stone-800 dark:text-stone-200">WhatsApp:</span> +{process.env.NEXT_PUBLIC_ADMIN_PHONE || "6285816172367"}
                  </p>
                  <p>
                    <span className="font-semibold text-stone-800 dark:text-stone-200">Email:</span> {process.env.NEXT_PUBLIC_COMPANY_EMAIL || "etira@gmail.com"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-stone-200 dark:border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
              <p>&copy; {new Date().getFullYear()} PT Eka Timur Raya (Etira Mushrooms). Seluruh hak cipta dilindungi.</p>
              <p className="text-stone-600 dark:text-stone-400 font-medium">Pasokan Langsung Pabrik & Perkebunan Jamur</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
