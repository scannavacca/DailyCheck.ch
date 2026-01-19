"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const USERNAME = "scannavacca";
const PASSWORD = "nonlaso";

export default function WebmasterAccessPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-3xl border bg-white/90 p-8 shadow-sm backdrop-blur">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Webmaster access</h1>
        <p className="text-sm text-gray-700">Nur mit Benutzername und Passwort.</p>
      </div>

      {error ? <div className="text-xs font-semibold text-red-600">{error}</div> : null}

      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-gray-700">Username</label>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-700">Password</label>
          <input
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <button
        className="w-full rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
        onClick={() => {
          if (username.trim() !== USERNAME || password !== PASSWORD) {
            setError("Zugriff verweigert.");
            return;
          }
          setError(null);
          localStorage.setItem("webmaster_authed", "yes");
          router.push("/webmaster");
        }}
      >
        Go
      </button>
    </div>
  );
}
