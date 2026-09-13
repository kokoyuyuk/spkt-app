"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// SUNTIKAN: Tambah ikon Lightbulb untuk tips
import { Save, ArrowRight, Loader2, Lightbulb } from 'lucide-react'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 
import { db } from '../../../lib/firebase'; 

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

  const kemaskiniInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDataKajian(prev => ({ ...prev, [name]: value }));
  };

  const simpanDraf = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true); 

    try {
      await addDoc(collection(db, "kajian_tindakan"), {
        tajukKajian: dataKajian.tajuk,
        refleksiLalu: dataKajian.refleksi,
        fokusKajian: dataKajian.fokus,
        objektifAm: dataKajian.objektifAm,
        objektifKhusus: dataKajian.objektifKhusus,
        kumpulanSasaran: dataKajian.kumpulanSasaran,
        status: "Draf", 
        tarikhDicipta: serverTimestamp(),
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

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col pb-12">
      
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-1">
          Kertas Kajian Baharu
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Modul 1: Pengenalan, Refleksi P&P dan Isu Keprihatinan
        </p>
      </header>

      <form onSubmit={simpanDraf} className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col">
        
        <div className="p-8 space-y-10">
          
          {/* Tajuk Kajian */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">Tajuk Kajian Tindakan</label>
            <input 
              type="text" 
              name="tajuk"
              value={dataKajian.tajuk}
              onChange={kemaskiniInput}
              placeholder="Cth: Meningkatkan Penguasaan Fakta Sejarah Menggunakan Kaedah 'Nyanyian Memori'..."
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 placeholder:text-slate-400 font-medium"
              required
            />
            <div className="mt-3 bg-blue-50 text-blue-700 p-4 rounded-xl flex items-start gap-3 border border-blue-100">
              <Lightbulb size={20} className="shrink-0 mt-0.5 text-blue-600" />
              <div className="text-sm">
                <p className="font-bold mb-1">Tips Tajuk KPM:</p>
                <p className="opacity-90">Tajuk yang baik mesti mengandungi 3 elemen: <strong>Tindakan/Intervensi</strong> (Kaedah Nyanyian), <strong>Isu</strong> (Penguasaan Fakta), dan <strong>Sasaran</strong> (Murid Tahun 5).</p>
              </div>
            </div>
          </div>

          {/* 1.0 Refleksi */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">1.0 Refleksi Pengajaran & Pembelajaran Lalu</label>
            <textarea 
              name="refleksi"
              value={dataKajian.refleksi}
              onChange={kemaskiniInput}
              rows={5}
              placeholder="Saya mengajar kelas 4 Tekun. Sewaktu menyemak kertas ujian topikal bulan Mac, saya berasa sangat kecewa kerana..."
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 placeholder:text-slate-400 resize-y leading-relaxed"
            ></textarea>
            <div className="mt-3 bg-blue-50 text-blue-700 p-4 rounded-xl flex items-start gap-3 border border-blue-100">
              <Lightbulb size={20} className="shrink-0 mt-0.5 text-blue-600" />
              <div className="text-sm">
                <p className="font-bold mb-1">Tips Refleksi:</p>
                <p className="opacity-90">Luahkan masalah sebenar di dalam kelas. Nyatakan bagaimana anda mengesan masalah tersebut (contoh: pemantauan, markah ujian, atau murid tidak mahu mengangkat tangan).</p>
              </div>
            </div>
          </div>

          {/* 2.0 Fokus Kajian */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">2.0 Fokus Kajian / Isu Keprihatinan</label>
            <textarea 
              name="fokus"
              value={dataKajian.fokus}
              onChange={kemaskiniInput}
              rows={4}
              placeholder="Walaupun murid mempunyai pelbagai masalah, kajian ini hanya memfokuskan kepada kegagalan murid menyusun struktur ayat dengan betul..."
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 placeholder:text-slate-400 resize-y leading-relaxed"
            ></textarea>
            <div className="mt-3 bg-blue-50 text-blue-700 p-4 rounded-xl flex items-start gap-3 border border-blue-100">
              <Lightbulb size={20} className="shrink-0 mt-0.5 text-blue-600" />
              <div className="text-sm">
                <p className="font-bold mb-1">Tips Fokus:</p>
                <p className="opacity-90">Jangan selesaikan semua masalah serentak. Pilih <strong>SATU</strong> kelemahan spesifik yang paling kritikal untuk diselesaikan dahulu (Cth: Kemahiran mendarab, bukan kelemahan seluruh subjek Matematik).</p>
              </div>
            </div>
          </div>

          {/* 3.0 Objektif (Susunan Bersebelahan / Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">3.0 Objektif Am</label>
              <textarea 
                name="objektifAm"
                value={dataKajian.objektifAm}
                onChange={kemaskiniInput}
                rows={4}
                placeholder="Tujuan am kajian ini adalah untuk meningkatkan kualiti PdP bagi subjek Sains dalam kalangan murid luar bandar..."
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 placeholder:text-slate-400 resize-y leading-relaxed"
              ></textarea>
              <div className="mt-3 bg-blue-50 text-blue-700 p-4 rounded-xl flex items-start gap-3 border border-blue-100">
                <Lightbulb size={20} className="shrink-0 mt-0.5 text-blue-600" />
                <div className="text-sm">
                  <p className="font-bold mb-1">Tips Objektif Am:</p>
                  <p className="opacity-90">Kenyataan umum tentang halatuju kajian untuk jangka masa panjang (tidak semestinya boleh diukur).</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">3.1 Objektif Khusus</label>
              <textarea 
                name="objektifKhusus"
                value={dataKajian.objektifKhusus}
                onChange={kemaskiniInput}
                rows={4}
                placeholder="1. Meningkatkan kelulusan ujian pasca sebanyak 20%.&#10;2. Memastikan 10 murid dapat melengkapkan amali tanpa bantuan."
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 placeholder:text-slate-400 resize-y leading-relaxed"
              ></textarea>
              <div className="mt-3 bg-blue-50 text-blue-700 p-4 rounded-xl flex items-start gap-3 border border-blue-100">
                <Lightbulb size={20} className="shrink-0 mt-0.5 text-blue-600" />
                <div className="text-sm">
                  <p className="font-bold mb-1">Tips Objektif Khusus:</p>
                  <p className="opacity-90">Mesti bersifat SMART. Letakkan <strong>angka, peratusan, atau indikator</strong> yang boleh diukur dengan jelas selepas intervensi dijalankan.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 4.0 Kumpulan Sasaran */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">4.0 Kumpulan Sasaran</label>
            <input 
              type="text" 
              name="kumpulanSasaran"
              value={dataKajian.kumpulanSasaran}
              onChange={kemaskiniInput}
              placeholder="Cth: Kajian ini melibatkan 8 orang murid (5 lelaki, 3 perempuan) dari kelas 4 Inovatif yang mencatat gred E..."
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 placeholder:text-slate-400 font-medium"
            />
            <div className="mt-3 bg-blue-50 text-blue-700 p-4 rounded-xl flex items-start gap-3 border border-blue-100">
              <Lightbulb size={20} className="shrink-0 mt-0.5 text-blue-600" />
              <div className="text-sm">
                <p className="font-bold mb-1">Tips Kumpulan Sasaran:</p>
                <p className="opacity-90">Jangan libatkan satu kelas penuh jika masalah hanya dialami oleh sebahagian murid. Nyatakan bilangan tepat, kelas, jantina (jika relevan), dan tahap kognitif mereka.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bar Tindakan (Footer) */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center rounded-b-2xl">
          <button 
            type="button" 
            onClick={() => router.back()} 
            className="text-slate-500 font-medium hover:text-slate-800 transition-colors px-4 py-2 rounded-lg hover:bg-slate-200/50"
          >
            Batal
          </button>
          
          <button 
            type="submit"
            disabled={isSaving} 
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            {isSaving ? "Menyimpan Draf..." : "Simpan Kertas Kajian"} 
            {!isSaving && <ArrowRight size={20} />}
          </button>
        </div>

      </form>
    </div>
  );
}