import clsx from 'clsx'

const SIZES = { sm: 'w-4 h-4 border-2', md: 'w-8 h-8 border-2', lg: 'w-12 h-12 border-[3px]' }

export default function LoadingSpinner({ size = 'md', color = 'blue' }) {
  return (
    <span
      role="status"
      aria-label="Cargando"
      className={clsx(
        'inline-block rounded-full animate-spin border-transparent',
        color === 'white' ? 'border-t-white' : 'border-t-blue-500',
        SIZES[size]
      )}
    />
  )
}
