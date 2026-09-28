import AppSidebar from "@/components/AppSidebar";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Footer from "@/components/Footer";
import { Suspense } from "react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex min-h-screen">
        {/* Fixed Sidebar */}
        <Suspense fallback={null}>
          <AppSidebar />
        </Suspense>

        {/* Content Area --nav-w ikut menyusut saat rail di-ciutkan (lihat AppSidebarClient) */}
        <div className="flex-1 flex flex-col min-w-0 lg:ml-[var(--nav-w)] overflow-x-hidden transition-[margin] duration-300 ease-in-out">
          <main className="flex-1 w-full">
            {/* Mobile top spacer so content doesn't hide behind hamburger */}
            <div className="lg:hidden h-14" />
            {children}
          </main>

        {/* Footer */}
        <Footer />
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp />
    </>
  );
}
