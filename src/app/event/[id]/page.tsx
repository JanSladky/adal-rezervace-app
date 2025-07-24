export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const eventId = Number(params.id);
  if (isNaN(eventId)) return notFound();

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      eventDates: {
        include: { registrations: true },
      },
    },
  });
  if (!event) return notFound();

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

      {typeof event.difficulty === "string" && (
        <p className="text-gray-700 mb-1">
          <strong>Obtížnost:</strong> {formatDifficulty(event.difficulty)}
        </p>
      )}

      {"duration" in event && event.duration && (
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
        {event.eventDates.map((date: EventDate) => {
          const totalRegistered = date.registrations.reduce(
            (sum: number, r: Registration) => sum + (r.attendees ?? 1),
            0
          );
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
                <div
                  className="h-2 rounded bg-green-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="mb-4 text-sm text-gray-700">
                {totalRegistered} / {date.capacity} přihlášeno
              </div>
              {remaining > 0 ? (
                <Link
                  href={`/event/${eventId}/register?dateId=${date.id}`}
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Registrovat se
                </Link>
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