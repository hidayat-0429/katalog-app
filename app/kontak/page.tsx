import { Phone, Mail, MapPin, MessageSquare, Clock } from "lucide-react";

export const metadata = {
  title: "Hubungi Kami | Etira Mushrooms",
  description: "Kontak layanan pelanggan dan pemesanan B2B PT Eka Timur Raya (Etira Mushrooms).",
};

export default function KontakPage() {
  const adminWa = process.env.NEXT_PUBLIC_ADMIN_PHONE || "628113503650";
  const companyEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL || "info@ekatimurraya.com";
  const waLink = `https://wa.me/${adminWa}`;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-charcoal mb-4">
          Hubungi Kami
        </h1>
        <p className="font-sans text-sm sm:text-base text-charcoal-muted max-w-xl mx-auto leading-relaxed">
          Punya pertanyaan terkait kuota pasokan, metode pengiriman, atau harga spesifik komoditas? Tim layanan B2B kami siap membantu Anda.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 font-sans">
        
        {/* Kolom Info Kontak */}
        <div className="space-y-6">
          <div className="card p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-charcoal mb-1">Alamat Pabrik & Kantor</h3>
              <p className="text-sm text-charcoal-muted leading-relaxed">
                PT Eka Timur Raya<br />
                Jl. Raya Purwodadi,<br />
                Kec. Purwodadi, Pasuruan,<br />
                Jawa Timur, Indonesia.
              </p>
            </div>
          </div>

          <div className="card p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-charcoal mb-1">WhatsApp & Telepon</h3>
              <p className="text-sm text-charcoal-muted mb-3">Layanan konsultasi pemesanan.</p>
              <a 
                href={waLink}
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-xs"
              >
                <Phone className="w-4 h-4 fill-white" />
                <span>Chat Admin Sales</span>
              </a>
            </div>
          </div>

          <div className="card p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-charcoal mb-1">Surat Elektronik (Email)</h3>
              <p className="text-sm text-charcoal-muted mb-2">Untuk keperluan legalitas dan penawaran tender.</p>
              <a href={`mailto:${companyEmail}`} className="text-sm font-semibold text-primary hover:underline">
                {companyEmail}
              </a>
            </div>
          </div>
        </div>

        {/* Kolom Maps / Jam Operasional */}
        <div className="space-y-6">
          <div className="card p-6 bg-charcoal text-white border-none">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-sage" /> Jam Operasional Pabrik
            </h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex justify-between border-b border-white/10 pb-2">
                <span>Senin - Jumat</span>
                <span className="font-medium text-white">08:00 - 16:00 WIB</span>
              </li>
              <li className="flex justify-between border-b border-white/10 pb-2">
                <span>Sabtu</span>
                <span className="font-medium text-white">08:00 - 13:00 WIB</span>
              </li>
              <li className="flex justify-between pb-1 text-danger-text/90 font-medium">
                <span>Minggu & Tanggal Merah</span>
                <span>Tutup / Libur</span>
              </li>
            </ul>
            <p className="text-xs text-white/60 mt-4 leading-relaxed">
              *Pesanan online yang masuk di luar jam operasional akan diproses pada hari kerja berikutnya sesuai urutan masuk (First In, First Out).
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
