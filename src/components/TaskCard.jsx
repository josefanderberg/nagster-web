import { formatMinutes } from '../time.js'

function TaskCard({ task }) {
  const isDone = task.status === 'done'

  return (
    <article className={`task-card${isDone ? ' done' : ''}`}>
      <header className="task-card-top">
        <h3>{task.title}</h3>
        <span className={`badge ${task.status}`}>
          {isDone ? 'Klart' : formatMinutes(task.durationMinutes)}
        </span>
      </header>

      {task.snoozeCount > 0 && <p className="snooze-info">Snoozad {task.snoozeCount} ggr</p>}
    </article>
  )
}

export default TaskCard
