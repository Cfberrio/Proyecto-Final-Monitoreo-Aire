import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen } from '../../test/test-utils'
import ManualInputForm from './ManualInputForm'

describe('ManualInputForm', () => {
  it('disables submit while any field is invalid', () => {
    renderWithProviders(<ManualInputForm onSubmit={() => {}} isLoading={false} />)
    expect(screen.getByRole('button', { name: /predecir/i })).toBeDisabled()
  })

  it('shows inline error for out-of-range value', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ManualInputForm onSubmit={() => {}} isLoading={false} />)
    const humidity = screen.getByLabelText(/humedad/i)
    await user.type(humidity, '150')
    await user.tab()
    expect(screen.getByText(/Humedad debe estar entre 0 y 100/i)).toBeInTheDocument()
  })

  it('calls onSubmit with parsed numbers when all fields valid', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    renderWithProviders(<ManualInputForm onSubmit={onSubmit} isLoading={false} />)
    await user.type(screen.getByLabelText(/PM 2\.5/i), '15')
    await user.type(screen.getByLabelText(/PM 10/i), '40')
    await user.type(screen.getByLabelText(/PM 1\.0/i), '8')
    await user.type(screen.getByLabelText(/temperatura/i), '30')
    await user.type(screen.getByLabelText(/humedad/i), '70')
    await user.click(screen.getByRole('button', { name: /predecir/i }))
    expect(onSubmit).toHaveBeenCalledWith({ pm25: 15, pm10: 40, pm1: 8, temperature: 30, humidity: 70 })
  })
})
