// vynutíme vždy server–side vykreslení (params musí fungovat)
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import RegistrationForm from "@/components/RegistrationForm";

type Props = {
  params: { id: string };
  searchParams?: { dateId?: string };
};

export default async function RegisterPage({ params, searchParams }: Props) {
  const eventId = Number(params.id);
  const dateId = Number(searchParams?.dateId);
  if (isNaN(eventId) || isNaN(dateId)) {
    notFound();
  }

  // Načti akci i všechny termíny s existujícími registracemi
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      eventDates: {
        include: { registrations: true },
      },
    },
  });
  if (!event) notFound();

  // Najdi správný termín (d má typově odpovídat položkám z event.eventDates)
  const date = event.eventDates.find(
    (d: (typeof event.eventDates)[number]) => d.id === dateId
  );
  if (!date) notFound();

  // Spočítáme, kolik už je registrovaných lidí
  const already = date.registrations.reduce(
    (sum: number, r: (typeof date.registrations)[number]) =>
      sum + (r.attendees ?? 1),
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
        alreadyRegistered={already}
      />
    </div>
  );
}