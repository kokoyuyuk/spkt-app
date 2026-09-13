"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore'; 
import { db } from '../../../lib/firebase';
import { Printer, Loader2 } from 'lucide-react';

export default function CetakLaporan() {
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
        <Loader2 className="animate-spin mr-3" size={30} /> Membina laporan rasmi...
      </div>
    );
  }

  if (!kajian) return <div className="p-20 text-center text-red-600 text-xl font-bold">Kajian tidak dijumpai.</div>;

  return (
    <div className="min-h-screen bg-slate-200 py-10 print:bg-white print:py-0">
      
      {/* Bar Navigasi Khas (Akan hilang masa di-print) */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden bg-white p-4 rounded-xl shadow-sm">
        <p className="text-slate-500 font-medium text-sm">Cetak sebagai PDF (A4) untuk fail panitia KPM.</p>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-blue-700 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-800 transition shadow"
        >
          <Printer size={18} /> Cetak / Simpan PDF
        </button>
      </div>

      {/* Dokumen Laporan A4 Sebenar */}
      <div className="max-w-4xl mx-auto bg-white p-12 md:p-20 shadow-lg min-h-[1122px] print:shadow-none print:p-0 text-black">
        
        {/* Pengepala */}
        <div className="text-center mb-12 border-b-2 border-black pb-8">
          <h1 className="text-2xl font-bold uppercase leading-relaxed mb-4">
            KERTAS CADANGAN / LAPORAN KAJIAN TINDAKAN
          </h1>
          <h2 className="text-xl font-bold uppercase">{kajian.tajukKajian}</h2>
        </div>

        {/* Isi Kandungan Mengikut Standard */}
        <div className="space-y-8 text-justify font-serif text-lg leading-relaxed">
          
          <section>
            <h3 className="font-bold mb-2">1.0 REFLEKSI PENGAJARAN DAN PEMBELAJARAN LALU</h3>
            <p className="whitespace-pre-wrap">{kajian.refleksiLalu || "Tiada rekod dimasukkan."}</p>
          </section>

          <section>
            <h3 className="font-bold mb-2">2.0 FOKUS KAJIAN / ISU KEPRIHATINAN</h3>
            <p className="whitespace-pre-wrap">{kajian.fokusKajian || "Tiada rekod dimasukkan."}</p>
          </section>

          <section>
            <h3 className="font-bold mb-2">3.0 OBJEKTIF KAJIAN</h3>
            <h4 className="font-semibold mt-3 mb-1">3.1 Objektif Am</h4>
            <p className="whitespace-pre-wrap mb-4">{kajian.objektifAm || "Tiada rekod."}</p>
            <h4 className="font-semibold mb-1">3.2 Objektif Khusus</h4>
            <p className="whitespace-pre-wrap">{kajian.objektifKhusus || "Tiada rekod."}</p>
          </section>

          <section>
            <h3 className="font-bold mb-2">4.0 PELAKSANAAN INTERVENSI (KEMMIS & MCTAGGART)</h3>
            
            <h4 className="font-semibold mt-3 mb-1">4.1 Merancang (Pelan Tindakan)</h4>
            <p className="whitespace-pre-wrap mb-4">{kajian.pelanTindakan || "Tiada rekod."}</p>
            
            <h4 className="font-semibold mb-1">4.2 Bertindak (Log Pelaksanaan)</h4>
            <p className="font-medium italic">Tarikh Mula: {kajian.tarikhTindakan || "Tidak dinyatakan"}</p>
            <p className="whitespace-pre-wrap mb-4">{kajian.catatanTindakan || "Tiada catatan pelaksanaan."}</p>
            
            <h4 className="font-semibold mb-1">4.3 Memerhati (Pengumpulan Data)</h4>
            <p className="font-medium italic mb-1">Instrumen: {kajian.kaedahPemerhatian || "Tidak dinyatakan"}</p>
            <p className="whitespace-pre-wrap mb-4">{kajian.analisisPemerhatian || "Tiada rekod analisis."}</p>

            <h4 className="font-semibold mb-1">4.4 Mereflek (Keberkesanan)</h4>
            <p className="whitespace-pre-wrap">{kajian.refleksiKajian || "Tiada refleksi akhir dimasukkan."}</p>
          </section>

          <section>
            <h3 className="font-bold mb-2">5.0 KESIMPULAN & TINDAKAN SUSULAN</h3>
            <p>
              Berdasarkan refleksi keseluruhan, status terkini kajian ini adalah: 
              <span className="font-bold uppercase"> {kajian.status}</span>. 
              Tindakan susulan yang diputuskan adalah: 
              <span className="font-bold"> {kajian.tindakanSusulan || "Tidak dinyatakan"}</span>.
            </p>
          </section>

        </div>

        {/* Tanda Tangan */}
        <div className="mt-24 flex justify-between">
          <div>
            <p>Disediakan oleh,</p>
            <br /><br /><br />
            <p className="font-bold uppercase border-t border-black pt-1 px-4 text-center">GURU PENYELIDIK</p>
          </div>
          <div>
            <p>Disahkan oleh,</p>
            <br /><br /><br />
            <p className="font-bold uppercase border-t border-black pt-1 px-4 text-center">PENGETUA / GURU BESAR</p>
          </div>
        </div>

      </div>
    </div>
  );
}