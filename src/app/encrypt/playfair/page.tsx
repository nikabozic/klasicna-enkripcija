"use client";
import { useState } from "react";

export default function PlayfairCipherPage() {
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [result, setResult] = useState("");

  const prepareKeySquare = (keyword: string) => {
    const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ"; // I=J
    const cleanKey = keyword.toUpperCase().replace(/[^A-Z]/g, "").replace(/J/g, "I");
    const seen = new Set<string>();
    let square = "";

    for (const char of cleanKey + alphabet) {
      if (!seen.has(char)) {
        seen.add(char);
        square += char;
      }
    }

    return square;
  };

  const formatText = (input: string) => {
    const cleaned = input.toUpperCase().replace(/[^A-Z]/g, "").replace(/J/g, "I");
    let result = "";
    for (let i = 0; i < cleaned.length; i += 2) {
      const a = cleaned[i];
      let b = cleaned[i + 1] || "X";

      if (a === b) {
        b = "X";
        i--; // repeat a with X
      }

      result += a + b;
    }
    return result;
  };

  const playfair = (input: string, key: string, decrypt = false) => {
    const square = prepareKeySquare(key);
    const pairs = formatText(input).match(/.{1,2}/g) || [];
    let output = "";

    const getPos = (ch: string) => {
      const index = square.indexOf(ch);
      return { row: Math.floor(index / 5), col: index % 5 };
    };

    for (const pair of pairs) {
      const [a, b] = pair;
      const posA = getPos(a);
      const posB = getPos(b);

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

      output += square[rowA * 5 + colA] + square[rowB * 5 + colB];
    }

    return output;
  };

  const handleSubmit = () => {
    const cleanKey = key.replace(/[^a-zA-Z]/g, "");
    if (!cleanKey) {
      setResult("Greška: Ključ ne smije biti prazan.");
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
        className="w-full max-w-md h-32 p-4 rounded bg-gray-900 text-white placeholder-gray-500 resize-none"
      />

      <input
        type="text"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="Unesi ključnu riječ"
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
