import { Product } from "@/lib/storage";
import { Lang, prodName, prodDesc, ui } from "@/lib/i18n";
import Image from "next/image";

interface Props {
  product: Product;
  lang: Lang;
}

export function ProductCard({ product, lang }: Props) {
  const unavailable = !product.available;
  const name = prodName(product, lang);
  const desc = prodDesc(product, lang);

  if (product.imageUrl) {
    return (
      <div
        className={`product-card group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 ${
          unavailable ? "opacity-50" : ""
        }`}
      >
        <div className="relative w-full h-44 overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-400"
            unoptimized
          />
          {unavailable && (
            <div className="absolute inset-0 bg-white/55 backdrop-blur-[2px] flex items-center justify-center">
              <span className="font-sans text-xs font-medium text-brand-muted tracking-widest uppercase bg-white/90 px-3 py-1.5 rounded-full border border-brand-stone">
                {ui[lang].unavailable}
              </span>
            </div>
          )}
        </div>

        <div className="p-4 pt-3.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif font-semibold text-brand-espresso text-[17px] leading-tight flex-1">
              {name}
            </h3>
            <span className="font-serif font-semibold text-brand-caramel text-[17px] whitespace-nowrap flex-none">
              {product.price.toFixed(2).replace(".", ",")}€
            </span>
          </div>
          {desc && (
            <p className="font-sans text-brand-muted text-[13px] leading-relaxed mt-1.5 line-clamp-2">
              {desc}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`product-card group bg-white rounded-2xl shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 p-5 ${
        unavailable ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-serif font-semibold text-brand-espresso text-[17px] leading-tight">
            {name}
          </h3>
          {unavailable && (
            <span className="inline-block mt-1.5 font-sans text-[10px] font-medium text-brand-muted/70 tracking-widest uppercase border border-brand-stone/80 rounded-full px-2 py-0.5">
              {ui[lang].unavailable}
            </span>
          )}
          {desc && (
            <p className="font-sans text-brand-muted text-[13px] leading-relaxed mt-1.5 line-clamp-2">
              {desc}
            </p>
          )}
        </div>

        <div className="flex-none text-right">
          <span className="font-serif font-semibold text-brand-caramel text-[18px] leading-tight whitespace-nowrap">
            {product.price.toFixed(2).replace(".", ",")}€
          </span>
        </div>
      </div>
    </div>
  );
}
