const MAX_MILLISECONDS = 30_000 // tjatet ger sig efter en halv minut

// Tjatmotorn: rösten spelas upp om och om igen tills man snoozar eller är klar,
// men aldrig längre än en halv minut. För varje snooze blir den snabbare,
// gällare och högre.
export function playNag(url, snoozeCount) {
  const audio = new Audio(url)

  // Utan pitch-korrigering följer tonhöjden hastigheten – rösten blir gäll
  audio.preservesPitch = false
  audio.playbackRate = Math.min(1 + snoozeCount * 0.25, 2.5)
  audio.volume = Math.min(0.6 + snoozeCount * 0.2, 1)
  audio.loop = true

  audio.play().catch(() => {}) // webbläsaren kan blockera ljud utan klick

  const timeout = setTimeout(stop, MAX_MILLISECONDS)

  function stop() {
    clearTimeout(timeout)
    audio.pause()
  }

  return stop
}
