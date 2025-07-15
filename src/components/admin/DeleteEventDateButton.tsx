"use client";

export default function DeleteEventDateButton({
  eventId,
  dateId,
}: {
  eventId: number;
  dateId: number;
}) {
  const handleDelete = async () => {
    if (confirm("Opravdu smazat tento termín?")) {
      const res = await fetch(`/api/admin/events/${eventId}/dates/${dateId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        location.reload();
      } else {
        alert("Chyba při mazání.");
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 text-white px-2 py-1 rounded text-sm"
    >
      Smazat
    </button>
  );
}