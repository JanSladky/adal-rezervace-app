import React from "react";

interface VerifyPageProps {
  params: {
    id: string;
  };
}

async function getData(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/verify/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function VerifyPage({ params }: VerifyPageProps) {
  const data = await getData(params.id);

  if (!data) {
    return <div className="p-8 text-center text-red-500">Registrace nebyla nalezena.</div>;
  }

  return (
    <div className="p-8 max-w-xl mx-auto bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">🎫 Vstupenka</h1>
      <p><strong>👤 Účastník:</strong> {data.userName}</p>
      <p><strong>📅 Akce:</strong> {data.eventName}</p>
      <p><strong>📍 Místo:</strong> {data.eventLocation}</p>
      <p><strong>🗓️ Termín:</strong> {new Date(data.eventDate).toLocaleString("cs-CZ")}</p>
      <p><strong>💰 Stav platby:</strong> {data.isPaid ? "✅ Zaplaceno" : "❌ Nezaplaceno"}</p>
    </div>
  );
}