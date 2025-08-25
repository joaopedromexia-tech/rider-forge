import { useState, useEffect, useRef } from 'react'
import { useEquipment } from '../context/EquipmentContext'
import { useRider } from '../context/RiderContext'
import { useAuth } from '../context/AuthContext'
import { useProFeatures } from '../hooks/useProFeatures'
import { useValidations } from '../hooks/useValidations'
import { useFeedback } from '../hooks/useFeedback'
import ProUpgradeModal from './ProUpgradeModal'
import DadosGerais from './tabs/DadosGerais'
import PA from './tabs/PA'
import Consolas from './tabs/Consolas'
import SistemasEscuta from './tabs/SistemasEscuta'
import EquipamentoAuxiliar from './tabs/EquipamentoAuxiliar'
import InputList from './tabs/InputList'
import MonitorMixes from './tabs/MonitorMixes'
import ObservacoesFinais from './tabs/ObservacoesFinais'
import SaveRiderModal from './SaveRiderModal'
import SaveProgressModal from './SaveProgressModal'
import NewPDFExport from './NewPDFExport'
import ValidationAlerts from './ValidationAlerts'
import ProStatusBadge from './ProStatusBadge'
import LoginModal from './auth/LoginModal'
import { kvGet, kvSet } from '../utils/storage'



