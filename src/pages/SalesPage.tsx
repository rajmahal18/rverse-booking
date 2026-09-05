import { useState, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import GuideDrawer from '../components/GuideDrawer'
import PickleRVerseBrand from '../components/PickleRVerseBrand'
import { Arrow, CheckIcon, ExternalIcon } from '../components/Icons'
import { clearDemoRole } from '../lib/demoRole'

const questions = [
  ['Can staff add walk-ins or phone bookings?','Yes. Staff can create a booking from Court Staff, so walk-ins and phone bookings use the same schedule as online bookings.'],
  ['Can we block private or maintenance schedules?','Yes. A blocked slot is removed from the public booking choices immediately.'],
  ['Will our booking system look like this sample?','No. The sample shows the workflow. Your booking system uses your own name, logo, colors, court setup, rates, rules, venue details, and payment setup.'],
  ['When does a customer booking become confirmed?','Only after successful online payment. Selecting a slot does not create a public booking by itself.'],
  ['Can rates change by court, time, or day?','Yes. Rates can be configured by court and can support agreed peak-hour, weekend, or special pricing rules.'],
  ['Can we publish open plays too?','Yes. Your court or local clubs can publish open plays. PickleRVerse-hosted sessions can open inside your site, while Reclub-hosted sessions can show the key details and then send players to Reclub.'],
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
        <nav><a href="#start">Start here</a><a href="#product">How it works</a><a href="#pricing">Pricing</a></nav>
        <Link className="nav-demo" to="/demo" onClick={clearDemoRole}>View sample court <Arrow /></Link>
      </header>

      <main id="top">
        <section className="sales-hero">
          <div className="hero-eyebrow">Online booking websites for pickleball courts</div>
          <div className="hero-grid">
            <div className="hero-main">
              <h1>Your court.<br/><em>Your booking website.</em></h1>
              <p>Customers check availability, choose a court and time, pay online, and receive confirmation. Your staff manages the same schedule from Court Staff.</p>
              <div className="hero-ctas">
                <a className="primary-cta" href="#start">Show me how it works <Arrow /></a>
                <Link className="plain-cta" to="/demo" onClick={clearDemoRole}>Open the sample</Link>
              </div>
              <div className="hero-owner-note"><CheckIcon/><span><strong>Checking this for your court?</strong><small>Follow the 3 steps below. You do not need to understand any technical terms.</small></span></div>
            </div>

            <motion.div className="hero-aside" whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 280, damping: 24 }}>
              <div className="demo-door product-trace">
                <div className="demo-door-top"><span>What your customer does</span><span>What your staff gets</span></div>
                <div className="trace-flow">
                  <div><span>1 · Choose</span><strong>Orbit Court</strong><small>Today · 6:00 PM · 2 hours</small></div>
                  <i>→</i>
                  <div className="trace-paid"><span>2 · Pay</span><strong>₱720</strong><small>Payment succeeds</small></div>
                  <i>→</i>
                  <div><span>3 · Confirmed</span><strong>PRV-2048</strong><small>Appears in Court Staff</small></div>
                </div>
                <div className="demo-door-copy">
                  <PickleRVerseBrand className="sales-sample-logo"/>
                  <span>Fictional sample court</span>
                  <strong>See the exact flow before you decide.</strong>
                  <p>The sample uses dummy data, but the customer and staff views share the same browser schedule.</p>
                </div>
                <Link to="/demo" className="demo-door-link" onClick={clearDemoRole}>Choose customer or staff view <ExternalIcon /></Link>
              </div>
            </motion.div>
          </div>
          <div className="hero-foot"><span>Own branding</span><span>Online booking</span><span>Online payment</span><span>Staff controls</span></div>
        </section>

        <section className="owner-start-section" id="start">
          <Reveal className="owner-start-intro"><span className="section-number">Start here</span><h2>If you own or manage a court, check these three things.</h2><p>You can understand the whole offer without reading every section. Start here, then open only the details you care about.</p></Reveal>
          <div className="owner-start-grid">
            <a href="#branding" className="owner-start-card"><span>01</span><div><small>First</small><h3>See what becomes yours.</h3><p>Your logo, colors, venue details, court names, rates, rules, photos, and contact information.</p><b>See branding ↓</b></div></a>
            <Link to="/demo/book" onClick={clearDemoRole} className="owner-start-card"><span>02</span><div><small>Then</small><h3>Try one customer booking.</h3><p>Pick a date, choose a court-hour, review the cart, pay, then see the generated receipt.</p><b>Try customer flow →</b></div></Link>
            <Link to="/demo/admin" onClick={clearDemoRole} className="owner-start-card"><span>03</span><div><small>Last</small><h3>See what staff controls.</h3><p>Bookings, availability, blocked hours, walk-ins, open plays, and venue settings live in one workspace.</p><b>Open Court Staff →</b></div></Link>
          </div>
          <div className="owner-start-summary"><strong>In short:</strong><span>Customers book and pay online.</span><span>Your staff controls the schedule.</span><span>The website carries your court brand.</span></div>
        </section>

        <section className="proof-section" id="product">
          <div className="section-number">01 / How the system works</div>
          <div className="proof-grid">
            <Reveal className="proof-copy">
              <h2>A paid booking goes straight to the court schedule.</h2>
              <p>Customers do not need to message your staff just to ask what time is available. The website shows the schedule they can actually book.</p>
            </Reveal>
            <div className="proof-actions">
              <motion.div whileHover={{ x: 5 }}><Link to="/demo/book" onClick={clearDemoRole}><span><b>What the customer sees</b><small>Date picker → available court-hours → cart → payment → receipt.</small></span><Arrow /></Link></motion.div>
              <motion.div whileHover={{ x: 5 }}><Link to="/demo/admin" onClick={clearDemoRole}><span><b>What your staff sees</b><small>The same confirmed booking inside the court schedule and booking records.</small></span><Arrow /></Link></motion.div>
            </div>
          </div>
        </section>

        <section className="principles-section">
          <Reveal className="principle-block"><span>01</span><h3>Customers only see schedules you can accept.</h3><p>Booked and staff-blocked hours cannot be selected again.</p><button onClick={() => setGuide('booking')}>Show me the booking flow →</button></Reveal>
          <Reveal className="principle-block"><span>02</span><h3>No paid booking? Nothing gets confirmed.</h3><p>The public booking record is created only after successful online payment.</p><button onClick={() => setGuide('payments')}>Explain payments simply →</button></Reveal>
          <Reveal className="principle-block"><span>03</span><h3>Your staff still controls offline situations.</h3><p>Staff can add a walk-in or phone booking and block hours directly when needed.</p><button onClick={() => setGuide('admin')}>Show me the staff tools →</button></Reveal>
        </section>

        <section className="customization-proof" id="branding">
          <Reveal className="customization-image"><img src="/brand/picklerverse-venue.webp" alt="Customized PickleRVerse sample court"/><span>Sample brand only · yours will be different</span></Reveal>
          <Reveal className="customization-copy"><span className="section-number">02 / Your court branding</span><h2>This is not a generic template with your name pasted on it.</h2><p>PickleRVerse is only the fictional sample. Your actual booking website is adjusted around your own facility identity and operating setup.</p><div className="customization-helper"><strong>What can change?</strong><small>These are the things court owners usually care about first.</small></div><div className="customization-list"><span>Own logo + colors</span><span>Venue photos</span><span>Venue details</span><span>Court names + rates</span><span>Operating hours</span><span>Booking rules</span><span>Payment setup</span><span>Open play listings</span></div><Link to="/demo" onClick={clearDemoRole}>See the fictional branded sample <Arrow/></Link></Reveal>
        </section>

        <section className="one-click-section">
          <Reveal><span className="section-number">03 / Open only what you need</span><h2>Have a specific question?</h2><p className="section-helper">Tap the question. You do not need to dig through the whole page.</p></Reveal>
          <div className="detail-links">
            {[
              ['included','What exactly will my court get?'],
              ['payments','When does a booking become confirmed?'],
              ['admin','What can my staff manage?'],
              ['setup','What information do you need from us?'],
              ['pricing','What is included in each pricing option?'],
            ].map(([key,label]) => <motion.button whileHover={{ x: 5 }} key={key} onClick={() => setGuide(key)}><span>{label}</span><Arrow /></motion.button>)}
          </div>
        </section>

        <section className="pricing-modern" id="pricing">
          <div className="pricing-intro"><span className="section-number">04 / Pricing</span><h2>Two ways to pay for the same core system.</h2><p>Choose based on whether you prefer a fixed development fee or no upfront development cost.</p></div>
          <div className="price-option"><div><span>Option 1</span><h3>Fixed development</h3></div><div className="price-number price-range">₱15k-₱25k</div><p>One-time development fee based on court count.<br/><b>1-3 courts: ₱15,000</b><br/><b>4-6 courts: ₱20,000</b><br/><b>7+ courts: ₱25,000</b><br/>₱1,500/month for hosting and routine maintenance.</p><div className="price-plain"><strong>Best if:</strong><span>You prefer a traditional one-time development arrangement.</span></div><button onClick={() => setGuide('pricing')}>Read the complete terms →</button></div>
          <div className="price-option partnership"><div><span>Option 2</span><h3>Booking partnership</h3></div><div className="price-number">₱0</div><p>No upfront development fee.<br/><b>₱10 per booked court-hour.</b></p><div className="fee-example"><span>2-hour booking</span><strong>₱20 convenience fee</strong></div><div className="price-plain"><strong>Best if:</strong><span>You want to start without paying a development fee upfront.</span></div><button onClick={() => setGuide('pricing')}>Read the complete terms →</button></div>
        </section>

        <section className="faq-modern" id="questions">
          <div className="faq-title"><span className="section-number">05 / Common questions</span><h2>Things court owners usually ask first.</h2></div>
          <div className="faq-stack">{questions.map(([q,a],i) => <article className={openFaq===i?'open':''} key={q}><button onClick={() => setOpenFaq(openFaq===i?-1:i)}><span>{q}</span><span>{openFaq===i?'−':'+'}</span></button><div><p>{a}</p></div></article>)}</div>
        </section>

        <section className="final-cta">
          <span>Want to see it instead of reading about it?</span>
          <h2>Open the sample court and try one booking.</h2>
          <div><Link className="primary-cta" to="/demo" onClick={clearDemoRole}>Open PickleRVerse sample <Arrow /></Link><a className="plain-cta" href="https://alrahjepaute.pages.dev" target="_blank" rel="noreferrer">Developer profile</a></div>
        </section>
      </main>
      <footer className="sales-footer"><span>RVerse Booking Systems</span><span>Mobile-first sports facility booking websites</span></footer>
      <GuideDrawer guideKey={guide} onClose={() => setGuide(null)} />
    </div>
  )
}
