import React from 'react'
import AdSenseAd from './AdSenseAd'
import { getAdSlot } from '../../config/adsense'

function SidebarBanner({ className = '' }) {
  return (
    <div className={`hidden lg:block ${className}`}>
      <div className="sticky top-4">
        <AdSenseAd 
          adSlot={getAdSlot('SIDEBAR_BANNER')}
          adFormat="auto"
          className="w-full"
          adStyle={{ 
            display: 'block',
            minHeight: '250px',
            maxHeight: '250px'
          }}
        />
      </div>
    </div>
  )
}

export default SidebarBanner
