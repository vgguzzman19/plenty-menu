export interface Allergen {
  id: string;
  icon: string;
  label: Record<"es" | "en" | "fr", string>;
}

export const ALLERGENS: Allergen[] = [
  { id: "gluten",    icon: "🌾", label: { es: "Gluten",       en: "Gluten",      fr: "Gluten" } },
  { id: "eggs",      icon: "🥚", label: { es: "Huevo",        en: "Eggs",        fr: "Œuf" } },
  { id: "dairy",     icon: "🥛", label: { es: "Lácteos",      en: "Dairy",       fr: "Lait" } },
  { id: "fish",      icon: "🐟", label: { es: "Pescado",      en: "Fish",        fr: "Poisson" } },
  { id: "shellfish", icon: "🦐", label: { es: "Marisco",      en: "Shellfish",   fr: "Crustacés" } },
  { id: "nuts",      icon: "🌰", label: { es: "Frutos secos", en: "Tree nuts",   fr: "Fruits à coque" } },
  { id: "peanuts",   icon: "🥜", label: { es: "Cacahuetes",   en: "Peanuts",     fr: "Arachides" } },
  { id: "soy",       icon: "🫘", label: { es: "Soja",         en: "Soy",         fr: "Soja" } },
  { id: "sesame",    icon: "🌱", label: { es: "Sésamo",       en: "Sesame",      fr: "Sésame" } },
  { id: "mustard",   icon: "🌻", label: { es: "Mostaza",      en: "Mustard",     fr: "Moutarde" } },
  { id: "celery",    icon: "🥬", label: { es: "Apio",         en: "Celery",      fr: "Céleri" } },
  { id: "sulfites",  icon: "🍷", label: { es: "Sulfitos",     en: "Sulphites",   fr: "Sulfites" } },
  { id: "lupin",     icon: "🌿", label: { es: "Altramuces",   en: "Lupin",       fr: "Lupin" } },
  { id: "molluscs",  icon: "🐚", label: { es: "Moluscos",     en: "Molluscs",    fr: "Mollusques" } },
];
