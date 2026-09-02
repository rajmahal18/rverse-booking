import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { Link, useSearchParams } from 'react-router-dom'
import DemoBar from '../components/DemoBar'
import PickleRVerseBrand from '../components/PickleRVerseBrand'
import VenueMap from '../components/VenueMap'
import { Arrow, CheckIcon, SearchIcon } from '../components/Icons'
import { bookingsForReference, getCourt, isDurationAvailable, loadDemoState, money, saveDemoState, shortDate, timeSlots, type DemoBooking, type DemoState } from '../lib/demoStore'

function digits(value:string) { return value.replace(/\D/g,'') }

export default function BookingManage() {
  const [params] = useSearchParams()
  const [state, setState] = useState<DemoState>(loadDemoState())
  const [reference, setReference] = useState(params.get('ref') || 'PRV-2048')
  const [phone, setPhone] = useState(params.get('phone') || '0917 555 0148')
  const [activeReference, setActiveReference] = useState(params.get('ref') || '')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [moveTimes, setMoveTimes] = useState<Record<string,string>>({})

  const matches = useMemo(() => {
    if (!activeReference) return []
    return bookingsForReference(state,activeReference).filter(booking => !phone || digits(booking.phone) === digits(phone))
  }, [state,activeReference,phone])

  function findBooking() {
    const fresh = loadDemoState()
    const found = bookingsForReference(fresh,reference).filter(booking => digits(booking.phone) === digits(phone))
    setState(fresh)
    setNotice('')
    if (!found.length) {
      setActiveReference('')
      setError('No demo booking matched that reference and mobile number.')
      return
    }
    setError('')
    setActiveReference(found[0].groupId || found[0].id)
    setMoveTimes(Object.fromEntries(found.map(booking => [booking.id,booking.time])))
  }

  function availableTimesFor(booking:DemoBooking) {
    const withoutCurrent = { ...state, bookings:state.bookings.filter(item=>item.id!==booking.id) }
    return timeSlots.filter(time => time===booking.time || isDurationAvailable(withoutCurrent,booking.date,booking.courtId,time,1))
  }

  function reschedule(booking:DemoBooking) {
    const nextTime = moveTimes[booking.id] || booking.time
    if (nextTime===booking.time) return
    const allowed = availableTimesFor(booking)
    if (!allowed.includes(nextTime)) return
    const next = { ...state, bookings:state.bookings.map(item=>item.id===booking.id?{...item,time:nextTime}:item) }
    saveDemoState(next)
    setState(next)
    setNotice(`${booking.courtName} moved to ${nextTime}.`)
  }

  function cancelSlot(booking:DemoBooking) {
    const next = { ...state, bookings:state.bookings.filter(item=>item.id!==booking.id) }
    saveDemoState(next)
    setState(next)
    const remaining = bookingsForReference(next,activeReference).filter(item=>digits(item.phone)===digits(phone))
    if (!remaining.length) setActiveReference('')
    setNotice(`${booking.courtName} · ${booking.time} was removed from the demo booking.`)
  }

  function cancelBooking() {
    if (!matches.length) return
    const ids = new Set(matches.map(item=>item.id))
    const next = { ...state, bookings:state.bookings.filter(item=>!ids.has(item.id)) }
    saveDemoState(next)
    setState(next)
    setActiveReference('')
    setNotice('The demo booking was cancelled and its slots are available again.')
  }

  const total = matches.reduce((sum,item)=>sum+item.amount,0)
  const status = matches.length && matches.every(item=>item.paymentStatus==='Paid') ? 'Paid' : matches.some(item=>item.paymentStatus==='Pending review') ? 'Reserved' : 'Unpaid'
  const first = matches[0]

  return (
    <div className="booking-shell manage-booking-shell">
      <DemoBar/>
      <header className="booking-nav"><Link to="/demo" className="court-brand court-brand-image booking-brand"><PickleRVerseBrand /></Link><Link to="/demo">Back to venue</Link></header>
      <main className="manage-booking-main">
        <section className="manage-lookup">
          <span>My booking</span>
          <h1>Find your booking.</h1>
          <p>Use the reference and mobile number from the booking. Demo values are pre-filled so you can try it immediately.</p>
          <div className="manage-search-card">
            <label>Booking reference<input value={reference} onChange={e=>setReference(e.target.value.toUpperCase())} placeholder="PRV-2048"/></label>
            <label>Mobile number<input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="0917 555 0148"/></label>
            <button onClick={findBooking}><SearchIcon/>Find booking</button>
          </div>
          {error && <div className="manage-error">{error}</div>}
          {notice && <div className="manage-notice"><CheckIcon/>{notice}</div>}
        </section>

        {matches.length>0 && first && <motion.section className="manage-result" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
          <div className="manage-result-head">
            <div><span>{first.groupId||first.id}</span><h2>{first.customer}</h2><p>{shortDate(first.date)} · {matches.length} court-hour{matches.length!==1?'s':''}</p></div>
            <div className={`manage-status ${status.toLowerCase()}`}><small>Booking status</small><strong>{status}</strong></div>
          </div>

          <div className="manage-summary-strip"><div><span>Total</span><strong>{money(total)}</strong></div><div><span>Payment</span><strong>{first.paymentMethod}</strong></div><div><span>Mobile</span><strong>{first.phone}</strong></div></div>

          <div className="manage-slot-stack">
            {matches.map(booking => {
              const court = getCourt(state,booking.courtId)
              const options = availableTimesFor(booking)
              return <article key={booking.id}>
                <div className="manage-slot-number">{court.number}</div>
                <div className="manage-slot-copy"><span>{court.shortName}</span><h3>{booking.time}</h3><small>{court.surface} · {money(court.rate)}/hr</small></div>
                <div className="manage-slot-change"><label>Move to<select value={moveTimes[booking.id]||booking.time} onChange={e=>setMoveTimes(current=>({...current,[booking.id]:e.target.value}))}>{options.map(time=><option key={time}>{time}</option>)}</select></label><button disabled={(moveTimes[booking.id]||booking.time)===booking.time} onClick={()=>reschedule(booking)}>Save time</button></div>
                <button className="manage-remove-slot" onClick={()=>cancelSlot(booking)}>Remove</button>
              </article>
            })}
          </div>

          <div className="manage-venue-card">
            <div><span>Where to go</span><h2>{state.venue.name}</h2><p>{state.venue.address}</p></div>
            <VenueMap venue={state.venue} compact/>
          </div>

          <div className="manage-actions"><button className="manage-cancel" onClick={cancelBooking}>Cancel entire booking</button><Link className="book-next" to="/demo/book">Book more time <Arrow/></Link></div>
        </motion.section>}

        {!matches.length && activeReference==='' && <section className="manage-demo-tip"><span>Try the seeded demo</span><strong>PRV-2048</strong><small>0917 555 0148</small></section>}
      </main>
    </div>
  )
}
