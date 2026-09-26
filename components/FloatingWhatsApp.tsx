"use client";

import { MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "@/hooks/useTranslations";

export default function FloatingWhatsApp() {
  const t = useTranslations();
  const tw = t.floatingWa;
  const [isOpen, setIsOpen] = useState(false);
  const adminWa = process.env.NEXT_PUBLIC_ADMIN_PHONE || "6285816172367";
  const waLink = `https://wa.me/${adminWa}?text=${encodeURIComponent(tw.prefill)}`;

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        
        {/* Tooltip bubble - shows when hovering */}
        {!isOpen && (
          <div className="hidden lg:block opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-4 py-2 rounded-lg shadow-lg text-sm font-medium border border-neutral-200 dark:border-neutral-700">
              {tw.tooltip}
            </div>
          </div>
        )}

        {/* Quick message popup */}
        {isOpen && (
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-72 sm:w-80 overflow-hidden animate-slideInUp">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#25D366] to-[#20bd5a] p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-[#25D366]" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-sm">Etira Mushrooms</h3>
                <p className="text-xs text-white/80">{tw.cs}</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
                aria-label={tw.closeChat}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4">
              <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-3 mb-4">
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                  {tw.greeting}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-500">
                  {tw.readyTo}
                </p>
                <ul className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 space-y-1">
                  <li>&bull; {tw.itemPricing}</li>
                  <li>&bull; {tw.itemBulk}</li>
                  <li>&bull; {tw.itemSample}</li>
                  <li>&bull; {tw.itemOem}</li>
                </ul>
              </div>

              {/* CTA Button */}
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg py-3 font-semibold text-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                {tw.cta}
              </a>

              <p className="text-center text-xs text-neutral-500 dark:text-neutral-400 mt-3">
                {tw.replyTime}
              </p>
            </div>
          </div>
        )}

        {/* Main floating button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label={tw.openChat}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <>
              <MessageCircle className="w-6 h-6 text-white" />
              {/* Ping animation */}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </>
          )}
        </button>
      </div>
    </>
  );
}
