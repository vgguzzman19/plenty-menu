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
          className="inline-flex items-center gap-0.5 text-[11px] font-sans text-brand-muted/70 dark:text-brand-honey/50 bg-brand-parchment dark:bg-brand-roast/50 border border-brand-stone/60 dark:border-brand-roast rounded-full px-1.5 py-0.5 leading-none"
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
      <div className="product-card flex items-center gap-2 bg-white dark:bg-brand-espresso border border-brand-stone/50 dark:border-brand-roast rounded-full px-4 py-2.5 w-fit shadow-groove dark:shadow-none">
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
          ? "bg-brand-stone/40 dark:bg-brand-roast/30 opacity-70"
          : "bg-gradient-to-br from-white via-white to-brand-sand dark:from-brand-espresso dark:via-brand-espresso dark:to-brand-roast/60 ring-1 ring-brand-stone/60 hover:ring-brand-caramel/40 shadow-card-pop-mobile dark:shadow-none sm:shadow-card-pop sm:dark:shadow-none hover:shadow-card-pop-hover dark:hover:shadow-none dark:ring-brand-roast dark:hover:ring-brand-caramel/40 hover:-translate-y-0.5"
      } ${onClick ? "cursor-pointer active:scale-[0.98] active:shadow-card-press dark:active:shadow-none" : ""}`}
    >
      {/* Filete caramelo arriba — se intensifica al pasar el ratón */}
      {!unavailable && (
        <div
          className="absolute top-0 inset-x-6 h-px bg-gradient-to-r from-transparent via-brand-caramel/45 to-transparent opacity-70 group-hover:opacity-100 transition-opacity"
          aria-hidden="true"
        />
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-serif font-semibold text-brand-espresso dark:text-brand-cream text-[18px] leading-tight">
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
            <p className="font-sans text-brand-muted dark:text-brand-honey/60 text-[13px] leading-relaxed mt-1.5 line-clamp-2">
              {desc}
            </p>
          )}
          <AllergenBadges allergens={product.allergens} lang={lang} />
        </div>

        <div className="flex-none">
          <span className="inline-block font-serif font-semibold text-brand-caramel dark:text-brand-honey text-[18px] leading-none whitespace-nowrap bg-brand-caramel/10 dark:bg-brand-honey/10 ring-1 ring-brand-caramel/15 dark:ring-brand-honey/15 rounded-full px-3 py-1.5">
            {product.price.toFixed(2).replace(".", ",")}€
          </span>
        </div>
      </div>
      {onClick && (
        <div className="flex items-center justify-end gap-2 mt-auto pt-4">
          <div className="flex-1 border-t border-dashed border-brand-stone/80 dark:border-brand-roast" aria-hidden="true" />
          <span className="font-sans text-[11px] text-brand-muted/60 dark:text-brand-honey/35 tracking-wide group-hover:text-brand-caramel dark:group-hover:text-brand-honey/70 transition-colors">
            {ui[lang].clickMore}
          </span>
          <span className="flex-none w-6 h-6 rounded-full flex items-center justify-center bg-brand-caramel/10 dark:bg-brand-honey/10 text-brand-caramel dark:text-brand-honey group-hover:bg-brand-caramel group-hover:text-white dark:group-hover:bg-brand-honey dark:group-hover:text-brand-espresso transition-colors" aria-hidden="true">
            <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      )}
    </div>
  );
}
