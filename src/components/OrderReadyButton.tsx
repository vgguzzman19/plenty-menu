"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Lang, ui } from "@/lib/i18n";

const TABLE_KEY = "plenty-table-number";
const COOLDOWN_MS = 90_000;
const HINT_DELAY_MS = 4500;
const HINT_KEY = "plenty-order-hint-dismissed";

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
}

export function OrderReadyButton({ lang }: Props) {
  const t = ui[lang];

  const [status, setStatus] = useState<Status>("idle");
  const [tableNumber, setTableNumber] = useState(1);
  const [error, setError] = useState("");
  const [hintVisible, setHintVisible] = useState(false);
  const hintDismissedRef = useRef(false);

  const modalBackdropRef = useRef<HTMLDivElement>(null);
  const modalCardRef = useRef<HTMLDivElement>(null);
  const hintCardRef = useRef<HTMLDivElement>(null);

  // Recuerda la última mesa usada, para no tener que repetirla
  useEffect(() => {
    const saved = localStorage.getItem(TABLE_KEY);
    if (saved) setTableNumber(Math.max(1, parseInt(saved) || 1));
  }, []);

  // Show a non-blocking hint once per session, until dismissed or used.
  useEffect(() => {
    try { if (sessionStorage.getItem(HINT_KEY)) return; } catch {}
    const timer = setTimeout(() => {
      if (!hintDismissedRef.current) setHintVisible(true);
    }, HINT_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hintVisible || status !== "idle") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animation = gsap.fromTo(hintCardRef.current,
      { autoAlpha: 0, y: reduced ? 0 : 8 },
      { autoAlpha: 1, y: 0, duration: reduced ? 0 : 0.2, ease: "power2.out" }
    );
    return () => { animation.kill(); };
  }, [hintVisible, status]);

  // Entrada animada del modal de selección de mesa (solo al abrir)
  useEffect(() => {
    if (status !== "modal") return;
    const tl = gsap.timeline();
    tl.fromTo(modalBackdropRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: "power2.out" })
      .fromTo(modalCardRef.current,
        { autoAlpha: 0, y: 16, scale: 0.98 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.22, ease: "power2.out" },
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
    hintDismissedRef.current = true;
    setHintVisible(false);
    try { sessionStorage.setItem(HINT_KEY, "1"); } catch {}
  }

  function openModal() {
    if (status !== "idle") return;
    dismissHint();
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
        onClick={openModal}
        disabled={status === "cooldown" || status === "sending"}
        aria-label={t.orderButton}
        className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 pl-4 pr-5 h-12 rounded-full font-sans text-sm font-bold tracking-wide transition-all active:scale-[0.96] ${
          status === "cooldown"
            ? "bg-emerald-800 text-white cursor-not-allowed"
            : "bg-emerald-700 hover:bg-emerald-800 text-white shadow-md"
        }`}
      >
        <svg className="w-5 h-5 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.25} d="M5 13l4 4L19 7" />
        </svg>
        {status === "cooldown" ? t.orderButtonSent : t.orderButton}
      </button>

      {/* Compact hint beside the button, leaving the menu interactive. */}
      {hintVisible && status === "idle" && (
        <aside
          ref={hintCardRef}
          aria-label={t.hintBadge}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-2rem)] max-w-xs rounded-2xl border border-brand-stone dark:border-brand-roast bg-white dark:bg-brand-espresso px-4 py-3 shadow-card"
        >
          <p className="font-sans text-sm font-semibold text-brand-espresso dark:text-brand-cream">{t.hintTitle}</p>
          <p className="mt-1 font-sans text-xs leading-relaxed text-brand-brown/80 dark:text-brand-cream/75">{t.hintDesc}</p>
          <button onClick={dismissHint} className="mt-2 min-h-8 font-sans text-xs font-semibold text-brand-brown dark:text-brand-honey underline underline-offset-4">{t.hintButton}</button>
        </aside>
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
                <p className="font-sans text-sm text-brand-brown/80 dark:text-brand-cream/75">
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
                <p className="font-sans text-sm text-brand-brown/80 dark:text-brand-cream/75 mb-5">
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

                <p className="text-center font-sans text-[11px] text-amber-600 dark:text-amber-400 mb-4">
                  ⚠️ {t.tableWarning}
                </p>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 font-sans text-sm px-4 py-2.5 rounded-xl mb-4">
                    {error}
                  </div>
                )}

                <button
                  onClick={confirmCall}
                  disabled={status === "sending"}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-sans font-semibold py-3 rounded-xl text-sm tracking-wide transition-colors"
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
