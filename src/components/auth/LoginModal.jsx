import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const LoginModal = ({ isOpen, onClose }) => {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('login') // 'login' ou 'signup'
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
        if (password !== confirmPassword) {
          throw new Error('As passwords não coincidem')
        }
        if (password.length < 6) {
          throw new Error('A password deve ter pelo menos 6 caracteres')
        }
        if (!fullName.trim()) {
          throw new Error('Nome completo é obrigatório')
        }

        const { data, error } = await signUp(email, password, {
          full_name: fullName.trim()
        })

        if (error) throw error

        setSuccess('Conta criada com sucesso! Verifique o seu email para confirmar a conta.')
        // Não fechar o modal para mostrar a mensagem de sucesso
      } else {
        // Login
        const { data, error } = await signIn(email, password)
        if (error) throw error
        
        onClose()
      }
    } catch (error) {
      setError(error.message || 'Erro inesperado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {mode === 'login' ? 'Entrar no Rider Forge' : 'Criar Conta'}
          </h2>
          <p className="text-gray-600">
            {mode === 'login' 
              ? 'Aceda à sua conta para continuar'
              : 'Crie uma conta gratuita para guardar os seus riders'
            }
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
            Entrar
          </button>
          <button
            onClick={() => handleModeChange('signup')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              mode === 'signup'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Criar Conta
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
                Nome Completo
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="O seu nome completo"
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              ? (mode === 'login' ? 'A entrar...' : 'A criar conta...') 
              : (mode === 'login' ? 'Entrar' : 'Criar Conta')
            }
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginModal
