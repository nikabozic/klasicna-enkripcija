"use client";
import { useState } from "react";

export default function SubstitutionCipherPage() {
  const [text, setText] = useState("");
  const [subAlphabet, setSubAlphabet] = useState("");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [result, setResult] = useState("");
  const [steps, setSteps] = useState<string[]>([]);

  const normalize = (str: string) => str.toUpperCase().replace(/[^A-Z]/g, "");

  const substitution = (input: string, alphabet: string, decrypt = false) => {
    const cleanSub = normalize(alphabet);
    const standard = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const map = decrypt
      ? Object.fromEntries(cleanSub.split("").map((l, i) => [l, standard[i]]))
      : Object.fromEntries(standard.split("").map((l, i) => [l, cleanSub[i]]));

    const stepsLog: string[] = [];

    const output = input
      .split("")
      .map((char) => {
        const isLower = char >= "a" && char <= "z";
        const upperChar = char.toUpperCase();
        const mapped = map[upperChar];

        if (!mapped) {
          stepsLog.push(`${char} → (nije slovo, preskočeno)`);
          return char;
        }

        const finalChar = isLower ? mapped.toLowerCase() : mapped;
        stepsLog.push(`${char} → ${finalChar}`);
        return finalChar;
      })
      .join("");

    setSteps(stepsLog);
    return output;
  };

  const handleSubmit = () => {
    const cleanSub = normalize(subAlphabet);

    if (cleanSub.length !== 26) {
      setResult(
        "❌ Greška: Zamjenska abeceda mora imati točno 26 slova.\n\nPrimjer: QWERTYUIOPASDFGHJKLZXCVBNM"
      );
      setSteps([]);
      return;
    }

    const uniqueLetters = new Set(cleanSub.split(""));
    if (uniqueLetters.size !== 26) {
      setResult(
        "❌ Greška: Abeceda mora sadržavati svih 26 različitih slova bez ponavljanja."
      );
      setSteps([]);
      return;
    }

    const output = substitution(text, subAlphabet, mode === "decrypt");
    setResult(output);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1a] to-[#1a1f2a] text-white p-8 flex flex-col items-center gap-6 font-mono">
      <h1 className="text-3xl font-bold text-cyan-400 drop-shadow text-center">
        🔄 Zamjenska šifra
      </h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Unesi tekst..."
        className="w-full max-w-xl h-32 p-4 rounded bg-gray-900 text-white placeholder-gray-500 resize-none"
      />

      <input
        type="text"
        value={subAlphabet}
        onChange={(e) => setSubAlphabet(e.target.value)}
        placeholder="Unesi zamjensku abecedu (npr. QWERTYUIOPASDFGHJKLZXCVBNM)"
        className="w-full max-w-xl p-3 rounded bg-gray-800 text-white placeholder-gray-500"
      />

      <div className="flex gap-4">
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
        <div className="mt-6 w-full max-w-xl bg-gray-900 p-4 rounded text-cyan-300 whitespace-pre-wrap">
          <h2 className="mb-2 font-bold">Rezultat:</h2>
          {result}
        </div>
      )}

      {steps.length > 0 && (
        <div className="mt-4 w-full max-w-xl bg-gray-800 p-4 rounded text-sm text-cyan-200">
          <h3 className="font-bold text-cyan-300 mb-2">🧮 Koraci zamjene:</h3>
          {steps.map((step, idx) => (
            <div key={idx}>{idx + 1}. {step}</div>
          ))}
        </div>
      )}

      <div className="w-full max-w-lg bg-gray-800 mt-10 p-4 rounded text-sm text-gray-200">
        <h3 className="text-cyan-400 font-bold mb-2">🔓 Kako se probija Zamjenska šifra?</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><b>Frekvencijska analiza:</b> temelji se na učestalosti slova u jeziku (npr. 'E' je najčešće slovo u hrvatskom).</li>
          <li><b>Usporedba uzoraka:</b> napadač analizira parove, slogove i najčešće kombinacije slova.</li>
          <li><b>Korelacija riječi:</b> koriste se poznati obrasci poput “na”, “je”, “se” za prepoznavanje zamjena.</li>
          <li><b>Statistički alati:</b> današnji softver lako uspoređuje zamjenske poruke s poznatim uzorcima jezika.</li>
        </ul>
        <div className="mt-3 text-cyan-300 italic">
          Iako je sigurnija od Cezarove šifre, zamjenska šifra i dalje je ranjiva na analizu i nije pogodna za modernu sigurnost.
        </div>
      </div>

      <footer className="mt-10 text-sm text-gray-400 text-center">
        Izrađeno za FER – Seminar 2 (2025)
      </footer>
    </div>
  );
}
