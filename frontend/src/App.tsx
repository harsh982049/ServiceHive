import { Outlet } from 'react-router-dom'
import Navbar from './components/layout/Navbar'

export default function App() {
  return (
    <div className="min-h-svh bg-[radial-gradient(1200px_600px_at_50%_-10%,hsl(var(--primary)/0.10),transparent)]">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
