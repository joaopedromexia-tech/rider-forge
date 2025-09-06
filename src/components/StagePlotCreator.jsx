import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useI18n } from '../context/I18nContext'
import { useStageplot } from '../context/StagePlotContext'
import { useRider } from '../context/RiderContext'

// Dedicated Stage Plot Creator Page with Professional MDI Equipment Icons
const EQUIPMENT_SCALE = 2.5 // Scale factor to make equipment more visible

const getPalette = (t) => [
  { 
    id: 'vocal-mic', 
    label: t('stageplot.equipment.vocalMic'), 
    color: '#60A5FA', 
    w: 24 * EQUIPMENT_SCALE, 
    h: 24 * EQUIPMENT_SCALE, 
    shape: 'circle',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"/>
      </svg>
    )
  },
  { 
    id: 'backing-vocal', 
    label: t('stageplot.equipment.backingVocal'), 
    color: '#60A5FA', 
    w: 20 * EQUIPMENT_SCALE, 
    h: 20 * EQUIPMENT_SCALE, 
    shape: 'circle',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V17H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19M8,19H16V21H8V19Z"/>
      </svg>
    )
  },
  { 
    id: 'mic-stand', 
    label: t('stageplot.equipment.micStand'), 
    color: '#60A5FA', 
    w: 20 * EQUIPMENT_SCALE, 
    h: 20 * EQUIPMENT_SCALE, 
    shape: 'circle',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,1L8,5H11V14H13V5H16M7,19V17H17V19H7Z"/>
      </svg>
    )
  },
  { 
    id: 'boom-stand', 
    label: t('stageplot.equipment.boomStand'), 
    color: '#60A5FA', 
    w: 24 * EQUIPMENT_SCALE, 
    h: 24 * EQUIPMENT_SCALE, 
    shape: 'circle',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,1L8,5H11V10H15L19,6V4L15,8H13V5H16M7,19V17H17V19H7Z"/>
      </svg>
    )
  },
  { 
    id: 'wedge', 
    label: t('stageplot.equipment.monitorWedge'), 
    color: '#34D399', 
    w: 40 * EQUIPMENT_SCALE, 
    h: 26 * EQUIPMENT_SCALE, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M12 7C13.4 7 14.8 8.6 14.8 11V14.5C14.8 15.61 13.91 16.5 12.8 16.5H11.2C10.09 16.5 9.2 15.61 9.2 14.5V11C9.2 8.6 10.6 7 12 7Z"/>
      </svg>
    )
  },
  { 
    id: 'guitar-amp', 
    label: t('stageplot.equipment.guitarAmp'), 
    color: '#F59E0B', 
    w: 36 * EQUIPMENT_SCALE, 
    h: 28 * EQUIPMENT_SCALE, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21,3H3A2,2 0 0,0 1,5V19A2,2 0 0,0 3,21H21A2,2 0 0,0 23,19V5A2,2 0 0,0 21,3M21,19H3V5H21V19M8,7A2,2 0 0,1 10,9A2,2 0 0,1 8,11A2,2 0 0,1 6,9A2,2 0 0,1 8,7M16,7A2,2 0 0,1 18,9A2,2 0 0,1 16,11A2,2 0 0,1 14,9A2,2 0 0,1 16,7M12,13A4,4 0 0,1 16,17A4,4 0 0,1 12,21A4,4 0 0,1 8,17A4,4 0 0,1 12,13Z"/>
      </svg>
    )
  },
  { 
    id: 'bass-amp', 
    label: t('stageplot.equipment.bassAmp'), 
    color: '#F59E0B', 
    w: 40 * EQUIPMENT_SCALE, 
    h: 32 * EQUIPMENT_SCALE, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21,3H3A2,2 0 0,0 1,5V19A2,2 0 0,0 3,21H21A2,2 0 0,0 23,19V5A2,2 0 0,0 21,3M21,19H3V5H21V19M6,7H8V9H6V7M10,7H12V9H10V7M14,7H16V9H14V7M18,7H20V9H18V7M12,11A6,6 0 0,1 18,17A6,6 0 0,1 12,23A6,6 0 0,1 6,17A6,6 0 0,1 12,11M12,13A4,4 0 0,0 8,17A4,4 0 0,0 12,21A4,4 0 0,0 16,17A4,4 0 0,0 12,13Z"/>
      </svg>
    )
  },
  { 
    id: 'drums', 
    label: t('stageplot.equipment.drumKit'), 
    color: '#EF4444', 
    w: 48 * EQUIPMENT_SCALE, 
    h: 36 * EQUIPMENT_SCALE, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M9,9H11V11H9V9M13,9H15V11H13V9M9,13H11V15H9V13M13,13H15V15H13V13Z"/>
      </svg>
    )
  },
  { 
    id: 'kick-drum', 
    label: t('stageplot.equipment.kickDrum'), 
    color: '#EF4444', 
    w: 24 * EQUIPMENT_SCALE, 
    h: 24 * EQUIPMENT_SCALE, 
    shape: 'circle',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z"/>
      </svg>
    )
  },
  { 
    id: 'snare-drum', 
    label: t('stageplot.equipment.snareDrum'), 
    color: '#EF4444', 
    w: 18 * EQUIPMENT_SCALE, 
    h: 18 * EQUIPMENT_SCALE, 
    shape: 'circle',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6Z"/>
      </svg>
    )
  },
  { 
    id: 'tom', 
    label: t('stageplot.equipment.tom'), 
    color: '#EF4444', 
    w: 16 * EQUIPMENT_SCALE, 
    h: 16 * EQUIPMENT_SCALE, 
    shape: 'circle',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
      </svg>
    )
  },
  { 
    id: 'overhead-mic', 
    label: t('stageplot.equipment.overheadMic'), 
    color: '#60A5FA', 
    w: 20 * EQUIPMENT_SCALE, 
    h: 20 * EQUIPMENT_SCALE, 
    shape: 'circle',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,1L8,5H11V10H13V5H16M12,12A3,3 0 0,1 15,15A3,3 0 0,1 12,18A3,3 0 0,1 9,15A3,3 0 0,1 12,12M7,19V17H17V19H7Z"/>
      </svg>
    )
  },
  { 
    id: 'keyboard', 
    label: t('stageplot.equipment.keyboard'), 
    color: '#A78BFA', 
    w: 46 * EQUIPMENT_SCALE, 
    h: 30 * EQUIPMENT_SCALE, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20,5H4C2.89,5 2,5.89 2,7V17C2,18.11 2.89,19 4,19H20C21.11,19 22,18.11 22,17V7C22,5.89 21.11,5 20,5M20,17H4V7H20V17M6,8H8V10H6V8M9,8H11V10H9V8M12,8H14V10H12V8M15,8H17V10H15V8M18,8H20V10H18V8M6,11H8V13H6V11M9,11H11V13H9V11M12,11H14V13H12V11M15,11H17V13H15V11M18,11H20V13H18V11M7,14H17V16H7V14Z"/>
      </svg>
    )
  },
  { 
    id: 'piano', 
    label: t('stageplot.equipment.piano'), 
    color: '#A78BFA', 
    w: 60 * EQUIPMENT_SCALE, 
    h: 40 * EQUIPMENT_SCALE, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20,2H4A2,2 0 0,0 2,4V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V4A2,2 0 0,0 20,2M20,20H4V4H20V20M6,6H8V18H6V6M9,6H10V12H9V6M11,6H13V18H11V6M14,6H15V12H14V6M16,6H18V18H16V6Z"/>
      </svg>
    )
  },
  { 
    id: 'guitar', 
    label: t('stageplot.equipment.electricGuitar'), 
    color: '#F59E0B', 
    w: 20 * EQUIPMENT_SCALE, 
    h: 40 * EQUIPMENT_SCALE, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,2C13.11,2 14,2.9 14,4C14,5.11 13.11,6 12,6A2,2 0 0,1 10,4C10,2.89 10.9,2 12,2M21,9V7L15,1V3H9V1L3,7V9H21M3,10V12H21V10H3M3,13V15H21V13H3M3,16V18H21V16H3M3,19V21H21V19H3Z"/>
      </svg>
    )
  },
  { 
    id: 'bass-guitar', 
    label: t('stageplot.equipment.bassGuitar'), 
    color: '#F59E0B', 
    w: 20 * EQUIPMENT_SCALE, 
    h: 44 * EQUIPMENT_SCALE, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,2A2,2 0 0,1 14,4A2,2 0 0,1 12,6A2,2 0 0,1 10,4A2,2 0 0,1 12,2M21,9V7L15,1V3H9V1L3,7V9H21M3,10V12H21V10H3M3,13V15H21V13H3M3,16V18H21V16H3M3,19V21H21V19H3Z"/>
      </svg>
    )
  },
  { 
    id: 'acoustic-guitar', 
    label: t('stageplot.equipment.acousticGuitar'), 
    color: '#92400E', 
    w: 20 * EQUIPMENT_SCALE, 
    h: 40 * EQUIPMENT_SCALE, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59,3L15,7.59V9A2,2 0 0,1 13,11H11A2,2 0 0,1 9,9V7.59L4.41,3L3,4.41L7.59,9H9A2,2 0 0,1 11,11V13A2,2 0 0,1 9,15H7.59L3,19.59L4.41,21L9,16.41V15A2,2 0 0,1 11,13H13A2,2 0 0,1 15,15V16.41L19.59,21L21,19.59L16.41,15H15A2,2 0 0,1 13,13V11A2,2 0 0,1 15,9H16.41L21,4.41L19.59,3Z"/>
      </svg>
    )
  },
  { 
    id: 'violin', 
    label: t('stageplot.equipment.violin'), 
    color: '#92400E', 
    w: 16 * EQUIPMENT_SCALE, 
    h: 32 * EQUIPMENT_SCALE, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M9.93,2.68C10.58,2.15 11.3,2 12,2C12.7,2 13.42,2.15 14.07,2.68C14.5,3.03 14.5,3.67 14.07,4.02C13.42,4.55 12.7,4.7 12,4.7C11.3,4.7 10.58,4.55 9.93,4.02C9.5,3.67 9.5,3.03 9.93,2.68M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M7,19H17V21H7V19Z"/>
      </svg>
    )
  },
  { 
    id: 'speaker', 
    label: t('stageplot.equipment.speaker'), 
    color: '#1F2937', 
    w: 32 * EQUIPMENT_SCALE, 
    h: 48 * EQUIPMENT_SCALE, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17,2H7A2,2 0 0,0 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4A2,2 0 0,0 17,2M17,20H7V4H17V20M12,6A2,2 0 0,1 14,8A2,2 0 0,1 12,10A2,2 0 0,1 10,8A2,2 0 0,1 12,6M12,12A4,4 0 0,1 16,16A4,4 0 0,1 12,20A4,4 0 0,1 8,16A4,4 0 0,1 12,12M12,14A2,2 0 0,0 10,16A2,2 0 0,0 12,18A2,2 0 0,0 14,16A2,2 0 0,0 12,14Z"/>
      </svg>
    )
  },
  { 
    id: 'subwoofer', 
    label: t('stageplot.equipment.subwoofer'), 
    color: '#1F2937', 
    w: 40 * EQUIPMENT_SCALE, 
    h: 40 * EQUIPMENT_SCALE, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17,2H7A2,2 0 0,0 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V4A2,2 0 0,0 17,2M17,20H7V4H17V20M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10Z"/>
      </svg>
    )
  },
  { 
    id: 'power-outlet', 
    label: t('stageplot.equipment.powerOutlet'), 
    color: '#EF4444', 
    w: 24 * EQUIPMENT_SCALE, 
    h: 24 * EQUIPMENT_SCALE, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4,2A2,2 0 0,0 2,4V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V4A2,2 0 0,0 20,2H4M4,4H20V20H4V4M8,6V8H10V6H8M14,6V8H16V6H14M7,10V18H17V10H7M9,12H15V16H9V12Z"/>
      </svg>
    )
  },
  { 
    id: 'power-strip', 
    label: t('stageplot.equipment.powerStrip'), 
    color: '#EF4444', 
    w: 60 * EQUIPMENT_SCALE, 
    h: 20 * EQUIPMENT_SCALE, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M2,7V17H22V7H2M4,9H6V15H4V9M8,9H10V15H8V9M12,9H14V15H12V9M16,9H18V15H16V9M20,9V15H20V9Z"/>
      </svg>
    )
  },
  { 
    id: 'di-box', 
    label: t('stageplot.equipment.diBox'), 
    color: '#10B981', 
    w: 28 * EQUIPMENT_SCALE, 
    h: 20 * EQUIPMENT_SCALE, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M4,6V18H20V6H4M6,8H8V10H6V8M10,8H12V10H10V8M14,8H16V10H14V8M18,8H20V10H18V8M6,12H8V14H6V12M10,12H12V14H10V12M14,12H16V14H14V12M18,12H20V14H18V12Z"/>
      </svg>
    )
  },
  { 
    id: 'active-di', 
    label: t('stageplot.equipment.activeDiBox'), 
    color: '#10B981', 
    w: 30, 
    h: 22, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M4,6V18H20V6H4M6,8H8V10H6V8M10,8H12V10H10V8M14,8H16V10H14V8M18,8H20V10H18V8M6,12H8V14H6V12M10,12H12V14H10V12M14,12H16V14H14V12M18,12H20V14H18V12M11,15H13V17H11V15Z"/>
      </svg>
    )
  },
  { 
    id: 'stage-box', 
    label: t('stageplot.equipment.stageBox'), 
    color: '#1F2937', 
    w: 40, 
    h: 24, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4,2A2,2 0 0,0 2,4V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V4A2,2 0 0,0 20,2H4M4,4H20V8H4V4M4,10H20V14H4V10M4,16H20V20H4V16M6,5H8V7H6V5M10,5H12V7H10V5M14,5H16V7H14V5M18,5H20V7H18V5Z"/>
      </svg>
    )
  },
  { 
    id: 'iem-pack', 
    label: t('stageplot.equipment.iemPack'), 
    color: '#8B5CF6', 
    w: 16, 
    h: 12, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,1A11,11 0 0,0 1,12A11,11 0 0,0 12,23A11,11 0 0,0 23,12A11,11 0 0,0 12,1M12,3A9,9 0 0,1 21,12A9,9 0 0,1 12,21A9,9 0 0,1 3,12A9,9 0 0,1 12,3M12,5A7,7 0 0,0 5,12A7,7 0 0,0 12,19A7,7 0 0,0 19,12A7,7 0 0,0 12,5M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z"/>
      </svg>
    )
  },
  { 
    id: 'carpet', 
    label: t('stageplot.equipment.carpet'), 
    color: '#6B7280', 
    w: 80, 
    h: 40, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M2,4V20H22V4H2M4,6H20V18H4V6M6,8V16H18V8H6M8,10H16V14H8V10Z"/>
      </svg>
    )
  },
  { 
    id: 'cable-xlr', 
    label: t('stageplot.equipment.xlrCable'), 
    color: '#374151', 
    w: 40, 
    h: 8, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,6H13V18H11V6Z"/>
      </svg>
    )
  },
  { 
    id: 'riser', 
    label: t('stageplot.equipment.riser'), 
    color: '#6B7280', 
    w: 40, 
    h: 80, 
    shape: 'rect',
    customizable: true,
    measurements: { width: '1m', depth: '2m', height: '0.20m' },
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M2,21V19H20V21H2M20,8V5C20,3.89 19.1,3 18,3H4A2,2 0 0,0 2,5V8A2,2 0 0,0 4,10H18A2,2 0 0,0 20,8M18,8H4V5H18V8M12,10V21H14V10H12M8,10V21H10V10H8Z"/>
      </svg>
    )
  },
  { 
    id: 'nylon-guitar', 
    label: t('stageplot.equipment.nylonGuitar'), 
    color: '#92400E', 
    w: 20 * EQUIPMENT_SCALE, 
    h: 40 * EQUIPMENT_SCALE, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C13.11 2 14 2.9 14 4C14 5.11 13.11 6 12 6A2 2 0 0 1 10 4C10 2.89 10.9 2 12 2M21 9V7L15 1V3H9V1L3 7V9H21M3 10V12H21V10H3M3 13V15H21V13H3M3 16V18H21V16H3M3 19V21H21V19H3Z"/>
      </svg>
    )
  },
  { 
    id: 'percussion-set', 
    label: t('stageplot.equipment.percussionSet'), 
    color: '#EF4444', 
    w: 60, 
    h: 50, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 2C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2H6M6 4H18V20H6V4M8 6V8H16V6H8M8 10V12H16V10H8M8 14V16H16V14H8M8 18H16V20H8V18Z"/>
      </svg>
    )
  },
  { 
    id: 'congas-set', 
    label: t('stageplot.equipment.congasSet'), 
    color: '#EF4444', 
    w: 35, 
    h: 45, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2A10 10 0 0 1 22 12A10 10 0 0 1 12 22A10 10 0 0 1 2 12A10 10 0 0 1 12 2M12 4A8 8 0 0 0 4 12A8 8 0 0 0 12 20A8 8 0 0 0 20 12A8 8 0 0 0 12 4Z"/>
      </svg>
    )
  },
  { 
    id: 'bongos-pair', 
    label: t('stageplot.equipment.bongosPair'), 
    color: '#EF4444', 
    w: 30, 
    h: 25, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2A10 10 0 0 1 22 12A10 10 0 0 1 12 22A10 10 0 0 1 2 12A10 10 0 0 1 12 2M12 6A6 6 0 0 0 6 12A6 6 0 0 0 12 18A6 6 0 0 0 18 12A6 6 0 0 0 12 6Z"/>
      </svg>
    )
  },
  { 
    id: 'djembe-large', 
    label: t('stageplot.equipment.djembeLarge'), 
    color: '#EF4444', 
    w: 28, 
    h: 35, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2A10 10 0 0 1 22 12A10 10 0 0 1 12 22A10 10 0 0 1 2 12A10 10 0 0 1 12 2M12 8A4 4 0 0 0 8 12A4 4 0 0 0 12 16A4 4 0 0 0 16 12A4 4 0 0 0 12 8Z"/>
      </svg>
    )
  },
  { 
    id: 'timbales', 
    label: t('stageplot.equipment.timbales'), 
    color: '#EF4444', 
    w: 40, 
    h: 25, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2A10 10 0 0 1 22 12A10 10 0 0 1 12 22A10 10 0 0 1 2 12A10 10 0 0 1 12 2M12 4A8 8 0 0 0 4 12A8 8 0 0 0 12 20A8 8 0 0 0 20 12A8 8 0 0 0 12 4M9 9H11V11H9V9M13 9H15V11H13V9M9 13H11V15H9V13M13 13H15V15H13V13Z"/>
      </svg>
    )
  },
  { 
    id: 'saxophone', 
    label: t('stageplot.equipment.saxophone'), 
    color: '#F59E0B', 
    w: 20, 
    h: 32, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.5,2C13.33,2 14,2.67 14,3.5V4.5C14,5.33 13.33,6 12.5,6S11,5.33 11,4.5V3.5C11,2.67 11.67,2 12.5,2M10.5,7C11.33,7 12,7.67 12,8.5V19.5C12,20.33 11.33,21 10.5,21S9,20.33 9,19.5V8.5C9,7.67 9.67,7 10.5,7M14.5,9C15.33,9 16,9.67 16,10.5V21.5C16,22.33 15.33,23 14.5,23S13,22.33 13,21.5V10.5C13,9.67 13.67,9 14.5,9Z"/>
      </svg>
    )
  },
  { 
    id: 'trumpet', 
    label: t('stageplot.equipment.trumpet'), 
    color: '#F59E0B', 
    w: 28, 
    h: 16, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M5,12A1,1 0 0,1 6,11H18A1,1 0 0,1 19,12A1,1 0 0,1 18,13H6A1,1 0 0,1 5,12M3,8A1,1 0 0,1 4,7H20A1,1 0 0,1 21,8A1,1 0 0,1 20,9H4A1,1 0 0,1 3,8M7,16A1,1 0 0,1 8,15H16A1,1 0 0,1 17,16A1,1 0 0,1 16,17H8A1,1 0 0,1 7,16Z"/>
      </svg>
    )
  },
  { 
    id: 'trombone', 
    label: t('stageplot.equipment.trombone'), 
    color: '#F59E0B', 
    w: 32, 
    h: 16, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M2,12A1,1 0 0,1 3,11H21A1,1 0 0,1 22,12A1,1 0 0,1 21,13H3A1,1 0 0,1 2,12M4,8A1,1 0 0,1 5,7H19A1,1 0 0,1 20,8A1,1 0 0,1 19,9H5A1,1 0 0,1 4,8M6,16A1,1 0 0,1 7,15H17A1,1 0 0,1 18,16A1,1 0 0,1 17,17H7A1,1 0 0,1 6,16Z"/>
      </svg>
    )
  },
  { 
    id: 'flute', 
    label: t('stageplot.equipment.flute'), 
    color: '#F59E0B', 
    w: 32, 
    h: 8, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M2,12A1,1 0 0,1 3,11H21A1,1 0 0,1 22,12A1,1 0 0,1 21,13H3A1,1 0 0,1 2,12Z"/>
      </svg>
    )
  },
  { 
    id: 'clarinet', 
    label: t('stageplot.equipment.clarinet'), 
    color: '#92400E', 
    w: 12, 
    h: 32, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,2A1,1 0 0,1 13,3V21A1,1 0 0,1 12,22A1,1 0 0,1 11,21V3A1,1 0 0,1 12,2M8,6A1,1 0 0,1 9,7V17A1,1 0 0,1 8,18A1,1 0 0,1 7,17V7A1,1 0 0,1 8,6M16,6A1,1 0 0,1 17,7V17A1,1 0 0,1 16,18A1,1 0 0,1 15,17V7A1,1 0 0,1 16,6Z"/>
      </svg>
    )
  },
  
  // STRING INSTRUMENTS
  { 
    id: 'cello', 
    label: t('stageplot.equipment.cello'), 
    color: '#92400E', 
    w: 20, 
    h: 48, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,2A8,8 0 0,1 20,10A8,8 0 0,1 12,18A8,8 0 0,1 4,10A8,8 0 0,1 12,2M12,4A6,6 0 0,0 6,10A6,6 0 0,0 12,16A6,6 0 0,0 18,10A6,6 0 0,0 12,4M12,18V22H12V18Z"/>
      </svg>
    )
  },
  { 
    id: 'viola', 
    label: t('stageplot.equipment.viola'), 
    color: '#92400E', 
    w: 18, 
    h: 36, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,2A8,8 0 0,1 20,10A8,8 0 0,1 12,18A8,8 0 0,1 4,10A8,8 0 0,1 12,2M12,4A6,6 0 0,0 6,10A6,6 0 0,0 12,16A6,6 0 0,0 18,10A6,6 0 0,0 12,4M12,18V21H12V18Z"/>
      </svg>
    )
  },
  { 
    id: 'double-bass', 
    label: t('stageplot.equipment.doubleBass'), 
    color: '#92400E', 
    w: 24, 
    h: 60, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,1A9,9 0 0,1 21,10A9,9 0 0,1 12,19A9,9 0 0,1 3,10A9,9 0 0,1 12,1M12,3A7,7 0 0,0 5,10A7,7 0 0,0 12,17A7,7 0 0,0 19,10A7,7 0 0,0 12,3M12,19V23H12V19Z"/>
      </svg>
    )
  },
  { 
    id: 'harp', 
    label: t('stageplot.equipment.harp'), 
    color: '#F59E0B', 
    w: 32, 
    h: 60, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,2C15.31,2 18,4.69 18,8V16C18,19.31 15.31,22 12,22C8.69,22 6,19.31 6,16V8C6,4.69 8.69,2 12,2M12,4C9.79,4 8,5.79 8,8V16C8,18.21 9.79,20 12,20C14.21,20 16,18.21 16,16V8C16,5.79 14.21,4 12,4Z"/>
      </svg>
    )
  },
  { 
    id: 'mandolin', 
    label: t('stageplot.equipment.mandolin'), 
    color: '#92400E', 
    w: 16, 
    h: 28, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,2A6,6 0 0,1 18,8A6,6 0 0,1 12,14A6,6 0 0,1 6,8A6,6 0 0,1 12,2M12,4A4,4 0 0,0 8,8A4,4 0 0,0 12,12A4,4 0 0,0 16,8A4,4 0 0,0 12,4M12,14V22H12V14Z"/>
      </svg>
    )
  },
  { 
    id: 'banjo', 
    label: t('stageplot.equipment.banjo'), 
    color: '#92400E', 
    w: 20, 
    h: 32, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,2A7,7 0 0,1 19,9A7,7 0 0,1 12,16A7,7 0 0,1 5,9A7,7 0 0,1 12,2M12,4A5,5 0 0,0 7,9A5,5 0 0,0 12,14A5,5 0 0,0 17,9A5,5 0 0,0 12,4M12,16V22H12V16Z"/>
      </svg>
    )
  },
  { 
    id: 'ukulele', 
    label: t('stageplot.equipment.ukulele'), 
    color: '#92400E', 
    w: 14, 
    h: 24, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,2A5,5 0 0,1 17,7A5,5 0 0,1 12,12A5,5 0 0,1 7,7A5,5 0 0,1 12,2M12,4A3,3 0 0,0 9,7A3,3 0 0,0 12,10A3,3 0 0,0 15,7A3,3 0 0,0 12,4M12,12V20H12V12Z"/>
      </svg>
    )
  },
  
  // PERCUSSION INSTRUMENTS
  { 
    id: 'congas', 
    label: t('stageplot.equipment.congas'), 
    color: '#EF4444', 
    w: 20, 
    h: 36, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8,2A6,6 0 0,1 14,8V16A6,6 0 0,1 8,22A6,6 0 0,1 2,16V8A6,6 0 0,1 8,2M8,4A4,4 0 0,0 4,8V16A4,4 0 0,0 8,20A4,4 0 0,0 12,16V8A4,4 0 0,0 8,4M16,4A6,6 0 0,1 22,10V18A6,6 0 0,1 16,24A6,6 0 0,1 10,18V10A6,6 0 0,1 16,4M16,6A4,4 0 0,0 12,10V18A4,4 0 0,0 16,22A4,4 0 0,0 20,18V10A4,4 0 0,0 16,6Z"/>
      </svg>
    )
  },
  { 
    id: 'bongos', 
    label: t('stageplot.equipment.bongos'), 
    color: '#EF4444', 
    w: 24, 
    h: 16, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7,4A3,3 0 0,1 10,7V13A3,3 0 0,1 7,16A3,3 0 0,1 4,13V7A3,3 0 0,1 7,4M17,4A3,3 0 0,1 20,7V13A3,3 0 0,1 17,16A3,3 0 0,1 14,13V7A3,3 0 0,1 17,4Z"/>
      </svg>
    )
  },
  { 
    id: 'djembe', 
    label: t('stageplot.equipment.djembe'), 
    color: '#EF4444', 
    w: 20, 
    h: 28, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,2A8,8 0 0,1 20,10V14A8,8 0 0,1 12,22A8,8 0 0,1 4,14V10A8,8 0 0,1 12,2M12,4A6,6 0 0,0 6,10V14A6,6 0 0,0 12,20A6,6 0 0,0 18,14V10A6,6 0 0,0 12,4Z"/>
      </svg>
    )
  },
  { 
    id: 'cajon', 
    label: t('stageplot.equipment.cajon'), 
    color: '#92400E', 
    w: 20, 
    h: 32, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4,2H20A2,2 0 0,1 22,4V20A2,2 0 0,1 20,22H4A2,2 0 0,1 2,20V4A2,2 0 0,1 4,2M4,4V20H20V4H4Z"/>
      </svg>
    )
  },
  { 
    id: 'timpani', 
    label: t('stageplot.equipment.timpani'), 
    color: '#EF4444', 
    w: 32, 
    h: 32, 
    shape: 'circle',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6Z"/>
      </svg>
    )
  },
  { 
    id: 'xylophone', 
    label: t('stageplot.equipment.xylophone'), 
    color: '#F59E0B', 
    w: 48, 
    h: 24, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M2,6H4V18H2V6M6,6H8V18H6V6M10,6H12V18H10V6M14,6H16V18H14V6M18,6H20V18H18V6M22,6H24V18H22V6Z"/>
      </svg>
    )
  },
  { 
    id: 'vibraphone', 
    label: t('stageplot.equipment.vibraphone'), 
    color: '#F59E0B', 
    w: 52, 
    h: 28, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M2,5H4V19H2V5M6,5H8V19H6V5M10,5H12V19H10V5M14,5H16V19H14V5M18,5H20V19H18V5M22,5H24V19H22V5M2,20H22V22H2V20Z"/>
      </svg>
    )
  },
  { 
    id: 'marimba', 
    label: t('stageplot.equipment.marimba'), 
    color: '#92400E', 
    w: 60, 
    h: 32, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M1,5H3V19H1V5M5,5H7V19H5V5M9,5H11V19H9V5M13,5H15V19H13V5M17,5H19V19H17V5M21,5H23V19H21V5M1,20H23V22H1V20Z"/>
      </svg>
    )
  },
  
  // ELECTRONIC/DJ EQUIPMENT
  { 
    id: 'dj-turntables', 
    label: t('stageplot.equipment.djTurntables'), 
    color: '#1F2937', 
    w: 48, 
    h: 32, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10Z"/>
      </svg>
    )
  },
  { 
    id: 'dj-mixer', 
    label: t('stageplot.equipment.djMixer'), 
    color: '#1F2937', 
    w: 32, 
    h: 24, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4,2H20A2,2 0 0,1 22,4V20A2,2 0 0,1 20,22H4A2,2 0 0,1 2,20V4A2,2 0 0,1 4,2M4,4V20H20V4H4M6,6H8V18H6V6M10,6H12V18H10V6M14,6H16V18H14V6M18,6H20V18H18V6Z"/>
      </svg>
    )
  },
  { 
    id: 'synthesizer', 
    label: t('stageplot.equipment.synthesizer'), 
    color: '#A78BFA', 
    w: 52, 
    h: 28, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20,5H4C2.89,5 2,5.89 2,7V17C2,18.11 2.89,19 4,19H20C21.11,19 22,18.11 22,17V7C22,5.89 21.11,5 20,5M20,17H4V7H20V17M6,8H8V10H6V8M9,8H11V10H9V8M12,8H14V10H12V8M15,8H17V10H15V8M18,8H20V10H18V8M6,11H8V13H6V11M9,11H11V13H9V11M12,11H14V13H12V11M15,11H17V13H15V11M18,11H20V13H18V11M7,14H17V16H7V14Z"/>
      </svg>
    )
  },
  { 
    id: 'laptop', 
    label: t('stageplot.equipment.laptop'), 
    color: '#1F2937', 
    w: 28 * EQUIPMENT_SCALE, 
    h: 20 * EQUIPMENT_SCALE, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4,6H20V16H4M20,18A2,2 0 0,0 22,16V6C22,4.89 21.1,4 20,4H4C2.89,4 2,4.89 2,6V16A2,2 0 0,0 4,18H0V20H24V18H20Z"/>
      </svg>
    )
  },
  
  // SPECIALIZED INSTRUMENTS
  { 
    id: 'accordion', 
    label: t('stageplot.equipment.accordion'), 
    color: '#EF4444', 
    w: 32, 
    h: 24, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4,2H20A2,2 0 0,1 22,4V20A2,2 0 0,1 20,22H4A2,2 0 0,1 2,20V4A2,2 0 0,1 4,2M4,4V20H20V4H4M6,6H18V8H6V6M6,10H18V12H6V10M6,14H18V16H6V14M6,18H18V20H6V18Z"/>
      </svg>
    )
  },
  { 
    id: 'harmonica', 
    label: t('stageplot.equipment.harmonica'), 
    color: '#F59E0B', 
    w: 16, 
    h: 8, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M2,10H22V14H2V10M4,8H20V16H4V8Z"/>
      </svg>
    )
  },
  
  // EQUIPMENT & ACCESSORIES
  { 
    id: 'music-stand', 
    label: t('stageplot.equipment.musicStand'), 
    color: '#6B7280', 
    w: 16, 
    h: 28, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,1L8,5H11V14H13V5H16M7,19V17H17V19H7M4,15H20V17H4V15Z"/>
      </svg>
    )
  },
  { 
    id: 'keyboard-stand', 
    label: t('stageplot.equipment.keyboardStand'), 
    color: '#6B7280', 
    w: 48, 
    h: 8, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M2,12H22V14H2V12M4,10L12,2L20,10H16V18H8V10H4Z"/>
      </svg>
    )
  },
  { 
    id: 'guitar-stand', 
    label: t('stageplot.equipment.guitarStand'), 
    color: '#6B7280', 
    w: 12, 
    h: 24, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,1L8,5H11V14H13V5H16M7,19V17H17V19H7Z"/>
      </svg>
    )
  },
  { 
    id: 'drum-shield', 
    label: t('stageplot.equipment.drumShield'), 
    color: '#9CA3AF', 
    w: 60, 
    h: 48, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M2,2H22V22H2V2M4,4V20H20V4H4M6,6H18V18H6V6Z"/>
      </svg>
    )
  },
  { 
    id: 'wireless-receiver', 
    label: t('stageplot.equipment.wirelessReceiver'), 
    color: '#10B981', 
    w: 20, 
    h: 12, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,2A2,2 0 0,1 14,4C14,5.11 13.1,6 12,6C10.89,6 10,5.1 10,4A2,2 0 0,1 12,2M21,9V7L15,1V3H9V1L3,7V9H21M3,10V12H21V10H3M3,13V15H21V13H3M3,16V18H21V16H3M3,19V21H21V19H3Z"/>
      </svg>
    )
  },
  { 
    id: 'effects-rack', 
    label: t('stageplot.equipment.effectsRack'), 
    color: '#1F2937', 
    w: 24, 
    h: 36, 
    shape: 'rect',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4,2H20A2,2 0 0,1 22,4V20A2,2 0 0,1 20,22H4A2,2 0 0,1 2,20V4A2,2 0 0,1 4,2M4,4V8H20V4H4M4,10V14H20V10H4M4,16V20H20V16H4Z"/>
      </svg>
    )
  },
]

