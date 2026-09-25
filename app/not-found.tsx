import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 bg-bg-subtle border border-border rounded-full flex items-center justify-center text-charcoal-muted mb-6">
        <SearchX className="w-10 h-10" />
      </div>
      <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-charcoal mb-4">
        404
      </h1>
      <h2 className="font-sans text-lg sm:text-xl lg:text-2xl font-semibold text-charcoal mb-4">
        Halaman Tidak Ditemukan
      </h2>
      <p className="font-sans text-sm sm:text-base text-charcoal-muted max-w-md mx-auto mb-8 leading-relaxed">
        Maaf, halaman atau produk yang Anda cari mungkin telah dihapus, dipindahkan, atau tautannya tidak valid.
      </p>
      
      <div className="flex gap-3 font-sans">
        <Link href="/">
          <Button variant="primary">Kembali ke Beranda</Button>
        </Link>
        <Link href="/?katalog=semua">
          <Button variant="secondary">Lihat Katalog</Button>
        </Link>
      </div>
    </div>
  );
}
