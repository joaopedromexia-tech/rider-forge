import React from 'react'

function StagePlotPlaceholder() {
  return (
    <div className="border border-dark-700 bg-dark-800 rounded-lg p-6 text-gray-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Stage Plot (em preparação)</h3>
        <span className="text-xs text-gray-400">Pré-visualização não interativa</span>
      </div>
      <div className="aspect-[16/9] w-full bg-dark-900 rounded flex items-center justify-center">
        <div className="text-center">
          <p>Canvas de palco com grelha, ícones, drag-and-drop e layers será adicionado.</p>
          <p className="text-gray-500 text-sm mt-2">Para já, manteremos apenas a inclusão opcional no PDF.</p>
        </div>
      </div>
    </div>
  )
}

export default StagePlotPlaceholder


