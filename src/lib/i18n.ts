import { Category, Product } from "./storage";

export type Lang = "es" | "en" | "fr" | "ca";

export const LANGS: { code: Lang; flag: string; label: string }[] = [
  { code: "es", flag: "🇪🇸", label: "Español" },
  { code: "ca", flag: "🏴", label: "Català" },
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "fr", flag: "🇫🇷", label: "Français" },
];

export function catName(cat: Category, lang: Lang): string {
  if (lang === "en" && cat.name_en) return cat.name_en;
  if (lang === "fr" && cat.name_fr) return cat.name_fr;
  if (lang === "ca" && cat.name_ca) return cat.name_ca;
  return cat.name;
}

export function prodName(p: Product, lang: Lang): string {
  if (lang === "en" && p.name_en) return p.name_en;
  if (lang === "fr" && p.name_fr) return p.name_fr;
  if (lang === "ca" && p.name_ca) return p.name_ca;
  return p.name;
}

export function prodDesc(p: Product, lang: Lang): string {
  if (lang === "en" && p.description_en) return p.description_en;
  if (lang === "fr" && p.description_fr) return p.description_fr;
  if (lang === "ca" && p.description_ca) return p.description_ca;
  return p.description;
}

export const ui: Record<Lang, { unavailable: string; empty: string; brunchCafe: string; food: string; drinks: string; searchPlaceholder: string; searchEmpty: string }> = {
  es: {
    unavailable: "No disponible",
    empty: "Carta en preparación. Vuelve pronto.",
    brunchCafe: "Healthy Brunch & Lunch.",
    food: "Carta",
    drinks: "Bebidas",
    searchPlaceholder: "Buscar plato o bebida...",
    searchEmpty: "No se encontraron resultados para",
  },
  ca: {
    unavailable: "No disponible",
    empty: "Carta en preparació. Torna aviat.",
    brunchCafe: "Healthy Brunch & Lunch.",
    food: "Carta",
    drinks: "Begudes",
    searchPlaceholder: "Cercar plat o beguda...",
    searchEmpty: "No s'han trobat resultats per a",
  },
  en: {
    unavailable: "Not available",
    empty: "Menu in preparation. Come back soon.",
    brunchCafe: "Healthy Brunch & Lunch.",
    food: "Menu",
    drinks: "Drinks",
    searchPlaceholder: "Search dish or drink...",
    searchEmpty: "No results found for",
  },
  fr: {
    unavailable: "Non disponible",
    empty: "Menu en préparation. Revenez bientôt.",
    brunchCafe: "Healthy Brunch & Lunch.",
    food: "Carte",
    drinks: "Boissons",
    searchPlaceholder: "Chercher un plat ou boisson...",
    searchEmpty: "Aucun résultat pour",
  },
};
