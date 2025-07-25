export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ClientEventDetail from "./ClientEventDetail"; // nová komponenta níže

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

  return <ClientEventDetail event={event} />;
}