// src/app/admin/events/[id]/edit/page.tsx
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";

import EditEventForm from "../../../../../components/EditEventForm";
import AddEventDateForm from "../../../../../components/admin/AddEventDateForm";
import DeleteEventDateButton from "../../../../../components/admin/DeleteEventDateButton";
import RegistrationActions, {
  RegistrationWithPaid,
} from "../../../../../components/admin/RegistrationActions";

type Props = {
  params: { id: string };
};

export default async function EditEventPage({ params }: Props) {
  // 1) await cookies() před tím, než na něm zavoláte .get()
  const cookieStore = await cookies();
  if (cookieStore.get("admin-auth")?.value !== "true") {
    redirect("/login");
  }

  // 2) Parsujeme eventId
  const eventId = Number(params.id);
  if (isNaN(eventId)) return notFound();

  // 3) Načteme akci s termíny a registracemi
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { eventDates: { include: { registrations: true } } },
  });
  if (!event) return notFound();

  // 4) Data pro úpravu
  const formattedEvent = {
    id:          event.id,
    name:        event.name,
    capacity:    event.capacity,
    image:       event.image,
    location:    event.location,
    description: event.description,
    difficulty:  event.difficulty as
      | "nenarocne"
      | "stredne_narocne"
      | "narocne",
  } as const;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upravit akci</h1>

      {/* Základní údaje */}
      <EditEventForm event={formattedEvent} />

      <h2 className="text-xl font-bold mt-8 mb-4">Termíny akce</h2>
      <ul className="flex flex-col gap-4">
        {event.eventDates.map((dateItem: any) => {
          const totalRegistered = dateItem.registrations.reduce(
            (sum: number, r: any) => sum + (r.attendees ?? 1),
            0
          );
          const remaining = dateItem.capacity - totalRegistered;

          return (
            <li
              key={dateItem.id}
              className="border p-4 rounded flex flex-col gap-3"
            >
              <div className="flex justify-between items-center">
                <div>
                  <strong>
                    {new Date(dateItem.date).toLocaleString("cs-CZ")}
                  </strong>{" "}
                  – Kapacita: {dateItem.capacity}
                  <br />
                  Zbývá volných míst: {remaining}
                </div>
                <div className="flex gap-2">
                  <DeleteEventDateButton
                    eventId={event.id}
                    dateId={dateItem.id}
                  />
                  <a
                    href={`/admin/events/${event.id}/dates/${dateItem.id}/edit`}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Upravit termín
                  </a>
                </div>
              </div>

              <h3 className="font-semibold">Registrovaní:</h3>
              {dateItem.registrations.length > 0 ? (
                <ul className="space-y-2 text-sm">
                  {dateItem.registrations.map((reg: any) => (
                    <li
                      key={reg.id}
                      className="flex justify-between items-center"
                    >
                      <span>
                        {reg.name} ({reg.email}) –{" "}
                        {reg.attendees ?? 1} osob
                      </span>
                      <RegistrationActions
                        registration={reg as RegistrationWithPaid}
                        eventId={event.id}
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Žádné registrace</p>
              )}
            </li>
          );
        })}
      </ul>

      {/* Přidání nového termínu */}
      <AddEventDateForm eventId={event.id} />
    </div>
  );
}