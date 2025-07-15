import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type Props = {
  params: { id: string };
};

export default async function EventDetailPage({ params }: Props) {
  const id = Number(params.id);

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      eventDates: {
        include: { registrations: true },
      },
    },
  });

  if (!event) return notFound();

  const difficultyMap: Record<"nenarocne" | "stredne_narocne" | "narocne", string> = {
    nenarocne: "Nenáročné",
    stredne_narocne: "Středně náročné",
    narocne: "Náročné",
  };

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{event.name}</h1>

      {event.image?.trim() !== "" && <Image src={event.image} alt={event.name} width={800} height={500} className="w-full h-auto rounded mb-4" />}

      <p className="mb-2">Místo konání: {event.location}</p>
      <p className="mb-2">Náročnost: {difficultyMap[event.difficulty as keyof typeof difficultyMap]}</p>
      <p className="mb-4 whitespace-pre-line">{event.description}</p>

      <h2 className="text-xl font-bold mb-2">Dostupné termíny</h2>

      {event.eventDates.length === 0 ? (
        <p>Žádné termíny zatím nejsou vypsané.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {event.eventDates.map((date: typeof event.eventDates[number]) => {
            const occupied = date.registrations.length;
            const occupancy = (occupied / date.capacity) * 100;

            return (
              <li key={date.id} className="border p-4 rounded">
                <p>{new Date(date.date).toLocaleString("cs-CZ")}</p>
                <div className="h-4 bg-gray-200 rounded overflow-hidden my-2">
                  <div className="h-4 bg-green-500" style={{ width: `${Math.min(occupancy, 100)}%` }} />
                </div>
                <p className="text-sm mb-2">
                  {occupied} / {date.capacity} přihlášeno
                </p>
                <Link href={`/event/${event.id}/register?dateId=${date.id}`} className="bg-blue-500 text-white px-4 py-2 rounded inline-block">
                  Registrovat se
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
