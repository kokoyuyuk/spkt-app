import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SPKT KPM",
  description: "Sistem Pintar Kajian Tindakan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ms">
      <head>
        {/* ========================================== */}
        {/* SUNTIKAN MAGIS PWA (PROGRESSIVE WEB APP) */}
        {/* ========================================== */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1d4ed8" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={inter.className}>
        {children}
        
        {/* ========================================== */}
        {/* PENDAFTARAN PEKERJA SERVIS (SERVICE WORKER) */}
        {/* ========================================== */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('Service Worker berjaya didaftarkan dengan skop: ', registration.scope);
                    },
                    function(err) {
                      console.log('Pendaftaran Service Worker gagal: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}