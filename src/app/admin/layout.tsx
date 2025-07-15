export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4">
      <nav className="mb-4 flex gap-4">
        <a href="/admin/events" className="underline">Seznam akcí</a>
        <a href="/admin/events/add" className="underline">Přidat akci</a>
      </nav>
      {children}
    </div>
  );
}