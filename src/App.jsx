import { useCallback, useEffect, useState } from 'react'
import { getTasks } from './api.js'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ErrorBanner from './components/ErrorBanner.jsx'
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

  return (
    <>
      <Header />
      <main>
        <ErrorBanner message={error} onRetry={load} />

        {loading ? (
          <p className="empty">Laddar …</p>
        ) : tasks.length === 0 && !error ? (
          <p className="empty">Inget att tjata om än.</p>
        ) : (
          <section className="task-grid">
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
