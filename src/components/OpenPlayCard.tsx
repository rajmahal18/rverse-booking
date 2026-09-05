import { Link } from 'react-router-dom'
import PickleRVerseBrand from './PickleRVerseBrand'
import ReclubBrand from './ReclubBrand'
import { Arrow, CalendarIcon, ClockIcon, ExternalIcon, MapPinIcon, UsersIcon } from './Icons'
import { money, openPlaySpotsLeft, shortDate, type OpenPlayConfig } from '../lib/demoStore'

export default function OpenPlayCard({ openPlay, compact = false }: { openPlay: OpenPlayConfig; compact?: boolean }) {
  const spotsLeft = openPlaySpotsLeft(openPlay)
  const filled = Math.min(100, Math.round((openPlay.registered / openPlay.maxPlayers) * 100))
  const external = openPlay.hostType === 'Reclub' && openPlay.externalUrl

  const content = (
    <>
      <div className="open-play-card-topline">
        <div className={`open-play-platform ${openPlay.hostType === 'Reclub' ? 'external' : 'native'}`}>
          {openPlay.hostType === 'Reclub' ? <ReclubBrand /> : <PickleRVerseBrand markOnly />}
          <span>{openPlay.hostType === 'Reclub' ? 'Registration on Reclub' : 'Hosted via PickleRVerse'}</span>
        </div>
        <span className="open-play-spots"><UsersIcon /> {spotsLeft > 0 ? `${spotsLeft} left` : 'Full'}</span>
      </div>

      <div className="open-play-card-copy">
        <span>{openPlay.organizer}</span>
        <h3>{openPlay.title}</h3>
      </div>

      <div className="open-play-glance-grid">
        <div><CalendarIcon/><span><small>Date</small><strong>{shortDate(openPlay.date)}</strong></span></div>
        <div><ClockIcon/><span><small>Time</small><strong>{openPlay.startTime}–{openPlay.endTime}</strong></span></div>
        <div><UsersIcon/><span><small>Players</small><strong>{openPlay.registered}/{openPlay.maxPlayers}</strong></span></div>
        <div><span className="open-play-peso">₱</span><span><small>Fee</small><strong>{money(openPlay.price)}</strong></span></div>
      </div>

      <div className="open-play-card-skill">
        <strong>{openPlay.skillLevel}</strong>
        <small>{openPlay.format}</small>
      </div>

      {!compact && <div className="open-play-tags">{openPlay.tags.slice(0,3).map(tag => <span key={tag}>{tag}</span>)}</div>}

      <div className="open-play-card-venue"><MapPinIcon/><span>PickleRVerse · Cotabato City</span></div>
      <div className="open-play-capacity" aria-label={`${openPlay.registered} of ${openPlay.maxPlayers} spots filled`}><i style={{ width: `${filled}%` }} /></div>
      <div className="open-play-card-bottom">
        <span>{spotsLeft > 0 ? `${spotsLeft} spot${spotsLeft === 1 ? '' : 's'} available` : 'Check waitlist availability'}</span>
        <span className="open-play-card-cta">{external ? <>Open Reclub <ExternalIcon /></> : <>View & join <Arrow /></>}</span>
      </div>
    </>
  )

  if (external) {
    return <a className="open-play-card" href={openPlay.externalUrl} target="_blank" rel="noreferrer" aria-label={`${openPlay.title}. Opens Reclub in a new tab.`}>{content}</a>
  }

  return <Link className="open-play-card" to={`/demo/open-plays/${openPlay.id}`}>{content}</Link>
}
