"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-[#0f1110]">
      {/* Sidebar kiri - desktop only */}
      <aside 
        className={`fixed left-0 top-0 bottom-0 bg-white dark:bg-[#141715] border-r border-neutral-200 dark:border-neutral-800 overflow-y-auto hidden lg:block z-40 no-scrollbar transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-[72px]" : "w-[260px]"
        }`}
      >
        <AdminSidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      </aside>

      {/* Konten utama */}
      <div 
        className={`flex-1 flex flex-col min-w-0 overflow-x-hidden transition-all duration-300 ease-in-out ${
          isCollapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
        }`}
      >
        {/* Mobile nav bar */}
        <div className="lg:hidden border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141715]">
          <AdminSidebar isCollapsed={false} />
        </div>
        
        <main className="flex-1 w-full">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
