"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import DeleteButton from "../../../components/DeleteButton";

type EventWithDates = {
  id: number;
  name: string;
  eventDates: { id: number; date: string }[];
};

export default function AdminEventsPageClient({ events }: { events: EventWithDates[] }) {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Seznam akcí (admin)</h1>

      {/* ZMĚNA ZDE: Původní <Link> je nahrazen za <button> s logikou pro spinner */}
      <button
        onClick={() => {
          // Nastavíme speciální ID (0), abychom odlišili toto tlačítko od ostatních
          setLoadingId(0); 
          startTransition(() => {
            router.push("/admin/events/add");
          });
        }}
        disabled={isPending}
        className="inline-flex items-center justify-center mb-4 bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50 gap-2"
      >
        {/* Zobrazíme spinner, jen když probíhá navigace z tohoto tlačítka */}
        {isPending && loadingId === 0 && (
          <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
        )}
        Přidat novou akci
      </button>

      <ul className="flex flex-col gap-4">
        {events.map((event) => (
          <li key={event.id} className="border p-4 rounded">
            <h2 className="font-bold">{event.name}</h2>

            {event.eventDates.length > 0 ? (
              <ul>
                {event.eventDates.map((date) => (
                  <li key={date.id}>
                    {new Date(date.date).toLocaleString("cs-CZ")}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Žádné termíny</p>
            )}

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => {
                  setLoadingId(event.id);
                  startTransition(() => {
                    router.push(`/admin/events/${event.id}/edit`);
                  });
                }}
                disabled={isPending} // Deaktivujeme, pokud jakákoliv navigace probíhá
                className="bg-blue-500 text-white px-3 py-1 rounded flex items-center gap-2 disabled:opacity-50"
              >
                {isPending && loadingId === event.id ? (
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                ) : null}
                Upravit
              </button>

              <DeleteButton eventId={event.id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}