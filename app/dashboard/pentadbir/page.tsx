"use client";

import { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle, Clock, FileSignature, Loader2, Check, Search, Eye } from 'lucide-react';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import Link from 'next/link';

interface Kajian {
  id: string;
  tajukKajian: string;
  fokusKajian: string;
  status: string;
  namaGuru?: string;
}

export default function PanelPentadbir() {
  const [senaraiKajian, setSenaraiKajian] = useState<Kajian[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    ambilData();
  }, []);

  const ambilData = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "kajian_tindakan"), orderBy("tarikhDicipta", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Kajian[];
      setSenaraiKajian(data);
    } catch (error) {
      console.error("Ralat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // FUNGSI MAGIS: Butang Kelulusan Pentadbir
  const luluskanKajian = async (id: string) => {
    const sah = window.confirm("Adakah tuan/puan pasti untuk mengesahkan laporan kajian tindakan ini?");
    if (!sah) return;

    setIsProcessing(id);
    try {
      await updateDoc(doc(db, "kajian_tindakan", id), {
        status: "Telah Disahkan",
        tarikhDisahkan: new Date().toISOString(),
        namaPengesah: "Ketua Jabatan / Pengetua" // Ini boleh dinamik jika ada sistem login
      });
      
      // Kemaskini paparan terus tanpa perlu refresh
      setSenaraiKajian(prev => prev.map(k => k.id === id ? { ...k, status: "Telah Disahkan" } : k));
    } catch (error) {
      alert("Gagal mengesahkan kajian. Sila cuba lagi.");
    } finally {
      setIsProcessing(null);
    }
  };

  // Tapis data mengikut kategori kelulusan
  const perlukanTindakan = senaraiKajian.filter(k => k.status === 'Selesai' || k.status === 'Menunggu Pengesahan');
  const telahDisahkan = senaraiKajian.filter(k => k.status === 'Telah Disahkan');

  return (
    <div className="max-w-6xl mx-auto pb-12">
      
      {/* Pengepala Eksklusif Pentadbir */}
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full mix-blend-screen filter blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 mb-2">
            <ShieldCheck className="text-emerald-400" size={36} /> 
            Panel Pengesahan Pentadbir
          </h1>
          <p className="text-slate-300 font-medium">Pusat semakan dan kelulusan rasmi Laporan Kajian Tindakan KPM.</p>
        </div>
        <div className="relative z-10 bg-slate-800 border border-slate-700 px-6 py-3 rounded-xl flex items-center gap-3">
          <FileSignature className="text-amber-400" size={24} />
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Menunggu Semakan</p>
            <p className="text-2xl font-black text-white">{perlukanTindakan.length} Fail</p>
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-20 text-slate-500">
          <Loader2 className="animate-spin mb-4 text-emerald-500" size={40} />
          <p className="font-medium text-lg">Menarik rekod rasmi pangkalan data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* KOLUM KIRI: Menunggu Kelulusan (Peti Masuk Pentadbir) */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-2">
              <Clock className="text-amber-500" /> Perlu Tindakan Kelulusan
            </h2>
            
            {perlukanTindakan.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 text-center flex flex-col items-center">
                <CheckCircle size={48} className="text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium">Tiada laporan baharu yang menunggu pengesahan.</p>
              </div>
            ) : (
              perlukanTindakan.map(kajian => (
                <div key={kajian.id} className="bg-white rounded-2xl shadow-sm border border-amber-200 p-6 flex flex-col relative overflow-hidden group transition-all hover:shadow-md">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
                  
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                      Semakan Tertunggak
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{kajian.tajukKajian}</h3>
                  <p className="text-sm text-slate-500 mb-6 line-clamp-2">Fokus: {kajian.fokusKajian}</p>
                  
                  <div className="flex gap-3 mt-auto">
                    {/* Butang Lihat Laporan */}
                    <Link 
                      href={`/laporan/${kajian.id}`}
                      target="_blank"
                      className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 px-4 py-2.5 rounded-xl font-bold text-sm transition-all"
                    >
                      <Eye size={18} /> Semak PDF
                    </Link>
                    
                    {/* Butang Luluskan (Cop Rasmi) */}
                    <button 
                      onClick={() => luluskanKajian(kajian.id)}
                      disabled={isProcessing === kajian.id}
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm disabled:opacity-70"
                    >
                      {isProcessing === kajian.id ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                      {isProcessing === kajian.id ? "Mengesahkan..." : "Sah & Luluskan"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* KOLUM KANAN: Sejarah Kelulusan (Arkib Pentadbir) */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-2">
              <ShieldCheck className="text-emerald-600" /> Telah Disahkan
            </h2>

            {telahDisahkan.length === 0 ? (
              <div className="bg-transparent border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center">
                <p className="text-slate-400 font-medium">Belum ada sebarang kajian yang disahkan.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
                {telahDisahkan.map(kajian => (
                  <div key={kajian.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <h4 className="font-bold text-slate-700 text-md line-clamp-1 mb-1">{kajian.tajukKajian}</h4>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded">Diperakui Rasmi</span>
                    </div>
                    <Link href={`/laporan/${kajian.id}`} target="_blank" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <FileSignature size={20} />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}