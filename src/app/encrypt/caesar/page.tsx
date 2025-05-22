"use client";
import React from "react";
import { useEffect, useState } from "react";

export default function CaesarCipherPage() {
  const [text, setText] = useState("");
  const [shift, setShift] = useState(3);
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [result, setResult] = useState("");
  const [copiedResult, setCopiedResult] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [showBruteforce, setShowBruteforce] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const [gameText, setGameText] = useState("");
  const [gameShift, setGameShift] = useState(0);
  const [gameGuess, setGameGuess] = useState("");
  const [gameFeedback, setGameFeedback] = useState("");

  const caesar = (input: string, shift: number, decrypt = false) => {
    if (decrypt) shift = -shift;
    return input
      .split("")
      .map((char) => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {
          return String.fromCharCode(((code - 65 + shift + 26) % 26) + 65);
        } else if (code >= 97 && code <= 122) {
          return String.fromCharCode(((code - 97 + shift + 26) % 26) + 97);
        } else {
          return char;
        }
      })
      .join("");
  };

  useEffect(() => {
    const output = caesar(text, shift, mode === "decrypt");
    setResult(output);
  }, [text, shift, mode]);

  const handleCopy = async (textToCopy: string, type: "text" | "result") => {
    await navigator.clipboard.writeText(textToCopy);
    if (type === "result") {
      setCopiedResult(true);
      setTimeout(() => setCopiedResult(false), 1500);
    } else {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 1500);
    }
  };

  const getBruteforce = () => {
    const tries: string[] = [];
    for (let i = 1; i < 26; i++) {
      tries.push(`Pomak ${i}: ${caesar(text, i, true)}`);
    }
    return tries;
  };

  const exportResult = () => {
    const blob = new Blob(
      [`Original: ${text}
Pomak: ${shift}
Rezultat: ${result}`],
      { type: "text/plain" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cezar-rezultat.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const startGame = () => {
    const samples = ["napad na jug", "tajni plan", "dolazimo sutra"];
    const original = samples[Math.floor(Math.random() * samples.length)];
    const s = Math.floor(Math.random() * 25) + 1;
    setGameText(caesar(original, s));
    setGameShift(s);
    setGameGuess("");
    setGameFeedback("");
  };

  const checkGuess = () => {
    const guessNum = parseInt(gameGuess);
    if (isNaN(guessNum) || guessNum < 1 || guessNum > 25) {
      setGameFeedback("⚠️ Molimo unesite broj između 1 i 25.");
      return;
    }
    if (guessNum === gameShift) {
      setGameFeedback("✅ Točno! Pogodili ste pomak.");
    } else {
      setGameFeedback("❌ Netočno. Pokušajte ponovno.");
    }
  };

  const themeClasses =
    theme === "dark"
      ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
      : "bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-50 text-gray-900";

  const inputBg =
    theme === "dark"
      ? "bg-gray-900 text-white placeholder-gray-400"
      : "bg-white text-gray-900 placeholder-gray-400 border border-yellow-300";

  const cardBg =
    theme === "dark"
      ? "bg-gray-900 text-cyan-200 shadow-md"
      : "bg-white border border-yellow-300 text-gray-900 shadow-sm";

  const btnMain =
    theme === "dark"
      ? "bg-cyan-700 hover:bg-cyan-600 text-white"
      : "bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold border border-yellow-500";

  const btnSecondary =
    theme === "dark"
      ? "bg-gray-700 hover:bg-gray-600 text-white"
      : "bg-yellow-100 hover:bg-yellow-200 text-gray-900 border border-yellow-400";

  return (
    <div className={`${themeClasses} min-h-screen p-4 flex flex-col items-center gap-10 font-sans`}>
      <div className="flex justify-between w-full max-w-lg text-sm">
        <button
          onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
          className="text-cyan-400 hover:underline"
        >
          {theme === "dark" ? "🌞 Svijetla tema" : "🌙 Tamna tema"}
        </button>
        <button
          onClick={exportResult}
          className="text-cyan-400 hover:underline"
        >
          📁 Spremi kao .txt
        </button>
      </div>

      <div className="w-full max-w-lg flex flex-col gap-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-wide text-cyan-400 text-center mb-2">
            🔐 Cezarova šifra
          </h1>
          <p className={`text-center text-base mb-2 ${theme === "dark" ? "text-cyan-200" : "text-gray-700"}`}>
            Ispod unesite tekst, izaberite smjer i pomak te isprobajte dekripciju ili enkripciju.
          </p>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Unesi tekst..."
          className={`w-full h-28 p-4 rounded mb-3 ${inputBg} resize-none shadow`}
        />
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          <label className="flex items-center gap-2">
            Pomak:
            <input
              type="number"
              min={1}
              max={25}
              value={shift}
              onChange={(e) => setShift(parseInt(e.target.value))}
              className="w-16 text-center bg-gray-100 rounded p-1 text-gray-900 border border-cyan-300"
            />
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={mode === "encrypt"}
              onChange={() => setMode("encrypt")}
            />
            Enkripcija
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={mode === "decrypt"}
              onChange={() => setMode("decrypt")}
            />
            Dekripcija
          </label>
        </div>
        {result && (
          <div className={`${cardBg} p-4 rounded-lg w-full relative mb-2`}>
            <h2 className="mb-2 font-bold text-lg">Rezultat:</h2>
            <div className="absolute top-2 right-3 flex gap-2 text-xs">
              <button
                onClick={() => handleCopy(result, "result")}
                className="text-cyan-500 hover:underline"
              >
                {copiedResult ? "Kopirano ✅" : "Kopiraj rezultat"}
              </button>
              <button
                onClick={() => handleCopy(text, "text")}
                className="text-cyan-500 hover:underline"
              >
                {copiedText ? "Kopirano ✅" : "Kopiraj original"}
              </button>
            </div>
            <div className="whitespace-pre-wrap break-words">{result}</div>
          </div>
        )}
        {mode === "decrypt" && (
          <>
            <button
              onClick={() => setShowBruteforce(!showBruteforce)}
              className={`text-sm ${btnSecondary}`}
            >
              {showBruteforce ? "Sakrij bruteforce" : "Pokaži sve moguće dekripcije"}
            </button>
            {showBruteforce && (
              <div className={`${cardBg} mt-4 p-4 rounded text-sm max-w-lg w-full space-y-1`}>
                {getBruteforce().map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </div>
            )}
          </>
        )}
        <div className={`${cardBg} mt-4 p-6 rounded-lg`}>
          <h3 className="text-cyan-400 font-bold mb-2 text-lg">🎯 Pogodi pomak</h3>
          <button onClick={startGame} className={`${btnMain} mb-3 px-4 py-1 rounded`}>
            Generiraj poruku
          </button>
          {gameText && (
            <>
              <div className="mb-2">🔐 Poruka: <span className="font-mono">{gameText}</span></div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={gameGuess}
                  onChange={(e) => setGameGuess(e.target.value)}
                  min={1}
                  max={25}
                  className="bg-gray-100 text-gray-900 px-2 py-1 rounded w-20 border border-cyan-200"
                  placeholder="Pomak"
                />
                <button onClick={checkGuess} className={`${btnMain} px-3 py-1 rounded`}>
                  Provjeri
                </button>
              </div>
              <div className="mt-2">{gameFeedback}</div>
            </>
          )}
        </div>
              <div className="bg-gray-800 mt-10 p-4 rounded max-w-md text-sm text-gray-300">
        <h3 className="font-bold text-cyan-400 mb-1">🔓 Kako se probija Cezarova šifra?</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <b>Brute-force napad:</b> isprobaju se svih 25 mogućih pomaka i traži se smisleni tekst.</li>
          <li>
            <b>Frekvencijska analiza:</b> analizom učestalosti slova otkriva se najvjerojatniji pomak (npr. slovo 'E' je najčešće u hrvatskom jeziku).</li>
          <li>
            <b>Automatizirani alati:</b> danas postoje programi koji u sekundi mogu proći kroz sve mogućnosti i otkriti originalnu poruku.</li>
        </ul>
        <div className="mt-3 text-cyan-300 italic">
          Zbog malog broja mogućih ključeva i predvidive strukture jezika, Cezarova šifra nije sigurna za stvarnu zaštitu podataka.
        </div>
      </div>


      </div>
      <footer className="mt-10 text-sm text-gray-400 text-center">
        Izrađeno za FER – Seminar 2 (2025)
      </footer>
    </div>
  );
}
