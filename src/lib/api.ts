export async function getEventById(id: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch event");
  }

  return res.json();
}