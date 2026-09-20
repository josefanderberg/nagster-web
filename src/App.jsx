import { useCallback, useEffect, useState } from 'react'
import { createTask, getTasks } from './api.js'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ErrorBanner from './components/ErrorBanner.jsx'
import TaskForm from './components/TaskForm.jsx'
import TaskCard from './components/TaskCard.jsx'

function App() {
  const [tasks, setTasks] = useState([])
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

  async function handleAdd(title, minutes) {
    try {
      await createTask({ title, durationMinutes: minutes })
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
          <TaskForm onAdd={handleAdd} />
        </section>

        {loading && <p className="empty">Laddar …</p>}

        {isEmpty && <p className="empty">Inget att tjata om än.</p>}

        {tasks.length > 0 && (
          <section className="history">
            {/* API:et ger nyast först, och så visas de – äldre tonas ut nedåt */}
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}

export default App
