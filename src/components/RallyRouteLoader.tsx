import { motion, useReducedMotion } from 'motion/react'

export default function RallyRouteLoader({ routeKey }: { routeKey: string }) {
  const reduceMotion = Boolean(useReducedMotion())
  if (reduceMotion) return null

  return (
    <motion.div
      key={routeKey}
      className="rally-route-loader"
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 0.78, times: [0, 0.08, 0.8, 1], ease: 'easeOut' }}
    >
      <span className="rally-route-track">
        <motion.i
          initial={{ scaleX: 0 }}
          animate={{ scaleX: [0, 0.36, 0.78, 1] }}
          transition={{ duration: 0.62, times: [0, 0.25, 0.66, 1], ease: [0.2, 0.8, 0.2, 1] }}
        />
        <motion.img
          src="/brand/pickleball.svg"
          alt=""
          initial={{ left: '1.5%', rotate: 0, scale: 0.86 }}
          animate={{ left: ['1.5%', '34%', '76%', '97%'], rotate: [0, 190, 520, 760], scale: [0.86, 1, 0.94, 0.84] }}
          transition={{ duration: 0.62, times: [0, 0.28, 0.72, 1], ease: [0.2, 0.8, 0.2, 1] }}
        />
      </span>
    </motion.div>
  )
}
