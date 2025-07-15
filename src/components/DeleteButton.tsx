"use client";

export default function DeleteButton({ eventId }: { eventId: number }) {
  const handleDelete = async () => {
    if (confirm("Opravdu smazat?")) {
      await fetch(`/api/admin/events/${eventId}`, { method: "DELETE" });
      location.reload();
    }
  };

  return (
    <button onClick={handleDelete} className="bg-red-500 text-white px-3 py-1 rounded">
      Smazat
    </button>
  );
}