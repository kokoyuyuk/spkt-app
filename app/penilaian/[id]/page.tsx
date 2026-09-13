"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Star, Send, CheckCircle2, Loader2, Target, AlertCircle } from 'lucide-react';

// Senarai Kriteria yang sepadan dengan Radar Chart di Dashboard
const senaraiKriteria = [
  { kunci: 'Pemahaman Topik', soalan: 'Sejauh manakah intervensi ini membantu pemahaman anda terhadap topik yang diajar?' },
  { kunci: 'Minat & Tarikan', soalan: 'Adakah kaedah/bahan yang digunakan menarik dan menyeronokkan?' },
  { kunci: 'Penglibatan Aktif', soalan: 'Adakah anda berpeluang melibatkan diri secara aktif (hands-on) semasa sesi ini?' },
  { kunci: 'Kejelasan Arahan', soalan: 'Adakah arahan yang diberikan oleh guru mudah untuk difahami dan diikuti?' },
  { kunci: 'Bahan Intervensi', soalan: 'Bagaimanakah kualiti Bahan Bantu Mengajar (BBM) atau alat yang digunakan?' },
];

export default function BorangPenilaianAwam() {
  const params = useParams();
  const idKajian = params.id as string;

  const [tajukKajian, setTajukKajian] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ralat, setRalat] = useState("");

  // State untuk menyimpan markah (1-5) bagi setiap kriteria
  const [markah, setMarkah] = useState<Record<string, number>>({});

  useEffect(() => {
    const semakKajian = async () => {
      try {
        const docRef = await getDoc(doc(db, "kajian_tindakan", idKajian));
        if (docRef.exists()) {
          setTajukKajian(docRef.data().tajukKajian || "Kajian Tindakan KPM");
        } else {
          setRalat("Pautan tidak sah atau kajian telah dipadamkan.");
        }
      } catch (error) {
        setRalat("Ralat sistem semasa mencari kajian.");
      } finally {
        setIsLoading(false);
      }
    };
    semakKajian();
  }, [idKajian]);

  // Fungsi mengendalikan klik bintang
  const pilihBintang = (kunci: string, nilai: number) => {
    setMarkah(prev => ({ ...prev, [kunci]: nilai }));
  };

  const hantarMaklumBalas = async () => {
    // Pastikan semua 5 soalan dijawab
    if (Object.keys(markah).length < 5) {
      alert("Sila berikan penilaian bintang untuk kesemua 5 soalan sebelum menghantar.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Gunakan arrayUnion untuk menambah rekod baharu tanpa memadam data sedia ada
      await updateDoc(doc(db, "kajian_tindakan", idKajian), {
        triangulasiData: arrayUnion({
          tarikh: new Date().toISOString(),
          penilaian: markah
        })
      });
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Gagal menghantar penilaian. Sila cuba lagi.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-rose-500" size={40} /></div>;
  }

  if (ralat) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <AlertCircle size={60} className="text-rose-500 mb-4" />
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Pautan Tidak Ditemui</h1>
        <p className="text-slate-600">{ralat}</p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-rose-50 p-6 text-center">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md mb-6">
          <CheckCircle2 size={60} className="text-rose-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Terima Kasih!</h1>
        <p className="text-slate-600 max-w-md">Maklum balas anda telah berjaya direkodkan secara tanpa nama (anonymous) dan akan digunakan untuk menambah baik kualiti pendidikan.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Pengepala Borang */}
        <div className="bg-gradient-to-br from-rose-500 to-pink-600 p-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
            <Target size={120} />
          </div>
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-sm relative z-10 mb-4 inline-block">
            Penilaian Pihak Ketiga (360°)
          </span>
          <h1 className="text-2xl font-bold leading-tight relative z-10 mb-2">{tajukKajian}</h1>
          <p className="text-rose-100 text-sm relative z-10">Borang Maklum Balas Kualiti Intervensi</p>
        </div>

        {/* Arahan */}
        <div className="p-6 bg-rose-50/50 border-b border-slate-100 text-center">
          <p className="text-sm text-slate-600 font-medium">
            Sila nilaikan pengalaman anda dari <strong className="text-rose-600">1 Bintang (Sangat Lemah)</strong> hingga <strong className="text-rose-600">5 Bintang (Sangat Cemerlang)</strong>.
          </p>
        </div>

        {/* Senarai Soalan */}
        <div className="p-6 sm:p-8 space-y-8">
          {senaraiKriteria.map((item, index) => (
            <div key={index} className="flex flex-col">
              <label className="text-base font-bold text-slate-800 mb-1">{index + 1}. {item.kunci}</label>
              <p className="text-sm text-slate-500 mb-4 leading-relaxed">{item.soalan}</p>
              
              {/* Bintang Penilaian */}
              <div className="flex items-center gap-2 sm:gap-4 justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {[1, 2, 3, 4, 5].map((nilai) => (
                  <button
                    key={nilai}
                    onClick={() => pilihBintang(item.kunci, nilai)}
                    className="focus:outline-none transform transition-transform hover:scale-110"
                  >
                    <Star 
                      size={36} 
                      className={`transition-colors duration-200 ${
                        (markah[item.kunci] || 0) >= nilai 
                          ? 'fill-amber-400 text-amber-400 drop-shadow-sm' 
                          : 'fill-slate-200 text-slate-200'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Butang Hantar */}
        <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-100">
          <button 
            onClick={hantarMaklumBalas}
            disabled={isSubmitting}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
          >
            {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
            {isSubmitting ? "Menghantar Data..." : "Hantar Penilaian"}
          </button>
        </div>

      </div>
    </div>
  );
}