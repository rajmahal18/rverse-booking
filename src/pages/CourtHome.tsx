import { useEffect, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { Link } from 'react-router-dom'
import DemoBar from '../components/DemoBar'
import PickleRVerseBrand from '../components/PickleRVerseBrand'
import VenueMap from '../components/VenueMap'
import PlayerMobileNav from '../components/PlayerMobileNav'
import { Arrow, CalendarIcon, ClockIcon, MapPinIcon } from '../components/Icons'
import { makeDates, money, timeSlots, loadDemoState, isOccupied } from '../lib/demoStore'

const courtCrop = ['18% center','50% center','82% center']
const kineticWords = ['PLAY','BOOK','DINK','RESET','RALLY','REPEAT']

function ScrollRallyBall() {
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const top = useTransform(scrollYProgress, [0,.16,.33,.51,.7,.86,1], ['7%','18%','35%','53%','70%','83%','94%'])
  const left = useTransform(scrollYProgress, [0,.16,.33,.51,.7,.86,1], ['82%','13%','86%','18%','78%','25%','11%'])
  const rotate = useTransform(scrollYProgress, [0,1], [0,1080])
  const scale = useTransform(scrollYProgress, [0,.2,.42,.66,.84,1], [.82,1.08,.9,1.12,.88,.78])
  const opacity = useTransform(scrollYProgress, [0,.06,.9,1], [0,.34,.3,0])

  return (
    <motion.img
      className="scroll-rally-ball"
      src="/brand/pickleball.svg"
      alt=""
      aria-hidden="true"
      style={reduceMotion ? { top:'13%', left:'84%' } : { top, left, rotate, scale, opacity }}
    />
  )
}

function HeroRally({ reduceMotion }: { reduceMotion: boolean }) {
  const rallyTransition = { duration: 5.25, times: [0,.22,.29,.49,.67,.74,1], ease: [0.32,0.02,0.2,1] as const, repeat: Infinity, repeatDelay: .28 }

  return (
    <div className="hero-rally-scene" aria-hidden="true">
      <motion.span
        className="hero-rally-speed hero-rally-speed-one"
        animate={reduceMotion ? undefined : { opacity:[0,.05,.8,0,0,0,0], scaleX:[.2,.4,1.2,.5,.2,.2,.2] }}
        transition={rallyTransition}
      />
      <motion.span
        className="hero-rally-speed hero-rally-speed-two"
        animate={reduceMotion ? undefined : { opacity:[0,0,0,.08,.12,.85,0], scaleX:[.2,.2,.2,.4,.5,1.25,.35] }}
        transition={rallyTransition}
      />
      <motion.span
        className="hero-rally-impact hero-rally-impact-right"
        animate={reduceMotion ? undefined : { opacity:[0,0,1,0,0,0,0], scale:[.25,.25,1.35,1.9,.25,.25,.25] }}
        transition={rallyTransition}
      />
      <motion.span
        className="hero-rally-impact hero-rally-impact-left"
        animate={reduceMotion ? undefined : { opacity:[0,0,0,0,1,0,0], scale:[.25,.25,.25,.25,1.3,1.85,.25] }}
        transition={rallyTransition}
      />
      <motion.img
        className="hero-rally-ball"
        src="/brand/pickleball.svg"
        alt=""
        animate={reduceMotion ? undefined : {
          x: [0,260,490,420,115,24,0],
          y: [0,-92,-28,42,154,112,0],
          rotate: [0,135,285,420,650,770,930],
          scale: [1,.9,.78,.94,.82,1.08,1],
        }}
        transition={rallyTransition}
      />
      <motion.img
        className="hero-paddle hero-paddle-left"
        src="/brand/paddle-cutout.webp"
        alt=""
        animate={reduceMotion ? undefined : { rotate:[-22,-22,-22,-18,-2,17,-22], x:[0,0,0,0,4,11,0], y:[0,0,0,0,-4,-11,0] }}
        transition={rallyTransition}
      />
      <motion.img
        className="hero-paddle hero-paddle-right"
        src="/brand/paddle-cutout.webp"
        alt=""
        animate={reduceMotion ? undefined : { rotate:[19,19,-2,-15,19,19,19], x:[0,0,-8,-12,0,0,0], y:[0,0,3,8,0,0,0] }}
        transition={rallyTransition}
      />
    </div>
  )
}

export default function CourtHome() {
  const [state, setState] = useState(loadDemoState())
  const reduceMotion = Boolean(useReducedMotion())
  useEffect(() => {
    const refresh = () => setState(loadDemoState())
    window.addEventListener('picklerverse-demo-change', refresh)
    return () => window.removeEventListener('picklerverse-demo-change', refresh)
  }, [])
  const courts = state.courts
  const venue = state.venue
  const today = makeDates(1)[0]
  const openSlots = timeSlots.filter((time) => !isOccupied(state, today.iso, 'orbit', time)).slice(0,4)
  const openCourtHours = courts.reduce((total, court) => total + timeSlots.filter((time) => !isOccupied(state, today.iso, court.id, time)).length, 0)

  return (
    <div className="court-shell living-court-shell">
      <ScrollRallyBall />
      <DemoBar />
      <header className="court-nav living-court-nav">
        <Link to="/demo" className="court-brand court-brand-image"><PickleRVerseBrand energy="active" /><span className="sr-only">PickleRVerse</span></Link>
        <nav><a href="#courts">Courts</a><a href="#venue">Venue</a><a href="#visit">Before you book</a><Link className="court-manage-link" to="/demo/manage">My booking</Link><Link className="court-book-small" to="/demo/book">Book a court</Link></nav>
      </header>

      <main className="living-court-main">
        <section className="court-hero court-hero-photo-layout living-court-hero">
          <motion.div
            className="court-hero-copy living-hero-copy"
            initial={reduceMotion ? false : { opacity:0, y:24 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:.58, ease:[.2,.8,.2,1] }}
          >
            <span className="court-kicker living-kicker"><i /> {venue.locationLabel} · {venue.hours}</span>
            <h1><span>This is</span><br/><em>your court.</em></h1>
            <p>{venue.description} Book in seconds, see every court-hour clearly, then just show up and play.</p>
            <div className="court-hero-actions"><Link className="court-main-cta" to="/demo/book">Book a court <Arrow /></Link><Link to="/demo/manage" className="court-secondary-cta">Find my booking</Link></div>
            <div className="hero-live-readout" aria-label="Today's demo availability">
              <span><i /> Live demo schedule</span>
              <strong>{openCourtHours}</strong>
              <small>court-hours open today</small>
            </div>
          </motion.div>

          <motion.figure
            className="court-photo-card living-venue-card"
            initial={reduceMotion ? false : { opacity:0, scale:.975, clipPath:'inset(0 0 14% 0 round 24px)' }}
            animate={{ opacity:1, scale:1, clipPath:'inset(0 0 0% 0 round 24px)' }}
            transition={{ duration:.72, delay:.08, ease:[.2,.8,.2,1] }}
            whileHover={reduceMotion ? undefined : { y:-5, rotate:.15 }}
          >
            <img src="/brand/picklerverse-venue.webp" alt="PickleRVerse venue with Orbit, Nova, and Comet courts" />
            <HeroRally reduceMotion={reduceMotion} />
            <div className="venue-photo-lines" aria-hidden="true"><span/><span/><span/></div>
            <div className="hero-court-badge"><span>COURT MODE</span><strong>ON</strong></div>
            <figcaption><span>PickleRVerse</span><strong>Orbit · Nova · Comet</strong><small>Open-air courts · {venue.locationLabel}</small></figcaption>
          </motion.figure>
        </section>

        <section className="kinetic-court-strip" aria-label="PickleRVerse motion banner">
          <div className="kinetic-court-track">
            {[0,1].map(copy => <div className="kinetic-court-sequence" key={copy} aria-hidden={copy===1}>{kineticWords.map((word,i)=><span key={`${copy}-${word}`}><b>{word}</b><i>{String(i+1).padStart(2,'0')}</i></span>)}</div>)}
          </div>
        </section>

        <section className="court-facts-strip living-facts-strip" aria-label="Venue details">
          <div><span>Address</span><strong>{venue.address}</strong></div>
          <div><span>Hours</span><strong>{venue.hours}</strong></div>
          <div><span>Parking</span><strong>{venue.parking}</strong></div>
          <div><span>Contact</span><strong>{venue.phone}</strong></div>
        </section>

        <section className="availability-ribbon living-availability-ribbon">
          <div className="availability-label"><CalendarIcon/><span><small>Live availability · {today.label}</small><strong>Orbit Court</strong></span></div>
          <div className="quick-slots">
            {openSlots.length ? openSlots.map((t,i) => <motion.div key={t} initial={reduceMotion ? false : {opacity:0,y:8}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.06}} whileTap={{ scale:.96 }}><Link to={`/demo/book?court=orbit&date=${today.iso}&time=${encodeURIComponent(t)}`}>{t}<b>Open</b></Link></motion.div>) : <span>Fully booked today</span>}
          </div>
          <Link to="/demo/book">See full schedule <Arrow/></Link>
        </section>

        <section className="court-list-section living-court-list" id="courts">
          <div className="court-section-head"><span>01 · Courts</span><h2>Three personalities.<br/>One place to play.</h2></div>
          <div className="court-cards court-cards-custom court-detail-cards living-court-cards">
            {courts.map((court, i) => (
              <motion.article key={court.id} whileHover={reduceMotion ? undefined : { y:-7 }} transition={{ type:'spring', stiffness:260, damping:22 }}>
                <div className="court-photo-slice" style={{ backgroundImage:"url('/brand/picklerverse-aerial.webp')", backgroundPosition:courtCrop[i] }}>
                  <span>{court.number}</span><b>{court.shortName}</b><img className="court-card-rally-ball" src="/brand/pickleball.svg" alt="" aria-hidden="true" />
                </div>
                <div className="court-card-copy"><span>{court.number}</span><h3>{court.name}</h3><p>{court.surface}</p><small>{court.note}</small></div>
                <dl className="court-detail-facts"><div><dt>Lighting</dt><dd>{court.lighting}</dd></div><div><dt>Best for</dt><dd>{court.bestFor}</dd></div></dl>
                <div className="court-rate"><strong>{money(court.rate)}</strong><small>/ hour</small></div>
                <Link to={`/demo/book?court=${court.id}`}>Book {court.shortName} <Arrow/></Link>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="venue-gallery living-venue-gallery" aria-label="PickleRVerse venue gallery">
          <div className="venue-gallery-head"><span>02 · Around the club</span><h2>Bright courts. Open air. Easy game-day energy.</h2></div>
          <div className="venue-gallery-grid living-gallery-grid">
            <motion.figure className="gallery-wide" initial={reduceMotion?false:{opacity:0,y:26}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{duration:.55}}><img src="/brand/picklerverse-venue.webp" alt="Front view of PickleRVerse"/><figcaption>Entrance · check-in · waiting area</figcaption></motion.figure>
            <motion.figure initial={reduceMotion?false:{opacity:0,y:36}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{duration:.55,delay:.08}}><img src="/brand/picklerverse-aerial.webp" alt="Aerial view of PickleRVerse"/><figcaption>Three-court layout</figcaption></motion.figure>
            <motion.figure className="gallery-court-crop" initial={reduceMotion?false:{opacity:0,y:42}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{duration:.55,delay:.14}}><img src="/brand/picklerverse-aerial.webp" alt="Orbit, Nova and Comet courts"/><figcaption>Orbit · Nova · Comet</figcaption></motion.figure>
          </div>
        </section>

        <section className="venue-location-section living-location-section" id="venue">
          <div className="venue-location-head"><span><MapPinIcon/> 03 · Visit PickleRVerse</span><h2>Find the gate, parking, and nearby landmarks.</h2></div>
          <VenueMap venue={venue}/>
        </section>

        <section className="venue-story living-venue-story">
          <motion.div className="venue-aerial" initial={reduceMotion?false:{opacity:0,x:-24}} whileInView={{opacity:1,x:0}} viewport={{once:true,amount:.25}} transition={{duration:.6}}><img src="/brand/picklerverse-aerial.webp" alt="Aerial layout of the three PickleRVerse courts" /><span>Venue layout · 3 courts</span><img className="story-ball" src="/brand/pickleball.svg" alt="" aria-hidden="true" /></motion.div>
          <motion.div className="venue-story-copy" initial={reduceMotion?false:{opacity:0,x:24}} whileInView={{opacity:1,x:0}} viewport={{once:true,amount:.25}} transition={{duration:.6}}>
            <span>04 · On site</span>
            <h2>Everything you need for a regular court session.</h2>
            <p>{venue.landmark}. Contact the desk at {venue.phone} or {venue.social} if you need help before your schedule.</p>
            <div className="amenity-chips">{venue.amenities.map(item=><span key={item}>{item}</span>)}</div>
            <dl className="venue-contact-list"><div><dt>Address</dt><dd>{venue.address}</dd></div><div><dt>Phone</dt><dd>{venue.phone}</dd></div><div><dt>Social</dt><dd>{venue.social}</dd></div></dl>
          </motion.div>
        </section>

        <section className="court-rules living-court-rules" id="visit">
          <div><span>05 · Before you book</span><h2>Know the practical stuff first.</h2><div className="rules-motion-mark" aria-hidden="true"><i/><i/><i/></div></div>
          <div>
            <div className="rules-list rules-list-custom">
              <div><ClockIcon/><span><strong>{venue.hours}</strong><small>Open every day</small></span></div>
              <div><span className="rule-symbol">₱</span><span><strong>Online or manual payment</strong><small>{venue.paymentInstructions}</small></span></div>
              <div><span className="rule-symbol">↻</span><span><strong>Booking changes</strong><small>Use My booking to view status, reschedule a slot, or cancel the booking.</small></span></div>
            </div>
            <div className="house-rules-list">{venue.rules.map((rule,i)=><div key={rule}><span>{String(i+1).padStart(2,'0')}</span><p>{rule}</p></div>)}</div>
          </div>
        </section>

        <section className="court-final custom-court-final living-court-final">
          <div className="final-rally-art" aria-hidden="true"><img className="final-paddle" src="/brand/paddle-cutout.webp" alt=""/><img className="final-ball" src="/brand/pickleball.svg" alt=""/><span className="final-line"/></div>
          <PickleRVerseBrand markOnly energy="active"/>
          <div><span>Ready to play?</span><h2>Pick a court.<br/>Own the hour.</h2></div>
          <div className="court-final-actions"><Link to="/demo/manage">Find my booking</Link><Link to="/demo/book">Book a court <Arrow/></Link></div>
        </section>
      </main>
      <footer className="court-footer court-footer-brand living-court-footer"><PickleRVerseBrand /><span>{venue.address} · {venue.hours}</span><span>Fictional venue used for the booking-system demo.</span></footer>
      <PlayerMobileNav />
    </div>
  )
}
