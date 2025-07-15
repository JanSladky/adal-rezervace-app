import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminEventsPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin-auth")?.value === "true";

  if (!isAdmin) {
    redirect("/login");
  }

  const events = await prisma.event.findMany();

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Seznam akcí (admin)</h1>

      <Link
        href="/admin/events/new"
        className="inline-block mb-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Přidat novou akci
      </Link>

      {events.length === 0 ? (
        <p>Žádné akce zatím neexistují.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.id} className="mb-2">
              <Link href={`/event/${event.id}`} className="underline">
                {event.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}