import React from 'react'
import AdSenseAd from './AdSenseAd'
import { getAdSlot } from '../../config/adsense'

function HeaderBanner({ className = '' }) {
  return (
    <div className={`w-full flex justify-center py-1 ${className}`}>
      <AdSenseAd 
        adSlot={getAdSlot('HEADER_BANNER')}
        adFormat="auto"
        className="max-w-2xl w-full"
        adStyle={{ 
          display: 'block',
          minHeight: '60px',
          maxHeight: '60px'
        }}
      />
    </div>
  )
}

export default HeaderBanner
