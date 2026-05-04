import { Routes, Route, Navigate } from 'react-router-dom'

function PlaceholderDashboard() {
  return <div className="p-8 text-slate-100">Dashboard placeholder</div>
}

function PlaceholderPredictions() {
  return <div className="p-8 text-slate-100">Predictions placeholder</div>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<PlaceholderDashboard />} />
      <Route path="/predictions" element={<PlaceholderPredictions />} />
    </Routes>
  )
}
