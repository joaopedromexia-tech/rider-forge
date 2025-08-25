import React from 'react'

const LoadingApp = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Rider Forge
        </h1>
        <p className="text-gray-600">
          A carregar...
        </p>
      </div>
    </div>
  )
}

export default LoadingApp
