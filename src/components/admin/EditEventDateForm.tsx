"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  eventId: number;
  dateId: number;
  initialDate: string;
  initialCapacity: number;
};

// Pomocná funkce pro správný formát inputu
function toDatetimeLocal(iso: string) {
  const date = new Date(iso);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
}

export default function EditEventDateForm({ eventId, dateId, initialDate, initialCapacity }: Props) {
  const router = useRouter();

  const [form, setForm] = useState({
    date: toDatetimeLocal(initialDate),
    capacity: initialCapacity,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/admin/events/${eventId}/dates/${dateId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: new Date(form.date).toISOString(),
        capacity: Number(form.capacity),
      }),
    });

    if (res.ok) {
      router.push(`/admin/events/${eventId}/edit`);
    } else {
      alert("Chyba při ukládání.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="datetime-local"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        required
      />
      <input
        type="number"
        value={form.capacity}
        onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
        required
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Uložit změny
      </button>
    </form>
  );
}