"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { Product } from "@/lib/storage";
import { Lang, prodName, prodDesc } from "@/lib/i18n";
import { ALLERGENS } from "@/lib/allergens";

interface Props {
  product: Product;
  lang: Lang;
  onClose: () => void;
}

const BADGE_STYLES: Record<string, string> = {
  "Especial del día": "bg-amber-50 text-amber-700 border-amber-300",
  "Nuevo":            "bg-emerald-50 text-emerald-700 border-emerald-300",
  "Temporada":        "bg-sky-50 text-sky-700 border-sky-300",
  "Recomendado":      "bg-rose-50 text-rose-700 border-rose-300",
};

export function ProductDetailModal({ product, lang, onClose }: Props) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const name = prodName(product, lang);
  const desc = prodDesc(product, lang);
  const activeAllergens = ALLERGENS.filter((a) => product.allergens?.includes(a.id));
  const badgeStyle = product.badge ? (BADGE_STYLES[product.badge] ?? "bg-brand-parchment text-brand-espresso border-brand-stone/60") : null;
  const [imgLoaded, setImgLoaded] = useState(false);

  // Supabase image transform: sirve WebP redimensionado desde CDN (mucho más rápido)
  const imgSrc = product.imageUrl?.includes("supabase.co/storage/v1/object/public")
    ? product.imageUrl.replace("/storage/v1/object/public", "/storage/v1/render/image/public") + "?width=900&quality=80&format=webp"
    : product.imageUrl;

  // Entrada con GSAP timeline
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(backdropRef.current,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.25, ease: "power2.out" }
    ).fromTo(modalRef.current,
      { autoAlpha: 0, y: 48, scale: 0.95 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.3)" },
      "-=0.1"
    );
  }, []);

  const handleClose = () => {
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(modalRef.current,
      { autoAlpha: 0, y: 32, scale: 0.96, duration: 0.22, ease: "power2.in" }
    ).to(backdropRef.current,
      { autoAlpha: 0, duration: 0.2 },
      "-=0.1"
    );
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-brand-espresso/60 backdrop-blur-sm px-0 sm:px-4"
      style={{ opacity: 0, visibility: "hidden" }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-md shadow-elevated overflow-hidden"
        style={{ opacity: 0, visibility: "hidden" }}
      >
        {/* Imagen */}
        {product.imageUrl ? (
          <div className="relative w-full overflow-hidden">
            {!imgLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-brand-stone/30 via-brand-stone/50 to-brand-stone/30" />
            )}
            <Image
              src={imgSrc!}
              alt={name}
              width={900}
              height={900}
              className={`w-full h-auto transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setImgLoaded(true)}
              priority
              unoptimized
            />
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-end px-5 pt-4">
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-brand-stone/50 text-brand-muted flex items-center justify-center hover:bg-brand-stone transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Contenido */}
        <div className="px-6 py-5 space-y-3">
          {product.badge && badgeStyle && (
            <span className={`inline-block font-sans text-[10px] font-semibold tracking-wide uppercase border rounded-full px-2.5 py-0.5 ${badgeStyle}`}>
              {product.badge}
            </span>
          )}

          <div className="flex items-start justify-between gap-3">
            <h2 className="font-serif font-semibold text-brand-espresso text-2xl leading-tight flex-1">
              {name}
            </h2>
            <span className="font-serif font-semibold text-brand-caramel text-2xl whitespace-nowrap flex-none">
              {product.price.toFixed(2).replace(".", ",")}€
            </span>
          </div>

          {desc && (
            <p className="font-sans text-brand-muted text-[14px] leading-relaxed">
              {desc}
            </p>
          )}

          {!product.available && (
            <span className="inline-block font-sans text-[10px] font-medium text-brand-muted/70 tracking-widest uppercase border border-brand-stone/80 rounded-full px-3 py-1">
              No disponible
            </span>
          )}

          {activeAllergens.length > 0 && (
            <div>
              <p className="font-sans text-[10px] font-semibold tracking-widest uppercase text-brand-muted/50 mb-2">
                Alérgenos
              </p>
              <div className="flex flex-wrap gap-1.5">
                {activeAllergens.map((a) => (
                  <span
                    key={a.id}
                    className="inline-flex items-center gap-1 text-[12px] font-sans text-brand-muted/80 bg-brand-parchment border border-brand-stone/60 rounded-full px-2.5 py-1"
                  >
                    <span>{a.icon}</span>
                    <span>{a.label[lang]}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
