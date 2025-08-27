import React, { useEffect, useMemo, useRef, useState } from 'react'
import Modal from './Modal'

// Editor simples com SVG: grelha, paleta básica e arrastar/soltar
// Guarda layout JSON e exporta PNG (dataURL) para inclusão no PDF

const PALETTE = [
  { id: 'mic', label: 'Mic', color: '#60A5FA', w: 24, h: 24, shape: 'circle' },
  { id: 'wedge', label: 'Wedge', color: '#34D399', w: 40, h: 26, shape: 'rect' },
  { id: 'amp', label: 'Amp', color: '#F59E0B', w: 36, h: 28, shape: 'rect' },
  { id: 'drum', label: 'Drums', color: '#EF4444', w: 48, h: 36, shape: 'rect' },
  { id: 'keys', label: 'Keys', color: '#A78BFA', w: 46, h: 30, shape: 'rect' },
]

const GRID_SIZE = 20
const STAGE_W = 900
const STAGE_H = 500

function StagePlotEditor({ initialLayout = null, onClose, onSave }) {
  const [items, setItems] = useState(() => Array.isArray(initialLayout?.items) ? initialLayout.items : [])
  const [selectedId, setSelectedId] = useState(null)
  const svgRef = useRef(null)

  const handleDropFromPalette = (paletteItem) => {
    const newItem = {
      id: Date.now() + '_' + Math.random().toString(36).slice(2),
      type: paletteItem.id,
      x: Math.round((STAGE_W / 2) / GRID_SIZE) * GRID_SIZE,
      y: Math.round((STAGE_H / 2) / GRID_SIZE) * GRID_SIZE,
      rotation: 0,
      w: paletteItem.w,
      h: paletteItem.h,
      color: paletteItem.color,
      shape: paletteItem.shape,
      label: paletteItem.label
    }
    setItems(prev => [...prev, newItem])
  }

  const startDrag = (id, e) => {
    e.preventDefault()
    const startX = e.clientX
    const startY = e.clientY
    setSelectedId(id)
    const itemIndex = items.findIndex(i => i.id === id)
    if (itemIndex < 0) return
    const startItem = items[itemIndex]
    const onMove = (ev) => {
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY
      setItems(prev => prev.map((it, idx) => idx === itemIndex ? {
        ...it,
        x: snap(it.x + dx),
        y: snap(it.y + dy)
      } : it))
    }
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const snap = (v) => Math.max(0, Math.min(Math.round(v / GRID_SIZE) * GRID_SIZE, v === STAGE_W ? STAGE_W : v === STAGE_H ? STAGE_H : 10000))

  const rotateSelected = (delta) => {
    if (!selectedId) return
    setItems(prev => prev.map(it => it.id === selectedId ? { ...it, rotation: (it.rotation + delta + 360) % 360 } : it))
  }

  const deleteSelected = () => {
    if (!selectedId) return
    setItems(prev => prev.filter(it => it.id !== selectedId))
    setSelectedId(null)
  }

  const exportPNG = async () => {
    // Serializar SVG e desenhar num canvas para exportar PNG
    try {
      const svgEl = svgRef.current
      if (!svgEl) return null
      const serializer = new XMLSerializer()
      const svgString = serializer.serializeToString(svgEl)
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(svgBlob)
      const img = new Image()
      const dataUrl = await new Promise((resolve, reject) => {
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas')
            canvas.width = STAGE_W
            canvas.height = STAGE_H
            const ctx = canvas.getContext('2d')
            ctx.fillStyle = '#111827' // fundo escuro para contraste
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, 0, 0)
            resolve(canvas.toDataURL('image/png'))
          } catch (e) { reject(e) }
        }
        img.onerror = reject
        img.src = url
      })
      URL.revokeObjectURL(url)
      return dataUrl
    } catch (e) {
      return null
    }
  }

  const handleSave = async () => {
    const png = await exportPNG()
    const layout = { items }
    onSave && onSave({ png, layout })
  }

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="bg-dark-800 border border-dark-700 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-dark-700 flex items-center justify-between">
          <h3 className="text-gray-100 font-semibold">Stage Plot (beta)</h3>
          <div className="flex items-center gap-2">
            <button onClick={() => rotateSelected(-15)} className="px-2 py-1 bg-dark-700 text-gray-200 rounded">↺</button>
            <button onClick={() => rotateSelected(15)} className="px-2 py-1 bg-dark-700 text-gray-200 rounded">↻</button>
            <button onClick={deleteSelected} className="px-2 py-1 bg-red-600 text-white rounded">Apagar</button>
            <button onClick={onClose} className="px-3 py-1 bg-dark-700 text-gray-200 rounded">Fechar</button>
            <button onClick={handleSave} className="px-3 py-1 bg-accent-blue text-white rounded">Guardar</button>
          </div>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="w-48 border-r border-dark-700 p-3 space-y-2 bg-dark-900">
            <p className="text-xs text-gray-400 mb-2">Paleta</p>
            {PALETTE.map(p => (
              <button
                key={p.id}
                onClick={() => handleDropFromPalette(p)}
                className="w-full text-left px-2 py-2 bg-dark-800 hover:bg-dark-700 text-gray-200 rounded border border-dark-700"
              >{p.label}</button>
            ))}
          </div>
          <div className="flex-1 bg-dark-900 flex items-center justify-center">
            <svg ref={svgRef} width={STAGE_W} height={STAGE_H} viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}>
              {/* Grelha */}
              <defs>
                <pattern id="grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
                  <path d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`} fill="none" stroke="#374151" strokeWidth="1" />
                </pattern>
              </defs>
              <rect x="0" y="0" width={STAGE_W} height={STAGE_H} fill="#111827" />
              <rect x="0" y="0" width={STAGE_W} height={STAGE_H} fill="url(#grid)" />

              {/* Itens */}
              {items.map((it) => (
                <g key={it.id} transform={`translate(${it.x}, ${it.y}) rotate(${it.rotation})`}>
                  {it.shape === 'circle' ? (
                    <circle cx="0" cy="0" r={Math.max(it.w, it.h) / 2} fill={it.color} stroke={selectedId === it.id ? '#FFFFFF' : '#000000'} strokeWidth={selectedId === it.id ? 3 : 1} onMouseDown={(e) => startDrag(it.id, e)} onClick={() => setSelectedId(it.id)} />
                  ) : (
                    <rect x={-it.w / 2} y={-it.h / 2} width={it.w} height={it.h} rx="4" fill={it.color} stroke={selectedId === it.id ? '#FFFFFF' : '#000000'} strokeWidth={selectedId === it.id ? 3 : 1} onMouseDown={(e) => startDrag(it.id, e)} onClick={() => setSelectedId(it.id)} />
                  )}
                  <text x="0" y={it.shape === 'circle' ? (Math.max(it.w, it.h) / 2 + 14) : (it.h / 2 + 14)} textAnchor="middle" fontSize="12" fill="#E5E7EB">{it.label}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>
        <div className="p-3 border-t border-dark-700 text-xs text-gray-400">
          Dica: clique num item para selecionar. Use ↺/↻ para rodar. Arraste para mover. Guardar exporta PNG e layout JSON.
        </div>
      </div>
    </Modal>
  )
}

export default StagePlotEditor


