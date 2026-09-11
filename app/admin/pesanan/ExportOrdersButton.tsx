'use client';

import { FileSpreadsheet } from 'lucide-react';

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface OrderData {
  orderNumber: string;
  createdAt: Date | string;
  status: string;
  totalPrice: number;
  shippingAddress: string;
  notes?: string | null;
  user: {
    name: string;
    email: string;
    companyName?: string | null;
    phone?: string | null;
  };
  items?: OrderItem[];
}

interface ExportOrdersButtonProps {
  orders: OrderData[];
}

export default function ExportOrdersButton({ orders }: ExportOrdersButtonProps) {
  const handleExport = () => {
    if (!orders || orders.length === 0) {
      alert('Tidak ada data pesanan untuk diekspor.');
      return;
    }

    const headers = [
      'No. Pesanan',
      'Tanggal Transaksi',
      'Nama Pemesan',
      'Perusahaan / Usaha',
      'No. Telepon',
      'Email',
      'Alamat Pengiriman',
      'Total Nilai (IDR)',
      'Status Pesanan',
      'Metode & Catatan',
      'Rincian Komoditas',
    ];

    const escapeCsv = (str: string | number | null | undefined) => {
      if (str === null || str === undefined) return '""';
      const clean = String(str).replace(/"/g, '""');
      return `"${clean}"`;
    };

    const rows = orders.map((o) => {
      const itemsDetail = (o.items || [])
        .map((item) => `${item.productName} (x${item.quantity})`)
        .join('; ');

      const formattedDate = new Date(o.createdAt).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });

      return [
        escapeCsv(o.orderNumber),
        escapeCsv(formattedDate),
        escapeCsv(o.user.name),
        escapeCsv(o.user.companyName || '-'),
        escapeCsv(o.user.phone || '-'),
        escapeCsv(o.user.email),
        escapeCsv(o.shippingAddress),
        escapeCsv(o.totalPrice),
        escapeCsv(o.status),
        escapeCsv(o.notes || '-'),
        escapeCsv(itemsDetail || '-'),
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const today = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `Rekap_Pesanan_Etira_Mushrooms_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      className="btn-secondary text-xs py-1.5 px-3 inline-flex items-center gap-1.5 shadow-2xs hover:border-sage dark:hover:border-dark-sage"
      title="Unduh Rekap Laporan Format Excel / CSV"
    >
      <FileSpreadsheet className="w-3.5 h-3.5 text-sage dark:text-dark-sage" />
      <span>Ekspor Laporan CSV/Excel</span>
    </button>
  );
}
