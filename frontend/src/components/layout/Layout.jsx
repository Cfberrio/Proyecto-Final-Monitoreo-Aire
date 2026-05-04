import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="border-t border-white/5 py-4 text-center text-slate-500 text-sm">
        AirWatch Barranquilla · Datos: Smart Citizen Kit · Modelo: XGBoost
      </footer>
    </div>
  )
}
