'use client'

import { useState } from 'react'
import { Landmark, Copy, Check, ShieldCheck } from 'lucide-react'

export default function PaymentInfoCard() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const bankAccounts = [
    {
      bank: 'BCA (Bank Central Asia)',
      accNumber: '0887350123',
      holder: 'PT Eka Timur Raya',
    },
    {
      bank: 'Bank Mandiri',
      accNumber: '1410098765432',
      holder: 'PT Eka Timur Raya',
    },
  ]

  const handleCopy = (num: string, idx: number) => {
    navigator.clipboard.writeText(num)
    setCopiedIndex(idx)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="card p-5 border border-border dark:border-dark-border">
      <div className="flex items-center gap-2 font-bold text-sm text-charcoal dark:text-dark-text border-b border-border dark:border-dark-border pb-3">
        <Landmark className="w-4 h-4 text-charcoal-muted dark:text-dark-muted" />
        <span>Instruksi Pembayaran Transfer Bank</span>
      </div>

      <div className="mt-3 space-y-2.5">
        {bankAccounts.map((acc, idx) => (
          <div
            key={acc.bank}
            className="p-3 bg-bg-subtle dark:bg-dark-surface rounded border border-border dark:border-dark-border flex flex-col sm:flex-row sm:items-center justify-between gap-2"
          >
            <div>
              <p className="text-xs font-semibold text-charcoal-muted dark:text-dark-muted">
                {acc.bank}
              </p>
              <p className="text-base font-bold text-charcoal dark:text-dark-text mt-0.5 tracking-wide">
                {acc.accNumber}
              </p>
              <p className="text-xs text-charcoal-muted dark:text-dark-muted">a.n. {acc.holder}</p>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(acc.accNumber, idx)}
              className="btn-secondary text-xs py-1 px-2.5 self-start sm:self-center print:hidden"
            >
              {copiedIndex === idx ? (
                <>
                  <Check className="w-3.5 h-3.5 text-sage" />
                  <span className="text-sage font-semibold">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Rekening</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-start gap-2 text-xs text-charcoal-muted dark:text-dark-muted pt-2 border-t border-border dark:border-dark-border">
        <ShieldCheck className="w-4 h-4 text-sage shrink-0 mt-0.5" />
        <p>
          Setelah melakukan transfer, mohon kirimkan konfirmasi melalui tombol WhatsApp di bawah ini agar pesanan Anda dapat langsung dipersiapkan oleh tim operasional.
        </p>
      </div>
    </div>
  )
}
