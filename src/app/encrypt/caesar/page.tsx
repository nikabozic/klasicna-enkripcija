"use client";
import { useState, useEffect } from "react";

export default function CaesarCipherPage() {
  const [text, setText] = useState("");
  const [shift, setShift] = useState(3);
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [result, setResult] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [showBruteforce, setShowBruteforce] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const getMapping = () => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const mapping: string[] = [];
    for (let i = 0; i < 26; i++) {
      const original = alphabet[i];
      const converted =
        alphabet[(i + (mode === "encrypt" ? shift : -shift) + 26) % 26];
      mapping.push(`${original} → ${converted}`);
    }
    return mapping;
  };

  const generateExample = () => {
    const examples = ["tajna poruka", "fer seminar", "cezarova sifra"];
    const randomText =
      examples[Math.floor(Math.random() * examples.length)];
    const randomShift = Math.floor(Math.random() * 25) + 1;
    setText(randomText);
    setShift(randomShift);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const getBruteforce = () => {
    const tries: string[] = [];
    for (let i = 1; i < 26; i++) {
      tries.push(`Pomak ${i}: ${caesar(text, i, true)}`);
    }
    return tries;
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center gap-6 font-mono">
      <h1 className="text-3xl font-bold text-cyan-400 drop-shadow">
        Cezarova šifra
      </h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Unesi tekst..."
        className="w-full max-w-md h-32 p-4 rounded bg-gray-900 text-white placeholder-gray-500 resize-none"
      />

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex items-center gap-2">
          <label htmlFor="shift">Pomak:</label>
          <input
            id="shift"
            type="number"
            value={shift}
            onChange={(e) => setShift(parseInt(e.target.value))}
            className="w-16 text-center bg-gray-800 text-white rounded p-1"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="encrypt"
              checked={mode === "encrypt"}
              onChange={() => setMode("encrypt")}
            />
            Enkripcija
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="decrypt"
              checked={mode === "decrypt"}
              onChange={() => setMode("decrypt")}
            />
            Dekripcija
          </label>
        </div>

        <button
          onClick={generateExample}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-1 rounded text-sm"
        >
          Generiraj primjer
        </button>
      </div>

      {result && (
        <div className="mt-6 w-full max-w-md bg-gray-900 p-4 rounded text-cyan-300 whitespace-pre-wrap relative">
          <h2 className="mb-2 font-bold">Rezultat:</h2>
          <button
            onClick={handleCopy}
            className="absolute top-2 right-3 text-xs text-cyan-500 hover:underline"
          >
            {copied ? "Kopirano!" : "Kopiraj"}
          </button>
          {result}
        </div>
      )}

      <button
        onClick={() => setShowTable((prev) => !prev)}
        className="text-sm text-cyan-300 hover:underline"
      >
        {showTable ? "Sakrij mapu slova" : "Prikaži mapu slova"}
      </button>

      {showTable && (
        <div className="text-sm bg-gray-800 p-4 rounded max-w-md w-full text-cyan-200 grid grid-cols-2 gap-2">
          {getMapping().map((m, i) => (
            <span key={i}>{m}</span>
          ))}
        </div>
      )}

      <button
        onClick={() => setShowBruteforce((prev) => !prev)}
        className="text-sm text-cyan-300 hover:underline"
      >
        {showBruteforce ? "Sakrij bruteforce" : "Pokaži sve moguće dekripcije"}
      </button>

      {showBruteforce && (
        <div className="bg-gray-900 mt-4 p-4 rounded text-sm text-cyan-300 max-w-md w-full space-y-1">
          {getBruteforce().map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
        </div>
      )}

      <div className="bg-gray-800 mt-10 p-4 rounded max-w-md text-sm text-gray-300">
        <h3 className="font-bold text-cyan-400 mb-1">🔍 Povijest:</h3>
        Cezarova šifra je jedna od najstarijih poznatih metoda enkripcije, koju
        je koristio Gaj Julije Cezar za slanje vojnih poruka. Pomaknutim
        slovima, neprijatelj bez znanja o pomaku teško je mogao razumjeti poruku.
      </div>
    </div>
  );
}
