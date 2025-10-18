import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Disclaimer(): JSX.Element {
  const nav = useNavigate()

  React.useEffect(() => {
    const t = setTimeout(() => nav('/home'), 2500)
    return () => clearTimeout(t)
  }, [nav])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-red-200">
      <div className="w-full max-w-2xl px-6 py-12 text-center">
        <h2 className="text-4xl font-extrabold mb-4 text-red-300">DISCLAIMER</h2>
        <p className="text-red-200/80 mb-6">Ce contenu peut heurter la quiétude. Poursuite à vos risques et périls.</p>
        <div className="animate-pulse text-red-400 font-mono">..initialisation du protocole..</div>
      </div>
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black via-red-900 to-black mix-blend-screen"></div>
    </div>
  )
}
