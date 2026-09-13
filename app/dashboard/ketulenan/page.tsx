"use client";

import { useState } from 'react';
import { ShieldCheck, Search, FileText, CheckCircle, AlertTriangle, Loader2, Award, Lock } from 'lucide-react';

export default function SemakanKetulenan() {
  const [teksLaporan, setTeksLaporan] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  
  // State untuk menyimpan keputusan imbasan
  const [keputusan, setKeputusan] = useState<{asli: number, ciplak: number, status: string} | null>(null);

  // Fungsi Simulasi Imbasan (Dalam sistem sebenar, ini akan bersambung ke API Plagiarism)
  const jalankanImbasan = () => {
    if (teksLaporan.trim().length < 50) {
      alert("Sila masukkan sekurang-kurangnya 50 patah perkataan untuk imbasan yang tepat.");
      return;
    }

    setIsScanning(true);
    setKeputusan(null);

    // Simulasi AI sedang menyemak pangkalan data KPM & Internet (3 saat)
    setTimeout(() => {
      // Untuk demo, kita buat sistem memberikan markah ketulenan tinggi rawak (antara 85% - 98%)
      const peratusAsli = Math.floor(Math.random() * (98 - 85 + 1)) + 85;
      const peratusCiplak = 100 - peratusAsli;
      
      let statusTeks = "Cemerlang";
      if (peratusAsli < 90) statusTeks = "Sederhana (Perlu Pembaikan)";

      setKeputusan({
        asli: peratusAsli,
        ciplak: peratusCiplak,
        status: statusTeks
      });
      setIsScanning(false);
    }, 3000);
  };

  const resetImbasan = () => {
    setTeksLaporan("");
    setKeputusan(null);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-800 flex items-center gap-3">
          <ShieldCheck className="text-emerald-600" size={36} /> 
          Enjin Semakan Ketulenan
        </h1>
        <p className="text-lg text-slate-600 mt-2">
          Imbas refleksi dan laporan anda untuk memastikan ia bebas daripada unsur plagiat atau ciplakan sebelum dihantar ke panel KPM.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* BAHAGIAN KIRI: Ruang Input Teks */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
            <FileText size={20} className="text-slate-500" />
            <span className="font-bold text-slate-700">Teks Laporan / Refleksi</span>
          </div>
          
          <textarea 
            value={teksLaporan}
            onChange={(e) => setTeksLaporan(e.target.value)}
            disabled={isScanning || keputusan !== null}
            placeholder="Salin (copy) dan tampal (paste) perenggan Fokus Kajian atau Refleksi anda di sini untuk diimbas..."
            className="w-full h-80 p-6 outline-none resize-none bg-transparent text-slate-700 leading-relaxed disabled:bg-slate-50"
          ></textarea>

          <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {teksLaporan.length} Aksara
            </span>
            
            {keputusan === null ? (
              <button 
                onClick={jalankanImbasan}
                disabled={isScanning || teksLaporan.length === 0}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isScanning ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                {isScanning ? "Mengimbas Pangkalan Data..." : "Jalankan Imbasan"}
              </button>
            ) : (
              <button 
                onClick={resetImbasan}
                className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-xl font-bold transition-all"
              >
                Imbas Teks Baharu
              </button>
            )}
          </div>
        </div>

        {/* BAHAGIAN KANAN: Papan Pemuka Keputusan */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Kad Status Bersedia / Scanning */}
          {keputusan === null && (
            <div className="bg-slate-900 rounded-2xl p-8 text-center text-slate-400 border border-slate-800 flex-1 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-50"></div>
              {isScanning ? (
                <>
                  <div className="relative mb-6">
                    <div className="w-24 h-24 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                    <Search className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-emerald-500" size={32} />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2 animate-pulse">Sedang Menganalisis...</h3>
                  <p className="text-sm">Menyemak silang dengan Bank Inovasi KPM dan pangkalan data Jurnal Tempatan.</p>
                </>
              ) : (
                <>
                  <Lock size={64} className="mb-4 opacity-20" />
                  <h3 className="text-white font-bold text-xl mb-2">Sistem Bersedia</h3>
                  <p className="text-sm">Masukkan teks dan tekan butang imbas untuk mendapatkan peratusan ketulenan.</p>
                </>
              )}
            </div>
          )}

          {/* Kad Keputusan (Sijil Ketulenan) */}
          {keputusan !== null && (
            <div className="bg-white rounded-2xl shadow-lg border-2 border-emerald-500 p-1 flex flex-col h-full relative overflow-hidden animate-in fade-in zoom-in duration-500">
              <div className="bg-emerald-50 p-6 rounded-t-xl text-center border-b border-emerald-100 relative">
                <Award size={60} className="mx-auto text-emerald-500 mb-2 drop-shadow-sm" />
                <h2 className="text-2xl font-black text-emerald-800 tracking-tight">SIJIL KETULENAN</h2>
                <p className="text-emerald-600 text-sm font-bold mt-1 uppercase">Sistem Pintar Kajian Tindakan</p>
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">Kandungan Asli</span>
                  <span className="text-3xl font-black text-emerald-600">{keputusan.asli}%</span>
                </div>
                
                {/* Progress Bar Asli */}
                <div className="w-full bg-slate-100 rounded-full h-4 mb-6 overflow-hidden flex">
                  <div className="bg-emerald-500 h-4 rounded-full" style={{ width: `${keputusan.asli}%` }}></div>
                </div>

                <div className="flex justify-between items-end mb-2">
                  <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">Potensi Plagiat/Ciplak</span>
                  <span className="text-xl font-bold text-rose-500">{keputusan.ciplak}%</span>
                </div>
                
                {/* Progress Bar Ciplak */}
                <div className="w-full bg-slate-100 rounded-full h-2 mb-6 overflow-hidden">
                  <div className="bg-rose-500 h-2 rounded-full" style={{ width: `${keputusan.ciplak}%` }}></div>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-100 text-center">
                  {keputusan.asli >= 90 ? (
                    <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold">
                      <CheckCircle size={20} /> Laporan Lulus Standard KPM
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-amber-600 font-bold text-sm">
                      <AlertTriangle size={20} /> Perlu Olahan Semula (Parafrasa)
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}