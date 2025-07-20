// src/app/admin/events/[id]/edit/page.tsx
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";

import EditEventForm from "@/components/EditEventForm";
import AddEventDateForm from "@/components/admin/AddEventDateForm";
import DeleteEventDateButton from "@/components/admin/DeleteEventDateButton";
import RegistrationActions, {
  RegistrationWithPaid,
} from "@/components/admin/RegistrationActions";

type Props = {
  params: { id: string };
};

export default async function EditEventPage({ params }: Props) {
  // 1) Ověření admina – tady **await**, aby `cookieStore` nebylo Promise
  const cookieStore = await cookies();
  if (cookieStore.get("admin-auth")?.value !== "true") {
    redirect("/login");
  }

  // 2) Parsování a validace ID akce
  const eventId = Number(params.id);
  if (isNaN(eventId)) return notFound();

  // 3) Načtení akce včetně termínů a registrací
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      eventDates: { include: { registrations: true } },
    },
  });
  if (!event) return notFound();

  // 4) Data pro základní formulář (kapacitu už upravujeme v termínech)
  const formattedEvent = {
    id:          event.id,
    name:        event.name,
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
      <EditEventForm event={formattedEvent} />

      <h2 className="text-xl font-bold mt-8 mb-4">Termíny akce</h2>
      <ul className="flex flex-col gap-6">
        {event.eventDates.map((dateItem: any) => {
          // spočítat už registrované
          const totalRegistered = dateItem.registrations.reduce(
            (sum: number, r: any) => sum + (r.attendees ?? 1),
            0,
          );
          const remaining = dateItem.capacity - totalRegistered;

          // rozděl registrace na unpaid / paid
          const unpaid = dateItem.registrations.filter((r: any) => !r.paid);
          const paid   = dateItem.registrations.filter((r: any) => r.paid);

          return (
            <li key={dateItem.id} className="border rounded p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <strong>
                    {new Date(dateItem.date).toLocaleString("cs-CZ", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </strong>
                  <div>Kapacita: {dateItem.capacity}</div>
                  <div className="text-gray-600">
                    Zbývá volných míst: {remaining}
                  </div>
                </div>
                <div className="flex gap-2">
                  <DeleteEventDateButton
                    eventId={event.id}
                    dateId={dateItem.id}
                  />
                  <a
                    href={`/admin/events/${event.id}/dates/${dateItem.id}/edit`}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Upravit
                  </a>
                </div>
              </div>

              {/* Nezaplacené */}
              <div>
                <h3 className="font-semibold mb-2">Nezaplacené</h3>
                {unpaid.length > 0 ? (
                  <ul className="space-y-2">
                    {unpaid.map((r: any) => {
                      const reg: RegistrationWithPaid = {
                        id:        r.id,
                        name:      r.name,
                        email:     r.email,
                        attendees: r.attendees ?? 1,
                        paid:      r.paid,
                      };
                      return (
                        <li
                          key={reg.id}
                          className="flex justify-between items-center"
                        >
                          <span>
                            {reg.name} – {reg.attendees} osob (
                            {reg.email})
                          </span>
                          <RegistrationActions
                            registration={reg}
                            eventId={event.id}
                          />
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">Žádné nezaplacené</p>
                )}
              </div>

              {/* Zaplacené */}
              <div>
                <h3 className="font-semibold mb-2">Zaplacené</h3>
                {paid.length > 0 ? (
                  <ul className="space-y-2">
                    {paid.map((r: any) => {
                      const reg: RegistrationWithPaid = {
                        id:        r.id,
                        name:      r.name,
                        email:     r.email,
                        attendees: r.attendees ?? 1,
                        paid:      r.paid,
                      };
                      return (
                        <li
                          key={reg.id}
                          className="flex justify-between items-center"
                        >
                          <span className="text-gray-500 line-through">
                            {reg.name} – {reg.attendees} osob (
                            {reg.email})
                          </span>
                          <RegistrationActions
                            registration={reg}
                            eventId={event.id}
                          />
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">Žádné zaplacené</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <AddEventDateForm eventId={event.id} />
    </div>
  );
}