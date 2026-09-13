"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore'; 
import { db } from '../../../../lib/firebase';
import { Loader2, ArrowLeft, Lightbulb, Activity, Eye, BookOpen, Save } from 'lucide-react';
import Link from 'next/link';

export default function BilikKajian() {
  const params = useParams();
  const id = params.id as string;
  const [kajian, setKajian] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(1);
  
  // --- STATE FASA 1 (MERANCANG) ---
  const [pelanTindakan, setPelanTindakan] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // --- STATE FASA 2 (BERTINDAK) ---
  const [tarikhTindakan, setTarikhTindakan] = useState("");
  const [catatanTindakan, setCatatanTindakan] = useState("");
  const [isSavingTindakan, setIsSavingTindakan] = useState(false);

  // --- STATE FASA 3 (MEMERHATI) ---
  const [kaedahPemerhatian, setKaedahPemerhatian] = useState("Ujian Pra & Pasca");
  const [analisisPemerhatian, setAnalisisPemerhatian] = useState("");
  const [isSavingPemerhatian, setIsSavingPemerhatian] = useState(false);

  // --- STATE FASA 4 (MEREFLEK) ---
  const [refleksiKajian, setRefleksiKajian] = useState("");
  const [tindakanSusulan, setTindakanSusulan] = useState("Selesai (Tutup Kajian)");
  const [isSavingRefleksi, setIsSavingRefleksi] = useState(false);

  useEffect(() => {
    const ambilDataKajian = async () => {
      try {
        const docRef = doc(db, "kajian_tindakan", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setKajian(data);
          
          if (data.pelanTindakan) setPelanTindakan(data.pelanTindakan);
          if (data.tarikhTindakan) setTarikhTindakan(data.tarikhTindakan);
          if (data.catatanTindakan) setCatatanTindakan(data.catatanTindakan);
          if (data.kaedahPemerhatian) setKaedahPemerhatian(data.kaedahPemerhatian);
          if (data.analisisPemerhatian) setAnalisisPemerhatian(data.analisisPemerhatian);
          
          // Data Fasa 4
          if (data.refleksiKajian) setRefleksiKajian(data.refleksiKajian);
          if (data.tindakanSusulan) setTindakanSusulan(data.tindakanSusulan);
        }
      } catch (error) {
        console.error("Ralat menyedut kajian:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) ambilDataKajian();
  }, [id]);

  // FUNGSI SIMPAN FASA 1
  const handleSimpanMerancang = async () => {
    if (!pelanTindakan) return alert("Sila taip pelan intervensi.");
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "kajian_tindakan", id), { pelanTindakan });
      setKajian((prev: any) => ({ ...prev, pelanTindakan }));
      alert("Pelan intervensi Fasa 1 berjaya disimpan.");
    } catch (error) {
      alert("Gagal menyimpan data.");
    } finally {
      setIsSaving(false);
    }
  };

  // FUNGSI SIMPAN FASA 2
  const handleSimpanBertindak = async () => {
    if (!tarikhTindakan || !catatanTindakan) return alert("Sila lengkapkan tarikh dan catatan.");
    setIsSavingTindakan(true);
    try {
      await updateDoc(doc(db, "kajian_tindakan", id), { tarikhTindakan, catatanTindakan });
      setKajian((prev: any) => ({ ...prev, tarikhTindakan, catatanTindakan }));
      alert("Log pelaksanaan Fasa 2 berjaya direkodkan!");
    } catch (error) {
      alert("Gagal merekod log.");
    } finally {
      setIsSavingTindakan(false);
    }
  };

  // FUNGSI SIMPAN FASA 3
  const handleSimpanMemerhati = async () => {
    if (!analisisPemerhatian) return alert("Sila catat dapatan analisis anda.");
    setIsSavingPemerhatian(true);
    try {
      await updateDoc(doc(db, "kajian_tindakan", id), { kaedahPemerhatian, analisisPemerhatian });
      setKajian((prev: any) => ({ ...prev, kaedahPemerhatian, analisisPemerhatian }));
      alert("Dapatan data pemerhatian Fasa 3 berjaya disimpan!");
    } catch (error) {
      alert("Gagal menyimpan data pemerhatian.");
    } finally {
      setIsSavingPemerhatian(false);
    }
  };

  // FUNGSI SIMPAN FASA 4
  const handleSimpanMereflek = async () => {
    if (!refleksiKajian) return alert("Sila catat refleksi keseluruhan kajian.");
    setIsSavingRefleksi(true);
    try {
      const statusTerkini = tindakanSusulan === "Selesai (Tutup Kajian)" ? "Selesai" : "Sedang Dijalankan";
      
      await updateDoc(doc(db, "kajian_tindakan", id), { 
        refleksiKajian, 
        tindakanSusulan,
        status: statusTerkini
      });
      
      setKajian((prev: any) => ({ 
        ...prev, 
        refleksiKajian, 
        tindakanSusulan,
        status: statusTerkini
      }));
      
      alert(`Refleksi Fasa 4 berjaya disimpan! Status kajian: ${statusTerkini}`);
    } catch (error) {
      alert("Gagal menyimpan data refleksi.");
    } finally {
      setIsSavingRefleksi(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
        <Loader2 className="animate-spin mb-4 text-blue-600" size={40} />
        <p className="text-lg">Membuka Bilik Kajian...</p>
      </div>
    );
  }

  if (!kajian) return <div className="p-12 text-center text-red-500">Kajian tidak dijumpai!</div>;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <Link href="/dashboard/arkib" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-6 font-medium">
        <ArrowLeft size={20} /> Kembali ke Arkib
      </Link>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <span className={`px-3 py-1 text-xs font-bold rounded-full mb-4 inline-block uppercase tracking-widest ${kajian.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
          {kajian.status}
        </span>
        <h1 className="text-3xl font-extrabold text-slate-800 leading-tight mb-2">{kajian.tajukKajian}</h1>
        <p className="text-slate-600 text-lg">Fokus: {kajian.fokusKajian}</p>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        Kitaran 1 <span className="text-sm font-normal text-slate-500">(Model Kemmis & McTaggart)</span>
      </h2>

      {/* Baris Kotak Fasa Kitaran */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div onClick={() => setActiveStep(1)} className={`p-6 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden group ${activeStep === 1 ? 'bg-white border-blue-500 shadow-md' : 'bg-white border-slate-200 opacity-60 hover:opacity-100 hover:border-blue-300'}`}>
          <div className={`absolute top-0 right-0 p-4 transition-opacity ${activeStep === 1 ? 'opacity-20' : 'opacity-5 group-hover:opacity-10'}`}><Lightbulb size={60} className={activeStep === 1 ? "text-blue-600" : "text-slate-400"} /></div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mb-4 ${activeStep === 1 ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>1</div>
          <h3 className="font-bold text-lg text-slate-800 mb-1">Merancang</h3>
        </div>

        <div onClick={() => setActiveStep(2)} className={`p-6 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden group ${activeStep === 2 ? 'bg-white border-indigo-500 shadow-md' : 'bg-white border-slate-200 opacity-60 hover:opacity-100 hover:border-indigo-300'}`}>
          <div className={`absolute top-0 right-0 p-4 transition-opacity ${activeStep === 2 ? 'opacity-20' : 'opacity-5 group-hover:opacity-10'}`}><Activity size={60} className={activeStep === 2 ? "text-indigo-600" : "text-slate-400"} /></div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mb-4 ${activeStep === 2 ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>2</div>
          <h3 className="font-bold text-lg text-slate-800 mb-1">Bertindak</h3>
        </div>

        <div onClick={() => setActiveStep(3)} className={`p-6 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden group ${activeStep === 3 ? 'bg-white border-emerald-500 shadow-md' : 'bg-white border-slate-200 opacity-60 hover:opacity-100 hover:border-emerald-300'}`}>
          <div className={`absolute top-0 right-0 p-4 transition-opacity ${activeStep === 3 ? 'opacity-20' : 'opacity-5 group-hover:opacity-10'}`}><Eye size={60} className={activeStep === 3 ? "text-emerald-600" : "text-slate-400"} /></div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mb-4 ${activeStep === 3 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>3</div>
          <h3 className="font-bold text-lg text-slate-800 mb-1">Memerhati</h3>
        </div>

        <div onClick={() => setActiveStep(4)} className={`p-6 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden group ${activeStep === 4 ? 'bg-white border-purple-500 shadow-md' : 'bg-white border-slate-200 opacity-60 hover:opacity-100 hover:border-purple-300'}`}>
          <div className={`absolute top-0 right-0 p-4 transition-opacity ${activeStep === 4 ? 'opacity-20' : 'opacity-5 group-hover:opacity-10'}`}><BookOpen size={60} className={activeStep === 4 ? "text-purple-600" : "text-slate-400"} /></div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mb-4 ${activeStep === 4 ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-400'}`}>4</div>
          <h3 className="font-bold text-lg text-slate-800 mb-1">Mereflek</h3>
        </div>
      </div>

      {/* --- BORANG FASA 1, 2, 3 Sembunyi Untuk Jimat Ruang Visual (Sama Seperti Sebelum Ini) --- */}
      {activeStep === 1 && (
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-blue-50 border-b border-blue-100 p-6">
            <h3 className="text-xl font-bold text-blue-800 flex items-center gap-2"><Lightbulb className="text-blue-600" size={24} /> Fasa 1: Merancang (Plan)</h3>
          </div>
          <div className="p-6 md:p-8">
            <label className="block text-sm font-bold text-slate-700 mb-3">Langkah-langkah Intervensi</label>
            <textarea value={pelanTindakan} onChange={(e) => setPelanTindakan(e.target.value)} rows={6} className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-800 resize-y mb-6" />
            <div className="flex justify-end">
              <button onClick={handleSimpanMerancang} disabled={isSaving} className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md disabled:bg-slate-400">
                {isSaving ? <><Loader2 className="animate-spin" size={20} /> Menyimpan...</> : <><Save size={20} /> Simpan Pelan</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeStep === 2 && (
        <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-indigo-50 border-b border-indigo-100 p-6">
            <h3 className="text-xl font-bold text-indigo-800 flex items-center gap-2"><Activity className="text-indigo-600" size={24} /> Fasa 2: Bertindak (Act)</h3>
          </div>
          <div className="p-6 md:p-8 space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Tarikh Pelaksanaan (Mula)</label>
              <input type="date" value={tarikhTindakan} onChange={(e) => setTarikhTindakan(e.target.value)} className="w-full md:w-1/3 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-800" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Catatan Pelaksanaan (Log Lapangan)</label>
              <textarea value={catatanTindakan} onChange={(e) => setCatatanTindakan(e.target.value)} rows={5} className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-800 resize-y" />
            </div>
            <div className="flex justify-end pt-4">
              <button onClick={handleSimpanBertindak} disabled={isSavingTindakan} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md disabled:bg-slate-400">
                {isSavingTindakan ? <><Loader2 className="animate-spin" size={20} /> Menyimpan...</> : <><Save size={20} /> Simpan Log Tindakan</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeStep === 3 && (
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-emerald-50 border-b border-emerald-100 p-6">
            <h3 className="text-xl font-bold text-emerald-800 flex items-center gap-2"><Eye className="text-emerald-600" size={24} /> Fasa 3: Memerhati (Observe)</h3>
          </div>
          <div className="p-6 md:p-8 space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Kaedah Pemerhatian / Instrumen Data</label>
              <select value={kaedahPemerhatian} onChange={(e) => setKaedahPemerhatian(e.target.value)} className="w-full md:w-1/2 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-800 bg-white">
                <option value="Ujian Pra & Pasca">Ujian Pra & Pasca (Markah)</option>
                <option value="Senarai Semak Pemerhatian">Senarai Semak Pemerhatian Lapangan</option>
                <option value="Temu Bual Murid">Temu Bual / Soal Selidik Murid</option>
                <option value="Analisis Dokumen Hasil Kerja">Analisis Dokumen / Hasil Kerja Murid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Dapatan & Analisis Data</label>
              <textarea value={analisisPemerhatian} onChange={(e) => setAnalisisPemerhatian(e.target.value)} rows={6} className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-800 resize-y" />
            </div>
            <div className="flex justify-end pt-4">
              <button onClick={handleSimpanMemerhati} disabled={isSavingPemerhatian} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md disabled:bg-slate-400">
                {isSavingPemerhatian ? <><Loader2 className="animate-spin" size={20} /> Menyimpan...</> : <><Save size={20} /> Simpan Data Pemerhatian</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- BORANG FASA 4 (MEREFLEK) --- */}
      {activeStep === 4 && (
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-purple-50 border-b border-purple-100 p-6">
            <h3 className="text-xl font-bold text-purple-800 flex items-center gap-2">
              <BookOpen className="text-purple-600" size={24} /> Fasa 4: Mereflek (Reflect)
            </h3>
            <p className="text-purple-700/80 mt-1 text-sm">Nilai keberkesanan intervensi dan tentukan tindakan susulan.</p>
          </div>
          
          <div className="p-6 md:p-8 space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Refleksi Keseluruhan Kitaran 1</label>
              <p className="text-xs text-slate-500 mb-3">Adakah intervensi ini berjaya mengatasi masalah keprihatinan awal kawan?</p>
              <textarea 
                value={refleksiKajian}
                onChange={(e) => setRefleksiKajian(e.target.value)}
                rows={6}
                placeholder="Secara keseluruhannya, penggunaan intervensi ini telah berjaya..."
                className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all text-slate-800 resize-y"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Tindakan Susulan</label>
              <select 
                value={tindakanSusulan}
                onChange={(e) => setTindakanSusulan(e.target.value)}
                className="w-full md:w-1/2 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all text-slate-800 bg-white"
              >
                <option value="Selesai (Tutup Kajian)">Kajian Selesai (Intervensi Berjaya)</option>
                <option value="Teruskan ke Kitaran 2">Teruskan ke Kitaran 2 (Perlu penambahbaikan)</option>
              </select>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                onClick={handleSimpanMereflek}
                disabled={isSavingRefleksi}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md disabled:bg-slate-400"
              >
                {isSavingRefleksi ? <><Loader2 className="animate-spin" size={20} /> Menyimpan...</> : <><Save size={20} /> Simpan Refleksi</>}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}