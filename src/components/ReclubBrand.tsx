import type { HTMLAttributes } from 'react'

export default function ReclubBrand({ className = '', ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={`reclub-brand ${className}`.trim()} aria-label="Reclub" {...props}>
      <img
        src="https://reclub.co/img/brand/symbol-yellow.svg"
        alt=""
        aria-hidden="true"
        onError={(event) => { event.currentTarget.style.display = 'none' }}
      />
      <strong>Reclub</strong>
    </span>
  )
}
