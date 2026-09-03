import { useState, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import GuideDrawer from '../components/GuideDrawer'
import PickleRVerseBrand from '../components/PickleRVerseBrand'
import { Arrow, ExternalIcon } from '../components/Icons'
import { clearDemoRole } from '../lib/demoRole'

const questions = [
  ['Can staff add walk-ins or phone bookings?','Yes. Staff can create a booking from Court Staff, so walk-ins and phone reservations use the same schedule as online bookings.'],
  ['Can we block private or maintenance schedules?','Yes. A blocked slot is removed from the public booking choices immediately.'],
  ['Will our booking system look like this sample?','No. The sample shows the workflow. Your booking system uses your own name, logo, colors, court setup, rates, rules, and payment instructions.'],
  ['Can customers upload payment proof?','Yes. You can use manual proof upload, online checkout, or both depending on the agreed setup.'],
  ['Can rates change by court, time, or day?','Yes. Rates can be configured by court and can support agreed peak-hour, weekend, or special pricing rules.'],
  ['Do customers need an app?','No. Customers book from a browser on their phone or computer.'],
]

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function SalesPage() {
  const [guide, setGuide] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <div className="sales-shell">
      <header className="sales-nav">
        <a className="sales-brand" href="#top"><span>RVerse</span><small>Booking systems</small></a>
        <nav><a href="#product">How it works</a><a href="#pricing">Pricing</a><a href="#questions">Questions</a></nav>
        <Link className="nav-demo" to="/demo" onClick={clearDemoRole}>View sample court <Arrow /></Link>
      </header>

      <main id="top">
        <section className="sales-hero">
          <div className="hero-eyebrow">Booking systems for sports facilities</div>
          <div className="hero-grid">
            <div className="hero-main">
              <h1>Let customers book<br/><em>without messaging first.</em></h1>
              <p>They choose a court, see available time, and pay. Your staff sees the same booking in Court Staff.</p>
              <div className="hero-ctas">
                <Link className="primary-cta" to="/demo" onClick={clearDemoRole}>View sample court <Arrow /></Link>
                <a className="plain-cta" href="#pricing">See pricing</a>
              </div>
            </div>

            <motion.div className="hero-aside" whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 280, damping: 24 }}>
              <div className="demo-door product-trace">
                <div className="demo-door-top"><span>One booking</span><span>Two views</span></div>
                <div className="trace-flow">
                  <div><span>Player</span><strong>Orbit Court</strong><small>Today · 6:00 PM · 2 hours</small></div>
                  <i>→</i>
                  <div className="trace-paid"><span>Payment</span><strong>₱720</strong><small>Paid</small></div>
                  <i>→</i>
                  <div><span>Court staff</span><strong>PRV-2048</strong><small>Appears in Court Staff</small></div>
                </div>
                <div className="demo-door-copy">
                  <PickleRVerseBrand className="sales-sample-logo"/>
                  <span>PickleRVerse sample court</span>
                  <strong>Try the booking. Then open the staff side.</strong>
                  <p>The demo uses dummy data, but both views share the same schedule and bookings in your browser.</p>
                </div>
                <Link to="/demo" className="demo-door-link" onClick={clearDemoRole}>Choose a view <ExternalIcon /></Link>
              </div>
            </motion.div>
          </div>
          <div className="hero-foot"><span>Public booking</span><span>Staff schedule</span><span>Payment review</span><span>Manual bookings</span></div>
        </section>

        <section className="proof-section" id="product">
          <div className="section-number">01 / Try the system</div>
          <div className="proof-grid">
            <Reveal className="proof-copy">
              <h2>Make a booking.<br/>Then find it in Court Staff.</h2>
              <p>The sample court is a working simulation, not a screenshot. Use either side and switch views whenever you want.</p>
            </Reveal>
            <div className="proof-actions">
              <motion.div whileHover={{ x: 5 }}><Link to="/demo/book" onClick={clearDemoRole}><span><b>Try player booking</b><small>Pick court-hours, review the total, and complete a sample booking.</small></span><Arrow /></Link></motion.div>
              <motion.div whileHover={{ x: 5 }}><Link to="/demo/admin" onClick={clearDemoRole}><span><b>Open Court Staff</b><small>See the same schedule, bookings, payments, and settings.</small></span><Arrow /></Link></motion.div>
            </div>
          </div>
        </section>

        <section className="principles-section">
          <Reveal className="principle-block"><span>01</span><h3>Customers see the schedule you can actually accept.</h3><p>Booked and blocked hours cannot be selected again.</p><button onClick={() => setGuide('booking')}>See booking flow →</button></Reveal>
          <Reveal className="principle-block"><span>02</span><h3>Payment status stays on the booking record.</h3><p>Online payment and uploaded proof can both be tracked from Court Staff.</p><button onClick={() => setGuide('payments')}>See payment flow →</button></Reveal>
          <Reveal className="principle-block"><span>03</span><h3>Staff can handle bookings that happen off the website.</h3><p>Add walk-ins, block hours, and review payment proofs without changing systems.</p><button onClick={() => setGuide('admin')}>See staff tools →</button></Reveal>
        </section>


        <section className="customization-proof">
          <Reveal className="customization-image"><img src="/brand/picklerverse-venue.webp" alt="Customized PickleRVerse sample court"/><span>Sample client brand · PickleRVerse</span></Reveal>
          <Reveal className="customization-copy"><span className="section-number">02 / Client branding</span><h2>Your booking system will have its own identity.</h2><p>The sample uses PickleRVerse to show the workflow. Your actual system is customized around your facility, so it uses your own branding, court setup, rates, rules, payment details, and operating process instead of looking like a template.</p><div className="customization-list"><span>Own logo + colors</span><span>Court names + rates</span><span>Venue details</span><span>Booking rules</span><span>Payment instructions</span></div><Link to="/demo" onClick={clearDemoRole}>See the branded sample <Arrow/></Link></Reveal>
        </section>

        <section className="one-click-section">
          <Reveal><span className="section-number">03 / Details</span><h2>Everything a court owner needs to check.</h2></Reveal>
          <div className="detail-links">
            {[
              ['included','What exactly is included?'],
              ['payments','How do payments work?'],
              ['admin','What can staff manage?'],
              ['setup','What do you need from us?'],
              ['pricing','What is included in each pricing option?'],
            ].map(([key,label]) => <motion.button whileHover={{ x: 5 }} key={key} onClick={() => setGuide(key)}><span>{label}</span><Arrow /></motion.button>)}
          </div>
        </section>

        <section className="pricing-modern" id="pricing">
          <div className="pricing-intro"><span className="section-number">04 / Pricing</span><h2>Choose how you want to pay for the system.</h2><p>Same system. Two ways to pay for it.</p></div>
          <div className="price-option"><div><span>Option 1</span><h3>Fixed development</h3></div><div className="price-number price-range">₱15k-₱25k</div><p>One-time development fee based on court count.<br/><b>1-3 courts: ₱15,000</b><br/><b>4-6 courts: ₱20,000</b><br/><b>7+ courts: ₱25,000</b><br/>₱1,500/month for hosting and routine maintenance.</p><button onClick={() => setGuide('pricing')}>Read full terms →</button></div>
          <div className="price-option partnership"><div><span>Option 2</span><h3>Booking partnership</h3></div><div className="price-number">₱0</div><p>No upfront development fee.<br/><b>₱10 per booked court-hour.</b></p><div className="fee-example"><span>2-hour booking</span><strong>₱20 convenience fee</strong></div><button onClick={() => setGuide('pricing')}>Read full terms →</button></div>
        </section>

        <section className="faq-modern" id="questions">
          <div className="faq-title"><span className="section-number">05 / Questions</span><h2>Questions court owners usually ask.</h2></div>
          <div className="faq-stack">{questions.map(([q,a],i) => <article className={openFaq===i?'open':''} key={q}><button onClick={() => setOpenFaq(openFaq===i?-1:i)}><span>{q}</span><span>{openFaq===i?'−':'+'}</span></button><div><p>{a}</p></div></article>)}</div>
        </section>

        <section className="final-cta">
          <span>Sample court</span>
          <h2>Try the player side and the staff side before deciding.</h2>
          <div><Link className="primary-cta" to="/demo" onClick={clearDemoRole}>View PickleRVerse <Arrow /></Link><a className="plain-cta" href="https://alrahjepaute.pages.dev" target="_blank" rel="noreferrer">Developer profile</a></div>
        </section>
      </main>
      <footer className="sales-footer"><span>RVerse Booking Systems</span><span>Sports facility booking systems</span></footer>
      <GuideDrawer guideKey={guide} onClose={() => setGuide(null)} />
    </div>
  )
}
