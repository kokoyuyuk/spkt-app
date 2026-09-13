"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore'; 
import { db } from '../../../../lib/firebase';
import { Printer, Loader2, Target, Users, Lightbulb, TrendingUp, Activity, ShieldCheck } from 'lucide-react';

export default function CetakOPR() {
  const params = useParams();
  const id = params.id as string;
  const [kajian, setKajian] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ambilData = async () => {
      try {
        const docSnap = await getDoc(doc(db, "kajian_tindakan", id));
        if (docSnap.exists()) {
          setKajian(docSnap.data());
        }
      } catch (error) {
        console.error("Ralat:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) ambilData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-500">
        <Loader2 className="animate-spin mr-3" size={30} /> Menjana infografik premium...
      </div>
    );
  }

  if (!kajian) return <div className="p-20 text-center text-red-600 font-bold">Kajian tidak dijumpai.</div>;

  return (
    <div className="min-h-screen bg-slate-300 py-10 print:bg-white print:py-0">
      
      {/* Bar Navigasi (Hilang bila print) */}
      <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center print:hidden bg-white p-4 rounded-xl shadow-md border-l-4 border-amber-500">
        <p className="text-slate-600 font-medium text-sm flex items-center gap-2">
          <ShieldCheck className="text-emerald-500" size={18} />
          Cetak One Page Report (OPR) ini. Pastikan <b>'Background graphics'</b> diaktifkan dalam tetapan pencetak.
        </p>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-amber-500 text-slate-900 px-6 py-2.5 rounded-lg font-bold hover:bg-amber-600 transition shadow-sm"
        >
          <Printer size={18} /> Cetak OPR Premium
        </button>
      </div>

      {/* Kanvas OPR (A4 Portrait) */}
      {/* Gaya style WebkitPrintColorAdjust memaksa warna dicetak dengan sempurna */}
      <div 
        className="max-w-[794px] mx-auto bg-slate-50 shadow-2xl min-h-[1122px] print:shadow-none print:w-full flex flex-col relative overflow-hidden"
        style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
      >
        
        {/* Pengepala OPR Eksklusif (Dark Mode) */}
        <div className="bg-slate-900 p-10 relative overflow-hidden">
          {/* Corak hiasan latar belakang */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full mix-blend-screen filter blur-[80px] opacity-40 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-600 rounded-full mix-blend-screen filter blur-[60px] opacity-30 translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="flex justify-between items-start mb-6 relative z-10">
            <span className="bg-amber-500 text-slate-900 px-4 py-1.5 rounded-sm text-xs font-black uppercase tracking-widest shadow-md">
              One Page Report (OPR)
            </span>
            <span className="text-sm font-bold text-slate-400 tracking-widest">TAHUN: {new Date().getFullYear()}</span>
          </div>
          
          <h1 className="text-4xl font-black text-white leading-tight mb-6 uppercase relative z-10 drop-shadow-md">
            {kajian.tajukKajian}
          </h1>
          
          <div className="inline-flex items-center gap-3 bg-slate-800/80 border border-slate-700 px-5 py-2.5 rounded-lg relative z-10 shadow-inner">
            <Users size={20} className="text-amber-400" />
            <span className="text-slate-300 font-medium text-sm tracking-wide">
              KUMPULAN SASARAN: <span className="text-white font-bold">{kajian.kumpulanSasaran || "Tidak dinyatakan"}</span>
            </span>
          </div>
        </div>

        {/* Susunan Grid (Dua Lajur) dengan Jarak Seragam */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
          
          {/* LAJUR KIRI */}
          <div className="flex flex-col gap-6">
            
            {/* 1. Isu Keprihatinan */}
            <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-rose-700 to-rose-500 p-3.5 flex items-center gap-3 text-white border-b border-rose-800/20">
                <Target size={20} className="text-rose-100" />
                <h2 className="text-sm font-bold uppercase tracking-widest">1. Isu / Masalah Utama</h2>
              </div>
              <div className="p-5 grow text-slate-700 text-sm leading-relaxed text-justify">
                {kajian.fokusKajian || "Tiada data isu direkodkan."}
              </div>
            </div>

            {/* 2. Objektif Kajian */}
            <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-3.5 flex items-center gap-3 text-white border-b border-blue-800/20">
                <Lightbulb size={20} className="text-blue-100" />
                <h2 className="text-sm font-bold uppercase tracking-widest">2. Objektif Kajian</h2>
              </div>
              <div className="p-5 grow text-slate-700 text-sm leading-relaxed text-justify space-y-3">
                {kajian.objektifAm && (
                  <div>
                    <span className="font-bold text-blue-900 block mb-1 text-xs uppercase tracking-wide">Objektif Am</span>
                    <p>{kajian.objektifAm}</p>
                  </div>
                )}
                {kajian.objektifKhusus && (
                  <div>
                    <span className="font-bold text-blue-900 block mb-1 text-xs uppercase tracking-wide">Objektif Khusus</span>
                    <p className="whitespace-pre-wrap">{kajian.objektifKhusus}</p>
                  </div>
                )}
                {!kajian.objektifAm && !kajian.objektifKhusus && <p>Tiada rekod objektif.</p>}
              </div>
            </div>

          </div>

          {/* LAJUR KANAN */}
          <div className="flex flex-col gap-6">
            
            {/* 3. Ringkasan Pelaksanaan */}
            <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[200px]">
              <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 p-3.5 flex items-center gap-3 text-white border-b border-emerald-800/20">
                <Activity size={20} className="text-emerald-100" />
                <h2 className="text-sm font-bold uppercase tracking-widest">3. Ringkasan Intervensi</h2>
              </div>
              <div className="p-5 grow text-slate-700 text-sm leading-relaxed text-justify">
                {kajian.pelanTindakan || kajian.catatanTindakan || "Data pelaksanaan intervensi masih belum dilengkapkan dalam bilik kitaran."}
              </div>
            </div>

            {/* 4. Dapatan & Impak */}
            <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[200px]">
              <div className="bg-gradient-to-r from-purple-700 to-purple-500 p-3.5 flex items-center gap-3 text-white border-b border-purple-800/20">
                <TrendingUp size={20} className="text-purple-100" />
                <h2 className="text-sm font-bold uppercase tracking-widest">4. Dapatan & Impak</h2>
              </div>
              <div className="p-5 grow text-slate-700 text-sm leading-relaxed text-justify">
                {kajian.analisisPemerhatian || kajian.refleksiKajian || "Data impak dan pemerhatian masih dalam proses pengumpulan."}
              </div>
            </div>

          </div>

        </div>

        {/* Pengaki Rasmi (Footer) */}
        <div className="mt-auto border-t-[8px] border-amber-500 bg-slate-100 p-8 flex justify-between items-end">
          <div>
            <p className="text-xs text-slate-500 mb-1 tracking-wider uppercase font-semibold">Disediakan Oleh</p>
            <p className="font-black text-slate-800 uppercase tracking-wide text-lg">GURU PENYELIDIK SPKT</p>
            <p className="text-xs text-slate-500 mt-1">Sistem Pintar Kajian Tindakan KPM</p>
          </div>
          <div className="text-right flex flex-col items-end">
            <p className="text-xs text-slate-500 mb-2 tracking-wider uppercase font-semibold">Status Kajian</p>
            <span className={`px-4 py-1.5 rounded-sm text-xs font-bold uppercase tracking-widest text-white shadow-sm
              ${kajian.status === 'Selesai' ? 'bg-emerald-600' : 'bg-slate-700'}`}>
              {kajian.status || "DRAF"}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}