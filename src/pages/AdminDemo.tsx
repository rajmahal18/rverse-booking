import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import DemoBar from '../components/DemoBar'
import PickleRVerseBrand from '../components/PickleRVerseBrand'
import VenueMap from '../components/VenueMap'
import { CalendarIcon, GridIcon, ListIcon, PlusIcon, SettingsIcon, WalletIcon, CheckIcon } from '../components/Icons'
import { bookingTimes, getCourt, isDurationAvailable, isOccupied, loadDemoState, makeDates, makeReference, money, saveDemoState, shortDate, timeSlots, type CourtConfig, type DemoBooking, type DemoState, type VenueConfig } from '../lib/demoStore'

type Tab = 'overview'|'schedule'|'bookings'|'payments'|'settings'
type SettingsDraft = { courts:CourtConfig[]; venue:VenueConfig }
type VenueTextField = Exclude<keyof VenueConfig,'amenities'|'rules'|'nearby'>

function cloneSettings(state:DemoState):SettingsDraft {
  return {
    courts:state.courts.map(c=>({...c})),
    venue:{...state.venue,amenities:[...state.venue.amenities],rules:[...state.venue.rules],nearby:[...state.venue.nearby]},
  }
}

export default function AdminDemo() {
  const dates = makeDates(7)
  const [state, setState] = useState<DemoState>(loadDemoState())
  const [tab, setTab] = useState<Tab>('overview')
  const [date, setDate] = useState(dates[0].iso)
  const [selected, setSelected] = useState<DemoBooking | null>(null)
  const [manualOpen, setManualOpen] = useState(false)
  const [manualName, setManualName] = useState('Walk-in player')
  const [manualCourt, setManualCourt] = useState(state.courts[0].id)
  const [manualTime, setManualTime] = useState('3:00 PM')
  const [moveTime, setMoveTime] = useState('')
  const [settingsDraft, setSettingsDraft] = useState<SettingsDraft>(()=>cloneSettings(state))
  const [settingsSaved, setSettingsSaved] = useState(false)

  useEffect(() => { if (selected) setMoveTime(selected.time) }, [selected])
  useEffect(() => {
    const refresh = () => setState(loadDemoState())
    window.addEventListener('picklerverse-demo-change', refresh)
    return () => window.removeEventListener('picklerverse-demo-change', refresh)
  }, [])
  useEffect(() => { setSettingsDraft(cloneSettings(state)) }, [state.courts,state.venue])

  function update(next: DemoState) { setState(next); saveDemoState(next) }
  const dayBookings = useMemo(() => state.bookings.filter(b => b.date === date), [state,date])
  const pendingCourtHours = state.bookings.filter(b => b.paymentStatus === 'Pending review')
  const pendingGroups = useMemo(() => {
    const groups = new Map<string, DemoBooking[]>()
    pendingCourtHours.forEach((booking) => {
      const reference = booking.groupId || booking.id
      groups.set(reference, [...(groups.get(reference) || []), booking])
    })
    return Array.from(groups, ([reference, bookings]) => ({
      reference,
      bookings,
      first: bookings[0],
      total: bookings.reduce((sum, booking) => sum + booking.amount, 0),
    }))
  }, [state.bookings])
  const paidTotal = state.bookings.filter(b=>b.paymentStatus==='Paid').reduce((sum,b)=>sum+b.amount,0)

  function toggleBlock(courtId:string,time:string) {
    const key = `${date}|${courtId}|${time}`
    const isBooked = dayBookings.some(b => b.courtId===courtId && bookingTimes(b).includes(time))
    if (isBooked) return
    const nextBlocked = state.blocked.includes(key) ? state.blocked.filter(x=>x!==key) : [...state.blocked,key]
    update({ ...state, blocked:nextBlocked })
  }

  function verify(id:string) {
    const target = state.bookings.find(b=>b.id===id)
    const groupId = target?.groupId
    const next = { ...state, bookings:state.bookings.map(b => (groupId ? b.groupId===groupId : b.id===id) ? {...b,paymentStatus:'Paid' as const} : b) }
    update(next)
    if (selected && (selected.id===id || (groupId && selected.groupId===groupId))) setSelected(next.bookings.find(b=>b.id===selected.id) || null)
  }

  function createManual() {
    if (isOccupied(state,date,manualCourt,manualTime)) return
    const court = getCourt(state,manualCourt)
    const id = makeReference(state)
    const booking: DemoBooking = { id,groupId:id,customer:manualName || 'Walk-in player',phone:'—',courtId:court.id,courtName:court.name,date,time:manualTime,duration:1,amount:court.rate,paymentMethod:'Cash',paymentStatus:'Unpaid',source:'Staff',createdAt:new Date().toISOString() }
    update({ ...state, bookings:[booking,...state.bookings] })
    setManualOpen(false); setTab('bookings'); setSelected(booking)
  }

  function availableTimesFor(booking: DemoBooking) {
    const withoutBooking = { ...state, bookings: state.bookings.filter(b => b.id !== booking.id) }
    return timeSlots.filter(t => isDurationAvailable(withoutBooking, booking.date, booking.courtId, t, booking.duration))
  }

  function rescheduleSelected() {
    if (!selected || !moveTime) return
    const options = availableTimesFor(selected)
    if (!options.includes(moveTime)) return
    const nextBooking = { ...selected, time: moveTime }
    const next = { ...state, bookings: state.bookings.map(b => b.id === selected.id ? nextBooking : b) }
    update(next)
    setSelected(nextBooking)
  }

  function cancelSelected() {
    if (!selected) return
    update({ ...state, bookings: state.bookings.filter(b => b.id !== selected.id) })
    setSelected(null)
  }

  function updateCourtDraft(id:string,field:keyof CourtConfig,value:string|number) {
    setSettingsSaved(false)
    setSettingsDraft(current=>({...current,courts:current.courts.map(c=>c.id===id?{...c,[field]:value}:c)}))
  }

  function updateVenueDraft(field:VenueTextField,value:string) {
    setSettingsSaved(false)
    setSettingsDraft(current=>({...current,venue:{...current.venue,[field]:value}}))
  }

  function updateVenueList(field:'amenities'|'rules'|'nearby',value:string) {
    setSettingsSaved(false)
    const items = value.split('\n').map(item=>item.trim()).filter(Boolean)
    setSettingsDraft(current=>({...current,venue:{...current.venue,[field]:items}}))
  }

  function saveSettings() {
    const courts = settingsDraft.courts.map(c=>({...c,rate:Math.max(0,Number(c.rate)||0)}))
    const next:DemoState = {
      ...state,
      courts,
      venue:{...settingsDraft.venue},
      bookings:state.bookings.map(b=>({ ...b, courtName:courts.find(c=>c.id===b.courtId)?.name || b.courtName })),
    }
    update(next)
    setSettingsSaved(true)
    window.setTimeout(()=>setSettingsSaved(false),2200)
  }

  function slot(courtId:string,time:string) {
    const booking = dayBookings.find(b=>b.courtId===courtId && bookingTimes(b).includes(time))
    const blocked = state.blocked.includes(`${date}|${courtId}|${time}`)
    if (booking) return <button className={`schedule-cell booked ${booking.paymentStatus==='Pending review'?'pending':''}`} onClick={()=>setSelected(booking)}><strong>{booking.customer}</strong><small>{booking.paymentStatus}</small></button>
    if (blocked) return <button className="schedule-cell blocked" onClick={()=>toggleBlock(courtId,time)}><strong>Blocked</strong><small>Select to reopen</small></button>
    return <button className="schedule-cell available" onClick={()=>toggleBlock(courtId,time)}><span>Available</span><small>Select to block</small></button>
  }

  return (
    <div className="admin-shell">
      <DemoBar />
      <div className="admin-app">
        <aside className="admin-sidebar">
          <Link to="/demo" className="admin-brand admin-brand-custom"><PickleRVerseBrand markOnly/><span><strong>PickleRVerse</strong><small>Court Staff</small></span></Link>
          <nav>
            <button className={tab==='overview'?'active':''} onClick={()=>setTab('overview')}><GridIcon/><span>Overview</span></button>
            <button className={tab==='schedule'?'active':''} onClick={()=>setTab('schedule')}><CalendarIcon/><span>Schedule</span></button>
            <button className={tab==='bookings'?'active':''} onClick={()=>setTab('bookings')}><ListIcon/><span>Bookings</span></button>
            <button className={tab==='payments'?'active':''} onClick={()=>setTab('payments')}><WalletIcon/><span>Payments</span> {pendingGroups.length>0&&<b>{pendingGroups.length}</b>}</button>
            <button className={tab==='settings'?'active':''} onClick={()=>setTab('settings')}><SettingsIcon/><span>Venue & courts</span></button>
          </nav>
          <div className="admin-sidebar-note"><span>PickleRVerse workspace</span><p>{state.venue.locationLabel}<br/>{state.venue.hours}</p></div>
        </aside>

        <main className="admin-content">
          <header className="admin-top"><div><span>PickleRVerse · Court Staff · {state.venue.locationLabel}</span><h1>{tab==='settings'?'Venue & courts':tab[0].toUpperCase()+tab.slice(1)}</h1></div>{tab!=='settings'&&<button className="admin-primary" onClick={()=>setManualOpen(true)}><PlusIcon/><span>Add booking</span></button>}</header>

          {tab==='overview' && <div className="admin-view">
            <section className="admin-venue-banner"><img src="/brand/picklerverse-venue.webp" alt="PickleRVerse venue"/><div><PickleRVerseBrand/><span>{state.venue.address}</span><small>{state.venue.phone} · {state.venue.hours}</small></div></section>
            <section className="admin-metrics"><article><span>Today’s court-hours</span><strong>{state.bookings.filter(b=>b.date===dates[0].iso).length}</strong><small>{state.courts.map(c=>c.shortName).join(' · ')}</small></article><article><span>Paid total</span><strong>{money(paidTotal)}</strong><small>Across demo bookings</small></article><article><span>Payment reviews</span><strong>{pendingGroups.length}</strong><small>{pendingCourtHours.length} reserved court-hour{pendingCourtHours.length!==1?'s':''}</small></article></section>
            <section className="admin-panel"><div className="panel-head"><div><span>Today</span><h2>Courts at a glance</h2></div><button onClick={()=>setTab('schedule')}>Open schedule →</button></div><div className="overview-schedule">{state.courts.map(c=><div key={c.id}><span>{c.name}</span>{timeSlots.slice(6,12).map(t=>{const b=state.bookings.find(x=>x.date===dates[0].iso&&x.courtId===c.id&&bookingTimes(x).includes(t));const blocked=state.blocked.includes(`${dates[0].iso}|${c.id}|${t}`);return <i key={t} className={b?b.paymentStatus==='Pending review'?'pending':'busy':blocked?'blocked':''} title={`${t} · ${b?b.customer:blocked?'Blocked':'Available'}`}></i>})}</div>)}</div></section>
            <section className="admin-split"><div className="admin-panel"><div className="panel-head"><div><span>Latest</span><h2>Recent bookings</h2></div><button onClick={()=>setTab('bookings')}>View all →</button></div><div className="mini-bookings">{state.bookings.slice(0,4).map(b=><button key={b.id} onClick={()=>setSelected(b)}><span><strong>{b.customer}</strong><small>{b.groupId||b.id} · {b.courtName}</small></span><span><strong>{shortDate(b.date)}</strong><small>{b.time}</small></span><i className={b.paymentStatus==='Paid'?'paid':b.paymentStatus==='Pending review'?'pending':''}>{b.paymentStatus}</i></button>)}</div></div>
            <div className="admin-panel"><div className="panel-head"><div><span>Payments</span><h2>Waiting for review</h2></div></div>{pendingGroups.length?<div className="review-queue">{pendingGroups.slice(0,3).map(group=><div key={group.reference}><span><strong>{group.first.customer}</strong><small>{group.reference} · {group.bookings.length} court-hour{group.bookings.length!==1?'s':''}</small></span><button onClick={()=>verify(group.first.id)}><CheckIcon/>Verify</button></div>)}</div>:<div className="empty-state">No proofs waiting for review.</div>}</div></section>
          </div>}

          {tab==='schedule' && <div className="admin-view"><div className="admin-toolbar"><div className="admin-date-tabs">{dates.slice(0,5).map(d=><button className={date===d.iso?'active':''} key={d.iso} onClick={()=>setDate(d.iso)}><small>{d.dow}</small><strong>{d.day}</strong></button>)}</div><p>Select an available slot to block it. Select a blocked slot to reopen it.</p></div><div className="schedule-grid"><div className="schedule-grid-head"><span>Time</span>{state.courts.map(c=><strong key={c.id}>{c.name}</strong>)}</div>{timeSlots.map(time=><div className="schedule-grid-row" key={time}><span>{time}</span>{state.courts.map(c=><div key={c.id}>{slot(c.id,time)}</div>)}</div>)}</div></div>}

          {tab==='bookings' && <div className="admin-view"><div className="list-head"><div><span>All demo records</span><h2>{state.bookings.length} court-hours</h2></div><div className="legend"><span><i className="dot paid"></i>Paid</span><span><i className="dot pending"></i>Pending review</span><span><i className="dot"></i>Unpaid</span></div></div><div className="booking-table"><div className="booking-table-head"><span>Booking</span><span>Schedule</span><span>Payment</span><span>Source</span></div>{state.bookings.map(b=><button key={b.id} onClick={()=>setSelected(b)}><span><strong>{b.customer}</strong><small>{b.groupId||b.id}</small></span><span><strong>{b.courtName}</strong><small>{shortDate(b.date)} · {b.time}</small></span><span><strong>{money(b.amount)}</strong><small className={b.paymentStatus==='Paid'?'paid-text':b.paymentStatus==='Pending review'?'pending-text':''}>{b.paymentStatus}</small></span><span><strong>{b.source}</strong><small>{b.paymentMethod}</small></span></button>)}</div></div>}

          {tab==='payments' && <div className="admin-view"><div className="list-head"><div><span>Manual verification</span><h2>Payment proofs</h2></div><p>One proof is shown per booking reference. Verify it once to confirm every included court-hour.</p></div>{pendingGroups.length?<div className="payment-review-grid">{pendingGroups.map(group=>{const b=group.first;return <article key={group.reference}><div className="proof-visual"><div className="admin-proof-brand"><PickleRVerseBrand markOnly/><span>{state.venue.paymentName}</span></div><span>Payment proof</span><strong>{money(group.total)}</strong><small>{b.proofName||'sample-payment-proof.jpg'}</small><i>{group.reference}</i></div><div className="proof-details"><span>{group.reference}</span><h3>{b.customer}</h3><p>{shortDate(b.date)} · {group.bookings.length} court-hour{group.bookings.length!==1?'s':''}</p><dl><div><dt>Method</dt><dd>{b.paymentMethod}</dd></div><div><dt>Status</dt><dd className="pending-text">Pending review</dd></div></dl><button onClick={()=>verify(b.id)}><CheckIcon/>Verify payment</button></div></article>})}</div>:<div className="large-empty"><CheckIcon/><h2>Everything is reviewed.</h2><p>Create a public booking with “Upload payment proof” to populate this queue again.</p><Link to="/demo/book">Create demo booking →</Link></div>}</div>}

          {tab==='settings' && <div className="admin-view settings-view">
            <div className="settings-intro"><div><span>Player-facing settings</span><h2>Manage the public court setup.</h2><p>Court names, rates, venue details, directions, rules, amenities, and payment instructions all feed the public PickleRVerse demo.</p></div><button className="admin-primary settings-save" onClick={saveSettings}><CheckIcon/><span>{settingsSaved?'Saved':'Save changes'}</span></button></div>

            <section className="settings-section"><div className="settings-section-head"><span>Courts</span><h3>Court details and rates</h3></div><div className="court-settings-grid">{settingsDraft.courts.map(court=><article key={court.id}><div className="court-settings-title"><b>{court.number}</b><span><strong>{court.name}</strong><small>{court.id}</small></span></div><label>Court name<input value={court.name} onChange={e=>updateCourtDraft(court.id,'name',e.target.value)}/></label><div className="settings-pair"><label>Short name<input value={court.shortName} onChange={e=>updateCourtDraft(court.id,'shortName',e.target.value)}/></label><label>Rate per hour<input type="number" min="0" step="10" value={court.rate} onChange={e=>updateCourtDraft(court.id,'rate',Number(e.target.value))}/></label></div><label>Surface / setup<input value={court.surface} onChange={e=>updateCourtDraft(court.id,'surface',e.target.value)}/></label><label>Lighting<input value={court.lighting} onChange={e=>updateCourtDraft(court.id,'lighting',e.target.value)}/></label><label>Best for<input value={court.bestFor} onChange={e=>updateCourtDraft(court.id,'bestFor',e.target.value)}/></label><label>Short note<input value={court.note} onChange={e=>updateCourtDraft(court.id,'note',e.target.value)}/></label></article>)}</div></section>

            <section className="settings-section"><div className="settings-section-head"><span>Venue profile</span><h3>Identity, location, and contact</h3></div><div className="venue-settings-grid"><label>Venue name<input value={settingsDraft.venue.name} onChange={e=>updateVenueDraft('name',e.target.value)}/></label><label>Venue type<input value={settingsDraft.venue.type} onChange={e=>updateVenueDraft('type',e.target.value)}/></label><label className="settings-wide">Public description<textarea value={settingsDraft.venue.description} onChange={e=>updateVenueDraft('description',e.target.value)}/></label><label>Location label<input value={settingsDraft.venue.locationLabel} onChange={e=>updateVenueDraft('locationLabel',e.target.value)}/></label><label>Operating hours<input value={settingsDraft.venue.hours} onChange={e=>updateVenueDraft('hours',e.target.value)}/></label><label className="settings-wide">Address<input value={settingsDraft.venue.address} onChange={e=>updateVenueDraft('address',e.target.value)}/></label><label>Nearby landmark<input value={settingsDraft.venue.landmark} onChange={e=>updateVenueDraft('landmark',e.target.value)}/></label><label>Parking note<input value={settingsDraft.venue.parking} onChange={e=>updateVenueDraft('parking',e.target.value)}/></label><label className="settings-wide">Directions<textarea value={settingsDraft.venue.directions} onChange={e=>updateVenueDraft('directions',e.target.value)}/></label><label>Contact number<input value={settingsDraft.venue.phone} onChange={e=>updateVenueDraft('phone',e.target.value)}/></label><label>Social handle<input value={settingsDraft.venue.social} onChange={e=>updateVenueDraft('social',e.target.value)}/></label></div></section>

            <section className="settings-section settings-content-section"><div className="settings-section-head"><span>On-site information</span><h3>Amenities, nearby places, and house rules</h3></div><div className="settings-textarea-grid"><label>Amenities <small>One per line</small><textarea value={settingsDraft.venue.amenities.join('\n')} onChange={e=>updateVenueList('amenities',e.target.value)}/></label><label>Nearby places <small>One per line</small><textarea value={settingsDraft.venue.nearby.join('\n')} onChange={e=>updateVenueList('nearby',e.target.value)}/></label><label className="settings-wide">House rules <small>One per line</small><textarea value={settingsDraft.venue.rules.join('\n')} onChange={e=>updateVenueList('rules',e.target.value)}/></label></div></section>

            <section className="settings-section"><div className="settings-section-head"><span>Payments</span><h3>Where manual payments go</h3></div><div className="venue-settings-grid"><label>Payment recipient<input value={settingsDraft.venue.paymentName} onChange={e=>updateVenueDraft('paymentName',e.target.value)}/></label><label>Payment number<input value={settingsDraft.venue.paymentNumber} onChange={e=>updateVenueDraft('paymentNumber',e.target.value)}/></label><label className="settings-wide">Payment instructions<textarea value={settingsDraft.venue.paymentInstructions} onChange={e=>updateVenueDraft('paymentInstructions',e.target.value)}/></label></div></section>

            <section className="settings-map-preview"><div className="settings-section-head"><span>Location preview</span><h3>What players see after you save</h3></div><VenueMap venue={settingsDraft.venue} compact/></section>
            <div className="settings-preview-note"><PickleRVerseBrand markOnly/><span><strong>Preview the player-facing result.</strong><small>Save first, then open Player view. Court cards, booking rates, venue details, map information, rules, and payment text will use these settings.</small></span><Link to="/demo">Open Player view →</Link></div>
          </div>}
        </main>
      </div>

      {selected && <div className="admin-drawer-layer" onMouseDown={e=>e.currentTarget===e.target&&setSelected(null)}><aside className="booking-drawer"><button className="drawer-close" onClick={()=>setSelected(null)}>×</button><span>{selected.groupId||selected.id}</span><h2>{selected.customer}</h2><p>{selected.courtName} · {shortDate(selected.date)} · {selected.time}</p><div className="drawer-facts"><div><span>Duration</span><strong>1 hour</strong></div><div><span>Amount</span><strong>{money(selected.amount)}</strong></div><div><span>Payment</span><strong>{selected.paymentMethod}</strong></div><div><span>Status</span><strong className={selected.paymentStatus==='Paid'?'paid-text':selected.paymentStatus==='Pending review'?'pending-text':''}>{selected.paymentStatus}</strong></div><div><span>Source</span><strong>{selected.source}</strong></div>{selected.email&&<div><span>Email</span><strong>{selected.email}</strong></div>}{selected.proofName&&<div><span>Proof</span><strong>{selected.proofName}</strong></div>}</div><div className="drawer-reschedule"><label>Move this slot to<select value={moveTime} onChange={e=>setMoveTime(e.target.value)}>{availableTimesFor(selected).map(t=><option key={t}>{t}</option>)}</select></label><button onClick={rescheduleSelected} disabled={moveTime===selected.time}>Update time</button></div>{selected.paymentStatus==='Pending review'&&<button className="admin-primary drawer-action" onClick={()=>verify(selected.id)}><CheckIcon/><span>Verify whole payment</span></button>}<button className="drawer-cancel" onClick={cancelSelected}>Cancel this slot</button></aside></div>}

      {manualOpen && <div className="admin-drawer-layer" onMouseDown={e=>e.currentTarget===e.target&&setManualOpen(false)}><aside className="booking-drawer manual-drawer"><button className="drawer-close" onClick={()=>setManualOpen(false)}>×</button><span>Staff booking</span><h2>Add a booking.</h2><label>Player name<input value={manualName} onChange={e=>setManualName(e.target.value)}/></label><label>Court<select value={manualCourt} onChange={e=>setManualCourt(e.target.value)}>{state.courts.map(c=><option value={c.id} key={c.id}>{c.name} · {money(c.rate)}/hr</option>)}</select></label><label>Date<select value={date} onChange={e=>setDate(e.target.value)}>{dates.map(d=><option value={d.iso} key={d.iso}>{d.label}</option>)}</select></label><label>Time<select value={manualTime} onChange={e=>setManualTime(e.target.value)}>{timeSlots.map(t=><option key={t} disabled={isOccupied(state,date,manualCourt,t)}>{t}{isOccupied(state,date,manualCourt,t)?' — unavailable':''}</option>)}</select></label><button className="admin-primary drawer-action" onClick={createManual}><PlusIcon/><span>Create booking</span></button></aside></div>}
    </div>
  )
}
