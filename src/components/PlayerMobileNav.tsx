import { Link, useLocation } from 'react-router-dom'
import { CalendarIcon, GridIcon, SearchIcon, UsersIcon } from './Icons'

export default function PlayerMobileNav() {
  const location = useLocation()
  const itemClass = (path:string) => location.pathname === path ? 'active' : ''
  return (
    <nav className="player-mobile-nav" aria-label="Player navigation">
      <Link className={itemClass('/demo')} to="/demo"><GridIcon/><span>Venue</span></Link>
      <Link className={location.pathname.startsWith('/demo/open-plays') ? 'active' : ''} to="/demo/open-plays"><UsersIcon/><span>Open play</span></Link>
      <Link className={itemClass('/demo/book')} to="/demo/book"><CalendarIcon/><span>Book</span></Link>
      <Link className={itemClass('/demo/manage')} to="/demo/manage"><SearchIcon/><span>My booking</span></Link>
    </nav>
  )
}
