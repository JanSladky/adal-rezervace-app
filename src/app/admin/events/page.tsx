import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DeleteButton from "../../../components/DeleteButton";

export default async function AdminEventsPage() {
  const cookieStore = await cookies(); // DŮLEŽITÉ: await před cookies()
  const isAdmin = cookieStore.get("admin-auth")?.value === "true";

  if (!isAdmin) {
    redirect("/login");
  }

  const events = await prisma.event.findMany({
    select: { id: true, name: true, date: true },
  });

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Seznam akcí (admin)</h1>

      <Link href="/admin/events/add" className="inline-block mb-4 bg-green-600 text-white px-4 py-2 rounded">
        Přidat novou akci
      </Link>

      <ul className="flex flex-col gap-4">
        {events.map((event) => (
          <li key={event.id} className="border p-4 rounded">
            <h2 className="font-bold">{event.name}</h2>
            <p>{new Date(event.date).toLocaleString("cs-CZ")}</p>
            <div className="flex gap-2 mt-2">
              <Link href={`/admin/events/${event.id}/edit`} className="bg-blue-500 text-white px-3 py-1 rounded">
                Upravit
              </Link>
              <DeleteButton eventId={event.id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}