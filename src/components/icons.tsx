// Ilustraciones de línea de la carta — sustituyen a los emojis, que se veían
// distintos en cada móvil y no encajaban con la estética de la marca.
// Todas en 24×24, trazo fino y color heredado (currentColor).

import type { ReactNode } from "react";

interface IconProps {
  className?: string;
}

function Svg({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

// Puntos (semillas, sésamo…): un trazo casi nulo con punta redonda
const Dots = ({ d }: { d: string }) => <path d={d} strokeWidth={2} />;

/* ── Categorías ── */

export type CategoryIconKey =
  | "bowl" | "gardenBowl" | "pancakes" | "loaf" | "toast" | "burger" | "extras" | "toppings"
  | "coffeeBean" | "hotLatte" | "icedLatte" | "frappe" | "smoothie" | "wine" | "soda" | "tea"
  | "plate" | "cup";

const CATEGORY_PATHS: Record<CategoryIconKey, ReactNode> = {
  bowl: (
    <>
      <path d="M3 12h18a9 8.5 0 0 1-18 0Z" />
      <path d="M9.5 20.5h5" />
      <path d="M6 12a2.8 2.8 0 0 1 5.6 0" />
      <path d="M11.6 12a3.2 3.2 0 0 1 6.4 0" />
      <circle cx="15" cy="6.5" r="1.4" />
      <path d="M8.5 8.2c.2-1.6 1.4-2.7 3-2.7-.2 1.6-1.4 2.7-3 2.7Z" />
    </>
  ),
  gardenBowl: (
    <>
      <path d="M3 13h18a9 8 0 0 1-18 0Z" />
      <path d="M9.5 21h5" />
      <path d="M12 13V7.5" />
      <path d="M12 9c0-3 2.2-5 5.5-5 0 3.2-2.2 5-5.5 5Z" />
      <path d="M12 10.5c0-2.4-1.8-4-4.5-4 0 2.6 1.8 4 4.5 4Z" />
    </>
  ),
  pancakes: (
    <>
      <ellipse cx="12" cy="8.5" rx="8" ry="2.4" />
      <path d="M4 8.5v2.2c0 1.3 3.6 2.4 8 2.4s8-1.1 8-2.4V8.5" />
      <path d="M4 10.7v2.2c0 1.3 3.6 2.4 8 2.4s8-1.1 8-2.4v-2.2" />
      <path d="M4 12.9v2.2c0 1.3 3.6 2.4 8 2.4s8-1.1 8-2.4v-2.2" />
      <path d="M10.3 8.2 11 6.3h2.6l.7 1.9" />
      <path d="M17.2 11v2.8a.9.9 0 0 0 1.8 0V12" />
      <path d="M2.5 20.5h19" />
    </>
  ),
  loaf: (
    <>
      <path d="M3 12c0-3.4 4-6 9-6s9 2.6 9 6v6.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
      <path d="M7.2 8.4 9 10.6" />
      <path d="M11.2 7.4 13 9.6" />
      <path d="M15.2 8.4 17 10.6" />
      <path d="M3 14.5h18" />
    </>
  ),
  toast: (
    <>
      <path d="M5 20.5V11.5A4.5 4.5 0 0 1 7 4h10a4.5 4.5 0 0 1 2 7.5v9Z" />
      <ellipse cx="12" cy="13.5" rx="4" ry="3.3" />
      <circle cx="12.4" cy="13.2" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  burger: (
    <>
      <path d="M4 11a8 6.5 0 0 1 16 0Z" />
      <Dots d="M9 7.8h.01M12 6.6h.01M15 7.8h.01" />
      <path d="M3.5 13.5c1.2 0 1.2 1 2.4 1s1.2-1 2.4-1 1.2 1 2.4 1 1.2-1 2.4-1 1.2 1 2.4 1 1.2-1 2.4-1 1.2 1 2.4 1" />
      <rect x="4" y="15.5" width="16" height="2" rx="1" />
      <path d="M4 19.5h16v.2a1.8 1.8 0 0 1-1.8 1.8H5.8A1.8 1.8 0 0 1 4 19.7Z" />
    </>
  ),
  extras: (
    <>
      <path d="M11 3.5 12.8 8.7 18 10.5 12.8 12.3 11 17.5 9.2 12.3 4 10.5 9.2 8.7Z" />
      <path d="M18.5 15.5 19.2 17.3 21 18 19.2 18.7 18.5 20.5 17.8 18.7 16 18 17.8 17.3Z" />
      <path d="M18 3.5v2.5M16.75 4.75h2.5" />
    </>
  ),
  toppings: (
    <>
      <path d="M12 21c-4 0-7-4.5-7-8.3C5 9.8 8 8.3 12 8.3s7 1.5 7 4.4c0 3.8-3 8.3-7 8.3Z" />
      <path d="M12 8.3c-1-1.9-2.9-2.8-5-2.4 1 1.9 2.9 2.8 5 2.4Z" />
      <path d="M12 8.3c1-1.9 2.9-2.8 5-2.4-1 1.9-2.9 2.8-5 2.4Z" />
      <path d="M12 8.3V3.5" />
      <Dots d="M9.5 12h.01M14.5 12h.01M12 14.5h.01M9.5 16.5h.01M14.5 16.5h.01M12 18.6h.01" />
    </>
  ),
  coffeeBean: (
    <g transform="rotate(35 12 12)">
      <ellipse cx="12" cy="12" rx="5.8" ry="8.6" />
      <path d="M12 3.6c-2.3 2.8 2.3 5.6 0 8.4s2.3 5.6 0 8.4" />
    </g>
  ),
  hotLatte: (
    <>
      <path d="M4.5 10h12v3.5a6 6 0 0 1-12 0Z" />
      <path d="M16.5 11.3h1.3a2.3 2.3 0 0 1 0 4.6h-1.9" />
      <path d="M3.5 21.5h14" />
      <path d="M8.5 7.5c-.9-1 .9-2 0-3.3" />
      <path d="M12.5 7.5c-.9-1 .9-2 0-3.3" />
      <path d="M10.5 14.6c-1.3-.9-1.9-1.6-1.9-2.2a.95.95 0 0 1 1.9-.3.95.95 0 0 1 1.9.3c0 .6-.6 1.3-1.9 2.2Z" />
    </>
  ),
  icedLatte: (
    <>
      <path d="M6.5 7h11l-1.4 13.1a1 1 0 0 1-1 .9H8.9a1 1 0 0 1-1-.9Z" />
      <path d="M14 12.5 15.4 2.5h2.6" />
      <rect x="8.4" y="10" width="3" height="3" rx=".6" transform="rotate(-12 9.9 11.5)" />
      <rect x="10.4" y="14.6" width="3" height="3" rx=".6" transform="rotate(10 11.9 16.1)" />
      <path d="M6.8 9.5h10.4" />
    </>
  ),
  frappe: (
    <>
      <path d="M7 11.5h10l-1.2 8.6a1 1 0 0 1-1 .9H9.2a1 1 0 0 1-1-.9Z" />
      <path d="M5.8 11.5h12.4" />
      <path d="M7.4 11.5a4.6 4.2 0 0 1 9.2 0" />
      <path d="M12.6 7.4 13.8 2.5h2.5" />
      <path d="M9.5 15h5" />
    </>
  ),
  smoothie: (
    <>
      <path d="M6 7h11l-1.5 13.1a1 1 0 0 1-1 .9H8.5a1 1 0 0 1-1-.9Z" />
      <path d="M10.3 12 8.6 2.5" />
      <path d="M14.8 7a3.2 3.2 0 0 1 6.4 0Z" />
      <path d="M18 7V4.3M18 7l-1.9-1.7M18 7l1.9-1.7" />
      <Dots d="M9.6 15h.01M12.5 13.5h.01M12 17.5h.01M14 16h.01" />
    </>
  ),
  wine: (
    <>
      <path d="M7.2 3h9.6l.2 3.8a5 5 0 0 1-10 0Z" />
      <path d="M7.1 7h9.8" />
      <path d="M12 11.8V20.5" />
      <path d="M8.5 20.5h7" />
    </>
  ),
  soda: (
    <>
      <path d="M10 2.5h4" />
      <path d="M10.5 2.5v3.2c0 1-2.5 2.4-2.5 5V20a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-9.3c0-2.6-2.5-4-2.5-5V2.5" />
      <path d="M8 13h8M8 17h8" />
    </>
  ),
  tea: (
    <>
      <path d="M3.5 11h12v3a6 6 0 0 1-12 0Z" />
      <path d="M15.5 12.3h1.3a2.3 2.3 0 0 1 0 4.6h-1.9" />
      <path d="M2.5 21.5h14" />
      <path d="M9.5 11V8c0-2 1.5-3.5 4-3.5h3" />
      <rect x="16.5" y="2.5" width="4" height="4.5" rx=".7" />
    </>
  ),
  plate: (
    <>
      <circle cx="12.5" cy="12" r="6" />
      <circle cx="12.5" cy="12" r="3.6" />
      <path d="M2.8 3.5v4.2M4.4 3.5v4.2M6 3.5v4.2M2.8 7.7a1.6 1.6 0 0 0 3.2 0M4.4 9.3v11.2" />
      <path d="M21.2 3.5c-1.5 1-2.1 3.8-2.1 7h2.1v10" />
    </>
  ),
  cup: (
    <>
      <path d="M4.5 9h12v4.5a6 6 0 0 1-12 0Z" />
      <path d="M16.5 10.5h1.3a2.3 2.3 0 0 1 0 4.6h-1.9" />
      <path d="M3.5 21.5h14" />
      <path d="M8.5 6.5c-.9-1 .9-2 0-3.3" />
      <path d="M12.5 6.5c-.9-1 .9-2 0-3.3" />
    </>
  ),
};

// El dibujo sale del nombre de la categoría (el base, en inglés/español), así
// sigue funcionando aunque se reordenen o se cambie el emoji desde el panel.
// El orden importa: lo más específico primero.
const CATEGORY_RULES: [RegExp, CategoryIconKey][] = [
  [/garden|huerto|verde/i, "gardenBowl"],
  [/pancake|tortita/i, "pancakes"],
  [/banana|bread|pan de/i, "loaf"],
  [/toast|tostad/i, "toast"],
  [/burger|hamburgues/i, "burger"],
  [/topping/i, "toppings"],
  [/extra/i, "extras"],
  [/bowl/i, "bowl"],
  [/iced latte|latte.*(frí|fri|ice)|ice.*latte/i, "icedLatte"],
  [/frapp/i, "frappe"],
  [/latte/i, "hotLatte"],
  [/coffee|café|cafe/i, "coffeeBean"],
  [/smoothie|batido|zumo|juice/i, "smoothie"],
  [/alcoh|wine|vino|cocktail|cóctel|beer|cerveza/i, "wine"],
  [/soft|refresc|soda/i, "soda"],
  [/tea|té|infus/i, "tea"],
];

export function categoryIconKey(name: string, menu: "food" | "drinks"): CategoryIconKey {
  for (const [re, key] of CATEGORY_RULES) if (re.test(name)) return key;
  return menu === "drinks" ? "cup" : "plate";
}

export function CategoryIcon({ name, menu, className }: IconProps & { name: string; menu: "food" | "drinks" }) {
  return <Svg className={className}>{CATEGORY_PATHS[categoryIconKey(name, menu)]}</Svg>;
}

export function MenuTypeIcon({ type, className }: IconProps & { type: "food" | "drinks" }) {
  return <Svg className={className}>{CATEGORY_PATHS[type === "food" ? "plate" : "cup"]}</Svg>;
}

/* ── Alérgenos (los 14 de declaración obligatoria en la UE) ── */

const ALLERGEN_PATHS: Record<string, ReactNode> = {
  gluten: (
    <>
      <path d="M12 21.5V8" />
      <path d="M12 8c-1.2-1.3-1.2-3.5 0-5 1.2 1.5 1.2 3.7 0 5Z" />
      <path d="M12 12c-2.4 0-4-1.5-4-3.8 2.4 0 4 1.5 4 3.8Z" />
      <path d="M12 12c2.4 0 4-1.5 4-3.8-2.4 0-4 1.5-4 3.8Z" />
      <path d="M12 16c-2.4 0-4-1.5-4-3.8 2.4 0 4 1.5 4 3.8Z" />
      <path d="M12 16c2.4 0 4-1.5 4-3.8-2.4 0-4 1.5-4 3.8Z" />
    </>
  ),
  eggs: <path d="M12 3c3.4 0 6 5.4 6 10a6 6 0 0 1-12 0c0-4.6 2.6-10 6-10Z" />,
  dairy: (
    <>
      <path d="M9.5 2.5h5" />
      <path d="M10 2.5v3L8 9v11a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9l-2-3.5v-3" />
      <path d="M8 13h8" />
    </>
  ),
  fish: (
    <>
      <path d="M2.5 12c3-4.5 9-6 14-2l3.5-2.5-1 4.5 1 4.5-3.5-2.5c-5 4-11 2.5-14-2Z" />
      <Dots d="M7 11.2h.01" />
    </>
  ),
  shellfish: (
    <>
      <path d="M19 12a7 7 0 0 1-7 7c-1.8 0-3-.8-3-2s1.2-2 3-2a3 3 0 0 0 0-6H5c0-3 3-5 7-5a7 7 0 0 1 7 8Z" />
      <path d="M14.8 6.3 13.6 9M18 10l-2.8 1.1M17.4 15l-2.5-1.3" />
      <path d="M9 17.3 6 18.5l1 2.5" />
      <path d="M5.5 6C4.5 4.5 3 4 2 4" />
    </>
  ),
  nuts: (
    <>
      <path d="M4.5 10a7.5 4.8 0 0 1 15 0Z" />
      <path d="M6.3 10c0 5 2.7 9.5 5.7 11 3-1.5 5.7-6 5.7-11" />
      <path d="M12 5.2V2.5" />
    </>
  ),
  peanuts: (
    <g transform="rotate(-30 12 12)">
      <path d="M12 3.5a4 4 0 0 1 4 4c0 1.5-.8 2.3-.8 3.5s.8 2 .8 3.5a4 4 0 0 1-8 0c0-1.5.8-2.3.8-3.5S8 9 8 7.5a4 4 0 0 1 4-4Z" />
      <Dots d="M11 6.5h.01M13 8h.01M11 14h.01M13 15.5h.01" />
    </g>
  ),
  soy: (
    <>
      <path d="M4 18c1-6.5 6.5-12 13.5-13 1.5 0 2.5.8 2.5 2-1 7-6.5 13-13.5 13C5 20 4 19.3 4 18Z" />
      <circle cx="8.8" cy="15.2" r="1.7" />
      <circle cx="12" cy="12" r="1.7" />
      <circle cx="15.2" cy="8.8" r="1.7" />
    </>
  ),
  sesame: (
    <>
      <path d="M8 4c1.6 1.6 1.6 4.4 0 6-1.6-1.6-1.6-4.4 0-6Z" transform="rotate(-25 8 7)" />
      <path d="M16 6c1.6 1.6 1.6 4.4 0 6-1.6-1.6-1.6-4.4 0-6Z" transform="rotate(30 16 9)" />
      <path d="M11 13c1.6 1.6 1.6 4.4 0 6-1.6-1.6-1.6-4.4 0-6Z" transform="rotate(10 11 16)" />
    </>
  ),
  mustard: (
    <>
      <path d="M11.3 1.5h1.4l.3 2.5h-2Z" />
      <path d="M10 4h4l1 2.5H9Z" />
      <path d="M8.5 6.5h7l.5 2.5v11a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V9Z" />
      <path d="M8 12.5h8" />
    </>
  ),
  celery: (
    <>
      <path d="M9.2 21c-.6-4.5-.3-9.5.8-13.5" />
      <path d="M12 21V6.5" />
      <path d="M14.8 21c.6-4.5.3-9.5-.8-13.5" />
      <path d="M10 7.5C8 7 7 5.5 7 3.5c2 0 3.5 1 3 4Z" />
      <path d="M12 6.5c-1.1-1.5-1.1-3 0-4.5 1.1 1.5 1.1 3 0 4.5Z" />
      <path d="M14 7.5c2-.5 3-2 3-4-2 0-3.5 1-3 4Z" />
      <path d="M8.3 21h7.4" />
    </>
  ),
  sulfites: (
    <>
      <circle cx="9" cy="9.5" r="1.9" />
      <circle cx="12.8" cy="9.5" r="1.9" />
      <circle cx="16.6" cy="9.5" r="1.9" />
      <circle cx="10.9" cy="13" r="1.9" />
      <circle cx="14.7" cy="13" r="1.9" />
      <circle cx="12.8" cy="16.5" r="1.9" />
      <path d="M12.8 7.6V4.5c0-.8 1.2-2 3.2-2" />
    </>
  ),
  lupin: (
    <>
      <path d="M12 21V9" />
      <circle cx="12" cy="5" r="1.3" />
      <circle cx="10.5" cy="8" r="1.3" />
      <circle cx="13.5" cy="8" r="1.3" />
      <circle cx="10.5" cy="11.2" r="1.3" />
      <circle cx="13.5" cy="11.2" r="1.3" />
      <path d="M12 17.5c-2-1.2-4.2-1.2-6.5 0M12 17.5c2-1.2 4.2-1.2 6.5 0" />
    </>
  ),
  molluscs: (
    <>
      <path d="M12 20 4.2 10.5a7.8 7 0 0 1 15.6 0Z" />
      <path d="M12 20 7.5 4.8M12 20V3.5M12 20l4.5-15.2" />
      <path d="M10 21h4" />
    </>
  ),
};

export function AllergenIcon({ id, className }: IconProps & { id: string }) {
  const paths = ALLERGEN_PATHS[id];
  if (!paths) return null;
  return <Svg className={className}>{paths}</Svg>;
}

/* ── Campana de servicio (popup "¿Ya sabes qué vas a pedir?") ── */

export function ServiceBellIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4.5 17a7.5 7.5 0 0 1 15 0" />
      <path d="M3 17h18" />
      <path d="M4 20.5h16" />
      <path d="M12 9.5V7.5" />
      <path d="M10.3 7.5h3.4" />
      <path d="M8 13.5a4.2 4.2 0 0 1 2.2-2.2" />
    </Svg>
  );
}
