export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import RegistrationForm from "@/components/RegistrationForm";

type PageProps = {
  params: { id: string };
  searchParams: { dateId?: string };
};

type Registration = {
  attendees: number | null;
};

type EventDate = {
  id: number;
  date: Date;
  capacity: number;
  registrations: Registration[];
};

export default async function RegisterPage({ params, searchParams }: PageProps) {
  const eventId = parseInt(params.id);
  const dateId = parseInt(searchParams.dateId ?? "");

  if (isNaN(eventId) || isNaN(dateId)) {
    return notFound();
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      eventDates: {
        include: { registrations: true },
      },
    },
  });

  if (!event) return notFound();

  const date = event.eventDates.find((d: EventDate) => d.id === dateId);
  if (!date) return notFound();

  const alreadyRegistered = date.registrations.reduce(
    (sum: number, r: Registration) => sum + (r.attendees ?? 1),
    0
  );

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Registrace na akci</h1>
      <p className="mb-2">{event.name}</p>

      <RegistrationForm
        eventId={eventId}
        selectedDateId={dateId}
        selectedDateISO={date.date.toISOString()}
        capacity={date.capacity}
        alreadyRegistered={alreadyRegistered}
      />
    </div>
  );
}