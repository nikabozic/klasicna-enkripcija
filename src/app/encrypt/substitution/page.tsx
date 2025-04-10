"use client";
import { useState } from "react";

export default function SubstitutionCipherPage() {
  const [text, setText] = useState("");
  const [subAlphabet, setSubAlphabet] = useState(""); // Mora biti 26 slova
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [result, setResult] = useState("");

  const normalize = (str: string) => str.toUpperCase().replace(/[^A-Z]/g, "");

  const substitution = (input: string, alphabet: string, decrypt = false) => {
    const cleanSub = normalize(alphabet);
    if (cleanSub.length !== 26) return "Zamjenska abeceda mora imati točno 26 slova.";

    const standard = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const map = decrypt
      ? Object.fromEntries(cleanSub.split("").map((l, i) => [l, standard[i]]))
      : Object.fromEntries(standard.split("").map((l, i) => [l, cleanSub[i]]));

    return input
      .split("")
      .map((char) => {
        const isLower = char >= "a" && char <= "z";
        const upperChar = char.toUpperCase();
        const mapped = map[upperChar];
        if (!mapped) return char;
        return isLower ? mapped.toLowerCase() : mapped;
      })
      .join("");
  };

  const handleSubmit = () => {
    const cleanSub = normalize(subAlphabet);
  
    if (cleanSub.length !== 26) {
      setResult(
        "Greška: Zamjenska abeceda mora imati točno 26 slova.\n\nPrimjer valjane zamjenske abecede:\nQWERTYUIOPASDFGHJKLZXCVBNM"
      );
      return;
    }
  
    const uniqueLetters = new Set(cleanSub.split(""));
    if (uniqueLetters.size !== 26) {
      setResult(
        "Greška: Zamjenska abeceda mora sadržavati svih 26 različitih slova bez ponavljanja.\n\nPrimjer valjane zamjene:\nQWERTYUIOPASDFGHJKLZXCVBNM"
      );
      return;
    }
  
    const output = substitution(text, subAlphabet, mode === "decrypt");
    setResult(output);
  };
  

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center gap-6 font-mono">
      <h1 className="text-3xl font-bold text-cyan-400 drop-shadow">
        Zamjenska šifra
      </h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Unesi tekst..."
        className="w-full max-w-md h-32 p-4 rounded bg-gray-900 text-white placeholder-gray-500 resize-none"
      />

      <input
        type="text"
        value={subAlphabet}
        onChange={(e) => setSubAlphabet(e.target.value)}
        placeholder="Unesi zamjensku abecedu (26 slova, bez razmaka)"
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
