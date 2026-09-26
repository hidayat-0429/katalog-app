'use client'

import { Printer } from 'lucide-react'

export default function PrintInvoiceButton({ label = 'Cetak Invoice', tooltip = 'Cetak Faktur / Invoice' }: { label?: string; tooltip?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors duration-150 ease-out print:hidden"
      title={tooltip}
    >
      <Printer className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
      <span>{label}</span>
    </button>
  )
}
