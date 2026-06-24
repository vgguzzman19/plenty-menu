"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Category, Product } from "@/lib/storage";

type Tab = "products" | "categories" | "qr";

interface ProductForm {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  imageUrl: string;
  available: boolean;
  order: string;
}

interface CategoryForm {
  name: string;
  emoji: string;
  order: string;
}

const EMPTY_PRODUCT: ProductForm = {
  name: "", description: "", price: "", categoryId: "",
  imageUrl: "", available: true, order: "0",
};
const EMPTY_CATEGORY: CategoryForm = { name: "", emoji: "", order: "0" };

/* ── Inline SVG icons ── */
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

const TABS: { id: Tab; label: string; Icon: () => JSX.Element }[] = [
  { id: "products",    label: "Carta",       Icon: IconMenu },
  { id: "categories", label: "Categorías",   Icon: IconGrid },
  { id: "qr",         label: "Código QR",    Icon: IconQr },
];

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("products");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [productModal, setProductModal] = useState<"add" | "edit" | null>(null);
  const [productForm, setProductForm] = useState<ProductForm>(EMPTY_PRODUCT);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [productSaving, setProductSaving] = useState(false);
  const [productError, setProductError] = useState("");

  const [categoryModal, setCategoryModal] = useState<"add" | "edit" | null>(null);
  const [categoryForm, setCategoryForm] = useState<CategoryForm>(EMPTY_CATEGORY);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [categorySaving, setCategorySaving] = useState(false);

  const [qrUrl, setQrUrl] = useState(
    typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [catRes, prodRes] = await Promise.all([
      fetch("/api/categories"),
      fetch("/api/products"),
    ]);
    if (catRes.ok) setCategories(await catRes.json());
    if (prodRes.ok) setProducts(await prodRes.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    if (typeof window !== "undefined") setQrUrl(window.location.origin);
  }, [fetchData]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  /* Products CRUD */
  function openAddProduct() {
    setProductForm({ ...EMPTY_PRODUCT, categoryId: categories[0]?.id?.toString() ?? "" });
    setEditingProductId(null);
    setProductError("");
    setProductModal("add");
  }
  function openEditProduct(p: Product) {
    setProductForm({
      name: p.name, description: p.description, price: p.price.toString(),
      categoryId: p.categoryId.toString(), imageUrl: p.imageUrl,
      available: p.available, order: p.order.toString(),
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
      price: parseFloat(productForm.price), categoryId: parseInt(productForm.categoryId),
      imageUrl: productForm.imageUrl, available: productForm.available,
      order: parseInt(productForm.order) || 0,
    };
    const res = productModal === "add"
      ? await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      : await fetch(`/api/products/${editingProductId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) { setProductModal(null); fetchData(); }
    else { const d = await res.json(); setProductError(d.error || "Error al guardar"); }
    setProductSaving(false);
  }
  async function deleteProduct(id: number) {
    if (!confirm("¿Eliminar este producto?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
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
    setCategoryForm({ name: c.name, emoji: c.emoji, order: c.order.toString() });
    setEditingCategoryId(c.id);
    setCategoryModal("edit");
  }
  async function saveCategory() {
    if (!categoryForm.name) return;
    setCategorySaving(true);
    const body = { name: categoryForm.name, emoji: categoryForm.emoji || "🍽️", order: parseInt(categoryForm.order) || 0 };
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

  const productsByCategory = categories.map((cat) => ({
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
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-sans font-medium border-b-2 transition-colors ${
                tab === id
                  ? "border-brand-caramel text-brand-caramel"
                  : "border-transparent text-brand-muted hover:text-brand-espresso"
              }`}
            >
              <Icon />
              <span className="hidden xs:inline sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-7">

        {/* ── PRODUCTS TAB ── */}
        {tab === "products" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl font-semibold text-brand-espresso">Carta</h2>
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
                      <div className="space-y-2">
                        {items.map((p) => (
                          <div
                            key={p.id}
                            className={`bg-white rounded-xl border border-brand-stone hover:border-brand-caramel/40 px-4 py-3.5 flex items-center gap-3 transition-colors ${
                              !p.available ? "opacity-55" : ""
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-sans font-medium text-brand-espresso text-sm truncate">
                                  {p.name}
                                </span>
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

                            <div className="flex items-center gap-0.5 flex-none">
                              {/* Toggle availability */}
                              <button
                                onClick={() => toggleAvailability(p)}
                                title={p.available ? "Ocultar de carta" : "Mostrar en carta"}
                                className={`p-2 rounded-lg transition-colors ${
                                  p.available
                                    ? "text-emerald-500 hover:bg-emerald-50"
                                    : "text-brand-muted hover:bg-brand-parchment"
                                }`}
                              >
                                {p.available ? <IconCheck /> : <IconCross />}
                              </button>
                              <button
                                onClick={() => openEditProduct(p)}
                                className="p-2 rounded-lg text-brand-muted hover:text-brand-espresso hover:bg-brand-parchment"
                                title="Editar"
                              >
                                <IconEdit />
                              </button>
                              <button
                                onClick={() => deleteProduct(p.id)}
                                className="p-2 rounded-lg text-brand-muted hover:text-red-500 hover:bg-red-50"
                                title="Eliminar"
                              >
                                <IconTrash />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
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

            <div className="space-y-2">
              {[...categories].sort((a, b) => a.order - b.order).map((cat) => {
                const count = products.filter((p) => p.categoryId === cat.id).length;
                return (
                  <div
                    key={cat.id}
                    className="bg-white rounded-xl border border-brand-stone px-4 py-4 flex items-center gap-3"
                  >
                    <span className="text-2xl leading-none w-8 text-center flex-none">
                      {cat.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans font-medium text-brand-espresso">{cat.name}</p>
                      <p className="font-sans text-xs text-brand-muted mt-0.5">
                        {count} producto{count !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex gap-0.5">
                      <button
                        onClick={() => openEditCategory(cat)}
                        className="p-2 rounded-lg text-brand-muted hover:text-brand-espresso hover:bg-brand-parchment"
                        title="Editar"
                      >
                        <IconEdit />
                      </button>
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="p-2 rounded-lg text-brand-muted hover:text-red-500 hover:bg-red-50"
                        title="Eliminar"
                      >
                        <IconTrash />
                      </button>
                    </div>
                  </div>
                );
              })}

              {categories.length === 0 && (
                <p className="text-center font-sans text-sm text-brand-muted py-16">
                  Ninguna categoría creada todavía
                </p>
              )}
            </div>
          </div>
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
              <div className="bg-white rounded-xl p-4">
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

            {/* URL input */}
            <div className="mt-6">
              <label className={labelCls}>URL de la carta</label>
              <input
                type="text"
                value={qrUrl}
                onChange={(e) => setQrUrl(e.target.value)}
                className={inputCls}
              />
              <p className="font-sans text-xs text-brand-muted mt-2">
                Actualiza con tu dominio cuando publiques la web.
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
                  const svg = document.querySelector("svg");
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
      </div>

      {/* ── PRODUCT MODAL ── */}
      {productModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-brand-espresso/50 backdrop-blur-sm px-0 sm:px-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto shadow-elevated">
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
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>URL de imagen (opcional)</label>
                <input type="url" value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  className={inputCls} placeholder="https://..." />
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

            <div className="px-6 pb-6 flex gap-3">
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
