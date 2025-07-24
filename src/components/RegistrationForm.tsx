"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ToastMessage from "@/components/ToastMessage";
import ConfirmationModal from "@/components/ConfirmationModal";

interface RegistrationFormProps {
  eventId: number;
  selectedDateId: number;
  selectedDateISO: string;
  capacity: number;
  alreadyRegistered: number;
}

export default function RegistrationForm({ eventId, selectedDateId, selectedDateISO, capacity, alreadyRegistered }: RegistrationFormProps) {
  const router = useRouter();
  const remaining = capacity - alreadyRegistered;

  const [form, setForm] = useState({
    name: "",
    email: "",
    attendees: 1,
  });

  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [amountCZK, setAmountCZK] = useState<number | null>(null);
  const [variableSymbol, setVariableSymbol] = useState<string | null>(null);
  const [accountNumber, setAccountNumber] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error" | "warning";
    duration?: number;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await fetch("/api/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId,
        eventDateId: selectedDateId,
        name: form.name,
        email: form.email,
        attendees: form.attendees,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("📦 Response z API:", data);
      if (
        typeof data.amountCZK === "number" &&
        typeof data.variableSymbol === "string" &&
        typeof data.accountNumber === "string" &&
        typeof data.qrCodeUrl === "string"
      ) {
        setSubmittedEmail(form.email);
        setQrCodeUrl(data.qrCodeUrl);
        setAmountCZK(data.amountCZK);
        setVariableSymbol(data.variableSymbol);
        setAccountNumber(data.accountNumber);

        setToast({
          message: `✅ Děkujeme za registraci. Údaje k platbě jsme zaslali na e-mail: ${form.email}`,
          type: "success",
          duration: 5000,
        });

        setForm({ name: "", email: "", attendees: 1 });
        setShowModal(true);
      } else {
        setToast({
          message: "❌ Údaje k platbě nejsou momentálně k dispozici.",
          type: "error",
          duration: 5000,
        });
      }
    } else {
      setToast({
        message: "❌ Chyba při registraci. Zkuste to prosím znovu.",
        type: "error",
        duration: 4000,
      });
    }

    setIsSubmitting(false);
  };

  const handleToastClose = () => setToast(null);

  const handleModalClose = () => {
    setShowModal(false);
    router.push(`/event/${eventId}`);
  };

  const hasModalData = submittedEmail && qrCodeUrl && typeof amountCZK === "number" && variableSymbol && accountNumber;

  if (remaining <= 0) {
    return <p className="text-red-600 font-semibold">Kapacita tohoto termínu je již vyčerpána, nelze se registrovat.</p>;
  }

  return (
    <>
      {toast && <ToastMessage message={toast.message} type={toast.type} duration={toast.duration} onClose={handleToastClose} />}

      {showModal && hasModalData && (
        <ConfirmationModal
          email={submittedEmail!}
          qrCodeBase64={qrCodeUrl!}
          amountCZK={amountCZK!}
          variableSymbol={variableSymbol!}
          accountNumber={accountNumber!}
          onClose={handleModalClose}
        />
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
        <input type="text" placeholder="Vaše jméno" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input type="email" placeholder="Váš e-mail" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input
          type="number"
          min={1}
          max={remaining}
          value={form.attendees}
          onChange={(e) =>
            setForm({
              ...form,
              attendees: parseInt(e.target.value),
            })
          }
          required
        />
        <select value={selectedDateId} disabled className="bg-gray-100">
          <option value={selectedDateId}>
            {new Date(selectedDateISO).toLocaleString("cs-CZ", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </option>
        </select>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center gap-2 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
        >
          {isSubmitting && (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          )}
          {isSubmitting ? "Odesílání..." : `Registrovat (${remaining} volných míst)`}
        </button>
      </form>
    </>
  );
}
