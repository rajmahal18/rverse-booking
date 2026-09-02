import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Link, useSearchParams } from 'react-router-dom'
import DemoBar from '../components/DemoBar'
import PickleRVerseBrand from '../components/PickleRVerseBrand'
import VenueMap from '../components/VenueMap'
import { Arrow, CheckIcon, InfoIcon, UploadIcon } from '../components/Icons'
import { setDemoRole } from '../lib/demoRole'
import { bookingTimes, getCourt, loadDemoState, makeDates, makeReference, money, saveDemoState, timeSlots, type DemoBooking } from '../lib/demoStore'

const steps = ['Schedule','Details','Payment','Confirmation']
const slotKey = (courtId:string,time:string) => `${courtId}|${time}`

export default function BookingFlow() {
  const [params] = useSearchParams()
  const dates = makeDates(7)
  const [state, setState] = useState(loadDemoState())
  const initialDate = dates.some(d => d.iso === params.get('date')) ? params.get('date')! : dates[0].iso
  const [date, setDate] = useState(initialDate)
  const [selectedKeys, setSelectedKeys] = useState<string[]>(() => {
    const courtId = params.get('court')
    const time = params.get('time')
    if (!courtId || !time || !state.courts.some(c=>c.id===courtId) || !timeSlots.includes(time)) return []
    const blocked = state.blocked.includes(`${initialDate}|${courtId}|${time}`)
    const booking = state.bookings.some(b=>b.date===initialDate&&b.courtId===courtId&&bookingTimes(b).includes(time))
    return blocked || booking ? [] : [slotKey(courtId,time)]
  })
  const [step, setStep] = useState(0)
  const [cartOpen, setCartOpen] = useState(false)
  const [legendOpen, setLegendOpen] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [name, setName] = useState('Alex Dela Cruz')
  const [phone, setPhone] = useState('0917 123 4567')
  const [email, setEmail] = useState('alex@example.com')
  const [payment, setPayment] = useState<'online'|'manual'>('online')
  const [onlineMethod, setOnlineMethod] = useState('GCash')
  const [proofName, setProofName] = useState('sample-payment-proof.jpg')
  const [reference, setReference] = useState('')

  useEffect(() => {
    const refresh = () => setState(loadDemoState())
    window.addEventListener('picklerverse-demo-change', refresh)
    return () => window.removeEventListener('picklerverse-demo-change', refresh)
  }, [])

  const selectedItems = useMemo(() => selectedKeys.map(key => {
    const [courtId,time] = key.split('|')
    const court = getCourt(state,courtId)
    return { key,courtId,time,court,rate:court.rate }
  }).sort((a,b) => {
    const byTime = timeSlots.indexOf(a.time) - timeSlots.indexOf(b.time)
    if (byTime) return byTime
    return state.courts.findIndex(c=>c.id===a.courtId) - state.courts.findIndex(c=>c.id===b.courtId)
  }), [selectedKeys,state])

  const subtotal = selectedItems.reduce((sum,item)=>sum+item.rate,0)
  const convenience = selectedItems.length * 10
  const total = subtotal + convenience

  function bookingAt(courtId:string,time:string) {
    return state.bookings.find(b=>b.date===date&&b.courtId===courtId&&bookingTimes(b).includes(time))
  }

  function cellState(courtId:string,time:string) {
    const key = slotKey(courtId,time)
    if (selectedKeys.includes(key)) return { code:'✓',label:'Selected',kind:'selected',disabled:false }
    const booking = bookingAt(courtId,time)
    if (booking?.paymentStatus === 'Pending review') return { code:'R',label:'Reserved',kind:'reserved',disabled:true }
    if (booking) return { code:'B',label:'Booked',kind:'booked',disabled:true }
    if (state.blocked.includes(`${date}|${courtId}|${time}`)) return { code:'M',label:'Blocked',kind:'blocked',disabled:true }
    return { code:'A',label:'Available',kind:'available',disabled:false }
  }

  function toggleSlot(courtId:string,time:string) {
    const key = slotKey(courtId,time)
    const cell = cellState(courtId,time)
    if (cell.disabled && !selectedKeys.includes(key)) return
    setBookingError('')
    setSelectedKeys(current => current.includes(key) ? current.filter(item=>item!==key) : [...current,key])
  }

  function changeDate(nextDate:string) {
    setDate(nextDate)
    setSelectedKeys([])
    setCartOpen(false)
    setBookingError('')
  }

  function completeBooking() {
    const fresh = loadDemoState()
    const unavailable = selectedItems.filter(item => {
      const blocked = fresh.blocked.includes(`${date}|${item.courtId}|${item.time}`)
      const booked = fresh.bookings.some(b=>b.date===date&&b.courtId===item.courtId&&bookingTimes(b).includes(item.time))
      return blocked || booked
    })
    if (!selectedItems.length || unavailable.length) {
      setState(fresh)
      setBookingError(unavailable.length ? 'One of those slots just became unavailable. Pick another slot.' : 'Choose at least one slot first.')
      setStep(0)
      setCartOpen(false)
      window.scrollTo({top:0,behavior:'smooth'})
      return
    }

    const id = makeReference(fresh)
    const paymentStatus = payment === 'online' ? 'Paid' as const : 'Pending review' as const
    const bookings: DemoBooking[] = selectedItems.map((item,index) => {
      const freshCourt = getCourt(fresh,item.courtId)
      return {
        id: selectedItems.length===1 ? id : `${id}-${String(index+1).padStart(2,'0')}`,
        groupId:id,
        customer:name || 'Demo Guest',
        phone,
        courtId:item.courtId,
        courtName:freshCourt.name,
        date,
        time:item.time,
        duration:1,
        amount:freshCourt.rate + 10,
        paymentMethod:payment === 'online' ? onlineMethod : 'Manual proof',
        email: email || undefined,
        paymentStatus,
        source:'Public',
        proofName:payment === 'manual' ? proofName : undefined,
        createdAt:new Date().toISOString(),
      }
    })
    const next = { ...fresh, bookings:[...bookings,...fresh.bookings] }
    saveDemoState(next)
    setState(next)
    setReference(id)
    setStep(3)
    setCartOpen(false)
    window.scrollTo({top:0,behavior:'smooth'})
  }

  function next() {
    if (!selectedItems.length) { setBookingError('Tap at least one available slot.'); return }
    setStep(s => Math.min(2,s+1))
    setCartOpen(false)
    window.scrollTo({top:0,behavior:'smooth'})
  }
  function back() { setStep(s => Math.max(0,s-1)); window.scrollTo({top:0,behavior:'smooth'}) }

  const summaryRows = selectedItems.map(item => (
    <div key={item.key}><dt><b>{item.court.shortName}</b><span>{item.time}</span></dt><dd>{money(item.rate)}</dd></div>
  ))

  return (
    <div className="booking-shell matrix-booking-shell">
      <DemoBar />
      <header className="booking-nav">
        <Link to="/demo" className="court-brand court-brand-image booking-brand"><PickleRVerseBrand /></Link>
        <Link to="/demo">Exit booking</Link>
      </header>

      <main className="booking-main matrix-booking-main">
        <div className="booking-stepper" aria-label={`Step ${step + 1} of ${steps.length}: ${steps[step]}`}>
          <div><span>Step {step + 1} of {steps.length}</span><strong>{steps[step]}</strong></div>
          <div className="booking-stepper-track"><i style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {step===0 && (
            <motion.section className="booking-step schedule-matrix-step" key="schedule" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.2}}>
              <div className="step-head matrix-step-head"><span>Choose your schedule</span><h1>Tap the court-hours you want.</h1><p>Every court is on the same screen. Tap any green <b>A</b> to add it to your booking.</p></div>

              <div className="matrix-date-block">
                <span>Pick a date</span>
                <div className="matrix-dates">{dates.map((d,i)=><motion.button key={d.iso} className={date===d.iso?'selected':''} onClick={()=>changeDate(d.iso)} whileTap={{scale:.97}}><strong>{d.label}</strong><small>{i<2?`${d.dow}, ${d.month} ${Number(d.day)}`:`${d.month} ${Number(d.day)}`}</small></motion.button>)}</div>
              </div>

              <div className="slot-legend-wrap">
                <div className="slot-legend" aria-label="Schedule legend">
                  <span><i className="available">A</i>Available</span>
                  <span><i className="booked">B</i>Booked</span>
                  <span><i className="reserved">R</i>Reserved</span>
                  <span><i className="blocked">M</i>Blocked</span>
                  <span><i className="selected">✓</i>Selected</span>
                </div>
                <button className="legend-help" onClick={()=>setLegendOpen(value=>!value)}><InfoIcon/>{legendOpen?'Hide guide':'What do the letters mean?'}</button>
              </div>
              <AnimatePresence initial={false}>{legendOpen && <motion.div className="legend-guide" initial={{opacity:0,y:-5}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-5}}><span><b>A</b>Tap it to add that court-hour.</span><span><b>B</b>Confirmed booking.</span><span><b>R</b>Held while payment proof is reviewed.</span><span><b>M</b>Maintenance or staff-blocked time.</span><span><b>✓</b>Already in your cart.</span></motion.div>}</AnimatePresence>

              {bookingError && <div className="slot-error">{bookingError}</div>}

              <div className="public-schedule-matrix" role="grid" aria-label={`PickleRVerse schedule for ${date}`}>
                <div className="public-matrix-head matrix-time-head">Time</div>
                {state.courts.map(court=><div className="public-matrix-head" key={court.id}><strong>{court.shortName}</strong><small>{money(court.rate)}/hr</small></div>)}
                {timeSlots.map(time => (
                  <div className="public-matrix-row" key={time}>
                    <div className="matrix-time"><strong>{time.replace(':00','')}</strong></div>
                    {state.courts.map(court => {
                      const cell = cellState(court.id,time)
                      return <motion.button
                        key={`${court.id}-${time}`}
                        className={`matrix-slot ${cell.kind}`}
                        disabled={cell.disabled}
                        onClick={()=>toggleSlot(court.id,time)}
                        whileTap={cell.disabled?undefined:{scale:.92}}
                        aria-label={`${court.name}, ${time}: ${cell.label}`}
                        title={`${court.name} · ${time} · ${cell.label}`}
                      ><span>{cell.code}</span></motion.button>
                    })}
                  </div>
                ))}
              </div>
              <p className="matrix-hint">Selected slots show ✓. Tap ✓ again if you change your mind.</p>
            </motion.section>
          )}

          {step===1 && (
            <motion.section className="booking-step narrow-step" key="details" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.2}}>
              <div className="step-head"><span>Your details</span><h1>Who is playing?</h1><p>We use these details for the booking record. The demo fields are pre-filled so you can move quickly.</p></div>
              <div className="details-card">
                <label>Name<input autoComplete="name" value={name} onChange={e=>setName(e.target.value)} /></label>
                <label>Mobile number<input inputMode="tel" autoComplete="tel" value={phone} onChange={e=>setPhone(e.target.value)} /></label>
                <label>Email <small>optional</small><input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} /></label>
                <div className="detail-policy"><CheckIcon/><p>PickleRVerse allows rescheduling at least 6 hours before play.</p></div>
                <div className="step-actions"><button onClick={back}>Back</button><button className="book-next" onClick={next}>Continue to payment <Arrow/></button></div>
              </div>
            </motion.section>
          )}

          {step===2 && (
            <motion.section className="booking-step" key="payment" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.2}}>
              <div className="step-head"><span>Payment</span><h1>How would you like to pay?</h1><p>Your total is shown before you continue. No real charge happens in this demo.</p></div>
              <div className="payment-layout">
                <div className="payment-methods">
                  <button className={payment==='online'?'selected':''} onClick={()=>setPayment('online')}><span><strong>Pay online</strong><small>Simulated instant payment</small></span><span>Instant confirmation</span></button>
                  <button className={payment==='manual'?'selected':''} onClick={()=>setPayment('manual')}><span><strong>Upload payment proof</strong><small>Court Staff reviews the proof before confirmation</small></span><span>Staff review</span></button>

                  <AnimatePresence mode="wait" initial={false}>
                    {payment==='online' ? (
                      <motion.div className="online-panel" key="online" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}>
                        <label>Demo payment method</label>
                        <div>{['GCash','Maya','Card'].map(m=><button className={onlineMethod===m?'selected':''} key={m} onClick={()=>setOnlineMethod(m)}>{m}</button>)}</div>
                        <div className="fake-checkout branded-checkout"><div className="checkout-brand"><PickleRVerseBrand markOnly/><span>{state.venue.paymentName}</span></div><span>{onlineMethod} checkout</span><strong>{money(total)}</strong><p>Completing this step creates {selectedItems.length} paid court-hour{selectedItems.length!==1?'s':''} in the shared demo state.</p><button onClick={completeBooking}>Complete demo payment <Arrow/></button></div>
                      </motion.div>
                    ) : (
                      <motion.div className="manual-panel" key="manual" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}>
                        <div className="sample-proof-card">
                          <div className="proof-brand"><PickleRVerseBrand markOnly/><span>{state.venue.paymentName}</span></div>
                          <span>Sample payment proof</span>
                          <strong>Mobile Wallet Receipt</strong>
                          <dl><div><dt>Amount sent</dt><dd>{money(total)}</dd></div><div><dt>Reference</dt><dd>8462 1109 5721</dd></div><div><dt>Recipient</dt><dd>{state.venue.paymentName}</dd></div><div><dt>Mobile</dt><dd>{state.venue.paymentNumber}</dd></div></dl>
                          <small>Demo receipt · not a real transaction</small>
                        </div>
                        <label className="proof-upload"><UploadIcon/><span><strong>Attach payment proof</strong><small>{proofName}</small></span><input type="file" accept="image/*" onChange={e=>setProofName(e.target.files?.[0]?.name || proofName)}/><b>Choose file</b></label>
                        <p>All selected slots will appear in Court Staff view as <strong>Reserved</strong> while the payment proof is pending review.</p>
                        <button className="manual-submit" onClick={completeBooking}>Submit booking for review <Arrow/></button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <aside className="booking-summary compact branded-booking-summary multi-summary"><div className="booking-summary-brand"><PickleRVerseBrand markOnly/><span>{state.venue.locationLabel}</span></div><span>Payment summary</span><h3>{selectedItems.length} court-hour{selectedItems.length!==1?'s':''}</h3><dl>{summaryRows}<div><dt>Convenience fee</dt><dd>{money(convenience)}</dd></div></dl><div className="summary-total"><span>Total</span><strong>{money(total)}</strong></div><button className="summary-back" onClick={back}>← Edit slots</button></aside>
              </div>
            </motion.section>
          )}

          {step===3 && (
            <motion.section className="booking-complete" key="done" initial={{opacity:0,scale:.99}} animate={{opacity:1,scale:1}} transition={{type:'spring',stiffness:240,damping:24}}>
              <div className="complete-brand"><PickleRVerseBrand /></div><motion.div className="complete-check" initial={{scale:.6,rotate:-10}} animate={{scale:1,rotate:0}} transition={{type:'spring',stiffness:360,damping:18}}><CheckIcon/></motion.div>
              <span>{payment==='online'?'Booking confirmed':'Booking received'}</span>
              <h1>{reference}</h1>
              <p>{payment==='online'?'Your selected court-hours are marked Paid.':'Your selected court-hours are reserved while the payment proof waits for staff review.'}</p>
              <div className="confirmation-card multi-confirmation"><div><span>Slots</span><strong>{selectedItems.length}</strong></div><div><span>Date</span><strong>{dates.find(d=>d.iso===date)?.label}</strong></div><div><span>Total</span><strong>{money(total)}</strong></div><div><span>Payment</span><strong className={payment==='online'?'paid-text':'pending-text'}>{payment==='online'?'Paid':'Pending review'}</strong></div></div>
              <div className="confirmation-slot-list">{selectedItems.map(item=><div key={item.key}><strong>{item.court.name}</strong><span>{item.time}</span><small>{money(item.rate + 10)}</small></div>)}</div>
              <div className="confirmation-venue"><span>{state.venue.address}</span><span>{state.venue.hours}</span><span>{state.venue.phone}</span></div>
              <div className="confirmation-map"><div><span>Where to go</span><h3>{state.venue.landmark}</h3><p>{state.venue.directions}</p></div><VenueMap venue={state.venue} compact/></div>
              <div className="confirmation-reminders"><strong>Before you arrive</strong>{state.venue.rules.slice(0,2).map(rule=><span key={rule}>• {rule}</span>)}</div>
              <div className="complete-actions"><Link className="book-next" to={`/demo/manage?ref=${encodeURIComponent(reference)}&phone=${encodeURIComponent(phone)}`}>Manage this booking <Arrow/></Link><Link to="/demo/admin" onClick={() => setDemoRole('staff')}>View in Court Staff</Link><Link to="/demo">Back to PickleRVerse</Link></div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {step===0 && selectedItems.length>0 && <motion.div className="slot-cart-bar" initial={{y:90,opacity:0}} animate={{y:0,opacity:1}} exit={{y:90,opacity:0}} transition={{type:'spring',stiffness:320,damping:28}}>
          <button className="slot-cart-open" onClick={()=>setCartOpen(true)} aria-label={`Review ${selectedItems.length} selected court-hour${selectedItems.length!==1?'s':''} totaling ${money(total)}`}><span><b>{selectedItems.length} slot{selectedItems.length!==1?'s':''}</b><small>selected</small></span><strong>{money(total)}</strong><i>Review <Arrow/></i></button>
        </motion.div>}
      </AnimatePresence>

      <AnimatePresence>
        {cartOpen && <motion.div className="slot-cart-layer" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onMouseDown={e=>e.currentTarget===e.target&&setCartOpen(false)}>
          <motion.aside className="slot-cart-drawer" initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} transition={{type:'spring',stiffness:300,damping:30}}>
            <div className="slot-cart-head"><div><span>Your booking</span><h2>{selectedItems.length} court-hour{selectedItems.length!==1?'s':''}</h2></div><button onClick={()=>setCartOpen(false)}>×</button></div>
            <div className="cart-date">{dates.find(d=>d.iso===date)?.label} · {dates.find(d=>d.iso===date)?.month} {Number(dates.find(d=>d.iso===date)?.day||0)}</div>
            <div className="cart-slot-list">{selectedItems.map(item=><div key={item.key}><span><strong>{item.court.name}</strong><small>{item.time}</small></span><span><strong>{money(item.rate)}</strong><button onClick={()=>toggleSlot(item.courtId,item.time)}>Remove</button></span></div>)}</div>
            <dl className="cart-totals"><div><dt>Court rental</dt><dd>{money(subtotal)}</dd></div><div><dt>Convenience fee · ₱10 / court-hour</dt><dd>{money(convenience)}</dd></div><div><dt>Total</dt><dd>{money(total)}</dd></div></dl>
            <button className="cart-continue" onClick={next}>Continue to details <Arrow/></button>
          </motion.aside>
        </motion.div>}
      </AnimatePresence>
    </div>
  )
}
