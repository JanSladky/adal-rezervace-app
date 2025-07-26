import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export const revalidate = 0;

export default async function HomePage() {
  const events = await prisma.event.findMany({
    select: {
      id: true,
      name: true,
      image: true,
    },
  });

  return (
    <main className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Rezervační systém na akce pořádané spolkem A dál?</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event: { id: number; name: string; image: string }) => (
          <Link key={event.id} href={`/event/${event.id}`} className="group">
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 hover:scale-[1.02] transform">
              {event.image && (
                <Image
                  src={event.image}
                  alt={event.name}
                  width={600}
                  height={400}
                  className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity duration-300"
                />
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{event.name}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
