"use client";

import { useEffect, useState } from 'react';
// SUNTIKAN: Saya tambah ikon 'Printer' di senarai import ini untuk Cetakan Rasmi
import { Home, PlusCircle, Settings, BookOpen, Loader2, LogOut, LineChart, PenTool, Bot, Library, ShieldCheck, BookMarked, Target, Search, Globe, Printer } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true);
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

  // Fungsi baharu untuk mendaftar keluar
  const tanganiLogKeluar = async () => {
    try {
      await signOut(auth);
      // Selepas keluar, sistem automatik akan tendang kembali ke halaman Login
    } catch (error) {
      console.error("Ralat ketika log keluar:", error);
      alert("Gagal log keluar. Sila cuba lagi.");
    }
  };

  if (isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600 mr-3" size={32} /> 
        <span className="text-slate-600 font-medium">Mengesahkan akses keselamatan...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-72 bg-white border-r border-slate-200 shadow-sm hidden md:flex flex-col overflow-y-auto">
        
        {/* --- BAHAGIAN YANG TELAH DISUNTIK LOGO KPM --- */}
        <div className="p-8 border-b border-slate-100 flex flex-col items-start gap-4 shrink-0">
          <img src="/logo-kpm.png" alt="Logo KPM" className="h-16 w-auto" />
          <div>
            <h2 className="text-3xl font-bold text-blue-700 tracking-tight">SPKT</h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">Panel Penyelidik KPM</p>
          </div>
        </div>
        {/* --------------------------------------------- */}

        <nav className="mt-6 flex flex-col gap-2 px-4 flex-1">
          <Link href="/dashboard" className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 text-blue-700 font-semibold transition-all hover:shadow-sm">
            <Home size={24} /> Papan Pemuka
          </Link>
          <Link href="/dashboard/kertas-baru" className="flex items-center gap-4 p-4 rounded-xl text-slate-600 hover:bg-slate-100 transition-all font-medium">
            <PlusCircle size={24} /> Kertas Kajian Baharu
          </Link>
          <Link href="/dashboard/arkib" className="flex items-center gap-4 p-4 rounded-xl text-slate-600 hover:bg-slate-100 transition-all font-medium">
            <BookOpen size={24} /> Arkib Laporan
          </Link>

          <Link href="/dashboard/repositori" className="flex items-center gap-4 p-4 rounded-xl text-slate-600 hover:bg-slate-100 transition-all font-medium">
            <Globe size={24} /> Bank Inovasi
          </Link>

          {/* SUNTIKAN BAHARU: MENU CETAKAN RASMI (PDF) */}
          <Link href="/dashboard/cetakan" className="flex items-center gap-4 p-4 rounded-xl text-slate-600 hover:bg-slate-100 transition-all font-medium">
            <Printer size={24} /> Cetakan Laporan
          </Link>
          
          <Link href="/dashboard/analisis" className="flex items-center gap-4 p-4 rounded-xl text-slate-600 hover:bg-slate-100 transition-all font-medium">
            <LineChart size={24} /> Analisis Data
          </Link>

          <Link href="/dashboard/triangulasi" className="flex items-center gap-4 p-4 rounded-xl text-slate-600 hover:bg-slate-100 transition-all font-medium">
            <Target size={24} /> Triangulasi 360°
          </Link>

          <Link href="/dashboard/lakar" className="flex items-center gap-4 p-4 rounded-xl text-slate-600 hover:bg-slate-100 transition-all font-medium">
            <PenTool size={24} /> Papan Lakar
          </Link>

          <Link href="/dashboard/ai" className="flex items-center gap-4 p-4 rounded-xl text-slate-600 hover:bg-slate-100 transition-all font-medium">
            <Bot size={24} /> Rakan AI Penyelidik
          </Link>

          <Link href="/dashboard/sumber" className="flex items-center gap-4 p-4 rounded-xl text-slate-600 hover:bg-slate-100 transition-all font-medium">
            <Library size={24} /> Pustaka Ilmiah
          </Link>

          <Link href="/dashboard/ketulenan" className="flex items-center gap-4 p-4 rounded-xl text-slate-600 hover:bg-slate-100 transition-all font-medium">
            <Search size={24} /> Semakan Ketulenan
          </Link>

          {/* Garis Pemisah Visual */}
          <div className="border-t border-slate-200 my-2"></div> 

          <Link href="/dashboard/pentadbir" className="flex items-center gap-4 p-4 rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:shadow-sm transition-all font-bold border border-emerald-100">
            <ShieldCheck size={24} /> Panel Pentadbir
          </Link>
          
        </nav>
        
        {/* Bahagian bawah Sidebar yang dikemaskini */}
        <div className="p-4 mb-4 space-y-2 mt-auto shrink-0">
          
          <Link href="/dashboard/panduan" className="flex items-center gap-4 p-4 rounded-xl text-slate-600 hover:bg-slate-100 transition-all font-medium">
            <BookMarked size={24} /> Panduan Pengguna
          </Link>

          <Link href="/dashboard/tetapan" className="flex items-center gap-4 p-4 rounded-xl text-slate-600 hover:bg-slate-100 transition-all font-medium">
            <Settings size={24} /> Profil & Tetapan
          </Link>
          
          <button 
            onClick={tanganiLogKeluar}
            className="w-full flex items-center gap-4 p-4 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-all font-medium"
          >
            <LogOut size={24} /> Log Keluar
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}