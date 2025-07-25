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

      <button type="submit" className="bg-blue-500 text-white p-2 rounded flex items-center justify-center gap-2 disabled:opacity-60" disabled={loading}>
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
