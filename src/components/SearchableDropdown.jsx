import { useState, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { CATEGORY_ICONS } from '../data/equipmentLibrary'
import { useEquipment } from '../context/EquipmentContext'
import ProStatusBadge from './ProStatusBadge'

function SearchableDropdown({
  options = [],
  value = '',
  onChange,
  placeholder = 'Selecionar opção...',
  searchPlaceholder = 'Pesquisar...',
  disabled = false,
  className = '',
  maxHeight = '200px'
}) {
  const { isPro } = useEquipment()
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 320, openUp: false })
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)
  const buttonRef = useRef(null)

  // Filtrar opções baseado no termo de pesquisa
  const filteredOptions = useMemo(() => {
    return options.filter(option => {
      if (!searchTerm) return true
      
      const searchLower = searchTerm.toLowerCase()
      return (
        option.marca?.toLowerCase().includes(searchLower) ||
        option.modelo?.toLowerCase().includes(searchLower) ||
        option.categoria?.toLowerCase().includes(searchLower) ||
        option.notas?.toLowerCase().includes(searchLower)
      )
    })
  }, [options, searchTerm])

  // Calcular posição do dropdown com detecção de bordas
  const updateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
      
      // Calcular dimensões estimadas do dropdown
      const dropdownHeight = Math.min(filteredOptions.length * 48 + 60, 240) // altura estimada
      const dropdownWidth = Math.max(rect.width, 320)
      
      // Verificar se há espaço suficiente abaixo
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      const openUp = spaceBelow < dropdownHeight && spaceAbove > dropdownHeight
      
      // Calcular posição horizontal (evitar sair da tela)
      let left = rect.left + scrollLeft
      if (left + dropdownWidth > window.innerWidth) {
        left = window.innerWidth - dropdownWidth - 10
      }
      if (left < 10) {
        left = 10
      }
      
      // Calcular posição vertical
      let top
      if (openUp) {
        top = rect.top + scrollTop - dropdownHeight
      } else {
        top = rect.bottom + scrollTop
      }
      
      setDropdownPosition({
        top,
        left,
        width: dropdownWidth,
        openUp
      })
    }
  }

  // Resetar índice destacado quando a pesquisa muda
  useEffect(() => {
    setHighlightedIndex(-1)
  }, [searchTerm])

  // Atualizar posição quando dropdown abre
  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition()
      // Recalcular posição em caso de scroll
      const handleScroll = () => {
        if (isOpen) {
          updateDropdownPosition()
        }
      }
      window.addEventListener('scroll', handleScroll, true)
      window.addEventListener('resize', handleScroll)
      
      return () => {
        window.removeEventListener('scroll', handleScroll, true)
        window.removeEventListener('resize', handleScroll)
      }
    }
  }, [isOpen, filteredOptions.length])

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchTerm('')
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Navegação com teclado
  const handleKeyDown = (e) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          const option = filteredOptions[highlightedIndex]
          // Só permitir seleção se for Pro ou se a opção não for Pro
          if (isPro || !option.isPro) {
            handleSelect(option)
          }
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSearchTerm('')
        setHighlightedIndex(-1)
        break
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, highlightedIndex, filteredOptions, isPro])

  const handleSelect = (option) => {
    // Só permitir seleção se for Pro ou se a opção não for Pro
    if (isPro || !option.isPro) {
      onChange(option)
      setIsOpen(false)
      setSearchTerm('')
      setHighlightedIndex(-1)
    }
  }

  const handleToggle = () => {
    if (disabled) return
    setIsOpen(!isOpen)
    if (!isOpen) {
      setSearchTerm('')
      setHighlightedIndex(-1)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setHighlightedIndex(-1)
  }

  const getDisplayValue = () => {
    if (value && options.includes(value)) {
      return value
    }
    return ''
  }

  // Encontrar a opção selecionada
  const selectedOption = options.find(option => {
    // Se value é um objeto, comparar diretamente
    if (typeof value === 'object' && value !== null) {
      return option === value
    }
    // Se value é uma string, comparar com marca + modelo
    if (typeof value === 'string') {
      const optionString = `${option.marca} ${option.modelo}`
      const optionStringDash = `${option.marca} — ${option.modelo}`
      return optionString === value || optionStringDash === value
    }
    return false
  })

  // Renderizar dropdown usando portal
  const renderDropdown = () => {
    if (!isOpen) return null

    return createPortal(
      <div 
        ref={dropdownRef}
        className="searchable-dropdown-menu"
        style={{
          position: 'absolute',
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
          width: `${dropdownPosition.width}px`,
          zIndex: 9999
        }}
      >
        {/* Campo de Pesquisa */}
        <div className="p-2 border-b border-dark-600">
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={searchPlaceholder}
            className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
          />
        </div>

        {/* Lista de Opções */}
        <div className="max-h-48 overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-gray-400 text-sm">
              Nenhum resultado encontrado
            </div>
          ) : (
            filteredOptions.map((option, index) => {
              const isHighlighted = index === highlightedIndex
              const isSelected = selectedOption && 
                option === selectedOption
              const isProOption = option.isPro && !isPro
              
              return (
                <button
                  key={`${option.marca}-${option.modelo}-${option.categoria}-${index}`}
                  type="button"
                  onClick={() => handleSelect(option)}
                  disabled={isProOption}
                  className={`
                    searchable-dropdown-option
                    ${isHighlighted ? 'highlighted' : ''}
                    ${isSelected ? 'selected' : ''}
                    ${isProOption ? 'pro-locked' : ''}
                  `}
                >
                  <span className="text-lg flex-shrink-0 mt-0.5">{CATEGORY_ICONS[option.categoria]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`searchable-dropdown-text ${isProOption ? 'text-gray-500' : ''}`}>
                        {option.marca} — {option.modelo}
                      </span>
                      {isProOption && (
                        <ProStatusBadge variant="lock" />
                      )}
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>,
      document.body
    )
  }

  return (
    <>
      <div className={`searchable-dropdown ${className}`}>
        {/* Botão do Dropdown */}
        <button
          ref={buttonRef}
          type="button"
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={`
            w-full px-3 py-2 text-left bg-dark-700 border border-dark-600 rounded-md
            focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent
            transition-colors duration-200
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-dark-600 cursor-pointer'}
            ${isOpen ? 'ring-2 ring-accent-blue border-transparent' : ''}
          `}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {selectedOption && (
                <span className="text-lg flex-shrink-0">{CATEGORY_ICONS[selectedOption.categoria]}</span>
              )}
              <span className={`truncate ${selectedOption ? 'text-gray-100' : 'text-gray-400'}`}>
                {selectedOption ? `${selectedOption.marca} — ${selectedOption.modelo}` : placeholder}
              </span>
              {selectedOption?.isPro && !isPro && (
                <ProStatusBadge variant="lock" />
              )}
            </div>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                isOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
      </div>
      {renderDropdown()}
    </>
  )
}

export default SearchableDropdown
