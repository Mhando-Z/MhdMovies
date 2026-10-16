import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://mhd-movies.vercel.app/";
const title = "MhdMovies - Your Ultimate Movie and Series Reference";
const description =
  "Discover movies and TV series with MhdMovies. Explore detailed information, cast, ratings, and where to watch online, powered by TMDB.";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | MhdMovies",
  },
  description,
  applicationName: "MhdMovies",
  authors: [{ name: "MhdMovies Team" }],
  keywords: [
    "MhdMovies",
    "movies",
    "TV series",
    "movie information",
    "series information",
    "where to watch",
    "streaming platforms",
    "TMDB",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "MhdMovies",
    title,
    description,
    images: [
      {
        url: "https://inpdtdlijpglmifrebbg.supabase.co/storage/v1/object/public/images/logos/mhd.png",
        alt: "MhdMovies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [
      {
        url: "https://inpdtdlijpglmifrebbg.supabase.co/storage/v1/object/public/images/logos/mhd.png",
        alt: "MhdMovies",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: "MhdMovies",
  url: siteUrl,
  description,
  inLanguage: "en",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`h-full  antialiased`}>
      <body
        className="min-h-full flex flex-col"
        style={{ backgroundColor: "#000000" }}
      >
        <script
          id="website-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteStructuredData).replace(
              /</g,
              "\\u003c",
            ),
          }}
        />
        <div>Navbar</div>
        {children}
        <Footer />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VBF77Y76H7"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag() { window.dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', 'G-VBF77Y76H7');
          `}
        </Script>
      </body>
    </html>
  );
}
