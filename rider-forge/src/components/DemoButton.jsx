import { useRider } from '../context/RiderContext'



function DemoButton({ onNavigateToForm }) {
  const { saveRider } = useRider()

  const createCompleteDemoRider = async () => {
    console.log('🚀 Iniciando criação do rider demo...')
    
    // Função para carregar imagem e converter para base64
    const loadImageAsBase64 = async (imagePath) => {
      try {
        const response = await fetch(imagePath)
        const blob = await response.blob()
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
      } catch (error) {
        console.error('Erro ao carregar imagem:', error)
        // Fallback para placeholder simples
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
      }
    }
    
    // Carregar imagens do demo
    const pngCapa = await loadImageAsBase64('/images/capa_demo.png')
    const pngStagePlot = await loadImageAsBase64('/images/stageplot_demo.png')
    
    // Criar dados mais simples para evitar problemas
    const completeDemoData = {
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
        },
        imagemCapa: {
          data: pngCapa,
          type: 'image/png',
          name: 'capa_demo.png',
          size: pngCapa.length
        },
        stagePlot: {
          data: pngStagePlot,
          type: 'image/png',
          name: 'stageplot_demo.png',
          size: pngStagePlot.length
        }
      },
      'pa': {
        generalRequirements: {
          performance: {
            splAtFOH: '115',
            splUnit: 'dB(A)',
            uniformity: '±2',
            uniformityUnit: 'dB',
            frequencyResponse: {
              low: '35',
              high: '18000',
              unit: 'Hz'
            },
            phaseAlignment: true,
            noiseFree: true
          },
          systemConfig: {
            lineArrayRequired: true,
            suspensionRequired: true,
            towerMounting: true
          },
          coverage: {
            audienceDepth: '50m',
            audienceWidth: '30m',
            delayZones: 3,
            coverageNotes: 'Cobertura uniforme para toda a plateia com sistema de delay para as zonas traseiras'
          },
          processing: {
            systemProcessor: 'Lake — LM44',
            roomTuning: true,
            measurementSystem: 'SMAART v8',
            processingNotes: 'Sistema de medição e ajuste automático de sala incluído. Configuração específica para rock com graves reforçados.'
          }
        },
        mainSystem: {
          acceptedSystems: [
            { marca: 'L-Acoustics', modelo: 'K2', supplier: 'promoter' },
            { marca: 'L-Acoustics', modelo: 'K3', supplier: 'promoter' },
            { marca: 'Meyer Sound', modelo: 'LEOPARD', supplier: 'promoter' },
            { marca: 'Meyer Sound', modelo: 'LYON', supplier: 'promoter' },
            { marca: 'd&b audiotechnik', modelo: 'V-Series', supplier: 'promoter' },
            { marca: 'd&b audiotechnik', modelo: 'Y-Series', supplier: 'promoter' }
          ],
          newBrand: '',
          newModel: '',
          supplier: 'promoter'
        },
        subwoofers: {
          required: true,
          mountingTypes: {
            arcDelay: false,
            cardioide: true,
            endFire: false
          },
          crossoverFrequency: 85,
          crossoverEnabled: true,
          notes: 'Subwoofers em configuração cardioide para redução de spill no palco'
        },
        frontFillRequired: true,
        frontFillCoverage: '8m',
        frontFillNotes: 'Front fill para as primeiras filas com sistema dedicado',
        riggingNotes: 'Sistema de rigging certificado com capacidade de carga mínima de 500kg por ponto. Verificar certificações de segurança.',
        observacoes: 'Sistema PA de alta qualidade para eventos de grande escala. Requer técnico especializado para operação e configuração. Sistema de backup incluído.'
      },
      'consolas': {
        foh: {
          consolaPreferida: {
            marca: 'DiGiCo',
            modelo: 'SD12',
            observacoes: 'Consola principal FOH com 96 canais de entrada',
            supplier: 'band'
          },
          outrasConsolas: [
            { marca: 'Yamaha', modelo: 'CL5', observacoes: 'Backup FOH', supplier: 'promoter' },
            { marca: 'Midas', modelo: 'Pro2', observacoes: 'Alternativa compacta', supplier: 'promoter' }
          ],
          novaConsola: {
            marca: '',
            modelo: '',
            observacoes: '',
            supplier: 'promoter'
          }
        },
        mon: {
          consolaPreferida: {
            marca: 'DiGiCo',
            modelo: 'SD9',
            observacoes: 'Consola monitor com 48 canais de entrada',
            supplier: 'promoter'
          },
          outrasConsolas: [
            { marca: 'Yamaha', modelo: 'CL3', observacoes: 'Backup monitor', supplier: 'promoter' },
            { marca: 'Allen & Heath', modelo: 'dLive S5000', observacoes: 'Alternativa com mais canais', supplier: 'promoter' }
          ],
          novaConsola: {
            marca: '',
            modelo: '',
            observacoes: '',
            supplier: 'promoter'
          }
        }
      },
      'sistemas-escuta': {
        tipoSistema: 'iem',
        marcasAceites: [
          { marca: 'Shure', modelo: 'P9T' },
          { marca: 'Sennheiser', modelo: 'G3' },
          { marca: 'Sennheiser', modelo: 'G4' }
        ],
        quantidadeCanais: 6,
        frequencias: 'UHF',
        observacoes: 'Sistema IEM profissional com 6 canais UHF. Frequências a coordenar com o promotor.',
        iems: {
          quantidade: 6,
          modeloPreferido: 'Shure — P9T',
          observacoes: 'Sistema IEM profissional para banda de 5 músicos + 1 técnico',
          supplier: 'promoter'
        },
        wedges: {
          quantidade: 4,
          modelo: 'Meyer Sound — UPA-1P',
          observacoes: 'Wedges de backup para situações especiais',
          supplier: false
        },
        sideFills: {
          quantidade: 2,
          modelo: 'Meyer Sound — UPA-1P',
          observacoes: 'Side fills para cobertura lateral do palco',
          supplier: false
        },
        subs: [
          {
            id: Date.now() + 100,
            quantidade: 1,
            modelo: 'Meyer Sound — 1100-LFC',
            paraInstrumento: 'Baterista',
            observacoes: 'Subwoofer para baterista com graves reforçados',
            supplier: 'promoter'
          }
        ]
      },
      'equipamento-auxiliar': {
        racks: [
          { tipo: 'Rack 19"', quantidade: 4, observacoes: 'Racks para equipamento de processamento' }
        ],
        cabos: [
          { tipo: 'XLR 3-pin', quantidade: 50, observacoes: 'Cabos de áudio balanceados' },
          { tipo: 'XLR 5-pin', quantidade: 20, observacoes: 'Cabos para DMX' }
        ],
        acessorios: [
          { tipo: 'Pé de microfone', quantidade: 15, observacoes: 'Pés de microfone com base pesada' },
          { tipo: 'Suporte de guitarra', quantidade: 8, observacoes: 'Suportes para instrumentos' }
        ],
        talkbacks: {
          quantidade: 4,
          modelo: 'Clear-Com — Eclipse HX',
          observacoes: 'Sistema de talkback para comunicação entre técnicos',
          supplier: false
        },
        intercom: {
          quantidade: 6,
          modelo: 'Clear-Com — Eclipse HX',
          observacoes: 'Sistema de intercom para comunicação de palco',
          supplier: false
        },
        comunicacaoFohMon: {
          tipo: 'Cabo dedicado',
          observacoes: 'Comunicação dedicada entre FOH e MON via cabo XLR',
          supplier: 'promoter'
        },
        observacoes: 'Equipamento auxiliar de qualidade profissional. Verificar estado de todos os cabos antes do evento.'
      },
      'input-list': {
        inputs: [
          {
            id: Date.now() + 1,
            canal: '1',
            fonte: 'Vocal Principal',
            microDi: 'Shure — SM58',
            stand: 'tall',
            phantom: false,
            supplier: true
          },
          {
            id: Date.now() + 2,
            canal: '2',
            fonte: 'Vocal Backing',
            microDi: 'Shure — SM58',
            stand: 'tall',
            phantom: false,
            supplier: true
          },
          {
            id: Date.now() + 3,
            canal: '3',
            fonte: 'Guitarra Lead',
            microDi: 'Shure — SM57 + Radial — JDI',
            stand: 'ground',
            phantom: false,
            supplier: false
          },
          {
            id: Date.now() + 4,
            canal: '4',
            fonte: 'Guitarra Rítmica',
            microDi: 'Shure — SM57 + Radial — JDI',
            stand: 'ground',
            phantom: false,
            supplier: false
          },
          {
            id: Date.now() + 5,
            canal: '5',
            fonte: 'Baixo',
            microDi: 'Shure — Beta 52A + Radial — JDI',
            stand: 'ground',
            phantom: false,
            supplier: false
          },
          {
            id: Date.now() + 6,
            canal: '6',
            fonte: 'Bateria - Kick',
            microDi: 'Shure — Beta 52A',
            stand: 'ground',
            phantom: false,
            supplier: false
          },
          {
            id: Date.now() + 7,
            canal: '7',
            fonte: 'Bateria - Snare',
            microDi: 'Shure — SM57',
            stand: 'short',
            phantom: false,
            supplier: false
          },
          {
            id: Date.now() + 8,
            canal: '8',
            fonte: 'Bateria - Hi-Hat',
            microDi: 'Shure — SM57',
            stand: 'boom',
            phantom: false,
            supplier: false
          },
          {
            id: Date.now() + 9,
            canal: '9',
            fonte: 'Bateria - Tom 1',
            microDi: 'Sennheiser — e604',
            stand: 'clip',
            phantom: false,
            supplier: false
          },
          {
            id: Date.now() + 10,
            canal: '10',
            fonte: 'Bateria - Tom 2',
            microDi: 'Sennheiser — e604',
            stand: 'clip',
            phantom: false,
            supplier: false
          },
          {
            id: Date.now() + 11,
            canal: '11',
            fonte: 'Bateria - Overhead Esquerdo',
            microDi: 'Neumann — KM184',
            stand: 'boom',
            phantom: true,
            supplier: false
          },
          {
            id: Date.now() + 12,
            canal: '12',
            fonte: 'Bateria - Overhead Direito',
            microDi: 'Neumann — KM184',
            stand: 'boom',
            phantom: true,
            supplier: false
          }
        ]
      },
      'monitor-mixes': {
        mixes: [
          {
            nome: 'Vocal Principal',
            instrumentoMusico: 'Vocal Principal',
            tipo: 'iem',
            formato: 'stereo',
            canais: ['Vocal Principal', 'Vocal Backing', 'Guitarra Lead', 'Guitarra Rítmica', 'Baixo', 'Bateria - Kick', 'Bateria - Snare', 'Bateria - Hi-Hat'],
            observacoes: 'Mix para vocal principal com todos os instrumentos - configuração rock'
          },
          {
            nome: 'Guitarrista Lead',
            instrumentoMusico: 'Guitarrista Lead',
            tipo: 'iem',
            formato: 'stereo',
            canais: ['Guitarra Lead', 'Guitarra Rítmica', 'Baixo', 'Bateria - Kick', 'Bateria - Snare', 'Bateria - Hi-Hat', 'Vocal Principal'],
            observacoes: 'Mix para guitarrista lead com ênfase na guitarra e bateria'
          },
          {
            nome: 'Guitarrista Rítmico',
            instrumentoMusico: 'Guitarrista Rítmico',
            tipo: 'iem',
            formato: 'stereo',
            canais: ['Guitarra Rítmica', 'Guitarra Lead', 'Baixo', 'Bateria - Kick', 'Bateria - Snare', 'Vocal Principal'],
            observacoes: 'Mix para guitarrista rítmico - power chords'
          },
          {
            nome: 'Baixista',
            instrumentoMusico: 'Baixista',
            tipo: 'iem',
            formato: 'stereo',
            canais: ['Baixo', 'Bateria - Kick', 'Bateria - Snare', 'Bateria - Hi-Hat', 'Guitarra Lead', 'Guitarra Rítmica', 'Vocal Principal'],
            observacoes: 'Mix para baixista com ênfase no baixo e bateria'
          },
          {
            nome: 'Baterista',
            instrumentoMusico: 'Baterista',
            tipo: 'iem',
            formato: 'stereo',
            canais: ['Bateria - Kick', 'Bateria - Snare', 'Bateria - Hi-Hat', 'Bateria - Tom 1', 'Bateria - Tom 2', 'Bateria - Overhead Esquerdo', 'Bateria - Overhead Direito', 'Baixo', 'Vocal Principal'],
            observacoes: 'Mix para baterista com todos os elementos da bateria'
          },
          {
            nome: 'Técnico MON',
            instrumentoMusico: 'Técnico MON',
            tipo: 'iem',
            formato: 'stereo',
            canais: ['Vocal Principal', 'Vocal Backing', 'Guitarra Lead', 'Guitarra Rítmica', 'Baixo', 'Bateria - Kick', 'Bateria - Snare'],
            observacoes: 'Mix para técnico MON - monitorização completa'
          }
        ]
      },
      'observacoes-finais': {
        observacoes: 'Rider técnico completo para banda de rock Thunder Road. Todos os equipamentos devem estar em perfeito estado de funcionamento. Requer técnicos especializados para operação. Sistema de backup incluído para equipamentos críticos. Configuração específica para rock com graves reforçados e dinâmica alta. Verificar certificações de segurança para rigging. Coordenar frequências IEM com promotor. Teste de som obrigatório 2 horas antes do evento. Verificar isolamento acústico para evitar feedback. Configurar compressores para vocais e bateria. Sistema de monitorização contínua durante o evento. Backup de energia para equipamentos críticos. Verificar compatibilidade de frequências com outros eventos no local.',
        requisitosEspeciais: 'Verificar certificações de segurança para rigging. Coordenar frequências IEM com promotor. Teste de som obrigatório 2 horas antes do evento. Verificar isolamento acústico para evitar feedback. Configurar compressores para vocais e bateria. Sistema de monitorização contínua durante o evento. Backup de energia para equipamentos críticos. Verificar compatibilidade de frequências com outros eventos no local.',
        contactosEmergencia: 'Em caso de emergência técnica, contactar o road manager Alex Johnson: +1 555 123 4567'
      }
    }

    // Salvar o rider demo
    const demoRider = {
      id: Date.now().toString() + '_demo',
      name: 'Thunder Road - Rider Técnico Completo 2026',
      data: completeDemoData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      thumbnail: {
        artista: 'Thunder Road',
        data: new Date().toLocaleDateString('pt-PT'),
        equipmentCount: 35,
        cardName: 'Thunder Road - Rider Técnico Completo 2026'
      }
    }

    console.log('🎯 Tentando salvar rider demo...')

    // Adicionar à lista de riders e abrir para edição
    try {
      const savedRider = saveRider(completeDemoData, demoRider.name)
      console.log('✅ Rider demo criado com sucesso:', savedRider.id)
      // Navegar imediatamente para o formulário
      console.log('🚀 Navegando para o formulário com ID:', savedRider.id)
      onNavigateToForm(savedRider.id)
    } catch (error) {
      console.error('❌ Erro ao criar rider demo:', error)
      // Em caso de erro, tentar criar um rider mais simples
      try {
        const simpleDemoData = {
          'dados-gerais': {
            artista: 'Thunder Road',
            versaoRider: '3.0',
            anoTour: '2026',
            roadManager: {
              nome: 'Alex Johnson',
              telefone: '+1 555 123 4567',
              email: 'alex.johnson@thunderroad.com'
            }
          }
        }
        const simpleRider = saveRider(simpleDemoData, 'Thunder Road - Demo Simples')
        console.log('✅ Rider demo simples criado:', simpleRider.id)
        onNavigateToForm(simpleRider.id)
      } catch (fallbackError) {
        console.error('❌ Erro no fallback:', fallbackError)
        alert('Erro ao criar rider demo. Tente novamente.')
      }
    }
  }

  return (
    <button
      onClick={createCompleteDemoRider}
      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-base sm:text-lg font-bold relative overflow-hidden group w-full max-w-sm px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-dashed border-purple-400"
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        <svg 
          className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        🚀 CRIAR RIDER DEMO COMPLETO
      </span>
    </button>
  )
}

export default DemoButton
