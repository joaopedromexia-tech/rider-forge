import React from 'react'
import { View, Text, StyleSheet } from '@react-pdf/renderer'

export interface FooterProps {
  render?: (args: { pageNumber: number; totalPages: number }) => string | React.ReactNode
  left?: number
  right?: number
  bottom?: number
}

const MM = 2.83465

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 24 * MM,
    right: 24 * MM,
    bottom: 16,
    fontSize: 9,
    color: '#555555',
    flexDirection: 'row',
    justifyContent: 'center',
  },
})

export const Footer: React.FC<FooterProps> = ({ render, left, right, bottom }) => {
  const containerStyle = {
    left: typeof left === 'number' ? left : styles.container.left,
    right: typeof right === 'number' ? right : styles.container.right,
    bottom: typeof bottom === 'number' ? bottom : styles.container.bottom,
  } as const

  return (
    <View style={[styles.container, containerStyle]} fixed>
      <Text
        render={({ pageNumber, totalPages }) => {
          if (typeof render === 'function') {
            const result = render({ pageNumber, totalPages })
            // Text render prop must return string; if node, fallback to default
            if (typeof result === 'string') return result
          }
          return `Página ${pageNumber} de ${totalPages} • Rider Forge`
        }}
      />
    </View>
  )
}

export default Footer


