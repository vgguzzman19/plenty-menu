"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Credenciales incorrectas");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh grain relative bg-brand-espresso flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-brand-roast/30 via-transparent to-black/20"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="font-sans text-[10px] font-medium tracking-[0.45em] uppercase text-brand-honey/35 mb-6">
            Acceso privado
          </p>
          <h1 className="font-serif font-light text-[64px] leading-none tracking-[-0.02em] text-brand-cream">
            Plenty.
          </h1>
          <div className="mt-5 mb-4 flex items-center justify-center gap-3 max-w-[120px] mx-auto">
            <div className="flex-1 h-px bg-brand-caramel/20" />
            <div className="w-1 h-1 rounded-full bg-brand-caramel/40" />
            <div className="flex-1 h-px bg-brand-caramel/20" />
          </div>
          <p className="font-sans text-[11px] font-medium tracking-[0.35em] uppercase text-brand-honey/38">
            Panel de gestión
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-elevated p-7">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label
                htmlFor="username"
                className="block font-sans text-[11px] font-semibold text-brand-brown tracking-widest uppercase mb-1.5"
              >
                Usuario
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-brand-stone bg-brand-parchment/60 text-brand-espresso placeholder-brand-muted/40 focus:outline-none focus:ring-2 focus:ring-brand-caramel/25 focus:border-brand-caramel font-sans text-sm"
                placeholder="admin"
                required
                autoFocus
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block font-sans text-[11px] font-semibold text-brand-brown tracking-widest uppercase mb-1.5"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border border-brand-stone bg-brand-parchment/60 text-brand-espresso placeholder-brand-muted/40 focus:outline-none focus:ring-2 focus:ring-brand-caramel/25 focus:border-brand-caramel font-sans text-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-espresso p-1 rounded"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="bg-red-50 border border-red-100 text-red-600 font-sans text-sm px-4 py-3 rounded-xl"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-espresso text-brand-cream font-sans py-3 rounded-xl font-medium hover:bg-brand-roast disabled:opacity-50 disabled:cursor-not-allowed mt-1 text-sm tracking-wide"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        {/* Footer links */}
        <div className="mt-6 text-center space-y-2.5">
          <Link
            href="/"
            className="block font-sans text-sm text-brand-honey/50 hover:text-brand-cream transition-colors"
          >
            Ver la carta
          </Link>
          <Link
            href="/setup"
            className="block font-sans text-xs text-brand-caramel/30 hover:text-brand-honey/50 transition-colors"
          >
            Primera vez? Configurar acceso
          </Link>
        </div>
      </div>
    </div>
  );
}
