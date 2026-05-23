import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen } from '../../test/test-utils'
import MetricCard from './MetricCard'

describe('MetricCard', () => {
  it('renders label, formatted value, and unit', () => {
    renderWithProviders(
      <MetricCard label="PM 2.5" value={45.2} unit="µg/m³" icon="wind" color="#f97316" />
    )
    expect(screen.getByText('PM 2.5')).toBeInTheDocument()
    expect(screen.getByText('µg/m³')).toBeInTheDocument()
    expect(screen.getByLabelText(/PM 2.5/i)).toBeInTheDocument()
  })

  it('shows skeleton placeholder when value is null', () => {
    renderWithProviders(
      <MetricCard label="PM 2.5" value={null} unit="µg/m³" icon="wind" color="#f97316" />
    )
    expect(screen.getByTestId('metric-skeleton')).toBeInTheDocument()
  })

  it('shows up trend arrow when current value exceeds previous', () => {
    renderWithProviders(
      <MetricCard label="PM 2.5" value={50} prevValue={40} unit="µg/m³" icon="wind" color="#f97316" />
    )
    expect(screen.getByLabelText(/tendencia subiendo/i)).toBeInTheDocument()
  })
})
