import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame1Store } from "../stores/game1Store";
import { R } from "../lib/routes";

type Phase = "inspire" | "bloque";

export default function Game1Respiration(): JSX.Element {
  const navigate = useNavigate();

  // ✅ Sélection séparée (pas d'objet recréé à chaque render)
  const secondesX = useGame1Store((s) => s.secondesX);
  const secondesY = useGame1Store((s) => s.secondesY);
  const reset = useGame1Store((s) => s.reset);

  // UI state
  const [phase, setPhase] = useState<Phase>("inspire");
  const [remaining, setRemaining] = useState<number>(0);

  // refs pour logique/cleanup
  const mountedRef = useRef(true);
  const timeoutRef = useRef<number | null>(null);

  const clearT = () => {
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const goHome = () => {
    if (!mountedRef.current) return;
    clearT();
    reset();
    navigate(R.game1, { replace: true });
  };

  const startCountdown = (sec: number, onDone: () => void) => {
    let t = sec;
    setRemaining(t);

    const tick = () => {
      if (!mountedRef.current) return;
      t -= 1;
      if (t <= 0) {
        onDone();
        return;
      }
      setRemaining(t);
      timeoutRef.current = window.setTimeout(tick, 1000);
    };

    clearT();
    timeoutRef.current = window.setTimeout(tick, 1000);
  };

  useEffect(() => {
    mountedRef.current = true;

    // Guard: on ne lance rien si X/Y manquent
    if (secondesX == null || secondesY == null) {
      navigate(R.game1, { replace: true });
      return () => {
        mountedRef.current = false;
      };
    }

    // Phase 1 — INSPIRE (Y sec)
    setPhase("inspire");
    setRemaining(secondesY);
    if (navigator.vibrate) navigator.vibrate([25]);

    startCountdown(secondesY, () => {
      if (!mountedRef.current) return;
      
      // Phase 2 — BLOQUE (X sec)
      setPhase("bloque");
      setRemaining(secondesX);
      if (navigator.vibrate) navigator.vibrate([15, 60, 15]);

      startCountdown(secondesX, () => {
        if (!mountedRef.current) return;
        goHome();
      });
    });

    return () => {
      mountedRef.current = false;
      clearT();
    };
    // ⚠️ On ne met PAS secondesX/secondesY/reset/navigate en deps
    //    ces valeurs ne doivent pas relancer l'effet.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // effet unique au montage

  const isInspire = phase === "inspire";
  
  // Dégradés dynamiques
  const bgGradient = isInspire 
    ? "from-emerald-600 via-emerald-700 to-black" 
    : "from-rose-600 via-rose-700 to-black";
  
  const label = isInspire ? "INSPIRE" : "BLOQUE";
  const instruction = isInspire ? "respire profondément" : "garde l'air";

  return (
    <div className={`min-h-screen w-full bg-gradient-to-b ${bgGradient} text-white flex items-center justify-center relative overflow-hidden`}>
      {/* Motif arcade subtil */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(45deg, rgba(255,255,255,.1) 0 2px, transparent 2px 8px), repeating-linear-gradient(-45deg, rgba(255,255,255,.05) 0 1px, transparent 1px 6px)",
        }}
      />

      {/* Halo lumineux pulsant */}
      <div
        aria-hidden
        className={`absolute inset-0 pointer-events-none ${isInspire ? 'bg-emerald-400/10' : 'bg-rose-400/10'} animate-pulse`}
        style={{
          background: isInspire 
            ? "radial-gradient(circle at center, rgba(16,185,129,0.15), transparent 60%)"
            : "radial-gradient(circle at center, rgba(244,63,94,0.15), transparent 60%)"
        }}
      />

      <div className="relative z-10 text-center select-none px-6">
        {/* Texte principal pulsant */}
        <div className={`text-5xl md:text-7xl font-extrabold tracking-wider drop-shadow-[0_6px_20px_rgba(0,0,0,.4)] ${isInspire ? 'text-emerald-100' : 'text-rose-100'} animate-pulse`}>
          {label}
        </div>
        
        {/* Compteur principal */}
        <div 
          className="mt-4 text-[72px] md:text-[120px] font-black leading-none drop-shadow-[0_8px_24px_rgba(0,0,0,.5)] text-white"
          aria-live="polite"
        >
          {remaining}
        </div>
        
        {/* Instruction subtile */}
        <div className={`mt-6 text-sm md:text-base uppercase tracking-[0.4em] opacity-80 ${isInspire ? 'text-emerald-200' : 'text-rose-200'} animate-pulse`}>
          {instruction}
        </div>

        {/* Indicateur de phase */}
        <div className="mt-8 flex justify-center">
          <div className={`w-20 h-1 rounded-full ${isInspire ? 'bg-emerald-300' : 'bg-rose-300'} shadow-lg`} />
        </div>
      </div>

      {/* Particules flottantes pour l'ambiance */}
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${isInspire ? 'bg-emerald-300/30' : 'bg-rose-300/30'} animate-pulse`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + i * 0.3}s`
            }}
          />
        ))}
      </div>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .animate-pulse,
          .animate-ping {
            animation: none;
          }
          * {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}