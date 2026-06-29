import { Product } from "@/lib/storage";
import { Lang, prodName, prodDesc, ui } from "@/lib/i18n";
import { ALLERGENS } from "@/lib/allergens";

interface Props {
  product: Product;
  lang: Lang;
  onClick?: () => void;
}

function AllergenBadges({ allergens, lang }: { allergens: string[]; lang: Lang }) {
  if (!allergens || allergens.length === 0) return null;
  const active = ALLERGENS.filter((a) => allergens.includes(a.id));
  if (active.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {active.map((a) => (
        <span
          key={a.id}
          title={a.label[lang]}
          className="inline-flex items-center gap-0.5 text-[11px] font-sans text-brand-muted/70 bg-brand-parchment border border-brand-stone/60 rounded-full px-1.5 py-0.5 leading-none"
        >
          <span>{a.icon}</span>
          <span className="hidden sm:inline">{a.label[lang]}</span>
        </span>
      ))}
    </div>
  );
}

const BADGE_STYLES: Record<string, string> = {
  "Especial del día": "bg-amber-50 text-amber-700 border-amber-300",
  "Nuevo":            "bg-emerald-50 text-emerald-700 border-emerald-300",
  "Temporada":        "bg-sky-50 text-sky-700 border-sky-300",
  "Recomendado":      "bg-rose-50 text-rose-700 border-rose-300",
};

function ProductBadge({ badge }: { badge?: string | null }) {
  if (!badge) return null;
  const style = BADGE_STYLES[badge] ?? "bg-brand-parchment text-brand-espresso border-brand-stone/60";
  return (
    <span className={`inline-block font-sans text-[10px] font-semibold tracking-wide uppercase border rounded-full px-2.5 py-0.5 ${style}`}>
      {badge}
    </span>
  );
}

export function ProductCard({ product, lang, onClick }: Props) {
  const unavailable = !product.available;
  const name = prodName(product, lang);

  // Precio 0 → etiqueta informativa, no card de producto
  if (product.price === 0) {
    return (
      <div className="product-card flex items-center gap-2 bg-white border border-brand-stone/50 rounded-full px-4 py-2.5 w-fit">
        <span className="font-sans text-sm font-medium text-brand-espresso">{name}</span>
      </div>
    );
  }
  const desc = prodDesc(product, lang);

  return (
    <div
      onClick={onClick}
      className={`product-card group rounded-2xl shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 p-5 ${
        unavailable ? "bg-brand-stone/40 opacity-70" : "bg-white"
      } ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-serif font-semibold text-brand-espresso text-[17px] leading-tight">
              {name}
            </h3>
            {!unavailable && <ProductBadge badge={product.badge} />}
          </div>
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
          <AllergenBadges allergens={product.allergens} lang={lang} />
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
