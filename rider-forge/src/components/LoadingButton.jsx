import LoadingSpinner from './LoadingSpinner'

const LoadingButton = ({ 
  children, 
  loading = false, 
  loadingText = 'Carregando...',
  disabled = false,
  variant = 'primary', // 'primary', 'secondary', 'action'
  size = 'md', // 'sm', 'md', 'lg'
  className = '',
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'flex items-center justify-center gap-3 font-semibold transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-dark-950'
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary', 
    action: 'btn-action'
  }
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[40px]',
    md: 'px-6 py-3 text-base min-h-[48px]',
    lg: 'px-8 py-4 text-lg min-h-[56px]'
  }

  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${isDisabled ? 'btn-loading' : ''}
        ${className}
      `}
      onClick={onClick}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner size="sm" text="" />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}

export default LoadingButton

