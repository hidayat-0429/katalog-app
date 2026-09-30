import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { LocaleProvider } from "@/components/LocaleProvider";
import { getServerLocale, getServerMessages } from "@/lib/serverMessages";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// Kontak dan alamat diambil dari env + nilai yang sama dengan yang ditampilkan Footer,
// supaya JSON-LD tidak memuat klaim yang tidak terlihat di halaman.
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://etiramushrooms.com";

function organizationSchema() {
  const email = process.env.NEXT_PUBLIC_COMPANY_EMAIL || "marketing@etiramushrooms.com";
  const phone = process.env.NEXT_PUBLIC_ADMIN_PHONE || "628113503650";

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    name: "PT Eka Timur Raya",
    alternateName: "Etira Mushrooms",
    url: baseUrl,
    logo: `${baseUrl}/logos/etira-company-logo.png`,
    email,
    telephone: `+${phone}`,
    foundingDate: "1999",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Raya Nongkojajar KM 1.4",
      addressLocality: "Purwodadi",
      addressRegion: "Jawa Timur",
      postalCode: "67163",
      addressCountry: "ID",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email,
        telephone: `+${phone}`,
        availableLanguage: ["id", "en"],
      },
    ],
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const [t, locale] = await Promise.all([getServerMessages(), getServerLocale()]);

  return {
    metadataBase: new URL(baseUrl),
    title: t.metadata.default,
    description: t.metadata.homeDescription,
    keywords: t.metadata.keywords,
    openGraph: {
      title: t.metadata.default,
      description: t.metadata.homeDescription,
      type: "website",
      locale: locale === 'en' ? "en_US" : "id_ID",
      siteName: "Etira Mushrooms",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 675,
          alt: t.metadata.ogImageAlt,
        },
      ],
    },
    icons: {
      icon: "/logos/etira-company-logo.png",
      shortcut: "/logos/etira-company-logo.png",
      apple: "/logos/etira-company-logo.png",
    },
  };
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const locale = await getServerLocale();

  return (
    <html lang={locale} className={`${bricolage.variable} ${figtree.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen overflow-x-hidden font-sans bg-bg text-charcoal antialiased transition-colors duration-200">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
        <LocaleProvider>
          <Providers>
            {children}
          </Providers>
        </LocaleProvider>
      </body>
    </html>
  );
}
