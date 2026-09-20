const MINUTES_PER_HOUR = 60

// "25m" eller "1h 30m"
export function formatMinutes(total) {
  if (total < MINUTES_PER_HOUR) return `${total}m`

  const hours = Math.floor(total / MINUTES_PER_HOUR)
  const minutes = total % MINUTES_PER_HOUR
  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`
}

// Klockslaget då tiden går ut, t.ex. "14:35"
export function clockTime(minutes) {
  return new Date(Date.now() + minutes * 60_000).toLocaleTimeString('sv-SE', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
