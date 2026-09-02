import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ResetIcon } from './Icons'
import { resetDemoState } from '../lib/demoStore'
import { setDemoRole, type DemoRole } from '../lib/demoRole'
import PickleRVerseBrand from './PickleRVerseBrand'

export default function DemoBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const isAdmin = location.pathname.includes('/admin')

  function reset() { resetDemoState(); window.location.reload() }
  function switchTo(next: DemoRole) {
    setDemoRole(next)
    navigate(next === 'staff' ? '/demo/admin' : '/demo')
  }

  const visibleRole: DemoRole = isAdmin ? 'staff' : 'player'

  return (
    <div className="demo-bar">
      <div>
        <PickleRVerseBrand markOnly className="demo-bar-mark"/>
        <strong>PickleRVerse demo</strong>
        <span className="demo-role-label">Viewing as {visibleRole === 'staff' ? 'Court Staff' : 'Player'}</span>
      </div>
      <div className="demo-bar-actions">
        <button className={visibleRole === 'player' ? 'active' : ''} onClick={() => switchTo('player')}>Player</button>
        <button className={visibleRole === 'staff' ? 'active' : ''} onClick={() => switchTo('staff')}>Court Staff</button>
        <button onClick={reset} title="Reset demo"><ResetIcon /> <span>Reset</span></button>
        <Link className="back-sales" to="/">Sales site</Link>
      </div>
    </div>
  )
}
