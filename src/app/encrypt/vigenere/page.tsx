"use client";
import { useEffect, useState, useCallback } from "react";

export default function VigenereCipherPage() {
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [animateResult, setAnimateResult] = useState("");

  const cleanInput = (input: string) =>
    input.replace(/[^a-zA-Z]/g, "").toUpperCase();

  const vigenere = useCallback(
    (input: string, keyword: string, decrypt = false) => {
      const cleanedKey = cleanInput(keyword);
      if (!cleanedKey) return "Greška: ključ ne smije biti prazan.";

      let output = "";
      let keyIndex = 0;

      for (let i = 0; i < input.length; i++) {
        const char = input[i];
        const isUpper = char >= "A" && char <= "Z";
        const isLower = char >= "a" && char <= "z";

        if (!isUpper && !isLower) {
          output += char;
          continue;
        }

        const base = isUpper ? 65 : 97;
        const keyChar = cleanedKey[keyIndex % cleanedKey.length];
        const keyShift = keyChar.charCodeAt(0) - 65;
        const shift = decrypt ? 26 - keyShift : keyShift;

        const newChar = String.fromCharCode(
          ((char.charCodeAt(0) - base + shift) % 26) + base
        );
        output += newChar;
        keyIndex++;
      }

      return output;
    },
    []
  );

  const generateExample = () => {
    const examples = [
      { text: "tajna poruka", key: "kriptografija" },
      { text: "vigenere sifra", key: "kodiranje" },
      { text: "fer seminar", key: "enkripcija" },
    ];
    const random = examples[Math.floor(Math.random() * examples.length)];
    setText(random.text);
    setKey(random.key);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const visualKeyMapping = () => {
    const cleanedKey = cleanInput(key);
    if (!cleanedKey) return [];
    const map: string[] = [];
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (/[a-zA-Z]/.test(char)) {
        map.push(`${char} → ${cleanedKey[keyIndex % cleanedKey.length]}`);
        keyIndex++;
      } else {
        map.push(`${char} → (preskočeno)`);
      }
    }
    return map;
  };

  useEffect(() => {
    if (!key.trim()) {
      setResult("");
      setError("Ključ ne smije biti prazan.");
      return;
    }
    if (/[^a-zA-Z]/.test(key)) {
      setResult("");
      setError("Ključ smije sadržavati samo slova (bez razmaka i brojeva).");
      return;
    }

    setError("");
    const output = vigenere(text, key, mode === "decrypt");
    setResult(output);
    setHistory((prev) => [output, ...prev.slice(0, 4)]);

    let index = 0;
    setAnimateResult("");
    const interval = setInterval(() => {
      setAnimateResult((prev) => prev + output[index]);
      index++;
      if (index >= output.length) clearInterval(interval);
    }, 30);
  }, [text, key, mode, vigenere]);

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center gap-6 font-mono">
      <h1 className="text-3xl font-bold text-cyan-400 drop-shadow">
        Vigenèreova šifra
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

        <button
          onClick={generateExample}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-1 rounded text-sm"
        >
          Generiraj primjer
        </button>
      </div>

      {error && <div className="text-red-400 text-sm">{error}</div>}

      {result && (
        <div className="mt-6 w-full max-w-md bg-gray-900 p-4 rounded text-cyan-300 whitespace-pre-wrap relative">
          <h2 className="mb-2 font-bold">Rezultat:</h2>
          <button
            onClick={handleCopy}
            className="absolute top-2 right-3 text-xs text-cyan-500 hover:underline"
          >
            {copied ? "Kopirano!" : "Kopiraj"}
          </button>
          {animateResult}
        </div>
      )}

      {key && text && (
        <div className="bg-gray-800 p-4 mt-4 max-w-md w-full rounded text-sm text-cyan-200">
          <h3 className="font-bold text-cyan-300 mb-2">
            Vizualizacija ključa po znakovima:
          </h3>
          {visualKeyMapping().map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
        </div>
      )}

      {history.length > 0 && (
        <div className="bg-gray-900 mt-6 p-4 rounded max-w-md w-full text-sm text-gray-400">
          <h3 className="font-bold text-cyan-400 mb-2">🕓 Povijest rezultata:</h3>
          {history.map((h, i) => (
            <div key={i}>#{i + 1}: {h}</div>
          ))}
        </div>
      )}

      <div className="bg-gray-800 mt-10 p-4 rounded max-w-md text-sm text-gray-300">
        <h3 className="font-bold text-cyan-400 mb-1">📖 Zanimljivost:</h3>
        Iako ju je dizajnirao Blaise de Vigenère u 16. stoljeću, šifra je postala
        poznata kao &ldquo;neslomiva&rdquo; sve do 19. stoljeća, kada je napokon provaljena.
        U američkom Građanskom ratu koristila se kao vojna komunikacija, a zanimljivo je da
        je nazivana &ldquo;le chiffre indéchiffrable&rdquo; — neprobojna šifra.
      </div>
    </div>
  );
}
