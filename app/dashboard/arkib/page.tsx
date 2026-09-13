"use client";

import { useEffect, useState } from 'react';
import { BookOpen, CheckCircle, Loader2, Download, Search, Plus, FileImage, Activity } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import Link from 'next/link';

interface Kajian {
  id: string;
  tajukKajian: string;
  fokusKajian: string;
  status: string;
}

export default function ArkibKajian() {
  const [senaraiArkib, setSenaraiArkib] = useState<Kajian[]>([]);
  const [senaraiTapis, setSenaraiTapis] = useState<Kajian[]>([]); // Untuk carian
  const [isLoading, setIsLoading] = useState(true);
  const [kataKunci, setKataKunci] = useState("");

  useEffect(() => {
    const ambilDataArkib = async () => {
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
        
        setSenaraiArkib(dataSementara);
        setSenaraiTapis(dataSementara); // Salinan untuk carian
      } catch (error) {
        console.error("Ralat menyedut data arkib:", error);
      } finally {
        setIsLoading(false);
      }
    };

    ambilDataArkib();
  }, []);

  // Fungsi untuk menguruskan carian masa sebenar (real-time)
  const urusCarian = (e: React.ChangeEvent<HTMLInputElement>) => {
    const teks = e.target.value;
    setKataKunci(teks);
    
    const hasilTapis = senaraiArkib.filter(kajian => 
      kajian.tajukKajian.toLowerCase().includes(teks.toLowerCase()) || 
      kajian.fokusKajian.toLowerCase().includes(teks.toLowerCase())
    );
    setSenaraiTapis(hasilTapis);
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      
      {/* Pengepala berserta Butang Kertas Baharu */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800 flex items-center gap-3">
            <BookOpen className="text-emerald-600" size={36} /> 
            Arkib Laporan
          </h1>
          <p className="text-lg text-slate-600 mt-2">Koleksi pengurusan Kertas Kajian Tindakan anda.</p>
        </div>
        
        <Link 
          href="/dashboard/kertas-baru"
          className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm"
        >
          <Plus size={20} />
          Kertas Baharu
        </Link>
      </div>

      {/* Kotak Carian Aktif */}
      <div className="relative w-full mb-6">
        <input 
          type="text" 
          value={kataKunci}
          onChange={urusCarian}
          placeholder="Cari tajuk atau fokus kajian dalam arkib..." 
          className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-700 font-medium shadow-sm"
        />
        <Search className="absolute left-4 top-4 text-slate-400" size={24} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 text-slate-500">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="text-lg">Menyelongkar bilik arkib...</p>
          </div>
        ) : senaraiTapis.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-center text-slate-500">
            <CheckCircle className="text-slate-300 mb-4" size={60} />
            <p className="text-xl font-bold text-slate-600 mb-2">Tiada Rekod Dijumpai</p>
            <p className="text-md">Sila tambah kajian baharu atau cuba kata kunci carian yang lain.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {senaraiTapis.map((kajian) => (
              <div key={kajian.id} className="p-6 md:p-8 hover:bg-slate-50 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
                
                <div className="flex-1">
                  {/* Lencana Status Dinamik */}
                  <span className={`px-3 py-1 text-xs font-bold rounded-full mb-3 inline-block uppercase tracking-wide
                    ${kajian.status === "Selesai" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {kajian.status}
                  </span>
                  <h3 className="font-bold text-xl text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">{kajian.tajukKajian}</h3>
                  <p className="text-md text-slate-500 line-clamp-2">Fokus: {kajian.fokusKajian}</p>
                </div>
                
                {/* Barisan Butang Tindakan */}
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                  
                  {/* Buka Bilik Gerakan */}
                  <Link 
                    href={`/dashboard/kajian/${kajian.id}`}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all"
                  >
                    <Activity size={18} /> Buka Kitaran
                  </Link>

                  {/* Cetak OPR (One Page Report) - SUDAH DIBUKA KUNCINYA */}
                  <Link 
                    href={`/dashboard/opr/${kajian.id}`}
                    target="_blank"
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-all shadow-sm"
                  >
                    <FileImage size={18} /> OPR
                  </Link>

                  {/* Jana Laporan Penuh PDF */}
                  <Link 
                    href={`/laporan/${kajian.id}`}
                    target="_blank" 
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all shadow-sm"
                  >
                    <Download size={18} /> Laporan
                  </Link>
                  
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}