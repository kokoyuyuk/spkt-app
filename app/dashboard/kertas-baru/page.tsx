"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Ditambah untuk navigasi
import { Save, ArrowRight, Loader2 } from 'lucide-react'; // Ditambah Loader2
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Ditambah Firebase
import { db } from '../../../lib/firebase'; // Ditambah laluan fail Firebase

export default function KertasKajianBaharu() {
  const router = useRouter(); // Penghala untuk lompat halaman
  const [isSaving, setIsSaving] = useState(false); // State untuk animasi butang

  // 1. State gabungan lengkap untuk semua medan Kajian Tindakan KPM
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
    setIsSaving(true); // Mula animasi berpusing

    try {
      // 2. Logik Firebase: Simpan data ke dalam jadual 'kajian_tindakan'
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
      
      // Bawa guru terus ke halaman Arkib Laporan selepas berjaya
      router.push('/dashboard/arkib'); 
      
    } catch (error) {
      console.error("Ralat Firebase:", error);
      alert("Maaf, gagal menyimpan. Sila pastikan pangkalan data Firebase bersambung.");
    } finally {
      setIsSaving(false); // Hentikan animasi berpusing
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col pb-12">
      
      {/* Pengepala Halaman */}
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-1">
          Kertas Kajian Baharu
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Modul 1: Pengenalan, Refleksi P&P dan Isu Keprihatinan
        </p>
      </header>

      {/* Kad Borang Tunggal (Single Card Layout) */}
      <form onSubmit={simpanDraf} className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col">
        
        {/* Ruangan Input Utama */}
        <div className="p-8 space-y-8">
          
          {/* Tajuk Kajian */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">Tajuk Kajian Tindakan</label>
            <input 
              type="text" 
              name="tajuk"
              value={dataKajian.tajuk}
              onChange={kemaskiniInput}
              placeholder="Contoh: Meningkatkan Kemahiran Cantuman Tunas Menggunakan Kit Hijau..."
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 placeholder:text-slate-400"
              required
            />
          </div>

          {/* 1.0 Refleksi */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">1.0 Refleksi Pengajaran & Pembelajaran Lalu</label>
            <textarea 
              name="refleksi"
              value={dataKajian.refleksi}
              onChange={kemaskiniInput}
              rows={4}
              placeholder="Semasa menjalankan amali di kebun, saya mendapati murid sukar untuk..."
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 placeholder:text-slate-400 resize-y"
            ></textarea>
          </div>

          {/* 2.0 Fokus Kajian */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">2.0 Fokus Kajian / Isu Keprihatinan</label>
            <textarea 
              name="fokus"
              value={dataKajian.fokus}
              onChange={kemaskiniInput}
              rows={4}
              placeholder="Kajian ini memfokuskan kepada kelemahan penguasaan psikomotor murid..."
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 placeholder:text-slate-400 resize-y"
            ></textarea>
          </div>

          {/* 3.0 Objektif (Susunan Bersebelahan / Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">3.0 Objektif Am</label>
              <textarea 
                name="objektifAm"
                value={dataKajian.objektifAm}
                onChange={kemaskiniInput}
                rows={4}
                placeholder="Tujuan am kajian ini adalah untuk meningkatkan kualiti P&P bagi subjek..."
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 placeholder:text-slate-400 resize-y"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">3.1 Objektif Khusus</label>
              <textarea 
                name="objektifKhusus"
                value={dataKajian.objektifKhusus}
                onChange={kemaskiniInput}
                rows={4}
                placeholder="1. Murid dapat melengkapkan amali dengan betul.&#10;2. Meningkatkan markah..."
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 placeholder:text-slate-400 resize-y"
              ></textarea>
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
              placeholder="Contoh: 15 orang murid Tingkatan 4 Sains Pertanian..."
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 placeholder:text-slate-400"
            />
          </div>

        </div>

        {/* Bar Tindakan (Footer) */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center rounded-b-2xl">
          <button 
            type="button" 
            onClick={() => router.back()} // Butang batal akan kembali ke halaman sebelumnya
            className="text-slate-500 font-medium hover:text-slate-800 transition-colors px-2"
          >
            Batal
          </button>
          
          <button 
            type="submit"
            disabled={isSaving} // Kunci butang semasa loading
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isSaving ? "Menyimpan..." : "Simpan Draf"} 
            {!isSaving && <ArrowRight size={18} />}
          </button>
        </div>

      </form>
    </div>
  );
}