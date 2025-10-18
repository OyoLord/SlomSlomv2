import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame1Store } from "../stores/game1Store";
import { R } from "../lib/routes";

/**
 * Game1Curseur (style arcade/dopamine amélioré)
 * - Curseur qui va et vient sur une barre avec halo pulsant
 * - onPointerUp pour éviter les doubles tirs
 * - Score Y = 4..12 selon la précision au centre
 * - Vibrations et effets visuels arcade
 */
export default function Game1Curseur(): JSX.Element {
  const navigate = useNavigate();
  const secondesX = useGame1Store((s) => s.secondesX);
  const setY = useGame1Store((s) => s.setY);

  // Position du curseur en % [0..100]
  const [position, setPosition] = useState(0);
  const [locked, setLocked] = useState(false); // une fois tiré, on freeze
  const [scoreY, setScoreY] = useState<number | null>(null);
  const [label, setLabel] = useState<string>("");
  const [showImpact, setShowImpact] = useState(false);

  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(true);
  const startTsRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  // durée du trajet 0→100 (ms). Plus petit = plus difficile
  const DURATION_MS = 950;

  useEffect(() => {
    mountedRef.current = true;
    
    // sécurité : si on arrive sans X, retour au début du Game 1
    if (secondesX == null) {
      navigate(R.game1, { replace: true });
      return;
    }

    const tick = (ts: number) => {
      if (!runningRef.current || !mountedRef.current) return;
      if (startTsRef.current == null) startTsRef.current = ts;

      const elapsed = ts - startTsRef.current;
      const phase = (elapsed % DURATION_MS) / DURATION_MS; // 0..1
      const forward = Math.floor(elapsed / DURATION_MS) % 2 === 0;
      const pct = forward ? phase * 100 : (1 - phase) * 100;

      setPosition(pct);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      mountedRef.current = false;
      runningRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [navigate, secondesX]);

  // Un seul tap/clic déclenche le tir avec onPointerUp
  const fire = () => {
    if (locked || !mountedRef.current) return;
    setLocked(true);
    runningRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    // Effet d'impact visuel
    setShowImpact(true);
    setTimeout(() => setShowImpact(false), 300);

    // précision par rapport au centre (50%)
    const d = Math.abs(50 - position) / 50; // 0 = centre parfait, 1 = bord
    // mapping arcade 4..12 (arrondi) + léger adoucissement au centre
    const mapped = Math.max(4, Math.min(12, 4 + Math.round(8 * Math.pow(d, 0.85))));
    setScoreY(mapped);
    setY(mapped);

    // label flashy
    if (mapped <= 5) setLabel("PERFECT!");
    else if (mapped <= 7) setLabel("GREAT!");
    else if (mapped <= 9) setLabel("OK");
    else setLabel("MISS");

    // Vibrations différentes selon le score
    if (navigator.vibrate) {
      if (mapped <= 5) navigator.vibrate([10, 25, 10]); // Perfect
      else if (mapped <= 7) navigator.vibrate([15, 20]); // Great
      else navigator.vibrate([25]); // OK/Miss
    }

    // petite pause pour voir le score, puis on enchaîne
    setTimeout(() => {
      if (mountedRef.current) {
        navigate(R.game1Respiration);
      }
    }, 950);
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden bg-black text-white"
      onPointerUp={fire}
      style={{ touchAction: 'manipulation' }} // Évite le zoom sur mobile
    >
      {/* BG animé "jeu/dopamine" */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(1000px 500px at 80% -10%, rgba(255,59,59,.18), transparent 60%), radial-gradient(900px 500px at 15% 120%, rgba(99,102,241,.22), transparent 60%), linear-gradient(180deg, #050509 0%, #0b0c10 60%, #0b0c10 100%)",
        }}
      />
      <div
        aria-hidden
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

      {/* HEADER minimal */}
      <div className="relative z-10 pt-8 text-center">
        <h1 className="text-sm tracking-widest text-white/60">GAME 1 — CURSEUR</h1>
      </div>

      {/* ZONE DE JEU */}
      <div className="relative z-10 max-w-lg mx-auto px-6 pt-16">
        {/* Carte néon */}
        <div className="rounded-[22px] border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_25px_80px_-20px_rgba(0,0,0,.8)] p-8">

          {/* Barre + curseur */}
          <div className="relative mx-auto w-full h-4 rounded-full bg-white/10 overflow-visible select-none">
            {/* repère centre */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-[2px] bg-fuchsia-400 shadow-[0_0_18px_2px_rgba(217,70,239,.55)]" />
            
            {/* curseur avec halo pulsant */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-5 w-3 rounded-sm ${
                locked ? "bg-yellow-300" : "bg-white"
              } shadow-[0_0_18px_4px_rgba(255,255,255,.35)] transition-colors z-10`}
              style={{ left: `${position}%` }}
            />
            
            {/* halo pulsant amélioré */}
            <div
              className={`pointer-events-none absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-16 w-16 rounded-full blur-lg ${
                locked ? 'opacity-60' : 'opacity-40 animate-pulse'
              } transition-opacity duration-300`}
              style={{
                left: `${position}%`,
                background:
                  "radial-gradient(circle, rgba(255,255,255,.6), rgba(99,102,241,.3) 40%, rgba(255,255,255,0) 70%)",
              }}
            />
          </div>

          {/* Indicateurs avec aria-live */}
          <div className="mt-4 flex items-center justify-between text-[11px] text-white/60">
            <span>0%</span>
            <span aria-live="polite">{locked ? "LOCKED" : "TAP NOW!"}</span>
            <span>100%</span>
          </div>

          {/* Bandeau "tap" clignotant amélioré */}
          {!locked && (
            <div className="mt-8 text-center">
              <span className="animate-pulse text-[15px] tracking-widest text-red-400 font-bold drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]">
                🎯 TAP ANYWHERE 🎯
              </span>
            </div>
          )}

          {/* SCORE FLASH avec aria-live */}
          {locked && scoreY != null && (
            <div className="mt-6 flex flex-col items-center gap-1">
              <div className="text-3xl font-extrabold tracking-wide animate-pulse">
                {label}
              </div>
              <div className="text-[12px] uppercase tracking-widest text-white/70">
                Secondes Y : <span className="text-white" aria-live="polite">{scoreY}</span>
              </div>
              <div className="mt-2 text-[11px] text-white/60">💨 Respiration…</div>
            </div>
          )}
        </div>
      </div>

      {/* Décor néon bas */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 h-48 w-[80%] blur-3xl opacity-40"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,59,59,.55), rgba(99,102,241,.45), transparent)",
        }}
      />

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