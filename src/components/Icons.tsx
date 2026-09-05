import type { SVGProps } from 'react'

const base = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
export function Arrow(props: SVGProps<SVGSVGElement>) { return <svg {...base} {...props}><path d="M5 12h14M13 6l6 6-6 6"/></svg> }
export function CalendarIcon(props: SVGProps<SVGSVGElement>) { return <svg {...base} {...props}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg> }
export function CardIcon(props: SVGProps<SVGSVGElement>) { return <svg {...base} {...props}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/></svg> }
export function ClockIcon(props: SVGProps<SVGSVGElement>) { return <svg {...base} {...props}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg> }
export function CheckIcon(props: SVGProps<SVGSVGElement>) { return <svg {...base} {...props}><path d="m5 12 4 4L19 6"/></svg> }
export function Chevron(props: SVGProps<SVGSVGElement>) { return <svg {...base} {...props}><path d="m9 18 6-6-6-6"/></svg> }
export function UploadIcon(props: SVGProps<SVGSVGElement>) { return <svg {...base} {...props}><path d="M12 16V4M7 9l5-5 5 5M5 20h14"/></svg> }
export function UsersIcon(props: SVGProps<SVGSVGElement>) { return <svg {...base} {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M17 11a3 3 0 0 0 0-6M21 21v-2a4 4 0 0 0-3-3.87"/></svg> }
export function GridIcon(props: SVGProps<SVGSVGElement>) { return <svg {...base} {...props}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> }
export function ListIcon(props: SVGProps<SVGSVGElement>) { return <svg {...base} {...props}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg> }
export function WalletIcon(props: SVGProps<SVGSVGElement>) { return <svg {...base} {...props}><path d="M4 6h14a2 2 0 0 1 2 2v10H5a2 2 0 0 1-2-2V6a3 3 0 0 1 3-3h11"/><path d="M16 11h5v4h-5a2 2 0 0 1 0-4Z"/></svg> }
export function PlusIcon(props: SVGProps<SVGSVGElement>) { return <svg {...base} {...props}><path d="M12 5v14M5 12h14"/></svg> }
export function ResetIcon(props: SVGProps<SVGSVGElement>) { return <svg {...base} {...props}><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg> }
export function ExternalIcon(props: SVGProps<SVGSVGElement>) { return <svg {...base} {...props}><path d="M14 3h7v7M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg> }
export function SettingsIcon(props: SVGProps<SVGSVGElement>) { return <svg {...base} {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-4v-.08A1.7 1.7 0 0 0 8.97 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.52-1.03H3v-4h.08A1.7 1.7 0 0 0 4.6 8.97a1.7 1.7 0 0 0-.34-1.88L4.2 7.03 7.03 4.2l.06.06A1.7 1.7 0 0 0 8.97 4.6 1.7 1.7 0 0 0 10 3.08V3h4v.08a1.7 1.7 0 0 0 1.03 1.52 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06a1.7 1.7 0 0 0-.34 1.88A1.7 1.7 0 0 0 20.92 10H21v4h-.08A1.7 1.7 0 0 0 19.4 15Z"/></svg> }
export function MapPinIcon(props: SVGProps<SVGSVGElement>) { return <svg {...base} {...props}><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg> }
export function SearchIcon(props: SVGProps<SVGSVGElement>) { return <svg {...base} {...props}><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg> }
export function CarIcon(props: SVGProps<SVGSVGElement>) { return <svg {...base} {...props}><path d="M5 17h14l1-6-2-5H6l-2 5 1 6Z"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M4.5 11h15"/></svg> }
export function InfoIcon(props: SVGProps<SVGSVGElement>) { return <svg {...base} {...props}><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/></svg> }
export function CopyIcon(props: SVGProps<SVGSVGElement>) { return <svg {...base} {...props}><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg> }


export function DownloadIcon(props: SVGProps<SVGSVGElement>) { return <svg {...base} {...props}><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg> }
