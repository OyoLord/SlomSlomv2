import React from 'react'
import { Outlet } from 'react-router-dom'

export default function App(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-slate-50 dark:from-zinc-900">
      <main className="flex-1 max-w-md w-full mx-auto p-4">
        <section>
          <Outlet />
        </section>
      </main>
    </div>
  )
}
