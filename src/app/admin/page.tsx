"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { gsap } from "gsap";
import { Category, Product, TableCall } from "@/lib/storage";
import { ALLERGENS } from "@/lib/allergens";
import { ImageCropModal } from "@/components/ImageCropModal";
import {
  DndContext, DragEndEvent, PointerSensor, TouchSensor,
  useSensor, useSensors, closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext, useSortable, verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Tab = "orders" | "products" | "categories" | "analytics" | "qr" | "users";
type Role = "admin" | "employee";

interface ProductForm {
  name: string;
  description: string;
  name_en: string;
  description_en: string;
  name_fr: string;
  description_fr: string;
  name_ca: string;
  description_ca: string;
  price: string;
  categoryId: string;
  imageUrl: string;
  available: boolean;
  order: string;
  allergens: string[];
  badge: string;
}

interface CategoryForm {
  name: string;
  emoji: string;
  order: string;
  menu: "food" | "drinks";
}

const EMPTY_PRODUCT: ProductForm = {
  name: "", description: "",
  name_en: "", description_en: "", name_fr: "", description_fr: "",
  name_ca: "", description_ca: "",
  price: "", categoryId: "",
  imageUrl: "", available: true, order: "0", allergens: [], badge: "",
};
const EMPTY_CATEGORY: CategoryForm = { name: "", emoji: "", order: "0", menu: "food" };

/* ── Inline SVG icons ── */
function IconBell() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}
function IconMenu() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 11h16M4 16h10" />
    </svg>
  );
}
function IconGrid() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth={1.75} />
      <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth={1.75} />
      <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth={1.75} />
      <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth={1.75} />
    </svg>
  );
}
function IconChart() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}
function IconQr() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M3 9V5a2 2 0 012-2h4M3 15v4a2 2 0 002 2h4M15 3h4a2 2 0 012 2v4M15 21h4a2 2 0 002-2v-4" />
      <rect x="7" y="7" width="4" height="4" rx="0.5" strokeWidth={1.5} />
      <rect x="13" y="7" width="4" height="4" rx="0.5" strokeWidth={1.5} />
      <rect x="7" y="13" width="4" height="4" rx="0.5" strokeWidth={1.5} />
      <path strokeLinecap="round" strokeWidth={1.5} d="M13 13h1.5M16.5 13H18M13 16.5v1.5M16.5 15v3" />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}
function IconCross() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
function IconEdit() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}
function IconTrash() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}
function IconExternalLink() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

function DragHandle(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="flex flex-col items-center gap-1.5 px-2 py-1.5 rounded-lg text-brand-muted hover:text-brand-espresso hover:bg-brand-parchment cursor-grab active:cursor-grabbing touch-none flex-none transition-colors select-none"
      tabIndex={-1}
      aria-label="Arrastrar para reordenar"
    >
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="5" cy="3.5" r="1.4"/><circle cx="11" cy="3.5" r="1.4"/>
        <circle cx="5" cy="8" r="1.4"/><circle cx="11" cy="8" r="1.4"/>
        <circle cx="5" cy="12.5" r="1.4"/><circle cx="11" cy="12.5" r="1.4"/>
      </svg>
      <span className="font-sans text-[9px] tracking-wide uppercase font-semibold leading-none opacity-60">
        Mover
      </span>
    </button>
  );
}

interface SortableProductRowProps {
  product: Product;
  views: number;
  onToggle: (p: Product) => void;
  onEdit: (p: Product) => void;
  onDelete: (id: number) => void;
}
function SortableProductRow({ product: p, views, onToggle, onEdit, onDelete }: SortableProductRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: p.id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      className={`bg-white rounded-xl border border-brand-stone hover:border-brand-caramel/40 px-3 py-3.5 flex items-center gap-2 transition-colors ${!p.available ? "opacity-55" : ""}`}
    >
      <DragHandle {...attributes} {...listeners} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-sans font-medium text-brand-espresso text-sm truncate">{p.name}</span>
          {!p.available && (
            <span className="font-sans text-[10px] bg-brand-parchment text-brand-muted px-2 py-0.5 rounded-full border border-brand-stone flex-none tracking-wider uppercase">
              No disponible
            </span>
          )}
        </div>
        <span className="font-serif font-semibold text-brand-caramel text-sm">
          {p.price.toFixed(2).replace(".", ",")} €
        </span>
      </div>
      {views > 0 && (
        <span className="flex items-center gap-1 text-brand-muted/50 text-[11px] font-sans flex-none px-1" title={`${views} vistas`}>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {views}
        </span>
      )}
      <div className="flex items-center gap-0.5 flex-none">
        <button onClick={() => onToggle(p)} title={p.available ? "Ocultar" : "Mostrar"}
          className={`p-2 rounded-lg transition-colors ${p.available ? "text-emerald-500 hover:bg-emerald-50" : "text-brand-muted hover:bg-brand-parchment"}`}>
          {p.available ? <IconCheck /> : <IconCross />}
        </button>
        <button onClick={() => onEdit(p)} className="p-2 rounded-lg text-brand-muted hover:text-brand-espresso hover:bg-brand-parchment" title="Editar">
          <IconEdit />
        </button>
        <button onClick={() => onDelete(p.id)} className="p-2 rounded-lg text-brand-muted hover:text-red-500 hover:bg-red-50" title="Eliminar">
          <IconTrash />
        </button>
      </div>
    </div>
  );
}

interface SortableCategoryRowProps {
  category: Category;
  count: number;
  onEdit: (c: Category) => void;
  onDelete: (id: number) => void;
}
function SortableCategoryRow({ category: cat, count, onEdit, onDelete }: SortableCategoryRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cat.id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      className="bg-white rounded-xl border border-brand-stone px-4 py-4 flex items-center gap-3"
    >
      <DragHandle {...attributes} {...listeners} />
      <span className="text-2xl leading-none w-8 text-center flex-none">{cat.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="font-sans font-medium text-brand-espresso">{cat.name}</p>
        <p className="font-sans text-xs text-brand-muted mt-0.5">{count} producto{count !== 1 ? "s" : ""}</p>
      </div>
      <div className="flex gap-0.5">
        <button onClick={() => onEdit(cat)} className="p-2 rounded-lg text-brand-muted hover:text-brand-espresso hover:bg-brand-parchment" title="Editar">
          <IconEdit />
        </button>
        <button onClick={() => onDelete(cat.id)} className="p-2 rounded-lg text-brand-muted hover:text-red-500 hover:bg-red-50" title="Eliminar">
          <IconTrash />
        </button>
      </div>
    </div>
  );
}

