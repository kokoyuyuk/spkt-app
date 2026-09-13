"use client";

import { BookMarked, Activity, BarChart3, FileImage, Bot, ShieldCheck, Library, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function PanduanPengguna() {
  return (
    <div className="max-w-4xl mx-auto pb-12">
      
      {/* Pengepala Panduan */}
      <header className="mb-10 text-center">
        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm transform rotate-3">
          <BookMarked size={40} className="-rotate-3" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-800 mb-3">Manual Pengguna SPKT</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Panduan komprehensif penggunaan Sistem Pintar Kajian Tindakan KPM serta tatacara mengakses pangkalan data Pustaka Ilmiah secara percuma.
        </p>
      </header>

      <div className="space-y-12">
        
        {/* Seksyen 1: Rumusan Modul */}
        <section>
          <h2 className="text-2xl font-bold text-slate-800 border-b-2 border-slate-200 pb-3 mb-6 flex items-center gap-3">
            <Activity className="text-blue-600" /> 1. Modul-Modul Premium SPKT
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Activity size={20} /></div>
                <h3 className="font-bold text-slate-800">Bilik Gerakan Kitaran</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed text-justify">
                Menggunakan Model Kemmis & McTaggart. Guru dibimbing melalui empat tab interaktif: Merancang, Bertindak, Memerhati, dan Mereflek. Penukaran status kajian (Draf ke Selesai) berlaku secara automatik.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><BarChart3 size={20} /></div>
                <h3 className="font-bold text-slate-800">Kalkulator Analisis Data</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed text-justify">
                Enjin pengiraan berasaskan data (Data-Driven). Masukkan markah Ujian Pra dan Pasca; sistem akan mengira peratus peningkatan dan menjana graf palang (Recharts) secara masa sebenar.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><FileImage size={20} /></div>
                <h3 className="font-bold text-slate-800">One Page Report (OPR)</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed text-justify">
                Menjana infografik eksekutif (bersaiz A4) yang merumuskan keseluruhan kajian. Sangat sesuai untuk dibentangkan dalam sesi perkongsian amalan terbaik peringkat sekolah atau daerah.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Bot size={20} /></div>
                <h3 className="font-bold text-slate-800">Rakan AI Penyelidik</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed text-justify">
                Pembantu maya berasaskan Kecerdasan Buatan (AI) yang sedia mencadangkan teori pedagogi, merangka objektif SMART, dan menyusun format rujukan APA ke-7 dengan tepat.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 md:col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><ShieldCheck size={20} /></div>
                <h3 className="font-bold text-slate-800">Laluan Pengesahan Pentadbir</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">
                Papan pemuka eksklusif bagi Ketua Jabatan / Pengetua untuk menyemak dan meluluskan laporan. Dilengkapi fungsi pengesahan dan cetakan cop digital rasmi.
              </p>
            </div>
            
          </div>
        </section>

        {/* Seksyen 2: Pustaka Ilmiah */}
        <section>
          <h2 className="text-2xl font-bold text-slate-800 border-b-2 border-slate-200 pb-3 mb-6 flex items-center gap-3">
            <Library className="text-emerald-600" /> 2. Panduan Akses Pustaka Ilmiah
          </h2>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* u-Pustaka */}
            <div className="p-6 md:p-8 border-b border-slate-100 bg-emerald-50/30">
              <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                Harta Karun Negara: u-Pustaka (PNM)
              </h3>
              <p className="text-slate-600 mb-4 text-sm">Laluan utama dan terbaik untuk mendapatkan jurnal premium secara sah dan percuma dari rumah, terutamanya bagi guru di luar bandar.</p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" /> <strong>Pendaftaran:</strong> Percuma di portal u-Pustaka menggunakan Kad Pengenalan.</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" /> <strong>Keistimewaan:</strong> Akses jauh (remote access) ke pangkalan data antarabangsa mahal seperti EBSCOhost, Emerald, dan ProQuest.</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" /> <strong>Cara Penggunaan:</strong> Log masuk portal u-Pustaka &gt; Perkhidmatan &gt; Pangkalan Data Komersial.</li>
              </ul>
            </div>

            {/* Universiti Awam */}
            <div className="p-6 md:p-8 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Akses Keahlian Luar Universiti Awam (UA)</h3>
              <p className="text-slate-600 mb-4 text-sm">Sesuai untuk guru yang memerlukan rujukan fizikal dan ruang bacaan akademik (UPSI, UM, UKM, UiTM).</p>
              <ul className="space-y-2 text-sm text-slate-700 list-disc list-inside ml-2 marker:text-slate-400">
                <li>Boleh mendaftar sebagai "Keahlian Rakan Awam" dengan yuran tahunan yang berpatutan.</li>
                <li>Jika anda adalah Alumni, yuran selalunya lebih rendah.</li>
                <li><strong>Limitasi:</strong> Pangkalan data jurnal antarabangsa UA biasanya terikat dengan lesen ketat. Muat turun PDF mungkin memerlukan anda berada secara fizikal menggunakan WiFi kampus tersebut.</li>
              </ul>
            </div>

            {/* Open Access */}
            <div className="p-6 md:p-8">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Pangkalan Data 'Open Access' (Terbuka)</h3>
              <ul className="space-y-3 text-sm text-slate-700">
                <li><strong>MyJurnal (Pusat Sitasi Malaysia):</strong> Direktori carian jurnal tempatan. Relevan untuk melihat kajian dalam konteks pendidikan di Malaysia.</li>
                <li><strong>ERIC:</strong> Pangkalan data tajaan AS, paling komprehensif di dunia untuk artikel dan teori pendidikan seluruh dunia.</li>
                <li><strong>DOAJ:</strong> Direktori global bagi jurnal <em>peer-reviewed</em> berkualiti tinggi yang 100% percuma.</li>
              </ul>
            </div>

          </div>
        </section>

        {/* Seksyen 3: Integriti */}
        <section>
          <div className="bg-slate-900 rounded-2xl shadow-md p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-full mix-blend-screen filter blur-[50px] opacity-20"></div>
            <h2 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2 relative z-10">
              <AlertCircle /> Tip Integriti Penyelidikan
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed text-justify relative z-10">
              Bagi memastikan laporan SPKT berintegriti tinggi, pastikan setiap rujukan idea, ayat, atau teori yang diambil daripada jurnal u-Pustaka, MyJurnal, dan sebagainya dinyatakan kreditnya. Gunakan <strong>Rakan AI Penyelidik</strong> di dalam sistem ini untuk menyemak ketepatan penyusunan format <strong>American Psychological Association (APA) Edisi Ke-7</strong> bagi setiap penulisan rujukan di akhir laporan.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}