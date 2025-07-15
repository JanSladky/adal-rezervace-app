'use client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/');
  };

  return (
    <button
      onClick={handleLogout}
      className="mb-4 bg-red-600 text-white px-4 py-2 rounded"
    >
      Odhlásit se
    </button>
  );
}