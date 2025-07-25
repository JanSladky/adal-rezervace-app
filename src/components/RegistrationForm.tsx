"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ToastMessage from "@/components/ToastMessage";
import ConfirmationModal from "@/components/ConfirmationModal";
import LoadingButton from "@/components/LoadingButton";

interface RegistrationFormProps {
  eventId: number;
  selectedDateId: number;
  selectedDateISO: string;
  capacity: number;
  alreadyRegistered: number;
}

export default function RegistrationForm({
  eventId,
  selectedDateId,
  selectedDateISO,
  capacity,
  alreadyRegistered,
}: RegistrationFormProps) {
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

  const hasModalData =
    submittedEmail && qrCodeUrl && typeof amountCZK === "number" && variableSymbol && accountNumber;

  if (remaining <= 0) {
    return (
      <p className="text-red-600 font-semibold">
        Kapacita tohoto termínu je již vyčerpána, nelze se registrovat.
      </p>
    );
  }

  return (
    <>
      {toast && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={handleToastClose}
        />
      )}

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
        <label className="flex flex-col">
          <span className="mb-1 font-medium">Vaše jméno</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="p-2 border rounded"
            placeholder="Např. Jan Novák"
          />
        </label>

        <label className="flex flex-col">
          <span className="mb-1 font-medium">Váš e-mail</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="p-2 border rounded"
            placeholder="např. jan@email.cz"
          />
        </label>

        <label className="flex flex-col">
          <span className="mb-1 font-medium">Počet vstupenek</span>
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
            className="p-2 border rounded"
            placeholder="Např. 2"
          />
        </label>

        <label className="flex flex-col">
          <span className="mb-1 font-medium">Vybraný termín</span>
          <select value={selectedDateId} disabled className="bg-gray-100 p-2 border rounded">
            <option value={selectedDateId}>
              {new Date(selectedDateISO).toLocaleString("cs-CZ", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </option>
          </select>
        </label>

        <LoadingButton type="submit" isLoading={isSubmitting}>
          {isSubmitting ? "Odesílání..." : `Registrovat (${remaining} volných míst)`}
        </LoadingButton>
      </form>
    </>
  );
}