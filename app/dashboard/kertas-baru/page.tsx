"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowRight, Loader2, Lightbulb, Sparkles } from 'lucide-react'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 
import { db, auth } from '../../../lib/firebase'; 

export default function KertasKajianBaharu() {
  const router = useRouter(); 
  const [isSaving, setIsSaving] = useState(false); 

  const [dataKajian, setDataKajian] = useState({
    tajuk: "",
    refleksi: "",
    fokus: "",
    objektifAm: "",
    objektifKhusus: "",
    kumpulanSasaran: ""
  });

  // ==========================================
  // 🌟 MULA: LOGIK "OMNI-AI" (SEMUA MEDAN)
  // ==========================================
  const [aiState, setAiState] = useState({
    medanAktif: "", 
    cadangan: [] as string[],
    sedangLoading: false,
    paparDropdown: false
  });

  useEffect(() => {
    if (!aiState.medanAktif) return;
    
    const teksSemasa = dataKajian[aiState.medanAktif as keyof typeof dataKajian];

    if (teksSemasa.length < 8) {
      setAiState(prev => ({ ...prev, cadangan: [], paparDropdown: false }));
      return;
    }

    if (!aiState.paparDropdown && aiState.cadangan.length > 0) return;

    const pemicuAI = setTimeout(() => {
      janaCadanganOmniAI(aiState.medanAktif, teksSemasa);
    }, 1500);

    return () => clearTimeout(pemicuAI);
  }, [dataKajian, aiState.medanAktif]);

  const janaCadanganOmniAI = async (medan: string, kataKunci: string) => {
    setAiState(prev => ({ ...prev, sedangLoading: true }));
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY?.trim();
      
      if (!apiKey) {
        console.warn("Kunci AI tidak dijumpai dalam sistem.");
        return;
      }

      let arahanFormat = "";
      switch (medan) {
        case "tajuk": 
          arahanFormat = "Tajuk Kajian Tindakan lengkap (mengandungi Intervensi, Isu, dan Kumpulan Sasaran)."; break;
        case "refleksi": 
          arahanFormat = "Perenggan Refleksi Pengajaran & Pembelajaran lalu yang menceritakan kekecewaan guru dan masalah murid di dalam kelas secara ringkas."; break;
        case "fokus": 
          arahanFormat = "Perenggan Fokus Kajian yang mensasarkan satu kelemahan spesifik murid (isu keprihatinan)."; break;
        case "objektifAm": 
          arahanFormat = "Ayat Objektif Am (tujuan umum kajian untuk jangka masa panjang bagi menangani isu)."; break;
        case "objektifKhusus": 
          arahanFormat = "Ayat Objektif Khusus yang bersifat SMART (mengandungi angka/peratusan yang boleh diukur selepas intervensi)."; break;
        case "kumpulanSasaran": 
          arahanFormat = "Ayat profil Kumpulan Sasaran (menyatakan bilangan, kelas, jantina, dan pencapaian ringkas mereka)."; break;
      }

      const prompt = `Saya seorang guru di Malaysia. Berdasarkan draf awal saya: "${kataKunci}". Hasilkan 3 cadangan ${arahanFormat} mengikut format rasmi Kajian Tindakan KPM. Jawapan HANYA dalam bentuk array JSON yang ringkas seperti ini: ["Cadangan 1", "Cadangan 2", "Cadangan 3"]. Tanpa sebarang teks, mukadimah, atau simbol lain.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      const data = await response.json();

      if (!data.candidates || data.candidates.length === 0) {
        console.error("Alamak! Ralat AI:", data);
        setAiState(prev => ({ ...prev, sedangLoading: false }));
        return;
      }

      const aiText = data.candidates[0].content.parts[0].text;
      const teksBersih = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
      const senaraiCadangan = JSON.parse(teksBersih);

      if (Array.isArray(senaraiCadangan) && senaraiCadangan.length > 0) {
        setAiState(prev => ({ ...prev, cadangan: senaraiCadangan, paparDropdown: true }));
      }
    } catch (error) {
      console.error("Enjin AI terganggu:", error);
    } finally {
      setAiState(prev => ({ ...prev, sedangLoading: false }));
    }
  };

  const pilihCadanganAI = (cadanganPilihan: string) => {
    setDataKajian(prev => ({ ...prev, [aiState.medanAktif]: cadanganPilihan }));
    setAiState(prev => ({ ...prev, paparDropdown: false })); 
  };
  // ==========================================
  // 🌟 TAMAT: LOGIK "OMNI-AI"
  // ==========================================

  const kemaskiniInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDataKajian(prev => ({ ...prev, [name]: value }));
    setAiState(prev => ({ ...prev, medanAktif: name, paparDropdown: true }));
  };

  const simpanDraf = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true); 

    try {
      const penggunaSemasa = auth.currentUser;
      
      if (!penggunaSemasa) {
        alert("🔒 Sila log masuk ke dalam sistem terlebih dahulu untuk menyimpan kertas kajian.");
        setIsSaving(false);
        return;
      }

      await addDoc(collection(db, "kajian_tindakan"), {
        tajukKajian: dataKajian.tajuk,
        refleksiLalu: dataKajian.refleksi,
        fokusKajian: dataKajian.fokus,
        objektifAm: dataKajian.objektifAm,
        objektifKhusus: dataKajian.objektifKhusus,
        kumpulanSasaran: dataKajian.kumpulanSasaran,
        status: "Draf", 
        tarikhDicipta: serverTimestamp(),
        userId: penggunaSemasa.uid 
      });

      alert("Draf Kertas Kajian berjaya disimpan di pangkalan data!");
      router.push('/dashboard/arkib'); 
      
    } catch (error) {
      console.error("Ralat Firebase:", error);
      alert("Maaf, gagal menyimpan. Sila pastikan pangkalan data Firebase bersambung.");
    } finally {
      setIsSaving(false); 
    }
  };

  // ==========================================
  // KOMPONEN PEMBANTU UI AI
  // ==========================================
  const IndikatorAILoading = ({ namaMedan }: { namaMedan: string }) => {
    if (!aiState.sedangLoading || aiState.medanAktif !== namaMedan) return null;
    return (
      <span className="flex items-center gap-1 text-xs text-fuchsia-600 font-semibold bg-fuchsia-100 px-2 py-0.5 rounded-full animate-pulse ml-2">
        <Sparkles size={14} /> AI Merangka...
      </span>
    );
  };

  const MenuCadanganAI = ({ namaMedan }: { namaMedan: string }) => {
    if (aiState.medanAktif !== namaMedan || !aiState.paparDropdown || aiState.cadangan.length === 0) return null;
    return (
      <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-fuchsia-100 overflow-hidden animate-in slide-in-from-top-2">
        <div className="bg-gradient-to-r from-fuchsia-600 to-blue-600 px-4 py-3 flex items-center gap-2">
          <Sparkles size={18} className="text-white" />
          <span className="text-[13px] font-bold text-white tracking-wider uppercase">Cadangan AI KPM (Klik untuk guna)</span>
        </div>
        <ul className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
          {aiState.cadangan.map((cadangan, indeks) => (
            <li 
              key={indeks}
              onClick={() => pilihCadanganAI(cadangan)}
              className="p-5 hover:bg-fuchsia-50/80 cursor-pointer transition-colors text-base text-slate-800 font-medium flex gap-3 items-start"
            >
              <span className="text-fuchsia-500 font-bold mt-0.5">{indeks + 1}.</span>
              <span className="whitespace-pre-wrap leading-relaxed">{cadangan}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  // ==========================================

  return (
    // SUNTIKAN MOBILE-FIRST: Ditambah padding kiri kanan (px-4 sm:px-6) untuk skrin telefon
    <div className="max-w-4xl mx-auto h-full flex flex-col pb-8 px-4 sm:px-6">
      
      <header className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-1">
          Kertas Kajian Baharu
        </h1>
        <p className="text-base text-slate-500 font-medium">
          Modul 1: Pengenalan, Refleksi P&P dan Isu Keprihatinan
        </p>
      </header>

      {/* SUNTIKAN MOBILE-FIRST: Borang dipanjangkan supaya sticky bar berkesan */}
      <form onSubmit={simpanDraf} className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col relative z-0 min-h-[70vh]">
        
        {/* Padding dilaraskan untuk telefon (p-5 sm:p-8) */}
        <div className="p-5 sm:p-8 space-y-10">
          
          {/* ========================================== */}
          {/* 1. TAJUK KAJIAN */}
          {/* ========================================== */}
          <div className="relative">
            <label className="flex items-center text-sm font-bold text-slate-800 mb-2">
              Tajuk Kajian Tindakan <IndikatorAILoading namaMedan="tajuk" />
            </label>
            <div className="relative">
              <input 
                type="text" name="tajuk" value={dataKajian.tajuk} onChange={kemaskiniInput} autoComplete="off"
                placeholder="Taip isu (Cth: murid lemah darab) dan rehat..."
                // SUNTIKAN MOBILE-FIRST: text-base (wajib untuk halang auto-zoom di iOS), py-3.5 (butang gemuk)
                className="w-full bg-slate-50/50 border border-slate-300 rounded-xl px-4 py-3.5 pr-12 outline-none focus:ring-2 focus:ring-fuchsia-500 focus:bg-white transition-all text-base text-slate-800 placeholder:text-slate-400 font-medium" required
              />
              <div className="absolute right-4 top-3.5 text-slate-300">
                <Sparkles size={22} className={aiState.sedangLoading && aiState.medanAktif === 'tajuk' ? "text-fuchsia-500 animate-spin" : "text-slate-300"} />
              </div>
            </div>
            <MenuCadanganAI namaMedan="tajuk" />
            
            <div className="mt-3 bg-blue-50/80 text-blue-800 p-4 rounded-xl flex items-start gap-3 border border-blue-100">
              <Lightbulb size={20} className="shrink-0 mt-0.5 text-blue-600" />
              <div className="text-sm">
                <p className="font-bold mb-1">Tips Tajuk KPM:</p>
                <p className="opacity-90 leading-relaxed">Tajuk yang baik mesti mengandungi 3 elemen: <strong>Tindakan/Intervensi</strong>, <strong>Isu</strong>, dan <strong>Sasaran</strong>.</p>
              </div>
            </div>
          </div>

          {/* ========================================== */}
          {/* 1.0 REFLEKSI */}
          {/* ========================================== */}
          <div className="relative">
            <label className="flex items-center text-sm font-bold text-slate-800 mb-2">
              1.0 Refleksi Pengajaran & Pembelajaran Lalu <IndikatorAILoading namaMedan="refleksi" />
            </label>
            <div className="relative">
              <textarea 
                name="refleksi" value={dataKajian.refleksi} onChange={kemaskiniInput} rows={5}
                placeholder="Saya mengajar kelas 4 Tekun. Sewaktu menyemak kertas ujian topikal bulan Mac, saya berasa sangat kecewa kerana..."
                // SUNTIKAN MOBILE-FIRST: text-base
                className="w-full bg-slate-50/50 border border-slate-300 rounded-xl px-4 py-3.5 pr-12 outline-none focus:ring-2 focus:ring-fuchsia-500 focus:bg-white transition-all text-base text-slate-800 placeholder:text-slate-400 resize-y leading-relaxed"
              ></textarea>
              <div className="absolute right-4 top-4 text-slate-300">
                <Sparkles size={22} className={aiState.sedangLoading && aiState.medanAktif === 'refleksi' ? "text-fuchsia-500 animate-spin" : "text-slate-300"} />
              </div>
            </div>
            <MenuCadanganAI namaMedan="refleksi" />
          </div>

          {/* ========================================== */}
          {/* 2.0 FOKUS KAJIAN */}
          {/* ========================================== */}
          <div className="relative">
            <label className="flex items-center text-sm font-bold text-slate-800 mb-2">
              2.0 Fokus Kajian / Isu Keprihatinan <IndikatorAILoading namaMedan="fokus" />
            </label>
            <div className="relative">
              <textarea 
                name="fokus" value={dataKajian.fokus} onChange={kemaskiniInput} rows={4}
                placeholder="Walaupun murid mempunyai pelbagai masalah, kajian ini hanya memfokuskan kepada kegagalan murid menyusun struktur ayat dengan betul..."
                className="w-full bg-slate-50/50 border border-slate-300 rounded-xl px-4 py-3.5 pr-12 outline-none focus:ring-2 focus:ring-fuchsia-500 focus:bg-white transition-all text-base text-slate-800 placeholder:text-slate-400 resize-y leading-relaxed"
              ></textarea>
              <div className="absolute right-4 top-4 text-slate-300">
                <Sparkles size={22} className={aiState.sedangLoading && aiState.medanAktif === 'fokus' ? "text-fuchsia-500 animate-spin" : "text-slate-300"} />
              </div>
            </div>
            <MenuCadanganAI namaMedan="fokus" />
          </div>

          {/* ========================================== */}
          {/* 3.0 OBJEKTIF */}
          {/* ========================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative">
              <label className="flex items-center text-sm font-bold text-slate-800 mb-2">
                3.0 Objektif Am <IndikatorAILoading namaMedan="objektifAm" />
              </label>
              <div className="relative">
                <textarea 
                  name="objektifAm" value={dataKajian.objektifAm} onChange={kemaskiniInput} rows={4}
                  placeholder="Tujuan am kajian ini adalah untuk meningkatkan kualiti PdP bagi subjek Sains..."
                  className="w-full bg-slate-50/50 border border-slate-300 rounded-xl px-4 py-3.5 pr-10 outline-none focus:ring-2 focus:ring-fuchsia-500 focus:bg-white transition-all text-base text-slate-800 placeholder:text-slate-400 resize-y leading-relaxed"
                ></textarea>
                <div className="absolute right-3 top-4 text-slate-300">
                  <Sparkles size={22} className={aiState.sedangLoading && aiState.medanAktif === 'objektifAm' ? "text-fuchsia-500 animate-spin" : "text-slate-300"} />
                </div>
              </div>
              <MenuCadanganAI namaMedan="objektifAm" />
            </div>

            <div className="relative">
              <label className="flex items-center text-sm font-bold text-slate-800 mb-2">
                3.1 Objektif Khusus <IndikatorAILoading namaMedan="objektifKhusus" />
              </label>
              <div className="relative">
                <textarea 
                  name="objektifKhusus" value={dataKajian.objektifKhusus} onChange={kemaskiniInput} rows={4}
                  placeholder="1. Meningkatkan kelulusan ujian pasca sebanyak 20%..."
                  className="w-full bg-slate-50/50 border border-slate-300 rounded-xl px-4 py-3.5 pr-10 outline-none focus:ring-2 focus:ring-fuchsia-500 focus:bg-white transition-all text-base text-slate-800 placeholder:text-slate-400 resize-y leading-relaxed"
                ></textarea>
                <div className="absolute right-3 top-4 text-slate-300">
                  <Sparkles size={22} className={aiState.sedangLoading && aiState.medanAktif === 'objektifKhusus' ? "text-fuchsia-500 animate-spin" : "text-slate-300"} />
                </div>
              </div>
              <MenuCadanganAI namaMedan="objektifKhusus" />
            </div>
          </div>

          {/* ========================================== */}
          {/* 4.0 KUMPULAN SASARAN */}
          {/* ========================================== */}
          <div className="relative">
            <label className="flex items-center text-sm font-bold text-slate-800 mb-2">
              4.0 Kumpulan Sasaran <IndikatorAILoading namaMedan="kumpulanSasaran" />
            </label>
            <div className="relative">
              <input 
                type="text" name="kumpulanSasaran" value={dataKajian.kumpulanSasaran} onChange={kemaskiniInput} autoComplete="off"
                placeholder="Cth: Kajian ini melibatkan 8 orang murid (5 lelaki, 3 perempuan) dari kelas 4..."
                className="w-full bg-slate-50/50 border border-slate-300 rounded-xl px-4 py-3.5 pr-12 outline-none focus:ring-2 focus:ring-fuchsia-500 focus:bg-white transition-all text-base text-slate-800 placeholder:text-slate-400 font-medium"
              />
              <div className="absolute right-4 top-3.5 text-slate-300">
                <Sparkles size={22} className={aiState.sedangLoading && aiState.medanAktif === 'kumpulanSasaran' ? "text-fuchsia-500 animate-spin" : "text-slate-300"} />
              </div>
            </div>
            <MenuCadanganAI namaMedan="kumpulanSasaran" />
          </div>

        </div>

        {/* ========================================== */}
        {/* SUNTIKAN MAGIS: BAR BAWAH STICKY GLASSMORPHISM */}
        {/* Ia akan melekat di bawah skrin telefon dan nampak tembus pandang (kaca) */}
        {/* ========================================== */}
        <div className="sticky bottom-0 z-40 p-4 sm:p-6 bg-white/80 backdrop-blur-md border-t border-slate-200/60 flex justify-between items-center rounded-b-2xl shadow-[0_-8px_20px_-5px_rgba(0,0,0,0.05)] mt-auto">
          <button 
            type="button" 
            onClick={() => router.back()} 
            className="text-slate-500 font-medium hover:text-slate-800 transition-colors px-4 py-3 rounded-xl hover:bg-slate-200/50 text-base"
          >
            Batal
          </button>
          
          <button 
            type="submit"
            disabled={isSaving} 
            // Butang Simpan ditinggikan sedikit (py-3.5) untuk senang ditekan ibu jari
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-6 sm:px-8 py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed text-base"
          >
            {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            {isSaving ? "Menyimpan..." : "Simpan Draf"} 
            {!isSaving && <ArrowRight size={20} className="hidden sm:inline-block" />}
          </button>
        </div>

      </form>
    </div>
  );
}