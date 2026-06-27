"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Category, Product } from "@/lib/storage";
import { Lang, LANGS, catName, ui } from "@/lib/i18n";
import { ProductCard } from "./ProductCard";
import { supabaseClient } from "@/lib/supabase-client";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  categories: Category[];
  products: Product[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToProduct(row: any): Product {
  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    description: row.description,
    name_en: row.name_en ?? undefined,
    description_en: row.description_en ?? undefined,
    name_fr: row.name_fr ?? undefined,
    description_fr: row.description_fr ?? undefined,
    price: Number(row.price),
    imageUrl: row.image_url,
    available: row.available,
    order: row.order,
    allergens: Array.isArray(row.allergens) ? row.allergens : [],
  };
}

const INSTAGRAM_URL = "https://www.instagram.com/plenty.brunch/";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToCategory(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    name_en: row.name_en ?? undefined,
    name_fr: row.name_fr ?? undefined,
    emoji: row.emoji,
    order: row.order,
    menu: row.menu ?? "food",
  };
}

export function MenuClient({ categories: initialCategories, products: initialProducts }: Props) {
  const [menuType, setMenuType] = useState<"food" | "drinks">("food");
  const [activeId, setActiveId] = useState<number | null>(null);
  const [lang, setLang] = useState<Lang>("es");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  // Supabase Realtime — sincronización completa en tiempo real
  useEffect(() => {
    const channel = supabaseClient
      .channel("menu-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "products" }, ({ new: row }) => {
        setProducts((prev) => [...prev, rowToProduct(row)].sort((a, b) => a.order - b.order));
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "products" }, ({ new: row }) => {
        setProducts((prev) => prev.map((p) => p.id === row.id ? rowToProduct(row) : p));
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "products" }, ({ old: row }) => {
        setProducts((prev) => prev.filter((p) => p.id !== row.id));
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "categories" }, ({ new: row }) => {
        setCategories((prev) => [...prev, rowToCategory(row)].sort((a, b) => a.order - b.order));
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "categories" }, ({ new: row }) => {
        setCategories((prev) => prev.map((c) => c.id === row.id ? rowToCategory(row) : c));
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "categories" }, ({ old: row }) => {
        setCategories((prev) => prev.filter((c) => c.id !== row.id));
      })
      .subscribe();

    return () => { supabaseClient.removeChannel(channel); };
  }, []);
  const pillsRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("plenty-lang") as Lang | null;
    if (saved && ["es", "en", "fr"].includes(saved)) setLang(saved);
  }, []);

  const changeLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem("plenty-lang", l);
  };

  const allProductsByCategory = (catId: number) =>
    products.filter((p) => p.categoryId === catId);

  const visibleCategories = categories.filter(
    (c) => c.menu === menuType && allProductsByCategory(c.id).length > 0
  );

  const categoryIds = visibleCategories.map((c) => c.id).join(",");

  // Reset active pill when switching between food / drinks
  useEffect(() => {
    setActiveId(visibleCategories[0]?.id ?? null);
  }, [menuType]); // eslint-disable-line

  // IntersectionObserver: highlight active category pill while scrolling
  useEffect(() => {
    const sections = visibleCategories.map((c) =>
      document.getElementById(`cat-${c.id}`)
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number(entry.target.id.replace("cat-", ""));
            setActiveId(id);
            const pill = pillsRef.current?.querySelector(`[data-cat="${id}"]`);
            pill?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
          }
        });
      },
      { rootMargin: "-25% 0px -65% 0px" }
    );
    sections.forEach((s) => s && observer.observe(s));
    return () => observer.disconnect();
  }, [categoryIds]); // eslint-disable-line

  // Hero entrance animation — runs once on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power2.out" } })
        .from(".hero-location", { autoAlpha: 0, y: 10, duration: 0.7 })
        .from(".hero-title",    { autoAlpha: 0, y: 20, duration: 0.9 }, "-=0.4")
        .from(".hero-divider",  { autoAlpha: 0, scaleX: 0, duration: 0.5, transformOrigin: "center center" }, "-=0.35")
        .from(".hero-subtitle", { autoAlpha: 0, y: 8,  duration: 0.6 }, "-=0.2");
    }, heroRef);
    return () => ctx.revert();
  }, []);

  // Scroll-triggered animations — re-runs when visible menu content changes
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Category headings slide in from left
      gsap.utils.toArray<HTMLElement>(".cat-heading").forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          x: -14,
          duration: 0.55,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      // Product cards fade up in batches
      gsap.set(".product-card", { autoAlpha: 0, y: 18 });
      ScrollTrigger.batch(".product-card", {
        onEnter: (elements) => {
          gsap.to(elements, {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.07,
            overwrite: true,
          });
        },
        start: "top 92%",
        once: true,
      });
    }, mainRef);
    return () => ctx.revert();
  }, [categoryIds]); // eslint-disable-line

  const scrollToCategory = (id: number) => {
    setActiveId(id);
    document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: "smooth" });
  };

  const switchMenu = (type: "food" | "drinks") => {
    if (type === menuType) return;
    setMenuType(type);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const menuTabs: { type: "food" | "drinks"; icon: string }[] = [
    { type: "food", icon: "🍽️" },
    { type: "drinks", icon: "☕" },
  ];

  return (
    <div className="min-h-dvh bg-brand-parchment">

      {/* ── HERO ── */}
      <header ref={heroRef} className="relative grain overflow-hidden bg-brand-espresso">
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30"
          aria-hidden="true"
        />

        {/* Social links — top left */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <svg className="w-4 h-4 text-brand-honey/70" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
        </div>

        {/* Language switcher — top right */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {LANGS.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => changeLang(code)}
              title={label}
              className={`font-sans text-[11px] font-semibold tracking-widest uppercase transition-all ${
                lang === code
                  ? "text-brand-honey"
                  : "text-brand-honey/30 hover:text-brand-honey/60"
              }`}
            >
              {code}
            </button>
          ))}
        </div>

        <div className="relative z-10 max-w-lg mx-auto px-6 pt-16 pb-14 text-center">

          <p className="hero-location font-sans text-[10px] font-medium tracking-[0.45em] uppercase text-brand-honey/40 mb-8">
            Platja d&apos;Aro &middot; Costa Brava
          </p>

          <h1 className="hero-title font-serif font-light text-[76px] sm:text-[92px] leading-none tracking-[-0.02em] text-brand-cream">
            Plenty.
          </h1>

          <div className="hero-divider mt-7 mb-5 flex items-center justify-center gap-3 max-w-[160px] mx-auto">
            <div className="flex-1 h-px bg-brand-caramel/25" />
            <div className="w-1 h-1 rounded-full bg-brand-caramel/50" />
            <div className="flex-1 h-px bg-brand-caramel/25" />
          </div>

          <p className="hero-subtitle font-sans text-[11px] font-medium tracking-[0.38em] uppercase text-brand-honey/45">
            {ui[lang].brunchCafe}
          </p>
        </div>
      </header>

      {/* ── STICKY NAV ── */}
      <div className="sticky top-0 z-20 bg-brand-parchment/95 backdrop-blur-md border-b border-brand-stone shadow-[0_1px_8px_rgba(28,13,4,0.07)]">

        {/* Menu type switcher */}
        <div className="max-w-2xl mx-auto px-4 pt-3 pb-2 grid grid-cols-2 gap-2">
          {menuTabs.map(({ type, icon }) => (
            <button
              key={type}
              onClick={() => switchMenu(type)}
              className={`flex items-center justify-center gap-2 py-2 rounded-full text-[11px] font-semibold tracking-[0.18em] uppercase font-sans transition-all ${
                menuType === type
                  ? "bg-brand-espresso text-brand-cream"
                  : "border border-brand-stone text-brand-muted hover:text-brand-espresso hover:border-brand-caramel/50"
              }`}
            >
              <span>{icon}</span>
              <span>{ui[lang][type]}</span>
            </button>
          ))}
        </div>

        {/* Category pills */}
        {visibleCategories.length > 0 && (
          <div className="relative max-w-2xl mx-auto">
            <div
              className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-brand-parchment/95 to-transparent pointer-events-none z-10"
              aria-hidden="true"
            />
            <div
              ref={pillsRef}
              className="flex gap-2 overflow-x-auto no-scrollbar pl-4 pr-10 py-2.5"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {visibleCategories.map((cat) => (
                <button
                  key={cat.id}
                  data-cat={cat.id}
                  onClick={() => scrollToCategory(cat.id)}
                  className={`flex-none px-4 min-h-[44px] rounded-full text-sm font-sans font-medium whitespace-nowrap transition-all ${
                    activeId === cat.id
                      ? "bg-brand-espresso text-brand-cream shadow-sm"
                      : "bg-white text-brand-muted border border-brand-stone hover:border-brand-caramel/50 hover:text-brand-brown"
                  }`}
                >
                  {catName(cat, lang)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── MENU CONTENT ── */}
      <main ref={mainRef} className="max-w-2xl mx-auto px-4 py-10 space-y-14">
        {visibleCategories.map((cat) => {
          const catProducts = allProductsByCategory(cat.id);
          if (catProducts.length === 0) return null;
          return (
            <section key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-28">

              <div className="cat-heading flex items-center gap-3 mb-6">
                <span className="text-lg leading-none" aria-hidden="true">
                  {cat.emoji}
                </span>
                <h2 className="font-serif text-2xl font-semibold text-brand-espresso tracking-wide">
                  {catName(cat, lang)}
                </h2>
                <div className="flex-1 h-px bg-brand-stone" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {catProducts.map((product) => (
                  <ProductCard key={product.id} product={product} lang={lang} />
                ))}
              </div>
            </section>
          );
        })}

        {visibleCategories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="font-serif font-light text-4xl text-brand-espresso/15 mb-3">
              Plenty.
            </p>
            <p className="font-sans text-sm text-brand-muted/50">
              {ui[lang].empty}
            </p>
          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer className="relative grain overflow-hidden bg-brand-espresso mt-16">
        <div className="relative z-10 max-w-2xl mx-auto px-6 py-12 text-center">
          <p className="font-serif font-light text-[32px] leading-none text-brand-cream tracking-tight">
            Plenty.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-brand-caramel/20" />
            <p className="font-sans text-[10px] tracking-[0.32em] uppercase text-brand-honey/35">
              {ui[lang].brunchCafe} &middot; Platja d&apos;Aro
            </p>
            <div className="h-px w-8 bg-brand-caramel/20" />
          </div>
        </div>
      </footer>
    </div>
  );
}
