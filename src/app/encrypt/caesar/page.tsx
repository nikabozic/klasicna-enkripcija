"use client";
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
    if (guessNum === gameShift) {
      setGameFeedback("✅ Točno! Pogodili ste pomak.");
    } else {
      setGameFeedback("❌ Netočno. Pokušajte ponovno.");
    }
  };

  const themeClasses =
    theme === "dark"
      ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
      : "bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-50 text-gray-800";

  return (
    <div className={`${themeClasses} min-h-screen p-8 flex flex-col items-center gap-10 font-sans`}>
      <div className="flex justify-between w-full max-w-2xl text-sm">
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

      <h1 className="text-4xl font-bold tracking-wide text-cyan-400 text-center drop-shadow-md">
        🔐 Cezarova šifra
      </h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Unesi tekst..."
        className="w-full max-w-2xl h-32 p-4 rounded bg-gray-900 text-white placeholder-gray-500 resize-none shadow-lg"
      />

      <div className="flex flex-wrap justify-center gap-6 w-full max-w-2xl">
        <label className="flex items-center gap-2">
          Pomak:
          <input
            type="number"
            value={shift}
            onChange={(e) => setShift(parseInt(e.target.value))}
            className="w-16 text-center bg-gray-800 text-white rounded p-1"
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
        <div className="bg-gray-900 p-4 rounded text-cyan-300 w-full max-w-2xl relative">
          <h2 className="mb-2 font-bold">Rezultat:</h2>
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
          {result}
        </div>
      )}

      {mode === "decrypt" && (
        <>
          <button
            onClick={() => setShowBruteforce(!showBruteforce)}
            className="text-sm text-cyan-300 hover:underline"
          >
            {showBruteforce ? "Sakrij bruteforce" : "Pokaži sve moguće dekripcije"}
          </button>
          {showBruteforce && (
            <div className="bg-gray-900 mt-4 p-4 rounded text-sm text-cyan-300 max-w-2xl w-full space-y-1">
              {getBruteforce().map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
          )}
        </>
      )}

      <div className="w-full max-w-2xl mt-10 bg-gray-800 p-6 rounded text-sm text-white shadow-md">
        <h3 className="text-cyan-400 font-bold mb-2">🎯 Pogodi pomak</h3>
        <button onClick={startGame} className="mb-3 bg-cyan-600 hover:bg-cyan-500 px-3 py-1 rounded">
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
                className="bg-gray-700 text-white px-2 py-1 rounded w-24"
                placeholder="Pomak"
              />
              <button onClick={checkGuess} className="bg-cyan-600 hover:bg-cyan-500 px-3 py-1 rounded">
                Provjeri
              </button>
            </div>
            <div className="mt-2">{gameFeedback}</div>
          </>
        )}
      </div>

      <footer className="mt-10 text-sm text-gray-400 text-center">
        Izrađeno za FER – Seminar 2 (2025)
      </footer>
    </div>
  );
}