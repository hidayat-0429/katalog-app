import { ShieldCheck, Award, Users } from "lucide-react";

export default function TrustBanner() {
  const clients = [
    { name: "Premium Restaurant Co.", category: "Fine Dining" },
    { name: "Culinary Group Asia", category: "Multi-concept" },
    { name: "Hotel & Catering Service", category: "Hospitality" },
    { name: "Food Distribution Hub", category: "Wholesale" },
    { name: "Restaurant Chain Network", category: "F&B Retail" },
    { name: "Culinary Innovation Lab", category: "R&D Kitchen" },
  ];

  const certifications = [
    { name: "HACCP", color: "bg-brand-forest-100 dark:bg-brand-forest-900/30 text-brand-forest-700 dark:text-brand-forest-300 border-brand-forest-200 dark:border-brand-forest-800" },
    { name: "Halal MUI", color: "bg-brand-fresh-100 dark:bg-brand-fresh-900/30 text-brand-fresh-700 dark:text-brand-fresh-300 border-brand-fresh-200 dark:border-brand-fresh-800" },
    { name: "ISO 22000", color: "bg-brand-earth-100 dark:bg-brand-earth-900/30 text-brand-earth-700 dark:text-brand-earth-300 border-brand-earth-200 dark:border-brand-earth-800" },
  ];

  return (
    <section className="w-full px-6 sm:px-8 lg:px-16 py-12 sm:py-16 bg-white dark:bg-neutral-900 border-y border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-brand-forest-600 dark:text-brand-forest-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Dipercaya oleh 500+ Bisnis Kuliner
            </span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Partner Terpercaya Industri F&amp;B
          </h2>
        </div>

        {/* Client Logos Grid */}
        <div className="mb-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {clients.map((client) => (
              <div
                key={client.name}
                className="flex flex-col items-center justify-center p-5 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-brand-forest-300 dark:hover:border-brand-forest-600 transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-brand-forest-100 dark:bg-brand-forest-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Award className="w-6 h-6 text-brand-forest-600 dark:text-brand-forest-400" />
                </div>
                <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 text-center">
                  {client.name}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center mt-0.5">
                  {client.category}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="flex flex-col items-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-brand-forest-600 dark:text-brand-forest-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
              Sertifikasi Internasional
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {certifications.map((cert) => (
              <div
                key={cert.name}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-bold ${cert.color}`}
              >
                <ShieldCheck className="w-4 h-4" />
                {cert.name}
              </div>
            ))}
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-4 text-center max-w-2xl">
            Semua produk diproses dengan standar keamanan pangan internasional dan bersertifikat halal untuk pasar premium Indonesia.
          </p>
        </div>

      </div>
    </section>
  );
}
