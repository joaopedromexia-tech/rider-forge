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
            frequencyResponse: { low: '35', high: '18000', unit: 'Hz' },
            phaseAlignment: true,
            noiseFree: true
          }
        }
      },
      'consolas': {},
      'sistemas-escuta': {
        tipoSistema: 'iem',
        iems: { quantidade: 6, modeloPreferido: 'Shure — P9T', observacoes: 'Sistema IEM profissional', supplier: 'promoter' }
      },
      'equipamento-auxiliar': {},
      'input-list': { inputs: [] },
      'monitor-mixes': { mixes: [] },
      'observacoes-finais': { observacoes: 'Rider técnico de demonstração' }
    }

    console.log('🎯 Tentando salvar rider demo...')

    // Adicionar à lista de riders e abrir para edição
    try {
      const savedRider = saveRider(completeDemoData, 'Thunder Road - Rider Técnico Completo 2026')
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
            anoTour: '2026'
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
