"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingButton from "@/components/LoadingButton";
import { formatDifficulty } from "../../../utils/formatters";

type Registration = {
  id: number;
  attendees: number | null;
};

type EventDate = {
  id: number;
  date: string | Date;
  capacity: number;
  registrations: Registration[];
};

type Props = {
  event: {
    id: number;
    name: string;
    image?: string;
    location?: string;
    difficulty?: string;
    duration?: string;
    description?: string;
    eventDates: EventDate[];
  };
};

export default function ClientEventDetail({ event }: Props) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<number | null>(null);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {event.image && (
        <Image
          src={event.image}
          alt={event.name}
          width={600}
          height={400}
          className="mb-4 rounded-md shadow-md max-h-64 w-full object-cover"
        />
      )}

      <h1 className="text-3xl font-bold mb-6">{event.name}</h1>

      {event.location && (
        <p className="text-gray-700 mb-1">
          <strong>Místo konání:</strong> {event.location}
        </p>
      )}

      {event.difficulty && (
        <p className="text-gray-700 mb-1">
          <strong>Obtížnost:</strong> {formatDifficulty(event.difficulty)}
        </p>
      )}

      {event.duration && (
        <p className="text-gray-700 mb-1">
          <strong>Doba trvání:</strong> {event.duration} minut
        </p>
      )}

      {event.description && (
        <div className="mt-4 mb-8">
          <h2 className="text-xl font-semibold mb-2">O akci</h2>
          <p className="text-gray-800 whitespace-pre-line">{event.description}</p>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4">Dostupné termíny</h2>
      <ul className="space-y-4">
        {event.eventDates.map((date) => {
          const totalRegistered = date.registrations.reduce((sum, r) => sum + (r.attendees ?? 1), 0);
          const remaining = date.capacity - totalRegistered;
          const pct = Math.min(100, Math.round((totalRegistered / date.capacity) * 100));

          return (
            <li key={date.id} className="border rounded-lg p-4">
              <div className="mb-2 font-medium">
                {new Date(date.date).toLocaleString("cs-CZ", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </div>
              <div className="w-full bg-gray-200 h-2 rounded mb-2">
                <div className="h-2 rounded bg-green-500" style={{ width: `${pct}%` }} />
              </div>
              <div className="mb-4 text-sm text-gray-700">
                {totalRegistered} / {date.capacity} přihlášeno
              </div>
              {remaining > 0 ? (
                <LoadingButton
                  onClick={() => {
                    setLoadingId(date.id);
                    router.push(`/event/${event.id}/register?dateId=${date.id}`);
                  }}
                  isLoading={loadingId === date.id}
                >
                  Registrovat se
                </LoadingButton>
              ) : (
                <span className="text-red-600 font-semibold">Kapacita vyčerpána</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}