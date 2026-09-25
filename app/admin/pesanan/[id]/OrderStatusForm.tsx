'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { OrderStatus } from '@prisma/client'
import { updateOrderStatus } from '@/lib/actions/orders'
import { statusLabel } from '@/lib/format'
import { Clock, Loader, Truck, CheckCircle, XCircle, RefreshCw, Loader2, AlertCircle } from 'lucide-react'

export default function OrderStatusForm({ orderId, currentStatus }: { orderId: string, currentStatus: OrderStatus }) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState('')

  const statuses: { value: OrderStatus, icon: any }[] = [
    { value: 'PENDING', icon: Clock },
    { value: 'DIPROSES', icon: Loader },
    { value: 'DIKIRIM', icon: Truck },
    { value: 'SELESAI', icon: CheckCircle },
    { value: 'DIBATALKAN', icon: XCircle }
  ]

  const handleUpdate = async (newStatus: OrderStatus) => {
    if (newStatus === currentStatus) return
    setIsPending(true)
    setError('')
    try {
      await updateOrderStatus(orderId, newStatus)
      router.refresh()
    } catch (err: any) {
      console.error(err)
      setError(err?.message || 'Gagal memperbarui status pesanan. Silakan coba lagi.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-6">
      <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6 pb-3 border-b border-neutral-200 dark:border-neutral-700">
        <RefreshCw className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
        <span>Perbarui Status Pesanan</span>
      </h2>

      {error && (
        <div className="flex items-start gap-2 text-sm text-semantic-danger-dark bg-semantic-danger-light border border-semantic-danger-DEFAULT rounded-md p-3 mb-4 dark:bg-semantic-danger-darkBg dark:text-red-200 dark:border-red-900">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {statuses.map(s => {
          const isActive = s.value === currentStatus
          const Icon = s.icon
          
          return (
            <button
              key={s.value}
              onClick={() => handleUpdate(s.value)}
              disabled={isActive || isPending || (currentStatus === 'DIBATALKAN') || (currentStatus === 'SELESAI' && s.value !== 'SELESAI')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-out ${
                isActive 
                  ? 'bg-brand-forest-600 text-white border border-brand-forest-700 dark:bg-brand-forest-500' 
                  : 'border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {isPending && !isActive ? <Loader2 className="w-4 h-4 animate-spin" /> : <Icon className="w-4 h-4" />}
              <span>{statusLabel(s.value)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
