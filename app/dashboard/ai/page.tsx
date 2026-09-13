"use client";

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, Loader2, RotateCcw, BookOpen, Lightbulb, Quote } from 'lucide-react';

export default function RakanAIPenyelidik() {
  const [mesejTeks, setMesejTeks] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [senaraiMesej, setSenaraiMesej] = useState([
    { peranan: 'ai', teks: 'Salam sejahtera cikgu! Saya adalah Rakan AI Penyelidik anda. Apakah topik Kajian Tindakan atau masalah murid yang ingin kita bincangkan hari ini?' }
  ]);

  // Ref untuk kawalan auto-scroll skrin sembang
  const ruangSembangRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ruangSembangRef.current) {
      ruangSembangRef.current.scrollTop = ruangSembangRef.current.scrollHeight;
    }
  }, [senaraiMesej, isTyping]);

  // FUNGSI BAHARU: Membersihkan memori (state) kembali kepada mesej asal
  const resetPerbualan = () => {
    setSenaraiMesej([
      { 
        peranan: 'ai', 
        teks: 'Salam sejahtera cikgu! Saya adalah Rakan AI Penyelidik anda. Apakah topik Kajian Tindakan atau masalah murid yang ingin kita bincangkan hari ini?' 
      }
    ]);
  };

  // Fungsi Hantar Mesej (Menyokong input ditaip ATAU butang cadangan pantas)
  const hantarMesej = async (e?: React.FormEvent, teksCadangan?: string) => {
    if (e) e.preventDefault();
    
    const soalanGuru = teksCadangan || mesejTeks;
    if (!soalanGuru.trim()) return;

    // Masukkan soalan guru ke skrin
    setSenaraiMesej(prev => [...prev, { peranan: 'pengguna', teks: soalanGuru }]);
    setMesejTeks("");
    setIsTyping(true);

    try {
      // Hantar soalan ke pelayan rahsia kita (route.ts)
      const respons = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: soalanGuru })
      });

      const data = await respons.json();

      if (respons.ok) {
        // Masukkan jawapan AI ke skrin
        setSenaraiMesej(prev => [...prev, { peranan: 'ai', teks: data.result }]);
      } else {
        setSenaraiMesej(prev => [...prev, { peranan: 'ai', teks: `Ralat: ${data.error}` }]);
      }
    } catch (error) {
      setSenaraiMesej(prev => [...prev, { peranan: 'ai', teks: 'Maaf, talian ke otak AI terputus. Sila pastikan fail API pelayan (route.ts) anda berfungsi dengan baik.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[85vh] flex flex-col pb-6">
      
      {/* Pengepala berserta Butang Reset */}
      <header className="mb-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800 flex items-center gap-3">
            <Bot className="text-blue-600" size={36} /> 
            Rakan AI Penyelidik
          </h1>
          <p className="text-lg text-slate-600 mt-2 flex items-center gap-2">
            <Sparkles className="text-amber-500" size={20} />
            Bantu jana idea intervensi, semak penulisan, dan rangka metodologi dengan kecerdasan buatan.
          </p>
        </div>
        
        <button 
          onClick={resetPerbualan}
          className="flex items-center gap-2 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border border-rose-200 shadow-sm whitespace-nowrap"
        >
          <RotateCcw size={18} />
          Mula Semula
        </button>
      </header>

      {/* Tetingkap Ruang Sembang Utama */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        
        {/* Kawasan Mesej (Telah ditambah Auto-Scroll) */}
        <div ref={ruangSembangRef} className="flex-1 p-6 overflow-y-auto bg-slate-50 flex flex-col gap-6">
          {senaraiMesej.map((mesej, indeks) => (
            <div key={indeks} className={`flex gap-4 ${mesej.peranan === 'pengguna' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${mesej.peranan === 'pengguna' ? 'bg-blue-600 text-white' : 'bg-emerald-500 text-white'}`}>
                {mesej.peranan === 'pengguna' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${mesej.peranan === 'pengguna' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'}`}>
                <div className="whitespace-pre-wrap leading-relaxed text-[15px]">{mesej.teks}</div>
              </div>
            </div>
          ))}
          
          {/* Animasi loading jika AI sedang berfikir */}
          {isTyping && (
            <div className="flex gap-4 flex-row">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Bot size={20} />
              </div>
              <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2 shadow-sm">
                <Loader2 className="animate-spin text-emerald-500" size={18} /> 
                <span className="text-sm font-medium">Menganalisis data...</span>
              </div>
            </div>
          )}
        </div>

        {/* Bahagian Input Bawah */}
        <div className="p-4 bg-white border-t border-slate-200">
          
          {/* Butang Cadangan Pantas */}
          <div className="flex flex-wrap gap-2 mb-4 hidden md:flex">
            <button onClick={() => hantarMesej(undefined, "Bantu saya cari sokongan literatur/teori pedagogi untuk intervensi hands-on.")} className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors">
              <BookOpen size={14} /> Teori Pembelajaran
            </button>
            <button onClick={() => hantarMesej(undefined, "Bagaimana cara menulis objektif khusus yang mematuhi standard KPM?")} className="flex items-center gap-1.5 text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors">
              <Lightbulb size={14} /> Rangka Objektif
            </button>
            <button onClick={() => hantarMesej(undefined, "Tolong berikan contoh format rujukan APA ke-7 bagi buku dan jurnal.")} className="flex items-center gap-1.5 text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors">
              <Quote size={14} /> Format APA
            </button>
          </div>

          <form onSubmit={hantarMesej} className="flex items-center gap-3 relative">
            <input 
              type="text" 
              value={mesejTeks}
              onChange={(e) => setMesejTeks(e.target.value)}
              placeholder="Tanya apa sahaja berkaitan kajian tindakan anda..."
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-700 font-medium"
            />
            <button 
              type="submit" 
              disabled={!mesejTeks.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shrink-0"
            >
              <Send size={24} className={mesejTeks.trim() ? "translate-x-0.5 -translate-y-0.5 transition-transform" : ""} />
            </button>
          </form>
          <p className="text-center text-[11px] text-slate-400 mt-3">
            AI mungkin memberikan maklumat yang kurang tepat. Sila semak fakta sebelum dimasukkan ke dalam laporan akhir KPM.
          </p>
        </div>

      </div>
    </div>
  );
}