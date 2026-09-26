'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Container from '@/components/Container';
import { Card } from '@/components/ui';
import { useTranslations } from '@/hooks/useTranslations';

const GROUP_ORDER = ['product', 'quality', 'ordering'] as const;

export default function FAQPageClient() {
  const t = useTranslations();
  const [openKey, setOpenKey] = useState<string | null>('product-0');
  const adminWa = process.env.NEXT_PUBLIC_ADMIN_PHONE || '6285816172367';
  const companyEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'info@ekatimurraya.com';
  const waLink = `https://wa.me/${adminWa}?text=${encodeURIComponent(t.faq.waMessage)}`;

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6">
      <Container className="max-w-2xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            {t.faq.title}
          </h1>
          <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400 mt-1.5">
            {t.faq.description}
          </p>
        </div>

        {/* Grouped accordion */}
        <div className="space-y-10">
          {GROUP_ORDER.map((group) => {
            const items = t.faq.items.filter((item) => item.group === group);
            if (items.length === 0) return null;

            return (
              <section key={group}>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-3">
                  {t.faq.groups[group]}
                </h2>
                <Card className="p-0 overflow-hidden">
                  {items.map((item, index) => {
                    const key = `${group}-${index}`;
                    const isOpen = openKey === key;

                    return (
                      <div
                        key={key}
                        className={index > 0 ? 'border-t border-neutral-200 dark:border-neutral-700' : ''}
                      >
                        <h3>
                          <button
                            type="button"
                            onClick={() => setOpenKey(isOpen ? null : key)}
                            aria-expanded={isOpen}
                            aria-controls={`faq-panel-${key}`}
                            className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 text-sm sm:text-base font-medium text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors duration-150 ease-out"
                          >
                            {item.q}
                            <ChevronDown
                              className={`w-4 h-4 shrink-0 text-neutral-400 motion-safe:transition-transform motion-safe:duration-200 ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                              aria-hidden="true"
                            />
                          </button>
                        </h3>
                        <div
                          id={`faq-panel-${key}`}
                          role="region"
                          className={`grid motion-safe:transition-[grid-template-rows] duration-200 ease-out ${
                            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                          }`}
                        >
                          <div className="overflow-hidden">
                            <p className="px-5 pb-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                              {item.a}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </Card>
              </section>
            );
          })}
        </div>

        {/* Contact CTA */}
        <Card className="mt-12 p-8 bg-brand-forest-50/50 dark:bg-brand-forest-950/20 border-brand-forest-200 dark:border-brand-forest-800">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-neutral-100">
              {t.faq.stillHaveQuestions}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6 text-sm">
              {t.faq.contactDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-lg font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {t.faq.whatsappUs}
              </a>
              <a
                href={`mailto:${companyEmail}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-900 rounded-lg font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {t.faq.emailUs}
              </a>
            </div>
          </div>
        </Card>
      </Container>
    </div>
  );
}
