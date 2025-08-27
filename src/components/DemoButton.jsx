import { useRider } from '../context/RiderContext'



function DemoButton({ onNavigateToForm }) {
  const { saveRider } = useRider()

  const createCompleteDemoRider = async () => {
    // Converter imagens públicas em base64 (para compatibilidade com validadores)
    const loadImageAsBase64 = async (imagePath) => {
      try {
        const res = await fetch(imagePath)
        const blob = await res.blob()
        return await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
      } catch {
        // Pixel em branco
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
      }
    }

    const capaBase64 = await loadImageAsBase64('/images/capa_demo.png')
    const stageBase64 = await loadImageAsBase64('/images/stageplot_demo.png')

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
          data: capaBase64,
          type: 'image/png',
          name: 'capa_demo.png',
          size: capaBase64.length
        },
        stagePlot: {
          data: stageBase64,
          type: 'image/png',
          name: 'stageplot_demo.png',
          size: stageBase64.length
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
          novaConsola: { marca: '', modelo: '', observacoes: '', supplier: 'promoter' }
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
          novaConsola: { marca: '', modelo: '', observacoes: '', supplier: 'promoter' }
        }
      },
      'sistemas-escuta': {
        tipoSistema: 'iem',
        iems: { quantidade: 6, modeloPreferido: 'Shure — P9T', observacoes: 'Sistema IEM profissional para banda de 5 músicos + 1 técnico', supplier: 'promoter' },
        wedges: { quantidade: 4, modelo: 'Meyer Sound — UPA-1P', observacoes: 'Wedges de backup', supplier: 'promoter' },
        sideFills: { quantidade: 2, modelo: 'Meyer Sound — UPA-1P', observacoes: 'Cobertura lateral', supplier: 'promoter' },
        subs: [ { id: Date.now() + 100, quantidade: 1, modelo: 'Meyer Sound — 1100-LFC', paraInstrumento: 'Baterista', observacoes: 'Graves reforçados', supplier: 'promoter' } ],
        observacoes: 'Sistema IEM com 6 canais UHF.'
      },
      'equipamento-auxiliar': {
        talkbacks: { quantidade: 4, modelo: 'Clear-Com — Eclipse HX', observacoes: 'Comunicação entre técnicos', supplier: 'promoter' },
        intercom: { quantidade: 6, modelo: 'Clear-Com — Eclipse HX', observacoes: 'Intercom de palco', supplier: 'promoter' },
        comunicacaoFohMon: { tipo: 'Cabo dedicado', observacoes: 'Comunicação via XLR', supplier: 'promoter' },
        observacoes: 'Verificar cabos antes do evento.'
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
          { nome: 'Guitarrista Lead', instrumentoMusico: 'Guitarrista Lead', tipo: 'iem', formato: 'stereo', canais: ['Guitarra Lead', 'Guitarra Rítmica', 'Baixo', 'Bateria - Kick', 'Bateria - Snare', 'Bateria - Hi-Hat', 'Vocal Principal'], observacoes: 'Mix para guitarrista lead' }
        ]
      },
      'observacoes-finais': {
        observacoes: 'Rider técnico completo para banda de rock Thunder Road...'
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
          data: new Date().toISOString(),
          equipmentCount: 35,
          cardName: 'Thunder Road - Rider Técnico Completo 2026'
        },
        isDemo: true,
        isTemporary: true
      }

      // Guardar em memória global e também localStorage (best effort)
      try { window.__riderForge_demo = demoRider } catch (_) {}
      try { localStorage.setItem('riderForge_temp_demo', JSON.stringify(demoRider)) } catch (_) {}

      // Navegar
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
