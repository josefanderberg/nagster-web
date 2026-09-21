import { useRef, useState } from 'react'
import { arcSegments, CENTER, polar, RADIUS, SIZE } from '../timerRing.js'

const KEY_STEP = 1
const SHIFT_STEP = 15

// Ringen används i två lägen: som reglage när tiden ställs in, och som
// nedräkning när tjatet är igång. Då stängs dragandet av och `label` visar
// tiden som är kvar. `units` är ringens läge – ett varv är 60 enheter.
function TimerRing({ units, label, onPointer, onStep, interactive = true, mirrored = false }) {
  const ringRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  // Fokusringen ska bara synas för den som tabbar sig fram, inte vid musklick
  const [keyboardFocus, setKeyboardFocus] = useState(false)

  function sendPointer(event) {
    onPointer(event.clientX, event.clientY, ringRef.current.getBoundingClientRect())
  }

  function handlePointerDown(event) {
    event.currentTarget.setPointerCapture(event.pointerId)
    setKeyboardFocus(false)
    setDragging(true)
    sendPointer(event)
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

    onStep(direction * step)
    setKeyboardFocus(true)
    event.preventDefault()
  }

  const [handleX, handleY] = polar(units, mirrored)

  const controls = interactive
    ? {
        role: 'slider',
        tabIndex: 0,
        'aria-valuetext': label,
        onPointerDown: handlePointerDown,
        onPointerMove: (event) => dragging && sendPointer(event),
        onPointerUp: () => setDragging(false),
        onPointerCancel: () => setDragging(false),
        onBlur: () => setKeyboardFocus(false),
        onKeyDown: handleKeyDown,
      }
    : { role: 'img' }

  return (
    <div className={`ring-wrapper${keyboardFocus ? ' keyboard-focus' : ''}`}>
      <svg
        ref={ringRef}
        className={`timer-ring${dragging ? ' dragging' : ''}${interactive ? '' : ' still'}`}
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        aria-label="Tid"
        {...controls}
      >
        <circle className="ring-track" cx={CENTER} cy={CENTER} r={RADIUS} />

        <g className="ring-arc">
          {arcSegments(units, mirrored).map((segment, index) => (
            <path key={index} d={segment.d} style={{ stroke: segment.color }} />
          ))}
        </g>

        {interactive && <circle className="ring-handle" cx={handleX} cy={handleY} r={13} />}

        <text className={`ring-value${label.length > 3 ? ' small' : ''}`} x={CENTER} y={CENTER}>
          {label}
        </text>
      </svg>
    </div>
  )
}

export default TimerRing
