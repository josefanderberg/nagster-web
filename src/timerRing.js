// Uträkningarna bakom tidsratten. Ingen React och inget DOM här – bara matte,
// vilket gör dem lätta att läsa och att ändra utan att röra komponenten.

export const MINUTES_PER_LAP = 60
export const MAX_MINUTES = 8 * MINUTES_PER_LAP // åtta timmar räcker gott
export const SIZE = 220
export const RADIUS = 92
export const CENTER = SIZE / 2

const SEGMENTS_PER_LAP = 90 // ju fler, desto mjukare övergång
const TAIL_STRENGTH = 6 // hur mycket färg svansen har kvar från början, i procent
const RAMP = 3 // ju högre, desto längre håller sig ringen ljus innan den mättas

export function clampMinutes(minutes) {
  return Math.min(MAX_MINUTES, Math.max(1, minutes))
}

// Punkten på ringen för ett visst antal minuter. 0 är rakt upp, sedan medurs.
export function polar(minutes) {
  const angle = (minutes / MINUTES_PER_LAP) * 2 * Math.PI
  return [CENTER + RADIUS * Math.sin(angle), CENTER - RADIUS * Math.cos(angle)]
}

// Var på varvet pekaren befinner sig, 0–59
function pointToLapMinutes(clientX, clientY, rect) {
  const dx = clientX - (rect.left + rect.width / 2)
  const dy = clientY - (rect.top + rect.height / 2)

  let degrees = (Math.atan2(dx, -dy) * 180) / Math.PI
  if (degrees < 0) degrees += 360

  return Math.round((degrees / 360) * MINUTES_PER_LAP) % MINUTES_PER_LAP
}

// Nytt totalvärde när pekaren flyttats. Ett hopp på mer än ett halvt varv
// betyder att man passerat toppen: medurs läggs ett varv till, moturs dras ett bort.
export function minutesFromPointer(current, clientX, clientY, rect) {
  const next = pointToLapMinutes(clientX, clientY, rect)
  const previous = current % MINUTES_PER_LAP
  let laps = Math.floor(current / MINUTES_PER_LAP)

  const step = next - previous
  if (step < -MINUTES_PER_LAP / 2) laps += 1
  else if (step > MINUTES_PER_LAP / 2) laps -= 1

  return clampMinutes(laps * MINUTES_PER_LAP + next)
}

// Svansen mättas efter vald tid, men inte linjärt: kurvan håller ringen ljus
// länge och färgar av sig snabbt mot slutet.
function tailStrengthFor(minutes) {
  const progress = Math.min(1, minutes / MAX_MINUTES)
  return TAIL_STRENGTH + (100 - TAIL_STRENGTH) * progress ** RAMP
}

function arcPath(fromMinutes, toMinutes) {
  const [x1, y1] = polar(fromMinutes)
  const [x2, y2] = polar(toMinutes)
  const largeArc = toMinutes - fromMinutes > MINUTES_PER_LAP / 2 ? 1 : 0
  return `M ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${x2} ${y2}`
}

// Bågen ritas som många små segment med var sin färg: blek vid svansen, full
// färg vid handtaget. Efter första varvet ritas alltid ett helt varv, så det är
// tonningen som vandrar runt i stället för att ringen töms.
// Färgerna är heltäckande (utblandade mot vitt) – vore de genomskinliga skulle
// överlappen mellan segmenten synas som ränder.
export function arcSegments(minutes) {
  const lapMinutes = minutes % MINUTES_PER_LAP
  const laps = Math.floor(minutes / MINUTES_PER_LAP)

  const head = laps === 0 ? lapMinutes : lapMinutes + MINUTES_PER_LAP
  const sweep = laps === 0 ? lapMinutes : MINUTES_PER_LAP
  const tailStrength = tailStrengthFor(minutes)

  const count = Math.max(1, Math.round((sweep / MINUTES_PER_LAP) * SEGMENTS_PER_LAP))
  const size = sweep / count

  return Array.from({ length: count }, (_, index) => {
    const start = head - sweep + index * size
    // Segmenten överlappar rejält så att inga glipor syns
    const end = Math.min(start + size * 2.5, head)
    const progress = count === 1 ? 1 : index / (count - 1)
    const strength = tailStrength + (100 - tailStrength) * progress

    return {
      d: arcPath(start, end),
      color: `color-mix(in srgb, var(--accent) ${strength}%, #fff)`,
    }
  })
}
