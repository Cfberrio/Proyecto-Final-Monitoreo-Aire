import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'

function PlaceholderDashboard() {
  return <div className="text-slate-100">Dashboard placeholder</div>
}

function PlaceholderPredictions() {
  return <div className="text-slate-100">Predictions placeholder</div>
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<PlaceholderDashboard />} />
        <Route path="/predictions" element={<PlaceholderPredictions />} />
      </Routes>
    </Layout>
  )
}
