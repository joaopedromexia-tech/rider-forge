import React from 'react'

const AppTest = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#1e90ff', 
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
      </div>
    </div>
  )
}

export default AppTest
