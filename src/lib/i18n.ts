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
  tableWarning: string;
  successTitle: string;
  successDesc: string;
  errorMsg: string;
  hintBadge: string;
  hintTitle: string;
  hintDesc: string;
  hintButton: string;
  // Comprobación de que el cliente está en el local antes de avisar
  geoChecking: string;
  geoDenied: string;
  geoFar: string;
  geoUnavailable: string;
  geoRetry: string;
  // Aviso previo a la petición de ubicación del navegador
  geoAskTitle: string;
  geoAskDesc: string;
  geoAskPrivacy: string;
  geoAskAllow: string;
  geoAskLater: string;
  // Pedir la cuenta
  billButton: string;
  billModalDesc: string;
  confirmBillBtn: string;
  confirmBillBtnSending: string;
  billSuccessTitle: string;
  billSuccessDesc: string;
  // Encuesta de satisfaccion al pedir la cuenta
  surveyTitle: string;
  surveyDesc: string;
  surveyHappyTitle: string;
  surveyHappyDesc: string;
  surveyHappyBtn: string;
  surveyHappySkip: string;
  surveyLowTitle: string;
  surveyLowDesc: string;
  surveyLowPlaceholder: string;
  surveyLowSubmit: string;
  surveyLowSkip: string;
  surveyThanks: string;
  // Filtro de alergenos en la carta
  filterLabel: string;
  filterTitle: string;
  filterClear: string;
  filterNoResults: string;
  // Boton para instalar la PWA + instrucciones manuales en iOS
  installButton: string;
  installIOSTitle: string;
  installIOSStep1: string;
  installIOSStep2: string;
  installIOSGotIt: string;
  // Pasos para reactivar la ubicacion a mano cuando el sistema la ha bloqueado
  geoDeniedStepIOS1: string;
  geoDeniedStepIOS2: string;
  geoDeniedStepAndroid1: string;
  geoDeniedStepAndroid2: string;
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
    tableWarning: "Comprueba que el número de mesa sea correcto",
    successTitle: "¡Aviso enviado!",
    successDesc: "El camarero está en camino a la mesa",
    errorMsg: "No se pudo enviar el aviso. Inténtalo de nuevo.",
    hintBadge: "Consejo",
    hintTitle: "¿Ya sabes qué vas a pedir?",
    hintDesc: "Toca el botón verde cuando estés listo y avisamos al camarero al instante.",
    hintButton: "¡Entendido!",
    geoChecking: "Comprobando que estás en Plenty…",
    geoDenied: "Activa la ubicación para avisar al camarero. Solo la usamos para comprobar que estás en el local.",
    geoFar: "Parece que no estás en Plenty. El aviso al camarero solo funciona desde el local.",
    geoUnavailable: "No hemos podido obtener tu ubicación. Revisa que esté activada e inténtalo de nuevo.",
    geoRetry: "Reintentar",
    geoAskTitle: "Activa tu ubicación",
    geoAskDesc: "Para avisar al camarero comprobamos que estás en Plenty.",
    geoAskPrivacy: "Solo la usamos para esto y no la guardamos.",
    geoAskAllow: "Permitir ubicación",
    geoAskLater: "Ahora no",
    billButton: "La cuenta",
    billModalDesc: "Pedimos la cuenta a tu mesa.",
    confirmBillBtn: "Pedir la cuenta",
    confirmBillBtnSending: "Pidiendo...",
    billSuccessTitle: "¡Cuenta pedida!",
    billSuccessDesc: "Te traemos la cuenta a la mesa",
    surveyTitle: "¿Qué tal todo?",
    surveyDesc: "Tu opinión nos ayuda a mejorar.",
    surveyHappyTitle: "¡Nos alegra mucho!",
    surveyHappyDesc: "¿Nos dejas una reseña en Google? Nos ayuda muchísimo.",
    surveyHappyBtn: "Dejar reseña",
    surveyHappySkip: "Ahora no",
    surveyLowTitle: "Gracias por contárnoslo",
    surveyLowDesc: "¿Qué podríamos mejorar? (opcional)",
    surveyLowPlaceholder: "Cuéntanos qué ha pasado...",
    surveyLowSubmit: "Enviar",
    surveyLowSkip: "Omitir",
    surveyThanks: "¡Gracias por tu tiempo!",
    filterLabel: "Alérgenos",
    filterTitle: "Ocultar platos con",
    filterClear: "Quitar filtros",
    filterNoResults: "Ningún plato cumple estos filtros.",
    installButton: "Instalar app",
    installIOSTitle: "Añade Plenty a tu pantalla de inicio",
    installIOSStep1: "Toca el icono de compartir de Safari",
    installIOSStep2: "Elige «Añadir a pantalla de inicio»",
    installIOSGotIt: "Entendido",
    geoDeniedStepIOS1: "Toca el icono «Aa» de la barra de direcciones y elige «Ajustes de la página web»",
    geoDeniedStepIOS2: "En Ubicación, elige «Permitir»",
    geoDeniedStepAndroid1: "Toca el candado junto a la dirección web y elige «Permisos del sitio»",
    geoDeniedStepAndroid2: "En Ubicación, elige «Permitir»",
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
    tableWarning: "Comprova que el número de taula sigui correcte",
    successTitle: "Avís enviat!",
    successDesc: "El cambrer ja va cap a la taula",
    errorMsg: "No s'ha pogut enviar l'avís. Torna-ho a provar.",
    hintBadge: "Consell",
    hintTitle: "Ja saps què demanaràs?",
    hintDesc: "Toca el botó verd quan estiguis a punt i avisem el cambrer a l'instant.",
    hintButton: "Entesos!",
    geoChecking: "Comprovant que ets a Plenty…",
    geoDenied: "Activa la ubicació per avisar el cambrer. Només la fem servir per comprovar que ets al local.",
    geoFar: "Sembla que no ets a Plenty. L'avís al cambrer només funciona des del local.",
    geoUnavailable: "No hem pogut obtenir la teva ubicació. Comprova que estigui activada i torna-ho a provar.",
    geoRetry: "Tornar a provar",
    geoAskTitle: "Activa la teva ubicació",
    geoAskDesc: "Per avisar el cambrer comprovem que ets a Plenty.",
    geoAskPrivacy: "Només la fem servir per a això i no la guardem.",
    geoAskAllow: "Permetre ubicació",
    geoAskLater: "Ara no",
    billButton: "El compte",
    billModalDesc: "Portem el compte a la teva taula.",
    confirmBillBtn: "Demanar el compte",
    confirmBillBtnSending: "Demanant...",
    billSuccessTitle: "Compte demanat!",
    billSuccessDesc: "Et portem el compte a la taula",
    surveyTitle: "Què tal tot?",
    surveyDesc: "La teva opinió ens ajuda a millorar.",
    surveyHappyTitle: "Ens alegra molt!",
    surveyHappyDesc: "Ens deixes una ressenya a Google? Ens ajuda moltíssim.",
    surveyHappyBtn: "Deixar ressenya",
    surveyHappySkip: "Ara no",
    surveyLowTitle: "Gràcies per dir-nos-ho",
    surveyLowDesc: "Què podríem millorar? (opcional)",
    surveyLowPlaceholder: "Explica'ns què ha passat...",
    surveyLowSubmit: "Enviar",
    surveyLowSkip: "Ometre",
    surveyThanks: "Gràcies pel teu temps!",
    filterLabel: "Al·lèrgens",
    filterTitle: "Amagar plats amb",
    filterClear: "Treure filtres",
    filterNoResults: "Cap plat compleix aquests filtres.",
    installButton: "Instal·la l'app",
    installIOSTitle: "Afegeix Plenty a la teva pantalla d'inici",
    installIOSStep1: "Toca la icona de compartir de Safari",
    installIOSStep2: "Tria «Afegeix a la pantalla d'inici»",
    installIOSGotIt: "Entesos",
    geoDeniedStepIOS1: "Toca la icona «Aa» de la barra d'adreces i tria «Ajustos de la pàgina web»",
    geoDeniedStepIOS2: "A Ubicació, tria «Permetre»",
    geoDeniedStepAndroid1: "Toca el cadenat del costat de l'adreça web i tria «Permisos del lloc»",
    geoDeniedStepAndroid2: "A Ubicació, tria «Permetre»",
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
    tableWarning: "Double-check the table number is correct",
    successTitle: "Alert sent!",
    successDesc: "The waiter is on the way to table",
    errorMsg: "Couldn't send the alert. Please try again.",
    hintBadge: "Tip",
    hintTitle: "Already know what you'll order?",
    hintDesc: "Tap the green button when you're ready and we'll notify the waiter instantly.",
    hintButton: "Got it!",
    geoChecking: "Checking you're at Plenty…",
    geoDenied: "Turn on location to call the waiter. We only use it to check you're in the restaurant.",
    geoFar: "It looks like you're not at Plenty. Calling the waiter only works from inside the restaurant.",
    geoUnavailable: "We couldn't get your location. Make sure it's turned on and try again.",
    geoRetry: "Try again",
    geoAskTitle: "Turn on your location",
    geoAskDesc: "To call the waiter, we check that you're at Plenty.",
    geoAskPrivacy: "We only use it for this and never store it.",
    geoAskAllow: "Allow location",
    geoAskLater: "Not now",
    billButton: "The bill",
    billModalDesc: "We'll bring the bill to your table.",
    confirmBillBtn: "Request the bill",
    confirmBillBtnSending: "Requesting...",
    billSuccessTitle: "Bill requested!",
    billSuccessDesc: "We're bringing the bill to table",
    surveyTitle: "How was everything?",
    surveyDesc: "Your feedback helps us improve.",
    surveyHappyTitle: "So glad to hear it!",
    surveyHappyDesc: "Would you leave us a Google review? It helps us a lot.",
    surveyHappyBtn: "Leave a review",
    surveyHappySkip: "Not now",
    surveyLowTitle: "Thanks for telling us",
    surveyLowDesc: "What could we improve? (optional)",
    surveyLowPlaceholder: "Tell us what happened...",
    surveyLowSubmit: "Send",
    surveyLowSkip: "Skip",
    surveyThanks: "Thanks for your time!",
    filterLabel: "Allergens",
    filterTitle: "Hide dishes with",
    filterClear: "Clear filters",
    filterNoResults: "No dishes match these filters.",
    installButton: "Install app",
    installIOSTitle: "Add Plenty to your home screen",
    installIOSStep1: "Tap the Share icon in Safari",
    installIOSStep2: "Choose “Add to Home Screen”",
    installIOSGotIt: "Got it",
    geoDeniedStepIOS1: "Tap the “Aa” icon in the address bar and choose “Website Settings”",
    geoDeniedStepIOS2: "Under Location, choose “Allow”",
    geoDeniedStepAndroid1: "Tap the lock icon next to the web address and choose “Permissions”",
    geoDeniedStepAndroid2: "Under Location, choose “Allow”",
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
    tableWarning: "Vérifiez que le numéro de table est correct",
    successTitle: "Alerte envoyée !",
    successDesc: "Le serveur arrive à la table",
    errorMsg: "Impossible d'envoyer l'alerte. Réessayez.",
    hintBadge: "Astuce",
    hintTitle: "Vous savez déjà quoi commander ?",
    hintDesc: "Appuyez sur le bouton vert quand vous êtes prêt, on prévient le serveur aussitôt.",
    hintButton: "Compris !",
    geoChecking: "Vérification que vous êtes chez Plenty…",
    geoDenied: "Activez la localisation pour appeler le serveur. Nous l'utilisons uniquement pour vérifier que vous êtes sur place.",
    geoFar: "Il semble que vous ne soyez pas chez Plenty. L'appel au serveur ne fonctionne que sur place.",
    geoUnavailable: "Impossible d'obtenir votre position. Vérifiez qu'elle est activée et réessayez.",
    geoRetry: "Réessayer",
    geoAskTitle: "Activez votre position",
    geoAskDesc: "Pour appeler le serveur, nous vérifions que vous êtes chez Plenty.",
    geoAskPrivacy: "Nous l'utilisons uniquement pour cela et ne la conservons pas.",
    geoAskAllow: "Autoriser la position",
    geoAskLater: "Plus tard",
    billButton: "L'addition",
    billModalDesc: "Nous apportons l'addition à votre table.",
    confirmBillBtn: "Demander l'addition",
    confirmBillBtnSending: "Envoi...",
    billSuccessTitle: "Addition demandée !",
    billSuccessDesc: "Nous apportons l'addition à la table",
    surveyTitle: "Comment c'était ?",
    surveyDesc: "Votre avis nous aide à nous améliorer.",
    surveyHappyTitle: "Ça nous fait très plaisir !",
    surveyHappyDesc: "Pouvez-vous nous laisser un avis Google ? Ça nous aide beaucoup.",
    surveyHappyBtn: "Laisser un avis",
    surveyHappySkip: "Plus tard",
    surveyLowTitle: "Merci de nous le dire",
    surveyLowDesc: "Que pourrions-nous améliorer ? (facultatif)",
    surveyLowPlaceholder: "Dites-nous ce qui s'est passé...",
    surveyLowSubmit: "Envoyer",
    surveyLowSkip: "Passer",
    surveyThanks: "Merci pour votre temps !",
    filterLabel: "Allergènes",
    filterTitle: "Masquer les plats avec",
    filterClear: "Effacer les filtres",
    filterNoResults: "Aucun plat ne correspond à ces filtres.",
    installButton: "Installer l'app",
    installIOSTitle: "Ajoutez Plenty à votre écran d'accueil",
    installIOSStep1: "Appuyez sur l'icône Partager de Safari",
    installIOSStep2: "Choisissez « Sur l'écran d'accueil »",
    installIOSGotIt: "Compris",
    geoDeniedStepIOS1: "Appuyez sur l'icône « Aa » de la barre d'adresse et choisissez « Réglages du site »",
    geoDeniedStepIOS2: "Sous Position, choisissez « Autoriser »",
    geoDeniedStepAndroid1: "Appuyez sur le cadenas à côté de l'adresse et choisissez « Autorisations »",
    geoDeniedStepAndroid2: "Sous Position, choisissez « Autoriser »",
  },
};
