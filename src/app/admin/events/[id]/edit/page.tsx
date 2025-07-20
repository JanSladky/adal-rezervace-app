// src/app/admin/events/[id]/edit/page.tsx
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";

import EditEventForm from "@/components/EditEventForm";
import AddEventDateForm from "@/components/admin/AddEventDateForm";
import DeleteEventDateButton from "@/components/admin/DeleteEventDateButton";
import RegistrationActions from "@/components/admin/RegistrationActions";

type Props = { params: { id: string } };

export default async function EditEventPage({ params }: Props) {
  // 1) Ověření admina
   const cookieStore = await cookies();
  if (cookieStore.get("admin-auth")?.value !== "true") {
    redirect("/login");
  }

  // 2) Parsování ID akce
  const eventId = Number(params.id);
  if (isNaN(eventId)) return notFound();

  // 3) Načtení akce s termíny a registracemi
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      eventDates: {
        include: { registrations: true },
      },
    },
  });
  if (!event) return notFound();

  // 4) Data pro EditEventForm (kapacitu již upravujeme na úrovni termínů)
  const formattedEvent = {
    id:          event.id,
    name:        event.name,
    image:       event.image,
    location:    event.location,
    description: event.description,
    difficulty:  event.difficulty as "nenarocne" | "stredne_narocne" | "narocne",
  } as const;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upravit akci</h1>

      {/* 5) Formulář pro úpravu základních údajů */}
      <EditEventForm event={formattedEvent} />

      <h2 className="text-xl font-bold mt-8 mb-4">Termíny akce</h2>
      <ul className="flex flex-col gap-2 mb-4">
        {event.eventDates.map((dateItem: typeof event.eventDates[number]) => {
          // spočítáme počet registrovaných
          const totalRegistered = dateItem.registrations.reduce(
            (sum: number, reg: typeof dateItem.registrations[number]) =>
              sum + (reg.attendees ?? 1),
            0
          );
          const remainingCapacity = dateItem.capacity - totalRegistered;

          return (
            <li
              key={dateItem.id}
              className="border p-2 rounded flex flex-col gap-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div>
                    <strong>
                      {new Date(dateItem.date).toLocaleString("cs-CZ", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </strong>{" "}
                    – Kapacita: {dateItem.capacity}
                  </div>
                  <div>Zbývá volných míst: {remainingCapacity}</div>
                </div>

                <div className="flex gap-2">
                  {/* Smazat termín */}
                  <DeleteEventDateButton
                    eventId={event.id}
                    dateId={dateItem.id}
                  />
                  {/* Editace termínu */}
                  <a
                    href={`/admin/events/${event.id}/dates/${dateItem.id}/edit`}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Upravit
                  </a>
                </div>
              </div>

              <h3 className="font-semibold">Registrovaní:</h3>
              {dateItem.registrations.length > 0 ? (
                <ul className="text-sm space-y-2">
                  {dateItem.registrations.map(
                    (reg: typeof dateItem.registrations[number]) => (
                      <li
                        key={reg.id}
                        className="flex justify-between items-center"
                      >
                        <span>
                          {reg.name} ({reg.email}) – {reg.attendees ?? 1} osob
                          {reg.paid && " (✅ zaplaceno)"}
                        </span>
                        {/* Pod‐komponenta s onClick / fetch / router.refresh */}
                        <RegistrationActions
                          registration={{
                            id:        reg.id,
                            name:      reg.name,
                            email:     reg.email,
                            attendees: reg.attendees ?? 1,
                            paid:      reg.paid,
                          }}
                          eventId={event.id}
                        />
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">Žádné registrace</p>
              )}
            </li>
          );
        })}
      </ul>

      {/* 6) Formulář pro přidání nového termínu */}
      <AddEventDateForm eventId={event.id} />
    </div>
  );
}