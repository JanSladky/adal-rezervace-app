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

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/admin/events/${eventId}/dates/${dateId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: new Date(form.date).toISOString(),
        capacity: Number(form.capacity),
      }),
    });

    setLoading(false);

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
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {loading && (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
            />
          </svg>
        )}
        {loading ? "Ukládám…" : "Uložit změny"}
      </button>
    </form>
  );
}