function RiderForm({ onBack, editingRiderId = null, onNavigateToProSubscription }) {
  const { isPro, setIsPro } = useRider()
  const { saveRider, updateRider, getRiderById } = useRider()
  const { showSuccess, showError } = useFeedback()
  const { user, hasAccount } = useAuth()
  
  const {
    showUpgradeModal,
    showSaveProgressModal,
    currentFeature,
    closeUpgradeModal,
    closeSaveProgressModal,
    executePendingProAction,
    useProFeature,
    useProFeatureWithSave,
    PRO_FEATURES
  } = useProFeatures()
  const [activeTab, setActiveTab] = useState('dados-gerais')
  const [formData, setFormData] = useState({
    'dados-gerais': {},
    'pa': {},
    'consolas': {},
    'sistemas-escuta': {},
    'equipamento-auxiliar': {},
    'input-list': { inputs: [] },
    'monitor-mixes': { mixes: [] },
    'observacoes-finais': {}
  })
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showNewPDFModal, setShowNewPDFModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [editingRider, setEditingRider] = useState(null)
  const draftLoadedRef = useRef(false)
  const draftKeyRef = useRef('')

  // Sistema de validações
  const { validations, removeValidation } = useValidations(formData)

  const tabs = [
    {
      id: 'dados-gerais',
      title: 'Dados Gerais',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      component: DadosGerais
    },
    {
      id: 'pa',
      title: 'PA',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      ),
      component: PA
    },
    {
      id: 'consolas',
      title: 'Consolas',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
      component: Consolas
    },
    {
      id: 'sistemas-escuta',
      title: 'Sistemas de Escuta',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 18v-6a9 9 0 0118 0v6m-9-3h9m-9 0H6" />
        </svg>
      ),
      component: SistemasEscuta
    },
    {
      id: 'equipamento-auxiliar',
      title: 'Equipamento Auxiliar',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      component: EquipamentoAuxiliar
    },
    {
      id: 'input-list',
      title: 'Input List',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      component: InputList
    },
    {
      id: 'monitor-mixes',
      title: 'Monitor Mixes',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      ),
      component: MonitorMixes
    },
    {
      id: 'observacoes-finais',
      title: 'Observações Finais',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      component: ObservacoesFinais
    }
  ]

  // Carregar dados do rider se estiver editando
  useEffect(() => {
    if (editingRiderId) {
      const rider = getRiderById(editingRiderId)
      if (rider) {
        setEditingRider(rider)
        setFormData(rider.data || {})
      }
    } else {
      setEditingRider(null)
      setFormData({})
    }
  }, [editingRiderId, getRiderById])

  // Definir chave de rascunho por contexto (novo ou edição)
  useEffect(() => {
    draftKeyRef.current = editingRiderId ? `riderForge_draft_${editingRiderId}` : 'riderForge_draft_new'
  }, [editingRiderId])

  // Restaurar rascunho uma única vez por sessão de edição
  useEffect(() => {
    if (draftLoadedRef.current) return
    draftLoadedRef.current = true
    ;(async () => {
              try {
          const draft = await kvGet(draftKeyRef.current)
          if (draft && typeof draft === 'object') {
            setFormData(prev => ({ ...prev, ...draft }))
          }
        } catch (_) {}
    })()
  }, [])

  // Autosave de rascunho com debounce
  useEffect(() => {
    const t = setTimeout(() => {
      try { kvSet(draftKeyRef.current, formData) } catch (_) {}
    }, 1000)
    return () => clearTimeout(t)
  }, [formData])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
  }

  const handleFormDataChange = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }))
  }

  const handleSave = async (payload) => {
    // Para overwrite, não precisamos de verificação Pro
    if (payload?.mode === 'overwrite' && payload?.riderId) {
      try {
        updateRider(payload.riderId, formData)
        showSuccess('Rider substituído com sucesso!')
        try { await kvSet(draftKeyRef.current, null) } catch (_) {}
        onBack()
        return
      } catch (error) {
        showError('Erro ao salvar rider: ' + error.message)
        return
      }
    }
    
    // Para novos riders, usar verificação Pro
    const success = useProFeature(PRO_FEATURES.UNLIMITED_RIDERS.id, async () => {
      try {
        if (payload?.mode === 'new' && payload?.riderName) {
          // Novo rider
          saveRider(formData, payload.riderName)
          showSuccess('Rider salvo com sucesso!')
        } else if (editingRider) {
          // Atualizar rider existente (modo de edição)
          updateRider(editingRider.id, formData, editingRider.name)
          showSuccess('Rider atualizado com sucesso!')
        } else {
          showError('Dados de salvamento inválidos')
          return false
        }
        try { await kvSet(draftKeyRef.current, null) } catch (_) {}
        onBack()
        return true
      } catch (error) {
        showError('Erro ao salvar rider: ' + error.message)
        throw error
      }
    })
    
    if (!success) {
      // Modal já foi mostrado pelo hook
      return
    }
  }

  const handleSaveClick = () => {
    // Verificar se o utilizador tem conta para gravar
    if (!user || !hasAccount) {
      setShowLoginModal(true)
      return
    }
    
    setShowSaveModal(true)
  }



  const handleCreateAccountClick = () => {
    setShowLoginModal(true)
  }

  // Get the active component outside of render to avoid React 19 static flag issues
  const activeTabData = tabs.find(tab => tab.id === activeTab)
  const ActiveComponent = activeTabData?.component

  // Progresso geral (heurístico por secção)
  const getOverallProgress = () => {
    const data = formData || {}

    const clamp = (val) => Math.max(0, Math.min(100, Math.round(val)))

    // Dados Gerais: artista, versaoRider, anoTour + pelo menos um contacto
    const dg = data['dados-gerais'] || {}
    const requiredFields = [dg.artista, dg.versaoRider, dg.anoTour]
    const requiredDone = requiredFields.filter((v) => (v || '').toString().trim().length > 0).length
    const contacts = [dg.roadManager, dg.foh, dg.mon]
    const hasAnyContact = contacts.some((c) => c && Object.values(c).some((v) => (v || '').toString().trim().length > 0))
    const dadosGeraisPct = clamp(((requiredDone / 3) * 80) + (hasAnyContact ? 20 : 0))

    // Sistemas de Escuta: IEMs/Wedges/SideFills/Subs
    const se = data['sistemas-escuta'] || {}
    const seFlags = [
      (parseInt(se?.iems?.quantidade || '0') || 0) > 0,
      (parseInt(se?.wedges?.quantidade || '0') || 0) > 0,
      (parseInt(se?.sideFills?.quantidade || '0') || 0) > 0,
      Array.isArray(se?.subs) && se.subs.length > 0
    ]
    const sePct = clamp((seFlags.filter(Boolean).length / seFlags.length) * 100)

    // Monitor Mixes: mixes completas (instrumento + tipo + formato)
    const mm = data['monitor-mixes'] || {}
    const mixes = Array.isArray(mm.mixes) ? mm.mixes : []
    const totalMixes = mixes.length
    const completeMixes = mixes.filter((m) => (m?.instrumentoMusico || '').trim() && m?.tipo && m?.formato).length
    const monitorPct = totalMixes === 0 ? 0 : clamp((completeMixes / totalMixes) * 100)

    // Input List: inputs com fonte e micro/DI
    const il = data['input-list'] || {}
    const inputs = Array.isArray(il.inputs) ? il.inputs : []
    const totalInputs = inputs.length
    const completeInputs = inputs.filter((i) => (i?.fonte || '').trim() && (i?.microDi || '').trim()).length
    const inputPct = totalInputs === 0 ? 0 : clamp((completeInputs / totalInputs) * 100)

    // Consolas: FOH e MON definidos
    const cons = data['consolas'] || {}
    const foh = cons?.foh?.consolaPreferida || {}
    const mon = cons?.mon?.consolaPreferida || {}
    const consCount = [(foh.marca && foh.modelo), (mon.marca && mon.modelo)].filter(Boolean).length
    const consPct = clamp((consCount / 2) * 100)

    // Equipamento Auxiliar: talkbacks/intercom/FOH-MON
    const ea = data['equipamento-auxiliar'] || {}
    const eaFlags = [
      (parseInt(ea?.talkbacks?.quantidade || '0') || 0) > 0,
      (parseInt(ea?.intercom?.quantidade || '0') || 0) > 0,
      (ea?.comunicacaoFohMon?.tipo || '').trim().length > 0
    ]
    const eaPct = clamp((eaFlags.filter(Boolean).length / eaFlags.length) * 100)

    // Observações Finais: texto >= 100 chars
    const of = data['observacoes-finais'] || {}
    const ofText = (of.observacoes || '').toString()
    const ofPct = clamp(Math.min(100, Math.round((ofText.length / 100) * 100)))

    // PA: seções preenchidas (heurística simples)
    const pa = data['pa'] || {}
    const paPct = Object.keys(pa).length > 0 ? 60 : 0

    const sections = [dadosGeraisPct, sePct, monitorPct, inputPct, consPct, eaPct, ofPct, paPct]
    const overall = Math.round(sections.reduce((a, b) => a + b, 0) / sections.length)
    return clamp(overall)
  }

  const overallProgress = getOverallProgress()

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-dark-950/95 backdrop-blur-md border-b border-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Botão Voltar */}
            <div className="flex items-center justify-between lg:justify-start">
              <button
                onClick={onBack}
                className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Voltar</span>
              </button>
              
              {/* Badge de Status - visível apenas em mobile */}
              <div className="lg:hidden">
                <ProStatusBadge />
              </div>
            </div>
            
            {/* Título e Progresso */}
            <div className="flex flex-col items-center gap-3 flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-gradient text-center">
                {editingRider?.isDemo ? 'Rider Demo - Thunder Road' : (editingRiderId ? 'Editar Rider Técnico' : 'Criar Rider Técnico')}
              </h1>
              
              {/* Aviso para Rider Demo */}
              {editingRider?.isDemo && (
                <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-lg px-3 py-2 max-w-md text-center">
                  <p className="text-xs text-purple-200">
                    ✨ Este é um <strong>rider demo</strong> para exploração. Para guardar permanentemente, clique em "Guardar Rider" no final da página.
                  </p>
                </div>
              )}
              
              {/* Progresso Geral */}
              <div className="w-full max-w-xs">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>Progresso geral</span>
                  <span className="font-semibold text-gray-300">{overallProgress}%</span>
                </div>
                <div className="h-2 bg-dark-800 rounded-full overflow-hidden border border-dark-700">
                  <div className="h-2 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 transition-all duration-300" style={{ width: `${overallProgress}%` }}></div>
                </div>
              </div>
            </div>
            
            {/* Botões de Ação */}
            <div className="flex items-center gap-2 lg:gap-3">
              {/* Badge de Status - visível apenas em desktop */}
              <div className="hidden lg:block">
                <ProStatusBadge />
              </div>
              
              {/* Botão de Upgrade para Pro */}
              {!isPro && onNavigateToProSubscription && (
                <button
                  onClick={onNavigateToProSubscription}
                  className="btn-primary flex items-center gap-2 px-3 py-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="hidden sm:inline">Upgrade Pro</span>
                </button>
              )}
              
              {/* Botão Exportar PDF */}
              <button
                onClick={() => setShowNewPDFModal(true)}
                className="btn-secondary flex items-center gap-2 px-3 py-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v4m0 8v4m4-12h4m-8 0H4m12 8h4M4 16h8" />
                </svg>
                <span className="hidden sm:inline">PDF</span>
              </button>
              
              {/* Botão Principal */}
              {!user || !hasAccount ? (
                <button
                  onClick={handleCreateAccountClick}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold px-4 py-2 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 text-sm"
                >
                  <span className="hidden sm:inline">🔐 Criar Conta</span>
                  <span className="sm:hidden">🔐</span>
                </button>
              ) : (
                <button
                  onClick={handleSaveClick}
                  className="btn-primary px-4 py-2 text-sm"
                >
                  <span className="hidden sm:inline">{editingRider ? 'Atualizar' : 'Salvar'}</span>
                  <span className="sm:hidden">💾</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-dark-900/80 backdrop-blur-sm rounded-xl p-2 border border-dark-800/50 shadow-xl overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`tab-button flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-xs font-medium whitespace-nowrap ${
                  activeTab === tab.id ? 'active' : ''
                }`}
              >
                <div className="w-4 h-4 flex-shrink-0">{tab.icon}</div>
                <span className="hidden sm:inline">{tab.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="card min-h-[600px] animate-fade-in">
          {ActiveComponent && (
            <ActiveComponent
              data={formData[activeTab] || {}}
              onChange={(data) => handleFormDataChange(activeTab, data)}
              allData={formData}
            />
          )}
        </div>
      </div>

      {/* Save Modal */}
      <SaveRiderModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSave}
        riderData={formData}
        editingRider={editingRider}
      />

      {/* PDF Export Modal */}
      <NewPDFExport
        isOpen={showNewPDFModal}
        onClose={() => setShowNewPDFModal(false)}
        riderData={formData}
        riderName={editingRider?.name || 'Rider Técnico'}
      />

      {/* Pro Upgrade Modal */}
      <ProUpgradeModal
        isOpen={showUpgradeModal}
        onClose={closeUpgradeModal}
        feature={currentFeature}
        onNavigateToSubscription={() => {
          window.location.href = '/pro-subscription'
        }}
      />

      {/* Save Progress Modal */}
      <SaveProgressModal
        isOpen={showSaveProgressModal}
        onClose={closeSaveProgressModal}
        onSave={async () => {
          // Lógica para salvar progresso
          try {
            await kvSet(draftKeyRef.current, formData)
            return true
          } catch (error) {
            throw new Error('Erro ao guardar progresso')
          }
        }}
        onContinueWithoutSaving={() => {
          executePendingProAction()
        }}
        featureName={currentFeature?.title || 'funcionalidade Pro'}
      />

      {/* Validation Alerts */}
      {validations.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 max-w-md">
          {validations.map((validation) => (
            <div 
              key={validation.id}
              className={`mb-2 p-4 rounded-lg border ${
                validation.severity === 'error' 
                  ? 'bg-red-900/20 border-red-500/30 text-red-300' 
                  : validation.severity === 'warning'
                  ? 'bg-yellow-900/20 border-yellow-500/30 text-yellow-300'
                  : 'bg-blue-900/20 border-blue-500/30 text-blue-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm">{validation.message}</p>
                <button
                  onClick={() => removeValidation(validation.type)}
                  className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        defaultMode="signup"
      />
    </div>
  )
}

export default RiderForm
