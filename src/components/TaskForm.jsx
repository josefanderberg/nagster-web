import { useEffect, useRef, useState } from 'react'
import TimerRing from './TimerRing.jsx'
import { ClockIcon, PencilIcon, TimerIcon } from './icons.jsx'

const DEFAULT_MINUTES = 25

function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [minutes, setMinutes] = useState(DEFAULT_MINUTES)
  const [showClock, setShowClock] = useState(false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const inputRef = useRef(null)

  // Vänta in att rutan hunnit fällas ut innan markören flyttas dit
  useEffect(() => {
    if (!editing) return
    const frame = requestAnimationFrame(() => inputRef.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [editing])

  async function handleSubmit(event) {
    event.preventDefault()
    if (!title.trim() || saving) return

    setSaving(true)
    await onAdd(title.trim(), minutes)
    setTitle('')
    setEditing(false)
    setSaving(false)
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="ring-area">
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

        <TimerRing minutes={minutes} onChange={setMinutes} showClock={showClock} />
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
      </div>

      <button type="submit" className="primary" disabled={!title.trim() || saving}>
        {saving ? 'Startar …' : 'Starta'}
      </button>
    </form>
  )
}

export default TaskForm
