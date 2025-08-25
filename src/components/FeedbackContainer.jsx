import FeedbackToast from './FeedbackToast'

const FeedbackContainer = ({ toasts, onRemoveToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className="transform transition-all duration-300 ease-out"
          style={{
            transform: `translateY(${index * 80}px)`,
          }}
        >
          <FeedbackToast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => onRemoveToast(toast.id)}
          />
        </div>
      ))}
    </div>
  )
}

export default FeedbackContainer

