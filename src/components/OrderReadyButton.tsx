"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Lang, LANGS, ui } from "@/lib/i18n";

const TABLE_KEY = "plenty-table-number";
const COOLDOWN_MS = 90_000;
const HINT_DELAY_MS = 4500;

// Vibración táctil — solo Android soporta la Vibration API del navegador,
// iOS Safari nunca la ha implementado. En iPhone esto simplemente no hace nada.
function vibrate(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

// "Ding" sintetizado con Web Audio — funciona en Android e iOS (a diferencia
// de la vibración). Debe llamarse directamente dentro del gesto de clic del
// usuario, sin ningún await antes: Safari bloquea el audio si no.
function playConfirmSound() {
  try {
    type WebkitWindow = typeof window & { webkitAudioContext?: typeof AudioContext };
    const AudioContextClass = window.AudioContext || (window as WebkitWindow).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + start);
      gain.gain.linearRampToValueAtTime(0.2, now + start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + start);
      osc.stop(now + start + duration);
    };

    playTone(880, 0, 0.12);      // A5
    playTone(1318.5, 0.1, 0.22); // E6 — ding-ding ascendente

    setTimeout(() => ctx.close(), 600);
  } catch {
    // Si el navegador bloquea el audio, simplemente no suena
  }
}

type Status = "idle" | "modal" | "sending" | "sent" | "cooldown";

interface Props {
  lang: Lang;
  onChangeLang: (l: Lang) => void;
}

