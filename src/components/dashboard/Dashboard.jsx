import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useRider } from '../../context/RiderContext'
import { useI18n } from '../../context/I18nContext'
import { useLocation, useNavigate } from 'react-router-dom'
import Modal from '../Modal'
import { decodeBase64ToObject } from '../../utils/base64'

const Dashboard = () => {
  const { user, isPro, loading: authLoading } = useAuth()
  const { savedRiders, deleteRider, canSaveMoreRiders } = useRider()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sharedRider, setSharedRider] = useState(null)
  const [showSharedRiderModal, setShowSharedRiderModal] = useState(false)
  const { t, locale } = useI18n()
  const location = useLocation()
  const navigate = useNavigate()
  const dateLocale = locale === 'pt' ? 'pt-PT' : 'en-US'
  const displayName = user?.user_metadata?.full_name || user?.email || ''

  // Processar parâmetros de URL para partilha
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const viewMode = urlParams.get('view')
    const dataParam = urlParams.get('data')
    
    if (viewMode === 'share' && dataParam) {
      try {
        const decodedData = decodeBase64ToObject(dataParam)
        if (decodedData && decodedData.name && decodedData.data) {
          setSharedRider(decodedData)
          setShowSharedRiderModal(true)
          
          // Limpar parâmetros da URL sem recarregar a página
          const newUrl = window.location.pathname
          window.history.replaceState({}, '', newUrl)
        }
      } catch (error) {
        console.error('Erro ao decodificar rider partilhado:', error)
      }
    }
  }, [location.search])

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

    navigate('/riders/new/dados-gerais')
  }

  // Eliminar rider
  const handleDeleteRider = (riderId) => {
    if (!confirm(t('dashboard.delete.confirm'))) return
    deleteRider(riderId)
  }

  // Filtrar riders por pesquisa
  const filteredRiders = savedRiders.filter(rider =>
    rider.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Fechar modal de rider partilhado
  const closeSharedRiderModal = () => {
    setShowSharedRiderModal(false)
    setSharedRider(null)
  }

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
            <h1 className="text-3xl font-bold">{t('app.title')}</h1>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-300">{t('dashboard.greeting', { name: displayName })}</span>
                  <button
                    onClick={() => window.location.href = '/pricing'}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    {isPro ? 'Pro' : t('pricing.pro.upgrade')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {t('home.login')}
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
              placeholder={t('dashboard.search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={createNewRider}
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {t('dashboard.new')}
          </button>
        </div>

        {/* Riders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRiders.map((rider) => (
            <div key={rider.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-white">{rider.name}</h3>
                <button
                  onClick={() => handleDeleteRider(rider.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  {t('dashboard.delete')}
                </button>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                {new Date(rider.updatedAt).toLocaleDateString(dateLocale)}
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/rider/${rider.id}`)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium transition-colors"
                >
                  {t('dashboard.edit')}
                </button>
                <button
                  onClick={() => navigate(`/rider/${rider.id}/preview`)}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-sm font-medium transition-colors"
                >
                  {t('dashboard.preview')}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredRiders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">{t('dashboard.noRiders')}</p>
          </div>
        )}
      </main>

      {/* Shared Rider Modal */}
      {showSharedRiderModal && sharedRider && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">
                    {t('sharedRider.title')}: {sharedRider.name}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {t('sharedRider.description')}
                  </p>
                </div>
                <button
                  onClick={closeSharedRiderModal}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <SharedRiderViewer riderData={sharedRider.data} />
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-700 bg-gray-800">
              <div className="flex justify-between items-center">
                <p className="text-gray-400 text-sm">
                  {t('sharedRider.loginPrompt')}
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium transition-colors"
                  >
                    {t('sharedRider.loginButton')}
                  </button>
                  <button
                    onClick={closeSharedRiderModal}
                    className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-sm font-medium transition-colors"
                  >
                    {t('sharedRider.closeButton')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title={t('auth.login.title')}
      >
        <p className="text-gray-400 mb-4">{t('auth.login.description')}</p>
        <button
          onClick={() => window.location.href = '/pricing'}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {t('auth.login.button')}
        </button>
      </Modal>

      {/* Upgrade Modal */}
      <Modal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title={t('pricing.pro.title')}
      >
        <p className="text-gray-400 mb-4">{t('pricing.pro.description')}</p>
        <button
          onClick={() => window.location.href = '/pricing'}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {t('pricing.pro.upgrade')}
        </button>
      </Modal>
    </div>
  )
}

// Componente para visualizar rider partilhado
function SharedRiderViewer({ riderData }) {
  const sections = [
    { key: 'dados-gerais', title: 'Dados Gerais', icon: '📋' },
    { key: 'pa', title: 'PA', icon: '🔊' },
    { key: 'consolas', title: 'Consolas', icon: '🎛️' },
    { key: 'sistemas-escuta', title: 'Sistemas de Escuta', icon: '🎧' },
    { key: 'equipamento-auxiliar', title: 'Equipamento Auxiliar', icon: '🔧' },
    { key: 'input-list', title: 'Input List', icon: '📝' },
    { key: 'monitor-mixes', title: 'Monitor Mixes', icon: '🎚️' },
    { key: 'observacoes-finais', title: 'Observações Finais', icon: '📝' }
  ]

  const renderSectionContent = (sectionKey, data) => {
    if (!data || Object.keys(data).length === 0) {
      return <p className="text-gray-500 italic">Nenhum dado disponível</p>
    }

    switch (sectionKey) {
      case 'dados-gerais':
        return (
          <div className="space-y-3">
            {data.artista && <div><strong>Artista:</strong> {data.artista}</div>}
            {data.versaoRider && <div><strong>Versão:</strong> {data.versaoRider}</div>}
            {data.anoTour && <div><strong>Ano Tour:</strong> {data.anoTour}</div>}
            {data.roadManager && Object.values(data.roadManager).some(v => v) && (
              <div>
                <strong>Road Manager:</strong>
                <div className="ml-4 text-sm">
                  {data.roadManager.nome && <div>Nome: {data.roadManager.nome}</div>}
                  {data.roadManager.telefone && <div>Telefone: {data.roadManager.telefone}</div>}
                  {data.roadManager.email && <div>Email: {data.roadManager.email}</div>}
                </div>
              </div>
            )}
            {data.foh && Object.values(data.foh).some(v => v) && (
              <div>
                <strong>FOH:</strong>
                <div className="ml-4 text-sm">
                  {data.foh.nome && <div>Nome: {data.foh.nome}</div>}
                  {data.foh.telefone && <div>Telefone: {data.foh.telefone}</div>}
                  {data.foh.email && <div>Email: {data.foh.email}</div>}
                </div>
              </div>
            )}
            {data.mon && Object.values(data.mon).some(v => v) && (
              <div>
                <strong>MON:</strong>
                <div className="ml-4 text-sm">
                  {data.mon.nome && <div>Nome: {data.mon.nome}</div>}
                  {data.mon.telefone && <div>Telefone: {data.mon.telefone}</div>}
                  {data.mon.email && <div>Email: {data.mon.email}</div>}
                </div>
              </div>
            )}
          </div>
        )

      case 'input-list':
        if (!data.inputs || data.inputs.length === 0) {
          return <p className="text-gray-500 italic">Nenhum input definido</p>
        }
        return (
          <div className="space-y-2">
            {data.inputs.map((input, index) => (
              <div key={index} className="bg-gray-700 p-3 rounded">
                <div><strong>Canal {input.canal}:</strong></div>
                <div className="ml-4 text-sm">
                  {input.fonte && <div>Fonte: {input.fonte}</div>}
                  {input.microDi && <div>Micro/DI: {input.microDi}</div>}
                  {input.stand && <div>Stand: {input.stand}</div>}
                  {input.phantom && <div>Phantom: Sim</div>}
                  {input.supplier && <div>Supplier: Sim</div>}
                </div>
              </div>
            ))}
          </div>
        )

      case 'monitor-mixes':
        if (!data.mixes || data.mixes.length === 0) {
          return <p className="text-gray-500 italic">Nenhum mix definido</p>
        }
        return (
          <div className="space-y-2">
            {data.mixes.map((mix, index) => (
              <div key={index} className="bg-gray-700 p-3 rounded">
                <div className="ml-4 text-sm">
                  {mix.instrumentoMusico && <div><strong>Instrumento:</strong> {mix.instrumentoMusico}</div>}
                  {mix.tipo && <div><strong>Tipo:</strong> {mix.tipo}</div>}
                  {mix.formato && <div><strong>Formato:</strong> {mix.formato}</div>}
                  {mix.observacoes && <div><strong>Observações:</strong> {mix.observacoes}</div>}
                </div>
              </div>
            ))}
          </div>
        )

      default:
        return (
          <div className="space-y-2">
            {Object.entries(data).map(([key, value]) => {
              if (value && typeof value === 'object' && !Array.isArray(value)) {
                return (
                  <div key={key}>
                    <strong>{key}:</strong>
                    <div className="ml-4 text-sm">
                      {Object.entries(value).map(([subKey, subValue]) => (
                        subValue && <div key={subKey}>{subKey}: {subValue}</div>
                      ))}
                    </div>
                  </div>
                )
              } else if (value && Array.isArray(value)) {
                return (
                  <div key={key}>
                    <strong>{key}:</strong>
                    <div className="ml-4 text-sm">
                      {value.map((item, index) => (
                        <div key={index}>{JSON.stringify(item)}</div>
                      ))}
                    </div>
                  </div>
                )
              } else if (value) {
                return <div key={key}><strong>{key}:</strong> {value}</div>
              }
              return null
            })}
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {sections.map(section => (
        <div key={section.key} className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <span>{section.icon}</span>
            <h3 className="text-lg font-semibold text-white">{section.title}</h3>
          </div>
          <div className="text-gray-200">
            {renderSectionContent(section.key, riderData[section.key])}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Dashboard
