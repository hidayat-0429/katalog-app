'use client'

import { MessageCircle } from 'lucide-react'
import { formatRupiah } from '@/lib/format'

interface WhatsAppOrderButtonProps {
  orderNumber: string
  totalPrice: number
  customerName?: string
  items: { productName: string; quantity: number }[]
  adminPhone?: string
}

export default function WhatsAppOrderButton({
  orderNumber,
  totalPrice,
  customerName,
  items,
  adminPhone = '6285816172367', // Nomor WA testing (ganti ke 628113503650 untuk produksi)
}: WhatsAppOrderButtonProps) {
  const handleOpenWhatsApp = () => {
    const itemList = items
      .map((i, idx) => `${idx + 1}. ${i.productName} (x${i.quantity})`)
      .join('\n');

    const message = `Halo Admin PT Eka Timur Raya (Etira Mushrooms),\nSaya ${customerName ? customerName : 'Pelanggan'} ingin konfirmasi pemesanan pasokan pangan:\n\n*No. Pesanan:* ${orderNumber}\n*Total:* ${formatRupiah(totalPrice)}\n\n*Rincian Barang:*\n${itemList}\n\nMohon diproses untuk jadwal pengiriman dari pabrik. Terima kasih!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${adminPhone}?text=${encoded}`, '_blank');
  };

  return (
    <button
      type="button"
      onClick={handleOpenWhatsApp}
      className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-xs print:hidden"
    >
      <MessageCircle className="w-4 h-4 fill-white" />
      <span>Konfirmasi ke WhatsApp Admin</span>
    </button>
  );
}
