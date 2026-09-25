import AppSidebar from "@/components/AppSidebar";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Container from "@/components/Container";
import Link from "next/link";
import { Suspense } from "react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex min-h-screen">
        {/* Fixed Sidebar */}
        <Suspense fallback={null}>
          <AppSidebar />
        </Suspense>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:ml-64 overflow-x-hidden">
          <main className="flex-1 w-full">
            {/* Mobile top spacer so content doesn't hide behind hamburger */}
            <div className="lg:hidden h-14" />
            {children}
          </main>

        {/* Footer */}
        <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-[#faf9f6] dark:bg-[#141715] text-neutral-600 dark:text-neutral-400 transition-colors duration-200">
          <Container className="py-16 sm:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">
              
              {/* Brand Info */}
              <div className="md:col-span-2 lg:col-span-1">
                <h5 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-4 uppercase tracking-wide">Etira Mushrooms</h5>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mb-3">
                  PT Eka Timur Raya
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Produsen dan pemasok terpercaya jamur kancing segar, olahan kaleng steril, pouch retort, dan produk beku untuk industri kuliner dan Horeka di seluruh Indonesia.
                </p>
              </div>

              {/* Navigasi */}
              <div>
                <h5 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-4 uppercase tracking-wide">
                  Navigasi
                </h5>
                <div className="flex flex-col gap-3">
                  <Link href="/?katalog=semua" className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-brand-forest-700 dark:hover:text-brand-forest-400 transition-colors">
                    Katalog Produk
                  </Link>
                  <Link href="/tentang" className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-brand-forest-700 dark:hover:text-brand-forest-400 transition-colors">
                    Tentang Perusahaan
                  </Link>
                  <Link href="/kontak" className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-brand-forest-700 dark:hover:text-brand-forest-400 transition-colors">
                    Kontak & Pemesanan
                  </Link>
                  <Link href="/faq" className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-brand-forest-700 dark:hover:text-brand-forest-400 transition-colors">
                    Pertanyaan Umum (FAQ)
                  </Link>
                  <Link href="/login" className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-brand-forest-700 dark:hover:text-brand-forest-400 transition-colors">
                    Portal Masuk Mitra
                  </Link>
                </div>
              </div>

              {/* Kantor & Fasilitas */}
              <div>
                <h5 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-4 uppercase tracking-wide">
                  Kantor & Fasilitas
                </h5>
                <div className="space-y-3">
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Jl. Raya Nongkojajar KM 1.4<br />Purwodadi, Pasuruan 67163<br />Jawa Timur
                  </p>
                </div>
              </div>

              {/* Kontak */}
              <div>
                <h5 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-4 uppercase tracking-wide">
                  Kontak
                </h5>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">WhatsApp</p>
                    <a href={`https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_PHONE || "6285816172367"}`} className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-brand-forest-700 dark:hover:text-brand-forest-400 transition-colors break-all">
                      +{process.env.NEXT_PUBLIC_ADMIN_PHONE || "6285816172367"}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Email</p>
                    <a href={`mailto:${process.env.NEXT_PUBLIC_COMPANY_EMAIL || "etira@gmail.com"}`} className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-brand-forest-700 dark:hover:text-brand-forest-400 transition-colors break-all">
                      {process.env.NEXT_PUBLIC_COMPANY_EMAIL || "etira@gmail.com"}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="mt-12 sm:mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-700/50" />

            {/* Copyright */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-500">
              <p>&copy; {new Date().getFullYear()} PT Eka Timur Raya (Etira Mushrooms). Seluruh hak cipta dilindungi.</p>
              <p className="text-neutral-600 dark:text-neutral-500">Pasokan Langsung Pabrik & Perkebunan Jamur</p>
            </div>
          </Container>
        </footer>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp />
    </>
  );
}
