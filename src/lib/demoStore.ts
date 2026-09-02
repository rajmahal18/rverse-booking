export type PaymentStatus = 'Paid' | 'Pending review' | 'Unpaid'
export type BookingSource = 'Public' | 'Staff'

export type CourtConfig = {
  id: string
  name: string
  shortName: string
  number: string
  surface: string
  note: string
  lighting: string
  bestFor: string
  rate: number
}

export type VenueConfig = {
  name: string
  type: string
  description: string
  address: string
  locationLabel: string
  landmark: string
  parking: string
  directions: string
  hours: string
  phone: string
  social: string
  paymentName: string
  paymentNumber: string
  paymentInstructions: string
  amenities: string[]
  rules: string[]
  nearby: string[]
}

export type DemoBooking = {
  id: string
  groupId?: string
  customer: string
  phone: string
  email?: string
  courtId: string
  courtName: string
  date: string
  time: string
  duration: number
  amount: number
  paymentMethod: string
  paymentStatus: PaymentStatus
  source: BookingSource
  proofName?: string
  createdAt: string
}

export type DemoState = {
  bookings: DemoBooking[]
  blocked: string[]
  courts: CourtConfig[]
  venue: VenueConfig
}

export const defaultVenue: VenueConfig = {
  name: 'PickleRVerse',
  type: 'Open-air pickleball club',
  description: 'Three outdoor courts for private games, open play, and coaching. Parking, paddle rental, and a waiting lounge are inside the venue.',
  address: '88 Orbit Avenue, Riverside District, Cotabato City',
  locationLabel: 'Riverside District · Cotabato City',
  landmark: 'Across Riverside Circle, beside South Loop Parking',
  parking: 'Free on-site parking · 18 vehicle spaces',
  directions: 'Enter from Orbit Avenue, turn at Riverside Circle, then use the blue PickleRVerse gate beside South Loop Parking.',
  hours: '7:00 AM–10:00 PM daily',
  phone: '0917 808 7787',
  social: '@PickleRVerse',
  paymentName: 'PickleRVerse Sports',
  paymentNumber: '0917 808 7787',
  paymentInstructions: 'Use your booking reference as the payment note. Manual proof uploads stay reserved until Court Staff verifies them.',
  amenities: ['Free parking', 'Paddle rental', 'Waiting lounge', 'Comfort room', 'Water station', 'Night lighting'],
  rules: [
    'Arrive 10 minutes before your schedule.',
    'Reschedule at least 6 hours before play.',
    'Use proper court shoes; non-marking soles preferred.',
    'Booked time includes warm-up and court turnover.',
  ],
  nearby: ['Riverside Circle · 2 min walk', 'South Loop Parking · beside venue', 'CityMall South · 5 min drive'],
}

export const defaultCourts: CourtConfig[] = [
  {
    id: 'orbit',
    name: 'Orbit Court',
    shortName: 'Orbit',
    number: '01',
    surface: 'Competition acrylic',
    note: 'Signature court · closest to check-in',
    lighting: 'Full LED lighting',
    bestFor: 'Competitive games & private matches',
    rate: 350,
  },
  {
    id: 'nova',
    name: 'Nova Court',
    shortName: 'Nova',
    number: '02',
    surface: 'Social-play acrylic',
    note: 'Center court · balanced lighting',
    lighting: 'Even LED coverage',
    bestFor: 'Open play & doubles sessions',
    rate: 320,
  },
  {
    id: 'comet',
    name: 'Comet Court',
    shortName: 'Comet',
    number: '03',
    surface: 'Training acrylic',
    note: 'Quieter side · coaching-friendly',
    lighting: 'Side-mounted LED lighting',
    bestFor: 'Training, drills & coaching',
    rate: 300,
  },
]

// Backward-compatible read-only defaults for places that do not need live settings.
export const venue = defaultVenue
export const courts = defaultCourts

export const timeSlots = ['7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM','8:00 PM','9:00 PM']

const key = 'picklerverse-demo-state-v4'

function dateISO(offset = 0) {
  const d = new Date()
  d.setHours(12,0,0,0)
  d.setDate(d.getDate() + offset)
  return d.toISOString().slice(0,10)
}

export function makeDates(count = 7) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date()
    d.setHours(12,0,0,0)
    d.setDate(d.getDate() + i)
    return {
      iso: d.toISOString().slice(0,10),
      dow: d.toLocaleDateString('en-PH', { weekday: 'short' }),
      day: d.toLocaleDateString('en-PH', { day: '2-digit' }),
      month: d.toLocaleDateString('en-PH', { month: 'short' }),
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' }),
    }
  })
}

