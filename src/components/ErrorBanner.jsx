function ErrorBanner({ message, onRetry }) {
  if (!message) return null

  return (
    <div className="error-banner" role="alert">
      <span>⚠️ {message}</span>
      <button type="button" onClick={onRetry}>
        Försök igen
      </button>
    </div>
  )
}

export default ErrorBanner
