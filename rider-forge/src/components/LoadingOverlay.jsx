import LoadingSpinner from './LoadingSpinner'

const LoadingOverlay = ({ 
  isVisible = false, 
  text = 'Processando...', 
  backdrop = true,
  size = 'lg',
  className = '' 
}) => {
  if (!isVisible) return null

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${backdrop ? 'bg-dark-950/80 backdrop-blur-sm' : ''} ${className}`}>
      <div className="loading-content">
        <LoadingSpinner size={size} text={text} />
      </div>
    </div>
  )
}

export default LoadingOverlay

