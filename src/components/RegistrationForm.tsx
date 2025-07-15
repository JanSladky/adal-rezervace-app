"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegistrationForm({
  eventId,
  dates,
}: {
  eventId: number;
  dates: { id: number; date: string }[];
}) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    attendees: 1,
    eventDateId: dates[0]?.id || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, eventId }),
    });

    if (res.ok) {
      router.push(`/event/${eventId}`);
    } else {
      alert("Chyba při registraci.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
      <input
        type="text"
        placeholder="Vaše jméno"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Váš e-mail"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <input
        type="number"
        min={1}
        value={form.attendees}
        onChange={(e) =>
          setForm({ ...form, attendees: parseInt(e.target.value) })
        }
        required
      />
      <select
        value={form.eventDateId}
        onChange={(e) =>
          setForm({ ...form, eventDateId: Number(e.target.value) })
        }
      >
        {dates.map((date) => (
          <option key={date.id} value={date.id}>
            {new Date(date.date).toLocaleString("cs-CZ", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Odeslat registraci
      </button>
    </form>
  );
}