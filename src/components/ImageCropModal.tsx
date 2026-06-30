"use client";

import { useRef, useState, useEffect } from "react";

interface Props {
  file: File;
  onConfirm: (blob: Blob) => void;
  onCancel: () => void;
}

export function ImageCropModal({ file, onConfirm, onCancel }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgSrc, setImgSrc] = useState("");
  const [imgNatural, setImgNatural] = useState({ w: 0, h: 0 });
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  // Refs for stale-closure-safe access in non-React event handlers
  const scaleRef = useRef(scale);
  const offsetRef = useRef(offset);
  const imgNaturalRef = useRef(imgNatural);
  scaleRef.current = scale;
  offsetRef.current = offset;
  imgNaturalRef.current = imgNatural;

  const dragRef = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);
  const touchRef = useRef<{ x: number; y: number; ox: number; oy: number; d?: number; os?: number } | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImgSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function handleImgLoad() {
    const img = imgRef.current;
    const container = containerRef.current;
    if (!img || !container) return;
    const containerSize = container.getBoundingClientRect().width;
    const nat = { w: img.naturalWidth, h: img.naturalHeight };
    setImgNatural(nat);
    imgNaturalRef.current = nat;
    const minS = containerSize / Math.min(nat.w, nat.h);
    setScale(minS);
    scaleRef.current = minS;
    setOffset({ x: 0, y: 0 });
  }

  // Non-passive wheel + touchmove
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const getMinScale = () => {
      const img = imgRef.current;
      const size = el.getBoundingClientRect().width;
      if (!img) return 0.1;
      return size / Math.min(img.naturalWidth, img.naturalHeight);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const minS = getMinScale();
      setScale((s) => Math.max(minS, Math.min(s * (1 - e.deltaY * 0.0015), 8)));
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!touchRef.current) return;
      if (e.touches.length === 1) {
        const t = touchRef.current;
        setOffset({ x: t.ox + (e.touches[0].clientX - t.x), y: t.oy + (e.touches[0].clientY - t.y) });
      } else if (e.touches.length === 2 && touchRef.current.d && touchRef.current.os != null) {
        const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        const minS = getMinScale();
        setScale(Math.max(minS, Math.min(touchRef.current.os * (d / touchRef.current.d), 8)));
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  function onMouseDown(e: React.MouseEvent) {
    dragRef.current = { sx: e.clientX, sy: e.clientY, ox: offsetRef.current.x, oy: offsetRef.current.y };
    setDragging(true);
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!dragRef.current) return;
    setOffset({ x: dragRef.current.ox + (e.clientX - dragRef.current.sx), y: dragRef.current.oy + (e.clientY - dragRef.current.sy) });
  }
  function onMouseUp() { dragRef.current = null; setDragging(false); }

  function onTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 1) {
      touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, ox: offsetRef.current.x, oy: offsetRef.current.y };
    } else if (e.touches.length === 2) {
      const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      touchRef.current = { x: 0, y: 0, ox: offsetRef.current.x, oy: offsetRef.current.y, d, os: scaleRef.current };
    }
  }
  function onTouchEnd() { touchRef.current = null; }

  function handleCrop() {
    const img = imgRef.current;
    const container = containerRef.current;
    if (!img || !container) return;
    const containerSize = container.getBoundingClientRect().width;
    const { w: natW, h: natH } = imgNaturalRef.current;
    const s = scaleRef.current;
    const { x: ox, y: oy } = offsetRef.current;
    const srcX = (natW * s / 2 - ox - containerSize / 2) / s;
    const srcY = (natH * s / 2 - oy - containerSize / 2) / s;
    const srcSize = containerSize / s;
    const OUT = 1000;
    const canvas = document.createElement("canvas");
    canvas.width = OUT;
    canvas.height = OUT;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, srcX, srcY, srcSize, srcSize, 0, 0, OUT, OUT);
    canvas.toBlob((blob) => { if (blob) onConfirm(blob); }, "image/jpeg", 0.92);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm px-0 sm:px-4">
      <div className="bg-[#111] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md overflow-hidden shadow-elevated">

        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-base font-semibold text-white">Encuadrar imagen</h3>
            <p className="font-sans text-[11px] text-white/35 mt-0.5">Encuadra para móvil y PC a la vez</p>
          </div>
          <button onClick={onCancel} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Crop area — the full container IS the crop */}
        <div
          ref={containerRef}
          className="relative w-full overflow-hidden bg-black select-none"
          style={{ aspectRatio: "1/1", cursor: dragging ? "grabbing" : "grab" }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {imgSrc && (
            <img
              ref={imgRef}
              src={imgSrc}
              alt=""
              onLoad={handleImgLoad}
              draggable={false}
              style={{
                position: "absolute",
                width: imgNatural.w ? imgNatural.w * scale : "auto",
                height: imgNatural.h ? imgNatural.h * scale : "auto",
                left: "50%",
                top: "50%",
                transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
                userSelect: "none",
                pointerEvents: "none",
              }}
            />
          )}

          {/* ── Zona móvil: franja central 4:3 (75% alto del cuadrado) ── */}
          {/* Franja oscura superior — solo visible en PC */}
          <div className="absolute inset-x-0 top-0 pointer-events-none flex items-center justify-end pr-3" style={{ height: "12.5%", background: "rgba(0,0,0,0.55)" }}>
            <span className="font-sans text-[10px] font-medium text-white/50 tracking-widest uppercase">Solo 🖥️</span>
          </div>

          {/* Borde superior de la zona móvil */}
          <div className="absolute inset-x-0 border-t border-dashed border-white/40 pointer-events-none" style={{ top: "12.5%" }}>
            <span className="absolute left-2 -top-5 font-sans text-[10px] font-semibold text-white/60 tracking-wider">📱 Móvil</span>
          </div>

          {/* Borde inferior de la zona móvil */}
          <div className="absolute inset-x-0 border-b border-dashed border-white/40 pointer-events-none" style={{ bottom: "12.5%" }} />

          {/* Franja oscura inferior — solo visible en PC */}
          <div className="absolute inset-x-0 bottom-0 pointer-events-none flex items-center justify-end pr-3" style={{ height: "12.5%", background: "rgba(0,0,0,0.55)" }}>
            <span className="font-sans text-[10px] font-medium text-white/50 tracking-widest uppercase">Solo 🖥️</span>
          </div>

          {/* Esquinas del recorte PC (cuadrado completo) */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-white/60 pointer-events-none" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-white/60 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-white/60 pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-white/60 pointer-events-none" />
          <span className="absolute top-3 right-10 font-sans text-[10px] font-semibold text-white/60 tracking-wider pointer-events-none">🖥️ PC</span>
        </div>

        <p className="text-center font-sans text-[11px] text-white/25 py-2.5">
          Arrastra para mover · Pellizca o scroll para zoom
        </p>

        {/* Actions */}
        <div className="bg-white px-5 py-4 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-brand-stone text-brand-muted font-sans py-2.5 rounded-xl text-sm font-medium hover:bg-brand-parchment"
          >
            Cancelar
          </button>
          <button
            onClick={handleCrop}
            className="flex-1 bg-brand-caramel hover:bg-brand-brown text-white font-sans py-2.5 rounded-xl text-sm font-medium"
          >
            Usar esta imagen
          </button>
        </div>
      </div>
    </div>
  );
}
