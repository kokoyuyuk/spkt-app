"use client";

import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, BookOpen } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [isDaftar, setIsDaftar] = useState(false);
  const [emel, setEmel] = useState("");
  const [katalaluan, setKatalaluan] = useState("");
  const [loading, setLoading] = useState(false);

  const tanganiLogMasuk = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isDaftar) {
        // Fungsi mencipta akaun baharu
        await createUserWithEmailAndPassword(auth, emel, katalaluan);
        alert("Akaun berjaya didaftarkan! Selamat datang Cikgu.");
      } else {
        // Fungsi log masuk akaun sedia ada
        await signInWithEmailAndPassword(auth, emel, katalaluan);
      }
      // Bawa pengguna ke Papan Pemuka jika berjaya
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      alert("Ralat: Sila semak semula emel dan kata laluan anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-4 text-blue-600">
          <BookOpen size={48} />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900">
          SPKT KPM
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Sistem Pintar Kajian Tindakan
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-slate-100 rounded-3xl sm:px-10">
          
          <form className="space-y-6" onSubmit={tanganiLogMasuk}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Emel Pengguna</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="email" 
                  required 
                  value={emel}
                  onChange={(e) => setEmel(e.target.value)}
                  className="pl-10 appearance-none block w-full px-3 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="cikgu@moe.edu.my" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Kata Laluan</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="password" 
                  required 
                  value={katalaluan}
                  onChange={(e) => setKatalaluan(e.target.value)}
                  className="pl-10 appearance-none block w-full px-3 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 transition-all"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (isDaftar ? "Daftar Akaun Baharu" : "Log Masuk")}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsDaftar(!isDaftar)}
              className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors"
            >
              {isDaftar ? "Sudah ada akaun? Log masuk di sini." : "Belum mendaftar? Klik sini untuk cipta akaun."}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}