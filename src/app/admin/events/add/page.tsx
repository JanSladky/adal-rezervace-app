"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddEventPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    location: "",
    difficulty: "nenarocne",
    description: "",
    amountCZK: "",
    variableSymbol: "",
    accountNumber: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Vyberte obrázek.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadRes.json();

    if (!uploadData.url) {
      alert("Chyba při nahrávání obrázku");
      return;
    }

    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        location: form.location,
        difficulty: form.difficulty,
        description: form.description,
        amountCZK: Number(form.amountCZK),
        variableSymbol: form.variableSymbol,
        accountNumber: form.accountNumber,
        image: uploadData.url,
      }),
    });

    if (res.ok) {
      router.push("/admin/events");
    } else {
      alert("Chyba při ukládání akce");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xl mx-auto p-4">
      <input type="text" placeholder="Název akce" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <input type="text" placeholder="Místo konání" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
      <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} required>
        <option value="nenarocne">Nenáročné</option>
        <option value="stredne_narocne">Středně náročné</option>
        <option value="narocne">Náročné</option>
      </select>
      <textarea placeholder="Popis" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />

      <input
        type="number"
        placeholder="Cena za osobu (CZK)"
        value={form.amountCZK}
        onChange={(e) => setForm({ ...form, amountCZK: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Variabilní symbol"
        value={form.variableSymbol}
        onChange={(e) => setForm({ ...form, variableSymbol: e.target.value })}
        required
      />
      <input type="text" placeholder="Číslo účtu" value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} required />
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} required />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Přidat akci
      </button>
    </form>
  );
}
