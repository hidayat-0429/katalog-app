'use client'

import { Printer } from 'lucide-react'

export default function PrintInvoiceButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="btn-secondary inline-flex items-center gap-2 px-4 py-2 text-sm print:hidden hover:border-forest/50 transition-colors"
      title="Cetak Faktur / Invoice"
    >
      <Printer className="w-4 h-4 text-stone-600" />
      <span>Cetak Invoice</span>
    </button>
  )
}
