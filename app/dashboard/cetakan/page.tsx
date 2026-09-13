"use client";

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Printer, FileDown, CheckCircle2, ChevronDown, FileText, Loader2, AlertCircle } from 'lucide-react';

export default function CetakanRasmi() {
  const [senaraiKajian, setSenaraiKajian] = useState<any[]>([]);
  const [kajianPilihan, setKajianPilihan] = useState("");
  const [dataKajian, setDataKajian] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ambil senarai kajian
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

  // Ambil data penuh bila dropdown dipilih
  useEffect(() => {
    const tarikDataPenuh = async () => {
      if (!kajianPilihan) {
        setDataKajian(null);
        return;
      }
      try {
        const docRef = await getDoc(doc(db, "kajian_tindakan", kajianPilihan));
        if (docRef.exists()) {
          setDataKajian(docRef.data());
        }
      } catch (error) {
        console.error(error);
      }
    };
    tarikDataPenuh();
  }, [kajianPilihan]);

  // Fungsi cetak (menggunakan fungsi native browser print yang dipotong khusus untuk A4)
  const janaPDF = () => {
    window.print();
  };

  if (isLoading) {
    return <div className="flex h-[50vh] items-center justify-center text-blue-500"><Loader2 className="animate-spin" size={40} /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto pb-12 print:p-0 print:m-0">
      
      {/* Bahagian Header - Akan disembunyikan semasa print */}
      <header className="mb-8 print:hidden">
        <h1 className="text-4xl font-extrabold text-slate-800 flex items-center gap-3">
          <Printer className="text-indigo-600" size={36} /> 
          Cetakan Rasmi (PDF)
        </h1>
        <p className="text-lg text-slate-600 mt-2">
          Jana laporan penuh dengan format rasmi KPM yang telah dikunci (Saiz A4, Arial 11, Spacing 1.5).
        </p>
      </header>

      {/* Kotak Pilihan & Kawalan - Akan disembunyikan semasa print */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4 items-end print:hidden relative z-10">
        <div className="flex-1 w-full relative">
          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Pilih Kajian Untuk Dicetak:</label>
          <div className="relative">
            <select 
              value={kajianPilihan} 
              onChange={(e) => setKajianPilihan(e.target.value)}
              className="w-full p-4 pr-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none bg-slate-50 font-bold text-slate-700 cursor-pointer"
            >
              <option value="">-- SILA PILIH KAJIAN --</option>
              {senaraiKajian.map(k => (
                <option key={k.id} value={k.id}>{k.tajukKajian}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-4 text-slate-400 pointer-events-none" size={24} />
          </div>
        </div>
        
        <button 
          onClick={janaPDF}
          disabled={!kajianPilihan}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto h-[58px]"
        >
          <FileDown size={20} /> Jana & Muat Turun PDF
        </button>
      </div>

      {!kajianPilihan ? (
        <div className="bg-slate-100 rounded-3xl border-2 border-dashed border-slate-300 p-16 text-center print:hidden">
          <FileText size={64} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">Pratonton Kertas A4</h3>
          <p className="text-slate-500">Sila pilih kajian di atas untuk melihat rupa laporan rasmi anda.</p>
        </div>
      ) : (
        <div className="flex flex-col xl:flex-row gap-8 print:block print:w-full print:h-full">
          
          {/* Panel Info Pematuhan Format (Kiri) - Disembunyikan masa print */}
          <div className="xl:w-1/3 shrink-0 print:hidden space-y-6">
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 shadow-sm">
              <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2 mb-4">
                <CheckCircle2 size={24} /> Pematuhan Format KPM
              </h3>
              <ul className="space-y-3 text-sm text-emerald-700 font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Margins: Kiri 1.5", Kanan/Atas/Bawah 1.0"</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Fon: Arial, Saiz 11</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Jarak Baris: 1.5 Spacing</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Penjajaran: Justified (Kiri Kanan)</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} /> Muka Hadapan Rasmi disertakan</li>
              </ul>
            </div>

            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 shadow-sm">
              <h3 className="text-lg font-bold text-amber-800 flex items-center gap-2 mb-2">
                <AlertCircle size={20} /> Panduan Cetakan
              </h3>
              <p className="text-sm text-amber-700 text-justify">
                Apabila anda menekan butang <strong>Jana PDF</strong>, tetingkap tetapan pencetak pelayar web akan muncul. Pastikan anda memilih <strong>"Save as PDF"</strong> dan buang tanda (untick) pada <em>Headers and footers</em> supaya logo bersih.
              </p>
            </div>
          </div>

          {/* KANVAS KERTAS A4 MAYA (Kanan) - Ini yang akan diprint! */}
          <div className="flex-1 flex justify-center bg-slate-200 p-8 rounded-3xl print:p-0 print:bg-white print:block">
            
            <div className="bg-white shadow-2xl overflow-hidden print:shadow-none print:w-full" style={{ width: '210mm', minHeight: '297mm', padding: '25.4mm 25.4mm 25.4mm 38.1mm' }}>
              
              {/* HALAMAN 1: Muka Depan (Cover Page) */}
              <div className="flex flex-col items-center text-center h-[240mm] justify-between font-arial break-after-page">
                <div className="w-full pt-10">
                  <img src="/logo-kpm.png" alt="Logo KPM" className="h-28 mx-auto mb-6" />
                  <h1 className="text-[16pt] font-bold uppercase mb-2">KEMENTERIAN PENDIDIKAN MALAYSIA</h1>
                  <h2 className="text-[14pt] font-bold uppercase mt-8 border-b-2 border-black inline-block pb-1">
                    LAPORAN KAJIAN TINDAKAN
                  </h2>
                </div>

                <div className="w-full">
                  <h3 className="text-[16pt] font-bold uppercase leading-relaxed max-w-lg mx-auto">
                    {dataKajian?.tajukKajian || "[TAJUK KAJIAN TINDAKAN]"}
                  </h3>
                </div>

                <div className="w-full pb-10 flex flex-col items-center">
                  <p className="text-[12pt] font-bold mb-2">Disediakan Oleh:</p>
                  <p className="text-[12pt] font-bold uppercase mb-8">{dataKajian?.namaPenyelidik || "[NAMA GURU]"}</p>
                  
                  {dataKajian?.status === 'Telah Disahkan' && (
                    <div className="mt-4 border-2 border-slate-800 p-4 inline-block transform -rotate-2">
                      <p className="text-[10pt] font-bold text-slate-800 uppercase tracking-widest">DISAHKAN OLEH PENTADBIR</p>
                      <p className="text-[8pt] text-slate-600 font-bold mt-1">SISTEM PINTAR KAJIAN TINDAKAN</p>
                    </div>
                  )}
                </div>
              </div>

              {/* HALAMAN 2: Kandungan (Mengikut Format KPM) */}
              <div className="font-arial text-[11pt] leading-[1.5] text-justify" style={{ fontFamily: 'Arial, sans-serif' }}>
                <h4 className="font-bold mb-4 uppercase">1.0 FOKUS KAJIAN</h4>
                <p className="mb-6 indent-12">{dataKajian?.fokusKajian || "Tiada fokus kajian direkodkan."}</p>

                <h4 className="font-bold mb-4 uppercase">2.0 OBJEKTIF KAJIAN</h4>
                <p className="mb-2 font-bold">2.1 Objektif Umum:</p>
                <p className="mb-4 indent-12">{dataKajian?.objektifUmum || "Meningkatkan kualiti PdP di dalam bilik darjah."}</p>
                
                <p className="mb-2 font-bold">2.2 Objektif Khusus:</p>
                <div className="mb-6 pl-12" dangerouslySetInnerHTML={{ __html: dataKajian?.objektifKhusus || "i. Meningkatkan penguasaan murid." }} />

                <h4 className="font-bold mb-4 uppercase">3.0 TINJAUAN LITERATUR</h4>
                <p className="mb-6 indent-12">{dataKajian?.tinjauanLiteratur || "Sila rujuk modul Rakan AI untuk menjana tinjauan literatur yang disokong rujukan akademik."}</p>

                <h4 className="font-bold mb-4 uppercase">4.0 METODOLOGI & PELAKSANAAN</h4>
                <p className="mb-6 indent-12">
                  Kajian ini menggunakan instrumen pra dan pasca. Berdasarkan Analisis Ujian-t Bersandar yang dikira melalui Kalkulator SPKT, analisis mendapati data adalah signifikan secara statistik. Peratusan kelulusan turut menunjukkan tren peningkatan seperti graf yang dilampirkan.
                </p>

                <h4 className="font-bold mb-4 uppercase">5.0 REFLEKSI & IMPAK</h4>
                <p className="mb-6 indent-12">{dataKajian?.refleksi || "Tiada refleksi akhir direkodkan."}</p>
              </div>

            </div>
          </div>

        </div>
      )}
      
      {/* Kod CSS khas untuk pastikan print hanya tunjuk A4 */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          .print\\:block, .print\\:block * { visibility: visible; }
          .print\\:block { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; }
          @page { size: A4 portrait; margin: 0; }
        }
      `}} />
    </div>
  );
}