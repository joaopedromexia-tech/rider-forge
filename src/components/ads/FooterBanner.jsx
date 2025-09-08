import React from 'react'
import AdSenseAd from './AdSenseAd'
import { getAdSlot } from '../../config/adsense'

function FooterBanner({ className = '' }) {
  return (
    <div className={`w-full flex justify-center py-4 border-t border-gray-200 ${className}`}>
      <AdSenseAd 
        adSlot={getAdSlot('FOOTER_BANNER')}
        adFormat="auto"
        className="max-w-4xl w-full"
        adStyle={{ 
          display: 'block',
          minHeight: '90px',
          maxHeight: '90px'
        }}
      />
    </div>
  )
}

export default FooterBanner
