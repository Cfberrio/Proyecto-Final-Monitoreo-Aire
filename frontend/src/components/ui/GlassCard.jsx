import clsx from 'clsx'

export default function GlassCard({ as: Tag = 'div', className, children, ...rest }) {
  return (
    <Tag
      className={clsx(
        'relative rounded-2xl border bg-white/5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.40)]',
        'border-white/10',
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
}
