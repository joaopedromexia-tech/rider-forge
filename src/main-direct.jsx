console.log('main-direct.jsx starting...')

// Test if React is available
try {
  const React = await import('react')
  console.log('React imported successfully:', typeof React)
  
  const { createRoot } = await import('react-dom/client')
  console.log('createRoot imported successfully:', typeof createRoot)
  
  // Create a simple element
  const element = React.createElement('div', {
    style: {
      backgroundColor: 'red',
      color: 'white',
      padding: '50px',
      textAlign: 'center',
      fontSize: '24px'
    }
  }, 'React está funcionando!')
  
  const root = createRoot(document.getElementById('root'))
  root.render(element)
  console.log('React element rendered successfully')
  
} catch (error) {
  console.error('Error loading React:', error)
  // Fallback to basic JavaScript
  document.body.style.backgroundColor = 'yellow'
  document.body.innerHTML = '<h1 style="color: black; text-align: center; padding: 50px;">Erro ao carregar React: ' + error.message + '</h1>'
}

console.log('main-direct.jsx completed!')
