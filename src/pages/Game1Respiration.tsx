import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame1Store } from "../stores/game1Store";
import { R } from "../lib/routes";

type Phase = "inspire" | "bloque";

export default function Game1Respiration(): JSX.Element {
  const navigate = useNavigate();

  // Sélection séparée des valeurs Zustand
  const secondesX = useGame1Store((s) => s.secondesX);
  const secondesY = useGame1Store((s) => s.secondesY);
  const reset = useGame1Store((s) => s.reset);

  // État UI
  const [phase, setPhase] = useState<Phase>("inspire");
  const [remaining, setRemaining] = useState<number>(0);

  // Refs pour gestion de l'état et cleanup
  const mountedRef = useRef(true);
  const timeoutRef = useRef<number | null>(null);

  // Nettoyage des timeouts
  const clearT = () => {
    if (timeoutRef.current != null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Navigation sécurisée vers l'accueil
  const goHome = () => {
    if (!mountedRef.current) return;
    clearT();
    reset();
    navigate(R.game1, { replace: true });
  };

  // Fonction de countdown sécurisée
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

  // Effet principal - se lance une seule fois
  useEffect(() => {
    mountedRef.current = true;

    // Guard: redirection si valeurs manquantes
    if (secondesX == null || secondesY == null) {
      navigate(R.game1, { replace: true });
      return () => {
        mountedRef.current = false;
      };
    }

    // Phase 1 — INSPIRE (Y secondes)
    setPhase("inspire");
    setRemaining(secondesY);
    if (navigator.vibrate) navigator.vibrate([25]);

    startCountdown(secondesY, () => {
      if (!mountedRef.current) return;
      
      // Phase 2 — BLOQUE (X secondes)
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
    // ⚠️ Pas de dépendances pour éviter les re-exécutions
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isInspire = phase === "inspire";
  
  // Dégradés dynamiques selon la phase
  const bgGradient = isInspire 
    ? "from-emerald-600 via-emerald-700 to-black" 
    : "from-rose-600 via-rose-700 to-black";
  
  const label = isInspire ? "INSPIRE" : "BLOQUE";
  const instruction = isInspire ? "respire profondément" : "garde l'air";

  return (
    <div className={`min-h-screen w-full bg-gradient-to-b ${bgGradient} text-white flex items-center justify-center relative overflow-hidden`}>
      {/* Motif arcade subtil */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(45deg, rgba(255,255,255,.1) 0 2px, transparent 2px 8px), repeating-linear-gradient(-45deg, rgba(255,255,255,.05) 0 1px, transparent 1px 6px)",
        }}
      />

      {/* Halo lumineux pulsant selon la phase */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 pointer-events-none animate-pulse`}
        style={{
          background: isInspire 
            ? "radial-gradient(circle at center, rgba(16,185,129,0.15), transparent 60%)"
            : "radial-gradient(circle at center, rgba(244,63,94,0.15), transparent 60%)"
        }}
      />

      <div className="relative z-10 text-center select-none px-6 max-w-2xl">
        {/* Texte principal pulsant */}
        <div className={`text-6xl md:text-8xl font-extrabold tracking-wider drop-shadow-[0_6px_20px_rgba(0,0,0,.4)] ${isInspire ? 'text-emerald-100' : 'text-rose-100'} animate-pulse`}>
          {label}
        </div>
        
        {/* Compteur principal avec aria-live */}
        <div 
          className="mt-6 text-[100px] md:text-[140px] font-black leading-none drop-shadow-[0_8px_24px_rgba(0,0,0,.5)] text-white"
          aria-live="polite"
        >
          {remaining}
        </div>
        
        {/* Instruction subtile */}
        <div className={`mt-8 text-lg md:text-xl uppercase tracking-[0.4em] opacity-90 ${isInspire ? 'text-emerald-200' : 'text-rose-200'} animate-pulse`}>
          {instruction}
        </div>

        {/* Indicateur de progression */}
        <div className="mt-12 flex justify-center">
          <div className={`w-24 h-2 rounded-full ${isInspire ? 'bg-emerald-300' : 'bg-rose-300'} shadow-lg`} />
        </div>
      </div>

      {/* Particules flottantes pour l'ambiance */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-3 h-3 rounded-full ${isInspire ? 'bg-emerald-300/20' : 'bg-rose-300/20'} animate-pulse`}
            style={{
              left: `${15 + i * 10}%`,
              top: `${25 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${2.5 + i * 0.2}s`
            }}
          />
        ))}
      </div>

      {/* Support prefers-reduced-motion */}
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