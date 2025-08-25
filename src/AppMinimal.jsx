import React from 'react'

const AppMinimal = () => {
  console.log('AppMinimal component rendering...')
  
  return React.createElement('div', {
    style: {
      minHeight: '100vh',
      backgroundColor: 'purple',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      fontFamily: 'Arial, sans-serif',
      flexDirection: 'column'
    }
  }, [
    React.createElement('h1', { key: 'title' }, 'React Funcionando!'),
    React.createElement('p', { key: 'desc' }, 'Se vê isto, o React está a funcionar.'),
    React.createElement('p', { key: 'time' }, `Hora: ${new Date().toLocaleString()}`),
    React.createElement('p', { key: 'env' }, `Node Env: ${import.meta.env.MODE}`),
    React.createElement('p', { key: 'base' }, `Base URL: ${import.meta.env.BASE_URL}`)
  ])
}

export default AppMinimal
