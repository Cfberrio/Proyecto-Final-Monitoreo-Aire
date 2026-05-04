import { describe, it, expect } from 'vitest'
import { renderWithProviders, screen, waitFor } from '../test/test-utils'
import Dashboard from './Dashboard'

describe('Dashboard page', () => {
  it('loads sensor data and renders metric cards + AQI gauge', async () => {
    renderWithProviders(<Dashboard />)
    await waitFor(() => expect(screen.getByText('Barranquilla Norte')).toBeInTheDocument())
    expect(screen.getAllByText('PM 2.5').length).toBeGreaterThan(0)
    expect(screen.getByLabelText(/AQI/i)).toBeInTheDocument()
  })
})
