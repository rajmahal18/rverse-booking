import type { HTMLAttributes } from 'react'

type Props = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  markOnly?: boolean
  alt?: string
  energy?: 'calm' | 'active'
}

export default function PickleRVerseBrand({
  markOnly = false,
  className = '',
  alt = 'PickleRVerse',
  energy = 'calm',
  ...props
}: Props) {
  return (
    <span
      role="img"
      aria-label={alt}
      className={`prv-brand-image ${markOnly ? 'prv-brand-mark' : 'prv-brand-lockup'} prv-brand-${energy} ${className}`.trim()}
      {...props}
    >
      <span className="prv-brand-mark-stage" aria-hidden="true">
        <img className="prv-brand-mark-art" src="/brand/picklerverse-mark.webp" alt="" />
        <span className="prv-brand-orbit"><i /></span>
        <span className="prv-brand-impact"><i /><i /><i /></span>
      </span>
      {!markOnly && (
        <span className="prv-brand-wordmark-stage" aria-hidden="true">
          <img className="prv-brand-wordmark-art" src="/brand/picklerverse-wordmark.webp" alt="" />
          <i className="prv-brand-wordmark-sheen" />
        </span>
      )}
    </span>
  )
}
