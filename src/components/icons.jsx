// Små ikoner ritade som SVG i stället för emojis – de följer textfärgen,
// blir knivskarpa i alla storlekar och ser likadana ut i alla webbläsare.
const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export function ClockIcon() {
  return (
    <svg {...base}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

export function TimerIcon() {
  return (
    <svg {...base}>
      <path d="M10 2h4" />
      <path d="M12 9v5" />
      <circle cx="12" cy="14" r="8" />
    </svg>
  )
}

export function PencilIcon() {
  return (
    <svg {...base}>
      <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z" />
      <path d="m14.5 6.5 3 3" />
    </svg>
  )
}

export function MicIcon() {
  return (
    <svg {...base}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M12 18v3" />
    </svg>
  )
}

export function StopIcon() {
  return (
    <svg {...base}>
      <rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor" />
    </svg>
  )
}
