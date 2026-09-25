'use client';

import { useState } from 'react';
import { FileSpreadsheet, Loader2 } from 'lucide-react';
import { getAllOrdersForExport } from '@/lib/actions/export';

interface ExportOrdersButtonProps {
  /** Status filter aktif di halaman saat ini (opsional, untuk pass ke export) */
  currentStatus?: string;
}

export default function ExportOrdersButton({ currentStatus }: ExportOrdersButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Ambil SEMUA pesanan dari server (tanpa pagination)
      const orders = await getAllOrdersForExport(currentStatus);

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
          escapeCsv(o.buyerName || o.user.name),
          escapeCsv(o.companyName || o.user.companyName || '-'),
          escapeCsv(o.buyerPhone || o.user.phone || '-'),
          escapeCsv(o.buyerEmail || o.user.email),
          escapeCsv(o.shippingAddress),
          escapeCsv(new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(o.totalPrice)),
          escapeCsv(o.status),
          escapeCsv(o.notes || '-'),
          escapeCsv(itemsDetail || '-'),
        ].join(',');
      });

      const csvContent = '\uFEFF' + [headers.map(h => `"${h}"`).join(','), ...rows].join('\r\n');
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
    } catch (err) {
      console.error('Export error:', err);
      alert('Gagal mengekspor data. Silakan coba lagi.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isExporting}
      className="btn-secondary text-xs py-1.5 px-3 inline-flex items-center gap-1.5 hover:border-sage dark:hover:border-dark-sage disabled:opacity-50 disabled:cursor-not-allowed"
      title="Unduh Rekap Laporan Format Excel / CSV (semua pesanan)"
    >
      {isExporting ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Mengekspor...</span>
        </>
      ) : (
        <>
          <FileSpreadsheet className="w-3.5 h-3.5 text-sage dark:text-dark-sage" />
          <span>Ekspor Laporan CSV/Excel</span>
        </>
      )}
    </button>
  );
}
