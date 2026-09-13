"use client";

import { useEffect, useState } from 'react';
import { User, Mail, Building, Save, Loader2, ShieldCheck } from 'lucide-react';
import { auth } from '../../../lib/firebase';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';

export default function TetapanProfil() {
  const [pengguna, setPengguna] = useState<any>(null);
  const [namaPenuh, setNamaPenuh] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Sedut maklumat akaun yang sedang log masuk
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setPengguna(user);
        if (user.displayName) {
          setNamaPenuh(user.displayName);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSimpanProfil = async () => {
    if (!pengguna) return;
    setIsSaving(true);
    try {
      // Mengemaskini nama pada kad akses Firebase
      await updateProfile(pengguna, {
        displayName: namaPenuh
      });
      alert("Tahniah! Profil anda berjaya dikemaskini.");
    } catch (error) {
      console.error("Ralat menyimpan profil:", error);
      alert("Gagal mengemaskini profil. Sila cuba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-slate-500">
        <Loader2 className="animate-spin text-blue-600 mr-3" size={32} /> 
        <span className="text-lg font-medium">Memuatkan profil...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-800 flex items-center gap-3">
          <User className="text-blue-600" size={36} /> 
          Profil & Tetapan
        </h1>
        <p className="text-lg text-slate-600 mt-2">Urus maklumat peribadi dan tetapan akaun anda di sini.</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Pengepala Kad */}
        <div className="bg-blue-50 border-b border-blue-100 p-6 md:p-8 flex items-center gap-4">
          <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-md">
            {namaPenuh ? namaPenuh.charAt(0).toUpperCase() : <User size={40} />}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {namaPenuh || "Pengguna KPM"}
            </h2>
            <div className="flex items-center gap-2 text-blue-700 font-medium mt-1">
              <ShieldCheck size={18} /> Akaun Sah (Penyelidik Aktif)
            </div>
          </div>
        </div>

        {/* Borang Tetapan */}
        <div className="p-6 md:p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ruangan Emel (Tidak Boleh Diubah) */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Emel Pendaftaran (KPM)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-slate-400" size={20} />
                <input 
                  type="email" 
                  disabled
                  value={pengguna?.email || ""}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 bg-slate-100 rounded-xl text-slate-500 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">*Emel tidak boleh diubah untuk tujuan keselamatan data.</p>
            </div>

            {/* Ruangan Nama Penuh */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Nama Penuh</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-slate-400" size={20} />
                <input 
                  type="text" 
                  value={namaPenuh}
                  onChange={(e) => setNamaPenuh(e.target.value)}
                  placeholder="Cth: Cikgu Ahmad Bin Ali"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Ruangan Penempatan (Kosmetik Buat Masa Ini) */}
          <div className="border-t border-slate-100 pt-6 mt-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">Lokasi Bertugas / Penempatan</label>
            <div className="relative">
              <Building className="absolute left-3 top-3.5 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Cth: Pejabat Pendidikan Daerah Pitas"
                className="w-full md:w-1/2 pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-800"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">*Hanya untuk rujukan visual paparan profil ketika ini.</p>
          </div>

          <div className="flex justify-end pt-6">
            <button 
              onClick={handleSimpanProfil}
              disabled={isSaving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md disabled:bg-slate-400"
            >
              {isSaving ? <><Loader2 className="animate-spin" size={20} /> Menyimpan...</> : <><Save size={20} /> Simpan Perubahan</>}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}