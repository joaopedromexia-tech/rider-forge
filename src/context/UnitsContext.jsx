import { createContext, useContext, useMemo, useState } from 'react'

const UnitsContext = createContext()

export function UnitsProvider({ children }) {
  const [units, setUnits] = useState({
    distance: 'm', // 'm' | 'ft'
    spl: 'dB',
    frequency: 'Hz'
  })

  const convert = useMemo(() => ({
    mToFt: (m) => (typeof m === 'number' ? m * 3.28084 : m),
    ftToM: (ft) => (typeof ft === 'number' ? ft / 3.28084 : ft)
  }), [])

  const value = { units, setUnits, convert }
  return (
    <UnitsContext.Provider value={value}>
      {children}
    </UnitsContext.Provider>
  )
}

export function useUnits() {
  const ctx = useContext(UnitsContext)
  if (!ctx) throw new Error('useUnits must be used within UnitsProvider')
  return ctx
}


