import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import AppSidebarClient from "@/components/AppSidebarClient";
import AppSidebarContent from "@/components/AppSidebarContent";
import { Suspense } from "react";

export default async function AppSidebar() {
  const user = await getCurrentUser();
  const cartCount = user?.role === "BUYER"
    ? await prisma.cart.count({ where: { userId: user.id } })
    : 0;

  return (
    <AppSidebarClient>
      {/* Wordmark - Compact */}
      <Link href="/" className="px-4 pr-12 lg:pr-4 pt-4 pb-3.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3 group">
        <div className="w-8 h-8 rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0">
          <Image 
            src="/logos/etira-company-logo.png" 
            alt="Etira Logo" 
            width={32}
            height={32}
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <p className="font-heading font-bold text-sm text-neutral-900 dark:text-neutral-100 leading-none">
            ETIRA
          </p>
          <p className="text-[10px] text-neutral-500 dark:text-neutral-500 leading-none mt-0.5">
            Eka Timur Raya
          </p>
        </div>
      </Link>

      {/* Client-side content that listens to locale changes */}
      <Suspense fallback={null}>
        <AppSidebarContent user={user} cartCount={cartCount} />
      </Suspense>
    </AppSidebarClient>
  );
}
