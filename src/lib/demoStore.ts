export type PaymentStatus = 'Paid' | 'Unpaid'
export type BookingSource = 'Public' | 'Staff'
export type OpenPlayHostType = 'Court-hosted' | 'Reclub'

export type OpenPlayConfig = {
  id: string
  title: string
  hostType: OpenPlayHostType
  organizer: string
  date: string
  startTime: string
  endTime: string
  skillLevel: string
  format: string
  courtIds: string[]
  maxPlayers: number
  registered: number
  price: number
  summary: string
  description: string
  whoCanJoin: string
  whatToBring: string
  equipment: string
  checkIn: string
  cancellation: string
  contact: string
  tags: string[]
  externalUrl?: string
  published: boolean
  featured?: boolean
}

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
  openPlays: OpenPlayConfig[]
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
  paymentInstructions: 'Public bookings are confirmed only after successful online payment. Staff-created walk-ins or phone bookings are handled separately in Court Staff.',
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

function makeOpenPlays(): OpenPlayConfig[] {
  return [
    {
      id: 'saturday-social',
      title: 'Saturday Social Open Play',
      hostType: 'Court-hosted',
      organizer: 'IslamDink Pickleball Club',
      date: dateISO(1),
      startTime: '6:00 PM',
      endTime: '9:00 PM',
      skillLevel: 'Beginner–Intermediate · 2.5–3.5',
      format: 'Social rotation · mixed doubles',
      courtIds: ['orbit','nova','comet'],
      maxPlayers: 24,
      registered: 17,
      price: 200,
      summary: 'Come solo or with friends. IslamDink runs the rotations while registration stays inside PickleRVerse.',
      description: 'A relaxed three-hour community session built for players who want steady games without booking a full court. Players rotate after each game, and the court team keeps groups moving across all three courts.',
      whoCanJoin: 'Players comfortable with basic scoring and rally play. No partner is required; solo players are welcome.',
      whatToBring: 'Court shoes, water, and your paddle if you have one. Arrive ready to warm up before the first rotation.',
      equipment: 'Limited loaner paddles are available at check-in. Balls are provided by the host.',
      checkIn: 'Check in at the front desk from 5:40 PM. First rotation starts at 6:00 PM.',
      cancellation: 'Please message the court at least 6 hours before the session if you can no longer attend.',
      contact: 'IslamDink coordinator via PickleRVerse court desk · 0917 808 7787',
      tags: ['No partner needed','Rotation play','Paddles available'],
      published: true,
      featured: true,
    },
    {
      id: 'after-work-dinks',
      title: 'After-Work Dinks',
      hostType: 'Court-hosted',
      organizer: 'Cotabato Kitchen Club',
      date: dateISO(3),
      startTime: '7:00 PM',
      endTime: '9:00 PM',
      skillLevel: 'Intermediate · 3.0–4.0',
      format: 'Fast rotation · rally-focused doubles',
      courtIds: ['orbit','nova'],
      maxPlayers: 16,
      registered: 11,
      price: 180,
      summary: 'A quick after-work session by Cotabato Kitchen Club for players who want competitive-but-social games.',
      description: 'Two courts run continuous doubles rotations with short breaks between games. Pairings change throughout the session to keep matchups varied and the pace moving.',
      whoCanJoin: 'Intermediate players who can serve, keep score, and sustain rallies. You can join without a partner.',
      whatToBring: 'Court shoes, water, and a paddle. Light snacks and extra water are available at the lounge.',
      equipment: 'Balls are included. A small number of rental paddles are available while supplies last.',
      checkIn: 'Check in by 6:50 PM. Warm-up space opens at 6:40 PM.',
      cancellation: 'Cancellations made 6+ hours before play may be moved to another court-hosted open play.',
      contact: 'Cotabato Kitchen Club via PickleRVerse court desk · 0917 808 7787',
      tags: ['Weeknight','Intermediate','No fixed partner'],
      published: true,
      featured: true,
    },
    {
      id: 'reclub-sunday-rally',
      title: 'Sunday Community Rally',
      hostType: 'Reclub',
      organizer: 'Sultan Smash Club',
      date: dateISO(5),
      startTime: '4:00 PM',
      endTime: '7:00 PM',
      skillLevel: 'All levels · grouped by play level',
      format: 'Community open play · organizer-managed',
      courtIds: ['orbit','nova','comet'],
      maxPlayers: 28,
      registered: 21,
      price: 220,
      summary: 'Sultan Smash Club hosts this community session at PickleRVerse. Registration and roster updates continue on Reclub.',
      description: 'Sultan Smash Club organizes this session at PickleRVerse. The listing shows the practical event details at a glance, while registration, roster updates, and organizer announcements are handled on Reclub.',
      whoCanJoin: 'Open to players of all levels. The organizer groups players by level on the event roster.',
      whatToBring: 'Court shoes, water, paddle, and your Reclub confirmation.',
      equipment: 'Venue paddle rental remains available separately from event registration.',
      checkIn: 'Follow the organizer check-in instructions shown on Reclub.',
      cancellation: 'Cancellation and refund rules are controlled by the Reclub event organizer.',
      contact: 'See organizer contact details on Reclub.',
      tags: ['Community-hosted','All levels','Reclub registration'],
      externalUrl: 'https://reclub.co/',
      published: true,
      featured: true,
    },
    {
      id: 'reclub-rookie-night',
      title: 'Rookie Night',
      hostType: 'Reclub',
      organizer: 'Ranao Rally Club',
      date: dateISO(7),
      startTime: '6:30 PM',
      endTime: '8:30 PM',
      skillLevel: 'Beginner · 2.0–3.0',
      format: 'Guided games · beginner rotations',
      courtIds: ['nova','comet'],
      maxPlayers: 18,
      registered: 9,
      price: 160,
      summary: 'Ranao Rally Club runs beginner-friendly games with guided rotations. Registration is managed on Reclub.',
      description: 'A lower-pressure session for newer players who want structured games and help getting comfortable with rotation play.',
      whoCanJoin: 'New and developing players. No partner required.',
      whatToBring: 'Court shoes and water. A paddle is recommended but rentals are available.',
      equipment: 'Rental paddles and balls are available at the venue.',
      checkIn: 'See the Reclub event page for roster and arrival instructions.',
      cancellation: 'Organizer policy on Reclub applies.',
      contact: 'See organizer contact details on Reclub.',
      tags: ['Beginner-friendly','Guided play','Reclub registration'],
      externalUrl: 'https://reclub.co/',
      published: true,
    },
  ]
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
      { id: 'PRV-2049', groupId:'PRV-2049', customer: 'Anton Cruz', phone: '0918 222 1044', courtId: 'nova', courtName: 'Nova Court', date: dateISO(0), time: '4:00 PM', duration: 1, amount: 330, paymentMethod: 'Maya', paymentStatus: 'Paid', source: 'Public', createdAt: new Date().toISOString() },
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
    openPlays: makeOpenPlays(),
  }
}

