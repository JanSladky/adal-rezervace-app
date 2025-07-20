"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type RegistrationFormProps = {
  eventId: number;
  selectedDateId: number;
  selectedDateISO: string;
};

export default function RegistrationForm({
  eventId,
  selectedDateId,
  selectedDateISO,
}: RegistrationFormProps) {
  const router = useRouter();

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
        ...form,
        eventId,
        eventDateId: selectedDateId,
      }),
    });

    if (res.ok) {
      router.push(`/event/${eventId}`);
    } else {
      alert("Chyba při registraci.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
      <p>
        Termín:{" "}
        {new Date(selectedDateISO).toLocaleString("cs-CZ", {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </p>

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
        placeholder="Počet osob"
        value={form.attendees}
        onChange={(e) =>
          setForm({ ...form, attendees: Number(e.target.value) })
        }
        required
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Odeslat registraci
      </button>
    </form>
  );
}