import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminEventsPageClient from "./AdminEventsPageClient"; // napojíme novou client komponentu

export default async function AdminEventsPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin-auth")?.value === "true";

  if (!isAdmin) {
    redirect("/login");
  }

  const events = (
    await prisma.event.findMany({
      select: {
        id: true,
        name: true,
        eventDates: {
          select: {
            id: true,
            date: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    })
  ).map((event) => ({
    ...event,
    eventDates: event.eventDates.map((d) => ({
      ...d,
      date: d.date.toISOString(), // převedeme na string
    })),
  }));

  return <AdminEventsPageClient events={events} />;
}
