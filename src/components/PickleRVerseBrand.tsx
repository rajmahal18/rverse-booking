import type { ImgHTMLAttributes } from 'react'

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  markOnly?: boolean
}

export default function PickleRVerseBrand({ markOnly = false, className = '', alt = 'PickleRVerse', ...props }: Props) {
  return (
    <img
      src={markOnly ? '/brand/picklerverse-mark.webp' : '/brand/picklerverse-logo.webp'}
      alt={alt}
      className={`prv-brand-image ${markOnly ? 'prv-brand-mark' : 'prv-brand-lockup'} ${className}`.trim()}
      {...props}
    />
  )
}
