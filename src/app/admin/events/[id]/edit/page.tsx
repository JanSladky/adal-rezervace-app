export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";

import EditEventForm from "@/components/EditEventForm";
import AddEventDateForm from "@/components/admin/AddEventDateForm";
import DeleteEventDateButton from "@/components/admin/DeleteEventDateButton";
import RegistrationActions from "@/components/admin/RegistrationActions";
import EditDateButton from "../../../../../components/EditDateButton";

import { formatDifficulty } from "../../../../../utils/formatters";

export default async function Page(context: { params: { id: string } }) {
  const { params } = context;

  const cookieStore = await cookies();
  if (cookieStore.get("admin-auth")?.value !== "true") {
    redirect("/login");
  }

  const eventId = Number(params.id);
  if (isNaN(eventId)) return notFound();

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      id: true,
      name: true,
      image: true,
      location: true,
      description: true,
      difficulty: true,
      duration: true,
      variableSymbol: true,
      accountNumber: true,
      eventDates: {
        include: { registrations: true },
      },
    },
  });
  if (!event) return notFound();

  type DateItem = typeof event.eventDates[number];
  type Reg = DateItem["registrations"][number];

  const formattedEvent = {
    id: event.id,
    name: event.name,
    image: event.image,
    location: event.location,
    description: event.description,
    difficulty: event.difficulty as "nenarocne" | "stredne_narocne" | "narocne",
    duration: event.duration,
    variableSymbol: event.variableSymbol,
    accountNumber: event.accountNumber, 
  } as const;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upravit akci</h1>
      <EditEventForm event={formattedEvent} />
      <h2 className="text-xl font-bold mt-8 mb-4">Termíny akce</h2>
      <ul className="flex flex-col gap-6 mb-4">
        {event.eventDates.map((dateItem: DateItem) => {
          const totalRegistered = dateItem.registrations.reduce((sum: number, r: Reg) => sum + (r.attendees ?? 1), 0);
          const remaining = dateItem.capacity - totalRegistered;
          const unpaid = dateItem.registrations.filter((r: Reg) => !r.paid);
          const paid = dateItem.registrations.filter((r: Reg) => r.paid);

          return (
            <li key={dateItem.id} className="border p-4 rounded flex flex-col gap-4">
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
                  <div>Zbývá volných míst: {remaining}</div>
                </div>
                <div className="flex gap-2">
                  <DeleteEventDateButton eventId={event.id} dateId={dateItem.id} />
                  <EditDateButton eventId={event.id} dateId={dateItem.id} /> {/* ✅ nahrazeno */}
                </div>
              </div>

              <section>
                <h3 className="font-semibold">Nezaplacené rezervace</h3>
                {unpaid.length > 0 ? (
                  <ul className="space-y-2">
                    {unpaid.map((r: Reg) => (
                      <li key={r.id} className="flex justify-between items-center">
                        <span>
                          {r.name} ({r.email}) – {r.attendees ?? 1} osob
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
                  <p className="text-sm text-gray-500">Žádné nezaplacené rezervace</p>
                )}
              </section>

              <section className="mt-4">
                <h3 className="font-semibold">Zaplacené rezervace</h3>
                {paid.length > 0 ? (
                  <ul className="space-y-2">
                    {paid.map((r: Reg) => (
                      <li key={r.id} className="flex justify-between items-center">
                        <span>
                          {r.name} ({r.email}) – {r.attendees ?? 1} osob <strong className="ml-2 text-green-600">(✅ zaplaceno)</strong>
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
                  <p className="text-sm text-gray-500">Žádné zaplacené rezervace</p>
                )}
              </section>
            </li>
          );
        })}
      </ul>
      <AddEventDateForm eventId={event.id} />
    </div>
  );
}
