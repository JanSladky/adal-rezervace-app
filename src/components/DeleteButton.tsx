"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({ eventId }: { eventId: number }) {
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = () => {
    const confirmed = confirm("Opravdu smazat?");
    if (!confirmed) return;

    setIsDeleting(true);

    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/events/${eventId}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Chyba při mazání");

        router.refresh(); // lepší než location.reload()
      } catch (error) {
        alert("Nepodařilo se smazat.");
        console.error(error);
      } finally {
        setIsDeleting(false);
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending || isDeleting}
      className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-2 disabled:opacity-50"
    >
      {(isPending || isDeleting) && (
        <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
      )}
      Smazat
    </button>
  );
}