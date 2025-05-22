"use client";
import Link from "next/link";
import { useState } from "react";

const ciphers = [
  { name: "Cezarova šifra", slug: "caesar" },
  { name: "Vigenèreova šifra", slug: "vigenere" },
  { name: "Zamjenska šifra", slug: "substitution" },
  { name: "Rail Fence šifra", slug: "railFence" },
  { name: "Playfair šifra", slug: "playfair" },
];

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const isDark = theme === "dark";
  const backgroundClass = isDark
    ? "from-[#0a0f1a] to-[#1a1f2a] text-white"
    : "from-[#fdf6e3] to-[#fff] text-[#1a1f2a]";

  const cardStyle = isDark
    ? "bg-[#111827] text-cyan-300 hover:text-white border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_12px_#22d3ee]"
    : "bg-white text-cyan-800 border-cyan-300 hover:border-cyan-600 hover:shadow-md";

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${backgroundClass} px-6 py-20 flex flex-col items-center justify-center gap-16 font-mono transition-colors duration-300`}
    >
      <div className="absolute top-5 right-5">
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="px-3 py-1 rounded text-sm font-semibold border border-cyan-500 hover:bg-cyan-600 transition"
        >
          {isDark ? "🌞 Svijetla tema" : "🌙 Tamna tema"}
        </button>
      </div>

      <h1 className="text-4xl sm:text-5xl font-extrabold text-center tracking-widest drop-shadow">
        🔐 Klasične metode enkripcije
      </h1>

      <div className="flex flex-col gap-4 w-full max-w-xs sm:max-w-sm">
        {ciphers.map((cipher) => (
          <Link
            key={cipher.slug}
            href={`/encrypt/${cipher.slug}`}
            className={`${cardStyle} border rounded-xl px-6 py-4 text-center text-lg font-semibold transition-all duration-200 tracking-tight`}
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
