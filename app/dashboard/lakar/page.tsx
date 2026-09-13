"use client";

import { PenTool } from 'lucide-react';
// Import enjin Tldraw dan fail CSS wajibnya
import { Tldraw } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';

export default function PapanLakar() {
  return (
    <div className="max-w-7xl mx-auto h-[85vh] flex flex-col">
      <header className="mb-4">
        <h1 className="text-4xl font-extrabold text-slate-800 flex items-center gap-3">
          <PenTool className="text-blue-600" size={36} /> 
          Papan Lakar Intervensi (Pro)
        </h1>
        <p className="text-lg text-slate-600 mt-2">
          Enjin Kanvas Pro: Sokongan penuh untuk bentuk geometri, pen stilus, teks, dan lapisan gambar.
        </p>
      </header>

      {/* Bekas Kanvas Tldraw */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm relative z-0 overflow-hidden">
        {/* Tldraw secara automatik memuatkan semua alatan melukis */}
        <Tldraw autoFocus />
      </div>
    </div>
  );
}