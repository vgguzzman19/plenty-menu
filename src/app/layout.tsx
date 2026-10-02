import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Plenty. — Carta",
  description: "Brunch & Café · Platja d'Aro, Costa Brava",
  themeColor: "#1C0D04",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Plenty.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${cormorant.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        {/* Anti-flash: apply dark class before paint */}
        <script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem('plenty-theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}` }} />
        {/* App instalable: registra el service worker mínimo (ver public/sw.js) */}
        <script dangerouslySetInnerHTML={{ __html: `if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){})})}` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
