import clsx from 'clsx'

export default function SolidCard({ as: Tag = 'div', className, children, ...rest }) {
  return (
    <Tag
      className={clsx(
        'relative rounded-2xl border border-white/5 bg-slate-900/40 shadow-[0_2px_12px_rgba(0,0,0,0.25)]',
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
}
