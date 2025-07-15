'use client';
import { useEffect, useState, FormEvent } from "react";

type User = {
  id: number;
  email: string;
  isAdmin: boolean;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data);
  }

  async function handleAddUser(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, isAdmin }),
    });

    setEmail("");
    setPassword("");
    setIsAdmin(false);
    fetchUsers();
  }

  async function handleDeleteUser(id: number) {
    await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchUsers();
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Správa uživatelů</h1>

      <form onSubmit={handleAddUser} className="mb-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
          className="border p-2 mr-2"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Heslo"
          className="border p-2 mr-2"
        />
        <label className="mr-2">
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            className="mr-1"
          />
          Admin
        </label>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Přidat
        </button>
      </form>

      <ul>
        {users.map((user) => (
          <li key={user.id} className="mb-2">
            {user.email} ({user.isAdmin ? "Admin" : "User"})
            <button
              onClick={() => handleDeleteUser(user.id)}
              className="ml-2 text-red-600"
            >
              Smazat
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}