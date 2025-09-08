import React, { useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getClientId } from '../../config/adsense'

function AdSenseAd({ 
  adSlot, 
  adFormat = 'auto', 
  adStyle = { display: 'block' },
  className = '',
  responsive = true 
}) {
  const { isPro } = useAuth()
  const adRef = useRef(null)

  // Don't show ads to Pro users
  if (isPro) return null

  useEffect(() => {
    if (!adSlot || !window.adsbygoogle) return

    try {
      // Create ad element
      const adElement = document.createElement('ins')
      adElement.className = 'adsbygoogle'
      adElement.style.display = 'block'
      adElement.setAttribute('data-ad-client', getClientId())
      adElement.setAttribute('data-ad-slot', adSlot)
      adElement.setAttribute('data-ad-format', adFormat)
      
      if (responsive) {
        adElement.setAttribute('data-full-width-responsive', 'true')
      }

      if (adRef.current) {
        adRef.current.appendChild(adElement)
        
        // Push to adsbygoogle
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (error) {
      console.warn('AdSense ad loading error:', error)
    }
  }, [adSlot, adFormat, responsive])

  return (
    <div 
      ref={adRef}
      className={`adsense-container ${className}`}
      style={adStyle}
    />
  )
}

export default AdSenseAd
