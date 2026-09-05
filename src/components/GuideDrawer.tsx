import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'

type Guide = { kicker: string; title: string; intro: string; items: string[] }

export const guides: Record<string, Guide> = {
  booking: {
    kicker: 'Player booking',
    title: 'How a player books.',
    intro: 'Players choose a date, tap available court-hours, review the total, and pay online to confirm.',
    items: ['Choose any available date within the booking window.','Tap one or more available court-hours from the all-courts schedule.','Open the booking cart and review every selected slot and the total.','Enter player details and pay through the online checkout.','The booking appears only after payment succeeds, then the player gets a reference and receipt.'],
  },
  admin: {
    kicker: 'Court staff',
    title: 'What staff can manage.',
    intro: 'The same schedule covers confirmed online bookings plus any walk-in or phone booking the staff deliberately creates.',
    items: ['Daily court schedule','Manual walk-in or phone bookings','Blocked and maintenance hours','Paid online bookings','Staff-created unpaid records when needed','Booking lookup, rescheduling, and cancellation'],
  },
  payments: {
    kicker: 'Payments',
    title: 'Public bookings confirm after payment.',
    intro: 'The customer does not get a booking just by selecting a slot. The booking is written to the schedule only after successful payment.',
    items: ['Online checkout can connect to PayMongo or another agreed provider.','The payment provider reports success before the booking is confirmed.','A public booking appears only after successful payment.','Court Staff can still create a manual walk-in or phone booking when the facility chooses to do so.','Processor charges and settlement depend on the merchant account.'],
  },
  included: {
    kicker: 'Core scope',
    title: 'What is included in the booking system.',
    intro: 'The MVP covers the public booking experience and the staff controls needed to operate the schedule.',
    items: ['Branded public booking site with your own facility identity','Customized court names, colors, rates, rules, and payment details','Multiple courts or bookable resources','Availability and double-booking protection','Manual staff bookings and blocked hours','Online payment status and booking receipts','Open play listings with native or external registration','Court staff access','Basic booking and revenue reporting','Mobile-first public and staff views'],
  },
  setup: {
    kicker: 'Setup',
    title: 'What we need from the court.',
    intro: 'Most of the setup comes from information the facility already uses today.',
    items: ['Facility name, logo, contact details, and location','Court names and operating hours','Rates and duration rules','Preferred payment provider and payout details','Cancellation and rescheduling policy','Open play organizers or club listings, if any','Staff accounts','Domain preference'],
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
