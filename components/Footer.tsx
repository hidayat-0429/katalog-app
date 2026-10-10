"use client";

import Container from "@/components/Container";
import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";
import { RETAIL_CHANNELS } from "@/lib/channels";

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-bg dark:bg-surface text-charcoal-muted transition-colors duration-200">
      <Container className="py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">

          {/* Brand Info */}
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-4 uppercase tracking-wide">Etira Mushrooms</h3>
            <p className="text-xs text-charcoal-muted font-medium mb-3">
              PT Eka Timur Raya
            </p>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              {t.footer.description}
            </p>
          </div>

          {/* Navigasi */}
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-4 uppercase tracking-wide">
              {t.footer.navigation}
            </h3>
            <div className="flex flex-col gap-3">
              <Link href="/?katalog=semua" className="text-xs text-charcoal-muted hover:text-brand-forest-700 dark:hover:text-brand-forest-400 transition-colors">
                {t.footer.catalogProduct}
              </Link>
              <Link href="/tentang" className="text-xs text-charcoal-muted hover:text-brand-forest-700 dark:hover:text-brand-forest-400 transition-colors">
                {t.footer.aboutCompany}
              </Link>
              <Link href="/kontak" className="text-xs text-charcoal-muted hover:text-brand-forest-700 dark:hover:text-brand-forest-400 transition-colors">
                {t.footer.contactOrder}
              </Link>
              <Link href="/faq" className="text-xs text-charcoal-muted hover:text-brand-forest-700 dark:hover:text-brand-forest-400 transition-colors">
                {t.footer.faqLink}
              </Link>
              <Link href="/login" className="text-xs text-charcoal-muted hover:text-brand-forest-700 dark:hover:text-brand-forest-400 transition-colors">
                {t.footer.partnerPortal}
              </Link>
            </div>
          </div>

          {/* Kantor & Fasilitas */}
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-4 uppercase tracking-wide">
              {t.footer.officeTitle}
            </h3>
            <div className="space-y-3">
              <p className="text-xs text-charcoal-muted leading-relaxed">
                {t.common.addressLine1}<br />{t.common.addressLine2}<br />{t.common.addressLine3}
              </p>
            </div>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-4 uppercase tracking-wide">
              {t.footer.contactTitle}
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">WhatsApp</p>
                <a href={`https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_PHONE || "628113503650"}`} className="text-xs text-charcoal-muted hover:text-brand-forest-700 dark:hover:text-brand-forest-400 transition-colors break-all">
                  +{process.env.NEXT_PUBLIC_ADMIN_PHONE || "628113503650"}
                </a>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Email</p>
                <a href={`mailto:${process.env.NEXT_PUBLIC_COMPANY_EMAIL || "Ga.etira12@gmail.com"}`} className="text-xs text-charcoal-muted hover:text-brand-forest-700 dark:hover:text-brand-forest-400 transition-colors break-all">
                  {process.env.NEXT_PUBLIC_COMPANY_EMAIL || "Ga.etira12@gmail.com"}
                </a>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">{t.footer.retailTitle}</p>
                <div className="flex flex-col gap-2">
                  {[
                    { href: RETAIL_CHANNELS.shopee, label: t.contact.retailShopee },
                    { href: RETAIL_CHANNELS.tiktok, label: t.contact.retailTiktok },
                    { href: RETAIL_CHANNELS.youtube, label: t.contact.retailYoutube },
                    { href: RETAIL_CHANNELS.facebook, label: t.contact.retailFacebook },
                    { href: RETAIL_CHANNELS.all, label: t.contact.retailAllChannels },
                  ].map((c) => (
                    <a
                      key={c.href}
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-charcoal-muted hover:text-brand-forest-700 dark:hover:text-brand-forest-400 transition-colors"
                    >
                      {c.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-700/50" />

        {/* Copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-muted">
          <p>&copy; {new Date().getFullYear()} PT Eka Timur Raya (Etira Mushrooms). {t.footer.copyright}</p>
          <p className="text-charcoal-muted">{t.footer.tagline}</p>
        </div>
      </Container>
    </footer>
  );
}
