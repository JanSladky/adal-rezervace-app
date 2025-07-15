import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditEventForm from "../../../../../components/EditEventForm";
import { Prisma } from "@prisma/client";

type Props = {
  params: { id: string };
};

type EventEditType = Prisma.EventGetPayload<{
  select: {
    id: true;
    name: true;
    date: true;
    capacity: true;
    image: true;
    location: true;
    description: true;
    difficulty: true;
  };
}>;

export default async function EditEventPage({ params }: Props) {
  const event: EventEditType | null = await prisma.event.findUnique({
    where: { id: Number(params.id) },
    select: {
      id: true,
      name: true,
      date: true,
      capacity: true,
      image: true,
      location: true,
      description: true,
      difficulty: true,
    },
  });

  if (!event) return notFound();

  const formattedEvent = {
    ...event,
    date: event.date.toISOString().slice(0, 16),
  } as const;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upravit akci</h1>
      <EditEventForm event={formattedEvent} />
    </div>
  );
}