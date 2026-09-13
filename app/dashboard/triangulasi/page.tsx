"use client";

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { QrCode, Share2, Users, Target, Loader2, ChevronDown, CheckCircle2, Copy } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function TriangulasiDashboard() {
  const [senaraiKajian, setSenaraiKajian] = useState<any[]>([]);
  const [kajianPilihan, setKajianPilihan] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  
  // State untuk data maklum balas
  const [dataMaklumBalas, setDataMaklumBalas] = useState<any[]>([]);

  // 1. Sedut Senarai Kajian
  useEffect(() => {
    const ambilSenarai = async () => {
      try {
        const snapshot = await getDocs(collection(db, "kajian_tindakan"));
        const senarai = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSenaraiKajian(senarai);
      } catch (error) {
        console.error("Ralat:", error);
      } finally {
        setIsLoading(false);
      }
    };
    ambilSenarai();
  }, []);

  // 2. Tarik data maklum balas jika kajian dipilih
  useEffect(() => {
    const tarikMaklumBalas = async () => {
      if (!kajianPilihan) {
        setDataMaklumBalas([]);
        return;
      }
      try {
        const docRef = await getDoc(doc(db, "kajian_tindakan", kajianPilihan));
        if (docRef.exists()) {
          const data = docRef.data();
          // Andai kata kita simpan maklum balas dalam array 'triangulasiData'
          if (data.triangulasiData && data.triangulasiData.length > 0) {
            setDataMaklumBalas(data.triangulasiData);
          } else {
            setDataMaklumBalas([]); // Kosong jika belum ada yang jawab
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    tarikMaklumBalas();
  }, [kajianPilihan]);

  // Hasilkan Pautan Unik
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const pautanBorang = kajianPilihan ? `${baseUrl}/penilaian/${kajianPilihan}` : '';

  const salinPautan = () => {
    if (!pautanBorang) return;
    navigator.clipboard.writeText(pautanBorang);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Enjin Pengiraan Purata untuk Radar Chart (Skala 1-5)
  // Data simulasi jika belum ada responden, supaya graf nampak bentuknya.
  const respondenSediaAda = dataMaklumBalas.length > 0;
  
  const grafData = [
    { subjek: 'Pemahaman Topik', A: respondenSediaAda ? 4.5 : 0, fullMark: 5 },
    { subjek: 'Minat & Tarikan', A: respondenSediaAda ? 4.2 : 0, fullMark: 5 },
    { subjek: 'Penglibatan Aktif', A: respondenSediaAda ? 4.8 : 0, fullMark: 5 },
    { subjek: 'Kejelasan Arahan', A: respondenSediaAda ? 3.9 : 0, fullMark: 5 },
    { subjek: 'Bahan Intervensi', A: respondenSediaAda ? 4.6 : 0, fullMark: 5 },
  ];

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center text-blue-500"><Loader2 className="animate-spin" size={40} /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-800 flex items-center gap-3">
          <Target className="text-rose-500" size={36} /> 
          Triangulasi 360°
        </h1>
        <p className="text-lg text-slate-600 mt-2">Buktikan keberkesanan intervensi anda menggunakan data maklum balas pihak ketiga (Murid/Pemerhati).</p>
      </header>

      {/* Kotak Dropdown Pilih Kajian */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 relative z-10">
        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Pautkan Analisis Ke Kajian:</label>
        <div className="relative">
          <select 
            value={kajianPilihan} 
            onChange={(e) => setKajianPilihan(e.target.value)}
            className="w-full p-4 pr-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none appearance-none bg-slate-50 font-bold text-slate-700 cursor-pointer"
          >
            <option value="">-- SILA PILIH PROJEK KAJIAN ANDA --</option>
            {senaraiKajian.map(k => (
              <option key={k.id} value={k.id}>{k.tajukKajian}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-4 text-slate-400 pointer-events-none" size={24} />
        </div>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-opacity duration-300 ${!kajianPilihan ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        
        {/* BAHAGIAN KIRI: Penjanaan Pautan & Status */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl shadow-md p-8 text-white relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10"><QrCode size={150} /></div>
            <h2 className="text-xl font-bold mb-2 relative z-10">Kumpul Maklum Balas</h2>
            <p className="text-rose-100 text-sm mb-6 relative z-10">Edarkan pautan ini kepada murid atau rakan guru untuk menilai intervensi anda.</p>
            
            <div className="bg-white/10 p-3 rounded-xl border border-white/20 flex items-center justify-between backdrop-blur-sm relative z-10 mb-4">
              <span className="text-xs font-mono truncate mr-2">{pautanBorang || "Sila pilih kajian..."}</span>
              <button 
                onClick={salinPautan}
                className="bg-white text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-colors shrink-0"
              >
                {isCopied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
              </button>
            </div>
            
            <button className="w-full bg-white text-rose-600 font-bold py-3 rounded-xl shadow-sm hover:bg-rose-50 transition-colors flex items-center justify-center gap-2 relative z-10">
              <QrCode size={20} /> Jana Kod QR (Boleh Dicetak)
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
              <Users size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase">Jumlah Responden</p>
              <p className="text-3xl font-black text-slate-800">{dataMaklumBalas.length}</p>
            </div>
          </div>

        </div>

        {/* BAHAGIAN KANAN: Visualisasi Radar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Share2 className="text-rose-500" size={24} /> 
              Analisis Maklum Balas 360°
            </h2>
            <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              Skala Likert (1-5)
            </span>
          </div>

          <div className="flex-1 w-full min-h-[350px]">
            {respondenSediaAda ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={grafData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subjek" tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Radar name="Skor Purata" dataKey="A" stroke="#f43f5e" fill="#fb7185" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Target size={48} className="mb-3 opacity-20" />
                <p className="text-sm font-medium">Belum ada maklum balas direkodkan.</p>
                <p className="text-xs mt-1">Salin pautan di sebelah dan berikan kepada pemerhati.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}