import React from 'react'

function LogoMark() {
  return (
    <a
      href="/"
      aria-label="Rider Forge"
      className="fixed left-3 bottom-3 sm:left-4 sm:bottom-4 z-50 opacity-60 hover:opacity-100 transition-opacity"
      style={{ backdropFilter: 'blur(6px)' }}
    >
      <div className="flex items-center gap-2 bg-dark-900/50 border border-dark-800/60 rounded-xl px-2.5 py-1.5 shadow-glow-blue">
        <img src="/logo.svg" alt="Rider Forge" className="h-6 w-6" loading="lazy" />
        <span className="hidden sm:inline text-sm font-semibold text-gray-200 leading-none">Rider Forge</span>
      </div>
    </a>
  )
}

export default LogoMark


