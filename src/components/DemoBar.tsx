import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ResetIcon } from './Icons'
import { resetDemoState } from '../lib/demoStore'
import { setDemoRole, type DemoRole } from '../lib/demoRole'
import PickleRVerseBrand from './PickleRVerseBrand'

export default function DemoBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const isAdmin = location.pathname.includes('/admin')
  const visibleRole: DemoRole = isAdmin ? 'staff' : 'player'
  const nextRole: DemoRole = visibleRole === 'staff' ? 'player' : 'staff'

  function reset() { resetDemoState(); window.location.reload() }
  function switchTo(next: DemoRole) {
    setDemoRole(next)
    navigate(next === 'staff' ? '/demo/admin' : '/demo')
  }

  return (
    <div className="demo-bar">
      <div className="demo-bar-context">
        <PickleRVerseBrand markOnly className="demo-bar-mark"/>
        <span>
          <strong>PickleRVerse demo</strong>
          <small>{visibleRole === 'staff' ? 'Court Staff view' : 'Player view'}</small>
        </span>
      </div>
      <div className="demo-bar-actions">
        <button className="demo-switch" onClick={() => switchTo(nextRole)}>
          <span>Switch to </span>{nextRole === 'staff' ? 'Court Staff' : 'Player'}
        </button>
        <button onClick={reset} title="Reset demo"><ResetIcon /> <span>Reset</span></button>
        <Link className="back-sales" to="/">Sales site</Link>
      </div>
    </div>
  )
}
