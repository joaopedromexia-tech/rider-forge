import React from 'react'
import { useGlobalFeedback } from '../context/GlobalFeedbackContext'
import { useUpdateNotice } from '../hooks/useUpdateNotice'

const UpdateNoticeTest = () => {
  const { showSuccess, showInfo, showWarning, showError } = useGlobalFeedback()
  const { showNotice, resetNotice } = useUpdateNotice()

  const handleTestSuccess = () => {
    showSuccess('This is a success message!')
  }

  const handleTestInfo = () => {
    showInfo('This is an info message!')
  }

  const handleTestWarning = () => {
    showWarning('This is a warning message!')
  }

  const handleTestError = () => {
    showError('This is an error message!')
  }

  const handleShowUpdateNotice = () => {
    showNotice()
  }

  const handleResetNotice = () => {
    resetNotice()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="p-6 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Update Notice Test
        </h2>
        
        <div className="space-y-3">
          <button
            onClick={handleTestSuccess}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Test Success Toast
          </button>
          
          <button
            onClick={handleTestInfo}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Test Info Toast
          </button>
          
          <button
            onClick={handleTestWarning}
            className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Test Warning Toast
          </button>
          
          <button
            onClick={handleTestError}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Test Error Toast
          </button>
          
          <hr className="my-4" />
          
          <button
            onClick={handleShowUpdateNotice}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Show Update Notice
          </button>
          
          <button
            onClick={handleResetNotice}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Reset Notice (Show Again)
          </button>
        </div>
      </div>
    </div>
  )
}

export default UpdateNoticeTest
