"use client";

import { useEffect, useState } from 'react';
import { Globe, Search, BookOpen, ThumbsUp, Download, Filter, Star, Loader2, Sparkles } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

export default function BankInovasi() {
  const [senaraiKajian, setSenaraiKajian] = useState<any[]>([]);
  const [carian, setCarian] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const ambilData = async () => {
      try {
        const q = query(collection(db, "kajian_tindakan"), orderBy("tarikhDicipta", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSenaraiKajian(data);
      } catch (error) {
        console.error("Ralat:", error);
      } finally {
        setIsLoading(false);
      }
    };
    ambilData();
  }, []);

  // Tapis kajian berdasarkan input carian
  const kajianDitapis = senaraiKajian.filter(k => 
    (k.tajukKajian?.toLowerCase() || "").includes(carian.toLowerCase()) ||
    (k.fokusKajian?.toLowerCase() || "").includes(carian.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto pb-12">
      
      {/* Pengepala Galeri (Hero Section) */}
      <header className="mb-10 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-10 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-[60px] opacity-20 -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400 rounded-full mix-blend-overlay filter blur-[40px] opacity-30 translate-y-1/2 -translate-x-1/4"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="bg-white/20 text-blue-50 px-4 py-1.5 rounded-full text-sm font-bold tracking-widest uppercase mb-4 inline-block backdrop-blur-sm border border-white/10">
              Galeri Amalan Terbaik KPM
            </span>
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">Bank Inovasi & Repositori Kajian</h1>
            <p className="text-blue-100 text-lg leading-relaxed">
              Terokai, jadikan inspirasi, dan kongsi amalan terbaik pedagogi bersama komuniti pendidik seluruh negara. Jangan biarkan inovasi anda tinggal habuk!
            </p>
          </div>
          <div className="hidden md:flex w-32 h-32 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl items-center justify-center transform rotate-6 shadow-xl">
            <Globe size={64} className="text-white drop-shadow-md" />
          </div>
        </div>
      </header>

      {/* Bar Carian & Penapis */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari tajuk kajian, subjek, atau fokus intervensi..."
            value={carian}
            onChange={(e) => setCarian(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 font-medium transition-all"
          />
        </div>
        <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-4 rounded-2xl shadow-sm hover:bg-slate-50 font-bold transition-all shrink-0">
          <Filter size={20} /> Tapis Kajian
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col h-64 items-center justify-center text-blue-500 gap-4">
          <Loader2 className="animate-spin" size={40} />
          <p className="font-semibold text-slate-500">Memuatkan khazanah inovasi...</p>
        </div>
      ) : (
        <>
          {kajianDitapis.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-16 text-center">
              <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-700 mb-2">Tiada Rekod Ditemui</h3>
              <p className="text-slate-500">Cuba gunakan kata kunci carian yang lain.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {kajianDitapis.map((kajian, index) => (
                <div key={kajian.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  
                  {/* Kad Header (Kategori / Status) */}
                  <div className={`p-4 flex justify-between items-center ${
                    kajian.status === 'Telah Disahkan' ? 'bg-emerald-50' : 'bg-slate-50'
                  } border-b border-slate-100`}>
                    <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-slate-600 shadow-sm border border-slate-200 flex items-center gap-1">
                      <Sparkles size={14} className="text-amber-500" /> Pendidikan
                    </span>
                    {kajian.status === 'Telah Disahkan' && (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-100 px-2 py-1 rounded-md">
                        <Star size={12} className="fill-emerald-600" /> Diperakui
                      </span>
                    )}
                  </div>

                  {/* Isi Kad */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors">
                      {kajian.tajukKajian || "Kajian Tindakan Tanpa Tajuk"}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-3 mb-6 leading-relaxed flex-1">
                      {kajian.fokusKajian || "Tiada ringkasan fokus kajian direkodkan. Sila semak butiran lanjut di dalam laporan penuh."}
                    </p>
                    
                    {/* Interaksi Bawah Kad */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex gap-3">
                        <button className="flex items-center gap-1.5 text-slate-400 hover:text-rose-500 transition-colors text-sm font-semibold">
                          <ThumbsUp size={18} /> {12 + (index * 3)}
                        </button>
                        <button className="flex items-center gap-1.5 text-slate-400 hover:text-blue-500 transition-colors text-sm font-semibold">
                          <Download size={18} /> OPR
                        </button>
                      </div>
                      <button className="text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors">
                        Baca Laporan
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}