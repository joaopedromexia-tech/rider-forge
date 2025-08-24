import { useState, useRef } from 'react'
import { useRider } from '../context/RiderContext'
import { useProFeatures } from '../hooks/useProFeatures'
import { useFeedback } from '../hooks/useFeedback'
import ProUpgradeModal from './ProUpgradeModal'
import ProToggle from './ProToggle'
import NewPDFExport from './NewPDFExport'
import { encodeObjectToBase64 } from '../utils/base64'

function MyRiders({ onBack, onEditRider }) {
  const { 
    savedRiders, 
    deleteRider, 
    duplicateRider, 
    exportRider, 
    importRider,
    getStats,
    getRiderById,
    isPro,
    setIsPro
  } = useRider()
  
  const { showSuccess, showError } = useFeedback()
  
  const {
    showUpgradeModal,
    currentFeature,
    closeUpgradeModal,
    useProFeature,
    PRO_FEATURES
  } = useProFeatures()
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [showImportModal, setShowImportModal] = useState(false)
  const [importError, setImportError] = useState('')
  const [importSuccess, setImportSuccess] = useState('')
  const [showNewPDFModal, setShowNewPDFModal] = useState(false)
  const [exportRiderPayload, setExportRiderPayload] = useState({ name: '', data: {} })
  const [shareLink, setShareLink] = useState('')
  const fileInputRef = useRef(null)
  
  const stats = getStats()

  const handleDelete = (id) => {
    deleteRider(id)
    setShowDeleteConfirm(null)
    showSuccess('Rider eliminado com sucesso!')
  }

  const handleDuplicate = (id) => {
    const success = useProFeature(PRO_FEATURES.UNLIMITED_RIDERS.id, () => {
      try {
        duplicateRider(id)
        showSuccess('Rider duplicado com sucesso!')
        return true
      } catch (error) {
        showError('Erro ao duplicar rider: ' + error.message)
        return false
      }
    })
    
    if (!success) {
      // Modal já foi mostrado pelo hook
      return
    }
  }

  const handleExport = (id) => {
    try {
      const rider = getRiderById(id)
      if (!rider) {
        showError('Rider não encontrado')
        return
      }
      setExportRiderPayload({ name: rider.name, data: rider.data || {} })
      setShowNewPDFModal(true)
    } catch (error) {
      showError('Erro ao preparar exportação: ' + error.message)
    }
  }

  const handleShare = (id) => {
    try {
      const rider = getRiderById(id)
      if (!rider) return
      const payload = { name: rider.name, data: rider.data }
      const token = encodeObjectToBase64(payload)
      const url = `${window.location.origin}${window.location.pathname}?view=share&data=${encodeURIComponent(token)}`
      setShareLink(url)
      navigator.clipboard?.writeText(url).catch(() => {})
    } catch (e) {}
  }

  const handleImport = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Importar JSON
    const success = useProFeature(PRO_FEATURES.UNLIMITED_RIDERS.id, async () => {
      try {
        setImportError('')
        setImportSuccess('')
        await importRider(file)
        showSuccess('Rider importado com sucesso!')
        setShowImportModal(false)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        return true
      } catch (error) {
        showError('Erro ao importar rider: ' + error.message)
        return false
      }
    })
    
    if (!success) {
      // Modal já foi mostrado pelo hook
      return
    }
  }



  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getEquipmentIcon = (category) => {
    const icons = {
      'dados-gerais': '📋',
      'pa': '🔊',
          'consolas': '🎛️',
      'sistemas-escuta': '🎧',
      'equipamento-auxiliar': '🔧',
      'input-list': '📝',
      'monitor-mixes': '🎚️',
      'observacoes-finais': '📝'
    }
    return icons[category] || '📄'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="btn-secondary flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </button>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-gradient text-center">Os Meus Riders</h1>
          
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center">
            {/* Seletor de Plano */}
            <ProToggle />
            
            <div className="relative">
              <button
                disabled
                className="btn-secondary flex items-center gap-2 opacity-50 cursor-not-allowed"
                title="Funcionalidade temporariamente indisponível"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="hidden sm:inline">Importar</span>
              </button>
              
              {/* Badge de "Em breve" */}
              <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs px-1.5 py-0.5 rounded-full font-medium">
                Em breve
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="card">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-accent-blue">{stats.totalRiders}</div>
              <div className="text-sm text-gray-400">Riders Salvos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent-green">{stats.totalSize}MB</div>
              <div className="text-sm text-gray-400">Armazenamento</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{stats.maxRiders}</div>
              <div className="text-sm text-gray-400">Limite Riders</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">{stats.maxStorage}</div>
              <div className="text-sm text-gray-400">Limite Armazenamento</div>
            </div>
          </div>
        </div>
      </div>

      {/* Riders Grid */}
      <div className="max-w-7xl mx-auto">
        {savedRiders.length === 0 ? (
          <div className="card text-center py-12">
            <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-100 mb-2">Nenhum rider encontrado</h3>
            <p className="text-gray-400 mb-6">Crie o seu primeiro rider técnico</p>
            <button
              onClick={onBack}
              className="btn-primary"
            >
              Criar Rider
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {savedRiders.map((rider, index) => (
              <div 
                key={rider.id} 
                className="card-hover group animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Thumbnail */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    {rider.data?.['dados-gerais']?.imagemCapa?.data ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={rider.data['dados-gerais'].imagemCapa.data}
                          alt="Capa do rider"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-accent-blue to-accent-green rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">RF</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-100 truncate">{rider.name}</h3>
                      <p className="text-sm text-gray-400">{formatDate(rider.updatedAt)}</p>
                    </div>
                  </div>
                  
                                  {/* Rider Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">Artista:</span>
                    <span className="text-gray-200 font-medium">{rider.thumbnail?.artista || 'Sem artista'}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">Última alteração:</span>
                    <span className="text-gray-200 font-medium">{rider.thumbnail?.data || 'Sem data'}</span>
                  </div>
                </div>
                </div>



                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onEditRider(rider.id)}
                    className="btn-action text-sm py-3 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="hidden sm:inline">Editar</span>
                  </button>
                  
                  <button
                    onClick={() => handleExport(rider.id)}
                    className="btn-action text-sm py-3 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="hidden sm:inline">Exportar</span>
                  </button>

                  <button
                    onClick={() => handleShare(rider.id)}
                    className="btn-action text-sm py-3 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 8a3 3 0 11-6 0 3 3 0 016 0zM19 14a4 4 0 10-8 0 4 4 0 008 0zM7 14a4 4 0 100 8 4 4 0 000-8z" />
                    </svg>
                    <span className="hidden sm:inline">Partilhar</span>
                  </button>
                  
                  <button
                    onClick={() => handleDuplicate(rider.id)}
                    className="btn-action text-sm py-3 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="hidden sm:inline">Duplicar</span>
                  </button>
                  
                  <button
                    onClick={() => setShowDeleteConfirm(rider.id)}
                    className="btn-action text-sm py-3 flex items-center justify-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="hidden sm:inline">Eliminar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-100 mb-4">Confirmar Eliminação</h3>
            <p className="text-gray-400 mb-6">
              Tem a certeza que deseja eliminar este rider? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-100 mb-4">Importar Rider</h3>
            
            {importError && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-600 rounded-lg text-red-300 text-sm">
                {importError}
              </div>
            )}
            
            {importSuccess && (
              <div className="mb-4 p-3 bg-green-900/20 border border-green-600 rounded-lg text-green-300 text-sm">
                {importSuccess}
              </div>
            )}
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Selecionar arquivo JSON
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent-blue file:text-white hover:file:bg-accent-blue/80"
              />
              <p className="text-xs text-gray-400 mt-2">
                Suporta apenas arquivos JSON exportados do RiderForge
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowImportModal(false)
                  setImportError('')
                  setImportSuccess('')
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                  }
                }}
                className="flex-1 btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Pro Upgrade Modal */}
      <ProUpgradeModal
        isOpen={showUpgradeModal}
        onClose={closeUpgradeModal}
        feature={currentFeature}
      />

      {/* PDF Export Modal */}
      <NewPDFExport
        isOpen={showNewPDFModal}
        onClose={() => setShowNewPDFModal(false)}
        riderData={exportRiderPayload.data}
        riderName={exportRiderPayload.name}
      />

      {/* Share Link Modal */}
      {shareLink && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-lg w-full">
            <h3 className="text-xl font-semibold text-gray-100 mb-3">Ligação gerada</h3>
            <p className="text-gray-400 text-sm mb-3">Copiámos a ligação para a área de transferência. Qualquer pessoa com esta ligação pode ver o rider no modo "Só leitura" nesta máquina.</p>
            <div className="bg-dark-800 border border-dark-700 rounded p-3 text-sm text-gray-300 break-all mb-4">{shareLink}</div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShareLink('')} className="btn-secondary">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyRiders
