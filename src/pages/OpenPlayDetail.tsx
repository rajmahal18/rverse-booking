import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import DemoBar from '../components/DemoBar'
import PickleRVerseBrand from '../components/PickleRVerseBrand'
import ReclubBrand from '../components/ReclubBrand'
import PlayerMobileNav from '../components/PlayerMobileNav'
import { Arrow, CalendarIcon, ClockIcon, ExternalIcon, InfoIcon, MapPinIcon, UsersIcon } from '../components/Icons'
import { getOpenPlay, loadDemoState, money, openPlaySpotsLeft, shortDate } from '../lib/demoStore'

export default function OpenPlayDetail() {
  const { id = '' } = useParams()
  const [state, setState] = useState(loadDemoState())

  useEffect(() => {
    const refresh = () => setState(loadDemoState())
    window.addEventListener('picklerverse-demo-change', refresh)
    return () => window.removeEventListener('picklerverse-demo-change', refresh)
  }, [])

  const openPlay = getOpenPlay(state,id)
  if (!openPlay || !openPlay.published) {
    return <div className="court-shell open-play-shell"><DemoBar/><main className="open-play-not-found"><PickleRVerseBrand/><span>Open play unavailable</span><h1>This session is not published.</h1><Link to="/demo/open-plays">See upcoming open plays <Arrow/></Link></main><PlayerMobileNav/></div>
  }

  if (openPlay.hostType === 'Reclub') {
    return <div className="court-shell open-play-shell"><DemoBar/><main className="open-play-not-found reclub-handoff"><ReclubBrand/><span>Hosted on Reclub</span><h1>Registration continues with the organizer.</h1><p>We show the practical details in RVerse, while roster updates and registration are handled on Reclub.</p><a href={openPlay.externalUrl || 'https://reclub.co/'} target="_blank" rel="noreferrer">Open Reclub <ExternalIcon/></a></main><PlayerMobileNav/></div>
  }

  const spotsLeft = openPlaySpotsLeft(openPlay)
  const courtNames = openPlay.courtIds.map(courtId => state.courts.find(court => court.id === courtId)?.shortName).filter(Boolean).join(' · ')

  return (
    <div className="court-shell open-play-shell">
      <DemoBar />
      <header className="court-nav open-play-nav">
        <Link to="/demo" className="court-brand court-brand-image"><PickleRVerseBrand energy="active" /><span className="sr-only">PickleRVerse</span></Link>
        <nav><Link to="/demo">Venue</Link><Link className="active" to="/demo/open-plays">Open play</Link><Link className="court-manage-link" to="/demo/manage">My booking</Link><Link className="court-book-small" to="/demo/book">Book a court</Link></nav>
      </header>

      <main className="open-play-detail-main">
        <Link className="open-play-back" to="/demo/open-plays">← All open plays</Link>
        <section className="open-play-detail-hero">
          <div className="open-play-detail-copy">
            <div className="open-play-detail-badges"><span className="open-play-native-badge"><PickleRVerseBrand markOnly/> PickleRVerse hosted</span><span className={spotsLeft > 0 ? 'available' : 'full'}>{spotsLeft > 0 ? `${spotsLeft} spots left` : 'Waitlist'}</span></div>
            <span className="open-play-organizer">Organized by {openPlay.organizer}</span>
            <h1>{openPlay.title}</h1>
            <p>{openPlay.description}</p>
            <div className="open-play-detail-cta-row"><a className="open-play-join" href={`tel:${state.venue.phone.replace(/\s/g,'')}`}>Join via court desk <Arrow/></a><Link to="/demo/book">Book private court</Link></div>
          </div>
          <div className="open-play-detail-photo"><img src="/otherangle.png" alt="PickleRVerse courts and check-in area"/><div><span>OPEN PLAY</span><strong>{courtNames}</strong><small>{shortDate(openPlay.date)} · {openPlay.startTime}</small></div></div>
        </section>

        <section className="open-play-detail-strip">
          <div><CalendarIcon/><span><small>Date</small><strong>{shortDate(openPlay.date)}</strong></span></div>
          <div><ClockIcon/><span><small>Time</small><strong>{openPlay.startTime}–{openPlay.endTime}</strong></span></div>
          <div><UsersIcon/><span><small>Capacity</small><strong>{openPlay.registered} / {openPlay.maxPlayers} players</strong></span></div>
          <div><span className="open-play-peso">₱</span><span><small>Fee</small><strong>{money(openPlay.price)} / player</strong></span></div>
        </section>

        <section className="open-play-detail-layout">
          <div className="open-play-detail-primary">
            <section className="open-play-info-block"><span>PLAY LEVEL & FORMAT</span><h2>Know the game before you join.</h2><div className="open-play-level-grid"><div><small>Skill level</small><strong>{openPlay.skillLevel}</strong></div><div><small>Format</small><strong>{openPlay.format}</strong></div><div><small>Courts in use</small><strong>{courtNames}</strong></div></div></section>
            <section className="open-play-info-block"><span>WHO CAN JOIN</span><h2>No guessing at the gate.</h2><p>{openPlay.whoCanJoin}</p><div className="open-play-tags detail">{openPlay.tags.map(tag=><span key={tag}>{tag}</span>)}</div></section>
            <section className="open-play-info-block"><span>WHAT TO BRING</span><h2>Arrive ready to play.</h2><p>{openPlay.whatToBring}</p><div className="open-play-detail-note"><InfoIcon/><div><strong>Equipment</strong><p>{openPlay.equipment}</p></div></div></section>
          </div>

          <aside className="open-play-detail-aside">
            <section><span>GOOD TO KNOW</span><div className="open-play-aside-row"><ClockIcon/><div><small>Check-in</small><p>{openPlay.checkIn}</p></div></div><div className="open-play-aside-row"><MapPinIcon/><div><small>Venue & parking</small><p>{state.venue.address}. {state.venue.parking}.</p></div></div><div className="open-play-aside-row"><InfoIcon/><div><small>Cancellation</small><p>{openPlay.cancellation}</p></div></div></section>
            <section className="open-play-contact-card"><span>NEED HELP?</span><h3>{state.venue.phone}</h3><p>{openPlay.contact}</p><a href={`tel:${state.venue.phone.replace(/\s/g,'')}`}>Call the court desk <Arrow/></a></section>
          </aside>
        </section>
      </main>
      <footer className="court-footer court-footer-brand"><PickleRVerseBrand /><span>{state.venue.address} · {state.venue.hours}</span><span>Fictional venue used for the booking-system demo.</span></footer>
      <PlayerMobileNav />
    </div>
  )
}
