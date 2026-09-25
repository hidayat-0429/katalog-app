import { ShieldCheck, Truck, Calculator, Clock } from "lucide-react";

export default function FeaturesGrid() {
  const features = [
    {
      icon: ShieldCheck,
      title: "HACCP Certified",
      description: "Standar keamanan pangan internasional untuk pasar premium",
      color: "bg-brand-forest-100 dark:bg-brand-forest-900/30 text-brand-forest-700 dark:text-brand-forest-300 border-brand-forest-200 dark:border-brand-forest-800"
    },
    {
      icon: Truck,
      title: "Same-Day Delivery",
      description: "Dipanen pagi, tiba hari ini dengan cold chain terjamin",
      color: "bg-brand-fresh-100 dark:bg-brand-fresh-900/30 text-brand-fresh-700 dark:text-brand-fresh-300 border-brand-fresh-200 dark:border-brand-fresh-800"
    },
    {
      icon: Calculator,
      title: "Bulk Pricing",
      description: "Harga khusus untuk pembelian volume dengan tier discount",
      color: "bg-brand-amber-100 dark:bg-brand-amber-900/30 text-brand-amber-700 dark:text-brand-amber-300 border-brand-amber-200 dark:border-brand-amber-800"
    },
    {
      icon: Clock,
      title: "25+ Tahun Pengalaman",
      description: "Partner terpercaya sejak 1999 untuk industri F&B Indonesia",
      color: "bg-brand-earth-100 dark:bg-brand-earth-900/30 text-brand-earth-700 dark:text-brand-earth-300 border-brand-earth-200 dark:border-brand-earth-800"
    },
  ];

  return (
    <section className="w-full px-6 sm:px-8 lg:px-16 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
            Mengapa Memilih Etira
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Keunggulan untuk Bisnis Anda
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Solusi pasokan jamur terpadu untuk restoran, hotel, catering, dan industri kuliner dengan standar kualitas tertinggi.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 hover:border-brand-forest-300 dark:hover:border-brand-forest-600 hover:shadow-lg transition-all duration-200"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg border ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-neutral-900 dark:text-neutral-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 sm:p-8">
            <div className="text-left flex-1">
              <h3 className="font-heading font-bold text-lg text-neutral-900 dark:text-neutral-100 mb-1">
                Butuh pasokan dalam jumlah besar?
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Hubungi tim kami untuk konsultasi harga khusus dan sample produk gratis.
              </p>
            </div>
            <a
              href="/kontak"
              className="inline-flex items-center justify-center px-6 py-3 bg-brand-forest-600 hover:bg-brand-forest-700 text-white rounded-lg font-semibold text-sm transition-colors shrink-0"
            >
              Konsultasi Sekarang
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
