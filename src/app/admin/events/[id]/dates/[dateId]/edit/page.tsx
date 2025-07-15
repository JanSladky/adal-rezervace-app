import { prisma } from "@/lib/prisma";
import EditEventDateForm from "@/components/admin/EditEventDateForm";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string; dateId: string } }) {
  const eventDate = await prisma.eventDate.findUnique({
    where: { id: Number(params.dateId) },
  });

  if (!eventDate) return notFound();

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upravit termín</h1>
      <EditEventDateForm
        eventId={Number(params.id)}
        dateId={Number(params.dateId)}
        initialDate={eventDate.date.toISOString().slice(0, 16)}
        initialCapacity={eventDate.capacity}
      />
    </div>
  );
}