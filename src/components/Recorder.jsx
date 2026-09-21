import { MicIcon, StopIcon } from './icons.jsx'

// Bara knappen - själva inspelningen sköts av useRecorder
function Recorder({ isRecording, hasRecording, onStart, onStop }) {
  const label = isRecording
    ? 'Stoppa inspelningen'
    : hasRecording
      ? 'Spela in igen'
      : 'Spela in ditt tjat'

  return (
    <button
      type="button"
      className={`icon-btn${isRecording ? ' recording' : ''}${hasRecording ? ' has-recording' : ''}`}
      onClick={isRecording ? onStop : onStart}
      aria-label={label}
      title={label}
    >
      {isRecording ? <StopIcon /> : <MicIcon />}
    </button>
  )
}

export default Recorder
