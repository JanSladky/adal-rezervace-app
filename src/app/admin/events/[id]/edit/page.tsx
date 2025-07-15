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
  const cookieStore = await cookies();
  const adminAuth = (await cookieStore).get("admin-auth")?.value;
  const isAdmin = adminAuth === "true";

  if (!isAdmin) {
    redirect("/login");
  }

  const event = await prisma.event.findUnique({
    where: { id: Number(params.id) },
    include: {
      eventDates: true,
    },
  });

  if (!event) return notFound();

  const formattedEvent = {
    id: event.id,
    name: event.name,
    date: event.date.toISOString().slice(0, 16),
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
        {event.eventDates.map((date: typeof event.eventDates[number]) => (
          <li key={date.id} className="border p-2 rounded flex justify-between items-center">
            <span>
              {new Date(date.date).toLocaleString("cs-CZ")} – Kapacita: {date.capacity}
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
          </li>
        ))}
      </ul>

      <AddEventDateForm eventId={event.id} />
    </div>
  );
}