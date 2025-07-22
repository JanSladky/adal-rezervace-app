export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import EditEventDateForm from "@/components/admin/EditEventDateForm";
import RegistrationActions from "@/components/admin/RegistrationActions";

type RegistrationRecord = {
  id: number;
  name: string;
  email: string;
  attendees: number | null;
  paid: boolean;
};

export default async function Page({ params }: { params: { id: string; dateId: string } }) {
  const { id, dateId } = params;

  const cookieStore = cookies() as any;
  if (cookieStore.get("admin-auth")?.value !== "true") {
    redirect("/login");
  }

  const eventId = Number(id);
  const dId = Number(dateId);
  if (isNaN(eventId) || isNaN(dId)) return notFound();

  const raw = await prisma.eventDate.findUnique({
    where: { id: dId },
    include: { registrations: true },
  });
  if (!raw || raw.eventId !== eventId) return notFound();

  const dateItem = {
    id: raw.id,
    date: raw.date,
    capacity: raw.capacity,
    registrations: raw.registrations as RegistrationRecord[],
  };

  const totalRegistered = dateItem.registrations.reduce((sum, r) => sum + (r.attendees ?? 1), 0);
  const remaining = dateItem.capacity - totalRegistered;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upravit termín akce</h1>

      <EditEventDateForm eventId={eventId} dateId={dateItem.id} initialDate={dateItem.date.toISOString()} initialCapacity={dateItem.capacity} />

      <p className="mt-6">
        Kapacita: {dateItem.capacity} &nbsp;|&nbsp; Zbývá volných míst: {remaining}
      </p>

      <h2 className="text-xl font-bold mt-8 mb-4">Registrace na tento termín</h2>
      {dateItem.registrations.length > 0 ? (
        <ul className="space-y-2">
          {dateItem.registrations.map((r) => (
            <li key={r.id} className="flex justify-between items-center">
              <span>
                {r.name} ({r.email}) – {r.attendees ?? 1} osob {r.paid && <strong>(✅ zaplaceno)</strong>}
              </span>
              <RegistrationActions
                registration={{
                  id: r.id,
                  name: r.name,
                  email: r.email,
                  attendees: r.attendees ?? 1,
                  paid: r.paid,
                }}
                eventId={eventId}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">Žádné registrace</p>
      )}
    </div>
  );
}
