import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Link, useSearchParams } from 'react-router-dom'
import DemoBar from '../components/DemoBar'
import PickleRVerseBrand from '../components/PickleRVerseBrand'
import VenueMap from '../components/VenueMap'
import { Arrow, CalendarIcon, CheckIcon, DownloadIcon, InfoIcon } from '../components/Icons'
import { setDemoRole } from '../lib/demoRole'
import { bookingTimes, getCourt, loadDemoState, makeDates, makeReference, money, saveDemoState, shortDate, timeSlots, type DemoBooking } from '../lib/demoStore'

const steps = ['Schedule','Details','Payment','Confirmation']
const slotKey = (courtId:string,time:string) => `${courtId}|${time}`

function dateISO(offset = 0) {
  const d = new Date()
  d.setHours(12,0,0,0)
  d.setDate(d.getDate() + offset)
  return d.toISOString().slice(0,10)
}

export default function BookingFlow() {
  const [params] = useSearchParams()
  const quickDates = makeDates(7)
  const minDate = dateISO(0)
  const maxDate = dateISO(62)
  const [state, setState] = useState(loadDemoState())
  const requestedDate = params.get('date') || ''
  const initialDate = requestedDate >= minDate && requestedDate <= maxDate ? requestedDate : minDate
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
  const [onlineMethod, setOnlineMethod] = useState('GCash')
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
    if (bookingAt(courtId,time)) return { code:'B',label:'Booked',kind:'booked',disabled:true }
    if (state.blocked.includes(`${date}|${courtId}|${time}`)) return { code:'M',label:'Blocked by court',kind:'blocked',disabled:true }
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
    if (!nextDate || nextDate < minDate || nextDate > maxDate) return
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
        paymentMethod:onlineMethod,
        email: email || undefined,
        paymentStatus:'Paid',
        source:'Public',
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

  function back() {
    setStep(s => Math.max(0,s-1))
    window.scrollTo({top:0,behavior:'smooth'})
  }

  function downloadReceipt() {
    if (!reference) return
    const width = 1080
    const height = Math.max(1380, 1000 + selectedItems.length * 90)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#f7f4ec'
    ctx.fillRect(0,0,width,height)
    ctx.fillStyle = '#132a4e'
    ctx.fillRect(0,0,width,250)
    ctx.fillStyle = '#d7e45e'
    ctx.beginPath(); ctx.arc(120,125,52,0,Math.PI*2); ctx.fill()
    ctx.fillStyle = '#132a4e'
    ctx.font = '900 44px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('P',120,141)
    ctx.textAlign = 'left'
    ctx.fillStyle = '#ffffff'
    ctx.font = '700 48px Arial'
    ctx.fillText('PickleRVerse',205,112)
    ctx.font = '500 24px Arial'
    ctx.fillStyle = '#cbd6e6'
    ctx.fillText('Booking receipt · Demo transaction',205,158)

    let y = 330
    const label = (text:string,x:number,yy:number) => { ctx.fillStyle='#6d7880';ctx.font='700 20px Arial';ctx.fillText(text.toUpperCase(),x,yy) }
    const value = (text:string,x:number,yy:number,size=31) => { ctx.fillStyle='#132a4e';ctx.font=`700 ${size}px Arial`;ctx.fillText(text,x,yy) }
    label('Booking reference',80,y); value(reference,80,y+43,38)
    label('Player',570,y); value(name || 'Demo Guest',570,y+43,32)
    y += 125
    label('Date',80,y); value(shortDate(date),80,y+43)
    label('Payment',570,y); value(`${onlineMethod} · Paid`,570,y+43)
    y += 105
    ctx.strokeStyle = '#ccd0ce'; ctx.lineWidth = 2; ctx.beginPath();ctx.moveTo(80,y);ctx.lineTo(1000,y);ctx.stroke()
    y += 54
    label('Booked court-hours',80,y)
    y += 58
    selectedItems.forEach((item,index) => {
      ctx.fillStyle = index % 2 === 0 ? '#ecebe5' : '#f7f4ec'
      ctx.fillRect(70,y-38,940,78)
      value(item.court.name,95,y,27)
      ctx.textAlign='right'; value(item.time,760,y,25); value(money(item.rate + 10),980,y,25); ctx.textAlign='left'
      y += 84
    })
    y += 30
    ctx.strokeStyle = '#ccd0ce';ctx.beginPath();ctx.moveTo(80,y);ctx.lineTo(1000,y);ctx.stroke()
    y += 58
    label('Court rental',80,y); ctx.textAlign='right'; value(money(subtotal),980,y,28);ctx.textAlign='left'
    y += 56
    label('Convenience fee',80,y); ctx.textAlign='right'; value(money(convenience),980,y,28);ctx.textAlign='left'
    y += 85
    ctx.fillStyle='#132a4e';ctx.fillRect(70,y-48,940,104)
    ctx.fillStyle='#ffffff';ctx.font='700 24px Arial';ctx.fillText('TOTAL PAID',100,y+14)
    ctx.textAlign='right';ctx.font='800 44px Arial';ctx.fillText(money(total),980,y+20);ctx.textAlign='left'
    y += 145
    ctx.fillStyle='#5f696d';ctx.font='500 22px Arial';ctx.fillText(state.venue.address,80,y)
    ctx.fillText(`${state.venue.phone} · ${state.venue.hours}`,80,y+38)
    ctx.fillStyle='#8a918f';ctx.font='500 19px Arial';ctx.fillText('Demo receipt only — no real payment was charged.',80,y+105)

    const link = document.createElement('a')
    link.download = `${reference}-PickleRVerse-receipt.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

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
              <div className="step-head matrix-step-head"><span>Choose your schedule</span><h1>Pick a date. Tap your slots.</h1><p>Green <b>A</b> slots are available. Your booking is created only after payment succeeds.</p></div>

              <div className="booking-calendar-card">
                <div className="booking-calendar-copy"><CalendarIcon/><span><strong>Choose any date</strong><small>Book from today through {shortDate(maxDate)}.</small></span></div>
                <label className="booking-calendar-input"><span>Open calendar</span><input type="date" min={minDate} max={maxDate} value={date} onChange={e=>changeDate(e.target.value)}/></label>
              </div>

              <div className="matrix-date-block">
                <span>Quick picks</span>
                <div className="matrix-dates">{quickDates.map((d,i)=><motion.button key={d.iso} className={date===d.iso?'selected':''} onClick={()=>changeDate(d.iso)} whileTap={{scale:.97}}><strong>{d.label}</strong><small>{i<2?`${d.dow}, ${d.month} ${Number(d.day)}`:`${d.month} ${Number(d.day)}`}</small></motion.button>)}</div>
              </div>

              <div className="selected-date-line"><CalendarIcon/><span><small>Showing availability for</small><strong>{shortDate(date)}</strong></span></div>

              <div className="slot-legend-wrap">
                <div className="slot-legend" aria-label="Schedule legend">
                  <span><i className="available">A</i>Available</span>
                  <span><i className="booked">B</i>Booked</span>
                  <span><i className="blocked">M</i>Blocked</span>
                  <span><i className="selected">✓</i>Selected</span>
                </div>
                <button className="legend-help" onClick={()=>setLegendOpen(value=>!value)}><InfoIcon/>{legendOpen?'Hide guide':'What do the letters mean?'}</button>
              </div>
              <AnimatePresence initial={false}>{legendOpen && <motion.div className="legend-guide" initial={{opacity:0,y:-5}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-5}}><span><b>A</b>Tap to add this court-hour.</span><span><b>B</b>Already booked and paid.</span><span><b>M</b>Blocked by court staff.</span><span><b>✓</b>Already in your cart.</span></motion.div>}</AnimatePresence>

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
              <p className="matrix-hint">Tap ✓ again to remove a selected slot. No slot is held until payment is completed.</p>
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
              <div className="step-head"><span>Payment</span><h1>Pay now to confirm.</h1><p>No payment, no booking. In the live system, the slot becomes confirmed only after the payment provider reports success.</p></div>
              <div className="payment-layout payment-layout-simple">
                <div className="payment-methods payment-methods-simple">
                  <div className="payment-rule"><CheckIcon/><div><strong>Instant confirmation</strong><p>The selected court-hours are written to the schedule only after successful payment.</p></div></div>
                  <div className="online-panel">
                    <label>Demo payment method</label>
                    <div>{['GCash','Maya','Card'].map(m=><button className={onlineMethod===m?'selected':''} key={m} onClick={()=>setOnlineMethod(m)}>{m}</button>)}</div>
                    <div className="fake-checkout branded-checkout"><div className="checkout-brand"><PickleRVerseBrand markOnly/><span>{state.venue.paymentName}</span></div><span>{onlineMethod} checkout</span><strong>{money(total)}</strong><p>This is a simulation. Completing it creates {selectedItems.length} paid court-hour{selectedItems.length!==1?'s':''} in Court Staff.</p><button onClick={completeBooking}>Complete demo payment <Arrow/></button></div>
                  </div>
                </div>
                <aside className="booking-summary compact branded-booking-summary multi-summary"><div className="booking-summary-brand"><PickleRVerseBrand markOnly/><span>{state.venue.locationLabel}</span></div><span>Payment summary</span><h3>{selectedItems.length} court-hour{selectedItems.length!==1?'s':''}</h3><dl>{summaryRows}<div><dt>Convenience fee</dt><dd>{money(convenience)}</dd></div></dl><div className="summary-total"><span>Total</span><strong>{money(total)}</strong></div><button className="summary-back" onClick={back}>← Edit slots</button></aside>
              </div>
            </motion.section>
          )}

          {step===3 && (
            <motion.section className="booking-complete receipt-confirmation" key="done" initial={{opacity:0,scale:.99}} animate={{opacity:1,scale:1}} transition={{type:'spring',stiffness:240,damping:24}}>
              <div className="complete-brand"><PickleRVerseBrand /></div><motion.div className="complete-check" initial={{scale:.6,rotate:-10}} animate={{scale:1,rotate:0}} transition={{type:'spring',stiffness:360,damping:18}}><CheckIcon/></motion.div>
              <span>Booking confirmed</span>
              <h1>{reference}</h1>
              <p>Payment succeeded, so your selected court-hours are now confirmed.</p>

              <div className="generated-receipt">
                <div className="receipt-head"><PickleRVerseBrand/><span><small>BOOKING RECEIPT</small><strong>{reference}</strong></span></div>
                <div className="receipt-meta"><div><small>Player</small><strong>{name}</strong></div><div><small>Date</small><strong>{shortDate(date)}</strong></div><div><small>Payment</small><strong>{onlineMethod} · Paid</strong></div></div>
                <div className="receipt-lines">{selectedItems.map(item=><div key={item.key}><span><strong>{item.court.name}</strong><small>{item.time} · 1 hour</small></span><b>{money(item.rate + 10)}</b></div>)}</div>
                <div className="receipt-totals"><div><span>Court rental</span><b>{money(subtotal)}</b></div><div><span>Convenience fee</span><b>{money(convenience)}</b></div><div className="receipt-grand"><span>Total paid</span><strong>{money(total)}</strong></div></div>
                <div className="receipt-foot"><span>{state.venue.address}</span><span>{state.venue.phone}</span><small>Demo receipt · no real transaction</small></div>
              </div>

              <div className="receipt-actions"><button onClick={downloadReceipt}><DownloadIcon/>Save receipt image</button><small>Or simply screenshot the receipt above.</small></div>
              <div className="confirmation-map"><div><span>Where to go</span><h3>{state.venue.landmark}</h3><p>{state.venue.directions}</p></div><VenueMap venue={state.venue} compact/></div>
              <div className="confirmation-reminders"><strong>Before you arrive</strong>{state.venue.rules.slice(0,2).map(rule=><span key={rule}>• {rule}</span>)}</div>
              <div className="complete-actions"><Link className="book-next" to={`/demo/manage?ref=${encodeURIComponent(reference)}&phone=${encodeURIComponent(phone)}`}>Manage this booking <Arrow/></Link><Link to="/demo/admin" onClick={() => setDemoRole('staff')}>View in Court Staff</Link><Link to="/demo">Back to PickleRVerse</Link></div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {step===0 && selectedItems.length>0 && <motion.div className="slot-cart-bar" initial={{y:90,opacity:0}} animate={{y:0,opacity:1}} exit={{y:90,opacity:0}} transition={{type:'spring',stiffness:320,damping:28}}>
          <button className="slot-cart-open" onClick={()=>setCartOpen(true)} aria-label={`Review ${selectedItems.length} selected court-hour${selectedItems.length!==1?'s':''} totaling ${money(total)}`}><span><b>{selectedItems.length} selected</b><small>{shortDate(date)}</small></span><strong>{money(total)}</strong><i>Review <Arrow/></i></button>
        </motion.div>}
      </AnimatePresence>

      <AnimatePresence>
        {cartOpen && <motion.div className="slot-cart-layer" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onMouseDown={e=>e.currentTarget===e.target&&setCartOpen(false)}>
          <motion.aside className="slot-cart-drawer" initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} transition={{type:'spring',stiffness:300,damping:30}}>
            <div className="slot-cart-head"><div><span>Your booking</span><h2>{selectedItems.length} court-hour{selectedItems.length!==1?'s':''}</h2></div><button onClick={()=>setCartOpen(false)}>×</button></div>
            <div className="cart-date">{shortDate(date)}</div>
            <div className="cart-slot-list">{selectedItems.map(item=><div key={item.key}><span><strong>{item.court.name}</strong><small>{item.time}</small></span><span><strong>{money(item.rate)}</strong><button onClick={()=>toggleSlot(item.courtId,item.time)}>Remove</button></span></div>)}</div>
            <dl className="cart-totals"><div><dt>Court rental</dt><dd>{money(subtotal)}</dd></div><div><dt>Convenience fee · ₱10 / court-hour</dt><dd>{money(convenience)}</dd></div><div><dt>Total</dt><dd>{money(total)}</dd></div></dl>
            <div className="cart-confirm-note"><CheckIcon/><span>Nothing is held yet. Pay in the next steps to confirm these slots.</span></div>
            <button className="cart-continue" onClick={next}>Continue to details <Arrow/></button>
          </motion.aside>
        </motion.div>}
      </AnimatePresence>
    </div>
  )
}
