import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useRider } from '../../context/RiderContext'

const Dashboard = () => {
  const { user, isPro, loading: authLoading } = useAuth()
  const { savedRiders, deleteRider, canSaveMoreRiders } = useRider()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Criar novo rider
  const createNewRider = () => {
    if (!user) {
      setShowLoginModal(true)
      return
    }

    // Verificar limite de riders para utilizadores Free
    if (!canSaveMoreRiders()) {
      setShowUpgradeModal(true)
      return
    }

    alert('Funcionalidade de criar rider em desenvolvimento!')
  }

  // Eliminar rider
  const handleDeleteRider = (riderId) => {
    if (!confirm('Tem a certeza que quer eliminar este rider?')) return
    deleteRider(riderId)
  }

  // Filtrar riders por pesquisa
  const filteredRiders = savedRiders.filter(rider =>
    rider.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold">Rider Forge</h1>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-300">
                    Olá, {user.user_metadata?.full_name || user.email}
                  </span>
                  <button
                    onClick={() => window.location.href = '/pricing'}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    {isPro ? 'Pro' : 'Upgrade'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Entrar
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Create */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Pesquisar riders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={createNewRider}
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-medium transition-colors"
          >
            + Novo Rider
          </button>
        </div>

        {/* Riders Grid */}
        {filteredRiders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">
              {searchTerm ? 'Nenhum rider encontrado.' : 'Ainda não tem riders.'}
            </div>
            {!searchTerm && (
              <button
                onClick={createNewRider}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Criar o primeiro rider
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRiders.map((rider) => (
              <div
                key={rider.id}
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors cursor-pointer border border-gray-700"
                onClick={() => alert('Editor de rider em desenvolvimento!')}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-white truncate">
                    {rider.name}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteRider(rider.id)
                    }}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>Artista: {rider.thumbnail?.artista || 'N/A'}</p>
                  <p>Criado: {new Date(rider.createdAt).toLocaleDateString('pt-PT')}</p>
                  <p>Atualizado: {new Date(rider.updatedAt).toLocaleDateString('pt-PT')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Entrar no Rider Forge
              </h2>
              <p className="text-gray-600">
                Aceda à sua conta para continuar
              </p>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Entrar (Mock)
              </button>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Upgrade para Pro
              </h2>
              <p className="text-gray-600">
                Esta função está disponível no Rider Forge Pro
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
              >
                Continuar Free
              </button>
              <button
                onClick={() => {
                  setShowUpgradeModal(false)
                  window.location.href = '/pricing'
                }}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Upgrade para Pro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
