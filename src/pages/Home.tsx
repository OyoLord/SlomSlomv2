import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home(): JSX.Element {
  const nav = useNavigate()

  const games = [
    { id: 1, name: 'Game 1', path: '/home/game1' },
    { id: 2, name: 'Game 2', path: '/home/game-2' },
    { id: 3, name: 'Game 3', path: '/home/game-3' },
    { id: 4, name: 'Game 4', path: '/home/game-4' },
    { id: 5, name: 'Game 5', path: '/home/game-5' },
    { id: 6, name: 'Game 6', path: '/home/game-6' }
  ]

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-8">
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
        {games.map(game => (
          <button
            key={game.id}
            onClick={() => nav(game.path)}
            className="h-48 sm:h-56 md:h-64 lg:h-72 bg-red-900 text-red-200 rounded-lg shadow-lg transform-gpu hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-600/50"
            aria-label={`Navigate to ${game.name}`}
          >
            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">{game.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
