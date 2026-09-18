import { Building2, Target, ShieldCheck, MapPin } from "lucide-react";

export const metadata = {
  title: "Tentang Perusahaan | Etira Mushrooms",
  description: "Profil PT Eka Timur Raya (Etira Mushrooms), supplier terpercaya produk jamur olahan dan segar untuk kebutuhan B2B industri kuliner.",
};

export default function TentangPage() {
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12 border-b border-border pb-8">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-charcoal mb-4">
          PT Eka Timur Raya
        </h1>
        <p className="font-sans text-lg text-charcoal-muted max-w-2xl mx-auto leading-relaxed">
          Mitra pemasok jamur kancing kaleng, pouch steril, dan jamur panen segar terpercaya untuk industri kuliner, katering, dan bisnis F&B di seluruh Indonesia.
        </p>
      </div>

      {/* Konten */}
      <div className="space-y-12 font-sans">
        
        {/* Sejarah / Profil */}
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl font-bold text-charcoal mb-4 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-primary" /> Profil Perusahaan
            </h2>
            <p className="text-charcoal-muted leading-relaxed mb-4">
              Berdiri sejak tahun <strong>1999</strong> dan dikenal luas dengan merek dagang <strong>Etira Mushrooms</strong>, PT Eka Timur Raya adalah salah satu perusahaan produsen dan pengolah jamur terbesar di Indonesia.
            </p>
            <p className="text-charcoal-muted leading-relaxed">
              Fokus utama kami adalah pada pasar B2B (Business to Business), memastikan setiap mitra bisnis mendapatkan pasokan bahan baku yang konsisten, steril, dan bernutrisi untuk kelancaran produksi mereka.
            </p>
          </div>
          <div className="bg-bg-subtle rounded-xl p-8 border border-border h-full flex flex-col justify-center">
            <h3 className="text-xl font-bold text-charcoal mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" /> Visi & Misi
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-charcoal text-sm uppercase tracking-wider mb-1">Visi</h4>
                <p className="text-charcoal-muted leading-relaxed italic">
                  &quot;To Be One Stop Point for All Mushrooms Needs of The Customers.&quot;
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-charcoal text-sm uppercase tracking-wider mb-1">Misi</h4>
                <p className="text-charcoal-muted leading-relaxed italic">
                  &quot;We Are Committed to Produce The Highest Quality Product to Ensure Full Customer Satisfaction.&quot;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Keunggulan */}
        <section>
          <h2 className="text-2xl font-bold text-charcoal mb-6 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" /> Mengapa Memilih Kami?
          </h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { title: "Kapasitas Besar", desc: "Mampu memenuhi kuota pesanan rutin skala tonase untuk kebutuhan pabrik maupun restoran besar." },
              { title: "Standar Sterilisasi", desc: "Produk pouch dan kaleng diproses menggunakan metode pemanasan sterilisasi agar tahan lama di suhu ruang." },
              { title: "Panen Setiap Hari", desc: "Komoditas jamur segar dipanen secara berkala demi menjamin kesegaran ketika sampai di tangan klien." }
            ].map((item, idx) => (
              <div key={idx} className="card p-5">
                <h4 className="font-semibold text-charcoal mb-2">{item.title}</h4>
                <p className="text-sm text-charcoal-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Lokasi / Pabrik */}
        <section className="bg-primary/5 rounded-xl p-6 sm:p-8 border border-primary/20">
          <h2 className="text-xl font-bold text-charcoal mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" /> Fasilitas Produksi & Distribusi
          </h2>
          <p className="text-charcoal-muted leading-relaxed mb-4">
            Berada di dataran tinggi yang menunjang iklim ideal untuk pertumbuhan jamur, fasilitas pembibitan dan produksi kami terpusat di area Purwodadi, Pasuruan. Kami menerapkan kontrol suhu presisi untuk menjamin hasil panen jamur kancing putih yang padat, bersih, dan segar.
          </p>
        </section>
      </div>
    </div>
  );
}
