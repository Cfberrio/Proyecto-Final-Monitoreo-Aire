import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="border-t border-white/5 py-5 text-center text-xs text-slate-500">
        Sensor: Smart Citizen Kit, Barranquilla. Predicción: modelo XGBoost.
      </footer>
    </div>
  )
}
