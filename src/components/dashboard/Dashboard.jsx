import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { database } from '../../config/supabase'
import { PRO_CONFIG } from '../../config/proConfig'
import LoginModal from '../auth/LoginModal'
import ProUpgradeModal from '../ProUpgradeModal'

const Dashboard = () => {
  const { user, isPro, loading: authLoading } = useAuth()
  const [riders, setRiders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Carregar riders do utilizador
  const loadRiders = async () => {
    if (!user) return

    try {
      const { data, error } = await database.riders.getUserRiders(user.id)
      if (error) throw error
      setRiders(data || [])
    } catch (error) {
      console.error('Error loading riders:', error)
    } finally {
      setLoading(false)
    }
  }

  // Criar novo rider
  const createNewRider = async () => {
    if (!user) {
      setShowLoginModal(true)
      return
    }

    // Verificar limite de riders para utilizadores Free
    if (!isPro && riders.length >= PRO_CONFIG.FREE_LIMITS.maxRiders) {
      setShowUpgradeModal(true)
      return
    }

    try {
      const newRider = {
        title: 'Novo Rider',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        data: {
          dadosGerais: {
            nomeEvento: '',
            data: '',
            local: '',
            promotor: '',
            tecnicoResponsavel: '',
            contacto: ''
          },
          // Outros dados vazios...
        }
      }

      const { data, error } = await database.riders.createRider(newRider, user.id)
      if (error) throw error

      setRiders([data, ...riders])
      // Redirecionar para o editor do rider
      window.location.href = `/rider/${data.id}`
    } catch (error) {
      console.error('Error creating rider:', error)
    }
  }

  // Eliminar rider
  const deleteRider = async (riderId) => {
    if (!confirm('Tem a certeza que quer eliminar este rider?')) return

    try {
      const { error } = await database.riders.deleteRider(riderId, user.id)
      if (error) throw error

      setRiders(riders.filter(rider => rider.id !== riderId))
    } catch (error) {
      console.error('Error deleting rider:', error)
    }
  }

  // Filtrar riders por pesquisa
  const filteredRiders = riders.filter(rider =>
    rider.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    if (!authLoading) {
      loadRiders()
    }
  }, [user, authLoading])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Bem-vindo ao Rider Forge
          </h1>
          <p className="text-gray-600 mb-8">
            Crie riders técnicos profissionais de forma rápida e intuitiva
          </p>
          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Entrar para Começar
          </button>
        </div>
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Os Meus Riders
              </h1>
              <p className="text-gray-600">
                {isPro ? 'Riders ilimitados' : `${riders.length}/${PRO_CONFIG.FREE_LIMITS.maxRiders} riders`}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {!isPro && (
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  Upgrade Pro
                </button>
              )}
              <button
                onClick={createNewRider}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Novo Rider
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Pesquisar riders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Riders Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredRiders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Ainda não tem riders
            </h3>
            <p className="text-gray-600 mb-6">
              Crie o seu primeiro rider técnico para começar
            </p>
            <button
              onClick={createNewRider}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Criar Primeiro Rider
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRiders.map((rider) => (
              <div
                key={rider.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {rider.title}
                    </h3>
                    <button
                      onClick={() => deleteRider(rider.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-500 mb-4">
                    <p>Criado em {new Date(rider.created_at).toLocaleDateString('pt-PT')}</p>
                    <p>Atualizado em {new Date(rider.updated_at).toLocaleDateString('pt-PT')}</p>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => window.location.href = `/rider/${rider.id}`}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => window.open(`/rider/${rider.id}/preview`, '_blank')}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      Pré-visualizar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
      
      <ProUpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
      />
    </div>
  )
}

export default Dashboard
