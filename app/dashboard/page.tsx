"use client";

import { useEffect, useState } from 'react';
import { FileText, Clock, CheckCircle, Loader2, TrendingUp, BarChart3 } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Link from 'next/link';

interface Kajian {
  id: string;
  tajukKajian: string;
  fokusKajian: string;
  status: string;
}

export default function Dashboard() {
  const [senaraiKajian, setSenaraiKajian] = useState<Kajian[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const ambilDataKajian = async () => {
      try {
        const q = query(collection(db, "kajian_tindakan"), orderBy("tarikhDicipta", "desc"));
        const snapshot = await getDocs(q);
        
        const dataSementara: Kajian[] = [];
        snapshot.forEach((doc) => {
          dataSementara.push({
            id: doc.id,
            tajukKajian: doc.data().tajukKajian || "Tiada Tajuk",
            fokusKajian: doc.data().fokusKajian || "Tiada rekod fokus",
            status: doc.data().status || "Draf"
          });
        });
        
        setSenaraiKajian(dataSementara);
      } catch (error) {
        console.error("Ralat menyedut data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    ambilDataKajian();
  }, []);

  // Pengiraan Statistik
  const jumlahKajian = senaraiKajian.length;
  const selesaiKajian = senaraiKajian.filter(k => k.status === 'Selesai').length;
  const aktifKajian = jumlahKajian - selesaiKajian; // Draf + Sedang Dijalankan
  
  // Pengiraan Peratusan untuk Carta Donut (Elak NaN jika jumlah = 0)
  const peratusSelesai = jumlahKajian === 0 ? 0 : Math.round((selesaiKajian / jumlahKajian) * 100);

  return (
    <div className="max-w-6xl mx-auto pb-12">
      
      {/* Pengepala Utama */}
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-800">Selamat Datang, Cikgu! 👋</h1>
        <p className="text-lg text-slate-600 mt-2">Pusat kawalan utama pengurusan Kajian Tindakan KPM anda.</p>
      </header>

      {/* SEKSYEN ANALITIK (Grid Atas) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        
        {/* Kolum Kiri: 3 Kotak Statistik (Mengambil 2 ruang grid pada skrin besar) */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-500"><FileText size={100} /></div>
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4"><FileText size={24} /></div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Jumlah Kajian</p>
            <p className="text-4xl font-black text-slate-800">{isLoading ? "-" : jumlahKajian}</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-500"><Clock size={100} /></div>
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4"><Clock size={24} /></div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Sedang Aktif</p>
            <p className="text-4xl font-black text-slate-800">{isLoading ? "-" : aktifKajian}</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-500"><CheckCircle size={100} /></div>
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4"><CheckCircle size={24} /></div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Selesai (Arkib)</p>
            <p className="text-4xl font-black text-slate-800">{isLoading ? "-" : selesaiKajian}</p>
          </div>
        </div>

        {/* Kolum Kanan: Carta Progres (Donut Chart) */}
        <div className="bg-slate-900 rounded-2xl shadow-md p-6 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Kesan Cahaya Latar (Glow) */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full mix-blend-screen filter blur-[50px] opacity-40"></div>
          
          <h3 className="text-slate-300 font-bold uppercase tracking-widest text-sm mb-6 z-10">Kadar Siap Keseluruhan</h3>
          
          {/* Carta SVG Tulen */}
          <div className="relative w-36 h-36 flex items-center justify-center z-10">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <path
                className="text-slate-700"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-400 transition-all duration-1000 ease-out"
                strokeDasharray={`${peratusSelesai}, 100`}
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            {/* Teks Peratus di Tengah */}
            <div className="absolute flex flex-col items-center justify-center text-white">
              <span className="text-3xl font-black">{peratusSelesai}%</span>
            </div>
          </div>
        </div>

      </div>

      {/* SEKSYEN SENARAI: Kajian Terkini */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <TrendingUp className="text-blue-600" /> Aktiviti Terkini
        </h2>
        <Link href="/dashboard/arkib" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
          Lihat Semua Arkib &rarr;
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[200px]">
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-500">
            <Loader2 className="animate-spin mb-4 text-blue-500" size={40} />
            <p className="font-medium">Memuat turun data papan pemuka...</p>
          </div>
        ) : senaraiKajian.length === 0 ? (
          <div className="p-16 text-center text-slate-500 flex flex-col items-center">
            <BarChart3 size={60} className="text-slate-300 mb-4" />
            <p className="text-xl font-bold text-slate-700 mb-2">Papan Pemuka Kosong</p>
            <p className="text-md max-w-md mx-auto">Anda belum mempunyai sebarang projek Kajian Tindakan. Buka langkah pertama anda dengan menekan butang Kertas Baharu di menu.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {senaraiKajian.slice(0, 5).map((kajian) => (
              <Link 
                href={`/dashboard/kajian/${kajian.id}`} 
                key={kajian.id} 
                className="block p-6 hover:bg-blue-50 cursor-pointer transition-colors group"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-700 transition-colors mb-1">{kajian.tajukKajian}</h3>
                    <p className="text-sm text-slate-500 line-clamp-1">Fokus: {kajian.fokusKajian}</p>
                  </div>
                  <span className={`px-4 py-1.5 text-xs font-bold rounded-full whitespace-nowrap tracking-wide uppercase shadow-sm
                    ${kajian.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {kajian.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
        
      </div>
    </div>
  );
}