// src/components/admin/EditDateButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditDateButton({
  eventId,
  dateId,
}: {
  eventId: number;
  dateId: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    router.push(`/admin/events/${eventId}/dates/${dateId}/edit`);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="bg-blue-500 text-white px-2 py-1 rounded text-sm flex items-center gap-2"
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      )}
      {loading ? "Načítání..." : "Upravit termín"}
    </button>
  );
}