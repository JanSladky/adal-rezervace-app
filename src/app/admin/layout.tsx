'use client';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/';
  }

  return (
    <div className="p-4">
      <nav className="mb-4 flex gap-4 items-center">
        <a href="/admin/events" className="underline">Seznam akcí</a>
        <a href="/admin/events/add" className="underline">Přidat akci</a>
        <a href="/admin/users" className="underline">Správa uživatelů</a>

        <button
          onClick={handleLogout}
          className="ml-auto bg-red-600 text-white px-4 py-2 rounded"
        >
          Odhlásit se
        </button>
      </nav>

      {children}
    </div>
  );
}