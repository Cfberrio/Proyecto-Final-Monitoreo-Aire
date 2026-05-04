import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import { useSensorCurrent } from './hooks/useSensorCurrent'
import MetricCard from './components/dashboard/MetricCard'

function PlaceholderDashboard() {
  const { data, isLoading } = useSensorCurrent()
  const pm25 = data?.sensors?.find(s => s.key === 'pm25')
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label="PM 2.5"
        value={isLoading ? null : pm25?.value}
        prevValue={pm25?.prev_value}
        unit="µg/m³"
        icon="wind"
        color="#f97316"
      />
    </div>
  )
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
