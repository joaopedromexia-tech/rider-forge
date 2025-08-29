import React, { useState, useEffect } from 'react'

import { useAuth } from '../../context/AuthContext'
import { useI18n } from '../../context/I18nContext'
import { useFeedback } from '../../hooks/useFeedback'
import { useStripeCheckout } from '../../config/stripe'
import LoadingButton from '../LoadingButton'
import Modal from '../Modal'
import UserMenu from '../UserMenu'

const SubscriptionManagementPage = ({ onBack }) => {
  const { user, isPro, subscription } = useAuth()
  const { redirectToPortal } = useStripeCheckout()
  const { showSuccess, showError } = useFeedback()
  const { t } = useI18n()
  
  const [loading, setLoading] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showPortalModal, setShowPortalModal] = useState(false)

  const handleManageSubscription = async () => {
    if (!subscription?.customer_id) {
      showError('Informações de subscrição não encontradas')
      return
    }

    setLoading(true)
    try {
      await redirectToPortal(subscription.customer_id)
    } catch (error) {
      console.error('Error opening portal:', error)
      showError('Erro ao abrir portal de gestão')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSubscription = () => {
    setShowCancelModal(true)
  }

  const confirmCancelSubscription = async () => {
    setLoading(true)
    try {
      // Redirecionar para o portal do Stripe para cancelamento
      await redirectToPortal(subscription.customer_id)
    } catch (error) {
      console.error('Error canceling subscription:', error)
      showError('Erro ao cancelar subscrição')
    } finally {
      setLoading(false)
      setShowCancelModal(false)
    }
  }

  const formatDate = (dateString) => {
    const dateLocale = locale === 'pt' ? 'pt-PT' : 'en-US'
    return new Date(dateString).toLocaleDateString(dateLocale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-500'
      case 'canceled':
        return 'text-red-500'
      case 'past_due':
        return 'text-yellow-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return t('subscription.status.active')
      case 'canceled':
        return t('subscription.status.canceled')
      case 'past_due':
        return t('subscription.status.pastDue')
      default:
        return t('subscription.status.unknown')
    }
  }

  return (
    <>

      <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={onBack}
                className="btn-secondary flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {t('common.back')}
              </button>
              
              {/* User Menu */}
              <UserMenu />
            </div>
            
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gradient mb-4">
                {t('subscription.title')}
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                {t('subscription.description')}
              </p>
            </div>
          </div>

          {/* Subscription Status Card */}
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-100">{t('subscription.status')}</h2>
              <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(subscription?.status)} bg-opacity-10`}>
                {getStatusText(subscription?.status)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">{t('subscription.plan')}</label>
                  <p className="text-lg font-semibold text-gray-100">Rider Forge Pro</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">{t('subscription.price')}</label>
                  <p className="text-lg font-semibold text-gray-100">$9.99/ano</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">{t('subscription.nextPayment')}</label>
                  <p className="text-lg font-semibold text-gray-100">
                    {subscription?.current_period_end 
                      ? formatDate(subscription.current_period_end)
                      : t('subscription.notAvailable')
                    }
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">{t('subscription.startDate')}</label>
                  <p className="text-lg font-semibold text-gray-100">
                    {subscription?.current_period_start 
                      ? formatDate(subscription.current_period_start)
                      : 'Não disponível'
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">{t('subscription.id')}</label>
                  <p className="text-sm font-mono text-gray-300 break-all">
                    {subscription?.id || 'Não disponível'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">{t('subscription.paymentMethod')}</label>
                  <p className="text-lg font-semibold text-gray-100">
                    {subscription?.payment_method || 'Cartão de Crédito'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="card">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-100 mb-3">{t('subscription.portal')}</h3>
                <p className="text-gray-400 mb-6">
                  {t('subscription.portalDesc')}
                </p>
                <LoadingButton
                  onClick={handleManageSubscription}
                  loading={loading}
                  loadingText="A abrir portal..."
                  className="w-full"
                >
                  {t('subscription.openPortal')}
                </LoadingButton>
              </div>
            </div>

            <div className="card">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-100 mb-3">{t('subscription.cancel')}</h3>
                <p className="text-gray-400 mb-6">
                  {t('subscription.cancelDesc')}
                </p>
                <button
                  onClick={handleCancelSubscription}
                  className="btn-secondary w-full text-red-400 hover:text-red-300 border-red-500/30 hover:border-red-500/50"
                >
                  {t('subscription.cancel')}
                </button>
              </div>
            </div>
          </div>

          {/* Pro Features Reminder */}
          <div className="card bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/30">
            <div className="text-center p-6">
              <h3 className="text-xl font-bold text-gray-100 mb-4">Funcionalidades Pro Ativas</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Riders Ilimitados
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Biblioteca Pro
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  PDF Customizável
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Histórico de Versões
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)}>
        <div className="bg-dark-800 rounded-lg shadow-xl max-w-md w-full border border-dark-700">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-100">
                {t('subscription.cancel')}
              </h3>
            </div>
            
            <p className="text-gray-400 mb-6">
              {t('subscription.cancelWarning')}
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {t('subscription.portalRedirect')}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {t('subscription.reactivate')}
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={confirmCancelSubscription}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                {t('subscription.confirmCancel')}
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default SubscriptionManagementPage
