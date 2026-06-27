export interface Allergen {
  id: string;
  icon: string;
  label: Record<"es" | "en" | "fr" | "ca", string>;
}

export const ALLERGENS: Allergen[] = [
  { id: "gluten",    icon: "🌾", label: { es: "Gluten",       en: "Gluten",      fr: "Gluten",           ca: "Gluten" } },
  { id: "eggs",      icon: "🥚", label: { es: "Huevo",        en: "Eggs",        fr: "Œuf",              ca: "Ou" } },
  { id: "dairy",     icon: "🥛", label: { es: "Lácteos",      en: "Dairy",       fr: "Lait",             ca: "Lactis" } },
  { id: "fish",      icon: "🐟", label: { es: "Pescado",      en: "Fish",        fr: "Poisson",          ca: "Peix" } },
  { id: "shellfish", icon: "🦐", label: { es: "Marisco",      en: "Shellfish",   fr: "Crustacés",        ca: "Marisc" } },
  { id: "nuts",      icon: "🌰", label: { es: "Frutos secos", en: "Tree nuts",   fr: "Fruits à coque",   ca: "Fruits secs" } },
  { id: "peanuts",   icon: "🥜", label: { es: "Cacahuetes",   en: "Peanuts",     fr: "Arachides",        ca: "Cacauets" } },
  { id: "soy",       icon: "🫘", label: { es: "Soja",         en: "Soy",         fr: "Soja",             ca: "Soja" } },
  { id: "sesame",    icon: "🌱", label: { es: "Sésamo",       en: "Sesame",      fr: "Sésame",           ca: "Sèsam" } },
  { id: "mustard",   icon: "🌻", label: { es: "Mostaza",      en: "Mustard",     fr: "Moutarde",         ca: "Mostassa" } },
  { id: "celery",    icon: "🥬", label: { es: "Apio",         en: "Celery",      fr: "Céleri",           ca: "Api" } },
  { id: "sulfites",  icon: "🍷", label: { es: "Sulfitos",     en: "Sulphites",   fr: "Sulfites",         ca: "Sulfits" } },
  { id: "lupin",     icon: "🌿", label: { es: "Altramuces",   en: "Lupin",       fr: "Lupin",            ca: "Tramussos" } },
  { id: "molluscs",  icon: "🐚", label: { es: "Moluscos",     en: "Molluscs",    fr: "Mollusques",       ca: "Mol·luscos" } },
];
