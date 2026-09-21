import { useEffect, useRef, useState } from 'react'
import TimerRing from './TimerRing.jsx'
import Recorder from './Recorder.jsx'
import { useRecorder } from '../useRecorder.js'
import { isSecondsMode, MIN_SECONDS, ringUnits, secondsFromPointer } from '../timerRing.js'
import { clockTime, formatDuration } from '../time.js'
import { ClockIcon, PencilIcon, TimerIcon } from './icons.jsx'

const DEFAULT_SECONDS = 25 * 60
const MAX_SECONDS = 8 * 60 * 60
const DEFAULT_TITLE = 'Inspelat tjat'

function TaskForm({ onAdd, onError }) {
  const [title, setTitle] = useState('')
  const [seconds, setSeconds] = useState(DEFAULT_SECONDS)
  const [showClock, setShowClock] = useState(false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const inputRef = useRef(null)
  const recorder = useRecorder(onError)

  const secondsMode = isSecondsMode(seconds)

  // Det räcker med antingen ett tjat eller en titel – båda behövs inte
  const canStart = Boolean(title.trim()) || recorder.isRecording || recorder.audio !== null

  // Vänta in att rutan hunnit fällas ut innan markören flyttas dit
  useEffect(() => {
    if (!editing) return
    const frame = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [editing])

  // Piltangenter flyttar ett steg i den enhet ringen visar just nu
  function step(amount) {
    const size = secondsMode ? 1 : 60
    setSeconds((current) => Math.min(MAX_SECONDS, Math.max(MIN_SECONDS, current + amount * size)))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!canStart || saving) return

    setSaving(true)
    // Pågår en inspelning stoppas den här, så att tjatet kommer med
    const audio = await recorder.stop()

    await onAdd(title.trim() || DEFAULT_TITLE, seconds, audio)

    setTitle('')
    setEditing(false)
    recorder.reset()
    setSaving(false)
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className={`ring-area${secondsMode ? ' seconds' : ''}`}>
        {/* Växlar mellan hur lång tid det är och vad klockan är när tiden gått ut */}
        <button
          type="button"
          className="corner-btn"
          onClick={() => setShowClock((shown) => !shown)}
          aria-label={showClock ? 'Visa hur lång tid' : 'Visa klockslag'}
          title={showClock ? 'Visa hur lång tid' : 'Visa klockslag'}
        >
          {showClock ? <TimerIcon /> : <ClockIcon />}
        </button>

        <TimerRing
          units={ringUnits(seconds)}
          label={showClock ? clockTime(seconds) : formatDuration(seconds)}
          onPointer={(x, y, rect) => setSeconds(secondsFromPointer(seconds, x, y, rect))}
          onStep={step}
          mirrored={secondsMode}
        />
      </div>

      <div className="form-actions">
        <div className={`title-field${editing ? ' open' : ''}`}>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setEditing(true)}
            aria-label="Skriv vad som ska bli gjort"
          >
            <PencilIcon />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={title}
            placeholder="Vad ska bli gjort?"
            tabIndex={editing ? 0 : -1}
            onChange={(event) => setTitle(event.target.value)}
            onBlur={() => !title.trim() && setEditing(false)}
          />
        </div>

        <Recorder
          isRecording={recorder.isRecording}
          hasRecording={recorder.audio !== null}
          onStart={recorder.start}
          onStop={recorder.stop}
        />
      </div>

      <button type="submit" className="primary" disabled={!canStart || saving}>
        {saving ? 'Startar …' : 'Starta'}
      </button>
    </form>
  )
}

export default TaskForm
