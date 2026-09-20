import { useRef, useState } from 'react'
import {
  arcSegments,
  CENTER,
  clampMinutes,
  MAX_MINUTES,
  minutesFromPointer,
  polar,
  RADIUS,
  SIZE,
} from '../timerRing.js'
import { clockTime, formatMinutes } from '../time.js'

const KEY_STEP = 1
const SHIFT_STEP = 15

function TimerRing({ minutes, onChange, showClock = false }) {
  const ringRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  // Fokusringen ska bara synas för den som tabbar sig fram, inte vid musklick
  const [keyboardFocus, setKeyboardFocus] = useState(false)

  function handlePointer(event) {
    const rect = ringRef.current.getBoundingClientRect()
    onChange(minutesFromPointer(minutes, event.clientX, event.clientY, rect))
  }

  function handlePointerDown(event) {
    event.currentTarget.setPointerCapture(event.pointerId)
    setKeyboardFocus(false)
    setDragging(true)
    handlePointer(event)
  }

  function handleKeyDown(event) {
    const step = event.shiftKey ? SHIFT_STEP : KEY_STEP
    const direction =
      event.key === 'ArrowUp' || event.key === 'ArrowRight'
        ? 1
        : event.key === 'ArrowDown' || event.key === 'ArrowLeft'
          ? -1
          : 0

    if (direction === 0) return

    onChange(clampMinutes(minutes + direction * step))
    setKeyboardFocus(true)
    event.preventDefault()
  }

  const label = showClock ? clockTime(minutes) : formatMinutes(minutes)
  const [handleX, handleY] = polar(minutes)

  return (
    <div className={`ring-wrapper${keyboardFocus ? ' keyboard-focus' : ''}`}>
      <svg
        ref={ringRef}
        className={`timer-ring${dragging ? ' dragging' : ''}`}
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="slider"
        tabIndex={0}
        aria-label="Tid"
        aria-valuemin={1}
        aria-valuemax={MAX_MINUTES}
        aria-valuenow={minutes}
        aria-valuetext={formatMinutes(minutes)}
        onPointerDown={handlePointerDown}
        onPointerMove={(event) => dragging && handlePointer(event)}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
        onBlur={() => setKeyboardFocus(false)}
        onKeyDown={handleKeyDown}
      >
        <circle className="ring-track" cx={CENTER} cy={CENTER} r={RADIUS} />

        <g className="ring-arc">
          {arcSegments(minutes).map((segment, index) => (
            <path key={index} d={segment.d} style={{ stroke: segment.color }} />
          ))}
        </g>

        <circle className="ring-handle" cx={handleX} cy={handleY} r={13} />

        <text className={`ring-value${label.length > 3 ? ' small' : ''}`} x={CENTER} y={CENTER}>
          {label}
        </text>
      </svg>
    </div>
  )
}

export default TimerRing
