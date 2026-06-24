"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SetupPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [form, setForm] = useState({ username: "admin", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/setup")
      .then((r) => r.json())
      .then((data) => {
        if (data.needsSetup) setAllowed(true);
        else router.replace("/login");
      })
      .finally(() => setChecking(false));
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Las contraseñas no coinciden"); return; }
    if (form.password.length < 6) { setError("Mínimo 6 caracteres"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.username, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Error al crear el administrador");
      else router.push("/login");
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  if (checking || !allowed) {
    return (
      <div className="min-h-screen grain bg-gradient-to-b from-brand-espresso to-brand-roast flex items-center justify-center">
        <div className="text-brand-honey/40 text-sm tracking-widest">...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grain bg-gradient-to-b from-brand-espresso to-brand-roast flex flex-col items-center justify-center px-4">
      <div className="text-center mb-8">
        <h1 className="font-serif text-5xl font-bold text-brand-cream tracking-tight">Plenty.</h1>
        <p className="text-brand-honey/60 text-xs tracking-[0.2em] uppercase mt-2">Configuración inicial</p>
      </div>

      <div className="w-full max-w-sm bg-brand-parchment rounded-2xl border border-brand-border/50 shadow-2xl p-8">
        <h2 className="font-serif text-xl font-semibold text-brand-espresso mb-1">Crear administrador</h2>
        <p className="text-brand-muted text-sm mb-6">Solo es necesario la primera vez.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Usuario", key: "username", type: "text", placeholder: "admin" },
            { label: "Contraseña", key: "password", type: "password", placeholder: "Mínimo 6 caracteres" },
            { label: "Confirmar contraseña", key: "confirm", type: "password", placeholder: "••••••••" },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-brand-brown tracking-widest uppercase mb-2">
                {label}
              </label>
              <input
                type={type}
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-brand-border bg-white text-brand-espresso placeholder-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-caramel/30 focus:border-brand-caramel"
                placeholder={placeholder}
                required
              />
            </div>
          ))}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-espresso text-brand-cream py-3 rounded-xl font-medium hover:bg-brand-roast disabled:opacity-50 mt-2"
          >
            {loading ? "Creando..." : "Crear administrador"}
          </button>
        </form>
      </div>

      <div className="mt-6">
        <Link href="/login" className="text-sm text-brand-honey/60 hover:text-brand-cream">
          Volver al login
        </Link>
      </div>
    </div>
  );
}
