"use client";

import { useState } from "react";

export default function AddEventDateForm({ eventId }: { eventId: number }) {
  const [date, setDate] = useState("");
  const [capacity, setCapacity] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/admin/events/${eventId}/dates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, capacity }),
    });

    if (res.ok) {
      alert("Termín byl přidán.");
      location.reload();
    } else {
      alert("Chyba při přidávání termínu.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <input
        type="number"
        value={capacity}
        onChange={(e) => setCapacity(parseInt(e.target.value))}
        required
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Přidat termín
      </button>
    </form>
  );
}