"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Lang, LANGS, ui } from "@/lib/i18n";
import { LocationPinIcon, ReceiptIcon, ServiceBellIcon, StarIcon } from "./icons";
import { GOOGLE_REVIEW_URL } from "@/lib/links";
import { GeoReading, isNearVenue } from "@/lib/venue";

const TABLE_KEY = "plenty-table-number";
const TEST_KEY = "plenty-test-call";
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

type Status = "idle" | "geoAsk" | "modal" | "sending" | "sent" | "survey" | "surveyLow" | "surveyHappy" | "surveyDone" | "cooldown";
type RequestType = "order" | "bill";

// Estado de la comprobación "¿estás en Plenty?" que se hace al abrir el modal
type GeoState =
  | { state: "checking" }
  | { state: "ok"; reading: GeoReading }
  | { state: "test" }
  | { state: "denied" | "far" | "unavailable" };

interface Props {
  lang: Lang;
  onChangeLang: (l: Lang) => void;
}

export function OrderReadyButton({ lang, onChangeLang }: Props) {
  const t = ui[lang];
  const currentLang = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  const [status, setStatus] = useState<Status>("idle");
  const [tableNumber, setTableNumber] = useState(1);
  const [requestType, setRequestType] = useState<RequestType>("order");
  const [error, setError] = useState("");
  // Encuesta de satisfaccion al pedir la cuenta: estrella elegida y, si es
  // baja, un comentario opcional antes de enviar el feedback.
  const [surveyRating, setSurveyRating] = useState<number | null>(null);
  const [surveyComment, setSurveyComment] = useState("");
  const [surveySending, setSurveySending] = useState(false);
  const [geo, setGeo] = useState<GeoState>({ state: "checking" });
  // Modo prueba (solo para el dueño): con la contraseña del servidor se puede
  // avisar sin estar en el local. Se recuerda durante la sesión del navegador.
  const [testPassword, setTestPassword] = useState<string | null>(null);
  const [testFormOpen, setTestFormOpen] = useState(false);
  const [testInput, setTestInput] = useState("");
  const [testError, setTestError] = useState("");
  const [testChecking, setTestChecking] = useState(false);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(TEST_KEY);
      if (saved) setTestPassword(saved);
    } catch {}
  }, []);
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
  const geoAskBackdropRef = useRef<HTMLDivElement>(null);
  const geoAskCardRef = useRef<HTMLDivElement>(null);

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
            rotate: 12, duration: 0.18, ease: "sine.inOut", repeat: 7, yoyo: true, transformOrigin: "50% 90%",
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
  // Entrada del aviso de ubicación: fundido suave del fondo, la tarjeta sube
  // y crece con una curva larga, el pin "cae" y sus ondas laten despacio.
  useEffect(() => {
    if (status !== "geoAsk") return;
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.fromTo(geoAskBackdropRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: "power2.out" });
      if (reduced) {
        tl.fromTo(geoAskCardRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, "<");
        return;
      }
      tl.fromTo(geoAskCardRef.current,
          { autoAlpha: 0, y: 24, scale: 0.94 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.9 }, "-=0.25")
        .fromTo(".geo-ask-pin", { y: -14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: "bounce.out" }, "-=0.6")
        .fromTo(".geo-ask-line", { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.07 }, "-=0.55")
        .fromTo(".geo-ask-ring",
          { scale: 0.6, autoAlpha: 0.5 },
          { scale: 1.9, autoAlpha: 0, duration: 2.2, ease: "power1.out", repeat: -1, stagger: 1.1 }, "-=0.4");
    }, geoAskBackdropRef);
    return () => ctx.revert();
  }, [status]);

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
    if (status !== "sent" && status !== "surveyDone") return;
    gsap.fromTo(".order-sent-check",
      { scale: 0, rotate: -45 },
      { scale: 1, rotate: 0, duration: 0.5, ease: "back.out(2.5)" }
    );
  }, [status]);

  // Entrada suave al cambiar de paso dentro de la encuesta de satisfaccion
  useEffect(() => {
    if (status !== "survey" && status !== "surveyLow" && status !== "surveyHappy") return;
    gsap.fromTo(".survey-fade", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" });
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

  // Pide la ubicación al abrir el modal (no al confirmar): así, cuando el
  // cliente pulsa "Avisar al camarero" ya está comprobada y el sonido de
  // confirmación sigue sonando dentro del gesto, como exige Safari.
  function locate() {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setGeo({ state: "unavailable" });
      return;
    }
    setGeo({ state: "checking" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const reading = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy };
        // Si mientras tanto se activó el modo prueba, no lo pisamos
        setGeo((prev) => prev.state === "test" ? prev : isNearVenue(reading) ? { state: "ok", reading } : { state: "far" });
      },
      (err) => setGeo((prev) => prev.state === "test" ? prev : { state: err.code === err.PERMISSION_DENIED ? "denied" : "unavailable" }),
      { enableHighAccuracy: true, timeout: 12_000, maximumAge: 60_000 }
    );
  }

  // Si el permiso de ubicación ya está concedido, vamos directos al modal de
  // mesa. Si no, primero un aviso propio explicando para qué la usamos: la
  // petición del navegador sola, sin contexto, se rechaza mucho más.
  async function openModal() {
    if (status !== "idle") return;
    setError("");
    setRequestType("order");
    setSurveyRating(null);
    setSurveyComment("");
    if (testPassword) {
      setGeo({ state: "test" });
      setStatus("modal");
      return;
    }
    let granted = false;
    try {
      const perm = await navigator.permissions?.query({ name: "geolocation" as PermissionName });
      granted = perm?.state === "granted";
    } catch { /* navegadores sin Permissions API: mostramos el aviso */ }
    if (granted) {
      setStatus("modal");
      locate();
    } else {
      setStatus("geoAsk");
    }
  }

  function closeGeoAsk(next: () => void) {
    const tl = gsap.timeline({ onComplete: next });
    tl.to(geoAskCardRef.current, { autoAlpha: 0, y: 12, scale: 0.97, duration: 0.28, ease: "power2.in" })
      .to(geoAskBackdropRef.current, { autoAlpha: 0, duration: 0.25, ease: "power2.in" }, "-=0.12");
  }

  // La petición del navegador se lanza aquí, dentro del toque del cliente
  // (iOS la ignora si no viene de un gesto).
  function allowLocation() {
    locate();
    closeGeoAsk(() => setStatus("modal"));
  }

  async function unlockTestMode(e: React.FormEvent) {
    e.preventDefault();
    if (!testInput) return;
    setTestChecking(true);
    setTestError("");
    try {
      const res = await fetch("/api/table-calls/test-unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: testInput }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok) {
        setTestPassword(testInput);
        try { sessionStorage.setItem(TEST_KEY, testInput); } catch {}
        setGeo({ state: "test" });
        setTestFormOpen(false);
        setTestInput("");
      } else {
        setTestError(d.error || "Contraseña incorrecta");
      }
    } catch {
      setTestError("No se pudo comprobar. Inténtalo de nuevo.");
    }
    setTestChecking(false);
  }

  function exitTestMode() {
    setTestPassword(null);
    try { sessionStorage.removeItem(TEST_KEY); } catch {}
    locate();
  }

  function closeModal() {
    const tl = gsap.timeline({ onComplete: () => setStatus("idle") });
    tl.to(modalCardRef.current, { autoAlpha: 0, y: 32, scale: 0.96, duration: 0.22, ease: "power2.in" })
      .to(modalBackdropRef.current, { autoAlpha: 0, duration: 0.2 }, "-=0.1");
  }

  // Cierra todo el flujo (tras confirmar, o tras la encuesta) y entra en cooldown
  function fadeToCooldown() {
    const tl = gsap.timeline({ onComplete: () => setStatus("cooldown") });
    tl.to(modalCardRef.current, { autoAlpha: 0, y: 32, scale: 0.96, duration: 0.25, ease: "power2.in" })
      .to(modalBackdropRef.current, { autoAlpha: 0, duration: 0.2 }, "-=0.1");
  }

  async function sendFeedback(rating: number, comment: string | null) {
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableNumber, rating, comment }),
      });
    } catch {
      // La encuesta es opcional — si falla el envio, no bloqueamos al cliente
    }
  }

  // Estrella elegida: si es alta vamos directos a pedir reseña en Google; si
  // es baja, pedimos un comentario privado antes de dar las gracias.
  function rateSurvey(rating: number) {
    setSurveyRating(rating);
    if (rating >= 4) {
      sendFeedback(rating, null);
      setStatus("surveyHappy");
    } else {
      setStatus("surveyLow");
    }
  }

  async function submitLowSurvey(comment: string | null) {
    if (!surveyRating) return;
    setSurveySending(true);
    await sendFeedback(surveyRating, comment);
    setSurveySending(false);
    setStatus("surveyDone");
    setTimeout(fadeToCooldown, 1600);
  }

  function openGoogleReview() {
    fadeToCooldown();
  }


  async function confirmCall() {
    if (geo.state !== "ok" && geo.state !== "test") return;
    vibrate(15);
    playConfirmSound();
    setStatus("sending");
    setError("");
    localStorage.setItem(TABLE_KEY, String(tableNumber));
    try {
      const res = await fetch("/api/table-calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geo.state === "test"
          ? { tableNumber, type: requestType, testPassword }
          : { tableNumber, type: requestType, ...geo.reading }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        if (d.code === "too_far") { setGeo({ state: "far" }); setStatus("modal"); return; }
        if (d.code === "location_required") { setGeo({ state: "unavailable" }); setStatus("modal"); return; }
        throw new Error();
      }
      setStatus("sent");
      if (requestType === "bill") {
        // Al pedir la cuenta, tras el check de confirmación entra la encuesta
        // rápida en vez de cerrarse directamente — mismo modal, sin perder el sitio.
        setTimeout(() => setStatus("survey"), 1600);
      } else {
        setTimeout(fadeToCooldown, 1600);
      }
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
                <span>{currentLang.label}</span>
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
              <div ref={ringRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-emerald-400/30" style={{ opacity: 0 }} />
              <div ref={waveRef} className="order-hint-line relative text-emerald-500 dark:text-emerald-400">
                <ServiceBellIcon className="w-16 h-16" />
              </div>
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

      {/* Aviso previo de ubicación — pequeño, centrado y discreto */}
      {status === "geoAsk" && (
        <div
          ref={geoAskBackdropRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-espresso/40 dark:bg-black/60 backdrop-blur-[6px] px-6"
          style={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && closeGeoAsk(() => setStatus("idle"))}
        >
          <div
            ref={geoAskCardRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="geo-ask-title"
            className="relative w-full max-w-[320px] bg-gradient-to-b from-white to-brand-parchment dark:from-brand-espresso dark:to-[#170b03] rounded-[28px] shadow-elevated ring-1 ring-brand-stone/60 dark:ring-brand-roast px-7 pt-8 pb-6 text-center"
            style={{ opacity: 0 }}
          >
            {/* Pin con ondas suaves */}
            <div className="relative mx-auto mb-5 w-16 h-16 flex items-center justify-center">
              <span className="geo-ask-ring absolute inset-0 rounded-full bg-brand-caramel/20 dark:bg-brand-honey/15" />
              <span className="geo-ask-ring absolute inset-0 rounded-full bg-brand-caramel/20 dark:bg-brand-honey/15" />
              <span className="relative w-14 h-14 rounded-full bg-gradient-to-br from-white to-brand-sand dark:from-brand-roast dark:to-brand-espresso ring-1 ring-brand-stone dark:ring-brand-roast shadow-card-pop-mobile dark:shadow-none flex items-center justify-center">
                <LocationPinIcon className="geo-ask-pin w-7 h-7 text-brand-caramel dark:text-brand-honey" />
              </span>
            </div>

            <h3 id="geo-ask-title" className="geo-ask-line font-serif text-[22px] leading-tight font-semibold text-brand-espresso dark:text-brand-cream">
              {t.geoAskTitle}
            </h3>
            <p className="geo-ask-line mt-2 font-sans text-[14px] leading-relaxed text-brand-muted dark:text-brand-honey/60">
              {t.geoAskDesc}
            </p>
            <p className="geo-ask-line mt-3 inline-flex items-center gap-1.5 font-sans text-[11px] text-brand-muted/80 dark:text-brand-honey/45">
              <svg className="w-3 h-3 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <rect x="5" y="11" width="14" height="10" rx="2" strokeWidth={2} />
                <path strokeLinecap="round" strokeWidth={2} d="M8 11V7a4 4 0 018 0v4" />
              </svg>
              {t.geoAskPrivacy}
            </p>

            <button
              onClick={allowLocation}
              className="geo-ask-line mt-6 w-full bg-brand-espresso dark:bg-brand-honey text-brand-cream dark:text-brand-espresso font-sans text-sm font-semibold py-3.5 rounded-2xl shadow-[0_8px_20px_-8px_rgba(28,13,4,0.5)] active:scale-[0.98]"
            >
              {t.geoAskAllow}
            </button>
            <button
              onClick={() => closeGeoAsk(() => setStatus("idle"))}
              className="geo-ask-line mt-2 w-full font-sans text-[13px] text-brand-muted dark:text-brand-honey/50 hover:text-brand-espresso dark:hover:text-brand-honey py-2"
            >
              {t.geoAskLater}
            </button>
          </div>
        </div>
      )}

      {/* Modal de selección de mesa (y, tras pedir la cuenta, la encuesta) */}
      {(status === "modal" || status === "sending" || status === "sent"
        || status === "survey" || status === "surveyLow" || status === "surveyHappy" || status === "surveyDone") && (
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
                  {requestType === "bill" ? t.billSuccessTitle : t.successTitle}
                </h3>
                <p className="font-sans text-sm text-brand-muted dark:text-brand-honey/60">
                  {requestType === "bill" ? t.billSuccessDesc : t.successDesc} {tableNumber}.
                </p>
              </div>
            ) : status === "survey" ? (
              <div className="survey-fade text-center py-2">
                <h3 className="font-serif text-lg font-semibold text-brand-espresso dark:text-brand-cream mb-1">
                  {t.surveyTitle}
                </h3>
                <p className="font-sans text-sm text-brand-muted dark:text-brand-honey/60 mb-5">
                  {t.surveyDesc}
                </p>
                <div className="flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => rateSurvey(n)}
                      aria-label={`${n} / 5`}
                      className="p-2 text-brand-stone dark:text-brand-roast hover:text-amber-400 dark:hover:text-amber-400 active:scale-90 transition-colors"
                    >
                      <StarIcon className="w-8 h-8" />
                    </button>
                  ))}
                </div>
              </div>
            ) : status === "surveyLow" ? (
              <div className="survey-fade">
                <h3 className="font-serif text-lg font-semibold text-brand-espresso dark:text-brand-cream mb-1">
                  {t.surveyLowTitle}
                </h3>
                <p className="font-sans text-sm text-brand-muted dark:text-brand-honey/60 mb-3">
                  {t.surveyLowDesc}
                </p>
                <textarea
                  value={surveyComment}
                  onChange={(e) => setSurveyComment(e.target.value)}
                  rows={3}
                  placeholder={t.surveyLowPlaceholder}
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-stone dark:border-brand-roast bg-white dark:bg-brand-espresso text-brand-espresso dark:text-brand-cream placeholder:text-brand-muted/50 dark:placeholder:text-brand-honey/30 font-sans text-[16px] resize-none focus:outline-none focus:ring-2 focus:ring-brand-caramel/25"
                />
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => submitLowSurvey(null)}
                    disabled={surveySending}
                    className="flex-1 border border-brand-stone dark:border-brand-roast text-brand-muted dark:text-brand-honey/60 font-sans py-2.5 rounded-xl text-sm font-medium disabled:opacity-50"
                  >
                    {t.surveyLowSkip}
                  </button>
                  <button
                    onClick={() => submitLowSurvey(surveyComment.trim() || null)}
                    disabled={surveySending}
                    className="flex-1 bg-brand-espresso dark:bg-brand-honey text-brand-cream dark:text-brand-espresso font-sans py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
                  >
                    {surveySending ? "…" : t.surveyLowSubmit}
                  </button>
                </div>
              </div>
            ) : status === "surveyHappy" ? (
              <div className="survey-fade text-center py-2">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
                  <StarIcon className="w-7 h-7 text-amber-500" filled />
                </div>
                <h3 className="font-serif text-lg font-semibold text-brand-espresso dark:text-brand-cream mb-1">
                  {t.surveyHappyTitle}
                </h3>
                <p className="font-sans text-sm text-brand-muted dark:text-brand-honey/60 mb-5">
                  {t.surveyHappyDesc}
                </p>
                <a
                  href={GOOGLE_REVIEW_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={openGoogleReview}
                  className="block w-full bg-brand-espresso dark:bg-brand-honey text-brand-cream dark:text-brand-espresso font-sans font-semibold py-3 rounded-xl text-sm tracking-wide text-center"
                >
                  {t.surveyHappyBtn}
                </a>
                <button
                  onClick={fadeToCooldown}
                  className="mt-2 w-full font-sans text-[13px] text-brand-muted dark:text-brand-honey/50 hover:text-brand-espresso dark:hover:text-brand-honey py-2"
                >
                  {t.surveyHappySkip}
                </button>
              </div>
            ) : status === "surveyDone" ? (
              <div className="text-center py-4 survey-fade">
                <div className="order-sent-check w-14 h-14 mx-auto mb-3 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                  <svg className="w-7 h-7 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-serif text-lg font-semibold text-brand-espresso dark:text-brand-cream">
                  {t.surveyThanks}
                </h3>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-serif text-lg font-semibold text-brand-espresso dark:text-brand-cream">
                    {t.modalTitle}
                  </h3>
                  <div className="flex items-center gap-0.5">
                    {/* Acceso discreto al modo prueba (solo para el dueño) */}
                    <button
                      onClick={() => { setTestFormOpen((v) => !v); setTestError(""); }}
                      className="p-1.5 rounded-lg text-brand-muted/30 hover:text-brand-muted dark:text-brand-honey/20 dark:hover:text-brand-honey/60"
                      aria-label="Modo prueba"
                      title="Modo prueba"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 7a2 2 0 012 2m4 0a6 6 0 11-12 0 6 6 0 0112 0zM3 21l7.5-7.5" />
                      </svg>
                    </button>
                    <button onClick={closeModal} className="p-1.5 rounded-lg text-brand-muted hover:text-brand-espresso dark:hover:text-brand-honey" aria-label="Cerrar">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Pedir ya / La cuenta */}
                <div className="grid grid-cols-2 gap-2 mt-3 mb-4">
                  {(["order", "bill"] as RequestType[]).map((rt) => (
                    <button
                      key={rt}
                      type="button"
                      onClick={() => setRequestType(rt)}
                      className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-sans font-semibold transition-all border ${
                        requestType === rt
                          ? "bg-brand-espresso dark:bg-brand-honey text-brand-cream dark:text-brand-espresso border-brand-espresso dark:border-brand-honey"
                          : "border-brand-stone dark:border-brand-roast text-brand-muted dark:text-brand-honey/50 hover:text-brand-espresso dark:hover:text-brand-honey"
                      }`}
                    >
                      {rt === "order" ? <ServiceBellIcon className="w-4 h-4" /> : <ReceiptIcon className="w-4 h-4" />}
                      {rt === "order" ? t.orderButton : t.billButton}
                    </button>
                  ))}
                </div>

                {testFormOpen && geo.state !== "test" && (
                  <form onSubmit={unlockTestMode} className="mt-2 mb-3 flex gap-2">
                    <input
                      type="password"
                      value={testInput}
                      onChange={(e) => setTestInput(e.target.value)}
                      placeholder="Contraseña de prueba"
                      autoComplete="off"
                      autoFocus
                      className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-brand-stone dark:border-brand-roast bg-white dark:bg-brand-espresso text-brand-espresso dark:text-brand-cream font-sans text-[16px] placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-caramel/25"
                    />
                    <button
                      type="submit"
                      disabled={testChecking || !testInput}
                      className="flex-none px-3 py-2 rounded-xl bg-brand-espresso dark:bg-brand-honey text-brand-cream dark:text-brand-espresso font-sans text-xs font-semibold disabled:opacity-50"
                    >
                      {testChecking ? "…" : "Activar"}
                    </button>
                  </form>
                )}
                {testFormOpen && testError && geo.state !== "test" && (
                  <p className="-mt-1 mb-3 font-sans text-xs text-red-600">{testError}</p>
                )}
                <p className="font-sans text-sm text-brand-muted dark:text-brand-honey/50 mb-5">
                  {requestType === "bill" ? t.billModalDesc : t.modalDesc}
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

                {/* Comprobación de ubicación: solo se puede avisar desde el local */}
                {geo.state === "test" && (
                  <div className="flex items-center justify-between gap-2 bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 text-sky-800 dark:text-sky-300 font-sans text-xs px-3 py-2 rounded-xl mb-4">
                    <span>Modo prueba: sin comprobar ubicación</span>
                    <button onClick={exitTestMode} className="font-semibold underline underline-offset-2">Salir</button>
                  </div>
                )}
                {geo.state === "checking" && (
                  <div className="flex items-center justify-center gap-2 font-sans text-sm text-brand-muted dark:text-brand-honey/60 mb-4">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    {t.geoChecking}
                  </div>
                )}
                {(geo.state === "denied" || geo.state === "far" || geo.state === "unavailable") && (
                  <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 font-sans text-sm px-4 py-3 rounded-xl mb-4">
                    <p>{geo.state === "denied" ? t.geoDenied : geo.state === "far" ? t.geoFar : t.geoUnavailable}</p>
                    <button onClick={locate} className="mt-2 font-semibold underline underline-offset-2">
                      {t.geoRetry}
                    </button>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 font-sans text-sm px-4 py-2.5 rounded-xl mb-4">
                    {error}
                  </div>
                )}

                <button
                  onClick={confirmCall}
                  disabled={status === "sending" || (geo.state !== "ok" && geo.state !== "test")}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-white font-sans font-semibold py-3 rounded-xl text-sm tracking-wide transition-colors"
                >
                  {status === "sending"
                    ? (requestType === "bill" ? t.confirmBillBtnSending : t.confirmBtnSending)
                    : (requestType === "bill" ? t.confirmBillBtn : t.confirmBtn)}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
