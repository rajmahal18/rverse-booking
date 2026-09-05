import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import DemoBar from '../components/DemoBar'
import PickleRVerseBrand from '../components/PickleRVerseBrand'
import ReclubBrand from '../components/ReclubBrand'
import PlayerMobileNav from '../components/PlayerMobileNav'
import OpenPlayCard from '../components/OpenPlayCard'
import { Arrow, InfoIcon, UsersIcon } from '../components/Icons'
import { loadDemoState, type OpenPlayHostType } from '../lib/demoStore'

type Filter = 'All' | OpenPlayHostType

export default function OpenPlayList() {
  const [state, setState] = useState(loadDemoState())
  const [filter, setFilter] = useState<Filter>('All')

  useEffect(() => {
    const refresh = () => setState(loadDemoState())
    window.addEventListener('picklerverse-demo-change', refresh)
    return () => window.removeEventListener('picklerverse-demo-change', refresh)
  }, [])

  const openPlays = useMemo(() => state.openPlays
    .filter(item => item.published)
    .filter(item => filter === 'All' || item.hostType === filter)
    .sort((a,b) => a.date.localeCompare(b.date)), [state.openPlays, filter])

  return (
    <div className="court-shell open-play-shell">
      <DemoBar />
      <header className="court-nav open-play-nav">
        <Link to="/demo" className="court-brand court-brand-image"><PickleRVerseBrand energy="active" /><span className="sr-only">PickleRVerse</span></Link>
        <nav><Link to="/demo">Venue</Link><Link className="active" to="/demo/open-plays">Open play</Link><Link className="court-manage-link" to="/demo/manage">My booking</Link><Link className="court-book-small" to="/demo/book">Book a court</Link></nav>
      </header>

      <main className="open-play-main">
        <section className="open-play-index-hero">
          <div>
            <span className="open-play-eyebrow"><UsersIcon /> OPEN PLAY AT PICKLERVERSE</span>
            <h1>Find a game.<br/><em>Just show up.</em></h1>
            <p>See the date, level, players, fee, and registration platform at a glance. Court-hosted sessions stay here; Reclub sessions open on Reclub.</p>
          </div>
          <aside className="open-play-explainer"><InfoIcon /><div><strong>What is open play?</strong><p>Join a scheduled group session without booking the whole court yourself. Most listings welcome solo players and the organizer handles rotations.</p></div></aside>
        </section>

        <section className="open-play-filterbar" aria-label="Filter open plays">
          <div><span>Upcoming sessions</span><strong>{state.openPlays.filter(item=>item.published).length} listed</strong></div>
          <div>{(['All','Court-hosted','Reclub'] as Filter[]).map(item => <button key={item} className={filter===item?'active':''} onClick={()=>setFilter(item)}>{item==='Court-hosted'?'PickleRVerse hosted':item}</button>)}</div>
        </section>

        <section className="open-play-platform-guide"><div><PickleRVerseBrand markOnly/><span><strong>PickleRVerse hosted</strong><small>Open details and join through the court.</small></span></div><div><ReclubBrand/><span><strong>Reclub hosted</strong><small>We show the essentials, then send you to Reclub.</small></span></div></section>

        <section className="open-play-index-grid">
          {openPlays.map(openPlay => <OpenPlayCard key={openPlay.id} openPlay={openPlay} />)}
        </section>

        {!openPlays.length && <section className="open-play-empty"><UsersIcon/><h2>No sessions in this filter.</h2><p>Try another host type or check back for the next published open play.</p></section>}

        <section className="open-play-private-cta">
          <div><span>Prefer your own group?</span><h2>Book a private court instead.</h2><p>Pick the exact court-hours you want and keep the session to your group.</p></div>
          <Link to="/demo/book">See court schedule <Arrow /></Link>
        </section>
      </main>
      <footer className="court-footer court-footer-brand"><PickleRVerseBrand /><span>{state.venue.address} · {state.venue.hours}</span><span>Fictional venue used for the booking-system demo.</span></footer>
      <PlayerMobileNav />
    </div>
  )
}
