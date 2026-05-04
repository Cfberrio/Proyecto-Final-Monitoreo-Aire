import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Wind, Menu, X } from 'lucide-react'
import StatusDot from '../ui/StatusDot'
import { useApiStatus } from '../../hooks/useApiStatus'

const linkBase = 'px-3.5 py-2 rounded-lg text-sm font-medium transition-colors'
const linkClass = ({ isActive }) =>
  `${linkBase} ${isActive
    ? 'bg-white/10 text-white'
    : 'text-slate-300 hover:text-white hover:bg-white/5'}`

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const status = useApiStatus()
  const apiState = status.isError ? 'offline' : status.data ? 'online' : 'stale'
  const apiLabel = apiState === 'online' ? 'API en línea' : apiState === 'offline' ? 'API fuera de línea' : 'API verificando'

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
        <div className="flex items-center gap-2 text-white">
          <Wind className="h-5 w-5 text-slate-100" />
          <span className="font-semibold tracking-tight">AirWatch BQ</span>
        </div>
        <div className="hidden md:flex items-center gap-1 ml-8">
          <NavLink to="/dashboard" className={linkClass}>Estado del aire</NavLink>
          <NavLink to="/predictions" className={linkClass}>Predicciones</NavLink>
        </div>
        <div className="ml-auto hidden md:block">
          <StatusDot status={apiState} label={apiLabel} />
        </div>
        <button
          className="ml-auto md:hidden p-2 rounded-lg text-slate-300 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
      {open && (
        <div className="md:hidden border-t border-white/5 px-4 py-3 flex flex-col gap-2 bg-slate-950/85">
          <NavLink to="/dashboard" className={linkClass} onClick={() => setOpen(false)}>Estado del aire</NavLink>
          <NavLink to="/predictions" className={linkClass} onClick={() => setOpen(false)}>Predicciones</NavLink>
          <div className="pt-2"><StatusDot status={apiState} label={apiLabel} /></div>
        </div>
      )}
    </header>
  )
}
