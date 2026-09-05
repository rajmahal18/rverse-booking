import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import SalesPage from './pages/SalesPage'
import CourtHome from './pages/CourtHome'
import BookingFlow from './pages/BookingFlow'
import AdminDemo from './pages/AdminDemo'
import BookingManage from './pages/BookingManage'
import OpenPlayList from './pages/OpenPlayList'
import OpenPlayDetail from './pages/OpenPlayDetail'
import DemoRoleChooser from './components/DemoRoleChooser'
import RallyRouteLoader from './components/RallyRouteLoader'
import { getDemoRole, type DemoRole } from './lib/demoRole'

function DemoGate({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<DemoRole | null>(getDemoRole())

  useEffect(() => {
    const onRole = (event: Event) => setRole((event as CustomEvent<DemoRole | null>).detail)
    window.addEventListener('picklerverse-role-change', onRole)
    return () => window.removeEventListener('picklerverse-role-change', onRole)
  }, [])

  return (
    <div className={`demo-route${role ? '' : ' role-locked'}`}>
      <div className="demo-route-content">{children}</div>
      <DemoRoleChooser open={!role} onChoose={setRole} />
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const reduceMotion = useReducedMotion()

  return (
    <>
      <RallyRouteLoader routeKey={location.key || location.pathname} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.16 }}
        >
          <Routes location={location}>
            <Route path="/" element={<SalesPage />} />
            <Route path="/demo" element={<DemoGate><CourtHome /></DemoGate>} />
            <Route path="/demo/book" element={<DemoGate><BookingFlow /></DemoGate>} />
            <Route path="/demo/admin" element={<DemoGate><AdminDemo /></DemoGate>} />
            <Route path="/demo/manage" element={<DemoGate><BookingManage /></DemoGate>} />
            <Route path="/demo/open-plays" element={<DemoGate><OpenPlayList /></DemoGate>} />
            <Route path="/demo/open-plays/:id" element={<DemoGate><OpenPlayDetail /></DemoGate>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  )
}