function seedState(): DemoState {
  return {
    bookings: [
      { id: 'PRV-2048', groupId:'PRV-2048', customer: 'Mia Santos', phone: '0917 555 0148', courtId: 'orbit', courtName: 'Orbit Court', date: dateISO(0), time: '6:00 PM', duration: 1, amount: 360, paymentMethod: 'GCash', paymentStatus: 'Paid', source: 'Public', createdAt: new Date().toISOString() },
      { id: 'PRV-2048-02', groupId:'PRV-2048', customer: 'Mia Santos', phone: '0917 555 0148', courtId: 'orbit', courtName: 'Orbit Court', date: dateISO(0), time: '7:00 PM', duration: 1, amount: 360, paymentMethod: 'GCash', paymentStatus: 'Paid', source: 'Public', createdAt: new Date().toISOString() },
      { id: 'PRV-2049', groupId:'PRV-2049', customer: 'Anton Cruz', phone: '0918 222 1044', courtId: 'nova', courtName: 'Nova Court', date: dateISO(0), time: '4:00 PM', duration: 1, amount: 330, paymentMethod: 'Manual proof', paymentStatus: 'Pending review', source: 'Public', proofName: 'gcash-proof-2049.jpg', createdAt: new Date().toISOString() },
      { id: 'PRV-2050', groupId:'PRV-2050', customer: 'Jules Reyes', phone: '0919 883 2201', courtId: 'comet', courtName: 'Comet Court', date: dateISO(1), time: '8:00 AM', duration: 1, amount: 300, paymentMethod: 'Cash', paymentStatus: 'Unpaid', source: 'Staff', createdAt: new Date().toISOString() },
    ],
    blocked: [`${dateISO(0)}|orbit|9:00 PM`, `${dateISO(1)}|nova|1:00 PM`],
    courts: defaultCourts.map((court) => ({ ...court })),
    venue: {
      ...defaultVenue,
      amenities: [...defaultVenue.amenities],
      rules: [...defaultVenue.rules],
      nearby: [...defaultVenue.nearby],
    },
  }
}

function normalizeState(value: Partial<DemoState> | null | undefined): DemoState {
  const seeded = seedState()
  if (!value) return seeded
  const configuredCourts = Array.isArray(value.courts) && value.courts.length
    ? defaultCourts.map((fallback) => ({ ...fallback, ...(value.courts!.find((court) => court.id === fallback.id) || {}) }))
    : seeded.courts
  return {
    bookings: Array.isArray(value.bookings) ? value.bookings : seeded.bookings,
    blocked: Array.isArray(value.blocked) ? value.blocked : seeded.blocked,
    courts: configuredCourts,
    venue: {
      ...seeded.venue,
      ...(value.venue || {}),
      amenities: Array.isArray(value.venue?.amenities) ? value.venue!.amenities : seeded.venue.amenities,
      rules: Array.isArray(value.venue?.rules) ? value.venue!.rules : seeded.venue.rules,
      nearby: Array.isArray(value.venue?.nearby) ? value.venue!.nearby : seeded.venue.nearby,
    },
  }
}

export function loadDemoState(): DemoState {
  try {
    const stored = localStorage.getItem(key)
    if (stored) return normalizeState(JSON.parse(stored) as Partial<DemoState>)
  } catch {}
  const seeded = seedState()
  saveDemoState(seeded)
  return seeded
}

export function saveDemoState(state: DemoState) {
  localStorage.setItem(key, JSON.stringify(normalizeState(state)))
  window.dispatchEvent(new CustomEvent('picklerverse-demo-change'))
}

export function resetDemoState() {
  const state = seedState()
  saveDemoState(state)
  return state
}

export function isOccupied(state: DemoState, date: string, courtId: string, time: string) {
  const blocked = state.blocked.includes(`${date}|${courtId}|${time}`)
  const booked = state.bookings.some((b) => b.date === date && b.courtId === courtId && bookingTimes(b).includes(time))
  return blocked || booked
}

export function isDurationAvailable(state: DemoState, date: string, courtId: string, time: string, duration: number) {
  const index = timeSlots.indexOf(time)
  if (index < 0 || index + duration > timeSlots.length) return false
  return timeSlots.slice(index, index + duration).every((slot) => !isOccupied(state, date, courtId, slot))
}

export function bookingTimes(booking: DemoBooking) {
  const index = timeSlots.indexOf(booking.time)
  if (index < 0) return [booking.time]
  return timeSlots.slice(index, index + booking.duration)
}

export function getCourt(state: DemoState, courtId: string) {
  return state.courts.find((court) => court.id === courtId) || defaultCourts.find((court) => court.id === courtId) || defaultCourts[0]
}

export function bookingReference(booking: DemoBooking) {
  return booking.groupId || booking.id.replace(/-\d{2}$/,'')
}

export function bookingsForReference(state: DemoState, reference: string) {
  const target = reference.trim().toUpperCase()
  if (!target) return []
  return state.bookings.filter((booking) => bookingReference(booking).toUpperCase() === target || booking.id.toUpperCase() === target)
}

export function money(value: number) {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(value)
}

export function shortDate(iso: string) {
  const d = new Date(`${iso}T12:00:00`)
  return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function makeReference(state: DemoState) {
  const max = state.bookings.reduce((n, b) => {
    const match = bookingReference(b).match(/^PRV-(\d+)/)
    return Math.max(n, match ? Number(match[1]) : 2050)
  }, 2050)
  return `PRV-${max + 1}`
}
