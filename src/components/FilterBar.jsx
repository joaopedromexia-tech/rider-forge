import { useState, useEffect } from 'react'
import { useI18n } from '../context/I18nContext'
import { getBrands } from '../data/equipmentLibrary'

function FilterBar({
  isPro = false,
  onFiltersChange,
  className = ''
}) {
  const { t } = useI18n()
  const [brandFilter, setBrandFilter] = useState('')
  const [modelQuery, setModelQuery] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const brands = getBrands(isPro)

  // Detectar se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Notificar mudanças nos filtros
  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange({
        brandFilter,
        modelQuery
      })
    }
  }, [brandFilter, modelQuery, onFiltersChange])

  const clearFilters = () => {
    setBrandFilter('')
    setModelQuery('')
  }

  const hasActiveFilters = brandFilter || modelQuery

  // Versão Desktop
  if (!isMobile) {
    return (
      <div className={`bg-dark-800 rounded-lg p-4 border border-dark-700 ${className}`}>
        <div className="flex items-center gap-4">
          {/* Filtro por Marca */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {t('filter.brand')}
            </label>
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
            >
              <option value="">{t('filter.allBrands')}</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* Pesquisa por Modelo */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {t('filter.model')}
            </label>
            <input
              type="text"
              value={modelQuery}
              onChange={(e) => setModelQuery(e.target.value)}
              placeholder={t('filter.searchModel')}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
            />
          </div>

          {/* Botão Limpar Filtros */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className={`
                px-4 py-2 rounded text-sm font-medium transition-colors duration-200
                ${hasActiveFilters 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-dark-700 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {t('filter.clear')}
            </button>
          </div>
        </div>

        {/* Indicador de Filtros Ativos */}
        {hasActiveFilters && (
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
            <span>{t('filter.activeFilters')}:</span>
            {brandFilter && (
              <span className="px-2 py-1 bg-accent-blue/20 text-accent-blue rounded">
                {t('filter.brand')}: {brandFilter}
              </span>
            )}
            {modelQuery && (
              <span className="px-2 py-1 bg-accent-green/20 text-accent-green rounded">
                {t('filter.model')}: {modelQuery}
              </span>
            )}
          </div>
        )}
      </div>
    )
  }

  // Versão Mobile
  return (
    <div className={`${className}`}>
      {/* Botão para abrir filtros */}
      <button
        onClick={() => setShowMobileFilters(!showMobileFilters)}
        className="w-full bg-dark-800 rounded-lg p-3 border border-dark-700 flex items-center justify-between text-gray-100 hover:bg-dark-700 transition-colors duration-200"
      >
        <span className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          {t('filter.filters')}
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-accent-blue rounded-full"></span>
          )}
        </span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${
            showMobileFilters ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Painel de Filtros Mobile */}
      {showMobileFilters && (
        <div className="mt-2 bg-dark-800 rounded-lg p-4 border border-dark-700">
          <div className="space-y-4">
            {/* Filtro por Marca */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {t('filter.brand')}
              </label>
              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
              >
                <option value="">{t('filter.allBrands')}</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Pesquisa por Modelo */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {t('filter.model')}
              </label>
              <input
                type="text"
                value={modelQuery}
                onChange={(e) => setModelQuery(e.target.value)}
                placeholder={t('filter.searchModel')}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
              />
            </div>

            {/* Botão Limpar Filtros */}
            <button
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className={`
                w-full px-4 py-2 rounded text-sm font-medium transition-colors duration-200
                ${hasActiveFilters 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-dark-700 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {t('filter.clear')}
            </button>

            {/* Indicador de Filtros Ativos */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                <span>{t('filter.activeFilters')}:</span>
                {brandFilter && (
                  <span className="px-2 py-1 bg-accent-blue/20 text-accent-blue rounded">
                    {t('filter.brand')}: {brandFilter}
                  </span>
                )}
                {modelQuery && (
                  <span className="px-2 py-1 bg-accent-green/20 text-accent-green rounded">
                    {t('filter.model')}: {modelQuery}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterBar
