"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface RegistrationFormProps {
  eventId: number;
  selectedDateId: number;
  selectedDateISO: string;
  capacity: number;
  alreadyRegistered: number;
}

export default function RegistrationForm({
  eventId,
  selectedDateId,
  selectedDateISO,
  capacity,
  alreadyRegistered,
}: RegistrationFormProps) {
  const router = useRouter();
  const remaining = capacity - alreadyRegistered;

  const [form, setForm] = useState({
    name: "",
    email: "",
    attendees: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId,
        eventDateId: selectedDateId,
        name: form.name,
        email: form.email,
        attendees: form.attendees,
      }),
    });
    if (res.ok) {
      router.push(`/event/${eventId}`);
    } else {
      alert("Chyba při registraci.");
    }
  };

  if (remaining <= 0) {
    return (
      <p className="text-red-600 font-semibold">
        Kapacita tohoto termínu je již vyčerpána, nelze se registrovat.
      </p>
    );
  }

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
        max={remaining}
        value={form.attendees}
        onChange={(e) =>
          setForm({ ...form, attendees: parseInt(e.target.value) })
        }
        required
      />
      <select value={selectedDateId} disabled className="bg-gray-100">
        <option value={selectedDateId}>
          {new Date(selectedDateISO).toLocaleString("cs-CZ", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </option>
      </select>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Registrovat ({remaining} volných míst)
      </button>
    </form>
  );
}