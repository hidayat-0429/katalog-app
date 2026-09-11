'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { OrderStatus } from '@prisma/client'
import { updateOrderStatus } from '@/lib/actions/orders'
import { statusLabel } from '@/lib/format'
import { Clock, Loader, Truck, CheckCircle, XCircle, RefreshCw, Loader2 } from 'lucide-react'

export default function OrderStatusForm({ orderId, currentStatus }: { orderId: string, currentStatus: OrderStatus }) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

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
    try {
      await updateOrderStatus(orderId, newStatus)
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="card p-5 space-y-3">
      <h2 className="flex items-center gap-2 font-bold text-sm text-charcoal dark:text-dark-text border-b border-border dark:border-dark-border pb-2">
        <RefreshCw className="w-4 h-4 text-charcoal-muted dark:text-dark-muted" />
        <span>Perbarui Status Pesanan</span>
      </h2>
      <div className="flex flex-wrap gap-2 text-xs">
        {statuses.map(s => {
          const isActive = s.value === currentStatus
          const Icon = s.icon
          
          return (
            <button
              key={s.value}
              onClick={() => handleUpdate(s.value)}
              disabled={isActive || isPending || (currentStatus === 'DIBATALKAN') || (currentStatus === 'SELESAI' && s.value !== 'SELESAI')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
                isActive 
                  ? 'bg-charcoal text-white dark:bg-dark-cta dark:text-dark-cta-text font-semibold' 
                  : 'border border-border dark:border-dark-border bg-white dark:bg-dark-surface text-charcoal dark:text-dark-text hover:bg-bg-subtle dark:hover:bg-dark-surface/80 disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              {isPending && !isActive ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Icon className="w-3.5 h-3.5" />}
              <span>{statusLabel(s.value)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
