import { prisma } from "@/lib/prisma";
import Link from "next/link";

type Event = {
  id: number;
  name: string;
  date: string;
  capacity: number;
};

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany();

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Seznam akcí (admin)</h1>
      {events.length === 0 ? (
        <p>Žádné akce zatím neexistují.</p>
      ) : (
        <ul>
          {events.map((event: Event) => (
            <li key={event.id} className="mb-2">
              <Link href={`/event/${event.id}`} className="underline">
                {event.name}
              </Link>
              <Link href="/admin/events/new" className="inline-block mb-4 bg-green-600 text-white px-4 py-2 rounded">
                Přidat novou akci
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
