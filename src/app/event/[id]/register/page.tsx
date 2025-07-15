import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import RegisterForm from "../../../../components/RegistrationForm";

type Props = {
  params: { id: string };
};

export default async function RegisterPage({ params }: Props) {
  const event = await prisma.event.findUnique({
    where: { id: Number(params.id) },
    include: {
      eventDates: true,
    },
  });

  if (!event) return notFound();

  const dates = event.eventDates.map((date: typeof event.eventDates[number]) => ({
    id: date.id,
    date: date.date.toISOString(),
  }));

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Registrace na akci</h1>
      <p className="mb-2">{event.name}</p>

      <RegisterForm eventId={event.id} dates={dates} />
    </div>
  );
}
