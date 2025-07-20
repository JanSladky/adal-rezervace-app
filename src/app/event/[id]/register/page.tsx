"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, notFound, useRouter } from "next/navigation";
import RegisterForm from "@/components/RegistrationForm";

export default function RegisterPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const eventId = Number(id);
  const dateId = Number(searchParams.get("dateId"));

  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${eventId}`);
        if (!res.ok) throw new Error("Event not found");
        const data = await res.json();
        setEvent(data);
      } catch (error) {
        router.replace("/404");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, router]);

  if (loading) return <p>Načítám...</p>;
  if (!event) return null;

  const selectedDate = event.eventDates.find((d: any) => d.id === dateId);
  if (!selectedDate) {
    router.replace("/404");
    return null;
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Registrace na akci</h1>
      <p className="mb-2">{event.name}</p>

      <RegisterForm
        eventId={event.id}
        selectedDateId={selectedDate.id}
        selectedDateISO={selectedDate.date}
      />
    </div>
  );
}