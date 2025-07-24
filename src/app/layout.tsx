// src/app/layout.tsx
import "../app/globals.css";
import LoadingOverlay from "@/components/LoadingOverlay";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body className="font-sans bg-gray-100 text-gray-900">
        <LoadingOverlay />  {/* Přidává spinner */}
        {children}
      </body>
    </html>
  );
}