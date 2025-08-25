import React, { useEffect } from 'react'

const AppTest = () => {
  useEffect(() => {
    console.log('AppTest component mounted!')
    console.log('Current time:', new Date().toLocaleString())
  }, [])

  console.log('AppTest component rendering...')

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#ff0000', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: 'white',
      fontSize: '24px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div>
        <h1>Rider Forge - Teste</h1>
        <p>Se vê isto, o React está funcionando!</p>
        <p>Timestamp: {new Date().toLocaleString()}</p>
        <p>Background: Vermelho</p>
      </div>
    </div>
  )
}

export default AppTest
