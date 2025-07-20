// src/app/admin/events/[id]/dates/[dateId]/edit/page.tsx
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import EditEventDateForm from "@/components/admin/EditEventDateForm";
import RegistrationActions from "@/components/admin/RegistrationActions";

type Props = {
  params: {
    id: string;
    dateId: string;
  };
};

// lokální typ pro zjednodušené zpracování registrací
type RegistrationRecord = {
  id: number;
  name: string;
  email: string;
  attendees: number | null;
  paid: boolean;
};

export default async function Page({ params }: Props) {
  // 1) Ověření, že je admin
  const cookieStore = await cookies();
  if (cookieStore.get("admin-auth")?.value !== "true") {
    redirect("/login");
  }

  // 2) Parsování a validace parametrů
  const eventId = Number(params.id);
  const dateId  = Number(params.dateId);
  if (isNaN(eventId) || isNaN(dateId)) {
    return notFound();
  }

  // 3) Načtení termínu včetně registrací
  const raw = await prisma.eventDate.findUnique({
    where: { id: dateId },
    include: { registrations: true },
  });
  if (!raw || raw.eventId !== eventId) {
    return notFound();
  }

  // 4) Převod na náš lokální tvar
  const dateItem = {
    id:            raw.id,
    date:          raw.date,
    capacity:      raw.capacity,
    registrations: raw.registrations as RegistrationRecord[],
  };

  // 5) Spočítáme obsazenost
  const totalRegistered = dateItem.registrations.reduce(
    (sum: number, r: RegistrationRecord) => sum + (r.attendees ?? 1),
    0
  );
  const remaining = dateItem.capacity - totalRegistered;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upravit termín akce</h1>

      {/* Formulář pro úpravu data a kapacity */}
      <EditEventDateForm
        eventId={eventId}
        dateId={dateItem.id}
        initialDate={dateItem.date.toISOString()}
        initialCapacity={dateItem.capacity}
      />

      <p className="mt-6">
        Kapacita: {dateItem.capacity} &nbsp;|&nbsp; Zbývá volných míst: {remaining}
      </p>

      <h2 className="text-xl font-bold mt-8 mb-4">Registrace na tento termín</h2>
      {dateItem.registrations.length > 0 ? (
        <ul className="space-y-2">
          {dateItem.registrations.map((r: RegistrationRecord) => (
            <li
              key={r.id}
              className="flex justify-between items-center"
            >
              <span>
                {r.name} ({r.email}) – {r.attendees ?? 1} osob{" "}
                {r.paid && <strong>(✅ zaplaceno)</strong>}
              </span>
              <RegistrationActions
                registration={{
                  id:        r.id,
                  name:      r.name,
                  email:     r.email,
                  attendees: r.attendees ?? 1,
                  paid:      r.paid,
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