"use client";

export default function RegisterButton({ eventId }: { eventId: number }) {
  const handleRegister = async () => {
    const res = await fetch("/api/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId }),
    });

    if (res.ok) {
      alert("Byli jste úspěšně zaregistrováni!");
      location.reload();
    } else {
      alert("Chyba při registraci.");
    }
  };

  return (
    <button
      onClick={handleRegister}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Registrovat se
    </button>
  );
}