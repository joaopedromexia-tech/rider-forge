import React from 'react'

const AppMinimal = () => {
  return React.createElement('div', {
    style: {
      minHeight: '100vh',
      backgroundColor: 'purple',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      fontFamily: 'Arial, sans-serif'
    }
  }, [
    React.createElement('h1', { key: 'title' }, 'React Funcionando!'),
    React.createElement('p', { key: 'desc' }, 'Se vê isto, o React está a funcionar.'),
    React.createElement('p', { key: 'time' }, `Hora: ${new Date().toLocaleString()}`)
  ])
}

export default AppMinimal
