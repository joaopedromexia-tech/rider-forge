import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getRiderByShortId, extractShortId } from '../utils/shortLinks'
import { useI18n } from '../context/I18nContext'
import { useAuth } from '../context/AuthContext'

function SharedRiderViewer() {
  const { shortId } = useParams()
  const navigate = useNavigate()
  const { t } = useI18n()
  const { user } = useAuth()
  
  const [riderData, setRiderData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadRider = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Extrair shortId da URL se necessário
        const actualShortId = shortId || extractShortId(window.location.pathname)
        
        if (!actualShortId) {
          setError(t('sharedRider.invalidLink'))
          return
        }
        
        const rider = getRiderByShortId(actualShortId)
        
        if (!rider) {
          setError(t('sharedRider.expiredLink'))
          return
        }
        
        setRiderData(rider)
      } catch (err) {
        console.error('Erro ao carregar rider partilhado:', err)
        setError(t('sharedRider.loadError'))
      } finally {
        setLoading(false)
      }
    }
    
    loadRider()
  }, [shortId])

  const handleLogin = () => {
    navigate('/')
  }

  const handleCreateAccount = () => {
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400">{t('sharedRider.loading')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-100 mb-2">{t('sharedRider.invalidLink')}</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            {t('sharedRider.backToHome')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800">
      {/* Header */}
      <div className="bg-dark-800 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {t('sharedRider.title')}: {riderData.name}
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {t('sharedRider.description')}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {!user ? (
                <div className="flex space-x-3">
                  <button
                    onClick={handleLogin}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    {t('sharedRider.loginButton')}
                  </button>
                                     <button
                     onClick={handleCreateAccount}
                     className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                   >
                     {t('sharedRider.createAccount')}
                   </button>
                </div>
              ) : (
                                 <button
                   onClick={() => navigate('/riders')}
                   className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                 >
                   {t('sharedRider.myRiders')}
                 </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-dark-800 rounded-lg shadow-xl border border-dark-700 overflow-hidden">
          <div className="p-6">
            <RiderContentViewer riderData={riderData.data} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-dark-800 border-t border-dark-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-4">
              {t('sharedRider.loginPrompt')}
            </p>
            <div className="flex justify-center space-x-4">
                             <button
                 onClick={() => navigate('/')}
                 className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
               >
                 {t('sharedRider.createFirstRider')}
               </button>
               <span className="text-gray-600">•</span>
               <button
                 onClick={() => navigate('/pricing')}
                 className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
               >
                 {t('sharedRider.viewPlans')}
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente para visualizar o conteúdo do rider
function RiderContentViewer({ riderData }) {
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
              <div key={index} className="bg-dark-700 p-3 rounded">
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
              <div key={index} className="bg-dark-700 p-3 rounded">
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
        <div key={section.key} className="bg-dark-700 rounded-lg p-4">
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

export default SharedRiderViewer
