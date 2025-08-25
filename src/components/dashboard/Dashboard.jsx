import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useRider } from '../../context/RiderContext'
import { PRO_CONFIG } from '../../config/proConfig'
import LoginModal from '../auth/LoginModal'
import ProUpgradeModal from '../ProUpgradeModal'

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

    // Redirecionar para criar novo rider
    window.location.href = '/rider/new'
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
                onClick={() => window.location.href = `/rider/${rider.id}`}
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
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => setShowLoginModal(false)}
        />
      )}

      {showUpgradeModal && (
        <ProUpgradeModal
          onClose={() => setShowUpgradeModal(false)}
          onUpgrade={() => {
            setShowUpgradeModal(false)
            window.location.href = '/pricing'
          }}
        />
      )}
    </div>
  )
}

export default Dashboard
