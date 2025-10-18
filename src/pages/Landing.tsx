import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/button'

export default function Landing(): JSX.Element {
  const nav = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-2xl px-6 py-12 text-center">
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tight mb-6 leading-tight text-red-300 drop-shadow-[0_10px_30px_rgba(220,38,38,0.25)] animate-fadeIn">Slom Slom</h1>
        <p className="text-red-200/70 mb-8">Ce lieu est instable. Continuez si vous l'osez.</p>
        <div className="flex justify-center">
          <Button
            variant="destructive"
            aria-label="Entrer dans Slom Slom"
            onClick={() => nav('/disclaimer')}
            className="shadow-lg transform-gpu hover:scale-105"
          >
            Entrer
          </Button>
        </div>
      </div>

      <div className="pointer-events-none fixed inset-0 mix-blend-overlay opacity-20 bg-gradient-to-br from-red-900 via-black to-black"></div>

      <style>{`
        @layer utilities {
          .animate-fadeIn { animation: fadeIn 600ms ease both; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        }
      `}</style>
    </div>
  )
}
