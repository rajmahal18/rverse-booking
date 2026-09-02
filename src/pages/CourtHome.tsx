import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import DemoBar from '../components/DemoBar'
import PickleRVerseBrand from '../components/PickleRVerseBrand'
import VenueMap from '../components/VenueMap'
import { Arrow, CalendarIcon, ClockIcon, MapPinIcon } from '../components/Icons'
import { makeDates, money, timeSlots, loadDemoState, isOccupied } from '../lib/demoStore'

const courtCrop = ['18% center','50% center','82% center']

export default function CourtHome() {
  const [state, setState] = useState(loadDemoState())
  useEffect(() => {
    const refresh = () => setState(loadDemoState())
    window.addEventListener('picklerverse-demo-change', refresh)
    return () => window.removeEventListener('picklerverse-demo-change', refresh)
  }, [])
  const courts = state.courts
  const venue = state.venue
  const today = makeDates(1)[0]
  const openSlots = timeSlots.filter((time) => !isOccupied(state, today.iso, 'orbit', time)).slice(0,4)

  return (
    <div className="court-shell">
      <DemoBar />
      <header className="court-nav">
        <Link to="/demo" className="court-brand court-brand-image"><PickleRVerseBrand /><span className="sr-only">PickleRVerse</span></Link>
        <nav><a href="#courts">Courts</a><a href="#venue">Venue</a><a href="#visit">Before you book</a><Link className="court-manage-link" to="/demo/manage">My booking</Link><Link className="court-book-small" to="/demo/book">Book a court</Link></nav>
      </header>

      <main>
        <section className="court-hero court-hero-photo-layout">
          <div className="court-hero-copy">
            <span className="court-kicker">{venue.locationLabel} · {venue.hours}</span>
            <h1>Three courts.<br/><em>One clear schedule.</em></h1>
            <p>{venue.description}</p>
            <div className="court-hero-actions"><Link className="court-main-cta" to="/demo/book">Check availability <Arrow /></Link><a href="#venue" className="court-secondary-cta">Find the venue</a></div>
          </div>
          <motion.figure className="court-photo-card" whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 220, damping: 24 }}>
            <img src="/brand/picklerverse-venue.webp" alt="PickleRVerse venue with Orbit, Nova, and Comet courts" />
            <figcaption><span>PickleRVerse</span><strong>Orbit · Nova · Comet</strong><small>Open-air courts · {venue.locationLabel}</small></figcaption>
          </motion.figure>
        </section>

        <section className="court-facts-strip" aria-label="Venue details">
          <div><span>Address</span><strong>{venue.address}</strong></div>
          <div><span>Hours</span><strong>{venue.hours}</strong></div>
          <div><span>Parking</span><strong>{venue.parking}</strong></div>
          <div><span>Contact</span><strong>{venue.phone}</strong></div>
        </section>

        <section className="availability-ribbon">
          <div><CalendarIcon/><span><small>{today.label}</small><strong>Orbit Court</strong></span></div>
          <div className="quick-slots">
            {openSlots.length ? openSlots.map(t => <motion.div key={t} whileTap={{ scale: .96 }}><Link to={`/demo/book?court=orbit&date=${today.iso}&time=${encodeURIComponent(t)}`}>{t}</Link></motion.div>) : <span>Fully booked today</span>}
          </div>
          <Link to="/demo/book">See full schedule <Arrow/></Link>
        </section>

        <section className="court-list-section" id="courts">
          <div className="court-section-head"><span>Courts</span><h2>Pick the setup that fits your game.</h2></div>
          <div className="court-cards court-cards-custom court-detail-cards">
            {courts.map((court, i) => (
              <motion.article key={court.id} whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
                <div className="court-photo-slice" style={{ backgroundImage: "url('/brand/picklerverse-aerial.webp')", backgroundPosition: courtCrop[i] }}><span>{court.number}</span><b>{court.shortName}</b></div>
                <div className="court-card-copy"><span>{court.number}</span><h3>{court.name}</h3><p>{court.surface}</p><small>{court.note}</small></div>
                <dl className="court-detail-facts"><div><dt>Lighting</dt><dd>{court.lighting}</dd></div><div><dt>Best for</dt><dd>{court.bestFor}</dd></div></dl>
                <div className="court-rate"><strong>{money(court.rate)}</strong><small>/ hour</small></div>
                <Link to={`/demo/book?court=${court.id}`}>Book {court.shortName} <Arrow/></Link>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="venue-gallery" aria-label="PickleRVerse venue gallery">
          <div className="venue-gallery-head"><span>Venue preview</span><h2>Know the place before you arrive.</h2></div>
          <div className="venue-gallery-grid">
            <figure className="gallery-wide"><img src="/brand/picklerverse-venue.webp" alt="Front view of PickleRVerse"/><figcaption>Entrance · check-in · waiting area</figcaption></figure>
            <figure><img src="/brand/picklerverse-aerial.webp" alt="Aerial view of PickleRVerse"/><figcaption>Three-court layout</figcaption></figure>
            <figure className="gallery-court-crop"><img src="/brand/picklerverse-aerial.webp" alt="Orbit, Nova and Comet courts"/><figcaption>Orbit · Nova · Comet</figcaption></figure>
          </div>
        </section>

        <section className="venue-location-section" id="venue">
          <div className="venue-location-head"><span><MapPinIcon/> Visit PickleRVerse</span><h2>Find the gate, parking, and nearby landmarks.</h2></div>
          <VenueMap venue={venue}/>
        </section>

        <section className="venue-story">
          <div className="venue-aerial"><img src="/brand/picklerverse-aerial.webp" alt="Aerial layout of the three PickleRVerse courts" /><span>Venue layout · 3 courts</span></div>
          <div className="venue-story-copy">
            <span>On site</span>
            <h2>Everything you need for a regular court session.</h2>
            <p>{venue.landmark}. Contact the desk at {venue.phone} or {venue.social} if you need help before your schedule.</p>
            <div className="amenity-chips">{venue.amenities.map(item=><span key={item}>{item}</span>)}</div>
            <dl className="venue-contact-list"><div><dt>Address</dt><dd>{venue.address}</dd></div><div><dt>Phone</dt><dd>{venue.phone}</dd></div><div><dt>Social</dt><dd>{venue.social}</dd></div></dl>
          </div>
        </section>

        <section className="court-rules" id="visit">
          <div><span>Before you book</span><h2>Know the practical stuff first.</h2></div>
          <div className="rules-list rules-list-custom">
            <div><ClockIcon/><span><strong>{venue.hours}</strong><small>Open every day</small></span></div>
            <div><span className="rule-symbol">₱</span><span><strong>Online or manual payment</strong><small>{venue.paymentInstructions}</small></span></div>
            <div><span className="rule-symbol">↻</span><span><strong>Booking changes</strong><small>Use My booking to view status, reschedule a slot, or cancel the booking.</small></span></div>
          </div>
          <div className="house-rules-list">{venue.rules.map((rule,i)=><div key={rule}><span>{String(i+1).padStart(2,'0')}</span><p>{rule}</p></div>)}</div>
        </section>

        <section className="court-final custom-court-final"><PickleRVerseBrand markOnly/><div><span>Ready to play?</span><h2>See all three courts and every timeslot in one view.</h2></div><div className="court-final-actions"><Link to="/demo/manage">Find my booking</Link><Link to="/demo/book">Book a court <Arrow/></Link></div></section>
      </main>
      <footer className="court-footer court-footer-brand"><PickleRVerseBrand /><span>{venue.address} · {venue.hours}</span><span>Fictional venue used for the booking-system demo.</span></footer>
    </div>
  )
}
