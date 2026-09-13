"use client";

import Link from 'next/link';
import { BookOpen, ArrowRight, Lightbulb, FileText, BarChart3 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Bar Navigasi Atas */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3 text-blue-700 font-extrabold text-2xl tracking-tight">
  {/* Gambar logo KPM dari folder public */}
  <img src="/logo-kpm.png" alt="Logo KPM" className="h-12 w-auto" />
  <span>SPKT</span>
</div>
        <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors">
          Log Masuk Panel
        </Link>
      </header>

      {/* Bahagian Hero (Pengenalan) */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-b from-blue-50 to-slate-50">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm mb-8">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          Versi 1.0 Kini Beroperasi
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
          Sistem Pintar <span className="text-blue-600">Kajian Tindakan</span>
        </h1>
        
        <p className="max-w-2xl text-xl text-slate-600 mb-10 leading-relaxed">
          Platform digital komprehensif untuk pendidik merancang intervensi, merekod pemerhatian, dan menjana laporan berformat rasmi KPM secara automatik.
        </p>
        
        <Link 
          href="/login" 
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 hover:scale-105 transition-all shadow-lg hover:shadow-xl"
        >
          Mula Menulis Kajian <ArrowRight size={20} />
        </Link>
      </main>

      {/* Bahagian Ciri-Ciri (Tiga Kotak) */}
      <section className="bg-white py-20 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
          
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
              <Lightbulb size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Kitaran Sistematik</h3>
            <p className="text-slate-600">Enjin interaktif 4 Fasa terbina dalam berdasarkan model piawai Kemmis & McTaggart.</p>
          </div>

          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              <BarChart3 size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Penyimpanan Awan</h3>
            <p className="text-slate-600">Semua data pemerhatian dan log pelaksanaan disimpan dengan selamat di pangkalan data Google.</p>
          </div>

          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <FileText size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Jana Laporan PDF</h3>
            <p className="text-slate-600">Cetak laporan format rasmi A4 untuk simpanan fail panitia sekolah dengan hanya satu klik.</p>
          </div>

        </div>
      </section>

      {/* Pengaki (Footer) */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <p>© 2026 SPKT - Sistem Pintar Kajian Tindakan. Dibangunkan untuk Kegunaan KPM.</p>
      </footer>
    </div>
  );
}