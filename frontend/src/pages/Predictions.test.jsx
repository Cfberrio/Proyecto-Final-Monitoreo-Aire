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

  it('shows sensor-offline status when /predictions/current returns 502', async () => {
    server.use(
      http.post('*/api/v1/predictions/current', () =>
        HttpResponse.json(
          { error: 'HTTP_502', message: 'sensor stale', detail: null },
          { status: 502 }
        )
      )
    )
    renderWithProviders(<Predictions />)
    await waitFor(() =>
      expect(screen.getByText(/sensor físico no está publicando/i)).toBeInTheDocument()
    )
  })
})
