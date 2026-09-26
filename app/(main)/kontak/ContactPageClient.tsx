'use client';

import { Phone, Mail, MapPin, MessageSquare, Clock } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { useTranslations } from "@/hooks/useTranslations";

export default function ContactPageClient() {
  const t = useTranslations();
  const adminWa = process.env.NEXT_PUBLIC_ADMIN_PHONE || "6285816172367";
  const companyEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL || "info@ekatimurraya.com";
  const waLink = `https://wa.me/${adminWa}`;

  return (
    <div className="py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl md:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-3">
          {t.contact.title}
        </h1>
        <p className="font-sans text-base text-neutral-500 dark:text-neutral-400 max-w-2xl">
          {t.contact.description}
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Left Column - Contact Info (spans 1 column) */}
        <div className="space-y-6">
          {/* WhatsApp CTA */}
          <div className="bg-brand-forest-600 dark:bg-brand-forest-700 rounded-xl p-6 text-white border border-brand-forest-700 dark:border-brand-forest-600">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-heading font-bold text-lg text-white mb-1">
                  {t.contact.title}
                </h2>
                <p className="text-xs sm:text-sm text-white/80">
                  {t.contact.waSubtitle}
                </p>
              </div>
              <MessageSquare className="w-5 h-5 text-white flex-shrink-0" />
            </div>
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-150"
            >
              <Phone className="w-4 h-4 fill-white" />
              {t.contact.whatsapp}
            </a>
          </div>

          {/* Address */}
          <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand-forest-50 dark:bg-brand-forest-950/40 border border-brand-forest-200 dark:border-brand-forest-800 flex items-center justify-center shrink-0 text-brand-forest-600 dark:text-brand-forest-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-neutral-900 dark:text-neutral-100">
                  {t.contact.address}
                </h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{t.contact.addressLabel}</p>
              </div>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              PT Eka Timur Raya<br />
              Jl. Raya Purwodadi, Kec. Purwodadi,<br />
              Kabupaten Pasuruan, Jawa Timur 67163.
            </p>
          </div>

          {/* Email */}
          <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand-forest-50 dark:bg-brand-forest-950/40 border border-brand-forest-200 dark:border-brand-forest-800 flex items-center justify-center shrink-0 text-brand-forest-600 dark:text-brand-forest-400">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-neutral-900 dark:text-neutral-100">
                  {t.contact.email}
                </h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{t.contact.emailLabel}</p>
              </div>
            </div>
            <a
              href={`mailto:${companyEmail}`}
              className="text-xs font-semibold text-brand-forest-600 dark:text-brand-forest-400 hover:underline break-all"
            >
              {companyEmail}
            </a>
          </div>

          {/* Operational Hours */}
          <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-700">
              <div className="w-7 h-7 rounded-md bg-brand-forest-50 dark:bg-brand-forest-950/40 border border-brand-forest-200 dark:border-brand-forest-800 flex items-center justify-center text-brand-forest-600 dark:text-brand-forest-400">
                <Clock className="w-4 h-4" />
              </div>
              <h2 className="font-heading font-bold text-sm text-neutral-900 dark:text-neutral-100">
                {t.contact.hours}
              </h2>
            </div>
            <ul className="space-y-2 text-xs">
              <li className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-700 pb-2">
                <span className="text-neutral-600 dark:text-neutral-400">{t.contact.operating.monFri}</span>
                <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">{t.contact.operating.workingHours}</span>
              </li>
              <li className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-700 pb-2">
                <span className="text-neutral-600 dark:text-neutral-400">{t.contact.operating.saturday}</span>
                <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">{t.contact.operating.saturdayHours}</span>
              </li>
              <li className="flex justify-between items-center pt-1">
                <span className="text-neutral-600 dark:text-neutral-400">{t.contact.operating.sunAndHoliday}</span>
                <span className="font-medium text-neutral-500 dark:text-neutral-500">{t.contact.operating.closed}</span>
              </li>
            </ul>
            <div className="mt-4 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {t.contact.operating.ordersOutsideHours}
            </div>
          </div>
        </div>

        {/* Right Column - Contact Form (spans 2 columns) */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-8">
          <div className="mb-6">
            <h2 className="font-heading text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              {t.contact.sendMessage}
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {t.contact.form.respawnWithin24Hours}
            </p>
          </div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
