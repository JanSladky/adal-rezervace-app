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
    duration: number;
  };
};

export default function EditEventForm({ event }: EditEventFormProps) {
  const [form, setForm] = useState({
    name: event.name,
    location: event.location,
    description: event.description,
    difficulty: event.difficulty,
    duration: event.duration.toString(),
  });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("📦 Vybraný soubor:", file);

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
        console.log("📥 Odpověď z /api/upload:", uploadData);

        if (uploadData.secure_url || uploadData.url) {
          imageUrl = uploadData.secure_url || uploadData.url;
          console.log("🖼️ Upload OK, URL:", imageUrl);
        } else {
          console.warn("⚠️ Upload failed – žádná image URL!", uploadData);
        }
      } catch (err) {
        console.error("❌ Upload error:", err);
      }
    }

    const payload = {
      ...form,
      duration: form.duration,
      image: imageUrl,
    };

    console.log("📤 Odesílám data na PUT /api/events/[id]:", payload);

    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        console.error("❌ Chyba při ukládání:", errData);
        return;
      }

      console.log("✅ Úspěšně uloženo");
      window.location.href = "/admin/events";
    } catch (err) {
      console.error("❌ Fetch error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
      <input
        type="text"
        value={form.duration}
        onChange={(e) => setForm({ ...form, duration: e.target.value })}
        placeholder="Délka trvání (např. 35–45)"
        required
      />
      <select
        value={form.difficulty}
        onChange={(e) =>
          setForm({
            ...form,
            difficulty: e.target.value as EditEventFormProps["event"]["difficulty"],
          })
        }
        required
      >
        <option value="nenarocne">Nenáročné</option>
        <option value="stredne_narocne">Středně náročné</option>
        <option value="narocne">Náročné</option>
      </select>
      <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Uložit změny
      </button>
    </form>
  );
}