const LoadingSpinner = ({ size = 'md', text = 'Carregando...', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        {/* Spinner principal */}
        <div className={`${sizeClasses[size]} border-2 border-dark-600 border-t-accent-blue rounded-full animate-spin`}></div>
        
        {/* Spinner secundário para efeito de profundidade */}
        <div className={`${sizeClasses[size]} border-2 border-transparent border-t-accent-green rounded-full animate-spin absolute inset-0`} style={{ animationDelay: '0.5s' }}></div>
      </div>
      
      {text && (
        <p className="text-gray-400 text-sm font-medium animate-pulse">{text}</p>
      )}
    </div>
  )
}

export default LoadingSpinner
