import { useState } from 'react'
import { motion } from 'motion/react'
import { CarIcon, CopyIcon, MapPinIcon } from './Icons'
import type { VenueConfig } from '../lib/demoStore'

type Props = {
  venue: VenueConfig
  compact?: boolean
}

export default function VenueMap({ venue, compact = false }: Props) {
  const [copied, setCopied] = useState(false)
  const [directionsOpen, setDirectionsOpen] = useState(false)

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(venue.address)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className={`venue-map-card${compact ? ' compact' : ''}`} aria-label="Fictional PickleRVerse location map">
      <div className="venue-map-canvas">
        <svg viewBox="0 0 760 430" role="img" aria-label={`Illustrated map around ${venue.name}`}>
          <rect width="760" height="430" fill="#f7f1e4" />
          <path d="M-40 318 C130 255 226 330 390 270 S645 200 820 245" className="map-river" />
          <path d="M86 -20 V450 M542 -20 V450" className="map-road-wide" />
          <path d="M-40 118 H810 M-40 360 H810" className="map-road" />
          <path d="M265 118 V360 M650 118 V360" className="map-road-small" />
          <circle cx="542" cy="118" r="39" className="map-roundabout" />
          <path d="M503 118h78M542 79v78" className="map-roundabout-lines" />
          <rect x="306" y="162" width="190" height="125" rx="18" className="map-venue" />
          <rect x="326" y="180" width="45" height="78" rx="7" className="map-court" />
          <rect x="378" y="180" width="45" height="78" rx="7" className="map-court" />
          <rect x="430" y="180" width="45" height="78" rx="7" className="map-court" />
          <path d="M326 219h45M378 219h45M430 219h45" className="map-net" />
          <rect x="108" y="145" width="106" height="66" rx="12" className="map-landmark" />
          <rect x="565" y="268" width="124" height="63" rx="12" className="map-landmark" />
          <rect x="121" y="378" width="145" height="34" rx="10" className="map-parking" />
          <circle cx="399" cy="151" r="11" className="map-pin-dot" />
          <path d="M399 95c-28 0-50 22-50 50 0 36 50 78 50 78s50-42 50-78c0-28-22-50-50-50Zm0 68a18 18 0 1 1 0-36 18 18 0 0 1 0 36Z" className="map-pin" />
          <text x="27" y="109" className="map-label road">RIVERSIDE DRIVE</text>
          <text x="96" y="32" className="map-label road vertical">ORBIT AVENUE</text>
          <text x="552" y="32" className="map-label road vertical">SOUTH LOOP</text>
          <text x="116" y="171" className="map-label strong">CityMall South</text>
          <text x="578" y="294" className="map-label strong">Riverside Park</text>
          <text x="139" y="401" className="map-label strong">South Loop Parking</text>
          <text x="335" y="278" className="map-label venue">PICKLERVERSE</text>
          <text x="558" y="124" className="map-label strong">Riverside Circle</text>
        </svg>
        <div className="map-brand-pin"><MapPinIcon/><span>{venue.name}</span></div>
        <span className="map-demo-label">Illustrated demo map</span>
      </div>

      <div className="venue-map-info">
        <div className="venue-map-title">
          <span>Location</span>
          <h3>{venue.locationLabel}</h3>
          <p>{venue.address}</p>
        </div>
        <div className="venue-map-facts">
          <div><MapPinIcon/><span><small>Landmark</small><strong>{venue.landmark}</strong></span></div>
          <div><CarIcon/><span><small>Parking</small><strong>{venue.parking}</strong></span></div>
        </div>
        {!compact && <div className="venue-nearby-list">{venue.nearby.map(item => <span key={item}>{item}</span>)}</div>}
        <div className="venue-map-actions">
          <button onClick={() => setDirectionsOpen(value => !value)}><MapPinIcon/>{directionsOpen ? 'Hide directions' : 'View directions'}</button>
          <button className="map-copy" onClick={copyAddress}><CopyIcon/>{copied ? 'Copied' : 'Copy address'}</button>
        </div>
        {directionsOpen && <motion.div className="venue-directions" initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}}><strong>Getting there</strong><p>{venue.directions}</p></motion.div>}
      </div>
    </section>
  )
}
