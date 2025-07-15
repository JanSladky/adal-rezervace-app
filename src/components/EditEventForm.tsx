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
  };
};

export default function EditEventForm({ event }: EditEventFormProps) {
  const [form, setForm] = useState({
    name: event.name,
    location: event.location,
    description: event.description,
    difficulty: event.difficulty,
  });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let imageUrl = event.image;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (uploadData.secure_url) {
        imageUrl = uploadData.secure_url;
      }
    }

    await fetch(`/api/events/${event.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, image: imageUrl }),
    });

    window.location.href = "/admin/events";
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <input
        type="text"
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
        required
      />
      <select
        value={form.difficulty}
        onChange={(e) =>
          setForm({ ...form, difficulty: e.target.value as EditEventFormProps["event"]["difficulty"] })
        }
        required
      >
        <option value="nenarocne">Nenáročné</option>
        <option value="stredne_narocne">Středně náročné</option>
        <option value="narocne">Náročné</option>
      </select>
      <textarea
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        required
      />
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Uložit změny
      </button>
    </form>
  );
}