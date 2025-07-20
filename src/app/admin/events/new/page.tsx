"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewEventPage() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    router.push("/admin/events");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Přidat novou akci</h1>

      <input type="text" placeholder="Název" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 w-full mb-2" required />

      <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="border p-2 w-full mb-2" required />

      <button className="bg-blue-600 text-white px-4 py-2 rounded">Uložit</button>
    </form>
  );
}
