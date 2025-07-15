import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

export default async function EventDetailPage({ params }: Props) {
  const event = await prisma.event.findUnique({
    where: { id: Number(params.id) },
  });

  if (!event) return notFound();

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">{event.name}</h1>
      <p>Datum: {new Date(event.date).toLocaleDateString("cs-CZ")}</p>
      <p>Kapacita: {event.capacity} osob</p>
    </main>
  );
}