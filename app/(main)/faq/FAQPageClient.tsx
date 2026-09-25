'use client';

import Container from '@/components/Container';
import { Card } from '@/components/ui';
import { useTranslations } from '@/hooks/useTranslations';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'Apa saja jenis produk Etira Mushroom yang tersedia?',
    answer: 'Kami menyediakan jamur dalam berbagai varian: jamur segar (fresh), kemasan kantong/pouch, kemasan kaleng (canned), hingga varian beku (frozen). Bentuknya tersedia dalam varian utuh (Whole) maupun irisan (Slice) sesuai kebutuhan Anda.',
  },
  {
    question: 'Bagaimana kualitas dan kesegarannya dijaga?',
    answer: 'Jamur ditanam di fasilitas kontrol iklim modern di ketinggian 1.850 mdpl dekat Gunung Bromo. Pemrosesan dan pengemasan dilakukan pada hari yang sama saat jamur dipetik demi menjaga kesegaran maksimal. Kami juga menerapkan standar sterilisasi internasional HACCP.',
  },
  {
    question: 'Apakah produk ini aman dan legal?',
    answer: 'Ya, produk Etira Mushroom diproses secara steril dengan standar internasional dan memiliki sertifikasi resmi BPOM dan Halal MUI. Semua produk melalui quality control ketat di setiap tahap produksi.',
  },
  {
    question: 'Bagaimana cara mengolah jamur kemasan pouch/kaleng?',
    answer: 'Jamur dikemas dalam larutan air garam ringan untuk menjaga ketahanannya. Jamur ini berstatus ready to cook (siap olah). Anda cukup meniriskan airnya, dibilas sedikit jika diperlukan, lalu langsung ditumis atau dicampurkan ke sup, pasta, pizza, atau masakan favorit Anda.',
  },
  {
    question: 'Apa saja kandungan nutrisinya?',
    answer: 'Jamur kancing ini cocok untuk menu diet karena rendah kalori, tinggi serat, kaya akan protein, vitamin D, serta antioksidan alami. Teksturnya yang kenyal dan padat juga sering dijadikan alternatif pengganti daging dalam berbagai masakan vegetarian.',
  },
  {
    question: 'Berapa lama jamur segar bisa bertahan?',
    answer: 'Jamur segar dapat bertahan 5-7 hari jika disimpan dalam kulkas dengan suhu 2-4°C. Kami merekomendasikan penggunaan dalam 3 hari untuk kesegaran optimal. Untuk penyimpanan lebih lama, produk kaleng atau frozen kami tahan hingga 2+ tahun.',
  },
  {
    question: 'Di mana produk ini bisa dibeli?',
    answer: 'Varian eceran seperti Etira Mushroom Whole atau Etira Mushroom Slice tersedia secara online di marketplace seperti Shopee dan Tokopedia melalui berbagai reseller. Untuk pembelian grosir B2B, silakan hubungi tim sales kami langsung.',
  },
  {
    question: 'Berapa kisaran harganya?',
    answer: 'Ukuran kecil (250 gram): Kisaran Rp16.500 - Rp21.500. Ukuran besar (900 gram): Kisaran Rp39.900 - Rp51.000. Untuk pembelian grosir di atas 20kg, kami menawarkan harga khusus B2B yang lebih kompetitif.',
  },
  {
    question: 'Apa syarat mengajukan komplain jika membeli secara online?',
    answer: 'Mayoritas toko retail mewajibkan klaim diajukan maksimal 24 jam sejak paket diterima, lengkap dengan foto resi fisik serta video unboxing sebagai bukti sah. Untuk pembelian B2B, hubungi customer service kami dengan foto produk sebagai dokumentasi.',
  },
  {
    question: 'Apakah ada layanan pembelian untuk bisnis kuliner?',
    answer: 'Ya, kami menawarkan layanan khusus untuk restoran, hotel, katering, dan industri pangan lainnya. Tersedia opsi pembelian grosir dengan harga spesial, jadwal pengiriman rutin, dan konsultasi penggunaan produk sesuai kebutuhan menu Anda.',
  },
];

export default function FAQPageClient() {
  const t = useTranslations();
  const adminWa = process.env.NEXT_PUBLIC_ADMIN_PHONE || "6285816172367";
  const companyEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL || "etira@gmail.com";
  const waLink = `https://wa.me/${adminWa}?text=Halo,%20saya%20ingin%20bertanya%20tentang%20produk%20jamur%20Etira`;

  return (
    <div className="py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {t.faq.title}
        </h1>
        <p className="font-sans text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          {t.faq.description}
        </p>
      </div>

      {/* FAQ List */}
      <div className="space-y-6 mb-12">
        {faqs.map((faq, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-lg mb-3 text-brand-forest-700 dark:text-brand-forest-300">
              {index + 1}. {faq.question}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {faq.answer}
            </p>
          </Card>
        ))}
      </div>

      {/* Contact CTA */}
      <Card className="p-8 bg-brand-forest-50/50 dark:bg-brand-forest-950/20 border-brand-forest-200 dark:border-brand-forest-800">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-neutral-100">
            {t.faq.stillHaveQuestions}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Tim kami siap membantu Anda. Hubungi kami melalui WhatsApp atau email.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-lg font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp Kami
            </a>
            <a
              href={`mailto:${companyEmail}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-900 rounded-lg font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Kami
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
