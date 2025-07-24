// components/ConfirmationModal.tsx
interface ConfirmationModalProps {
  email: string;
  qrCodeBase64: string;
  amountCZK: number;
  variableSymbol: string;
  accountNumber: string;
  onClose: () => void;
}

export default function ConfirmationModal({
  email,
  qrCodeBase64,
  amountCZK,
  variableSymbol,
  accountNumber,
  onClose,
}: ConfirmationModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded shadow-md max-w-md w-full relative">
        {/* ✅ Zelený horní proužek */}
        <div className="bg-green-500 text-white px-6 py-4 rounded-t">
          <h2 className="text-lg font-bold">Děkujeme za registraci</h2>
        </div>

        {/* ❌ Zavírací tlačítko */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
        >
          ✕
        </button>

        {/* ✅ Obsah */}
        <div className="p-6">
          <p className="mb-4">
            Údaje k platbě jsme zaslali na e-mail: <strong>{email}</strong>
          </p>

          <h3 className="text-md font-semibold text-center mb-2">Údaje k platbě</h3>
          <p className="text-sm text-center mb-4">
            Zde jsou údaje k platbě, případně použijte načtení QR kódu:
          </p>

          <div className="flex justify-center mb-4">
            <img
              src={qrCodeBase64}
              alt="QR kód k platbě"
              className="w-48 h-48"
            />
          </div>

          <ul className="text-sm text-center space-y-1">
            <li>
              <strong>Částka:</strong> {amountCZK.toFixed(2)} Kč
            </li>
            <li>
              <strong>Variabilní symbol:</strong> {variableSymbol}
            </li>
            <li>
              <strong>Číslo účtu:</strong> {accountNumber}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}