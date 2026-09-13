import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt } = body;

    // Semak jika kunci API ada
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "API Key tiada. Sila semak fail .env.local" }, { status: 500 });
    }

    // Sambung ke Google Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // PENYELESAIAN MUKTAMAD: Kita guna model yang terbukti wujud dalam senarai kunci kawan!
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // Arahkan AI untuk bertindak sebagai Rakan Penyelidik (Dilengkapi dengan pagar keselamatan topik)
    const arahanSistem = `Anda adalah Rakan AI Penyelidik Kajian Tindakan untuk guru-guru di Malaysia. Jawab dalam Bahasa Melayu yang profesional, ringkas dan mesra. Fokus jawapan anda kepada pedagogi, metodologi kajian, dan penyelesaian masalah di bilik darjah. 

PENTING: Jika soalan guru langsung tidak berkaitan dengan pendidikan, sekolah, pedagogi, atau kajian tindakan, tolak dengan sopan dan minta mereka fokus semula kepada topik pendidikan.

Soalan guru: ${prompt}`;

    const result = await model.generateContent(arahanSistem);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("Ralat AI:", error);
    return NextResponse.json({ error: "Gagal berhubung dengan otak AI." }, { status: 500 });
  }
}