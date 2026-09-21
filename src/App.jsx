import { useCallback, useEffect, useState } from 'react'
import { createTask, getTasks, updateTask, uploadFile } from './api.js'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ErrorBanner from './components/ErrorBanner.jsx'
import TaskForm from './components/TaskForm.jsx'
import ActiveTimer from './components/ActiveTimer.jsx'
import TaskCard from './components/TaskCard.jsx'

function App() {
  const [tasks, setTasks] = useState([])
  const [active, setActive] = useState(null) // bara ett tjat åt gången
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    return getTasks()
      .then((data) => {
        setTasks(data)
        setError(null)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function handleAdd(title, seconds, recording) {
    try {
      // Uppgiften skapas först, sedan kopplas inspelningen till den.
      // Uppladdningen svarar med uppgiften inklusive sökvägen till ljudet,
      // och det är den versionen tjatet ska köra på – annars finns inget att spela.
      let task = await createTask({ title, durationSeconds: seconds })
      if (recording) task = await uploadFile(task.id, recording)
      setActive(task) // tjatet drar igång direkt
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  // Snooze räknas upp på uppgiften och sparas med PUT
  async function handleSnooze() {
    const snoozed = { ...active, snoozeCount: active.snoozeCount + 1 }
    setActive(snoozed)
    try {
      await updateTask(snoozed.id, snoozed)
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleFinish(status) {
    const finished = { ...active, status }
    setActive(null)
    try {
      await updateTask(finished.id, finished)
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  const isEmpty = !loading && !error && tasks.length === 0

  return (
    <>
      <Header />
      <main>
        <ErrorBanner message={error} onRetry={load} />

        <section className="hero">
          {active ? (
            <ActiveTimer
              task={active}
              snoozeCount={active.snoozeCount}
              onDone={() => handleFinish('done')}
              onSnooze={handleSnooze}
            />
          ) : (
            <TaskForm onAdd={handleAdd} onError={setError} />
          )}
        </section>

        {loading && <p className="empty">Laddar …</p>}

        {isEmpty && <p className="empty">Inget att tjata om än.</p>}

        {tasks.length > 0 && (
          <section className="history">
            {/* API:et ger nyast först, och så visas de – äldre tonas ut nedåt */}
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isActive={task.id === active?.id}
                onCancel={() => setActive(null)}
              />
            ))}
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}

export default App
