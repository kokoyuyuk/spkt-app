"use client";

import { useEffect, useState } from 'react';
// SUNTIKAN: Saya tambah Menu dan X untuk butang Hamburger Mobile
import { Home, PlusCircle, Settings, BookOpen, Loader2, LogOut, LineChart, PenTool, Bot, Library, ShieldCheck, BookMarked, Target, Search, Globe, Printer, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true);
  // State untuk mengawal Menu Telefon (Hamburger)
  const [isMenuBuka, setIsMenuBuka] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
      } else {
        setIsChecking(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const tanganiLogKeluar = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Ralat ketika log keluar:", error);
      alert("Gagal log keluar. Sila cuba lagi.");
    }
  };

  // Fungsi untuk menutup menu setiap kali pautan ditekan (Untuk Telefon Bimbit)
  const tutupMenu = () => setIsMenuBuka(false);

  if (isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600 mr-3" size={32} /> 
        <span className="text-slate-600 font-medium">Mengesahkan akses keselamatan...</span>
      </div>
    );
  }

  // ==========================================
  // KUMPULAN PAUTAN NAVIGASI (Boleh diguna semula untuk Desktop & Mobile)
  // ==========================================
  const KandunganNavigasi = (
    <>
      <nav className="mt-4 flex flex-col gap-1.5 px-4 flex-1 overflow-y-auto overflow-x-hidden">
        <Link onClick={tutupMenu} href="/dashboard" className="flex items-center gap-4 p-3.5 rounded-xl bg-blue-50 text-blue-700 font-semibold transition-all hover:shadow-sm">
          <Home size={22} /> Papan Pemuka
        </Link>
        <Link onClick={tutupMenu} href="/dashboard/kertas-baru" className="flex items-center gap-4 p-3.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-all font-medium">
          <PlusCircle size={22} /> Kertas Kajian Baharu
        </Link>
        <Link onClick={tutupMenu} href="/dashboard/arkib" className="flex items-center gap-4 p-3.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-all font-medium">
          <BookOpen size={22} /> Arkib Laporan
        </Link>

        <Link onClick={tutupMenu} href="/dashboard/repositori" className="flex items-center gap-4 p-3.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-all font-medium">
          <Globe size={22} /> Bank Inovasi
        </Link>

        <Link onClick={tutupMenu} href="/dashboard/cetakan" className="flex items-center gap-4 p-3.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-all font-medium">
          <Printer size={22} /> Cetakan Laporan
        </Link>
        
        <Link onClick={tutupMenu} href="/dashboard/analisis" className="flex items-center gap-4 p-3.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-all font-medium">
          <LineChart size={22} /> Analisis Data
        </Link>

        <Link onClick={tutupMenu} href="/dashboard/triangulasi" className="flex items-center gap-4 p-3.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-all font-medium">
          <Target size={22} /> Triangulasi 360°
        </Link>

        <Link onClick={tutupMenu} href="/dashboard/lakar" className="flex items-center gap-4 p-3.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-all font-medium">
          <PenTool size={22} /> Papan Lakar
        </Link>

        <Link onClick={tutupMenu} href="/dashboard/ai" className="flex items-center gap-4 p-3.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-all font-medium">
          <Bot size={22} /> Rakan AI Penyelidik
        </Link>

        <Link onClick={tutupMenu} href="/dashboard/sumber" className="flex items-center gap-4 p-3.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-all font-medium">
          <Library size={22} /> Pustaka Ilmiah
        </Link>

        <Link onClick={tutupMenu} href="/dashboard/ketulenan" className="flex items-center gap-4 p-3.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-all font-medium">
          <Search size={22} /> Semakan Ketulenan
        </Link>

        {/* Garis Pemisah Visual */}
        <div className="border-t border-slate-200 my-2 mx-2"></div> 

        <Link onClick={tutupMenu} href="/dashboard/pentadbir" className="flex items-center gap-4 p-3.5 rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:shadow-sm transition-all font-bold border border-emerald-100">
          <ShieldCheck size={22} /> Panel Pentadbir
        </Link>
      </nav>
      
      <div className="p-4 mb-4 space-y-1.5 mt-auto shrink-0 border-t border-slate-100/50">
        <Link onClick={tutupMenu} href="/dashboard/panduan" className="flex items-center gap-4 p-3.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-all font-medium">
          <BookMarked size={22} /> Panduan Pengguna
        </Link>

        <Link onClick={tutupMenu} href="/dashboard/tetapan" className="flex items-center gap-4 p-3.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-all font-medium">
          <Settings size={22} /> Profil & Tetapan
        </Link>
        
        <button 
          onClick={() => {
            tutupMenu();
            tanganiLogKeluar();
          }}
          className="w-full flex items-center gap-4 p-3.5 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all font-semibold"
        >
          <LogOut size={22} /> Log Keluar
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 relative">
      
      {/* ========================================== */}
      {/* 📱 HEADER MOBILE (Hanya Muncul di Telefon) */}
      {/* ========================================== */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 z-30 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/logo-kpm.png" alt="Logo KPM" className="h-8 w-auto" />
          <span className="font-bold text-blue-700 text-lg tracking-tight">SPKT</span>
        </div>
        <button 
          onClick={() => setIsMenuBuka(true)} 
          className="p-2 text-slate-600 hover:bg-slate-100 hover:text-blue-600 rounded-lg transition-colors"
        >
          <Menu size={28} />
        </button>
      </div>

      {/* ========================================== */}
      {/* 📱 LACI MENU MOBILE & OVERLAY GELAP */}
      {/* ========================================== */}
      {isMenuBuka && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={tutupMenu}
        />
      )}
      
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${isMenuBuka ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <img src="/logo-kpm.png" alt="Logo KPM" className="h-10 w-auto" />
            <span className="font-bold text-blue-700 text-xl tracking-tight">SPKT</span>
          </div>
          <button 
            onClick={tutupMenu} 
            className="p-2 text-slate-400 hover:bg-rose-100 hover:text-rose-600 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        {KandunganNavigasi}
      </aside>

      {/* ========================================== */}
      {/* 💻 SIDEBAR DESKTOP (Kekal Sama seperti Asal) */}
      {/* ========================================== */}
      <aside className="w-72 bg-white border-r border-slate-200 shadow-sm hidden md:flex flex-col h-screen sticky top-0">
        <div className="p-8 border-b border-slate-100 flex flex-col items-start gap-4 shrink-0 bg-slate-50/30">
          <img src="/logo-kpm.png" alt="Logo KPM" className="h-16 w-auto drop-shadow-sm" />
          <div>
            <h2 className="text-3xl font-bold text-blue-700 tracking-tight">SPKT</h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">Panel Penyelidik KPM</p>
          </div>
        </div>
        {KandunganNavigasi}
      </aside>

      {/* ========================================== */}
      {/* 📄 KAWASAN KANDUNGAN UTAMA */}
      {/* ========================================== */}
      {/* SUNTIKAN: pt-24 ditambah untuk Mobile supaya kandungan tak tertutup oleh Header */}
      <main className="flex-1 p-4 pt-24 md:pt-10 md:p-10 lg:p-12 overflow-x-hidden">
        {children}
      </main>

    </div>
  );
}