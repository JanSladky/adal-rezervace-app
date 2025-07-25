"use client";

import { useState } from "react";

export default function DeleteEventDateButton({
  eventId,
  dateId,
}: {
  eventId: number;
  dateId: number;
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Opravdu smazat tento termín?")) return;

    setLoading(true);

    const res = await fetch(`/api/admin/events/${eventId}/dates/${dateId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      location.reload();
    } else {
      alert("Chyba při mazání.");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 text-white px-2 py-1 rounded text-sm disabled:opacity-50 flex items-center gap-2"
      disabled={loading}
    >
      {loading ? (
        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
      ) : (
        "Smazat"
      )}
    </button>
  );
}