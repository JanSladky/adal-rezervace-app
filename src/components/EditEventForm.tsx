"use client";

import { useState } from "react";

type EditEventFormProps = {
  event: {
    id: number;
    name: string;
    location: string;
    description: string;
    difficulty: "nenarocne" | "stredne_narocne" | "narocne";
    image: string;
    duration: string;
    variableSymbol: string;
    accountNumber: string;
  };
};

export default function EditEventForm({ event }: EditEventFormProps) {
  const [form, setForm] = useState({
    name: event.name,
    location: event.location,
    description: event.description,
    difficulty: event.difficulty,
    duration: event.duration.toString(),
    variableSymbol: event.variableSymbol,
    accountNumber: event.accountNumber,
  });

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false); // ✅ stav pro spinner

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // ✅ aktivujeme spinner

    let imageUrl = event.image;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();

        if (uploadData.secure_url || uploadData.url) {
          imageUrl = uploadData.secure_url || uploadData.url;
        } else {
          console.warn("⚠️ Upload failed – žádná image URL!", uploadData);
        }
      } catch (err) {
        console.error("❌ Upload error:", err);
        setLoading(false);
        return;
      }
    }

    const payload = {
      ...form,
      duration: form.duration,
      image: imageUrl,
    };

    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error("❌ Chyba při ukládání:", errData);
        setLoading(false);
        return;
      }

      console.log("✅ Úspěšně uloženo");
      window.location.href = "/admin/events";
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setLoading(false);
    }
  };
  const inputClasses =
    "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Název akce
        </label>
        <input id="name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={inputClasses} />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Místo konání
        </label>
        <input
          id="location"
          type="text"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          required
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
          Doba trvání
        </label>
        <input
          id="duration"
          type="text"
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
          placeholder="např. 3-4 hodiny"
          required
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
          Obtížnost
        </label>
        <select
          id="difficulty"
          value={form.difficulty}
          onChange={(e) => setForm({ ...form, difficulty: e.target.value as EditEventFormProps["event"]["difficulty"] })}
          required
          className={inputClasses}
        >
          <option value="nenarocne">Nenáročné</option>
          <option value="stredne_narocne">Středně náročné</option>
          <option value="narocne">Náročné</option>
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Popis
        </label>
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
          rows={4}
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="variableSymbol" className="block text-sm font-medium text-gray-700">
          Variabilní symbol
        </label>
        <input
          id="variableSymbol"
          type="text"
          value={form.variableSymbol}
          onChange={(e) => setForm({ ...form, variableSymbol: e.target.value })}
          required
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
          Číslo účtu
        </label>
        <input
          id="accountNumber"
          type="text"
          value={form.accountNumber}
          onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
          required
          className={inputClasses}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Obrázek akce</label>
        <div className="mt-1 flex items-center gap-4">
          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Vybrat soubor
          </label>
          <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          <span className="text-sm text-gray-500">{file?.name || "Nový soubor nevybrán"}</span>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center gap-2 disabled:opacity-60 transition-colors"
        disabled={loading}
      >
        {loading && (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z" />
          </svg>
        )}
        {loading ? "Ukládám…" : "Uložit změny"}
      </button>
    </form>
  );
}
