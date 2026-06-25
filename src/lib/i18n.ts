import { Category, Product } from "./storage";

export type Lang = "es" | "en" | "fr";

export const LANGS: { code: Lang; flag: string; label: string }[] = [
  { code: "es", flag: "🇪🇸", label: "Español" },
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "fr", flag: "🇫🇷", label: "Français" },
];

export function catName(cat: Category, lang: Lang): string {
  if (lang === "en" && cat.name_en) return cat.name_en;
  if (lang === "fr" && cat.name_fr) return cat.name_fr;
  return cat.name;
}

export function prodName(p: Product, lang: Lang): string {
  if (lang === "en" && p.name_en) return p.name_en;
  if (lang === "fr" && p.name_fr) return p.name_fr;
  return p.name;
}

export function prodDesc(p: Product, lang: Lang): string {
  if (lang === "en" && p.description_en) return p.description_en;
  if (lang === "fr" && p.description_fr) return p.description_fr;
  return p.description;
}

export const ui: Record<Lang, { unavailable: string; empty: string; brunchCafe: string; food: string; drinks: string }> = {
  es: {
    unavailable: "No disponible",
    empty: "Carta en preparación. Vuelve pronto.",
    brunchCafe: "Brunch & Café",
    food: "Carta",
    drinks: "Bebidas",
  },
  en: {
    unavailable: "Not available",
    empty: "Menu in preparation. Come back soon.",
    brunchCafe: "Brunch & Café",
    food: "Menu",
    drinks: "Drinks",
  },
  fr: {
    unavailable: "Non disponible",
    empty: "Menu en préparation. Revenez bientôt.",
    brunchCafe: "Brunch & Café",
    food: "Carte",
    drinks: "Boissons",
  },
};
