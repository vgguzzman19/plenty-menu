import { Category, Product } from "./storage";

export type Lang = "es" | "en" | "fr" | "ca";

export const LANGS: { code: Lang; flag: string; label: string }[] = [
  { code: "es", flag: "🇪🇸", label: "Español" },
  { code: "ca", flag: "🏴", label: "Català" },
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "fr", flag: "🇫🇷", label: "Français" },
];

// Detecta el idioma del dispositivo y lo mapea a uno de los 4 soportados
export function detectDeviceLang(): Lang {
  if (typeof navigator === "undefined") return "es";
  const candidates = navigator.languages && navigator.languages.length
    ? navigator.languages
    : [navigator.language];
  for (const candidate of candidates) {
    const code = candidate.slice(0, 2).toLowerCase();
    const match = LANGS.find((l) => l.code === code);
    if (match) return match.code;
  }
  return "es";
}

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

interface UiText {
  unavailable: string;
  empty: string;
  brunchCafe: string;
  food: string;
  drinks: string;
  searchPlaceholder: string;
  searchEmpty: string;
  clickMore: string;
  // Botón "Pedir ya" y flujo de aviso al camarero
  orderButton: string;
  orderButtonSent: string;
  langLabel: string;
  modalTitle: string;
  modalDesc: string;
  confirmBtn: string;
  confirmBtnSending: string;
  successTitle: string;
  successDesc: string;
  errorMsg: string;
  hintBadge: string;
  hintTitle: string;
  hintDesc: string;
  hintButton: string;
}

export const ui: Record<Lang, UiText> = {
  es: {
    unavailable: "No disponible",
    empty: "Carta en preparación. Vuelve pronto.",
    brunchCafe: "Healthy Brunch & Lunch.",
    food: "Carta",
    drinks: "Bebidas",
    searchPlaceholder: "Buscar plato o bebida...",
    searchEmpty: "No se encontraron resultados para",
    clickMore: "Toca para ver más",
    orderButton: "Pedir ya",
    orderButtonSent: "Aviso enviado",
    langLabel: "Idioma",
    modalTitle: "¿En qué mesa estás?",
    modalDesc: "Avisamos al camarero de que estás listo para pedir.",
    confirmBtn: "Avisar al camarero",
    confirmBtnSending: "Avisando...",
    successTitle: "¡Aviso enviado!",
    successDesc: "El camarero está en camino a la mesa",
    errorMsg: "No se pudo enviar el aviso. Inténtalo de nuevo.",
    hintBadge: "Consejo",
    hintTitle: "¿Ya sabes qué vas a pedir?",
    hintDesc: "Toca el botón verde cuando estés listo y avisamos al camarero al instante.",
    hintButton: "¡Entendido!",
  },
  ca: {
    unavailable: "No disponible",
    empty: "Carta en preparació. Torna aviat.",
    brunchCafe: "Healthy Brunch & Lunch.",
    food: "Carta",
    drinks: "Begudes",
    searchPlaceholder: "Cercar plat o beguda...",
    searchEmpty: "No s'han trobat resultats per a",
    clickMore: "Toca per veure més",
    orderButton: "Demanar ja",
    orderButtonSent: "Avís enviat",
    langLabel: "Idioma",
    modalTitle: "A quina taula ets?",
    modalDesc: "Avisem el cambrer que estàs a punt per demanar.",
    confirmBtn: "Avisar el cambrer",
    confirmBtnSending: "Avisant...",
    successTitle: "Avís enviat!",
    successDesc: "El cambrer ja va cap a la taula",
    errorMsg: "No s'ha pogut enviar l'avís. Torna-ho a provar.",
    hintBadge: "Consell",
    hintTitle: "Ja saps què demanaràs?",
    hintDesc: "Toca el botó verd quan estiguis a punt i avisem el cambrer a l'instant.",
    hintButton: "Entesos!",
  },
  en: {
    unavailable: "Not available",
    empty: "Menu in preparation. Come back soon.",
    brunchCafe: "Healthy Brunch & Lunch.",
    food: "Menu",
    drinks: "Drinks",
    searchPlaceholder: "Search dish or drink...",
    searchEmpty: "No results found for",
    clickMore: "Tap to see more",
    orderButton: "Order now",
    orderButtonSent: "Alert sent",
    langLabel: "Language",
    modalTitle: "Which table are you at?",
    modalDesc: "We'll let the waiter know you're ready to order.",
    confirmBtn: "Call the waiter",
    confirmBtnSending: "Sending...",
    successTitle: "Alert sent!",
    successDesc: "The waiter is on the way to table",
    errorMsg: "Couldn't send the alert. Please try again.",
    hintBadge: "Tip",
    hintTitle: "Already know what you'll order?",
    hintDesc: "Tap the green button when you're ready and we'll notify the waiter instantly.",
    hintButton: "Got it!",
  },
  fr: {
    unavailable: "Non disponible",
    empty: "Menu en préparation. Revenez bientôt.",
    brunchCafe: "Healthy Brunch & Lunch.",
    food: "Carte",
    drinks: "Boissons",
    searchPlaceholder: "Chercher un plat ou boisson...",
    searchEmpty: "Aucun résultat pour",
    clickMore: "Appuyez pour voir plus",
    orderButton: "Commander",
    orderButtonSent: "Alerte envoyée",
    langLabel: "Langue",
    modalTitle: "À quelle table êtes-vous ?",
    modalDesc: "Nous prévenons le serveur que vous êtes prêt à commander.",
    confirmBtn: "Appeler le serveur",
    confirmBtnSending: "Envoi...",
    successTitle: "Alerte envoyée !",
    successDesc: "Le serveur arrive à la table",
    errorMsg: "Impossible d'envoyer l'alerte. Réessayez.",
    hintBadge: "Astuce",
    hintTitle: "Vous savez déjà quoi commander ?",
    hintDesc: "Appuyez sur le bouton vert quand vous êtes prêt, on prévient le serveur aussitôt.",
    hintButton: "Compris !",
  },
};
