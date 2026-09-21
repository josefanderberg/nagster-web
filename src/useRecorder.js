import { useRef, useState } from 'react'

// Sköter mikrofonen med webbläsarens inbyggda MediaRecorder.
// Logiken bor här så att knappen bara behöver rita sig själv.
export function useRecorder(onError) {
  const [isRecording, setIsRecording] = useState(false)
  const [audio, setAudio] = useState(null)
  const recorderRef = useRef(null)
  const pendingStop = useRef(null)

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks = []

      recorder.ondataavailable = (event) => chunks.push(event.data)
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: recorder.mimeType })
        setAudio(blob)
        // Släpp mikrofonen, annars lyser inspelningsindikatorn kvar
        stream.getTracks().forEach((track) => track.stop())
        pendingStop.current?.(blob)
        pendingStop.current = null
      }

      recorder.start()
      recorderRef.current = recorder
      setIsRecording(true)
    } catch {
      onError('Kunde inte starta mikrofonen – tillät du åtkomst?')
    }
  }

  // Stoppar inspelningen och ger tillbaka ljudet. Pågår ingen inspelning
  // lämnas den som redan finns tillbaka, så att den som trycker Starta mitt
  // i en inspelning ändå får med sitt tjat.
  function stop() {
    const recorder = recorderRef.current
    if (recorder?.state !== 'recording') return Promise.resolve(audio)

    setIsRecording(false)
    const recorded = new Promise((resolve) => {
      pendingStop.current = resolve
    })
    recorder.stop()
    return recorded
  }

  function reset() {
    setAudio(null)
  }

  return { isRecording, audio, start, stop, reset }
}
