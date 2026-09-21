import { useEffect, useRef, useState } from 'react'
import TimerRing from './TimerRing.jsx'
import { fileUrl } from '../api.js'
import { playNag } from '../nag.js'
import { isSecondsMode } from '../timerRing.js'
import { clockTime, formatCountdown } from '../time.js'
import { ClockIcon, TimerIcon } from './icons.jsx'

const SNOOZE_MINUTES = 10

// Tjatet som är igång: ringen räknar ner och går inte att dra i.
// Ett varv är en minut, så sekundvisaren syns tydligt.
function ActiveTimer({ task, snoozeCount, onDone, onSnooze }) {
  const [secondsLeft, setSecondsLeft] = useState(task.durationSeconds)
  const [showClock, setShowClock] = useState(false)
  const stopNag = useRef(null)

  const expired = secondsLeft === 0

  useEffect(() => {
    if (expired) return
    const interval = setInterval(() => setSecondsLeft((left) => Math.max(0, left - 1)), 1000)
    return () => clearInterval(interval)
  }, [expired])

  // När tiden går ut börjar rösten tjata
  useEffect(() => {
    if (!expired || !task.filePath) return
    stopNag.current = playNag(fileUrl(task.filePath), snoozeCount)
    return () => stopNag.current?.()
  }, [expired, task.filePath, snoozeCount])

  // Snooze ger tio minuter till - eller samma antal sekunder igen om tjatet
  // sattes i sekunder, så att man kan visa upp det snabbt.
  function handleSnooze() {
    stopNag.current?.()
    const extra = isSecondsMode(task.durationSeconds) ? task.durationSeconds : SNOOZE_MINUTES * 60
    setSecondsLeft(extra)
    onSnooze()
  }

  function handleDone() {
    stopNag.current?.()
    onDone()
  }

  return (
    <div className={`active-timer${expired ? ' expired' : ''}`}>
      <div className="ring-area">
        <button
          type="button"
          className="corner-btn"
          onClick={() => setShowClock((shown) => !shown)}
          aria-label={showClock ? 'Visa tid kvar' : 'Visa klockslag'}
          title={showClock ? 'Visa tid kvar' : 'Visa klockslag'}
        >
          {showClock ? <TimerIcon /> : <ClockIcon />}
        </button>

        <TimerRing
          units={secondsLeft}
          label={showClock ? clockTime(secondsLeft) : formatCountdown(secondsLeft)}
          interactive={false}
          mirrored={isSecondsMode(task.durationSeconds)}
        />
      </div>

      <p className="active-title">{task.title}</p>

      {expired ? (
        <button type="button" className="primary snooze" onClick={handleSnooze}>
          Snooza
        </button>
      ) : (
        <button type="button" className="primary done" onClick={handleDone}>
          Klart
        </button>
      )}
    </div>
  )
}

export default ActiveTimer
