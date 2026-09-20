// All kommunikation med API:et samlas här, så komponenterna slipper känna till
// adresser och felhantering.
const BASE_URL = 'http://localhost:5080'

async function request(path, options) {
  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, options)
  } catch {
    // fetch kastar bara om servern inte går att nå alls
    throw new Error('Kunde inte nå servern – är API:et igång på port 5080?')
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

export function fileUrl(path) {
  return `${BASE_URL}${path}`
}
