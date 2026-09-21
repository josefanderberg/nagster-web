// All kommunikation med API:et samlas här, så komponenterna slipper känna till
// adresser och felhantering.
const BASE_URL = 'http://localhost:5080'

async function request(path, options) {
  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, options)
  } catch {
    // fetch kastar bara om servern inte går att nå alls
    throw new Error('Kunde inte nå servern - är API:et igång på port 5080?')
  }
  if (!response.ok) {
    throw new Error(`Servern svarade med fel (${response.status})`)
  }
  return response.json()
}

export function getTasks() {
  return request('/api/tasks')
}

export function createTask(task) {
  return request('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  })
}

export function updateTask(id, task) {
  return request(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  })
}

// Webbläsarna spelar in i olika format: Chrome webm, Firefox ogg och Safari mp4.
// API:et kontrollerar att filändelsen stämmer med innehållet, så den måste väljas rätt.
function extensionFor(type = '') {
  if (type.includes('mp4')) return 'm4a'
  if (type.includes('ogg')) return 'ogg'
  return 'webm'
}

export function uploadFile(id, file) {
  // En inspelning från MediaRecorder saknar filnamn, så det sätts här
  const form = new FormData()
  form.append('file', file, file.name ?? `inspelning.${extensionFor(file.type)}`)

  return request(`/api/tasks/${id}/file`, { method: 'POST', body: form })
}

export function fileUrl(path) {
  return `${BASE_URL}${path}`
}
