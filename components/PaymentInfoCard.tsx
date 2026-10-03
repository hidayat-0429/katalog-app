'use client'

import { Landmark, ShieldCheck } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'

// Nomor rekening PT tidak pernah dipublikasikan di mana pun, jadi kartu ini sengaja tidak
// menampilkan angka: nomor yang salah di sini berarti uang pembeli dikirim ke orang lain.
export default function PaymentInfoCard() {
  const t = useTranslations()

  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-surface p-5">
      <div className="flex items-center gap-2 font-bold text-sm text-neutral-900 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-700 pb-3">
        <Landmark className="w-4 h-4 text-charcoal-muted" />
        <span>{t.payment.title}</span>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-charcoal-muted">{t.payment.accountNote}</p>

      <div className="mt-3 flex items-start gap-2 text-xs text-charcoal-muted pt-2 border-t border-neutral-200 dark:border-neutral-700">
        <ShieldCheck className="w-4 h-4 text-brand-forest-600 dark:text-brand-forest-400 shrink-0 mt-0.5" />
        <p>{t.payment.afterTransfer}</p>
      </div>
    </div>
  )
}
