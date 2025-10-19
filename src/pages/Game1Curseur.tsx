import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame1Store } from "../stores/game1Store";
import { R } from "../lib/routes";

/**
 * Game1Curseur - Mini-jeu curseur style Undertale
 * - Curseur en mouvement sawtooth (0% → 100% → 0%)
 * - Tap unique avec onPointerUp pour éviter doubles tirs
 * - Score Y = 4..12 selon précision au centre
 * - Navigation sécurisée et effets arcade
 */
export default function Game1Curseur(): JSX.Element {
  const navigate = useNavigate();
  const secondesX = useGame1Store((s) => s.secondesX);
  const setY = useGame1Store((s) => s.setY);

  // État du jeu
  const [position, setPosition] = useState(0); // Position curseur 0-100%
  const [locked, setLocked] = useState(false); // Verrouillage après tir
  const [scoreY, setScoreY] = useState<number | null>(null);
  const [label, setLabel] = useState<string>("");
  const [showImpact, setShowImpact] = useState(false);

  // Refs pour animation et cleanup
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(true);
  const startTsRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  // Durée d'un aller simple (ms) - plus petit = plus difficile
  const DURATION_MS = 950;

  useEffect(() => {
    mountedRef.current = true;
    
    // Sécurité : redirection si pas de secondesX
    if (secondesX == null) {
      navigate(R.game1, { replace: true });
      return;
    }

    // Animation sawtooth : 0→100→0→100...
    const tick = (ts: number) => {
      if (!runningRef.current || !mountedRef.current) return;
      if (startTsRef.current == null) startTsRef.current = ts;

      const elapsed = ts - startTsRef.current;
      const cycleTime = DURATION_MS * 2; // Temps pour un cycle complet 0→100→0
      const phase = (elapsed % cycleTime) / cycleTime; // 0..1
      
      let pct: number;
      if (phase <= 0.5) {
        // Premier demi-cycle : 0% → 100%
        pct = (phase * 2) * 100;
      } else {
        // Deuxième demi-cycle : 100% → 0%
        pct = (2 - phase * 2) * 100;
      }

      setPosition(Math.max(0, Math.min(100, pct)));
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      mountedRef.current = false;
      runningRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [navigate, secondesX]);

  // Fonction de tir - tap unique
  const fire = () => {
    if (locked || !mountedRef.current) return;
    
    // Verrouillage immédiat
    setLocked(true);
    runningRef.current = false;
    
    // Arrêt de l'animation
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    // Effet d'impact visuel
    setShowImpact(true);
    setTimeout(() => setShowImpact(false), 300);

    // Calcul du score basé sur la distance au centre
    const d = Math.abs(50 - position) / 50; // 0 = centre parfait, 1 = bord
    const mapped = Math.max(4, Math.min(12, 4 + Math.round(8 * Math.pow(d, 0.85))));
    setScoreY(mapped);
    setY(mapped);

    // Labels arcade selon précision
    if (mapped <= 5) setLabel("PERFECT!");
    else if (mapped <= 7) setLabel("GREAT!");
    else if (mapped <= 9) setLabel("OK");
    else setLabel("MISS");

    // Vibrations selon le score
    if (navigator.vibrate) {
      if (mapped <= 5) navigator.vibrate([10, 25, 10]); // Perfect
      else if (mapped <= 7) navigator.vibrate([15, 20]); // Great
      else navigator.vibrate([25]); // OK/Miss
    }

    // Navigation après affichage du score
    setTimeout(() => {
      if (mountedRef.current) {
        navigate(R.game1Respiration);
      }
    }, 850);
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden bg-black text-white"
      onPointerUp={fire}
      style={{ touchAction: 'manipulation' }}
    >
      {/* Background animé */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(1000px 500px at 80% -10%, rgba(255,59,59,.18), transparent 60%), radial-gradient(900px 500px at 15% 120%, rgba(99,102,241,.22), transparent 60%), linear-gradient(180deg, #050509 0%, #0b0c10 60%, #0b0c10 100%)",
        }}
      />
      
      {/* Overlay pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mix-blend-screen opacity-[.08]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,.15) 0 1px, transparent 1px 3px)",
        }}
      />

      {/* Effet d'impact global */}
      {showImpact && (
        <div className="absolute inset-0 bg-white/10 animate-ping pointer-events-none z-20" />
      )}

      {/* Header */}
      <div className="relative z-10 pt-8 text-center">
        <h1 className="text-sm tracking-widest text-white/60 uppercase">
          GAME 1 — CURSEUR
        </h1>
      </div>

      {/* Zone de jeu principale */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-16">
        <div className="rounded-[22px] border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_25px_80px_-20px_rgba(0,0,0,.8)] p-8">

          {/* Barre de jeu + curseur */}
          <div className="relative mx-auto w-full max-w-lg h-4 rounded-full bg-white/10 overflow-visible select-none">
            {/* Repère central fuchsia */}
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-[2px] bg-fuchsia-400 shadow-[0_0_18px_2px_rgba(217,70,239,.55)] pointer-events-none" 
              aria-hidden="true"
            />
            
            {/* Curseur principal */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-5 w-3 rounded-sm transition-colors duration-200 z-10 ${
                locked ? "bg-yellow-300 shadow-[0_0_20px_4px_rgba(255,255,0,.6)]" : "bg-white shadow-[0_0_18px_4px_rgba(255,255,255,.35)]"
              }`}
              style={{ left: `${position}%` }}
              aria-hidden="true"
            />
            
            {/* Halo pulsant autour du curseur */}
            <div
              className={`pointer-events-none absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-16 w-16 rounded-full blur-lg transition-opacity duration-300 ${
                locked ? 'opacity-60' : 'opacity-40 animate-pulse'
              }`}
              style={{
                left: `${position}%`,
                background: locked 
                  ? "radial-gradient(circle, rgba(255,255,0,.6), rgba(255,255,0,0) 70%)"
                  : "radial-gradient(circle, rgba(255,255,255,.6), rgba(99,102,241,.3) 40%, rgba(255,255,255,0) 70%)",
              }}
              aria-hidden="true"
            />
          </div>

          {/* Indicateurs de jeu */}
          <div className="mt-6 flex items-center justify-between text-xs text-white/60">
            <span>0%</span>
            <span 
              className="text-center font-medium"
              aria-live="polite"
            >
              {locked ? "LOCKED" : "TAP NOW!"}
            </span>
            <span>100%</span>
          </div>

          {/* Instructions clignotantes */}
          {!locked && (
            <div className="mt-8 text-center">
              <span 
                className="text-lg tracking-widest text-red-400 font-bold drop-shadow-[0_0_8px_rgba(248,113,113,0.8)] animate-pulse"
                aria-hidden="true"
              >
                🎯 TAP ANYWHERE 🎯
              </span>
            </div>
          )}

          {/* Affichage du score */}
          {locked && scoreY != null && (
            <div className="mt-8 flex flex-col items-center gap-3">
              <div className="text-4xl font-extrabold tracking-wide animate-pulse text-center">
                {label}
              </div>
              <div 
                className="text-sm uppercase tracking-widest text-white/70"
                aria-live="polite"
              >
                Secondes Y : <span className="text-white font-bold">{scoreY}</span>
              </div>
              <div className="text-xs text-white/60">💨 Vers la respiration...</div>
            </div>
          )}
        </div>
      </div>

      {/* Décor néon bas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 h-48 w-[80%] blur-3xl opacity-40"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,59,59,.55), rgba(99,102,241,.45), transparent)",
        }}
      />

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