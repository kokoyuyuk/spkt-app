"use client";

import { useEffect, useState } from 'react';
// SUNTIKAN 1: Saya tambah ikon Activity, CheckCircle2, AlertCircle untuk Lencana T-Test
import { Calculator, Plus, Trash2, TrendingUp, BarChart3, Save, Loader2, ChevronDown, Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

export default function AnalisisData() {
  // --- STATE FIREBASE & UI ---
  const [senaraiKajian, setSenaraiKajian] = useState<any[]>([]);
  const [kajianPilihan, setKajianPilihan] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- STATE DATA JADUAL (Bermula dengan 1 baris kosong) ---
  const [dataPelajar, setDataPelajar] = useState<any[]>([
    { id: 1, nama: '', pra: 0, pasca: 0 },
  ]);

  // 1. Tarik Senarai Kajian untuk Dropdown
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

  // 2. Jika cikgu pilih nama kajian, tarik data markah lama dari Firebase (jika ada)
  useEffect(() => {
    const tarikDataMarkah = async () => {
      if (!kajianPilihan) return;
      try {
        const docRef = await getDoc(doc(db, "kajian_tindakan", kajianPilihan));
        if (docRef.exists()) {
          const data = docRef.data();
          if (data.analisisDataTaburan && data.analisisDataTaburan.length > 0) {
            setDataPelajar(data.analisisDataTaburan);
          } else {
            setDataPelajar([{ id: 1, nama: '', pra: 0, pasca: 0 }]); // Reset
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    tarikDataMarkah();
  }, [kajianPilihan]);

  // --- FUNGSI MENGURUS JADUAL KAWAN ---
  const tambahPelajar = () => {
    const idBaru = dataPelajar.length > 0 ? Math.max(...dataPelajar.map(p => p.id)) + 1 : 1;
    setDataPelajar([...dataPelajar, { id: idBaru, nama: `Murid ${idBaru}`, pra: 0, pasca: 0 }]);
  };

  const kemaskiniMarkah = (id: number, medan: 'nama' | 'pra' | 'pasca', nilai: string | number) => {
    setDataPelajar(dataPelajar.map(p => 
      p.id === id ? { ...p, [medan]: nilai } : p
    ));
  };

  const buangPelajar = (id: number) => {
    if(dataPelajar.length > 1) {
       setDataPelajar(dataPelajar.filter(p => p.id !== id));
    }
  };

  // --- FUNGSI SIMPAN KE FIREBASE ---
  const simpanDataAnalisis = async () => {
    if (!kajianPilihan) return alert("Sila pilih nama projek kajian di bahagian atas terlebih dahulu.");
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "kajian_tindakan", kajianPilihan), {
        analisisDataTaburan: dataPelajar
      });
      alert("Data markah dan graf berjaya disimpan ke dalam kajian!");
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- ENJIN PENGIRAAN AUTOMATIK KAWAN ---
  const purataPra = dataPelajar.length > 0 ? (dataPelajar.reduce((sum, p) => sum + Number(p.pra || 0), 0) / dataPelajar.length).toFixed(2) : "0";
  const purataPasca = dataPelajar.length > 0 ? (dataPelajar.reduce((sum, p) => sum + Number(p.pasca || 0), 0) / dataPelajar.length).toFixed(2) : "0";
  const peratusPeningkatan = Number(purataPra) > 0 ? (((Number(purataPasca) - Number(purataPra)) / Number(purataPra)) * 100).toFixed(1) : "0";

  // --- SUNTIKAN 2: ENJIN STATISTIK UJIAN-T (T-TEST) BERSANDAR ---
  const kiraTTest = () => {
    // Hanya ambil murid yang mempunyai markah pra dan pasca yang sah
    const dataSah = dataPelajar.filter(p => String(p.pra) !== '' && String(p.pasca) !== '');
    const N = dataSah.length;
    
    if (N < 2) return { tValue: 0, signifikan: false, df: 0 }; 

    let sumDiff = 0;
    let sumSqDiff = 0;

    dataSah.forEach(p => {
      const diff = Number(p.pasca || 0) - Number(p.pra || 0);
      sumDiff += diff;
    });

    const meanDiff = sumDiff / N;

    dataSah.forEach(p => {
      const diff = Number(p.pasca || 0) - Number(p.pra || 0);
      sumSqDiff += Math.pow(diff - meanDiff, 2);
    });

    const variance = sumSqDiff / (N - 1);
    const standardDeviation = Math.sqrt(variance);
    const standardError = standardDeviation / Math.sqrt(N);
    
    const tValue = standardError === 0 ? 0 : meanDiff / standardError;
    const df = N - 1;
    
    // Syarat asas signifikansi (p < 0.05)
    const signifikan = tValue > 2.0; 

    return { 
      tValue: tValue.toFixed(3), 
      signifikan, 
      df 
    };
  };

  const statistik = kiraTTest();

  // Data Graf untuk Recharts
  const dataGraf = dataPelajar.map((p, index) => ({
    name: p.nama || `Murid ${index + 1}`,
    "Ujian Pra": Number(p.pra || 0),
    "Ujian Pasca": Number(p.pasca || 0)
  }));

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center text-blue-500"><Loader2 className="animate-spin" size={40} /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-800 flex items-center gap-3">
          <Calculator className="text-blue-600" size={36} /> 
          Kalkulator Analisis & Graf
        </h1>
        <p className="text-lg text-slate-600 mt-2">Kira pencapaian Ujian Pra & Pasca, dan sahkan keberkesanan melalui ujian statistik.</p>
      </header>

      {/* --- KOTAK DROPDOWN PILIH KAJIAN --- */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-200 mb-8 relative z-10">
        <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">1. Pautkan Data ke Kajian:</label>
        <div className="relative">
          <select 
            value={kajianPilihan} 
            onChange={(e) => setKajianPilihan(e.target.value)}
            className="w-full p-4 pr-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-slate-50 font-bold text-slate-700 cursor-pointer"
          >
            <option value="">-- SILA PILIH PROJEK KAJIAN TINDAKAN ANDA --</option>
            {senaraiKajian.map(k => (
              <option key={k.id} value={k.id}>{k.tajukKajian}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-4 text-slate-400 pointer-events-none" size={24} />
        </div>
      </div>

      <div className={`transition-opacity duration-300 ${!kajianPilihan ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        
        {/* Kad Keputusan Analisis (Automatik) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-bold text-slate-500 mb-1">Min (Purata) Ujian Pra</span>
            <span className="text-4xl font-extrabold text-slate-800">{purataPra}</span>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-bold text-slate-500 mb-1">Min (Purata) Ujian Pasca</span>
            <span className="text-4xl font-extrabold text-blue-600">{purataPasca}</span>
          </div>
          <div className={`p-6 rounded-2xl shadow-md flex flex-col items-center justify-center text-center text-white
            ${Number(peratusPeningkatan) >= 0 ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-gradient-to-br from-rose-500 to-red-600'}
          `}>
            <span className="text-sm font-bold text-white/80 mb-1 flex items-center gap-2">
              <TrendingUp size={16} className={Number(peratusPeningkatan) < 0 ? "rotate-180" : ""}/> 
              {Number(peratusPeningkatan) >= 0 ? 'Peningkatan' : 'Penurunan'}
            </span>
            <span className="text-4xl font-extrabold">{Number(peratusPeningkatan) > 0 ? '+' : ''}{peratusPeningkatan}%</span>
          </div>
        </div>

        {/* --- SUNTIKAN 3: LENCANA UJIAN STATISTIK T-TEST --- */}
        <div className="bg-slate-900 rounded-2xl shadow-md p-6 mb-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full mix-blend-screen filter blur-[60px] opacity-20"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center shrink-0">
              <Activity size={24} className="text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                Analisis Ujian-t Bersandar (Paired T-Test)
              </h3>
              <p className="text-slate-400 text-sm">Nilai-t: <strong className="text-white">{statistik.tValue}</strong> | Darjah Kebebasan (df): <strong className="text-white">{statistik.df}</strong></p>
            </div>
          </div>

          <div className="relative z-10 shrink-0">
            {statistik.signifikan ? (
              <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 size={18} /> Signifikan (p &lt; 0.05)
              </div>
            ) : (
              <div className="bg-amber-500/20 border border-amber-500/50 text-amber-400 px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm">
                <AlertCircle size={18} /> Belum Signifikan
              </div>
            )}
          </div>
        </div>
        {/* --- TAMAT SUNTIKAN 3 --- */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Jadual Kemasukan Markah */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">Senarai Markah Murid</h2>
              <button onClick={tambahPelajar} className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200 transition-all">
                <Plus size={18} /> Tambah Murid
              </button>
            </div>
            
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase rounded-t-xl border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Nama/Inisial</th>
                    <th className="px-4 py-3 text-center">Pra</th>
                    <th className="px-4 py-3 text-center">Pasca</th>
                    <th className="px-4 py-3 text-center">Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  {dataPelajar.map((p) => (
                    <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50 transition-all">
                      <td className="px-4 py-3">
                        <input type="text" placeholder={`Murid ${p.id}`} value={p.nama} onChange={(e) => kemaskiniMarkah(p.id, 'nama', e.target.value)} className="w-full bg-transparent border-b border-dashed border-slate-300 focus:border-blue-500 outline-none py-1 text-slate-800 font-medium" />
                      </td>
                      <td className="px-4 py-3">
                        <input type="number" placeholder="0" value={p.pra === 0 && !p.nama ? '' : p.pra} onChange={(e) => kemaskiniMarkah(p.id, 'pra', e.target.value)} className="w-16 mx-auto block bg-transparent border-b border-dashed border-slate-300 focus:border-blue-500 outline-none py-1 text-center font-bold text-slate-600" />
                      </td>
                      <td className="px-4 py-3">
                        <input type="number" placeholder="0" value={p.pasca === 0 && !p.nama ? '' : p.pasca} onChange={(e) => kemaskiniMarkah(p.id, 'pasca', e.target.value)} className="w-16 mx-auto block bg-transparent border-b border-dashed border-slate-300 focus:border-blue-500 outline-none py-1 text-center font-bold text-blue-600" />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => buangPelajar(p.id)} className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button 
                onClick={simpanDataAnalisis} 
                disabled={isSaving} 
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md disabled:opacity-70"
              >
                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {isSaving ? "Menyimpan..." : "Simpan Data ke Kajian"}
              </button>
            </div>
          </div>

          {/* Paparan Graf Interaktif */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col sticky top-6 h-fit">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <BarChart3 className="text-blue-600" size={24} /> Graf Perbandingan
            </h2>
            <div className="w-full h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataGraf} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                  <Bar dataKey="Ujian Pra" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="Ujian Pasca" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}