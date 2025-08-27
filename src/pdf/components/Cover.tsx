import React from 'react'
import { View, Text, Image, StyleSheet, Link } from '@react-pdf/renderer'
import { getPDFTranslation } from '../translations.ts'

export interface ContactInfo {
  nome?: string
  telefone?: string
  email?: string
}

export interface CoverProps {
  logoDataUrl?: string
  title: string
  subtitle?: string
  imageDataUrl?: string
  contacts?: {
    roadManager?: ContactInfo
    foh?: ContactInfo
    mon?: ContactInfo
  }
  titleSize?: number // default 36 (within 32–40pt requested)
  version?: string
  tourYear?: string | number
  language?: string
}

const TOKENS = {
  spacing: { xs: 4, sm: 8, md: 12, lg: 16 },
  colors: { header: '#111111' },
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: TOKENS.spacing.lg,
  },
  logo: {
    height: 40,
    width: 'auto',
    marginBottom: TOKENS.spacing.lg,
  },
  title: {
    fontWeight: 'bold',
    color: TOKENS.colors.header,
    marginBottom: TOKENS.spacing.lg,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    marginBottom: TOKENS.spacing.lg,
    textAlign: 'center',
  },
  version: {
    fontSize: 12,
    color: '#444444',
    marginTop: -8,
    marginBottom: TOKENS.spacing.lg,
    textAlign: 'center',
  },
  tourYear: {
    fontSize: 12,
    color: '#444444',
    marginTop: -10,
    marginBottom: TOKENS.spacing.lg,
    textAlign: 'center',
  },
  imageWrapper: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverImage: {
    width: '100%',
    height: 300,
    objectFit: 'contain',
    borderRadius: 6,
  },
  contactsBlock: {
    marginTop: TOKENS.spacing.lg,
    alignItems: 'center',
  },
  contactsTitle: {
    fontWeight: 'bold',
    marginBottom: TOKENS.spacing.sm,
    textAlign: 'center',
  },
  contactLine: {
    marginBottom: 4,
    textAlign: 'center',
  },
})

const ContactLine: React.FC<{ label: string; info?: ContactInfo }> = ({ label, info }) => {
  if (!info || !info.nome) return null
  return (
    <View style={styles.contactLine} wrap={false}>
      <Text>
        <Text style={{ fontWeight: 'bold' }}>{label}: </Text>
        <Text>{info.nome}</Text>
        {info.telefone ? <Text>  •  <Text style={{ fontWeight: 'bold' }}>Tel:</Text> {info.telefone}</Text> : null}
        {info.email ? (
          <Text>
            {'  •  '}<Text style={{ fontWeight: 'bold' }}>Email:</Text> <Link src={`mailto:${info.email}`}>{info.email}</Link>
          </Text>
        ) : null}
      </Text>
    </View>
  )
}

export const Cover: React.FC<CoverProps> = ({ logoDataUrl, title, subtitle, imageDataUrl, contacts, titleSize = 36, version, tourYear, language = 'pt' }) => {
  const telLabel = getPDFTranslation(language, 'texts', 'tel') || 'Tel'
  const emailLabel = getPDFTranslation(language, 'texts', 'email') || 'Email'
  const riderVersionPrefix = getPDFTranslation(language, 'texts', 'riderVersionPrefix') || 'Rider v'
  const tourPrefix = getPDFTranslation(language, 'texts', 'tourPrefix') || 'Tour'
  const contactsTitle = getPDFTranslation(language, 'texts', 'contacts') || 'Contacts'
  const roadManagerLabel = getPDFTranslation(language, 'texts', 'roadManager') || 'Road Manager'
  const fohLabel = getPDFTranslation(language, 'texts', 'fohShort') || 'FOH'
  const monLabel = getPDFTranslation(language, 'texts', 'monShort') || 'MON'

  return (
    <View style={styles.container}>
      <View style={styles.header} wrap={false}>
        {logoDataUrl ? (
          <Image src={logoDataUrl} style={styles.logo} />
        ) : null}
        <Text style={[styles.title, { fontSize: titleSize }]}>{title}</Text>
        {version ? <Text style={styles.version}>{riderVersionPrefix} {version}</Text> : null}
        {tourYear ? <Text style={styles.tourYear}>{tourPrefix} {tourYear}</Text> : null}
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {imageDataUrl ? (
        <View style={styles.imageWrapper}>
          <Image src={{ uri: imageDataUrl }} style={styles.coverImage} />
        </View>
      ) : null}

      {contacts && (contacts.roadManager || contacts.foh || contacts.mon) ? (
        <View style={styles.contactsBlock}>
          <Text style={styles.contactsTitle}>{contactsTitle}</Text>
          {/* Inline labels for tel/email handled within ContactLine above; to localize Tel/Email, render them here */}
          {contacts.roadManager ? (
            <View style={styles.contactLine} wrap={false}>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>{roadManagerLabel}: </Text>
                <Text>{contacts.roadManager.nome}</Text>
                {contacts.roadManager.telefone ? <Text>  •  <Text style={{ fontWeight: 'bold' }}>{telLabel}:</Text> {contacts.roadManager.telefone}</Text> : null}
                {contacts.roadManager.email ? (
                  <Text>
                    {'  •  '}<Text style={{ fontWeight: 'bold' }}>{emailLabel}:</Text> <Link src={`mailto:${contacts.roadManager.email}`}>{contacts.roadManager.email}</Link>
                  </Text>
                ) : null}
              </Text>
            </View>
          ) : null}
          {contacts.foh ? (
            <View style={styles.contactLine} wrap={false}>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>{fohLabel}: </Text>
                <Text>{contacts.foh.nome}</Text>
                {contacts.foh.telefone ? <Text>  •  <Text style={{ fontWeight: 'bold' }}>{telLabel}:</Text> {contacts.foh.telefone}</Text> : null}
                {contacts.foh.email ? (
                  <Text>
                    {'  •  '}<Text style={{ fontWeight: 'bold' }}>{emailLabel}:</Text> <Link src={`mailto:${contacts.foh.email}`}>{contacts.foh.email}</Link>
                  </Text>
                ) : null}
              </Text>
            </View>
          ) : null}
          {contacts.mon ? (
            <View style={styles.contactLine} wrap={false}>
              <Text>
                <Text style={{ fontWeight: 'bold' }}>{monLabel}: </Text>
                <Text>{contacts.mon.nome}</Text>
                {contacts.mon.telefone ? <Text>  •  <Text style={{ fontWeight: 'bold' }}>{telLabel}:</Text> {contacts.mon.telefone}</Text> : null}
                {contacts.mon.email ? (
                  <Text>
                    {'  •  '}<Text style={{ fontWeight: 'bold' }}>{emailLabel}:</Text> <Link src={`mailto:${contacts.mon.email}`}>{contacts.mon.email}</Link>
                  </Text>
                ) : null}
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  )
}

export default Cover


