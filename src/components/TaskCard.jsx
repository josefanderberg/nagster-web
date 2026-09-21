import { fileUrl } from '../api.js'
import { formatDuration } from '../time.js'

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg']

function TaskCard({ task, isActive = false, onCancel }) {
  const isDone = task.status === 'done'
  const isImage = task.filePath && IMAGE_EXTENSIONS.some((ext) => task.filePath.endsWith(ext))

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

      {isImage && <img className="task-image" src={fileUrl(task.filePath)} alt={task.title} />}
      {task.filePath && !isImage && <audio controls src={fileUrl(task.filePath)} />}
    </article>
  )
}

export default TaskCard
