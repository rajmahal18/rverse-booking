import { motion, AnimatePresence } from 'motion/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Arrow, CalendarIcon, GridIcon } from './Icons'
import { setDemoRole, type DemoRole } from '../lib/demoRole'
import PickleRVerseBrand from './PickleRVerseBrand'

export default function DemoRoleChooser({ open, onChoose }: { open: boolean; onChoose?: (role: DemoRole) => void }) {
  const navigate = useNavigate()
  const location = useLocation()

  function choose(role: DemoRole) {
    setDemoRole(role)
    onChoose?.(role)
    if (role === 'staff') {
      navigate('/demo/admin')
      return
    }
    if (location.pathname === '/demo/admin') navigate('/demo')
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="role-gateway"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <motion.section
            className="role-card"
            role="dialog"
            aria-modal="true"
            aria-label="Choose a PickleRVerse demo view"
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
          >
            <div className="role-card-head">
              <PickleRVerseBrand className="role-brand"/>
              <span>PickleRVerse sample court</span>
              <strong>Choose what you want to see.</strong>
              <p>Player view shows the public booking experience. Court Staff view shows the same schedule, bookings, payments, and venue settings.</p>
            </div>
            <div className="role-options">
              <button onClick={() => choose('player')}>
                <span className="role-icon"><CalendarIcon /></span>
                <span><b>Book as a player</b><small>See available court-hours, choose your slots, and complete a sample booking.</small></span>
                <Arrow />
              </button>
              <button onClick={() => choose('staff')}>
                <span className="role-icon"><GridIcon /></span>
                <span><b>Manage as court staff</b><small>See today’s schedule, add bookings, review payments, and change court details.</small></span>
                <Arrow />
              </button>
            </div>
            <small className="role-disclaimer">Simulation only. No real payment is processed.</small>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
