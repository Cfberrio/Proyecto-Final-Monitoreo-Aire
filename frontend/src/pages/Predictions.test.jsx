import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../test/msw-server'
import { renderWithProviders, screen, waitFor } from '../test/test-utils'
import Predictions from './Predictions'

describe('Predictions page', () => {
  it('renders auto prediction on success', async () => {
    renderWithProviders(<Predictions />)
    await waitFor(() => expect(screen.getAllByText(/Predicción XGBoost/i).length).toBeGreaterThan(0))
  })

  it('shows ErrorBanner when /predictions/current fails', async () => {
    server.use(
      http.get('*/api/v1/predictions/current', () =>
        HttpResponse.json({ message: 'boom' }, { status: 500 })
      )
    )
    renderWithProviders(<Predictions />)
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
  })
})
