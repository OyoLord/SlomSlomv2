import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGame1Store } from "../stores/game1Store";
import { R } from "../lib/routes";

export default function Game1(): JSX.Element {
  const navigate = useNavigate();
  const setX = useGame1Store((state) => state.setX);
  const [isSpinning, setIsSpinning] = useState(false);
  const [secondesX, setSecondesX] = useState<number | null>(null);
  const [showFlash, setShowFlash] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  const startWheel = () => {
    const x = Math.floor(Math.random() * (20 - 8 + 1)) + 8;
    setSecondesX(x);
    setIsSpinning(true);
    setShowFlash(false);

    // Animation réaliste avec ease-out
    if (wheelRef.current) {
      const wheel = wheelRef.current;
      const spins = 5 + Math.random() * 3; // 5-8 tours
      const finalRotation = spins * 360;
      
      wheel.style.transition = 'transform 3s cubic-bezier(0.23, 1, 0.32, 1)';
      wheel.style.transform = `rotate(${finalRotation}deg)`;
    }

    const spinDuration = 3000;
    setTimeout(() => {
      setIsSpinning(false);
      setX(x);
      setShowFlash(true);
      
      // Vibration et flash
      if (navigator.vibrate) navigator.vibrate([50, 100, 50]);
      
      // Reset du flash après 500ms
      setTimeout(() => setShowFlash(false), 500);
    }, spinDuration);
  };

  const goToNextPage = () => {
    if (!isSpinning && secondesX !== null) {
      navigate(R.game1Curseur);
    }
  };

  const goBack = () => {
    if (navigator.vibrate) navigator.vibrate(20);
    navigate(R.home);
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white flex flex-col items-center justify-center relative"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {/* Bouton Revenir en arrière - Mobile-friendly */}
      {!isSpinning && (
        <button
          onClick={goBack}
          className="fixed top-3 left-3 w-12 h-12 rounded-full bg-gray-800/90 text-white shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500/50 active:scale-95 transition-all duration-200 z-50 flex items-center justify-center"
          style={{
            minWidth: '48px',
            minHeight: '48px',
          }}
          aria-label="Retour à l'accueil"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      <div className="relative w-72 h-72 mb-8">
        {/* Flash effect */}
        {showFlash && (
          <div className="absolute inset-0 rounded-full bg-white/20 animate-ping pointer-events-none" />
        )}
        
        {/* Pointeur fixe */}
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0
                     border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-red-500 z-10"
          aria-hidden
        />

        {/* Roue */}
        <div
          ref={wheelRef}
          className={`w-full h-full rounded-full shadow-2xl border-4 border-red-500 ${showFlash ? 'shadow-red-500/50 shadow-2xl' : ''}`}
          style={{
            background:
              "conic-gradient(#ef4444 0 45deg, #8b5cf6 45deg 90deg, #06b6d4 90deg 135deg, #22c55e 135deg 180deg, #f59e0b 180deg 225deg, #ec4899 225deg 270deg, #14b8a6 270deg 315deg, #6366f1 315deg 360deg)",
          }}
        />

        {/* Moyeu central */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-16 h-16 rounded-full bg-black/80 backdrop-blur border border-red-500 flex items-center justify-center ${showFlash ? 'ring-4 ring-red-400/50' : ''}`}>
            {isSpinning ? (
              <span className="text-xs text-red-400 opacity-70">...</span>
            ) : (
              <span className="text-lg font-semibold text-red-400" aria-live="polite">
                {secondesX !== null ? secondesX : ""}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bouton lancer la roue */}
      {!isSpinning && secondesX === null && (
        <button
          onClick={startWheel}
          className="px-8 py-4 rounded-2xl bg-red-600 text-white font-bold shadow-[0_10px_30px_-10px_rgba(220,38,38,.7)] hover:brightness-110 hover:shadow-[0_15px_40px_-10px_rgba(220,38,38,.8)] active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400/40 transition-all duration-200"
        >
          🎰 Lancer la roue
        </button>
      )}

      {/* Bouton continuer */}
      {!isSpinning && secondesX !== null && (
        <button
          onClick={goToNextPage}
          className="mt-6 px-8 py-4 rounded-2xl bg-green-600 text-white font-bold shadow-[0_10px_30px_-10px_rgba(34,197,94,.7)] hover:brightness-110 hover:shadow-[0_15px_40px_-10px_rgba(34,197,94,.8)] active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400/40 transition-all duration-200"
        >
          🎯 Continuer
        </button>
      )}

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .animate-ping,
          .animate-pulse {
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