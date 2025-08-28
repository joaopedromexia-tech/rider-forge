import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
import UserMenu from './UserMenu'
import LoginModal from './auth/LoginModal'
import VersionHistoryModal from './VersionHistoryModal'
import Breadcrumbs from './Breadcrumbs'
import { 
  ClipboardDocumentListIcon,
  SpeakerWaveIcon,
  AdjustmentsVerticalIcon,
  SignalIcon,
  WrenchScrewdriverIcon,
  ListBulletIcon,
  AdjustmentsHorizontalIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline'
import { kvGet, kvSet } from '../utils/storage'
import { useI18n } from '../context/I18nContext'



function RiderForm() {
  const navigate = useNavigate()
  const { riderId, tab } = useParams()
  const { t } = useI18n()
  const { isPro, setIsPro, savedRiders } = useRider()
  const { saveRider, updateRider, getRiderById, getRiderByIdWithSync, forceSyncState } = useRider()
  const { showSuccess, showError } = useFeedback()
  const { user, hasAccount } = useAuth()
  
  // Usar riderId dos parâmetros da URL, ou 'new' para novo rider
  const editingRiderId = riderId === 'new' ? null : riderId
  
  // Função para obter o último tab visitado do localStorage
  const getLastVisitedTab = (riderId) => {
    if (!riderId) return 'dados-gerais'
    try {
      const lastTab = localStorage.getItem(`riderForge_lastTab_${riderId}`)
      return lastTab || 'dados-gerais'
    } catch {
      return 'dados-gerais'
    }
  }

  // Função para salvar o último tab visitado
  const saveLastVisitedTab = (riderId, tabId) => {
    if (!riderId) return
    try {
      localStorage.setItem(`riderForge_lastTab_${riderId}`, tabId)
    } catch {
      // Ignorar erros de localStorage
    }
  }
  
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
  
  // Inicializar activeTab baseado na URL ou último tab visitado
  const [activeTab, setActiveTab] = useState(() => {
    if (tab) return tab
    if (editingRiderId) return getLastVisitedTab(editingRiderId)
    return 'dados-gerais'
  })
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
  const [showVersionHistoryModal, setShowVersionHistoryModal] = useState(false)
  const [editingRider, setEditingRider] = useState(null)
  const draftLoadedRef = useRef(false)
  const draftKeyRef = useRef('')

  // Sistema de validações
  const { validations, removeValidation } = useValidations(formData)

  const tabs = [
    {
      id: 'dados-gerais',
      title: t('rider.tabs.general'),
      icon: (
        <ClipboardDocumentListIcon className="w-4 h-4" aria-hidden="true" />
      ),
      component: DadosGerais
    },
    {
      id: 'pa',
      title: t('rider.tabs.pa'),
      icon: (
        <SpeakerWaveIcon className="w-4 h-4" aria-hidden="true" />
      ),
      component: PA
    },
    {
      id: 'consolas',
      title: t('rider.tabs.consoles'),
      icon: (
        <AdjustmentsVerticalIcon className="w-4 h-4" aria-hidden="true" />
      ),
      component: Consolas
    },
    {
      id: 'input-list',
      title: t('rider.tabs.inputList'),
      icon: (
        <ListBulletIcon className="w-4 h-4" aria-hidden="true" />
      ),
      component: InputList
    },
    {
      id: 'sistemas-escuta',
      title: t('rider.tabs.listenSystems'),
      icon: (
        <SignalIcon className="w-4 h-4" aria-hidden="true" />
      ),
      component: SistemasEscuta
    },
    {
      id: 'monitor-mixes',
      title: t('rider.tabs.monitorMixes'),
      icon: (
        <AdjustmentsHorizontalIcon className="w-4 h-4" aria-hidden="true" />
      ),
      component: MonitorMixes
    },
    {
      id: 'equipamento-auxiliar',
      title: t('rider.tabs.auxEquip'),
      icon: (
        <WrenchScrewdriverIcon className="w-4 h-4" aria-hidden="true" />
      ),
      component: EquipamentoAuxiliar
    },
    {
      id: 'observacoes-finais',
      title: t('rider.tabs.finalNotes'),
      icon: (
        <PencilSquareIcon className="w-4 h-4" aria-hidden="true" />
      ),
      component: ObservacoesFinais
    }
  ]

  // Carregar dados do rider se estiver editando
  useEffect(() => {
    if (editingRiderId) {
      console.log('🔄 RiderForm: Carregando rider com ID:', editingRiderId)
      
      // Forçar sincronização do estado antes de tentar carregar o rider
      forceSyncState()
      
      // Usar setTimeout para garantir que a sincronização seja processada
      const loadRider = () => {
        const rider = getRiderByIdWithSync(editingRiderId)
        console.log('📋 RiderForm: Resultado da busca:', rider)
        
        if (rider) {
          console.log('✅ RiderForm: Carregando dados do rider:', rider.name)
          setEditingRider(rider)
          setFormData(rider.data || {})
        } else {
          console.log('❌ RiderForm: Rider não encontrado, tentando fallbacks...')
          // Se é um demo temporário, tentar carregar do localStorage
          if (editingRiderId.startsWith('demo_temp_')) {
            try {
              const tempDemo = localStorage.getItem('riderForge_temp_demo')
              if (tempDemo) {
                const demoRider = JSON.parse(tempDemo)
                if (demoRider.id === editingRiderId) {
                  console.log('🎭 Demo rider encontrado:', demoRider)
                  setEditingRider(demoRider)
                  setFormData(demoRider.data || {})
                  return
                }
              }
            } catch (error) {
              // noop
            }

            // Fallback: memória global (evita quota do localStorage)
            try {
              if (typeof window !== 'undefined' && window.__riderForge_demo && window.__riderForge_demo.id === editingRiderId) {
                const demoRider = window.__riderForge_demo
                setEditingRider(demoRider)
                setFormData(demoRider.data || {})
                return
              }
            } catch (_) {}
          }
          
          // Se ainda não encontrou, criar um demo básico
          if (editingRiderId.startsWith('demo_temp_')) {
            const basicDemoData = {
              'dados-gerais': {
                artista: 'Thunder Road',
                versaoRider: '3.0',
                anoTour: '2026',
                roadManager: {
                  nome: 'Alex Johnson',
                  telefone: '+1 555 123 4567',
                  email: 'alex.johnson@thunderroad.com'
                },
                foh: {
                  nome: 'Mike Rodriguez',
                  telefone: '+1 555 987 6543',
                  email: 'mike.rodriguez@thunderroad.com'
                },
                mon: {
                  nome: 'Sarah Chen',
                  telefone: '+1 555 456 7890',
                  email: 'sarah.chen@thunderroad.com'
                }
              },
              'pa': {},
              'consolas': {},
              'sistemas-escuta': {},
              'equipamento-auxiliar': {},
              'input-list': { inputs: [] },
              'monitor-mixes': { mixes: [] },
              'observacoes-finais': {}
            }
            
            const basicDemoRider = {
              id: editingRiderId,
              name: 'Thunder Road - Demo Básico',
              data: basicDemoData,
              isDemo: true,
              isTemporary: true
            }
            
            setEditingRider(basicDemoRider)
            setFormData(basicDemoData)
          }
        }
      }
      
      // Tentar carregar imediatamente
      loadRider()
      
      // Se não encontrou, tentar novamente após um pequeno delay
      setTimeout(() => {
        if (!editingRider) {
          console.log('🔄 RiderForm: Tentando carregar novamente após delay...')
          loadRider()
        }
      }, 100)
      
    } else {
      console.log('🔄 Limpando dados do formulário (sem editingRiderId)')
      setEditingRider(null)
      setFormData({})
    }
  }, [editingRiderId, getRiderByIdWithSync, forceSyncState, editingRider])

  // Definir chave de rascunho por contexto (novo ou edição)
  useEffect(() => {
    draftKeyRef.current = editingRiderId ? `riderForge_draft_${editingRiderId}` : 'riderForge_draft_new'
  }, [editingRiderId])

  // Restaurar rascunho uma única vez por sessão de edição
  useEffect(() => {
    if (draftLoadedRef.current) return
    // Não restaurar rascunho quando a criação é nova (sem editingRiderId)
    if (!editingRiderId) return
    draftLoadedRef.current = true
    ;(async () => {
      try {
        const draft = await kvGet(draftKeyRef.current)
        if (draft && typeof draft === 'object') {
          setFormData(prev => ({ ...prev, ...draft }))
        }
      } catch (_) {}
    })()
  }, [editingRiderId])

  // Ao abrir um formulário novo, limpar qualquer rascunho antigo de "novo"
  useEffect(() => {
    if (!editingRiderId) {
      try { kvSet('riderForge_draft_new', null) } catch (_) {}
    }
  }, [editingRiderId])

  // Autosave de rascunho com debounce
  useEffect(() => {
    const t = setTimeout(() => {
      try { kvSet(draftKeyRef.current, formData) } catch (_) {}
    }, 1000)
    return () => clearTimeout(t)
  }, [formData])

  // Fazer scroll para o topo quando o tab ativo muda
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [activeTab])

  // Fazer scroll para o topo quando o componente é montado
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    // Salvar o último tab visitado
    if (editingRiderId) {
      saveLastVisitedTab(editingRiderId, tabId)
    }
    // Atualizar a URL quando mudar de tab
    if (editingRiderId) {
      navigate(`/riders/${editingRiderId}/${tabId}`)
    } else {
      navigate(`/riders/new/${tabId}`)
    }
    
    // Fazer scroll para o topo quando mudar de tab
    window.scrollTo(0, 0)
  }

  const handleBackToHome = () => {
    navigate('/')
  }

  const handleNavigateToProSubscription = () => {
    navigate('/pro-subscription')
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
        console.log('🔄 Salvando rider (overwrite):', payload.riderId)
        await updateRider(payload.riderId, formData)
        showSuccess('Rider substituído com sucesso!')
        try { await kvSet(draftKeyRef.current, null) } catch (_) {}
        
        // Aguardar sincronização antes de voltar
        console.log('⏳ Aguardando sincronização...')
        await new Promise(resolve => {
          forceSyncState()
          // Aguardar 100ms para garantir que o estado foi atualizado
          setTimeout(() => {
            console.log('✅ Sincronização completa, navegando de volta')
            resolve()
          }, 100)
        })
        
        navigate('/riders')
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
          await saveRider(formData, payload.riderName)
          showSuccess('Rider salvo com sucesso!')
        } else if (editingRider) {
          // Atualizar rider existente (modo de edição)
          console.log('🔄 Salvando rider (edição):', editingRider.id)
          await updateRider(editingRider.id, formData, editingRider.name)
          showSuccess('Rider atualizado com sucesso!')
        } else {
          showError('Dados de salvamento inválidos')
          return false
        }
        try { await kvSet(draftKeyRef.current, null) } catch (_) {}
        
        // Aguardar sincronização antes de voltar
        console.log('⏳ Aguardando sincronização...')
        await new Promise(resolve => {
          forceSyncState()
          // Aguardar 100ms para garantir que o estado foi atualizado
          setTimeout(() => {
            console.log('✅ Sincronização completa, navegando de volta')
            resolve()
          }, 100)
        })
        
        navigate('/riders')
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
    
    // Verificar se o usuário gratuito atingiu o limite de riders (apenas para novos riders)
    if (!isPro && savedRiders.length >= 2 && !editingRiderId) {
      // Mostrar alerta de limite atingido
      showError(t('riders.limit.description', { max: 2 }))
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
        <div className="max-w-7xl mx-auto px-4 py-2">
          <Breadcrumbs />
        </div>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Botão Voltar */}
            <div className="flex items-center justify-between lg:justify-start">
              <button
                onClick={handleBackToHome}
                className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">{t('common.back')}</span>
              </button>
              
              {/* User Menu - visível apenas em mobile */}
              <div className="lg:hidden">
                <UserMenu />
              </div>
            </div>
            
            {/* Título e Progresso */}
            <div className="flex flex-col items-center gap-3 flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-gradient text-center">{editingRider?.isDemo && import.meta.env.VITE_SHOW_DEMO === 'true' ? t('rider.demo.title') : (editingRiderId ? t('rider.header.title.edit') : t('rider.header.title.create'))}</h1>
              
              {/* Aviso para Rider Demo */}
              {editingRider?.isDemo && import.meta.env.VITE_SHOW_DEMO === 'true' && (
                <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-lg px-3 py-2 max-w-md text-center">
                  <p className="text-xs text-purple-200">{t('rider.header.demo.note')}</p>
                </div>
              )}
              
              {/* Progresso Geral */}
              <div className="w-full max-w-xs">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>{t('rider.header.progress')}</span>
                  <span className="font-semibold text-gray-300">{overallProgress}%</span>
                </div>
                <div className="h-2 bg-dark-800 rounded-full overflow-hidden border border-dark-700">
                  <div className="h-2 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 transition-all duration-300" style={{ width: `${overallProgress}%` }}></div>
                </div>
              </div>
            </div>
            
            {/* Botões de Ação */}
            <div className="flex items-center gap-2 lg:gap-3">
              {/* User Menu - visível apenas em desktop */}
              <div className="hidden lg:block">
                <UserMenu />
              </div>
              
              {/* Botão de Upgrade para Pro */}
              {!isPro && (
                <button
                  onClick={handleNavigateToProSubscription}
                  className="btn-primary flex items-center gap-2 px-3 py-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="hidden sm:inline">{t('common.upgradePro')}</span>
                </button>
              )}
              
              {/* Version History Button - Only for Pro users and when editing */}
              {isPro && editingRiderId && (
                <button
                  onClick={() => setShowVersionHistoryModal(true)}
                  className="btn-secondary flex items-center gap-2 px-3 py-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="hidden sm:inline">Histórico</span>
                </button>
              )}
              
              {/* Botão Principal */}
              {!user || !hasAccount ? (
                <button
                  onClick={handleCreateAccountClick}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold px-4 py-2 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                  aria-label={t('common.loginOrSignup')}
                >
                  <span className="hidden sm:inline">🔐 {t('common.loginOrSignup')}</span>
                  <span className="sm:hidden" aria-hidden="true">🔐</span>
                </button>
              ) : !editingRider?.isDemo ? (
                <button
                  onClick={handleSaveClick}
                  className="btn-primary px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  aria-label={editingRider ? t('common.update') : t('common.save')}
                >
                  <span className="hidden sm:inline">{editingRider ? t('common.update') : t('common.save')}</span>
                  <span className="sm:hidden" aria-hidden="true">💾</span>
                </button>
              ) : null}
              
              {/* PDF Export Button */}
              <button
                onClick={() => setShowNewPDFModal(true)}
                className="btn-secondary flex items-center gap-2 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                aria-label={t('common.pdf')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v4m0 8v4m4-12h4m-8 0H4m12 8h4M4 16h8" />
                </svg>
                <span className="hidden sm:inline">{t('common.pdf')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-dark-900/80 backdrop-blur-sm rounded-xl p-2 border border-dark-800/50 shadow-xl overflow-x-auto">
          <div 
            className="flex gap-1 min-w-max justify-center"
            role="tablist"
            aria-label={t('rider.tabs.navigation')}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`tab-button flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 text-xs font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                  activeTab === tab.id ? 'active' : ''
                }`}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`tab-panel-${tab.id}`}
                id={`tab-${tab.id}`}
              >
                <div className="w-4 h-4 flex-shrink-0" aria-hidden="true">{tab.icon}</div>
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
            <div
              role="tabpanel"
              id={`tab-panel-${activeTab}`}
              aria-labelledby={`tab-${activeTab}`}
            >
              <ActiveComponent
                data={formData[activeTab] || {}}
                onChange={(data) => handleFormDataChange(activeTab, data)}
                allData={formData}
              />
            </div>
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

      {/* Version History Modal */}
      <VersionHistoryModal
        isOpen={showVersionHistoryModal}
        onClose={() => setShowVersionHistoryModal(false)}
        riderId={editingRiderId}
        currentData={formData}
        onRestoreVersion={(versionData) => {
          setFormData(versionData)
          setShowVersionHistoryModal(false)
        }}
      />

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
