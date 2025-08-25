import { useRider } from '../context/RiderContext'



function DemoButton({ onNavigateToForm }) {
  const { saveRider } = useRider()

  const createCompleteDemoRider = async () => {
    // Criar dados completos para preencher todas as abas
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
          data: '/images/capa_demo.png',
          type: 'image/png',
          name: 'capa_demo.png',
          size: 1884160
        },
        stagePlot: {
          data: '/images/stageplot_demo.png',
          type: 'image/png',
          name: 'stageplot_demo.png',
          size: 994304
        }
      },
      'pa': {
        generalRequirements: {
          performance: {
            splAtFOH: '115',
            splUnit: 'dB(A)',
            uniformity: '±2',
            uniformityUnit: 'dB',
            frequencyResponse: { low: '35', high: '18000', unit: 'Hz' },
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
            coverageNotes: 'Cobertura uniforme para toda a plateia'
          },
          processing: {
            systemProcessor: 'Lake — LM44',
            roomTuning: true,
            measurementSystem: 'SMAART v8',
            processingNotes: 'Sistema de medição incluído'
          }
        },
        mainSystem: {
          acceptedSystems: [
            { marca: 'L-Acoustics', modelo: 'K2', supplier: 'promoter' },
            { marca: 'Meyer Sound', modelo: 'LEOPARD', supplier: 'promoter' }
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
          notes: 'Subwoofers em configuração cardioide'
        },
        frontFillRequired: true,
        frontFillCoverage: '8m',
        frontFillNotes: 'Front fill para as primeiras filas',
        riggingNotes: 'Sistema de rigging certificado',
        observacoes: 'Sistema PA de alta qualidade'
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
          supplier: 'promoter'
        },
        sideFills: {
          quantidade: 2,
          modelo: 'Meyer Sound — UPA-1P',
          observacoes: 'Side fills para cobertura lateral do palco',
          supplier: 'promoter'
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
        ],
        observacoes: 'Sistema IEM profissional com 6 canais UHF. Frequências a coordenar com o promotor.'
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
          supplier: 'promoter'
        },
        intercom: {
          quantidade: 6,
          modelo: 'Clear-Com — Eclipse HX',
          observacoes: 'Sistema de intercom para comunicação de palco',
          supplier: 'promoter'
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
          { id: Date.now() + 1,  canal: '1',  fonte: 'Vocal Principal',              microDi: 'Shure — SM58',                          stand: 'tall',   phantom: false, supplier: true },
          { id: Date.now() + 2,  canal: '2',  fonte: 'Vocal Backing',                microDi: 'Shure — SM58',                          stand: 'tall',   phantom: false, supplier: true },
          { id: Date.now() + 3,  canal: '3',  fonte: 'Guitarra Lead',                microDi: 'Shure — SM57 + Radial — JDI',           stand: 'ground', phantom: false, supplier: false },
          { id: Date.now() + 4,  canal: '4',  fonte: 'Guitarra Rítmica',             microDi: 'Shure — SM57 + Radial — JDI',           stand: 'ground', phantom: false, supplier: false },
          { id: Date.now() + 5,  canal: '5',  fonte: 'Baixo',                        microDi: 'Shure — Beta 52A + Radial — JDI',       stand: 'ground', phantom: false, supplier: false },
          { id: Date.now() + 6,  canal: '6',  fonte: 'Bateria - Kick',               microDi: 'Shure — Beta 52A',                      stand: 'ground', phantom: false, supplier: false },
          { id: Date.now() + 7,  canal: '7',  fonte: 'Bateria - Snare',              microDi: 'Shure — SM57',                          stand: 'short',  phantom: false, supplier: false },
          { id: Date.now() + 8,  canal: '8',  fonte: 'Bateria - Hi-Hat',             microDi: 'Shure — SM57',                          stand: 'boom',   phantom: false, supplier: false },
          { id: Date.now() + 9,  canal: '9',  fonte: 'Bateria - Tom 1',             microDi: 'Sennheiser — e604',                     stand: 'clip',   phantom: false, supplier: false },
          { id: Date.now() + 10, canal: '10', fonte: 'Bateria - Tom 2',             microDi: 'Sennheiser — e604',                     stand: 'clip',   phantom: false, supplier: false },
          { id: Date.now() + 11, canal: '11', fonte: 'Bateria - Overhead Esquerdo', microDi: 'Neumann — KM184',                       stand: 'boom',   phantom: true,  supplier: false },
          { id: Date.now() + 12, canal: '12', fonte: 'Bateria - Overhead Direito',  microDi: 'Neumann — KM184',                       stand: 'boom',   phantom: true,  supplier: false }
        ]
      },
      'monitor-mixes': {
        mixes: [
          { nome: 'Vocal Principal', instrumentoMusico: 'Vocal Principal', tipo: 'iem', formato: 'stereo', canais: ['Vocal Principal', 'Vocal Backing', 'Guitarra Lead', 'Guitarra Rítmica', 'Baixo', 'Bateria - Kick', 'Bateria - Snare', 'Bateria - Hi-Hat'], observacoes: 'Mix para vocal principal' },
          { nome: 'Guitarrista Lead', instrumentoMusico: 'Guitarrista Lead', tipo: 'iem', formato: 'stereo', canais: ['Guitarra Lead', 'Guitarra Rítmica', 'Baixo', 'Bateria - Kick', 'Bateria - Snare', 'Bateria - Hi-Hat', 'Vocal Principal'], observacoes: 'Mix para guitarrista lead' },
          { nome: 'Guitarrista Rítmico', instrumentoMusico: 'Guitarrista Rítmico', tipo: 'iem', formato: 'stereo', canais: ['Guitarra Rítmica', 'Guitarra Lead', 'Baixo', 'Bateria - Kick', 'Bateria - Snare', 'Vocal Principal'], observacoes: 'Mix para guitarrista rítmico' },
          { nome: 'Baixista', instrumentoMusico: 'Baixista', tipo: 'iem', formato: 'stereo', canais: ['Baixo', 'Bateria - Kick', 'Bateria - Snare', 'Bateria - Hi-Hat', 'Guitarra Lead', 'Guitarra Rítmica', 'Vocal Principal'], observacoes: 'Mix para baixista' },
          { nome: 'Baterista', instrumentoMusico: 'Baterista', tipo: 'iem', formato: 'stereo', canais: ['Bateria - Kick', 'Bateria - Snare', 'Bateria - Hi-Hat', 'Bateria - Tom 1', 'Bateria - Tom 2', 'Bateria - Overhead Esquerdo', 'Bateria - Overhead Direito', 'Baixo', 'Vocal Principal'], observacoes: 'Mix para baterista' },
          { nome: 'Técnico MON', instrumentoMusico: 'Técnico MON', tipo: 'iem', formato: 'stereo', canais: ['Vocal Principal', 'Vocal Backing', 'Guitarra Lead', 'Guitarra Rítmica', 'Baixo', 'Bateria - Kick', 'Bateria - Snare'], observacoes: 'Mix para técnico MON' }
        ]
      },
      'observacoes-finais': {
        observacoes: 'Rider técnico completo para banda de rock Thunder Road. Todos os equipamentos devem estar em perfeito estado de funcionamento. Requer técnicos especializados para operação. Sistema de backup incluído para equipamentos críticos. Configuração específica para rock com graves reforçados e dinâmica alta. Verificar certificações de segurança para rigging. Coordenar frequências IEM com promotor. Teste de som obrigatório 2 horas antes do evento. Verificar isolamento acústico para evitar feedback. Configurar compressores para vocais e bateria. Sistema de monitorização contínua durante o evento. Backup de energia para equipamentos críticos. Verificar compatibilidade de frequências com outros eventos no local.'
      }
    }

    try {
      const demoRider = {
        id: 'demo_temp_' + Date.now(),
        name: 'Thunder Road - Rider Técnico Completo 2026',
        data: completeDemoData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        thumbnail: {
          artista: 'Thunder Road',
          data: new Date().toLocaleDateString('pt-PT'),
          equipmentCount: 35,
          cardName: 'Thunder Road - Rider Técnico Completo 2026'
        },
        isDemo: true,
        isTemporary: true
      }

      try {
        localStorage.setItem('riderForge_temp_demo', JSON.stringify(demoRider))
      } catch (_) {
        try {
          localStorage.removeItem('riderForge_temp_demo')
          localStorage.setItem('riderForge_temp_demo', JSON.stringify(demoRider))
        } catch (_) {}
      }

      onNavigateToForm(demoRider.id)
    } catch (error) {
      console.error('❌ Erro ao criar rider demo:', error)
      alert('Erro ao criar rider demo. Tente novamente.')
    }
  }

  return (
    <button
      onClick={createCompleteDemoRider}
      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-base sm:text-lg font-bold relative overflow-hidden group w-full max-w-sm px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
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
