import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useI18n } from '../context/I18nContext'
import { useScrollToTop } from '../hooks/useScrollToTop'
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline'

// Mapeamento de rotas para breadcrumbs
const routeBreadcrumbs = {
  '/': {
    label: 'breadcrumbs.home',
    icon: HomeIcon
  },
  '/riders': {
    label: 'breadcrumbs.riders',
    icon: null
  },
  '/riders/new': {
    label: 'breadcrumbs.newRider',
    icon: null
  },
  '/pricing': {
    label: 'breadcrumbs.pricing',
    icon: null
  },
  '/pro-subscription': {
    label: 'breadcrumbs.proSubscription',
    icon: null
  },
  '/subscription-management': {
    label: 'breadcrumbs.subscriptionManagement',
    icon: null
  },
  '/support': {
    label: 'breadcrumbs.support',
    icon: null
  },
  '/terms-privacy': {
    label: 'breadcrumbs.termsPrivacy',
    icon: null
  },
  '/faq': {
    label: 'breadcrumbs.faq',
    icon: null
  }
}

// Mapeamento de tabs para breadcrumbs
const tabBreadcrumbs = {
  'dados-gerais': 'breadcrumbs.tabs.general',
  'pa': 'breadcrumbs.tabs.pa',
  'consolas': 'breadcrumbs.tabs.consoles',
  'sistemas-escuta': 'breadcrumbs.tabs.listenSystems',
  'equipamento-auxiliar': 'breadcrumbs.tabs.auxEquip',
  'input-list': 'breadcrumbs.tabs.inputList',
  'monitor-mixes': 'breadcrumbs.tabs.monitorMixes',
  'observacoes-finais': 'breadcrumbs.tabs.finalNotes'
}

function Breadcrumbs() {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useI18n()
  const scrollToTop = useScrollToTop()
  
  // Gerar breadcrumbs baseado na localização atual
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    const breadcrumbs = []
    
    // Sempre adicionar home como primeiro item
    breadcrumbs.push({
      path: '/',
      label: t('breadcrumbs.home'),
      icon: HomeIcon,
      isActive: pathSegments.length === 0
    })
    
    let currentPath = ''
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      
      // Verificar se é uma rota conhecida
      if (routeBreadcrumbs[currentPath]) {
        breadcrumbs.push({
          path: currentPath,
          label: t(routeBreadcrumbs[currentPath].label),
          icon: routeBreadcrumbs[currentPath].icon,
          isActive: index === pathSegments.length - 1
        })
      } else if (segment === 'new' && pathSegments[index - 1] === 'riders') {
        // Caso especial para /riders/new
        breadcrumbs.push({
          path: currentPath,
          label: t('breadcrumbs.newRider'),
          icon: null,
          isActive: index === pathSegments.length - 1
        })
      } else if (pathSegments[index - 1] === 'riders' && segment !== 'new') {
        // Caso especial para /riders/:id
        breadcrumbs.push({
          path: currentPath,
          label: t('breadcrumbs.rider', { id: segment }),
          icon: null,
          isActive: index === pathSegments.length - 1
        })
      } else if (pathSegments[index - 2] === 'riders' && tabBreadcrumbs[segment]) {
        // Caso especial para tabs de rider
        breadcrumbs.push({
          path: currentPath,
          label: t(tabBreadcrumbs[segment]),
          icon: null,
          isActive: index === pathSegments.length - 1
        })
      } else if (segment === 'pdf' && pathSegments[index - 2] === 'riders') {
        // Caso especial para PDF
        breadcrumbs.push({
          path: currentPath,
          label: t('breadcrumbs.pdf'),
          icon: null,
          isActive: index === pathSegments.length - 1
        })
      }
    })
    
    return breadcrumbs
  }
  
  const breadcrumbs = generateBreadcrumbs()
  
  // Não mostrar breadcrumbs se só tivermos home
  if (breadcrumbs.length <= 1) {
    return null
  }
  
  const handleBreadcrumbClick = (path) => {
    scrollToTop()
    navigate(path)
  }
  
  return (
    <nav 
      className="flex items-center space-x-1 text-xs text-gray-400 mb-2 px-2"
      aria-label={t('breadcrumbs.navigation')}
    >
      <ol className="flex items-center space-x-1">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path} className="flex items-center">
            <button
              onClick={() => handleBreadcrumbClick(breadcrumb.path)}
              className={`flex items-center space-x-1 px-1 py-0.5 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                breadcrumb.isActive 
                  ? 'text-gray-300 font-medium' 
                  : 'text-gray-500 hover:text-gray-300 hover:bg-dark-800/50'
              }`}
              disabled={breadcrumb.isActive}
              aria-current={breadcrumb.isActive ? 'page' : undefined}
              aria-label={breadcrumb.isActive ? `${breadcrumb.label} (página atual)` : `Navegar para ${breadcrumb.label}`}
            >
              {breadcrumb.icon && (
                <breadcrumb.icon className="w-3 h-3" aria-hidden="true" />
              )}
              <span className="truncate max-w-24 sm:max-w-32">
                {breadcrumb.label}
              </span>
            </button>
            
            {index < breadcrumbs.length - 1 && (
              <ChevronRightIcon 
                className="w-3 h-3 text-gray-600 flex-shrink-0 mx-1" 
                aria-hidden="true"
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
