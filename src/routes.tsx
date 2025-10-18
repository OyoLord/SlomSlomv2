import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
import Game1 from './pages/Game1'
import Game1Curseur from './pages/Game1Curseur'
import Game1Respiration from './pages/Game1Respiration'
import Landing from './pages/Landing'
import Disclaimer from './pages/Disclaimer'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />
  },
  {
    path: '/disclaimer',
    element: <Disclaimer />
  },
  {
    path: '/home',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'game1', element: <Game1 /> },
      { path: 'game1-curseur', element: <Game1Curseur /> },
      { path: 'game1-respiration', element: <Game1Respiration /> }
    ]
  }
])

export default router
