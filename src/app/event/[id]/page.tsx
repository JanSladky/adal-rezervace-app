import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

type EventDetail = Prisma.EventGetPayload<{
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

export default async function EventDetailPage({ params }: Props) {
  const event: EventDetail | null = await prisma.event.findUnique({
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

  const difficultyMap = {
    nenarocne: "Nenáročné",
    stredne_narocne: "Středně náročné",
    narocne: "Náročné",
  } as const;

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{event.name}</h1>

      {event.image && event.image.trim() !== "" && (
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-auto rounded mb-4"
        />
      )}

      <p className="mb-2">
        Datum: {new Date(event.date).toLocaleString("cs-CZ")}
      </p>
      <p className="mb-2">Kapacita: {event.capacity} osob</p>
      <p className="mb-2">Místo konání: {event.location}</p>
      <p className="mb-2">
        Náročnost: {difficultyMap[event.difficulty]}
      </p>
      <p className="mb-4 whitespace-pre-line">{event.description}</p>
    </main>
  );
}