export function OrderReadyButton({ lang, onChangeLang }: Props) {
  const t = ui[lang];
  const currentLang = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  const [status, setStatus] = useState<Status>("idle");
  const [tableNumber, setTableNumber] = useState(1);
  const [error, setError] = useState("");
  const [hintVisible, setHintVisible] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const modalBackdropRef = useRef<HTMLDivElement>(null);
  const modalCardRef = useRef<HTMLDivElement>(null);
  const hintBackdropRef = useRef<HTMLDivElement>(null);
  const hintCardRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const waveRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const langPanelRef = useRef<HTMLDivElement>(null);

  // Recuerda la última mesa usada, para no tener que repetirla
  useEffect(() => {
    const saved = localStorage.getItem(TABLE_KEY);
    if (saved) setTableNumber(Math.max(1, parseInt(saved) || 1));
  }, []);

  // Popup de onboarding — se muestra en cada carga de página, unos segundos después
  useEffect(() => {
    const timer = setTimeout(() => setHintVisible(true), HINT_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  // Entrada animada del popup de onboarding
  useEffect(() => {
    if (!hintVisible) return;
    vibrate([20, 40, 20]);
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (prefersReducedMotion) {
        tl.to(hintBackdropRef.current, { autoAlpha: 1, duration: 0.2 })
          .to(hintCardRef.current, { autoAlpha: 1, duration: 0.2 }, "<");
      } else {
        tl.to(hintBackdropRef.current, { autoAlpha: 1, duration: 0.3 })
          .fromTo(hintCardRef.current,
            { autoAlpha: 0, y: 50, scale: 0.88, rotate: -2 },
            { autoAlpha: 1, y: 0, scale: 1, rotate: 0, duration: 0.6, ease: "back.out(1.7)" },
            "-=0.1"
          )
          .fromTo(".order-hint-line",
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.09 },
            "-=0.3"
          )
          .to(waveRef.current, {
            rotate: 18, duration: 0.35, ease: "sine.inOut", repeat: 5, yoyo: true, transformOrigin: "70% 70%",
          }, "-=0.15")
          .to(arrowRef.current, { y: 10, duration: 0.55, ease: "sine.inOut", repeat: -1, yoyo: true }, "-=1.2")
          .fromTo(ringRef.current,
            { scale: 1, autoAlpha: 0.6 },
            { scale: 1.7, autoAlpha: 0, duration: 1.3, ease: "power1.out", repeat: -1 },
            "-=1.6"
          );
      }
    }, hintBackdropRef);
    return () => ctx.revert();
  }, [hintVisible]);

  // Desplegable de idioma dentro del popup
  useEffect(() => {
    if (!langOpen) return;
    const tl = gsap.fromTo(langPanelRef.current,
      { autoAlpha: 0, y: -8, scale: 0.94 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.28, ease: "back.out(1.8)" }
    );
    return () => { tl.kill(); };
  }, [langOpen]);

  function closeLangPanel(onComplete?: () => void) {
    gsap.to(langPanelRef.current, {
      autoAlpha: 0, y: -8, scale: 0.94, duration: 0.16, ease: "power2.in",
      onComplete: () => { setLangOpen(false); onComplete?.(); },
    });
  }

  function selectLang(code: Lang) {
    onChangeLang(code);
    closeLangPanel();
  }

  // Entrada animada del modal de selección de mesa (solo al abrir)
  useEffect(() => {
    if (status !== "modal") return;
    const tl = gsap.timeline();
    tl.fromTo(modalBackdropRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: "power2.out" })
      .fromTo(modalCardRef.current,
        { autoAlpha: 0, y: 48, scale: 0.95 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.3)" },
        "-=0.1"
      );
    return () => { tl.kill(); };
  }, [status]);

  // Rebote del check al confirmar
  useEffect(() => {
    if (status !== "sent") return;
    gsap.fromTo(".order-sent-check",
      { scale: 0, rotate: -45 },
      { scale: 1, rotate: 0, duration: 0.5, ease: "back.out(2.5)" }
    );
  }, [status]);

  // Vuelve a estar disponible pasado el cooldown
  useEffect(() => {
    if (status !== "cooldown") return;
    const t = setTimeout(() => setStatus("idle"), COOLDOWN_MS);
    return () => clearTimeout(t);
  }, [status]);

  function dismissHint() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tl = gsap.timeline({ onComplete: () => setHintVisible(false) });
    if (prefersReducedMotion) {
      tl.to([hintCardRef.current, hintBackdropRef.current], { autoAlpha: 0, duration: 0.15 });
    } else {
      tl.to(hintCardRef.current, { autoAlpha: 0, y: 24, scale: 0.92, duration: 0.25, ease: "power2.in" })
        .to(hintBackdropRef.current, { autoAlpha: 0, duration: 0.2 }, "-=0.1");
      gsap.fromTo(buttonRef.current,
        { scale: 1 },
        { scale: 1.08, duration: 0.35, repeat: 3, yoyo: true, ease: "power1.inOut" }
      );
    }
  }

  function openModal() {
    if (status !== "idle") return;
    setError("");
    setStatus("modal");
  }

  function closeModal() {
    const tl = gsap.timeline({ onComplete: () => setStatus("idle") });
    tl.to(modalCardRef.current, { autoAlpha: 0, y: 32, scale: 0.96, duration: 0.22, ease: "power2.in" })
      .to(modalBackdropRef.current, { autoAlpha: 0, duration: 0.2 }, "-=0.1");
  }

  async function confirmCall() {
    vibrate(15);
    playConfirmSound();
    setStatus("sending");
    setError("");
    localStorage.setItem(TABLE_KEY, String(tableNumber));
    try {
      const res = await fetch("/api/table-calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableNumber }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setTimeout(() => {
        const tl = gsap.timeline({ onComplete: () => setStatus("cooldown") });
        tl.to(modalCardRef.current, { autoAlpha: 0, y: 32, scale: 0.96, duration: 0.25, ease: "power2.in" })
          .to(modalBackdropRef.current, { autoAlpha: 0, duration: 0.2 }, "-=0.1");
      }, 1600);
    } catch {
      setError(t.errorMsg);
      setStatus("modal");
    }
  }

  return (
    <>
      {/* Botón flotante */}
      <button
        ref={buttonRef}
        onClick={openModal}
        disabled={status === "cooldown" || status === "sending"}
        aria-label={t.orderButton}
        className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 pl-4 pr-5 h-12 rounded-full font-sans text-sm font-bold tracking-wide transition-all active:scale-[0.96] ${
          status === "cooldown"
            ? "bg-emerald-700/50 text-white/70 cursor-not-allowed"
            : "bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_2px_4px_rgba(6,78,59,0.35),0_10px_24px_-6px_rgba(16,185,129,0.5),0_20px_40px_-12px_rgba(16,185,129,0.4),inset_0_1px_0_rgba(255,255,255,0.3)]"
        }`}
      >
        <svg className="w-5 h-5 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M5 13l4 4L19 7" />
        </svg>
        {status === "cooldown" ? t.orderButtonSent : t.orderButton}
      </button>

      {/* Popup de onboarding */}
      {hintVisible && (
        <div
          ref={hintBackdropRef}
          className="fixed inset-0 z-40 flex items-end justify-center bg-brand-espresso/70 backdrop-blur-md px-4 pb-28"
          style={{ opacity: 0 }}
        >
          <div
            ref={hintCardRef}
            className="relative bg-gradient-to-b from-white to-brand-parchment dark:from-brand-espresso dark:to-brand-roast/40 rounded-[32px] shadow-elevated ring-1 ring-emerald-500/20 max-w-sm sm:max-w-md w-full p-7 sm:p-9 text-center"
            style={{ opacity: 0 }}
          >
            {/* Cabecera: badge + selector de idioma, en línea normal (nunca se solapa con el resto) */}
            <div className="order-hint-line flex items-center justify-between mb-6">
              <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[11px] font-sans font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">
                ✨ {t.hintBadge}
              </span>

              <button
                onClick={() => (langOpen ? closeLangPanel() : setLangOpen(true))}
                aria-label={t.langLabel}
                className="flex items-center gap-1.5 bg-white/90 dark:bg-white/10 border border-brand-stone/60 dark:border-brand-roast rounded-full pl-2.5 pr-2 py-1.5 text-sm font-sans font-semibold text-brand-espresso dark:text-brand-cream shadow-sm"
              >
                <span className="text-lg leading-none">{currentLang.flag}</span>
                <svg className={`w-3.5 h-3.5 text-brand-muted dark:text-brand-honey/50 transition-transform ${langOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Panel de idioma — empuja el contenido, nunca lo tapa */}
            {langOpen && (
              <div
                ref={langPanelRef}
                className="grid grid-cols-2 gap-2 bg-white/70 dark:bg-black/20 border border-brand-stone/60 dark:border-brand-roast rounded-2xl p-2 mb-6"
                style={{ opacity: 0 }}
              >
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => selectLang(l.code)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-sans transition-colors ${
                      l.code === lang
                        ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-semibold"
                        : "text-brand-espresso dark:text-brand-cream hover:bg-white dark:hover:bg-white/5"
                    }`}
                  >
                    <span className="text-lg leading-none">{l.flag}</span>
                    <span className="flex-1 text-left truncate">{l.label}</span>
                    {l.code === lang && (
                      <svg className="w-3.5 h-3.5 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Icono con anillo pulsante */}
            <div className="relative flex justify-center mb-3">
              <div ref={ringRef} className="absolute w-24 h-24 rounded-full bg-emerald-400/30" style={{ opacity: 0 }} />
              <div ref={waveRef} className="order-hint-line relative text-7xl">👋</div>
            </div>

            <h3 className="order-hint-line font-serif text-2xl sm:text-3xl font-bold text-brand-espresso dark:text-brand-cream mb-3 leading-tight">
              {t.hintTitle}
            </h3>
            <p className="order-hint-line font-sans text-base text-brand-muted dark:text-brand-honey/60 mb-6 leading-relaxed">
              {t.hintDesc}
            </p>
            <div ref={arrowRef} className="order-hint-line flex justify-center mb-2">
              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m0 0l-6-6m6 6l6-6" />
              </svg>
            </div>
            <button
              onClick={dismissHint}
              className="order-hint-line mt-3 w-full bg-brand-espresso dark:bg-brand-honey text-brand-cream dark:text-brand-espresso font-sans text-base font-bold py-4 rounded-2xl shadow-[0_8px_20px_-6px_rgba(28,13,4,0.45)]"
            >
              {t.hintButton}
            </button>
          </div>
        </div>
      )}

      {/* Modal de selección de mesa */}
      {(status === "modal" || status === "sending" || status === "sent") && (
        <div
          ref={modalBackdropRef}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-brand-espresso/60 dark:bg-black/75 backdrop-blur-sm px-0 sm:px-4"
          style={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && status === "modal" && closeModal()}
        >
          <div
            ref={modalCardRef}
            className="bg-white dark:bg-brand-espresso rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm shadow-elevated overflow-hidden px-6 py-6"
            style={{ opacity: 0 }}
          >
            {status === "sent" ? (
              <div className="text-center py-4">
                <div className="order-sent-check w-14 h-14 mx-auto mb-3 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                  <svg className="w-7 h-7 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-serif text-lg font-semibold text-brand-espresso dark:text-brand-cream mb-1">
                  {t.successTitle}
                </h3>
                <p className="font-sans text-sm text-brand-muted dark:text-brand-honey/60">
                  {t.successDesc} {tableNumber}.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-serif text-lg font-semibold text-brand-espresso dark:text-brand-cream">
                    {t.modalTitle}
                  </h3>
                  <button onClick={closeModal} className="p-1.5 rounded-lg text-brand-muted hover:text-brand-espresso dark:hover:text-brand-honey" aria-label="Cerrar">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="font-sans text-sm text-brand-muted dark:text-brand-honey/50 mb-5">
                  {t.modalDesc}
                </p>

                <div className="flex items-center justify-center gap-4 mb-5">
                  <button
                    onClick={() => setTableNumber((n) => Math.max(1, n - 1))}
                    aria-label="Restar mesa"
                    className="w-11 h-11 rounded-full border border-brand-stone dark:border-brand-roast text-brand-espresso dark:text-brand-cream text-xl font-semibold flex items-center justify-center hover:border-brand-caramel/50 transition-colors"
                  >
                    −
                  </button>
                  <span className="font-serif text-4xl font-semibold text-brand-espresso dark:text-brand-cream w-16 text-center tabular-nums">
                    {tableNumber}
                  </span>
                  <button
                    onClick={() => setTableNumber((n) => n + 1)}
                    aria-label="Sumar mesa"
                    className="w-11 h-11 rounded-full border border-brand-stone dark:border-brand-roast text-brand-espresso dark:text-brand-cream text-xl font-semibold flex items-center justify-center hover:border-brand-caramel/50 transition-colors"
                  >
                    +
                  </button>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 font-sans text-sm px-4 py-2.5 rounded-xl mb-4">
                    {error}
                  </div>
                )}

                <button
                  onClick={confirmCall}
                  disabled={status === "sending"}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-white font-sans font-semibold py-3 rounded-xl text-sm tracking-wide transition-colors"
                >
                  {status === "sending" ? t.confirmBtnSending : t.confirmBtn}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
