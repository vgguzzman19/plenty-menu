"use client";

import { useEffect, useRef, useState } from "react";
import { Category, Product } from "@/lib/storage";
import { Lang, LANGS, catName, ui } from "@/lib/i18n";
import { ProductCard } from "./ProductCard";

interface Props {
  categories: Category[];
  products: Product[];
}

export function MenuClient({ categories, products }: Props) {
  const [menuType, setMenuType] = useState<"food" | "drinks">("food");
  const [activeId, setActiveId] = useState<number | null>(null);
  const [lang, setLang] = useState<Lang>("es");
  const pillsRef = useRef<HTMLDivElement>(null);

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
      <header className="relative grain overflow-hidden bg-brand-espresso">
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30"
          aria-hidden="true"
        />

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

          <p className="font-sans text-[10px] font-medium tracking-[0.45em] uppercase text-brand-honey/40 mb-8">
            Platja d&apos;Aro &middot; Costa Brava
          </p>

          <h1 className="font-serif font-light text-[76px] sm:text-[92px] leading-none tracking-[-0.02em] text-brand-cream">
            Plenty.
          </h1>

          <div className="mt-7 mb-5 flex items-center justify-center gap-3 max-w-[160px] mx-auto">
            <div className="flex-1 h-px bg-brand-caramel/25" />
            <div className="w-1 h-1 rounded-full bg-brand-caramel/50" />
            <div className="flex-1 h-px bg-brand-caramel/25" />
          </div>

          <p className="font-sans text-[11px] font-medium tracking-[0.38em] uppercase text-brand-honey/45">
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
      <main className="max-w-2xl mx-auto px-4 py-10 space-y-14">
        {visibleCategories.map((cat) => {
          const catProducts = allProductsByCategory(cat.id);
          if (catProducts.length === 0) return null;
          return (
            <section key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-28">

              <div className="flex items-center gap-3 mb-6">
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
