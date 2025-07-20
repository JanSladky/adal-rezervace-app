"use client";

import { useRouter } from "next/navigation";

export type RegistrationWithPaid = {
  id: number;
  name: string;
  email: string;
  attendees: number;
  paid: boolean;
};

export default function RegistrationActions({
  registration,
  eventId,
}: {
  registration: RegistrationWithPaid;
  eventId: number;
}) {
  const router = useRouter();

  const markPaid = async () => {
    const res = await fetch(`/api/registrations/${registration.id}`, {
      method: "PATCH",
    });
    if (res.ok) router.refresh();
    else alert("Chyba při označování platby.");
  };

  const remove = async () => {
    if (!confirm("Opravdu smazat tuto registraci?")) return;
    const res = await fetch(`/api/registrations/${registration.id}`, {
      method: "DELETE",
    });
    if (res.ok) router.refresh();
    else alert("Chyba při mazání registrace.");
  };

  return (
    <div className="flex items-center gap-2">
      {registration.paid ? (
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
          Zaplaceno
        </span>
      ) : (
        <button
          className="bg-green-500 text-white px-2 py-1 rounded text-sm"
          onClick={markPaid}
        >
          Označit zaplaceno
        </button>
      )}

      <button
        className="bg-red-500 text-white px-2 py-1 rounded text-sm"
        onClick={remove}
      >
        Smazat registraci
      </button>
    </div>
  );
}