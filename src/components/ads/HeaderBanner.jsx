import React from 'react'
import AdSenseAd from './AdSenseAd'
import { getAdSlot } from '../../config/adsense'

function HeaderBanner({ className = '' }) {
  return (
    <div className={`w-full flex justify-center py-2 ${className}`}>
      <AdSenseAd 
        adSlot={getAdSlot('HEADER_BANNER')}
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

export default HeaderBanner