const TABS: { id: Tab; label: string; Icon: () => JSX.Element; adminOnly?: boolean }[] = [
  { id: "orders",     label: "Pedidos",     Icon: IconBell  },
  { id: "products",   label: "Carta",       Icon: IconMenu,  adminOnly: true },
  { id: "categories", label: "Categorías",  Icon: IconGrid,  adminOnly: true },
  { id: "analytics",  label: "Analytics",   Icon: IconChart, adminOnly: true },
  { id: "qr",         label: "Código QR",   Icon: IconQr,    adminOnly: true },
  { id: "users",      label: "Usuarios",    Icon: IconUsers, adminOnly: true },
];

/* ─────────────────────────────────────────────
   Orders Tab — avisos de "listo para pedir" en tiempo real
───────────────────────────────────────────── */
function OrdersTab({ calls }: { calls: TableCall[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [resolvingIds, setResolvingIds] = useState<Set<number>>(new Set());
  const [, forceTick] = useState(0);

  // Refresca el "hace X min" cada 30s
  useEffect(() => {
    const t = setInterval(() => forceTick(v => v + 1), 30_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      gsap.from(Array.from(containerRef.current.children), {
        opacity: 0, y: 18, duration: 0.45, ease: "power2.out", stagger: 0.1, clearProps: "all",
      });
    }
  }, []); // eslint-disable-line

  async function resolve(id: number) {
    setResolvingIds(prev => new Set(prev).add(id));
    const el = itemRefs.current[id];
    if (el) {
      await new Promise<void>(resolveAnim => {
        gsap.to(el, { opacity: 0, x: 40, duration: 0.35, ease: "power2.in", onComplete: resolveAnim });
      });
    }
    await fetch(`/api/table-calls/${id}`, { method: "PUT" });
  }

  function elapsed(createdAt: string) {
    const mins = Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000));
    if (mins < 1) return "ahora mismo";
    if (mins === 1) return "hace 1 min";
    return `hace ${mins} min`;
  }

  return (
    <div ref={containerRef} className="space-y-3">
      {calls.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-brand-stone">
          <p className="text-4xl mb-2">🔔</p>
          <p className="font-sans text-sm text-brand-muted/50">No hay avisos pendientes.</p>
          <p className="font-sans text-xs text-brand-muted/35 mt-1">
            Aparecerán aquí cuando un cliente toque &ldquo;Pedir ya&rdquo; en la carta.
          </p>
        </div>
      ) : (
        calls.map((c) => {
          const urgent = Date.now() - new Date(c.createdAt).getTime() > 5 * 60_000;
          return (
            <div
              key={c.id}
              ref={el => { itemRefs.current[c.id] = el; }}
              className={`flex items-center gap-4 bg-white rounded-2xl border p-4 ${urgent ? "border-red-300" : "border-emerald-200"}`}
            >
              <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-none font-serif font-bold text-lg ${urgent ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
                {c.tableNumber}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-sans font-semibold text-brand-espresso text-sm">Mesa {c.tableNumber}</p>
                <p className={`font-sans text-xs mt-0.5 ${urgent ? "text-red-500 font-medium" : "text-brand-muted/60"}`}>
                  {elapsed(c.createdAt)}
                </p>
              </div>
              <button
                onClick={() => resolve(c.id)}
                disabled={resolvingIds.has(c.id)}
                className="flex-none bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-sans text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors"
              >
                Atendido
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Users Tab — solo admin, crea/borra cuentas de empleado
───────────────────────────────────────────── */
interface AdminUser { id: number; username: string; role: Role; active: boolean }

function UsersTab() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [listError, setListError] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/users");
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  function openModal() {
    setForm({ username: "", password: "" });
    setError("");
    setModalOpen(true);
  }

  async function saveUser() {
    if (!form.username || form.password.length < 6) {
      setError("Usuario y contraseña (mín. 6 caracteres) son obligatorios");
      return;
    }
    setSaving(true);
    setError("");
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setModalOpen(false);
      fetchUsers();
    } else {
      const d = await res.json();
      setError(d.error || "Error al crear el usuario");
    }
    setSaving(false);
  }

  async function removeUser(id: number) {
    if (!confirm("¿Eliminar el acceso de este empleado?")) return;
    setDeletingId(id);
    setListError("");
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setListError(d.error || `Error al eliminar (HTTP ${res.status})`);
    }
    await fetchUsers();
    setDeletingId(null);
  }

  async function toggleActive(u: AdminUser) {
    setTogglingId(u.id);
    setListError("");
    const res = await fetch(`/api/users/${u.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !u.active }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setListError(d.error || `Error al actualizar (HTTP ${res.status})`);
    }
    await fetchUsers();
    setTogglingId(null);
  }

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-brand-stone bg-white text-brand-espresso placeholder-brand-muted/40 focus:outline-none focus:ring-2 focus:ring-brand-caramel/25 focus:border-brand-caramel text-sm font-sans";
  const labelCls = "block text-[11px] font-semibold text-brand-brown tracking-widest uppercase mb-1.5 font-sans";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-xl font-semibold text-brand-espresso">Usuarios</h2>
          <p className="font-sans text-xs text-brand-muted mt-0.5">
            Los empleados solo pueden ver y gestionar la pestaña Pedidos.
          </p>
        </div>
        <button
          onClick={openModal}
          className="flex-none flex items-center gap-1.5 bg-brand-caramel hover:bg-brand-brown text-white px-4 py-2 rounded-xl text-sm font-sans font-medium"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Añadir empleado
        </button>
      </div>

      {listError && (
        <div className="bg-red-50 border border-red-200 text-red-700 font-sans text-sm px-4 py-3 rounded-xl mb-4">
          {listError}
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => <div key={i} className="h-16 bg-brand-stone/40 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-2">
          {users.map((u) => {
            const disabled = u.role === "employee" && !u.active;
            return (
              <div key={u.id} className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 transition-colors ${
                disabled ? "bg-amber-50 border-amber-200" : "bg-white border-brand-stone"
              }`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-none font-sans font-semibold text-sm ${
                  disabled ? "bg-amber-100 text-amber-700" : "bg-brand-parchment text-brand-espresso"
                }`}>
                  {u.username.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-sans font-medium text-sm truncate ${disabled ? "text-amber-900" : "text-brand-espresso"}`}>
                    {u.username}
                  </p>
                </div>
                <span className={`font-sans text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full flex-none ${
                  u.role === "admin"
                    ? "bg-brand-caramel/15 text-brand-brown"
                    : disabled ? "bg-amber-100 text-amber-700" : "bg-emerald-50 text-emerald-600"
                }`}>
                  {u.role === "admin" ? "Admin" : disabled ? "Deshabilitado" : "Empleado"}
                </span>
                {u.role === "employee" && (
                  <>
                    <button
                      onClick={() => toggleActive(u)}
                      disabled={togglingId === u.id}
                      className={`flex-none font-sans text-xs font-semibold px-3 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                        disabled
                          ? "bg-amber-500 hover:bg-amber-600 text-white"
                          : "border border-brand-stone text-brand-muted hover:text-brand-espresso hover:bg-brand-parchment"
                      }`}
                    >
                      {togglingId === u.id ? "..." : disabled ? "Habilitar" : "Deshabilitar"}
                    </button>
                    <button
                      onClick={() => removeUser(u.id)}
                      disabled={deletingId === u.id}
                      className="flex-none p-2 rounded-lg text-brand-muted hover:text-red-500 hover:bg-red-50 disabled:opacity-50"
                      title="Eliminar acceso"
                    >
                      <IconTrash />
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-brand-espresso/50 backdrop-blur-sm px-0 sm:px-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm shadow-elevated">
            <div className="px-6 py-5 border-b border-brand-stone flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold text-brand-espresso">Nuevo empleado</h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg text-brand-muted hover:text-brand-espresso hover:bg-brand-parchment" aria-label="Cerrar">
                <IconCross />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className={labelCls}>Usuario</label>
                <input type="text" value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className={inputCls} placeholder="camarero1" autoComplete="off" />
              </div>
              <div>
                <label className={labelCls}>Contraseña</label>
                <input type="password" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={inputCls} placeholder="Mínimo 6 caracteres" autoComplete="new-password" />
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 font-sans text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setModalOpen(false)}
                className="flex-1 border border-brand-stone text-brand-muted font-sans py-2.5 rounded-xl text-sm font-medium hover:bg-brand-parchment">
                Cancelar
              </button>
              <button onClick={saveUser} disabled={saving}
                className="flex-1 bg-brand-caramel hover:bg-brand-brown text-white font-sans py-2.5 rounded-xl text-sm font-medium disabled:opacity-50">
                {saving ? "Creando..." : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Analytics Tab — con GSAP real-time
───────────────────────────────────────────── */
function AnalyticsTab({
  stats, products, categories, onReset,
}: {
  stats: Record<number, number>;
  products: Product[];
  categories: Category[];
  onReset: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevStatsRef = useRef<Record<number, number>>({});
  const justMountedRef = useRef(true);
  const itemRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const numberRefs = useRef<Record<number, HTMLSpanElement | null>>({});
  const barRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const totalRef = useRef<HTMLSpanElement>(null);
  const [confirming, setConfirming] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    setResetting(true);
    const items = Object.values(itemRefs.current).filter(Boolean) as HTMLDivElement[];
    if (items.length > 0) {
      await new Promise<void>(resolve => {
        gsap.to(items, { opacity: 0, y: -10, duration: 0.2, stagger: 0.04, ease: "power2.in", onComplete: resolve });
      });
    }
    await fetch("/api/stats/reset", { method: "POST" });
    onReset();
    setConfirming(false);
    setResetting(false);
  };

  const top = products
    .filter(p => (stats[p.id] ?? 0) > 0)
    .sort((a, b) => (stats[b.id] ?? 0) - (stats[a.id] ?? 0));
  const totalViews = top.reduce((sum, p) => sum + (stats[p.id] ?? 0), 0);
  const maxViews = top[0] ? (stats[top[0].id] ?? 1) : 1;

  // GSAP es el único que controla el ancho de las barras (sin conflicto con React)
  const animateBars = useCallback((statsSnap: Record<number, number>, topList: Product[], delay = 0) => {
    const max = topList[0] ? (statsSnap[topList[0].id] ?? 1) : 1;
    topList.forEach((p, i) => {
      const el = barRefs.current[p.id];
      if (!el) return;
      const pct = Math.round(((statsSnap[p.id] ?? 0) / max) * 100);
      gsap.to(el, { width: `${pct}%`, duration: 0.65, delay: delay + i * 0.04, ease: "power2.out" });
    });
  }, []);

  // Animación de entrada al montar el tab
  useEffect(() => {
    if (containerRef.current) {
      gsap.from(Array.from(containerRef.current.children), {
        opacity: 0, y: 18,
        duration: 0.45, ease: "power2.out", stagger: 0.1, clearProps: "all",
      });
    }
    const items = top.map(p => itemRefs.current[p.id]).filter(Boolean);
    if (items.length > 0) {
      gsap.from(items, {
        opacity: 0, x: 22,
        duration: 0.4, ease: "power2.out", stagger: 0.07, delay: 0.18, clearProps: "all",
      });
    }
    // Barras: inicializar a 0 y animar hasta el valor real
    top.forEach(p => { const el = barRefs.current[p.id]; if (el) gsap.set(el, { width: 0 }); });
    animateBars(stats, top, 0.25);
    prevStatsRef.current = { ...stats };
    const t = setTimeout(() => { justMountedRef.current = false; }, 400);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line

  // Animación en actualizaciones en tiempo real
  useEffect(() => {
    if (justMountedRef.current) return;
    const prev = prevStatsRef.current;

    top.forEach(p => {
      const prevV = prev[p.id];
      const newV = stats[p.id] ?? 0;

      if (prevV === undefined) {
        // Producto nuevo: entra deslizando + barra arranca desde 0
        const el = itemRefs.current[p.id];
        if (el) gsap.fromTo(el, { opacity: 0, x: 28 }, { opacity: 1, x: 0, duration: 0.55, ease: "power3.out", clearProps: "all" });
        const barEl = barRefs.current[p.id];
        if (barEl) gsap.set(barEl, { width: 0 });
      } else if (newV > prevV) {
        // Vista añadida: pulsa el número
        const numEl = numberRefs.current[p.id];
        if (numEl) {
          gsap.fromTo(numEl,
            { scale: 1.45, color: "#B8722A" },
            { scale: 1, color: "#1C0D04", duration: 0.55, ease: "back.out(2.5)", clearProps: "color" }
          );
        }
      }
    });

    // Recalcula y anima TODAS las barras (maxViews puede haber cambiado)
    animateBars(stats, top);

    // Contador animado del total
    if (totalRef.current) {
      const prevTotal = Object.values(prev).reduce((s, v) => s + v, 0);
      if (totalViews !== prevTotal) {
        const obj = { val: prevTotal };
        gsap.to(obj, {
          val: totalViews, duration: 0.7, ease: "power2.out",
          onUpdate() {
            if (totalRef.current) totalRef.current.textContent = String(Math.round(obj.val));
          },
        });
      }
    }

    prevStatsRef.current = { ...stats };
  }, [stats]); // eslint-disable-line

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Resumen */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-brand-stone p-4">
          <p className="font-sans text-[10px] font-bold text-brand-muted/60 tracking-widest uppercase mb-1">Total vistas</p>
          <p className="font-serif text-3xl font-semibold text-brand-espresso">
            <span ref={totalRef}>{totalViews}</span>
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-brand-stone p-4">
          <p className="font-sans text-[10px] font-bold text-brand-muted/60 tracking-widest uppercase mb-1">Productos vistos</p>
          <p className="font-serif text-3xl font-semibold text-brand-espresso">{top.length}</p>
          <p className="font-sans text-[11px] text-brand-muted/50 mt-0.5">de {products.length} en carta</p>
        </div>
      </div>

      {/* Ranking */}
      <div className="bg-white rounded-2xl border border-brand-stone p-5">
        <div className="flex items-center gap-2 mb-5">
          <svg className="w-3.5 h-3.5 text-brand-caramel flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <h2 className="font-sans text-[11px] font-bold text-brand-muted tracking-widest uppercase">Productos más vistos</h2>
          <div className="ml-auto flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-sans text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              En vivo
            </span>
            {confirming ? (
              <span className="flex items-center gap-1.5">
                <span className="font-sans text-[11px] text-brand-muted/60">¿Resetear?</span>
                <button
                  onClick={handleReset}
                  disabled={resetting}
                  className="font-sans text-[11px] font-semibold text-red-600 hover:text-red-700 disabled:opacity-50 transition-colors"
                >
                  {resetting ? "…" : "Sí"}
                </button>
                <button
                  onClick={() => setConfirming(false)}
                  disabled={resetting}
                  className="font-sans text-[11px] text-brand-muted/50 hover:text-brand-muted transition-colors"
                >
                  No
                </button>
              </span>
            ) : (
              <button
                onClick={() => setConfirming(true)}
                title="Resetear estadísticas"
                className="w-6 h-6 flex items-center justify-center rounded-full text-brand-muted/40 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {top.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-serif text-3xl text-brand-espresso/10 mb-2">0</p>
            <p className="font-sans text-sm text-brand-muted/50">Aún no hay vistas registradas.</p>
            <p className="font-sans text-xs text-brand-muted/35 mt-1">Se registran cuando los clientes abren un producto en la carta.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {top.map((p, i) => {
              const v = stats[p.id] ?? 0;
              const share = totalViews > 0 ? Math.round((v / totalViews) * 100) : 0;
              const cat = categories.find(c => c.id === p.categoryId);
              const barColor = i === 0 ? "#B8722A" : i === 1 ? "#C8894A" : "#D4A070";
              return (
                <div
                  key={p.id}
                  ref={el => { itemRefs.current[p.id] = el; }}
                  className="flex items-center gap-3"
                >
                  <span className="font-sans text-[11px] text-brand-muted/35 w-5 text-right flex-none">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-sans text-sm font-medium text-brand-espresso truncate">
                        {cat && <span className="mr-1.5">{cat.emoji}</span>}{p.name}
                      </span>
                      <div className="flex items-center gap-2 flex-none ml-3">
                        <span className="font-sans text-[11px] text-brand-muted/40">{share}%</span>
                        <span
                          ref={el => { numberRefs.current[p.id] = el; }}
                          className="font-sans text-xs font-semibold text-brand-espresso tabular-nums inline-block"
                        >
                          {v} {v === 1 ? "vista" : "vistas"}
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-brand-stone/60 rounded-full overflow-hidden">
                      <div
                        ref={el => { barRefs.current[p.id] = el; }}
                        className="h-full rounded-full"
                        style={{ background: barColor }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [myRole, setMyRole] = useState<Role | null>(null);
  const visibleTabs = TABS.filter((t) => myRole === "admin" || !t.adminOnly);
  const [tab, setTab] = useState<Tab>("orders");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Record<number, number>>({});
  const [tableCalls, setTableCalls] = useState<TableCall[]>([]);
  const [loading, setLoading] = useState(true);

  const [productModal, setProductModal] = useState<"add" | "edit" | null>(null);
  const [productForm, setProductForm] = useState<ProductForm>(EMPTY_PRODUCT);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [productSaving, setProductSaving] = useState(false);
  const [productError, setProductError] = useState("");
  const [translating, setTranslating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [adminMenuType, setAdminMenuType] = useState<"food" | "drinks">("food");

  const [categoryModal, setCategoryModal] = useState<"add" | "edit" | null>(null);
  const [categoryForm, setCategoryForm] = useState<CategoryForm>(EMPTY_CATEGORY);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [categorySaving, setCategorySaving] = useState(false);

  // URL del QR: siempre el dominio real de la web, nunca editable
  // (un campo editable aquí llevó a que se cambiara sin querer y hubiera que reimprimir los QR físicos)
  const [qrUrl, setQrUrl] = useState(
    typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"
  );
  const qrContainerRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [catRes, prodRes, statsRes, callsRes] = await Promise.all([
      fetch("/api/categories"),
      fetch("/api/products"),
      fetch("/api/stats"),
      fetch("/api/table-calls"),
    ]);
    if (catRes.ok) setCategories(await catRes.json());
    if (prodRes.ok) setProducts(await prodRes.json());
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (statsRes.ok) setStats(Object.fromEntries((await statsRes.json()).map((s: any) => [s.product_id, s.views])));
    if (callsRes.ok) setTableCalls(await callsRes.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    if (typeof window !== "undefined") setQrUrl(window.location.origin);
  }, [fetchData]);

  // Quién soy — determina qué pestañas puede ver (los empleados solo Pedidos).
  // Si la cuenta ha sido deshabilitada, /api/auth/me devuelve 401 y nos manda al login.
  useEffect(() => {
    fetch("/api/auth/me").then((r) => {
      if (!r.ok) { router.replace("/login"); return; }
      r.json().then((data) => setMyRole(data?.role === "admin" ? "admin" : "employee"));
    });
  }, [router]);

  // Red de seguridad: si un empleado quedara en una pestaña que ya no puede ver, vuelve a Pedidos
  useEffect(() => {
    if (myRole === "employee" && tab !== "orders") setTab("orders");
  }, [myRole, tab]);

  // Realtime propio (SSE): el endpoint /view emite el evento al instante
  useEffect(() => {
    const source = new EventSource("/api/events");
    source.addEventListener("view", (e) => {
      const payload = JSON.parse(e.data) as { productId: number; views: number };
      if (payload?.productId && payload?.views !== undefined) {
        setStats(prev => ({ ...prev, [payload.productId]: payload.views }));
      }
    });
    source.addEventListener("table_call", (e) => {
      const call = JSON.parse(e.data) as TableCall;
      setTableCalls(prev => [...prev, call]);
    });
    source.addEventListener("table_call_resolved", (e) => {
      const { id } = JSON.parse(e.data) as { id: number };
      setTableCalls(prev => prev.filter(c => c.id !== id));
    });
    return () => source.close();
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  /* Products CRUD */
  function openAddProduct() {
    const firstCat = categories.find((c) => c.menu === adminMenuType);
    setProductForm({ ...EMPTY_PRODUCT, categoryId: firstCat?.id?.toString() ?? "" });
    setEditingProductId(null);
    setProductError("");
    setProductModal("add");
  }
  function openEditProduct(p: Product) {
    setProductForm({
      name: p.name, description: p.description,
      name_en: p.name_en ?? "", description_en: p.description_en ?? "",
      name_fr: p.name_fr ?? "", description_fr: p.description_fr ?? "",
      price: p.price.toString(),
      categoryId: p.categoryId.toString(), imageUrl: p.imageUrl,
      available: p.available, order: p.order.toString(),
      allergens: p.allergens ?? [],
      name_ca: p.name_ca ?? "", description_ca: p.description_ca ?? "",
      badge: p.badge ?? "",
    });
    setEditingProductId(p.id);
    setProductError("");
    setProductModal("edit");
  }
  async function saveProduct() {
    if (!productForm.name || !productForm.price || !productForm.categoryId) {
      setProductError("Nombre, precio y categoría son obligatorios");
      return;
    }
    setProductSaving(true);
    setProductError("");
    const body = {
      name: productForm.name, description: productForm.description,
      name_en: productForm.name_en || undefined,
      description_en: productForm.description_en || undefined,
      name_fr: productForm.name_fr || undefined,
      description_fr: productForm.description_fr || undefined,
      price: parseFloat(productForm.price), categoryId: parseInt(productForm.categoryId),
      imageUrl: productForm.imageUrl, available: productForm.available,
      order: parseInt(productForm.order) || 0,
      allergens: productForm.allergens,
      name_ca: productForm.name_ca || undefined,
      description_ca: productForm.description_ca || undefined,
      badge: productForm.badge || null,
    };
    const res = productModal === "add"
      ? await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      : await fetch(`/api/products/${editingProductId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) { setProductModal(null); fetchData(); }
    else { const d = await res.json(); setProductError(d.error || "Error al guardar"); }
    setProductSaving(false);
  }
  async function autoTranslate() {
    if (!productForm.name) {
      setProductError("Escribe el nombre antes de traducir");
      return;
    }
    setTranslating(true);
    setProductError("");
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: productForm.name, description: productForm.description }),
    });
    if (res.ok) {
      const t = await res.json();
      setProductForm((f) => ({
        ...f,
        name_en: t.name_en ?? f.name_en,
        description_en: t.description_en ?? f.description_en,
        name_fr: t.name_fr ?? f.name_fr,
        description_fr: t.description_fr ?? f.description_fr,
        name_ca: t.name_ca ?? f.name_ca,
        description_ca: t.description_ca ?? f.description_ca,
      }));
    } else {
      setProductError("Error al traducir. Inténtalo de nuevo.");
    }
    setTranslating(false);
  }

  async function uploadImage(blob: Blob) {
    setUploading(true);
    setProductError("");
    const fd = new FormData();
    fd.append("file", new File([blob], "crop.jpg", { type: "image/jpeg" }));
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      setProductForm((f) => ({ ...f, imageUrl: url }));
    } else {
      setProductError("Error al subir la imagen. Inténtalo de nuevo.");
    }
    setUploading(false);
  }

  async function handleCropConfirm(blob: Blob) {
    setCropFile(null);
    await uploadImage(blob);
  }

  async function deleteProduct(id: number) {
    if (!confirm("¿Eliminar este producto?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchData();
  }
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 5 } }),
  );

  async function handleProductDragEnd(event: DragEndEvent, catId: number) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const catProds = products.filter(p => p.categoryId === catId).sort((a, b) => a.order - b.order);
    const oldIdx = catProds.findIndex(p => p.id === Number(active.id));
    const newIdx = catProds.findIndex(p => p.id === Number(over.id));
    if (oldIdx === -1 || newIdx === -1) return;
    const reordered = arrayMove(catProds, oldIdx, newIdx);
    setProducts(prev => [...prev.filter(p => p.categoryId !== catId), ...reordered.map((p, i) => ({ ...p, order: i }))]);
    await Promise.all(reordered.map((p, i) =>
      fetch(`/api/products/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: p.name, description: p.description,
          name_en: p.name_en, description_en: p.description_en,
          name_fr: p.name_fr, description_fr: p.description_fr,
          name_ca: p.name_ca, description_ca: p.description_ca,
          price: p.price, categoryId: p.categoryId, imageUrl: p.imageUrl,
          available: p.available, order: i, allergens: p.allergens, badge: p.badge,
        }),
      })
    ));
    fetchData();
  }

  async function handleCategoryDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const sorted = [...categories].sort((a, b) => a.order - b.order);
    const oldIdx = sorted.findIndex(c => c.id === Number(active.id));
    const newIdx = sorted.findIndex(c => c.id === Number(over.id));
    if (oldIdx === -1 || newIdx === -1) return;
    const reordered = arrayMove(sorted, oldIdx, newIdx);
    setCategories(reordered.map((c, i) => ({ ...c, order: i })));
    await Promise.all(reordered.map((c, i) =>
      fetch(`/api/categories/${c.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: c.name, emoji: c.emoji, order: i, menu: c.menu }),
      })
    ));
    fetchData();
  }

  async function toggleAvailability(p: Product) {
    await fetch(`/api/products/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: !p.available }),
    });
    fetchData();
  }

  /* Categories CRUD */
  function openAddCategory() {
    setCategoryForm(EMPTY_CATEGORY);
    setEditingCategoryId(null);
    setCategoryModal("add");
  }
  function openEditCategory(c: Category) {
    setCategoryForm({ name: c.name, emoji: c.emoji, order: c.order.toString(), menu: c.menu });
    setEditingCategoryId(c.id);
    setCategoryModal("edit");
  }
  async function saveCategory() {
    if (!categoryForm.name) return;
    setCategorySaving(true);
    const body = { name: categoryForm.name, emoji: categoryForm.emoji || "🍽️", order: parseInt(categoryForm.order) || 0, menu: categoryForm.menu };
    const res = categoryModal === "add"
      ? await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      : await fetch(`/api/categories/${editingCategoryId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) { setCategoryModal(null); fetchData(); }
    setCategorySaving(false);
  }
  async function deleteCategory(id: number) {
    if (!confirm("¿Eliminar esta categoría y todos sus productos?")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    fetchData();
  }

  const productsByCategory = categories
    .filter((cat) => cat.menu === adminMenuType)
    .map((cat) => ({
      cat,
      items: products.filter((p) => p.categoryId === cat.id).sort((a, b) => a.order - b.order),
    }));

  /* Shared field styles */
  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-brand-stone bg-white text-brand-espresso placeholder-brand-muted/40 focus:outline-none focus:ring-2 focus:ring-brand-caramel/25 focus:border-brand-caramel text-sm font-sans";
  const labelCls = "block text-[11px] font-semibold text-brand-brown tracking-widest uppercase mb-1.5 font-sans";

  return (
    <div className="min-h-screen bg-brand-parchment">

      {/* ── TOP BAR ── */}
      <header className="sticky top-0 z-20 bg-white border-b border-brand-stone shadow-[0_1px_6px_rgba(28,13,4,0.06)]">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-serif text-xl font-semibold text-brand-espresso">Plenty.</span>
            <div className="hidden sm:block h-4 w-px bg-brand-stone" />
            <span className="hidden sm:block text-xs text-brand-muted font-sans">
              Panel de administración
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 text-xs text-brand-muted hover:text-brand-espresso font-sans"
            >
              Ver carta
              <IconExternalLink />
            </a>
            <button
              onClick={logout}
              className="text-xs font-sans bg-brand-parchment hover:bg-brand-stone/60 text-brand-brown border border-brand-stone px-3 py-1.5 rounded-lg"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* ── TAB BAR ── */}
      <div className="bg-white border-b border-brand-stone">
        <div className="max-w-3xl mx-auto px-4 flex">
          {visibleTabs.map(({ id, label, Icon }) => {
            const isOrders = id === "orders";
            const pending = tableCalls.length;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`relative flex items-center gap-2 px-5 py-3.5 text-sm font-sans font-medium border-b-2 transition-colors ${
                  tab === id
                    ? isOrders && pending > 0 ? "border-red-500 text-red-600" : "border-brand-caramel text-brand-caramel"
                    : isOrders && pending > 0 ? "border-transparent text-red-500" : "border-transparent text-brand-muted hover:text-brand-espresso"
                }`}
              >
                <Icon />
                <span className="hidden xs:inline sm:inline">{label}</span>
                {isOrders && pending > 0 && (
                  <span className="min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold animate-pulse">
                    {pending}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-7">

        {/* ── ORDERS TAB ── */}
        {tab === "orders" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl font-semibold text-brand-espresso">Pedidos</h2>
              <span className="inline-flex items-center gap-1.5 font-sans text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                En vivo
              </span>
            </div>
            <OrdersTab calls={tableCalls} />
          </div>
        )}

        {/* ── PRODUCTS TAB ── */}
        {tab === "products" && (
          <div>
            {/* Carta / Bebidas switcher */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {([["food", "🍽️", "Carta"] as const, ["drinks", "☕", "Bebidas"] as const]).map(([type, icon, label]) => (
                <button
                  key={type}
                  onClick={() => setAdminMenuType(type)}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-sans font-semibold transition-all border ${
                    adminMenuType === type
                      ? "bg-brand-espresso text-brand-cream border-brand-espresso"
                      : "border-brand-stone text-brand-muted hover:text-brand-espresso hover:border-brand-caramel/50"
                  }`}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl font-semibold text-brand-espresso">
                {adminMenuType === "food" ? "Carta" : "Bebidas"}
              </h2>
              <button
                onClick={openAddProduct}
                className="flex items-center gap-1.5 bg-brand-caramel hover:bg-brand-brown text-white px-4 py-2 rounded-xl text-sm font-sans font-medium"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Añadir producto
              </button>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-16 bg-brand-stone/40 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                {productsByCategory.map(({ cat, items }) => (
                  <div key={cat.id}>
                    {/* Category label */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-base leading-none">{cat.emoji}</span>
                      <span className="font-sans text-[11px] font-bold text-brand-muted tracking-widest uppercase">
                        {cat.name}
                      </span>
                      <span className="font-sans text-xs text-brand-stone font-normal">
                        ({items.length})
                      </span>
                    </div>

                    {items.length === 0 ? (
                      <p className="font-sans text-sm text-brand-muted/40 italic pl-2">
                        Sin productos en esta categoría
                      </p>
                    ) : (
                      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleProductDragEnd(e, cat.id)}>
                        <SortableContext items={items.map(p => p.id)} strategy={verticalListSortingStrategy}>
                          <div className="space-y-2">
                            {items.map((p) => (
                              <SortableProductRow
                                key={p.id}
                                product={p}
                                views={stats[p.id] ?? 0}
                                onToggle={toggleAvailability}
                                onEdit={openEditProduct}
                                onDelete={deleteProduct}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    )}
                  </div>
                ))}

                {products.length === 0 && (
                  <div className="text-center py-24">
                    <p className="font-serif text-2xl text-brand-espresso/20 font-light mb-3">
                      Plenty.
                    </p>
                    <p className="font-sans text-sm text-brand-muted mb-4">
                      Todavía no hay productos en la carta
                    </p>
                    <button
                      onClick={openAddProduct}
                      className="font-sans text-sm text-brand-caramel hover:text-brand-brown hover:underline"
                    >
                      Añadir el primero
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── CATEGORIES TAB ── */}
        {tab === "categories" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl font-semibold text-brand-espresso">Categorías</h2>
              <button
                onClick={openAddCategory}
                className="flex items-center gap-1.5 bg-brand-caramel hover:bg-brand-brown text-white px-4 py-2 rounded-xl text-sm font-sans font-medium"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Añadir categoría
              </button>
            </div>

            {categories.length === 0 ? (
              <p className="text-center font-sans text-sm text-brand-muted py-16">
                Ninguna categoría creada todavía
              </p>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCategoryDragEnd}>
                <SortableContext
                  items={[...categories].sort((a, b) => a.order - b.order).map(c => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {[...categories].sort((a, b) => a.order - b.order).map((cat) => (
                      <SortableCategoryRow
                        key={cat.id}
                        category={cat}
                        count={products.filter(p => p.categoryId === cat.id).length}
                        onEdit={openEditCategory}
                        onDelete={deleteCategory}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        )}

        {/* ── ANALYTICS TAB ── */}
        {tab === "analytics" && (
          <AnalyticsTab stats={stats} products={products} categories={categories} onReset={() => setStats({})} />
        )}

        {/* ── QR TAB ── */}
        {tab === "qr" && (
          <div className="max-w-sm mx-auto">
            <div className="text-center mb-6">
              <h2 className="font-serif text-xl font-semibold text-brand-espresso mb-1">
                Código QR
              </h2>
              <p className="font-sans text-sm text-brand-muted">
                Los clientes escanean este código para ver la carta
              </p>
            </div>

            {/* QR Card */}
            <div className="bg-brand-espresso rounded-2xl p-7 flex flex-col items-center shadow-elevated">
              <div ref={qrContainerRef} className="bg-white rounded-xl p-4">
                <QRCodeSVG
                  value={qrUrl}
                  size={196}
                  fgColor="#1C0D04"
                  bgColor="#FFFFFF"
                  level="M"
                  includeMargin={false}
                />
              </div>
              <p className="mt-5 font-serif font-light text-2xl text-brand-cream tracking-tight">
                Plenty.
              </p>
              <p className="font-sans text-brand-honey/40 text-[10px] mt-1 tracking-[0.32em] uppercase">
                Escanea para ver la carta
              </p>
            </div>

            {/* URL — solo lectura a propósito: es el mismo QR ya impreso en las mesas */}
            <div className="mt-6">
              <label className={labelCls}>URL de la carta</label>
              <div className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl border border-brand-stone bg-brand-parchment/60 text-brand-muted text-sm font-sans">
                <svg className="w-3.5 h-3.5 flex-none text-brand-muted/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="5" y="11" width="14" height="10" rx="2" strokeWidth={1.75} />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 11V7a4 4 0 018 0v4" />
                </svg>
                <span className="truncate">{qrUrl}</span>
              </div>
              <p className="font-sans text-xs text-brand-muted mt-2">
                Bloqueado a propósito: este es el mismo código que ya tienes impreso en las mesas. No se puede editar para evitar cambiarlo por error.
              </p>
            </div>

            {/* Actions */}
            <div className="mt-5 flex gap-3">
              <a
                href="/"
                target="_blank"
                className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-brand-stone text-brand-espresso py-2.5 rounded-xl text-sm font-sans font-medium hover:bg-brand-parchment text-center"
              >
                Ver carta
                <IconExternalLink />
              </a>
              <button
                onClick={() => {
                  const svg = qrContainerRef.current?.querySelector("svg");
                  if (!svg) return;
                  const data = new XMLSerializer().serializeToString(svg);
                  const blob = new Blob([data], { type: "image/svg+xml" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "plenty-qr.svg";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex-1 bg-brand-caramel hover:bg-brand-brown text-white py-2.5 rounded-xl text-sm font-sans font-medium"
              >
                Descargar QR
              </button>
            </div>
          </div>
        )}

        {/* ── USERS TAB ── */}
        {tab === "users" && <UsersTab />}
      </div>

      {/* ── PRODUCT MODAL ── */}
      {productModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-brand-espresso/50 backdrop-blur-sm px-0 sm:px-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[92vh] overflow-hidden flex flex-col shadow-elevated"><div className="overflow-y-auto flex-1">
            <div className="px-6 py-5 border-b border-brand-stone flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold text-brand-espresso">
                {productModal === "add" ? "Nuevo producto" : "Editar producto"}
              </h3>
              <button
                onClick={() => setProductModal(null)}
                className="p-1.5 rounded-lg text-brand-muted hover:text-brand-espresso hover:bg-brand-parchment"
                aria-label="Cerrar"
              >
                <IconCross />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className={labelCls}>Nombre <span className="text-brand-caramel">*</span></label>
                <input type="text" value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className={inputCls} placeholder="Tostada con aguacate" />
              </div>
              <div>
                <label className={labelCls}>Descripción</label>
                <textarea value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  rows={2} className={`${inputCls} resize-none`} placeholder="Descripción del producto..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Precio (€) <span className="text-brand-caramel">*</span></label>
                  <input type="number" value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    step="0.5" min="0" className={inputCls} placeholder="9.50" />
                </div>
                <div>
                  <label className={labelCls}>Categoría <span className="text-brand-caramel">*</span></label>
                  <select value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className={inputCls}>
                    <option value="">Selecciona</option>
                    {categories.filter((c) => c.menu === adminMenuType).map((c) => (
                      <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>Imagen (opcional)</label>
                <div className="flex gap-2">
                  <input type="url" value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    className={`${inputCls} flex-1`} placeholder="https://... o sube una foto" />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex-none flex items-center gap-1.5 px-3 py-2 rounded-xl border border-brand-stone text-brand-muted text-sm font-sans hover:border-brand-caramel/50 hover:text-brand-espresso transition-all disabled:opacity-50"
                  >
                    {uploading ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                    <span>{uploading ? "Subiendo..." : "Subir"}</span>
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) setCropFile(f); e.target.value = ""; }}
                />
                {productForm.imageUrl && (
                  <div className="relative mt-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={productForm.imageUrl} alt="preview" className="h-24 w-full object-cover rounded-xl border border-brand-stone" />
                    <button
                      type="button"
                      onClick={() => setProductForm((f) => ({ ...f, imageUrl: "" }))}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                      title="Eliminar imagen"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Traducciones */}
              <div className="border border-brand-stone rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-brand-parchment">
                  <span className="font-sans text-[11px] font-bold text-brand-muted tracking-widest uppercase">
                    Traducciones
                  </span>
                  <button
                    type="button"
                    onClick={autoTranslate}
                    disabled={translating || !productForm.name}
                    className="flex items-center gap-1.5 text-xs font-sans font-medium bg-brand-caramel hover:bg-brand-brown disabled:opacity-40 text-white px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {translating ? (
                      <>
                        <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Traduciendo...
                      </>
                    ) : (
                      <>✨ Auto-traducir</>
                    )}
                  </button>
                </div>
                <div className="px-4 pb-4 pt-3 space-y-3">
                  <div>
                    <label className={labelCls}>🇬🇧 Nombre EN</label>
                    <input type="text" value={productForm.name_en}
                      onChange={(e) => setProductForm({ ...productForm, name_en: e.target.value })}
                      className={inputCls} placeholder="Avocado toast" />
                  </div>
                  <div>
                    <label className={labelCls}>🇫🇷 Nombre FR</label>
                    <input type="text" value={productForm.name_fr}
                      onChange={(e) => setProductForm({ ...productForm, name_fr: e.target.value })}
                      className={inputCls} placeholder="Toast à l'avocat" />
                  </div>
                  <div>
                    <label className={labelCls}>🏴 Nombre CA</label>
                    <input type="text" value={productForm.name_ca}
                      onChange={(e) => setProductForm({ ...productForm, name_ca: e.target.value })}
                      className={inputCls} placeholder="Toast d'alvocat" />
                  </div>
                  <div>
                    <label className={labelCls}>🇬🇧 Descripción EN</label>
                    <textarea value={productForm.description_en}
                      onChange={(e) => setProductForm({ ...productForm, description_en: e.target.value })}
                      rows={2} className={`${inputCls} resize-none`} placeholder="English description..." />
                  </div>
                  <div>
                    <label className={labelCls}>🇫🇷 Descripción FR</label>
                    <textarea value={productForm.description_fr}
                      onChange={(e) => setProductForm({ ...productForm, description_fr: e.target.value })}
                      rows={2} className={`${inputCls} resize-none`} placeholder="Description en français..." />
                  </div>
                  <div>
                    <label className={labelCls}>🏴 Descripción CA</label>
                    <textarea value={productForm.description_ca}
                      onChange={(e) => setProductForm({ ...productForm, description_ca: e.target.value })}
                      rows={2} className={`${inputCls} resize-none`} placeholder="Descripció en català..." />
                  </div>
                </div>
              </div>

              {/* Badge */}
              <div>
                <label className={labelCls}>Badge destacado</label>
                <div className="flex flex-wrap gap-2">
                  {["", "Especial del día", "Nuevo", "Temporada", "Recomendado"].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setProductForm((f) => ({ ...f, badge: b }))}
                      className={`text-xs font-sans px-3 py-1.5 rounded-full border transition-all ${
                        productForm.badge === b
                          ? "bg-brand-caramel/15 border-brand-caramel text-brand-brown font-semibold"
                          : "bg-white border-brand-stone text-brand-muted hover:border-brand-caramel/50"
                      }`}
                    >
                      {b === "" ? "Sin badge" : b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Alérgenos */}
              <div>
                <label className={labelCls}>Alérgenos</label>
                <div className="flex flex-wrap gap-1.5">
                  {ALLERGENS.map((a) => {
                    const active = productForm.allergens.includes(a.id);
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() =>
                          setProductForm((f) => ({
                            ...f,
                            allergens: active
                              ? f.allergens.filter((x) => x !== a.id)
                              : [...f.allergens, a.id],
                          }))
                        }
                        className={`flex items-center gap-1 text-xs font-sans px-2.5 py-1 rounded-full border transition-all ${
                          active
                            ? "bg-brand-caramel/15 border-brand-caramel text-brand-brown"
                            : "bg-white border-brand-stone text-brand-muted hover:border-brand-caramel/50"
                        }`}
                      >
                        <span>{a.icon}</span>
                        <span>{a.label.es}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toggle */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div className="relative">
                  <input type="checkbox" checked={productForm.available}
                    onChange={(e) => setProductForm({ ...productForm, available: e.target.checked })}
                    className="sr-only peer" />
                  <div className="w-10 h-6 bg-brand-stone rounded-full peer peer-checked:bg-brand-caramel after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-4" />
                </div>
                <span className="font-sans text-sm font-medium text-brand-espresso">Disponible en carta</span>
              </label>

              {productError && (
                <div className="bg-red-50 border border-red-200 text-red-700 font-sans text-sm px-4 py-3 rounded-xl">
                  {productError}
                </div>
              )}
            </div>

          </div>
          <div className="px-6 pb-6 pt-4 flex gap-3 border-t border-brand-stone">
              <button onClick={() => setProductModal(null)}
                className="flex-1 border border-brand-stone text-brand-muted font-sans py-2.5 rounded-xl text-sm font-medium hover:bg-brand-parchment">
                Cancelar
              </button>
              <button onClick={saveProduct} disabled={productSaving}
                className="flex-1 bg-brand-caramel hover:bg-brand-brown text-white font-sans py-2.5 rounded-xl text-sm font-medium disabled:opacity-50">
                {productSaving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── IMAGE CROP MODAL ── */}
      {cropFile && (
        <ImageCropModal
          file={cropFile}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropFile(null)}
        />
      )}

      {/* ── CATEGORY MODAL ── */}
      {categoryModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-brand-espresso/50 backdrop-blur-sm px-0 sm:px-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-elevated">
            <div className="px-6 py-5 border-b border-brand-stone flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold text-brand-espresso">
                {categoryModal === "add" ? "Nueva categoría" : "Editar categoría"}
              </h3>
              <button
                onClick={() => setCategoryModal(null)}
                className="p-1.5 rounded-lg text-brand-muted hover:text-brand-espresso hover:bg-brand-parchment"
                aria-label="Cerrar"
              >
                <IconCross />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {([["food", "🍽️ Carta"], ["drinks", "☕ Bebidas"]] as const).map(([val, lbl]) => (
                  <button key={val} type="button"
                    onClick={() => setCategoryForm({ ...categoryForm, menu: val })}
                    className={`py-2 rounded-xl text-sm font-sans font-medium transition-all border ${
                      categoryForm.menu === val
                        ? "bg-brand-espresso text-brand-cream border-brand-espresso"
                        : "border-brand-stone text-brand-muted hover:text-brand-espresso"
                    }`}>
                    {lbl}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className={labelCls}>Emoji</label>
                  <input type="text" value={categoryForm.emoji}
                    onChange={(e) => setCategoryForm({ ...categoryForm, emoji: e.target.value.slice(0, 2) })}
                    className={`${inputCls} text-center text-xl`} placeholder="🍽️" maxLength={2} />
                </div>
                <div className="col-span-3">
                  <label className={labelCls}>Nombre <span className="text-brand-caramel">*</span></label>
                  <input type="text" value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    className={inputCls} placeholder="Desayunos" />
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setCategoryModal(null)}
                className="flex-1 border border-brand-stone text-brand-muted font-sans py-2.5 rounded-xl text-sm font-medium hover:bg-brand-parchment">
                Cancelar
              </button>
              <button onClick={saveCategory} disabled={categorySaving}
                className="flex-1 bg-brand-caramel hover:bg-brand-brown text-white font-sans py-2.5 rounded-xl text-sm font-medium disabled:opacity-50">
                {categorySaving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
