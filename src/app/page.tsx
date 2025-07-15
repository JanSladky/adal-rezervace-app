import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const events: {
    id: number;
    name: string;
    date: Date;
    capacity: number;
  }[] = await prisma.event.findMany();

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Veřejné akce</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map(({ id, name, date, capacity }) => (
          <Link key={id} href={`/event/${id}`}>
            <div className="p-4 bg-white shadow rounded hover:bg-gray-50">
              <h2 className="text-xl font-semibold">{name}</h2>
              <p>{new Date(date).toLocaleDateString("cs-CZ")}</p>
              <p>Kapacita: {capacity} osob</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
