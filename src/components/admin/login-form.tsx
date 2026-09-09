"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

export function LoginForm({ initialError }: { initialError?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>(initialError);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(undefined);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setPending(false);
      return;
    }

    // refresh() so the server components re-read the new session cookie.
    router.replace(params.get("next") ?? "/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit}>
      <label
        htmlFor="email"
        className="mb-2 block font-label text-[10px] uppercase tracking-[0.14em] text-muted"
      >
        Email
      </label>
      <input
        id="email"
        type="email"
        required
        autoComplete="username"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="admin@wvsu.edu.ph"
        className="w-full border border-ink/20 bg-surface px-3.5 py-3 text-[14.5px] outline-none focus:border-brand"
      />

      <label
        htmlFor="password"
        className="mb-2 mt-5 block font-label text-[10px] uppercase tracking-[0.14em] text-muted"
      >
        Password
      </label>
      <input
        id="password"
        type="password"
        required
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        className="w-full border border-ink/20 bg-surface px-3.5 py-3 text-[14.5px] outline-none focus:border-brand"
      />

      {error && (
        <p role="alert" className="mt-3 font-label text-xs text-danger">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 w-full bg-brand-deep py-3.5 text-[14.5px] font-semibold text-canvas disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Log in"}
      </button>
    </form>
  );
}
