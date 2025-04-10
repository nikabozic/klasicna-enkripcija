"use client";
import { useState } from "react";

export default function TranspositionCipherPage() {
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [result, setResult] = useState("");

  const isValidKey = (k: string) => /^[1-9]\d*$/.test(k) && new Set(k).size === k.length;

  const encrypt = (text: string, key: string) => {
    const cols = key.length;
    const rows = Math.ceil(text.length / cols);
    const grid = Array.from({ length: rows }, (_, r) =>
      text.slice(r * cols, r * cols + cols).padEnd(cols)
    );

    const keyOrder = [...key].map((num, idx) => ({ num, idx }));
    keyOrder.sort((a, b) => a.num.localeCompare(b.num));

    return keyOrder
      .map(({ idx }) => grid.map((row) => row[idx]).join(""))
      .join("");
  };

  const decrypt = (cipher: string, key: string) => {
    const cols = key.length;
    const rows = Math.ceil(cipher.length / cols);
    const keyOrder = [...key].map((num, idx) => ({ num, idx }));
    keyOrder.sort((a, b) => a.num.localeCompare(b.num));

    const colLengths = Array(cols).fill(rows);
    const extra = cols * rows - cipher.length;
    for (let i = cols - 1; i >= cols - extra; i--) colLengths[i]--;

    const columns: string[] = [];
    let start = 0;
    for (let i = 0; i < cols; i++) {
      const len = colLengths[i];
      columns.push(cipher.slice(start, start + len));
      start += len;
    }

    const grid: string[][] = Array.from({ length: rows }, () => Array(cols).fill(""));

    keyOrder.forEach(({ idx }, i) => {
      for (let r = 0; r < columns[i].length; r++) {
        grid[r][idx] = columns[i][r];
      }
    });

    return grid.flat().join("").trim();
  };

  const handleSubmit = () => {
    const cleanKey = key.replace(/\s/g, "");
    if (!isValidKey(cleanKey)) {
      setResult(
        "Greška: Ključ mora biti niz različitih znamenki (npr. 4312).\nSvaka znamenka označava redoslijed stupaca."
      );
      return;
    }

    const output =
      mode === "encrypt"
        ? encrypt(text, cleanKey)
        : decrypt(text, cleanKey);
    setResult(output);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center gap-6 font-mono">
      <h1 className="text-3xl font-bold text-cyan-400 drop-shadow">
        Transpozicijska šifra
      </h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Unesi tekst..."
        className="w-full max-w-md h-32 p-4 rounded bg-gray-900 text-white placeholder-gray-500 resize-none"
      />

      <input
        type="text"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="Unesi ključ (npr. 4312)"
        className="w-full max-w-md p-3 rounded bg-gray-800 text-white placeholder-gray-500"
      />

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
    </div>
  );
}
