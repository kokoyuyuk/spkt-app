"use client";

import { Library, ExternalLink, Search, BookOpen, GraduationCap, Globe, ShieldCheck } from 'lucide-react';

export default function PustakaIlmiah() {
  
  // Senarai Pangkalan Data 'Open Access' Premium (Percuma & Sah)
  const senaraiRujukan = [
    {
      kategori: "Sumber Rasmi Malaysia",
      ikon: <ShieldCheck className="text-amber-500" size={32} />,
      sumber: [
        {
          nama: "MyJurnal (Pusat Sitasi Malaysia)",
          penerangan: "Koleksi jurnal akademik tempatan pelbagai bidang termasuk pendidikan. Sangat penting untuk mencari kajian berkaitan konteks sekolah-sekolah di Malaysia.",
          url: "https://myjurnal.mohe.gov.my/",
          warna: "bg-amber-50"
        },
        {
          nama: "u-Pustaka (PNM)",
          penerangan: "Portal rasmi Perpustakaan Negara Malaysia. Ahli berdaftar boleh meminjam buku digital dan mengakses pangkalan data premium (seperti EBSCO) secara percuma.",
          url: "https://www.u-pustaka.gov.my/",
          warna: "bg-blue-50"
        }
      ]
    },
    {
      kategori: "Pendidikan & Pedagogi Antarabangsa",
      ikon: <GraduationCap className="text-emerald-500" size={32} />,
      sumber: [
        {
          nama: "ERIC (Education Resources Information Center)",
          penerangan: "Lombong emas bagi guru! Ditaja oleh Kerajaan AS, ini adalah pangkalan data terbesar dunia khusus untuk artikel dan jurnal pendidikan yang telah disemak rakan sebaya (peer-reviewed).",
          url: "https://eric.ed.gov/",
          warna: "bg-emerald-50"
        },
        {
          nama: "DOAJ (Directory of Open Access Journals)",
          penerangan: "Direktori global yang memuatkan jurnal berkualiti tinggi dari seluruh dunia secara percuma sepenuhnya. Sesuai untuk mencari teori pembelajaran terkini.",
          url: "https://doaj.org/",
          warna: "bg-orange-50"
        }
      ]
    },
    {
      kategori: "Enjin Carian Akademik Umum",
      ikon: <Search className="text-purple-500" size={32} />,
      sumber: [
        {
          nama: "Google Scholar",
          penerangan: "Enjin carian paling mudah digunakan. Tips: Cari fail yang ada pautan [PDF] di sebelah kanan hasil carian untuk muat turun teks penuh secara percuma.",
          url: "https://scholar.google.com/",
          warna: "bg-purple-50"
        },
        {
          nama: "ResearchGate",
          penerangan: "Rangkaian sosial untuk saintis dan penyelidik. Kerap kali penulis jurnal akan memuat naik fail PDF penuh artikel berbayar mereka di sini untuk dibaca oleh umum secara sah.",
          url: "https://www.researchgate.net/",
          warna: "bg-teal-50"
        }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto pb-12">
      
      {/* Pengepala Halaman */}
      <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800 flex items-center gap-3">
            <Library className="text-blue-600" size={36} /> 
            Pustaka Ilmiah & Rujukan
          </h1>
          <p className="text-lg text-slate-600 mt-2">Koleksi jalan pintas ke pangkalan data jurnal dan buku akademik (Akses Terbuka) berkualiti tinggi.</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-3 rounded-xl flex items-center gap-2 font-semibold">
          <Globe size={20} />
          <span>100% Akses Terbuka (Sah & Percuma)</span>
        </div>
      </header>

      {/* Grid Senarai Rujukan */}
      <div className="space-y-10">
        {senaraiRujukan.map((seksyen, index) => (
          <div key={index}>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3 border-b border-slate-200 pb-3">
              {seksyen.ikon}
              {seksyen.kategori}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {seksyen.sumber.map((item, idx) => (
                <a 
                  key={idx}
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`block p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group ${item.warna} hover:bg-white`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-700 border border-slate-100 group-hover:scale-110 transition-transform">
                      <BookOpen size={24} />
                    </div>
                    <ExternalLink size={20} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">
                    {item.nama}
                  </h3>
                  
                  <p className="text-sm text-slate-600 leading-relaxed text-justify">
                    {item.penerangan}
                  </p>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tips / Nota Tambahan */}
      <div className="mt-12 bg-slate-900 text-slate-300 p-8 rounded-2xl shadow-md border-l-4 border-amber-500 flex flex-col md:flex-row gap-6 items-center">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center shrink-0">
          <ShieldCheck size={32} className="text-amber-500" />
        </div>
        <div>
          <h4 className="text-white font-bold text-lg mb-2 uppercase tracking-wider">Integriti Akademik</h4>
          <p className="text-sm leading-relaxed">
            Sistem ini menggunakan pautan perpustakaan digital berkonsepkan <b>Open Access (OA)</b>. Ia bermaksud pengarang kajian tersebut telah bersetuju menjadikan karya mereka percuma untuk dibaca oleh umum. Pastikan anda sentiasa memetik (cite) sumber rujukan ini di dalam ruangan Rujukan (Format APA) laporan akhir anda untuk mengelakkan plagiat.
          </p>
        </div>
      </div>

    </div>
  );
}