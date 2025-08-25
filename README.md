# Rider Forge V2

Uma aplicação moderna e elegante para criação e gerenciamento de riders técnicos profissionais.

## 🎨 Design System

### Tema Escuro Elegante
- **Fundo**: Gradiente escuro sofisticado (`dark-950` → `dark-900` → `dark-800`)
- **Cartões**: Efeito glassmorphism com backdrop-blur e sombras suaves
- **Cores**: Paleta tech azul/verde para destaques e ações

### Componentes Polidos

#### Botões
- **Primário**: Gradiente azul-verde com animações hover e active
- **Secundário**: Glassmorphism com backdrop-blur
- **Ação**: Versão compacta para ações rápidas
- **Loading**: Estados visuais com spinners animados

#### Cartões
- **Padrão**: Glassmorphism com hover effects
- **Destaque**: Gradiente sutil com bordas coloridas
- **Hover**: Animações scale e translate suaves

#### Tabelas Responsivas
- **Desktop**: Layout completo com todas as colunas
- **Mobile**: Scroll horizontal suave com scrollbar personalizada
- **Hover**: Estados visuais para melhor UX

### Animações e Micro-interações

#### Animações de Entrada
- `fade-in`: Fade suave com translateY
- `slide-in`: Slide de cima para baixo
- `scale-in`: Scale com fade
- `slide-in-right`: Slide da direita

#### Micro-animações
- **Hover**: Scale, translate e shadow transitions
- **Active**: Feedback visual imediato
- **Loading**: Spinners duplos com cores alternadas
- **Feedback**: Toasts com slide-in animations

### Feedback Visual

#### Sistema de Toasts
- **Sucesso**: Verde com ícone de check
- **Erro**: Vermelho com ícone de X
- **Aviso**: Amarelo com ícone de alerta
- **Info**: Azul com ícone de informação

#### Estados de Loading
- **Spinner**: Duplo com cores alternadas
- **Overlay**: Backdrop blur com modal centralizado
- **Botões**: Estados disabled com spinners inline

### Responsividade

#### Breakpoints
- **Mobile**: < 640px - Layout otimizado para touch
- **Tablet**: 640px - 1024px - Botões maiores para touch
- **Desktop**: > 1024px - Layout completo

#### Mobile-First
- **Botões**: Mínimo 48px de altura para touch
- **Espaçamentos**: Generosos para evitar toques acidentais
- **Scroll**: Horizontal suave em tabelas

## 🚀 Funcionalidades

### Core
- ✅ Criação de riders técnicos
- ✅ Edição e atualização
- ✅ Exportação para PDF
- ✅ Sistema de templates
- ✅ Armazenamento local

### Pro Features
- ✅ Riders ilimitados
- ✅ Armazenamento expandido
- ✅ Templates premium
- ✅ Exportação avançada

### UX/UI
- ✅ Feedback visual em todas as ações
- ✅ Animações suaves e elegantes
- ✅ Design responsivo
- ✅ Tema escuro profissional
- ✅ Micro-interações polidas

## 🛠️ Tecnologias

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + CSS Custom Properties
- **Animações**: CSS Keyframes + Tailwind Animations
- **Estado**: React Context + Custom Hooks
- **PDF**: jsPDF + html2canvas
- **Icons**: Heroicons (SVG)

## 📱 Componentes Principais

### Feedback System
```jsx
import { useFeedback } from './hooks/useFeedback'

const { showSuccess, showError, showWarning, showInfo } = useFeedback()

// Uso
showSuccess('Rider salvo com sucesso!')
showError('Erro ao salvar rider')
```

### Loading States
```jsx
import LoadingButton from './components/LoadingButton'
import LoadingOverlay from './components/LoadingOverlay'

// Botão com loading
<LoadingButton loading={isSaving} loadingText="Salvando...">
  Salvar Rider
</LoadingButton>

// Overlay de loading
<LoadingOverlay isVisible={isProcessing} text="Processando..." />
```

### Tabelas Responsivas
```jsx
import ResponsiveTable from './components/ResponsiveTable'

const headers = [
  { key: 'name', label: 'Nome' },
  { key: 'date', label: 'Data' },
  { key: 'actions', label: 'Ações', render: (value, row) => <ActionButtons row={row} /> }
]

<ResponsiveTable headers={headers} data={riders} />
```

## 🎯 Design Principles

### 1. Elegância Minimalista
- Layout limpo sem poluição visual
- Espaçamentos generosos e consistentes
- Tipografia clara e legível

### 2. Feedback Imediato
- Todas as ações têm feedback visual
- Estados de loading claros
- Mensagens de erro/sucesso informativas

### 3. Acessibilidade
- Contraste adequado
- Tamanhos de toque apropriados
- Navegação por teclado

### 4. Performance
- Animações otimizadas (60fps)
- Lazy loading de componentes
- Debounce em inputs

## 🎨 Paleta de Cores

### Cores Principais
- **Azul**: `#3b82f6` (accent-blue)
- **Verde**: `#10b981` (accent-green)
- **Escuro**: `#020617` (dark-950)

### Gradientes
- **Primário**: `from-accent-blue via-blue-500 to-accent-green`
- **Texto**: `from-accent-blue via-blue-400 to-accent-green`

### Estados
- **Sucesso**: `#22c55e`
- **Erro**: `#ef4444`
- **Aviso**: `#f59e0b`

## 📦 Instalação

```bash
npm install
npm run dev
```

## 🎯 Roadmap

- [ ] Temas personalizáveis
- [ ] Animações mais avançadas
- [ ] Componentes de gráficos
- [ ] Integração com APIs
- [ ] PWA capabilities

---

Desenvolvido com ❤️ para profissionais de áudio
