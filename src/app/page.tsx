"use client";
import Link from "next/link";

const ciphers = [
  { name: "Cezarova šifra", slug: "caesar" },
  { name: "Vigenèreova šifra", slug: "vigenere" },
  { name: "Zamjenska šifra", slug: "substitution" },
  { name: "Transpozicijska šifra", slug: "transposition" },
  { name: "Playfair šifra", slug: "playfair" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1a] to-[#1a1f2a] text-white px-6 py-24 flex flex-col items-center justify-center gap-16 font-mono">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-cyan-400 tracking-widest drop-shadow-[0_0_10px_#22d3ee]">
        🔐 Klasične metode enkripcije
      </h1>

      <div className="flex flex-col gap-4 w-full max-w-xs sm:max-w-sm">
        {ciphers.map((cipher) => (
          <Link
            key={cipher.slug}
            href={`/encrypt/${cipher.slug}`}
            className="bg-[#111827] border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-white hover:shadow-[0_0_12px_#22d3ee] rounded-xl px-6 py-4 text-center text-lg font-semibold transition-all duration-200 tracking-tight"
          >
            {cipher.name}
          </Link>
        ))}
      </div>

      <footer className="mt-20 text-sm text-gray-500 text-center">
        Izrađeno za FER, Seminar 2 – 2025.
      </footer>
    </div>
  );
}
