import React from 'react'

// PDF Generator utility with dynamic imports
// This file contains the heavy PDF generation logic that will be loaded only when needed

export const generatePDFBlob = async (riderData, locale) => {
  // Dynamically import heavy PDF libraries
  const [{ pdf }, { default: RiderPDF }] = await Promise.all([
    import('@react-pdf/renderer'),
    import('../pdf/RiderPDF')
  ])

  // Create PDF instance using React.createElement instead of JSX
  const instance = pdf(
    React.createElement(RiderPDF, {
      rider: riderData,
      language: locale,
      proBranding: {},
      options: {}
    })
  )
  
  // Generate and return blob
  return await instance.toBlob()
}

// Export other PDF utilities that might be needed
export const generatePDFUrl = async (riderData, locale) => {
  const blob = await generatePDFBlob(riderData, locale)
  return URL.createObjectURL(blob)
}

export const downloadPDF = async (riderData, locale, filename = 'rider.pdf') => {
  const blob = await generatePDFBlob(riderData, locale)
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Clean up
  URL.revokeObjectURL(url)
}
