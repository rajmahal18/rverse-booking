import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'

type Guide = { kicker: string; title: string; intro: string; items: string[] }

export const guides: Record<string, Guide> = {
  booking: {
    kicker: 'Player booking',
    title: 'How a player books.',
    intro: 'Players see every court on one schedule, then choose exactly the court-hours they want.',
    items: ['Choose a date.','Tap one or more available court-hours from the all-courts schedule.','Open the booking cart and review every selected slot and the total.','Enter booking details, then pay online or upload payment proof.','Receive a booking reference and payment status.'],
  },
  admin: {
    kicker: 'Court staff',
    title: 'What staff can manage.',
    intro: 'The same schedule covers bookings made online, by phone, or at the court.',
    items: ['Daily court schedule','Manual walk-in or phone bookings','Blocked and maintenance hours','Paid, unpaid, and pending-review bookings','Payment-proof review','Booking lookup and status changes'],
  },
  payments: {
    kicker: 'Payments',
    title: 'Two payment paths can be supported.',
    intro: 'The demo shows both instant online payment and manual payment-proof review.',
    items: ['Online checkout can connect to PayMongo or another agreed provider.','Manual payment proof stays attached to the booking record.','Staff can review the uploaded proof from Court Staff view.','Verification changes the booking payment status.','Processor charges and settlement depend on the merchant account.'],
  },
  included: {
    kicker: 'Core scope',
    title: 'What is included in the booking system.',
    intro: 'The MVP covers the public booking experience and the staff controls needed to operate the schedule.',
    items: ['Branded public booking site','Multiple courts or bookable resources','Availability and double-booking protection','Manual bookings and blocked hours','Payment status and proof tracking','Court staff access','Basic booking and revenue reporting','Mobile-friendly public and staff views'],
  },
  setup: {
    kicker: 'Setup',
    title: 'What we need from the court.',
    intro: 'Most of the setup comes from information the facility already uses today.',
    items: ['Facility name, logo, contact details, and location','Court names and operating hours','Rates and duration rules','Preferred payment methods','Cancellation and rescheduling policy','Staff accounts','Domain preference'],
  },
  pricing: {
    kicker: 'Pricing',
    title: 'What each option means.',
    intro: 'The software scope stays similar. The difference is how development and ongoing operation are paid for.',
    items: ['Fixed development: 1-3 courts ₱15,000, 4-6 courts ₱20,000, 7+ courts ₱25,000, plus ₱1,500/month hosting and routine maintenance.','Booking partnership: ₱0 upfront + ₱10 per booked court-hour, with hosting and routine maintenance included.','Payment-provider charges are separate from the convenience fee.','Custom integrations or scope outside the agreed booking system are quoted separately.'],
  },
}

export default function GuideDrawer({ guideKey, onClose }: { guideKey: string | null; onClose: () => void }) {
  useEffect(() => {
    if (!guideKey) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [guideKey, onClose])

  const guide = guideKey ? guides[guideKey] : null

  return (
    <AnimatePresence>
      {guide && (
        <motion.div className="guide-layer" onMouseDown={(e) => e.currentTarget === e.target && onClose()} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.16}}>
          <motion.aside className="guide-drawer" role="dialog" aria-modal="true" aria-label={guide.title} initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:'spring',stiffness:330,damping:34}}>
            <div className="guide-top"><span>{guide.kicker}</span><button onClick={onClose} aria-label="Close">×</button></div>
            <div className="guide-head"><h2>{guide.title}</h2><p>{guide.intro}</p></div>
            <div className="guide-items">{guide.items.map((item, i) => <div key={item}><span>{String(i + 1).padStart(2,'0')}</span><p>{item}</p></div>)}</div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
