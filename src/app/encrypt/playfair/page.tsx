"use client";
import { useState } from "react";

export default function PlayfairCipherPage() {
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [result, setResult] = useState("");

  const formatText = (input: string): string[] => {
    const clean = input.toUpperCase().replace(/[^A-Z]/g, "").replace(/J/g, "I");
    const pairs: string[] = [];
    let i = 0;
    while (i < clean.length) {
      const a = clean[i];
      let b = clean[i + 1] || "X";
      if (a === b) {
        b = "X";
        i += 1;
      } else {
        i += 2;
      }
      pairs.push(a + b);
    }
    return pairs;
  };

  const generateMatrix = (keyword: string): string => {
    const cleanKey = keyword.toUpperCase().replace(/[^A-Z]/g, "").replace(/J/g, "I");
    const seen = new Set<string>();
    let square = "";

    for (const char of cleanKey + "ABCDEFGHIKLMNOPQRSTUVWXYZ") {
      if (!seen.has(char)) {
        seen.add(char);
        square += char;
      }
    }
    return square;
  };

  const getPos = (matrix: string, ch: string) => {
    const idx = matrix.indexOf(ch);
    return { row: Math.floor(idx / 5), col: idx % 5 };
  };

  const playfair = (text: string, key: string, decrypt = false) => {
    const matrix = generateMatrix(key);
    const pairs = formatText(text);
    let output = "";

    for (const pair of pairs) {
      const a = pair[0];
      const b = pair[1];
      const posA = getPos(matrix, a);
      const posB = getPos(matrix, b);

      let rowA = posA.row, colA = posA.col;
      let rowB = posB.row, colB = posB.col;

      if (rowA === rowB) {
        colA = (colA + (decrypt ? 4 : 1)) % 5;
        colB = (colB + (decrypt ? 4 : 1)) % 5;
      } else if (colA === colB) {
        rowA = (rowA + (decrypt ? 4 : 1)) % 5;
        rowB = (rowB + (decrypt ? 4 : 1)) % 5;
      } else {
        [colA, colB] = [colB, colA];
      }

      output += matrix[rowA * 5 + colA] + matrix[rowB * 5 + colB];
    }

    return output;
  };

  const handleSubmit = () => {
    if (!key.trim()) {
      setResult("Greška: ključ ne smije biti prazan.");
      return;
    }
    const output = playfair(text, key, mode === "decrypt");
    setResult(output);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center gap-6 font-mono">
      <h1 className="text-3xl font-bold text-cyan-400 drop-shadow">
        Playfair šifra
      </h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Unesi tekst..."
        className="w-full max-w-md h-32 p-4 rounded bg-gray-900 text-white resize-none"
      />

      <input
        type="text"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="Unesi ključ"
        className="w-full max-w-md p-3 rounded bg-gray-800 text-white"
      />

      <div className="flex gap-4">
        <label>
          <input
            type="radio"
            checked={mode === "encrypt"}
            onChange={() => setMode("encrypt")}
          />
          Enkripcija
        </label>
        <label>
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
        className="bg-cyan-600 hover:bg-cyan-700 px-6 py-2 rounded"
      >
        Pokreni
      </button>

      {result && (
        <div className="w-full max-w-md bg-gray-900 p-4 rounded text-cyan-300 whitespace-pre-wrap">
          <h2 className="font-bold mb-2">Rezultat:</h2>
          {result}
        </div>
      )}

      <div className="bg-gray-800 mt-10 p-4 rounded max-w-md text-sm text-gray-300">
        <h3 className="font-bold text-cyan-400 mb-1">🔓 Kako se probija Playfair šifra?</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><b>Frekvencijska analiza digrama:</b> analizira se učestalost parova slova.</li>
          <li><b>Poznati tekst (known plaintext attack):</b> ako je poznat dio izvorne poruke, može se rekonstruirati ključ.</li>
          <li><b>Brute-force metoda:</b> uz dovoljno tekstova može se isprobati velik broj mogućih kvadrata.</li>
        </ul>
        <div className="mt-3 text-cyan-300 italic">
          Playfair je bio napredak u svoje vrijeme, ali nije dovoljno siguran za moderne potrebe.
        </div>
      </div>
    </div>
  );
}
