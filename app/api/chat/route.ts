import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt } = body;

    // SUNTIKAN 1: Semak kedua-dua jenis nama kunci API supaya kalis ralat
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    // Semak jika kunci API ada
    if (!apiKey) {
      console.error("Gagal: Kunci API tidak dijumpai dalam sistem pelayan.");
      return NextResponse.json({ error: "API Key tiada. Sila semak tetapan Environment." }, { status: 500 });
    }

    // Sambung ke Google Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // SUNTIKAN 2: Gunakan nama model Flash rasmi yang paling stabil
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Arahkan AI untuk bertindak sebagai Rakan Penyelidik
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