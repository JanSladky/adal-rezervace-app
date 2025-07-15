import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import EditEventForm from "../../../../../components/EditEventForm";
import AddEventDateForm from "../../../../../components/admin/AddEventDateForm";
import { cookies } from "next/headers";
import DeleteEventDateButton from "../../../../../components/admin/DeleteEventDateButton";

type Props = {
  params: { id: string };
};

export default async function EditEventPage({ params }: Props) {
  const cookieStore = await cookies(); // Oprava: await
  const adminAuth = cookieStore.get("admin-auth")?.value;
  const isAdmin = adminAuth === "true";

  if (!isAdmin) {
    redirect("/login");
  }

  const event = await prisma.event.findUnique({
    where: { id: Number(params.id) },
    include: {
      eventDates: {
        include: {
          registrations: true,
        },
      },
    },
  });

  if (!event) return notFound();

  const formattedEvent = {
    id: event.id,
    name: event.name,
    capacity: event.capacity,
    image: event.image,
    location: event.location,
    description: event.description,
    difficulty: event.difficulty as "nenarocne" | "stredne_narocne" | "narocne",
  } as const;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upravit akci</h1>

      <EditEventForm event={formattedEvent} />

      <h2 className="text-xl font-bold mt-8 mb-4">Termíny akce</h2>
      <ul className="flex flex-col gap-2 mb-4">
        {event.eventDates.map((date: typeof event.eventDates[number]) => {
          const totalRegistered = date.registrations.reduce(
            (sum: number, reg: typeof date.registrations[number]) =>
              sum + (reg.attendees || 1),
            0
          );

          const remainingCapacity = date.capacity - totalRegistered;

          return (
            <li key={date.id} className="border p-2 rounded flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span>
                  {new Date(date.date).toLocaleString("cs-CZ")} – Kapacita: {date.capacity}
                  <br />
                  Zbývá volných míst: {remainingCapacity}
                </span>

                <div className="flex gap-2">
                  <DeleteEventDateButton eventId={event.id} dateId={date.id} />
                  <a
                    href={`/admin/events/${event.id}/dates/${date.id}/edit`}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Upravit
                  </a>
                </div>
              </div>

              <h3 className="font-semibold mt-2">Registrovaní:</h3>
              {date.registrations.length > 0 ? (
                <ul className="text-sm mt-1">
                  {date.registrations.map((reg: typeof date.registrations[number]) => (
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