const GRID_SIZE = 20
const DEFAULT_STAGE_W = 16 // meters
const DEFAULT_STAGE_H = 10 // meters
const PIXELS_PER_METER = 100 // 100 pixels = 1 meter

function StagePlotCreator() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { t } = useI18n()
  const { canSaveStageplot, saveStageplot, updateStageplot, getStageplotByRiderId, isPro } = useStageplot()
  const { savedRiders } = useRider()
  
  // Get rider ID and edit flag from URL params
  const riderId = searchParams.get('riderId')
  const isEdit = searchParams.get('edit') === 'true'
  
  // Initialize from URL params or defaults
  const [items, setItems] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [bandName, setBandName] = useState('')
  const [gridSize, setGridSize] = useState(GRID_SIZE)
  const [stageWidth, setStageWidth] = useState(DEFAULT_STAGE_W)
  const [stageHeight, setStageHeight] = useState(DEFAULT_STAGE_H)
  const [notes, setNotes] = useState('')

  // Load existing layout data when editing
  useEffect(() => {
    if (isEdit) {
      try {
        const editData = sessionStorage.getItem('riderForge_editStagePlot')
        if (editData) {
          const { layout } = JSON.parse(editData)
          if (layout) {
            setItems(layout.items || [])
            setBandName(layout.bandName || '')
            setGridSize(layout.gridSize || GRID_SIZE)
            setStageWidth(layout.stageWidthMeters || DEFAULT_STAGE_W)
            setStageHeight(layout.stageHeightMeters || DEFAULT_STAGE_H)
            setNotes(layout.notes || '')
          }
        }
      } catch (error) {
        console.error('Error loading edit data:', error)
      }
    }
  }, [isEdit])

  // No auto-fit on mount - let user control zoom manually

  // Handle window resize - only update if user hasn't manually adjusted zoom
  useEffect(() => {
    const handleResize = () => {
      // Don't auto-adjust zoom on resize - let user control it manually
      // This prevents the zoom from changing when user resizes window
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const [showRiserCustomization, setShowRiserCustomization] = useState(false)
  const [riserWidth, setRiserWidth] = useState(1)
  const [riserDepth, setRiserDepth] = useState(2)
  const [riserHeight, setRiserHeight] = useState(0.20)
  const [searchTerm, setSearchTerm] = useState('')
  const [zoom, setZoom] = useState(1)
  const [editingLabel, setEditingLabel] = useState(null)
  const [editingText, setEditingText] = useState('')
  const [showOnboarding, setShowOnboarding] = useState(true)
  const svgRef = useRef(null)

  // Calculate optimal zoom to fit screen
  const calculateOptimalZoom = () => {
    // Get the actual available space in the canvas area
    const sidebarWidth = 320 // sidebar width
    const headerHeight = 64 // header height
    const padding = 48 // total padding (24px on each side)
    
    const availableWidth = window.innerWidth - sidebarWidth - padding
    const availableHeight = window.innerHeight - headerHeight - padding
    
    // Stage dimensions in pixels
    const stageWidthPx = stageWidth * PIXELS_PER_METER
    const stageHeightPx = stageHeight * PIXELS_PER_METER
    
    // Calculate scale factors to fit the stage in available space
    const scaleX = availableWidth / stageWidthPx
    const scaleY = availableHeight / stageHeightPx
    
    // Use the smaller scale to ensure the entire stage fits
    // This gives us the scale needed to fit the stage in the available space
    const optimalScale = Math.min(scaleX, scaleY)
    
    // Keep within reasonable zoom limits
    return Math.max(0.1, Math.min(2, optimalScale))
  }

  // Get translated palette
  const PALETTE = useMemo(() => getPalette(t), [t])

  // Filter palette based on search term
  const filteredPalette = useMemo(() => {
    if (!searchTerm.trim()) return PALETTE
    
    const searchLower = searchTerm.toLowerCase().trim()
    return PALETTE.filter(item => 
      item.label.toLowerCase().includes(searchLower) ||
      item.id.toLowerCase().includes(searchLower)
    )
  }, [PALETTE, searchTerm])

  const handleDropFromPalette = (paletteItem) => {
    // Special handling for customizable risers
    if (paletteItem.customizable && paletteItem.id === 'riser') {
      setShowRiserCustomization(true)
      return
    }

    const stageWidthPx = stageWidth * PIXELS_PER_METER
    const stageHeightPx = stageHeight * PIXELS_PER_METER
    const newItem = {
      id: Date.now() + '_' + Math.random().toString(36).slice(2),
      type: paletteItem.id,
      x: Math.round((stageWidthPx / 2) / gridSize) * gridSize,
      y: Math.round((stageHeightPx / 2) / gridSize) * gridSize,
      rotation: 0,
      w: paletteItem.w,
      h: paletteItem.h,
      color: paletteItem.color,
      shape: paletteItem.shape,
      label: paletteItem.label,
      measurements: paletteItem.measurements
    }
    setItems(prev => [...prev, newItem])
    
    // Clear search after adding item for better UX
    if (searchTerm) {
      setSearchTerm('')
    }
  }

  const addCustomRiser = () => {
    const pixelWidth = riserWidth * PIXELS_PER_METER   // pixels per meter (width)
    const pixelDepth = riserDepth * PIXELS_PER_METER   // pixels per meter (depth - shown as height in 2D)
    const stageWidthPx = stageWidth * PIXELS_PER_METER
    const stageHeightPx = stageHeight * PIXELS_PER_METER
    
    const newItem = {
      id: Date.now() + '_' + Math.random().toString(36).slice(2),
      type: 'riser',
      x: Math.round((stageWidthPx / 2) / gridSize) * gridSize,
      y: Math.round((stageHeightPx / 2) / gridSize) * gridSize,
      rotation: 0,
      w: pixelWidth,
      h: pixelDepth,
      color: '#6B7280',
      shape: 'rect',
      label: `${t('stageplot.equipment.riser')} ${riserWidth}×${riserDepth}m (H:${riserHeight}m)`,
      measurements: { 
        width: `${riserWidth}m`, 
        depth: `${riserDepth}m`,
        height: `${riserHeight}m`
      }
    }
    setItems(prev => [...prev, newItem])
    setShowRiserCustomization(false)
    
    // Clear search after adding riser for better UX
    if (searchTerm) {
      setSearchTerm('')
    }
  }

  const startDrag = (id, e) => {
    e.preventDefault()
    const startX = e.clientX
    const startY = e.clientY
    setSelectedId(id)
    const itemIndex = items.findIndex(i => i.id === id)
    if (itemIndex < 0) return
    const startItem = items[itemIndex]
    const onMove = (ev) => {
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY
      setItems(prev => prev.map((it, idx) => idx === itemIndex ? {
        ...it,
        x: snap(startItem.x + dx),
        y: snap(startItem.y + dy)
      } : it))
    }
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const snap = (v) => Math.max(0, Math.min(Math.round(v / gridSize) * gridSize, 10000))

  const deleteSelected = () => {
    if (!selectedId) return
    setItems(prev => prev.filter(it => it.id !== selectedId))
    setSelectedId(null)
  }

  const startEditLabel = (itemId, currentLabel) => {
    setEditingLabel(itemId)
    setEditingText(currentLabel)
  }

  const saveEditLabel = () => {
    if (!editingLabel) return
    setItems(prev => prev.map(item => 
      item.id === editingLabel 
        ? { ...item, label: editingText }
        : item
    ))
    setEditingLabel(null)
    setEditingText('')
  }

  const cancelEditLabel = () => {
    setEditingLabel(null)
    setEditingText('')
  }

  const exportPNG = async () => {
    try {
      const svgEl = svgRef.current
      if (!svgEl) return null
      const serializer = new XMLSerializer()
      const svgString = serializer.serializeToString(svgEl)
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(svgBlob)
      const img = new Image()
      const dataUrl = await new Promise((resolve, reject) => {
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas')
            canvas.width = stageWidth * PIXELS_PER_METER
            canvas.height = stageHeight * PIXELS_PER_METER
            const ctx = canvas.getContext('2d')
            ctx.fillStyle = '#111827'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, 0, 0)
            resolve(canvas.toDataURL('image/png'))
          } catch (e) { reject(e) }
        }
        img.onerror = reject
        img.src = url
      })
      URL.revokeObjectURL(url)
      return dataUrl
    } catch (e) {
      return null
    }
  }

  const handleSave = async () => {
    try {
      const png = await exportPNG()
      if (!png) {
        alert('Error: Could not generate stage plot image.')
        return
      }

      // For new riders, we'll pass the PNG data back to the General Data tab
      if (!riderId || riderId === 'new') {
        // Check if we were editing and preserve existing data if no changes were made
        let shouldUpdate = true
        if (isEdit) {
          try {
            const editData = sessionStorage.getItem('riderForge_editStagePlot')
            if (editData) {
              const { layout: originalLayout } = JSON.parse(editData)
              const currentLayout = {
                items, 
                bandName,
                gridSize,
                stageWidthMeters: stageWidth,
                stageHeightMeters: stageHeight,
                canvasW: stageWidth * PIXELS_PER_METER,
                canvasH: stageHeight * PIXELS_PER_METER,
                notes,
                v: 1 
              }
              
              // Compare layouts to see if changes were made
              const layoutsEqual = JSON.stringify(originalLayout) === JSON.stringify(currentLayout)
              if (layoutsEqual) {
                shouldUpdate = false
                console.log('No changes detected, preserving existing stage plot')
              }
            }
          } catch (error) {
            console.error('Error comparing layouts:', error)
          }
        }
        
        if (shouldUpdate) {
          // Store the PNG data in sessionStorage to pass back to the form
          sessionStorage.setItem('riderForge_generatedStagePlot', JSON.stringify({
            data: png,
            bandName: bandName || 'Generated Stage Plot',
            timestamp: Date.now(),
            isGenerated: true,
            layout: {
              items, 
              bandName,
              gridSize,
              stageWidthMeters: stageWidth,
              stageHeightMeters: stageHeight,
              canvasW: stageWidth * PIXELS_PER_METER,
              canvasH: stageHeight * PIXELS_PER_METER,
              notes,
              v: 1 
            }
          }))
          
          alert('Stage plot generated successfully! Returning to rider form...')
        } else {
          // No changes made, but we still need to preserve the existing stage plot
          // Get the original data and store it back
          try {
            const editData = sessionStorage.getItem('riderForge_editStagePlot')
            if (editData) {
              const { layout: originalLayout } = JSON.parse(editData)
              // Store the original data back to preserve the stage plot
              sessionStorage.setItem('riderForge_generatedStagePlot', JSON.stringify({
                data: originalLayout.data || png, // Use original PNG or current PNG
                bandName: originalLayout.bandName || bandName || 'Generated Stage Plot',
                timestamp: Date.now(),
                isGenerated: true,
                layout: originalLayout
              }))
            }
          } catch (error) {
            console.error('Error preserving original stage plot:', error)
          }
          
          alert('No changes made. Returning to rider form...')
        }
        
        // Clear edit data if we were editing
        if (isEdit) {
          sessionStorage.removeItem('riderForge_editStagePlot')
        }
        
        // Navigate back to the General Data tab
        navigate('/riders/new/dados-gerais')
        return
      }

      // For existing riders, save to the stage plot system
      if (!canSaveStageplot(riderId)) {
        throw new Error(
          isPro 
            ? 'Cannot save stage plot' 
            : 'Free version limit reached. Maximum 2 riders (and therefore 2 stage plots).'
        )
      }

      const layout = { 
        items, 
        bandName,
        gridSize,
        stageWidthMeters: stageWidth,
        stageHeightMeters: stageHeight,
        canvasW: stageWidth * PIXELS_PER_METER,
        canvasH: stageHeight * PIXELS_PER_METER,
        notes,
        v: 1 
      }

      // Check if stage plot already exists for this rider
      const existingStageplot = getStageplotByRiderId(riderId)
      
      let savedStageplot
      if (existingStageplot) {
        // Update existing stage plot
        savedStageplot = updateStageplot(riderId, { png, layout })
      } else {
        // Save new stage plot
        savedStageplot = saveStageplot(riderId, { png, layout })
      }

      alert('Stage plot saved successfully to rider!')
      
      // Navigate back to rider
      navigate(`/riders/${riderId}`)
      
    } catch (error) {
      alert(`Error saving stage plot: ${error.message}`)
    }
  }

  const clearAll = () => {
    if (window.confirm(t('stageplot.confirmClearAll'))) {
      setItems([])
      setSelectedId(null)
    }
  }

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedId) return
      const selectedItem = items.find(i => i.id === selectedId)
      if (!selectedItem) return

      let newX = selectedItem.x
      let newY = selectedItem.y

      switch (e.key) {
        case 'Delete':
        case 'Backspace':
          e.preventDefault()
          deleteSelected()
          break
        case 'ArrowLeft':
          e.preventDefault()
          newX = Math.max(0, selectedItem.x - gridSize)
          break
        case 'ArrowRight':
          e.preventDefault()
          newX = Math.min((stageWidth * PIXELS_PER_METER) - selectedItem.w, selectedItem.x + gridSize)
          break
        case 'ArrowUp':
          e.preventDefault()
          newY = Math.max(0, selectedItem.y - gridSize)
          break
        case 'ArrowDown':
          e.preventDefault()
          newY = Math.min((stageHeight * PIXELS_PER_METER) - selectedItem.h, selectedItem.y + gridSize)
          break
        default:
          return
      }

      if (newX !== selectedItem.x || newY !== selectedItem.y) {
        setItems(prev => prev.map(it => 
          it.id === selectedId 
            ? { ...it, x: newX, y: newY }
            : it
        ))
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedId, items, gridSize, stageWidth, stageHeight])

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="bg-dark-800 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <button 
                onClick={() => navigate('/riders/new/dados-gerais')}
                className="hover:text-gray-200 transition-colors"
              >
                {t('stageplot.riderCreator')}
              </button>
              <span>/</span>
              <span className="text-gray-200">{t('stageplot.title')}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={clearAll}
                className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                {t('stageplot.clearAll')}
              </button>
              <button
                onClick={() => navigate('/riders/new/dados-gerais')}
                className="px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors"
              >
                {t('stageplot.backToRiderCreator')}
              </button>
                            <button 
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
{isEdit ? 'Update & Return to Form' : (!riderId || riderId === 'new' ? 'Generate & Return to Form' : 'Save to Rider')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-700 bg-gray-800 flex flex-col">
          <div className="p-4 space-y-4 overflow-y-auto flex-1">
            {/* Band Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('stageplot.bandName')}</label>
              <input
                type="text"
                value={bandName}
                onChange={(e) => setBandName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100"
                placeholder={t('stageplot.bandNamePlaceholder')}
              />
            </div>

            {/* Grid Size */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('stageplot.gridSize')}: {gridSize}px</label>
              <input
                type="range"
                min="10"
                max="50"
                value={gridSize}
                onChange={(e) => setGridSize(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Stage Size */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Stage Size: {stageWidth}m × {stageHeight}m (W × D)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Width (meters)</label>
                  <input
                    type="number"
                    value={stageWidth}
                    onChange={(e) => setStageWidth(Math.max(4, parseFloat(e.target.value) || 4))}
                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-gray-100 text-sm"
                    min="4"
                    max="50"
                    step="0.5"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Depth (meters)</label>
                  <input
                    type="number"
                    value={stageHeight}
                    onChange={(e) => setStageHeight(Math.max(3, parseFloat(e.target.value) || 3))}
                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-gray-100 text-sm"
                    min="3"
                    max="50"
                    step="0.5"
                  />
                </div>
              </div>
            </div>

            {/* Zoom Control */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Zoom: {Math.round(zoom * 100)}%
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}
                  className="px-2 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors text-sm"
                >
                  -
                </button>
                <input
                  type="range"
                  min="0.25"
                  max="2"
                  step="0.25"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1"
                />
                <button
                  onClick={() => setZoom(Math.min(2, zoom + 0.25))}
                  className="px-2 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors text-sm"
                >
                  +
                </button>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>25%</span>
                <span>100%</span>
                <span>200%</span>
              </div>
              <button
                onClick={() => {
                  const optimalZoom = calculateOptimalZoom()
                  setZoom(optimalZoom)
                }}
                className="w-full mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
              >
                Fit to Screen
              </button>
            </div>

            {/* Equipment Palette */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3">{t('stageplot.equipment')}</h4>
              
              {/* Search Input */}
              <div className="mb-3">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 pl-9 bg-gray-700 border border-gray-600 rounded text-gray-100 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('stageplot.searchEquipment')}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {filteredPalette.length > 0 ? (
                  filteredPalette.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleDropFromPalette(p)}
                    className="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded border border-gray-600 flex items-center gap-3"
                  >
                    <div 
                      className="w-6 h-6 flex items-center justify-center rounded"
                      style={{ backgroundColor: p.color }}
                    >
                      <div className="text-white">
                        {p.icon}
                      </div>
                    </div>
                    {p.label}
                  </button>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <p className="text-sm">{t('stageplot.noEquipmentFound')}</p>
                    <p className="text-xs mt-1">{t('stageplot.tryDifferentSearch')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Notes and Observations */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('stageplot.notesObservations')}</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 text-sm resize-none"
                rows="4"
                placeholder={t('stageplot.notesPlaceholder')}
              />
            </div>
          </div>

          {/* Instructions - Fixed at bottom */}
          <div className="p-4 border-t border-gray-700">
            <div className="text-xs text-gray-400 space-y-1">
              <p>• {t('stageplot.clickToAdd')}</p>
              <p>• {t('stageplot.dragToMove')}</p>
              <p>• {t('stageplot.clickToSelect')}</p>
              <p>• Double-click labels to edit</p>
              <p>• {t('stageplot.arrowKeys')}</p>
              <p>• {t('stageplot.deleteKey')}</p>
              <p>• {t('stageplot.risersShowMeasurements')}</p>
              <p>• Default zoom is 100%</p>
              <p>• Use "Fit to Screen" to auto-fit</p>
              <p>• Use zoom controls for detail work</p>
            </div>
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 bg-gray-900 overflow-auto p-6">
          <div className="w-full h-full flex items-center justify-center min-h-0">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-2xl w-full h-full max-w-full max-h-full flex items-center justify-center">
              <svg 
                ref={svgRef} 
                width="100%" 
                height="100%" 
                viewBox={`0 0 ${stageWidth * PIXELS_PER_METER} ${stageHeight * PIXELS_PER_METER}`}
                className="border border-gray-600 rounded"
                style={{ 
                  width: '100%',
                  height: '100%',
                  maxWidth: '100%', 
                  maxHeight: '100%',
                  transform: `scale(${zoom})`,
                  transformOrigin: 'center center'
                }}
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Grid */}
                <defs>
                  <pattern id="grid" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
                    <path d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`} fill="none" stroke="#374151" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect x="0" y="0" width={stageWidth * PIXELS_PER_METER} height={stageHeight * PIXELS_PER_METER} fill="#111827" />
                <rect x="0" y="0" width={stageWidth * PIXELS_PER_METER} height={stageHeight * PIXELS_PER_METER} fill="url(#grid)" />

                {/* Items */}
                {items.map((it) => (
                  <g key={it.id} transform={`translate(${it.x}, ${it.y})`}>
                    {it.shape === 'circle' ? (
                      <circle 
                        cx={it.w/2} 
                        cy={it.h/2} 
                        r={Math.max(it.w, it.h) / 2} 
                        fill={it.color} 
                        stroke={selectedId === it.id ? '#FFFFFF' : '#000000'} 
                        strokeWidth={selectedId === it.id ? 3 * EQUIPMENT_SCALE : 1 * EQUIPMENT_SCALE} 
                        onMouseDown={(e) => startDrag(it.id, e)} 
                        onClick={() => setSelectedId(it.id)}
                        style={{ cursor: 'move' }}
                      />
                    ) : (
                      <rect 
                        x="0" 
                        y="0" 
                        width={it.w} 
                        height={it.h} 
                        rx="4" 
                        fill={it.color} 
                        stroke={selectedId === it.id ? '#FFFFFF' : '#000000'} 
                        strokeWidth={selectedId === it.id ? 3 * EQUIPMENT_SCALE : 1 * EQUIPMENT_SCALE} 
                        onMouseDown={(e) => startDrag(it.id, e)} 
                        onClick={() => setSelectedId(it.id)}
                        style={{ cursor: 'move' }}
                      />
                    )}
                    {editingLabel === it.id ? (
                      <foreignObject x={it.w/2 - 75} y={it.h + (5 * EQUIPMENT_SCALE)} width="150" height="40">
                        <div className="flex items-center justify-center w-full h-full">
                          <input
                            type="text"
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEditLabel()
                              if (e.key === 'Escape') cancelEditLabel()
                            }}
                            onBlur={saveEditLabel}
                            className="w-full px-3 py-2 text-sm bg-white text-black border-2 border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ 
                              fontSize: `${12 * (EQUIPMENT_SCALE * 0.6)}px`,
                              color: '#000000',
                              backgroundColor: '#ffffff',
                              border: '2px solid #3b82f6',
                              minHeight: '30px',
                              lineHeight: '1.2'
                            }}
                            autoFocus
                          />
                        </div>
                      </foreignObject>
                    ) : (
                      <text 
                        x={it.w/2} 
                        y={it.h + (14 * EQUIPMENT_SCALE)} 
                        textAnchor="middle" 
                        fontSize={12 * (EQUIPMENT_SCALE * 0.6)} 
                        fill="#E5E7EB"
                        onDoubleClick={() => startEditLabel(it.id, it.label)}
                        style={{ cursor: 'pointer' }}
                        title="Double-click to edit label"
                      >
                        {it.label}
                      </text>
                    )}
                    
                    {/* Show measurements for risers */}
                    {it.measurements && (
                      <text x={it.w/2} y={it.h + (28 * EQUIPMENT_SCALE)} textAnchor="middle" fontSize={10 * (EQUIPMENT_SCALE * 0.6)} fill="#10B981">
                        {it.measurements.width} × {it.measurements.height}
                      </text>
                    )}
                    
                    {/* Selection box */}
                    {selectedId === it.id && (
                      <rect 
                        x={-2 * EQUIPMENT_SCALE} 
                        y={-2 * EQUIPMENT_SCALE} 
                        width={it.w + (4 * EQUIPMENT_SCALE)} 
                        height={it.h + (4 * EQUIPMENT_SCALE)} 
                        fill="none" 
                        stroke="#FFFFFF" 
                        strokeWidth={2 * EQUIPMENT_SCALE} 
                        strokeDasharray={`${5 * EQUIPMENT_SCALE},${5 * EQUIPMENT_SCALE}`}
                        pointerEvents="none"
                      />
                    )}
                  </g>
                ))}

                {/* Notes at bottom */}
                {notes && (
                  <g>
                    <rect 
                      x="10" 
                      y={(stageHeight * PIXELS_PER_METER) - 80} 
                      width={(stageWidth * PIXELS_PER_METER) - 20} 
                      height="70" 
                      fill="#1F2937" 
                      stroke="#374151" 
                      strokeWidth="1" 
                      rx="4"
                    />
                    <text x="20" y={(stageHeight * PIXELS_PER_METER) - 60} fontSize="12" fill="#D1D5DB" fontWeight="bold">
                      Notes & Observations:
                    </text>
                    {notes.split('\n').slice(0, 3).map((line, index) => (
                      <text 
                        key={index}
                        x="20" 
                        y={(stageHeight * PIXELS_PER_METER) - 45 + (index * 14)} 
                        fontSize="10" 
                        fill="#9CA3AF"
                      >
                        {line.slice(0, Math.floor(((stageWidth * PIXELS_PER_METER) - 40) / 6))}
                      </text>
                    ))}
                  </g>
                )}
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Riser Customization Modal */}
      {showRiserCustomization && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">{t('stageplot.customizeRiser')}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('stageplot.widthMeters')}
                </label>
                <input
                  type="number"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={riserWidth}
                  onChange={(e) => setRiserWidth(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('stageplot.depthMeters')}
                </label>
                <input
                  type="number"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={riserDepth}
                  onChange={(e) => setRiserDepth(parseFloat(e.target.value) || 2)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('stageplot.heightElevation')}
                </label>
                <select
                  value={riserHeight}
                  onChange={(e) => setRiserHeight(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100"
                >
                  <option value={0.20}>0.20m (20cm)</option>
                  <option value={0.40}>0.40m (40cm)</option>
                  <option value={0.60}>0.60m (60cm)</option>
                  <option value={1.00}>1.00m (1m)</option>
                </select>
              </div>

              <div className="bg-gray-700/50 rounded p-3">
                <p className="text-sm text-gray-300 mb-2">{t('stageplot.preview')}:</p>
                <div className="flex items-center gap-2">
                  <div 
                    className="bg-gray-600 rounded border border-gray-500 relative"
                    style={{ 
                      width: `${Math.min(riserWidth * 20, 60)}px`, 
                      height: `${Math.min(riserDepth * 20, 60)}px` 
                    }}
                  >
                    {/* Height indicator */}
                    <div className="absolute -bottom-1 -right-1 bg-yellow-600 text-xs px-1 rounded text-white">
                      H:{riserHeight}m
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    <div>{riserWidth}m × {riserDepth}m</div>
                    <div className="text-yellow-400">{t('stageplot.height')}: {riserHeight}m</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRiserCustomization(false)}
                className="flex-1 px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={addCustomRiser}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                {t('stageplot.addRiser')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Stage Plot Creator</h1>
              <p className="text-gray-400">Create professional stage layouts for your performances</p>
            </div>

            {/* Alpha Disclaimer */}
            <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-yellow-400 font-semibold mb-2">Alpha Version Notice</h3>
                  <p className="text-yellow-200 text-sm">
                    This is an <strong>alpha version</strong> of the Stage Plot Creator. Not all features are fully functional yet, 
                    and this is primarily a demonstration of the concept. Some features may not work as expected, 
                    and the interface is still being refined.
                  </p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">What You Can Do:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Add Equipment</h4>
                    <p className="text-gray-400 text-sm">Click equipment from the sidebar to add to your stage</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Drag & Move</h4>
                    <p className="text-gray-400 text-sm">Drag equipment around the stage to position them</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Edit Labels</h4>
                    <p className="text-gray-400 text-sm">Double-click equipment labels to customize them</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Search Equipment</h4>
                    <p className="text-gray-400 text-sm">Use the search bar to quickly find equipment</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Zoom Controls</h4>
                    <p className="text-gray-400 text-sm">Use zoom controls to see details or fit to screen</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Save & Export</h4>
                    <p className="text-gray-400 text-sm">Save your stage plot or generate images</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
              <h3 className="text-white font-semibold mb-3">Keyboard Shortcuts:</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Delete item:</span>
                  <span className="text-white font-mono">Delete/Backspace</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Move item:</span>
                  <span className="text-white font-mono">Arrow Keys</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Save edit:</span>
                  <span className="text-white font-mono">Enter</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Cancel edit:</span>
                  <span className="text-white font-mono">Escape</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowOnboarding(false)}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Start Creating
              </button>
              <button
                onClick={() => {
                  localStorage.setItem('stageplot-onboarding-skipped', 'true')
                  setShowOnboarding(false)
                }}
                className="px-6 py-3 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Skip Tutorial
              </button>
            </div>

            <p className="text-center text-gray-500 text-xs mt-4">
              You can always access this tutorial from the help menu
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default StagePlotCreator
