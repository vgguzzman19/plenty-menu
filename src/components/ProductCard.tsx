import { Product } from "@/lib/storage";
import { Lang, prodName, prodDesc, ui } from "@/lib/i18n";
import { ALLERGENS } from "@/lib/allergens";
import { AllergenIcon } from "./icons";

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
          className="inline-flex items-center gap-0.5 text-[11px] font-sans text-brand-brown/80 dark:text-brand-cream/75 bg-brand-parchment dark:bg-brand-roast/50 border border-brand-stone/60 dark:border-brand-roast rounded-full px-1.5 py-0.5 leading-none"
        >
          <AllergenIcon id={a.id} className="w-3 h-3 flex-none" />
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
      <div className="product-card flex items-center gap-2 bg-white dark:bg-brand-espresso border border-brand-stone/50 dark:border-brand-roast rounded-full px-4 py-2.5 w-fit shadow-none">
        <span className="font-sans text-sm font-medium text-brand-espresso dark:text-brand-cream">{name}</span>
      </div>
    );
  }
  const desc = prodDesc(product, lang);

  return (
    <div
      onClick={onClick}
      className={`product-card group relative overflow-hidden flex flex-col rounded-2xl transition-all duration-200 p-5 ${
        unavailable
          ? "bg-brand-stone/30 dark:bg-brand-roast/30 ring-1 ring-brand-stone/60 dark:ring-brand-roast"
          : "bg-white dark:bg-brand-espresso ring-1 ring-brand-stone/70 dark:ring-brand-roast shadow-sm hover:shadow-md hover:ring-brand-caramel/30 dark:hover:ring-brand-honey/30"
      } ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-serif font-semibold text-brand-espresso dark:text-brand-cream text-[20px] leading-tight">
              {name}
            </h3>
            {!unavailable && <ProductBadge badge={product.badge} />}
          </div>
          {unavailable && (
            <span className="inline-block mt-1.5 font-sans text-[10px] font-medium text-brand-brown/80 dark:text-brand-cream/75 tracking-widest uppercase border border-brand-stone/80 rounded-full px-2 py-0.5">
              {ui[lang].unavailable}
            </span>
          )}
          {desc && (
            <p className="font-sans text-brand-brown/80 dark:text-brand-cream/75 text-[13px] leading-relaxed mt-1.5 line-clamp-2">
              {desc}
            </p>
          )}
          <AllergenBadges allergens={product.allergens} lang={lang} />
        </div>

        <div className="flex-none">
          <span className="inline-block font-sans font-medium text-brand-brown dark:text-brand-honey text-[15px] leading-7 whitespace-nowrap tabular-nums">
            {product.price.toFixed(2).replace(".", ",")}€
          </span>
        </div>
      </div>
      {onClick && (
        <div className="flex items-center justify-end gap-2 mt-auto pt-4">
          <span className="font-sans text-[11px] text-brand-brown/75 dark:text-brand-cream/70 group-hover:text-brand-caramel dark:group-hover:text-brand-honey transition-colors">
            {ui[lang].clickMore}
          </span>
          <span className="flex-none flex items-center justify-center text-brand-caramel dark:text-brand-honey" aria-hidden="true">
            <svg className="w-3 h-3 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      )}
    </div>
  );
}
