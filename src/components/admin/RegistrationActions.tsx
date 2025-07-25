"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type RegistrationWithPaid = {
  id: number;
  name: string;
  email: string;
  attendees: number;
  paid: boolean;
};

export default function RegistrationActions({
  registration,
}: {
  registration: RegistrationWithPaid;
}) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState<null | "mark" | "delete">(null);

  const markPaid = async () => {
    setLoadingAction("mark");
    const res = await fetch(`/api/registrations/${registration.id}`, {
      method: "PATCH",
    });
    if (res.ok) {
      router.refresh();
    } else {
      alert("Chyba při označování platby.");
      setLoadingAction(null);
    }
  };

  const remove = async () => {
    if (!confirm("Opravdu smazat tuto registraci?")) return;
    setLoadingAction("delete");
    const res = await fetch(`/api/registrations/${registration.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.refresh();
    } else {
      alert("Chyba při mazání registrace.");
      setLoadingAction(null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {registration.paid ? (
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
          Zaplaceno
        </span>
      ) : (
        <button
          className="bg-green-500 text-white px-2 py-1 rounded text-sm flex items-center gap-2 disabled:opacity-50"
          onClick={markPaid}
          disabled={loadingAction !== null}
        >
          {loadingAction === "mark" ? (
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
          ) : (
            "Označit zaplaceno"
          )}
        </button>
      )}

      <button
        className="bg-red-500 text-white px-2 py-1 rounded text-sm flex items-center gap-2 disabled:opacity-50"
        onClick={remove}
        disabled={loadingAction !== null}
      >
        {loadingAction === "delete" ? (
          <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
        ) : (
          "Smazat registraci"
        )}
      </button>
    </div>
  );
}