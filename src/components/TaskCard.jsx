import { fileUrl } from '../api.js'
import { formatDuration } from '../time.js'

function TaskCard({ task, isActive = false, onCancel }) {
  const isDone = task.status === 'done'

  return (
    <article className={`task-card${isDone ? ' done' : ''}${isActive ? ' active' : ''}`}>
      <header className="task-card-top">
        <h3>{task.title}</h3>

        <div className="task-card-right">
          {isActive && (
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Avbryt
            </button>
          )}
          <span className={`badge ${task.status}`}>
            {isDone ? 'Klart' : formatDuration(task.durationSeconds)}
          </span>
        </div>
      </header>

      {task.snoozeCount > 0 && <p className="snooze-info">Snoozad {task.snoozeCount} ggr</p>}

      {task.filePath && <audio controls src={fileUrl(task.filePath)} />}
    </article>
  )
}

export default TaskCard
