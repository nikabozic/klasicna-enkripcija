"use client";
import React from "react";
import { useState } from "react";

function cleanKey(key: string) {
  return key.replace(/[^a-zA-Z]/g, "").toUpperCase();
}

type Step = {
  char: string;
  key: string;
  result: string;
};

function vigenereSteps(text: string, key: string, decrypt = false): { result: string; steps: Step[] } {
  if (!key.length) return { result: "", steps: [] };
  let result = "";
  const steps: Step[] = [];
  key = cleanKey(key);
  let j = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const keyChar = key[j % key.length];

    if (char >= "A" && char <= "Z") {
      const shift = keyChar.charCodeAt(0) - 65;
      const code = char.charCodeAt(0) - 65;
      const newCharCode = decrypt
        ? (code - shift + 26) % 26
        : (code + shift) % 26;
      const newChar = String.fromCharCode(newCharCode + 65);
      result += newChar;
      steps.push({ char, key: keyChar, result: newChar });
      j++;
    } else if (char >= "a" && char <= "z") {
      const shift = keyChar.charCodeAt(0) - 65;
      const code = char.charCodeAt(0) - 97;
      const newCharCode = decrypt
        ? (code - shift + 26) % 26
        : (code + shift) % 26;
      const newChar = String.fromCharCode(newCharCode + 97);
      result += newChar;
      steps.push({ char, key: keyChar, result: newChar });
      j++;
    } else {
      result += char;
      steps.push({ char, key: "-", result: char });
    }
  }

  return { result, steps };
}

export default function VigenereCipherPage() {
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [result, setResult] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!key.trim()) {
      setError("Ključ ne smije biti prazan.");
      setResult("");
      setSteps([]);
      return;
    }
    if (!/^[a-zA-Z]+$/.test(key)) {
      setError("Ključ smije sadržavati samo slova.");
      setResult("");
      setSteps([]);
      return;
    }
    setError("");
    const { result, steps } = vigenereSteps(text, key, mode === "decrypt");
    setResult(result);
    setSteps(steps);
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center font-mono gap-6">
      <h1 className="text-3xl font-bold text-cyan-400">Vigenèreova šifra</h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Unesi tekst..."
        className="w-full max-w-xl h-28 p-4 rounded bg-gray-900 resize-none"
      />

      <input
        type="text"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="Unesi ključ"
        className="w-full max-w-xl p-3 rounded bg-gray-800"
      />

      <div className="flex gap-4">
        <label className="flex gap-2 items-center">
          <input
            type="radio"
            checked={mode === "encrypt"}
            onChange={() => setMode("encrypt")}
          />
          Enkripcija
        </label>
        <label className="flex gap-2 items-center">
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
        className="bg-cyan-600 hover:bg-cyan-700 transition px-6 py-2 rounded"
      >
        Pokreni
      </button>

      {error && <div className="text-red-400 text-sm">{error}</div>}

      {result && (
        <div className="w-full max-w-xl bg-gray-900 p-4 rounded text-cyan-300 mt-4 whitespace-pre-wrap">
          <h2 className="font-bold mb-2">Rezultat:</h2>
          {result}
        </div>
      )}

      {steps.length > 0 && (
        <div className="w-full max-w-xl bg-gray-800 p-4 rounded text-sm mt-6">
          <h3 className="font-bold text-cyan-300 mb-2">🔍 Vizualizacija međukoraka:</h3>
          <div className="grid grid-cols-3 gap-2 font-mono">
            <div className="text-gray-400">Ulaz</div>
            <div className="text-gray-400">Ključ</div>
            <div className="text-gray-400">→ Rezultat</div>
            {steps.map((step, i) => (
              <React.Fragment key={i}>
                <div>{step.char}</div>
                <div>{step.key}</div>
                <div>{step.result}</div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
            <div className="w-full max-w-lg bg-gray-800 mt-10 p-4 rounded text-sm text-gray-200">
        <h3 className="text-cyan-400 font-bold mb-2">🔓 Kako se probija Vigenèreova šifra?</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><b>Kasiski metoda:</b> traženje ponavljajućih nizova za otkrivanje duljine ključa.</li>
          <li><b>Friedmanov test:</b> procjena duljine ključa statistikom učestalosti.</li>
          <li><b>Frekvencijska analiza po stupcima:</b> kad znamo duljinu ključa, svaki stupac napadamo kao Cezara.</li>
          <li><b>Brute-force:</b> za kratke ključeve isprobavaju se sve moguće kombinacije.</li>
        </ul>
        <div className="mt-3 text-cyan-300 italic">
          Danas se koristi samo za edukaciju, jer se lako razbija poznatim metodama.
        </div>
      </div>
    </div>
  );
}
