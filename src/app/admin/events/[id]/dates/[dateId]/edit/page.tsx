export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import EditEventDateForm from "@/components/admin/EditEventDateForm";
import RegistrationActions from "@/components/admin/RegistrationActions";

interface PageProps {
  params: {
    id: string;
    dateId: string;
  };
}

export default async function EditEventDatePage({
  params,
}: PageProps): Promise<JSX.Element> {
  const { id, dateId } = params;

  const cookieStore = await cookies();
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

  type RegistrationRecord = typeof raw.registrations[number];

  const totalRegistered = raw.registrations.reduce(
    (sum: number, r: RegistrationRecord) => sum + (r.attendees ?? 1),
    0
  );
  const remaining = raw.capacity - totalRegistered;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upravit termín akce</h1>
      <EditEventDateForm
        eventId={eventId}
        dateId={raw.id}
        initialDate={raw.date.toISOString()}
        initialCapacity={raw.capacity}
      />

      <p className="mt-6">
        Kapacita: {raw.capacity} &nbsp;|&nbsp; Zbývá volných míst: {remaining}
      </p>

      <h2 className="text-xl font-bold mt-8 mb-4">Registrace na tento termín</h2>
      {raw.registrations.length > 0 ? (
        <ul className="space-y-2">
          {raw.registrations.map((r: RegistrationRecord) => (
            <li key={r.id} className="flex justify-between items-center">
              <span>
                {r.name} ({r.email}) – {r.attendees ?? 1} osob{" "}
                {r.paid && <strong>(✅ zaplaceno)</strong>}
              </span>
              <RegistrationActions
                registration={{
                  id: r.id,
                  name: r.name,
                  email: r.email,
                  attendees: r.attendees ?? 1,
                  paid: r.paid,
                }}
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