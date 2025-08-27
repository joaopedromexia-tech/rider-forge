import React from 'react'
import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { getPDFTranslation } from '../translations.ts'

export interface SectionProps {
  title: string
  accentColor?: string
  children?: React.ReactNode
  bullets?: string[]
  language?: string
}

const TOKENS = {
  spacing: { xs: 4, sm: 8, md: 12, lg: 16 },
  colors: { header: '#111111', accent: '#2CC5B8' },
}

const styles = StyleSheet.create({
  container: {
    marginBottom: TOKENS.spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: TOKENS.spacing.sm,
  },
  accentBar: {
    width: 4,
    height: 18,
    borderRadius: 2,
    marginRight: TOKENS.spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: TOKENS.colors.header,
  },
  bullets: {
    marginTop: TOKENS.spacing.xs,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  bulletDot: {
    marginRight: 6,
  },
  bulletText: {
    fontSize: 10,
    lineHeight: 1.2,
  },
})

export const BulletList: React.FC<{ items: string[] }> = ({ items }) => (
  <View style={styles.bullets}>
    {items.map((t, i) => (
      <View key={i} style={styles.bulletRow} wrap={false}>
        <Text style={styles.bulletDot}>•</Text>
        <Text style={styles.bulletText}>{t}</Text>
      </View>
    ))}
  </View>
)

export const Section: React.FC<SectionProps> = ({ title, accentColor = TOKENS.colors.accent, children, bullets, language = 'pt' }) => {
  const suggested = getPDFTranslation(language, 'texts', 'suggestedBrandsModels') || 'Marcas e modelos sugeridos'
  return (
    <View style={styles.container}>
      <View style={styles.titleRow} wrap={false}>
        <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
        <Text style={styles.title}>{title}</Text>
      </View>
      {bullets && bullets.length ? (
        <View>
          <Text style={{ fontWeight: 'bold', marginBottom: TOKENS.spacing.xs }}>{suggested}</Text>
          <BulletList items={bullets} />
        </View>
      ) : null}
      {children}
    </View>
  )
}

export default Section


