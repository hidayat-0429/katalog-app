import { Suspense } from "react";
import { getCurrentUser } from "@/lib/session";
import AppSidebarClient from "@/components/AppSidebarClient";
import AppSidebarContent from "@/components/AppSidebarContent";
import CartCountBadge from "@/components/CartCountBadge";

export default async function AppSidebar() {
  const user = await getCurrentUser();
  const buyerId = user?.role === "BUYER" ? user.id : null;

  // Wordmark sudah pindah ke AppSidebarClient agar barisnya bisa ikut di-ciutkan.
  return (
    <AppSidebarClient>
      {/* Client-side content that listens to locale changes */}
      <Suspense fallback={null}>
        <AppSidebarContent
          user={user}
          cartBadge={
            <Suspense fallback={null}>
              <CartCountBadge userId={buyerId} />
            </Suspense>
          }
        />
      </Suspense>
    </AppSidebarClient>
  );
}