function normalizeState(value: Partial<DemoState> | null | undefined): DemoState {
  const seeded = seedState()
  if (!value) return seeded
  const configuredCourts = Array.isArray(value.courts) && value.courts.length
    ? defaultCourts.map((fallback) => ({ ...fallback, ...(value.courts!.find((court) => court.id === fallback.id) || {}) }))
    : seeded.courts
  return {
    bookings: Array.isArray(value.bookings)
      ? value.bookings
          .filter((booking) => !(booking.source === 'Public' && (booking as { paymentStatus:string }).paymentStatus === 'Pending review'))
          .map((booking) => ({ ...booking, paymentStatus: ((booking as { paymentStatus:string }).paymentStatus === 'Pending review' ? 'Unpaid' : booking.paymentStatus) as PaymentStatus }))
      : seeded.bookings,
    blocked: Array.isArray(value.blocked) ? value.blocked : seeded.blocked,
    courts: configuredCourts,
    venue: {
      ...seeded.venue,
      ...(value.venue || {}),
      amenities: Array.isArray(value.venue?.amenities) ? value.venue!.amenities : seeded.venue.amenities,
      rules: Array.isArray(value.venue?.rules) ? value.venue!.rules : seeded.venue.rules,
      nearby: Array.isArray(value.venue?.nearby) ? value.venue!.nearby : seeded.venue.nearby,
    },
    openPlays: Array.isArray(value.openPlays)
      ? seeded.openPlays.map((fallback) => {
          const stored = value.openPlays!.find((item) => item.id === fallback.id)
          return stored ? { ...fallback, published: stored.published } : fallback
        })
      : seeded.openPlays,
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

export function getOpenPlay(state: DemoState, id: string) {
  return state.openPlays.find((openPlay) => openPlay.id === id)
}

export function openPlaySpotsLeft(openPlay: OpenPlayConfig) {
  return Math.max(0, openPlay.maxPlayers - openPlay.registered)
}
