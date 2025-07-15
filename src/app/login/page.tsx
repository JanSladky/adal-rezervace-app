'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      router.push('/admin/events');
    } else {
      alert('Špatné údaje');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="border p-2 mb-2 w-full" placeholder="E-mail" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="border p-2 mb-2 w-full" placeholder="Heslo" />
      <button type="submit" className="bg-blue-600 text-white p-2 w-full">Přihlásit</button>
    </form>
  );
}