// src/app/layout.tsx
import "../app/globals.css";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body className="font-sans bg-gray-100 text-gray-900">
       
        {children}
      </body>
    </html>
  );
}