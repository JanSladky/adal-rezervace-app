import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export default async function HomePage() {
  const events = await prisma.event.findMany({
    select: {
      id: true,
      name: true,
      image: true,
    },
  });

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Veřejné akce</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event: { id: number; name: string; image: string }) => (
          <Link key={event.id} href={`/event/${event.id}`}>
            <div className="p-4 bg-white shadow rounded hover:bg-gray-50">
              {event.image && (
                <Image
                  src={event.image}
                  alt={event.name}
                  width={400}
                  height={250}
                  className="w-full h-auto rounded mb-2"
                />
              )}
              <h2 className="text-xl font-semibold">{event.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}