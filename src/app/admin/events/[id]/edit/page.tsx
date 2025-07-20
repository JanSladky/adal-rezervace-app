// vynutí server–side vykreslení, aby params a cookies fungovaly správně
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import EditEventForm from "../../../../../components/EditEventForm";
import AddEventDateForm from "../../../../../components/admin/AddEventDateForm";
import DeleteEventDateButton from "../../../../../components/admin/DeleteEventDateButton";

type Props = {
  params: { id: string };
};

export default async function EditEventPage({ params }: Props) {
  const cookieStore = await cookies();
  if (cookieStore.get("admin-auth")?.value !== "true") {
    redirect("/login");
  }

  const eventId = Number(params.id);
  if (isNaN(eventId)) return notFound();

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      eventDates: {
        include: { registrations: true },
      },
    },
  });
  if (!event) return notFound();

  const formattedEvent = {
    id:          event.id,
    name:        event.name,
    capacity:    event.capacity,
    image:       event.image,
    location:    event.location,
    description: event.description,
    difficulty:  event.difficulty as "nenarocne" | "stredne_narocne" | "narocne",
  } as const;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upravit akci</h1>

      <EditEventForm event={formattedEvent} />

      <h2 className="text-xl font-bold mt-8 mb-4">Termíny akce</h2>
      <ul className="flex flex-col gap-2 mb-4">
        {event.eventDates.map((dateItem: any) => {
          // sum explicitně number, reg jako any
          const totalRegistered = dateItem.registrations.reduce(
            (sum: number, reg: any) => sum + (reg.attendees || 1),
            0
          );
          const remainingCapacity = dateItem.capacity - totalRegistered;

          return (
            <li key={dateItem.id} className="border p-2 rounded flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span>
                  {new Date(dateItem.date).toLocaleString("cs-CZ")} – Kapacita:{" "}
                  {dateItem.capacity}
                  <br />
                  Zbývá volných míst: {remainingCapacity}
                </span>

                <div className="flex gap-2">
                  <DeleteEventDateButton
                    eventId={event.id}
                    dateId={dateItem.id}
                  />
                  <a
                    href={`/admin/events/${event.id}/dates/${dateItem.id}/edit`}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Upravit
                  </a>
                </div>
              </div>

              <h3 className="font-semibold mt-2">Registrovaní:</h3>
              {dateItem.registrations.length > 0 ? (
                <ul className="text-sm mt-1">
                  {dateItem.registrations.map((reg: any) => (
                    <li key={reg.id}>
                      {reg.name} ({reg.email}) – {reg.attendees || 1} osob
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">Žádné registrace</p>
              )}
            </li>
          );
        })}
      </ul>

      <AddEventDateForm eventId={event.id} />
    </div>
  );
}