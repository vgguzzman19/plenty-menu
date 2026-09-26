// Decoración de línea del hero: rama de cafeto (hojas + granos) y arco.
// Solo trazos finos en currentColor, pensados para ir a muy baja opacidad.

const LEAF = "M0 0C-9-12-9-30 0-42C9-30 9-12 0 0Z";

const LEAVES: { x: number; y: number; r: number; s?: number }[] = [
  { x: 20, y: 166, r: -62 },
  { x: 29, y: 146, r: 38 },
  { x: 45, y: 114, r: -55 },
  { x: 56, y: 96, r: 42 },
  { x: 78, y: 64, r: -48, s: 0.85 },
  { x: 90, y: 46, r: 46, s: 0.8 },
  { x: 108, y: 16, r: 22, s: 0.6 },
];

const BEANS: { x: number; y: number; r: number }[] = [
  { x: 36, y: 128, r: 20 },
  { x: 45, y: 131, r: -15 },
  { x: 68, y: 80, r: 25 },
];

export function HeroBranch({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 124 204" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 200C26 152 44 112 70 72S104 20 114 6" />
      {LEAVES.map(({ x, y, r, s = 1 }, i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
          <path d={LEAF} />
          <path d="M0-3V-38" />
        </g>
      ))}
      {BEANS.map(({ x, y, r }, i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
          <ellipse rx="4.6" ry="6.4" />
          <path d="M0-5.6c-1.6 2 1.6 3.6 0 5.6s1.6 3.6 0 5.6" />
        </g>
      ))}
    </svg>
  );
}

export function HeroArch({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 300 340" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M10 340V150A140 140 0 0 1 290 150V340" strokeWidth={1} />
      <path d="M24 340V152A126 126 0 0 1 276 152V340" strokeWidth={1} strokeDasharray="1 6" strokeLinecap="round" />
      <path d="M150 1.5l4 6.5-4 6.5-4-6.5Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
