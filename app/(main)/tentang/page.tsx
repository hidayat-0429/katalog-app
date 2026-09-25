import { Building2, Target, ShieldCheck, MapPin, CalendarDays, Users2, Package } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Tentang Perusahaan | Etira Mushrooms",
  description: "Profil PT Eka Timur Raya (Etira Mushrooms), supplier terpercaya produk jamur olahan dan segar untuk kebutuhan B2B industri kuliner.",
};

export default function TentangPage() {
  return (
    <div className="py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Tentang Perusahaan
        </h1>
        <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Profil, dedikasi mutu, dan fasilitas produksi PT Eka Timur Raya (Etira Mushrooms)
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 bg-white dark:bg-[#141715] border border-neutral-200 dark:border-neutral-700 rounded-xl mb-8">
        {[
          { value: "1999", label: "Tahun Berdiri", icon: CalendarDays },
          { value: "500+", label: "Mitra Restoran & Horeka", icon: Users2 },
          { value: "50+ Ton", label: "Kapasitas per Bulan", icon: Package },
          { value: "HACCP & Halal", label: "Standar Mutu Resmi", icon: ShieldCheck },
        ].map(({ value, label, icon: Icon }) => (
          <div key={label} className="flex flex-col items-center text-center gap-1">
            <div className="w-8 h-8 rounded-lg bg-brand-forest-50 dark:bg-brand-forest-950/40 border border-brand-forest-200 dark:border-brand-forest-800 flex items-center justify-center text-brand-forest-600 dark:text-brand-forest-400 mb-1">
              <Icon className="w-4 h-4" />
            </div>
            <p className="font-mono text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100">{value}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Profil Perusahaan */}
      <section className="mb-10">
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {/* Left: Image */}
          <div className="relative aspect-[16/10] md:aspect-auto w-full min-h-[260px] md:min-h-full rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700">
            <Image 
              src="/etira.png" 
              alt="Fasilitas Pabrik PT Eka Timur Raya" 
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute bottom-3 left-3 right-3 bg-neutral-900/80 backdrop-blur-xs text-white p-3 rounded-lg border border-white/10 text-xs">
              <p className="font-semibold text-white">Fasilitas Produksi Terpadu</p>
              <p className="text-white/80 text-[11px] mt-0.5">Purwodadi, Pasuruan - Jawa Timur</p>
            </div>
          </div>

          {/* Right: Content */}
          <div className="bg-white dark:bg-[#141715] border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-md bg-brand-forest-50 dark:bg-brand-forest-950/40 border border-brand-forest-200 dark:border-brand-forest-800 flex items-center justify-center text-brand-forest-600 dark:text-brand-forest-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-forest-600 dark:text-brand-forest-400">
                  Sejarah &amp; Perjalanan
                </span>
              </div>
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-neutral-900 dark:text-neutral-100 mb-3">
                Produsen Jamur Modern Terkemuka di Indonesia
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-3">
                Didirikan sejak tahun 1999 dan berakar di lereng Gunung Bromo (Nongkojajar), PT Eka Timur Raya (Etira Mushrooms) telah beroperasi selama lebih dari 25 tahun sebagai salah satu pelopor budidaya dan pengolahan jamur kancing terintegrasi di Indonesia.
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Kami memadukan sistem perkebunan berkontrol iklim presisi dengan lini pemrosesan steril bersertifikasi HACCP untuk menghasilkan pasokan jamur segar, kaleng steril, pouch retort, dan olahan beku bermutu tinggi bagi jaringan hotel, restoran, katering, dan industri F&amp;B nasional.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="inline-flex items-center gap-1.5 font-medium text-brand-forest-700 dark:text-brand-forest-400">
                <ShieldCheck className="w-4 h-4" /> Kualitas Terstandarisasi
              </span>
              <span>•</span>
              <span>Standar Pangan Ekspor &amp; Domestik</span>
            </div>
          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="mb-10">
        <div className="mb-4">
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-neutral-900 dark:text-neutral-100">
            Visi &amp; Misi Perusahaan
          </h2>
          <p className="font-sans text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Landasan komitmen kami dalam menghadirkan pasokan pangan terbaik bagi mitra
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {/* Card Visi */}
          <div className="bg-white dark:bg-[#141715] border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-brand-forest-50 dark:bg-brand-forest-950/40 border border-brand-forest-200 dark:border-brand-forest-800 flex items-center justify-center text-brand-forest-600 dark:text-brand-forest-400">
                  <Target className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-forest-600 dark:text-brand-forest-400">
                  Visi Kami
                </span>
              </div>
              <blockquote className="font-heading text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 leading-snug mb-4">
                &ldquo;Menjadi pelopor global dalam penyediaan jamur berkualitas tinggi yang sehat, aman, dan berkelanjutan bagi keluarga serta industri pangan.&rdquo;
              </blockquote>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                Kami bertekad terus memimpin rantai pasok hortikultura jamur dengan menerapkan teknologi pertanian berkelanjutan dan efisiensi pengolahan terpadu.
              </p>
            </div>
            <ul className="space-y-2 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-300">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-forest-600 dark:bg-brand-forest-400 mt-1.5 shrink-0" />
                <span>Pelopor budidaya jamur ramah lingkungan dan terintegrasi</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-forest-600 dark:bg-brand-forest-400 mt-1.5 shrink-0" />
                <span>Penyedia pasokan bahan baku pangan bernilai gizi tinggi</span>
              </li>
            </ul>
          </div>

          {/* Card Misi */}
          <div className="bg-white dark:bg-[#141715] border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-brand-forest-50 dark:bg-brand-forest-950/40 border border-brand-forest-200 dark:border-brand-forest-800 flex items-center justify-center text-brand-forest-600 dark:text-brand-forest-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-forest-600 dark:text-brand-forest-400">
                  Misi Kami
                </span>
              </div>
              <blockquote className="font-heading text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 leading-snug mb-4">
                &ldquo;Berkomitmen menghasilkan produk dengan kualitas mutu tertinggi untuk memastikan kepuasan pelanggan dan keandalan pasokan mitra bisnis secara penuh.&rdquo;
              </blockquote>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                Fokus operasional kami dibangun di atas integritas pangan, kecepatan distribusi, dan kepastian volume pasokan untuk menopang kebutuhan mitra.
              </p>
            </div>
            <ul className="space-y-2 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-300">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-forest-600 dark:bg-brand-forest-400 mt-1.5 shrink-0" />
                <span>Menerapkan standar sterilisasi internasional HACCP &amp; Halal</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-forest-600 dark:bg-brand-forest-400 mt-1.5 shrink-0" />
                <span>Menjamin rantai dingin cold chain untuk menjaga kesegaran panen</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Keunggulan */}
      <section className="mb-10">
        <div className="mb-4">
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-neutral-900 dark:text-neutral-100">
            Keunggulan Pasokan B2B
          </h2>
          <p className="font-sans text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Mengapa ratusan mitra industri kuliner dan Horeka mempercayakan pasokannya kepada Etira
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#141715] border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-brand-forest-50 dark:bg-brand-forest-950/40 border border-brand-forest-200 dark:border-brand-forest-800 flex items-center justify-center text-brand-forest-600 dark:text-brand-forest-400 mb-3">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-sm text-neutral-900 dark:text-neutral-100 mb-1.5">
              Kapasitas 50+ Ton/Bulan
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Menjamin ketersediaan stok konsisten tanpa fluktuasi pasokan untuk rantai restoran dan pabrik olahan.
            </p>
          </div>

          <div className="bg-white dark:bg-[#141715] border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-brand-forest-50 dark:bg-brand-forest-950/40 border border-brand-forest-200 dark:border-brand-forest-800 flex items-center justify-center text-brand-forest-600 dark:text-brand-forest-400 mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-sm text-neutral-900 dark:text-neutral-100 mb-1.5">
              Sertifikasi HACCP &amp; Halal
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Diproses dengan uji laboratorium higienis berkala, lolos audit keamanan pangan perhotelan dan pasar ekspor.
            </p>
          </div>

          <div className="bg-white dark:bg-[#141715] border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-brand-forest-50 dark:bg-brand-forest-950/40 border border-brand-forest-200 dark:border-brand-forest-800 flex items-center justify-center text-brand-forest-600 dark:text-brand-forest-400 mb-3">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-sm text-neutral-900 dark:text-neutral-100 mb-1.5">
              OEM &amp; Private Label
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Dukungan formulasi khusus, pemotongan custom (whole/sliced), dan pengemasan bermerek untuk brand Anda.
            </p>
          </div>

          <div className="bg-white dark:bg-[#141715] border border-neutral-200 dark:border-neutral-700 rounded-xl p-5 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-brand-forest-50 dark:bg-brand-forest-950/40 border border-brand-forest-200 dark:border-brand-forest-800 flex items-center justify-center text-brand-forest-600 dark:text-brand-forest-400 mb-3">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-sm text-neutral-900 dark:text-neutral-100 mb-1.5">
              Armada Cold Chain Terpadu
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Didukung armada berpendingin suhu terkontrol untuk menjaga kesegaran komoditas langsung dari pabrik.
            </p>
          </div>
        </div>
      </section>

      {/* Fasilitas & Lokasi */}
      <section>
        <div className="mb-4">
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-neutral-900 dark:text-neutral-100">
            Fasilitas Produksi &amp; Logistik
          </h2>
          <p className="font-sans text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Infrastruktur terintegrasi di Purwodadi, Pasuruan
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {/* Lini Fasilitas (2 cols) */}
          <div className="md:col-span-2 bg-white dark:bg-[#141715] border border-neutral-200 dark:border-neutral-700 rounded-xl p-6">
            <h3 className="font-heading font-bold text-base text-neutral-900 dark:text-neutral-100 mb-3">
              Sentra Budidaya &amp; Pengolahan Terintegrasi
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-5">
              Pabrik dan kebun budidaya kami di Purwodadi, Pasuruan - sekitar 65 km dari Surabaya - berada di lokasi strategis dengan akses langsung ke arteri logistik Jawa dan pelabuhan Tanjung Perak.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
                <p className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 mb-1">
                  Lini Budidaya Otomatis
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Kumbung berkontrol iklim dan kelembaban otomatis untuk siklus panen presisi.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
                <p className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 mb-1">
                  Lini Steril Kaleng &amp; Pouch
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Autoclave dan retort bertekanan tinggi standar HACCP untuk ketahanan simpan 2+ tahun.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
                <p className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 mb-1">
                  Fasilitas Cold Storage -18°C
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Gudang beku berkapasitas besar dengan docking khusus truk berpendingin.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700">
                <p className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 mb-1">
                  Lini Produk Olahan
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Pengolahan produk bernilai tambah seperti nugget jamur, bakso, dan patty nabati.
                </p>
              </div>
            </div>
          </div>

          {/* Lokasi Card (1 col) */}
          <div className="bg-white dark:bg-[#141715] border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-brand-forest-50 dark:bg-brand-forest-950/40 border border-brand-forest-200 dark:border-brand-forest-800 flex items-center justify-center text-brand-forest-600 dark:text-brand-forest-400 mb-3">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-forest-600 dark:text-brand-forest-400">
                Alamat Pabrik
              </span>
              <h3 className="font-heading font-bold text-base text-neutral-900 dark:text-neutral-100 mt-1 mb-2">
                Purwodadi, Pasuruan
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                Jl. Raya Purwodadi, Kec. Purwodadi, Kabupaten Pasuruan, Jawa Timur 67163.
              </p>
            </div>
            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Jarak ke Surabaya:</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">±65 km (Tol)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Jangkauan Armada:</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">Nasional (Jawa-Bali)</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
