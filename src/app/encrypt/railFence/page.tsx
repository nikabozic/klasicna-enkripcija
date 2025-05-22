"use client";
import { useState } from "react";

export default function RailFenceCipherPage() {
  const [text, setText] = useState("");
  const [rails, setRails] = useState("3");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [result, setResult] = useState("");
  const [steps, setSteps] = useState<string[][]>([]);

  const cleanInput = (txt: string) => txt.replace(/[^A-Za-z]/g, "");

  function encryptRailFence(plainText: string, key: number) {
    const rail = Array.from({ length: key }, () => []);
    const stepView = Array.from({ length: key }, () => Array(plainText.length).fill(" "));
    let dirDown = false;
    let row = 0;

    for (let i = 0; i < plainText.length; i++) {
      rail[row].push(plainText[i]);
      stepView[row][i] = plainText[i];
      if (row === 0 || row === key - 1) dirDown = !dirDown;
      row += dirDown ? 1 : -1;
    }

    setSteps(stepView);
    return rail.flat().join("");
  }

  function decryptRailFence(cipherText: string, key: number) {
    const len = cipherText.length;
    const rail = Array.from({ length: key }, () => Array(len).fill("\n"));
    let dirDown: boolean | null = null;
    let row = 0, col = 0;

    for (let i = 0; i < len; i++) {
      if (row === 0) dirDown = true;
      if (row === key - 1) dirDown = false;

      rail[row][col++] = "*";
      row += dirDown ? 1 : -1;
    }

    let index = 0;
    for (let i = 0; i < key; i++) {
      for (let j = 0; j < len; j++) {
        if (rail[i][j] === "*" && index < len) {
          rail[i][j] = cipherText[index++];
        }
      }
    }

    let result = "";
    row = 0;
    col = 0;
    for (let i = 0; i < len; i++) {
      if (row === 0) dirDown = true;
      if (row === key - 1) dirDown = false;

      if (rail[row][col] !== "*") {
        result += rail[row][col++];
      }
      row += dirDown ? 1 : -1;
    }

    setSteps([]);
    return result;
  }

  const handleSubmit = () => {
    const numRails = parseInt(rails);
    if (isNaN(numRails) || numRails < 2) {
      setResult("Greška: Ključ mora biti broj veći od 1.");
      return;
    }

    const cleanText = cleanInput(text);
    const output =
      mode === "encrypt"
        ? encryptRailFence(cleanText, numRails)
        : decryptRailFence(cleanText, numRails);
    setResult(output);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center gap-6 font-mono">
      <h1 className="text-3xl font-bold text-cyan-400 drop-shadow">
        Rail Fence šifra
      </h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Unesi tekst..."
        className="w-full max-w-md h-32 p-4 rounded bg-gray-900 text-white placeholder-gray-500 resize-none"
      />

      <input
        type="number"
        value={rails}
        onChange={(e) => setRails(e.target.value)}
        placeholder="Broj tračnica (npr. 3)"
        className="w-full max-w-md p-3 rounded bg-gray-800 text-white placeholder-gray-500"
        min={2}
      />

      <div className="flex items-center gap-4">
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

      <button
        onClick={handleSubmit}
        className="bg-cyan-600 hover:bg-cyan-700 transition px-6 py-2 rounded text-white font-semibold"
      >
        Pokreni
      </button>

      {result && (
        <div className="mt-6 w-full max-w-md bg-gray-900 p-4 rounded text-cyan-300 whitespace-pre-wrap">
          <h2 className="mb-2 font-bold">Rezultat:</h2>
          {result}
        </div>
      )}

      {steps.length > 0 && (
        <div className="mt-4 w-full max-w-md bg-gray-800 p-4 rounded text-white text-sm">
          <h3 className="text-cyan-400 font-bold mb-2">🔍 Vizualizacija tračnica:</h3>
          <pre className="font-mono">
            {steps.map((rail, idx) => (
              <div key={idx}>{rail.join("")}</div>
            ))}
          </pre>
        </div>
      )}

      <div className="bg-gray-800 mt-10 p-4 rounded max-w-md text-sm text-gray-300">
        <h3 className="font-bold text-cyan-400 mb-1">🔓 Kako se probija Rail Fence šifra?</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Brute-force napad:</b> isprobavanje različitih brojeva tračnica dok se ne dobije smislen tekst.</li>
          <li><b>Statistička analiza:</b> prepoznavanje uzoraka valova i ponavljanja u šifriranom tekstu.</li>
          <li><b>Vizualna analiza:</b> kod kratkih poruka lako se može pogoditi raspored znakova.</li>
        </ul>
        <div className="mt-3 text-cyan-300 italic">
          Rail Fence šifra se koristi u edukativne svrhe jer se relativno lako probija pravilnim pokušajima.
        </div>
      </div>
    </div>
  );
}
