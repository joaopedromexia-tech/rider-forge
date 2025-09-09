import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useI18n } from '../context/I18nContext'
import { useAuth } from '../context/AuthContext'
import { useRider } from '../context/RiderContext'
import { useProgressiveLoading } from '../hooks/useProgressiveLoading'
import { usePageSEO, SEO_CONFIGS } from '../hooks/useSEO'
import { useScrollToTop } from '../hooks/useScrollToTop'
import DemoButton from './DemoButton'
import ProStatusBadge from './ProStatusBadge'
import LoginModal from './auth/LoginModal'
import ProgressiveContentWrapper from './ProgressiveContentWrapper'
import UserMenu from './UserMenu'
// Header com logo discreto

function HomePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t, locale, setLocale } = useI18n()
  const { user, hasAccount, isPro } = useAuth()
  const { canShowAuthUI, isAuthenticated, needsAccount, isProUser: progressiveIsPro } = useProgressiveLoading()
  const { isPro: riderIsPro } = useRider()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const scrollToTop = useScrollToTop()

  // Detectar idioma baseado na URL
  useEffect(() => {
    console.log('🔍 HomePage: Pathname changed to:', location.pathname, 'Current locale:', locale)
    if (location.pathname === '/pt' || location.pathname === '/pt/') {
      console.log('🔍 HomePage: Setting locale to PT')
      if (locale !== 'pt') setLocale('pt')
    } else {
      console.log('🔍 HomePage: Setting locale to EN (default)')
      if (locale !== 'en') setLocale('en')
      // Forçar reload em desenvolvimento para garantir que funcione
      if (import.meta.env.DEV && locale !== 'en') {
        window.location.reload()
      }
    }
  }, [location.pathname, setLocale, locale])

  // Log quando locale muda
  useEffect(() => {
    console.log('🔍 HomePage: Locale changed to:', locale)
  }, [locale])

  // SEO para página inicial
  usePageSEO(SEO_CONFIGS.home)

  // Use progressive loading state when available, fallback to direct auth state
  const isProUser = canShowAuthUI ? progressiveIsPro : Boolean(isPro || riderIsPro)
  const hasUser = canShowAuthUI ? isAuthenticated : Boolean(user)
  const hasUserAccount = canShowAuthUI ? !needsAccount : Boolean(hasAccount)

  const handleNavigateToForm = (riderId = null) => {
    scrollToTop()
    if (riderId) {
      navigate(`/riders/${riderId}/dados-gerais`)
    } else {
      // Público: permitir criar novo rider sem autenticação
      navigate('/riders/new/dados-gerais')
    }
  }

  const handleNavigateToMyRiders = () => {
    if (!hasUser) {
      setShowLoginModal(true)
      return
    }
    
    if (!hasUserAccount) {
      setShowLoginModal(true)
      return
    }
    
    scrollToTop()
    navigate('/riders')
  }

  const handleNavigateToProSubscription = () => {
    scrollToTop()
    navigate('/pro-subscription')
  }

  const handleNavigateToPricing = () => {
    scrollToTop()
    navigate('/pricing')
  }

  const handleNavigateToFAQ = () => {
    scrollToTop()
    navigate('/faq')
  }

  const handleNavigateToPrivacyTerms = () => {
    scrollToTop()
    navigate('/terms-privacy')
  }

  const handleNavigateToSupport = () => {
    scrollToTop()
    navigate('/support')
  }

  // Articles and guides (static pages for AdSense-friendly content)
  const articles = [
    {
      key: 'howTo',
      href: '/how-to-create-technical-rider.html'
    },
    {
      key: 'stagePlot',
      href: '/stage-plot-generator.html'
    },
    {
      key: 'createTool',
      href: '/create-tech-rider.html'
    },
    {
      key: 'ptRider',
      href: '/pt/rider-tecnico'
    }
  ]

  return (
    <>
      <ProgressiveContentWrapper>
        <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800">
          <header className="sticky top-0 z-40 bg-dark-950/60 backdrop-blur-md border-b border-dark-800/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
              <a href="/" className="flex items-center gap-3 group" aria-label="Rider Forge">
                <img src="/logo.svg" alt="Rider Forge" className="h-8 w-8 drop-shadow" />
                <span className="text-lg font-semibold text-gray-100 group-hover:text-white transition-colors leading-tight">Rider Forge</span>
              </a>
              <div className="flex items-center gap-3">
                <select 
                  value={locale} 
                  onChange={(e) => {
                    const newLocale = e.target.value
                    console.log('🔍 HomePage: Language changed to:', newLocale)
                    setLocale(newLocale)
                    // Navegar para a URL correta baseada no idioma
                    if (newLocale === 'en') {
                      navigate('/')
                    } else {
                      navigate('/pt')
                    }
                  }} 
                  className="px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-gray-200"
                >
                  <option value="pt">PT</option>
                  <option value="en">EN</option>
                </select>
                {hasUser && hasUserAccount && (
                  <UserMenu />
                )}
              </div>
            </div>
          </header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
            {/* Header */}
            <div className="text-center mb-12 sm:mb-16 lg:mb-20 flex flex-col items-center">
              {/* Espaço do header cuida do menu e idioma */}
              
              {/* Marca (logo + texto) */}
              <div className="mb-6 sm:mb-8 flex items-center justify-center gap-4 sm:gap-6">
                <img 
                  src="/logo-mark.svg" 
                  alt="Rider Forge Logo" 
                  className="h-16 sm:h-20 lg:h-24 w-auto drop-shadow-xl filter brightness-110 object-contain"
                  style={{ 
                    display: 'block',
                    visibility: 'visible',
                    opacity: 1
                  }}
                />
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gradient leading-normal pb-2 sm:pb-3">
                  {t('app.title')}
                </h1>
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">{t('app.subtitle')}</p>
              <div className="mt-4 flex items-center justify-center gap-4">
                {/* Auth-dependent content */}
                {!isProUser && (
                  <button 
                    onClick={handleNavigateToPricing}
                    className="transition-transform hover:scale-105"
                  >
                    <ProStatusBadge />
                  </button>
                )}
                {isProUser && (
                  <div className="transition-transform hover:scale-105">
                    <ProStatusBadge />
                  </div>
                )}
              </div>
            </div>
          
          {/* Main Action Buttons */}
          <div className={`grid grid-cols-1 ${import.meta.env.VITE_SHOW_DEMO === 'true' ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6 sm:gap-8 max-w-6xl mx-auto mb-12 sm:mb-16`}>
            {/* Criar Novo Rider */}
            <div className="card hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-accent-blue/20 h-full">
              <div className="text-center p-6 sm:p-8 flex flex-col h-full">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-accent-blue to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-100 mb-3 sm:mb-4">{t('home.createNew.title')}</h3>
                <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base flex-grow">{t('home.createNew.desc')}</p>
                <button
                  onClick={() => {
                    handleNavigateToForm()
                  }}
                  className="btn-primary w-full text-lg py-4 mt-auto"
                >
                  <span>{t('home.createNew.cta')}</span>
                </button>
              </div>
            </div>

            {/* Os Meus Riders */}
            <div className={`card transition-all duration-300 h-full ${
              hasUser && hasUserAccount 
                ? 'hover:scale-105 hover:shadow-2xl hover:shadow-accent-green/20' 
                : 'opacity-80 cursor-pointer hover:scale-102 hover:shadow-xl hover:shadow-yellow-500/10'
            }`}>
              <div className="text-center p-6 sm:p-8 flex flex-col h-full">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg ${
                  hasUser && hasUserAccount 
                    ? 'bg-gradient-to-r from-accent-green to-green-500' 
                    : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                }`}>
                  {hasUser && hasUserAccount ? (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-100 mb-3 sm:mb-4">{t('home.dashboard.title')}</h3>
                <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base flex-grow">
                  {hasUser && hasUserAccount ? t('home.dashboard.desc.hasAccount') : t('home.dashboard.desc.noAccount')}
                </p>
                {hasUser && hasUserAccount ? (
                  <button
                    onClick={handleNavigateToMyRiders}
                    className="btn-secondary w-full text-lg py-4 mt-auto"
                  >
                    <span>{t('home.dashboard.open')}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="w-full text-lg py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 mt-auto"
                  >
                    <span>🔐 {t('common.loginOrSignup')}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Demo */}
            {import.meta.env.VITE_SHOW_DEMO === 'true' && (
              <div className="card hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 h-full">
                <div className="text-center p-6 sm:p-8 flex flex-col h-full">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-100 mb-3 sm:mb-4">{t('home.demo.title')}</h3>
                  <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base flex-grow">{t('home.demo.desc')}</p>
                  <div className="w-full mt-auto">
                    <DemoButton onNavigateToForm={handleNavigateToForm} />
                  </div>
                </div>
              </div>
          )}
        </div>

          {/* Botão de Pricing - Oculto para usuários Pro */}
          {!isProUser && (
            <div className="mt-12 sm:mt-16 mb-8">
              <div className="card bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border-blue-500/30 text-center">
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">{t('home.pricing.title')}</h2>
                  <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed">{t('home.pricing.desc')}</p>
                  <div className="flex justify-center">
                    <button
                      onClick={handleNavigateToPricing}
                      className="btn-primary text-lg px-12 py-4"
                    >
                      <svg className="w-6 h-6 inline mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      {t('home.pricing.cta')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Articles Section - Centered */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
            <section className="flex justify-center">
              <div className="w-full max-w-6xl">
                <div className="mb-10 sm:mb-12 text-center">
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {t('home.articles.title')}
                  </h2>
                  <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                    {t('home.articles.subtitle')}
                  </p>
                </div>

                {/* Enhanced articles grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
                {articles.map((a, index) => {
                    // Define icons and gradients for each article type
                    const getArticleConfig = (key) => {
                      switch (key) {
                        case 'howTo':
                          return {
                            icon: (
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            ),
                            gradient: 'from-blue-500 to-cyan-500',
                            bgGradient: 'from-blue-500/10 to-cyan-500/10',
                            borderColor: 'border-blue-500/30'
                          }
                        case 'stagePlot':
                          return {
                            icon: (
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                            ),
                            gradient: 'from-purple-500 to-pink-500',
                            bgGradient: 'from-purple-500/10 to-pink-500/10',
                            borderColor: 'border-purple-500/30'
                          }
                        case 'createTool':
                          return {
                            icon: (
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            ),
                            gradient: 'from-green-500 to-emerald-500',
                            bgGradient: 'from-green-500/10 to-emerald-500/10',
                            borderColor: 'border-green-500/30'
                          }
                        case 'ptRider':
                          return {
                            icon: (
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                              </svg>
                            ),
                            gradient: 'from-orange-500 to-red-500',
                            bgGradient: 'from-orange-500/10 to-red-500/10',
                            borderColor: 'border-orange-500/30'
                          }
                        default:
                          return {
                            icon: (
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            ),
                            gradient: 'from-gray-500 to-gray-600',
                            bgGradient: 'from-gray-500/10 to-gray-600/10',
                            borderColor: 'border-gray-500/30'
                          }
                      }
                    }

                    const config = getArticleConfig(a.key)

                    return (
                      <a
                        key={a.key}
                        href={a.href}
                        className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${config.bgGradient} border ${config.borderColor} p-6 sm:p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-${config.gradient.split('-')[1]}-500/20`}
                      >
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-5">
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                        </div>
                        
                        {/* Content */}
                        <div className="relative z-10">
                          {/* Icon */}
                          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${config.gradient} mb-4 shadow-lg`}>
                            <div className="text-white">
                              {config.icon}
                            </div>
                          </div>
                          
                          {/* Title */}
                          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-gray-100 transition-colors">
                            {t(`home.articles.items.${a.key}.title`)}
                          </h3>
                          
                          {/* Description */}
                          <p className="text-gray-300 text-sm sm:text-base mb-6 leading-relaxed">
                            {t(`home.articles.items.${a.key}.desc`)}
                          </p>
                          
                          {/* Read more link */}
                          <div className="inline-flex items-center text-blue-400 group-hover:text-blue-300 font-semibold text-sm transition-colors">
                            <span>{t('home.articles.read')}</span>
                            <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </a>
                    )
                  })}
                </div>
              </div>
            </section>
          </div>


          {/* Rich textual content for SEO/AdSense */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
            <article className="prose prose-invert max-w-none">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{t('home.rich.title')}</h2>
              <p className="text-gray-300 mb-4">{t('home.rich.intro')}</p>

              <h3 className="text-xl sm:text-2xl font-semibold text-white mt-8 mb-4">{t('home.rich.whatIs.title')}</h3>
              <p className="text-gray-300 mb-3">{t('home.rich.whatIs.p1')}</p>
              <p className="text-gray-300 mb-3">{t('home.rich.whatIs.p2')}</p>

              <h3 className="text-xl sm:text-2xl font-semibold text-white mt-8 mb-4">{t('home.rich.howHelp.title')}</h3>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>{t('home.rich.howHelp.items.builder')}</li>
                <li>{t('home.rich.howHelp.items.stagePlot')}</li>
                <li>{t('home.rich.howHelp.items.templates')}</li>
                <li>{t('home.rich.howHelp.items.pdf')}</li>
                <li>{t('home.rich.howHelp.items.collab')}</li>
              </ul>

              <h3 className="text-xl sm:text-2xl font-semibold text-white mt-8 mb-4">{t('home.rich.useCases.title')}</h3>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>{t('home.rich.useCases.items.band')}</li>
                <li>{t('home.rich.useCases.items.venue')}</li>
                <li>{t('home.rich.useCases.items.engineer')}</li>
                <li>{t('home.rich.useCases.items.education')}</li>
              </ul>

              <h3 className="text-xl sm:text-2xl font-semibold text-white mt-8 mb-4">{t('home.rich.faq.title')}</h3>
              <details className="rounded-md">
                <summary className="cursor-pointer text-white">{t('home.rich.faq.q1')}</summary>
                <p className="mt-2 text-gray-300">{t('home.rich.faq.a1')}</p>
              </details>
              <details className="mt-3 rounded-md">
                <summary className="cursor-pointer text-white">{t('home.rich.faq.q2')}</summary>
                <p className="mt-2 text-gray-300">{t('home.rich.faq.a2')}</p>
              </details>

              <h3 className="text-xl sm:text-2xl font-semibold text-white mt-8 mb-4">{t('home.rich.related.title')}</h3>
              <ul className="list-disc pl-6 text-gray-300 space-y-1">
                <li><a className="text-blue-400 hover:text-blue-300" href="/stage-plot-creator">{t('home.rich.related.links.stagePlot')}</a></li>
                <li><a className="text-blue-400 hover:text-blue-300" href="/technical-rider-templates.html">{t('home.rich.related.links.templates')}</a></li>
                <li><a className="text-blue-400 hover:text-blue-300" href="/how-to-create-technical-rider.html">{t('home.rich.related.links.howTo')}</a></li>
              </ul>
            </article>
          </div>


          {/* Footer Info */}
          <div className="text-center text-gray-500 text-sm mt-12 sm:mt-16">
            <p className="mb-4">{t('home.footer')}</p>
            
            {/* Footer Links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <button
                onClick={handleNavigateToFAQ}
                className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
              >
                {t('footer.links.faq')}
              </button>
              <button
                onClick={handleNavigateToPrivacyTerms}
                className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
              >
                {t('footer.links.terms')}
              </button>
              <button
                onClick={handleNavigateToSupport}
                className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
              >
                {t('footer.links.support')}
              </button>
            </div>
          </div>
        </div>
      </div>
      </ProgressiveContentWrapper>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        defaultMode="signup"
      />
    </>
  )
}

export default HomePage
