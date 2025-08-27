import React, { useState } from 'react'
import { useI18n } from '../../context/I18nContext'
import { useAuth } from '../../context/AuthContext'
import Modal from '../Modal'

const LoginModal = ({ isOpen, onClose, defaultMode = 'login' }) => {
  const { signIn, signUp } = useAuth()
  const { t } = useI18n()
  const [mode, setMode] = useState(defaultMode) // 'login' ou 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setFullName('')
    setError(null)
    setSuccess(null)
  }

  // Reset para o modo padrão quando o modal é fechado/aberto
  React.useEffect(() => {
    if (isOpen) {
      setMode(defaultMode)
      resetForm()
    }
  }, [isOpen, defaultMode])

  const handleModeChange = (newMode) => {
    setMode(newMode)
    resetForm()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (mode === 'signup') {
        // Validações para signup
        if (password !== confirmPassword) throw new Error(t('auth.error.passwordMismatch'))
        if (password.length < 6) throw new Error(t('auth.error.passwordMin'))
        if (!fullName.trim()) throw new Error(t('auth.error.fullNameRequired'))

        const { data, error } = await signUp(email, password, {
          full_name: fullName.trim()
        })

        if (error) throw error

        setSuccess(t('auth.success.signup'))
        // Não fechar o modal para mostrar a mensagem de sucesso
      } else {
        // Login
        const { data, error } = await signIn(email, password)
        if (error) throw error
        
        onClose()
      }
    } catch (error) {
      setError(error.message || t('auth.error.unexpected'))
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {mode === 'login' ? t('auth.login.title') : t('auth.signup.title')}
          </h2>
          <p className="text-gray-600">
            {mode === 'login' ? t('auth.login.subtitle') : t('auth.signup.subtitle')}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => handleModeChange('login')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === 'login'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t('auth.login.tab')}
          </button>
          <button
            onClick={() => handleModeChange('signup')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === 'signup'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t('auth.signup.tab')}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.fullName')}
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                placeholder={t('auth.fullName.placeholder')}
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.email')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              placeholder={t('auth.email.placeholder')}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.password')}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.passwordConfirm')}
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading 
              ? (mode === 'login' ? t('auth.login.loading') : t('auth.signup.loading'))
              : (mode === 'login' ? t('auth.login.cta') : t('auth.signup.cta'))
            }
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            {t('common.cancel')}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default LoginModal
