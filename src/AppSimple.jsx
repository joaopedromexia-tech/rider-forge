import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const SimpleDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Rider Forge</h1>
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Dashboard Simples</h2>
          <p className="text-gray-300 mb-4">
            A aplicação está funcionando! O React está carregado corretamente.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-600 p-4 rounded">
              <h3 className="font-semibold">Status</h3>
              <p>✅ React funcionando</p>
              <p>✅ Router funcionando</p>
              <p>✅ CSS funcionando</p>
            </div>
            <div className="bg-green-600 p-4 rounded">
              <h3 className="font-semibold">Próximos Passos</h3>
              <p>🔧 Configurar Supabase</p>
              <p>💳 Configurar Stripe</p>
              <p>🚀 Deploy completo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const AppSimple = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SimpleDashboard />} />
        <Route path="/dashboard" element={<SimpleDashboard />} />
        <Route path="*" element={<SimpleDashboard />} />
      </Routes>
    </Router>
  )
}

export default AppSimple
