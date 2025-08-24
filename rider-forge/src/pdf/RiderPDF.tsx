import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer'
import { Table as PdfTable } from './components/Table'
import { Cover } from './components/Cover'
import { Section, BulletList } from './components/Section'
import { Footer as PdfFooter } from './components/Footer'
import { STAND_OPTIONS } from '../data/equipmentLibrary.js'

type RiderPDFProps = {
  rider: any,
  language?: string,
  proBranding?: {
    logoDataUrl?: string
  },
  options?: {
    includeStagePlot?: boolean,
    customFooter?: string,
    colorTheme?: string
  }
}

// Font note: using built-in Helvetica to avoid remote font CORS/format issues during generation.
// To use Inter, place TTF files under /public/fonts and register them via Font.register with local paths.

// Sistema de temas de cores
const COLOR_THEMES = {
  default: {
    primary: '#000000',
    secondary: '#111111',
    accent: '#2CC5B8',
    background: '#FFFFFF',
    surface: '#F6F6F6',
    border: '#DDDDDD',
    text: '#000000',
    textSecondary: '#555555',
    headerBg: '#F7F7F7',
    zebraBg: '#FAFAFA'
  },
  professional: {
    primary: '#1F2937',
    secondary: '#374151',
    accent: '#3B82F6',
    background: '#FFFFFF',
    surface: '#F9FAFB',
    border: '#E5E7EB',
    text: '#1F2937',
    textSecondary: '#6B7280',
    headerBg: '#F3F4F6',
    zebraBg: '#F9FAFB'
  },
  modern: {
    primary: '#0F172A',
    secondary: '#334155',
    accent: '#06B6D4',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    border: '#E2E8F0',
    text: '#0F172A',
    textSecondary: '#64748B',
    headerBg: '#F1F5F9',
    zebraBg: '#F8FAFC'
  },
  elegant: {
    primary: '#2D3748',
    secondary: '#4A5568',
    accent: '#805AD5',
    background: '#FFFFFF',
    surface: '#FAFAFA',
    border: '#E2E8F0',
    text: '#2D3748',
    textSecondary: '#718096',
    headerBg: '#F7FAFC',
    zebraBg: '#FAFAFA'
  },
  dark: {
    primary: '#FFFFFF',
    secondary: '#E2E8F0',
    accent: '#10B981',
    background: '#1F2937',
    surface: '#374151',
    border: '#4B5563',
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    headerBg: '#374151',
    zebraBg: '#4B5563'
  }
}

// Design tokens
const TOKENS = {
  colors: {
    black: '#000000',
    headerGray: '#111111',
    rowGray: '#EEEEEE',
    accent: '#2CC5B8'
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16
  },
  radius: {
    chip: 4
  },
  page: {
    marginMM: 24
  }
}

// Função para obter o tema de cores
const getColorTheme = (themeName: string = 'default') => {
  return COLOR_THEMES[themeName] || COLOR_THEMES.default
}

// Função para criar estilos dinâmicos baseados no tema
const createStyles = (colorTheme: string) => {
  const theme = getColorTheme(colorTheme)
  
  return StyleSheet.create({
    page: {
      fontFamily: 'Helvetica',
      paddingTop: 24 * 2.83465,
      paddingRight: 24 * 2.83465,
      paddingBottom: 24 * 2.83465,
      paddingLeft: 24 * 2.83465,
      fontSize: 10,
      color: theme.text,
      backgroundColor: theme.background
    },
    h1: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: TOKENS.spacing.lg,
      color: theme.primary
    },
    h2: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.secondary,
      marginBottom: TOKENS.spacing.sm
    },
    small: {
      fontSize: 9,
      color: theme.textSecondary
    },
    chip: {
      paddingVertical: 2,
      paddingHorizontal: 6,
      borderRadius: TOKENS.radius.chip,
      backgroundColor: theme.surface
    },
    card: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      padding: TOKENS.spacing.lg,
      marginBottom: TOKENS.spacing.lg,
      backgroundColor: theme.background
    },
    bullet: {
      flexDirection: 'row',
      gap: 6,
      marginBottom: 4
    },
    table: {
      width: '100%',
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 6,
      overflow: 'hidden'
    },
    thead: {
      flexDirection: 'row',
      backgroundColor: theme.headerBg,
      borderBottomWidth: 1,
      borderBottomColor: theme.border
    },
    th: {
      padding: 6,
      fontWeight: 'bold',
      fontSize: 10,
      color: theme.text
    },
    tr: {
      flexDirection: 'row'
    },
    td: {
      padding: 6,
      fontSize: 10,
      color: theme.text
    },
    zebra: {
      backgroundColor: theme.zebraBg
    },
    footer: {
      position: 'absolute',
      left: 24 * 2.83465,
      right: 24 * 2.83465,
      bottom: 16,
      fontSize: 9,
      color: theme.textSecondary,
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  })
}

const formatDate = (dateString?: string) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
  } catch {
    return String(dateString)
  }
}

const SectionCard = ({ title, children, styles }: { title: string, children: React.ReactNode, styles: any }) => (
  <View style={styles.card} wrap={false}>
    <Text style={styles.h2}>{title}</Text>
    <View>
      {children}
    </View>
  </View>
)

const Footer = ({ current, total, customFooter, styles }: { current: number, total: number, customFooter?: string, styles: any }) => (
  <View style={styles.footer} fixed>
    <Text>Rider Forge</Text>
    <Text>{customFooter && customFooter.trim() ? customFooter.trim() : ''}</Text>
    <Text>Página {current} de {total}</Text>
  </View>
)

const LegacyTable = ({ headers, rows, widths, styles }: { headers: string[], rows: Array<Array<string>>, widths: number[], styles: any }) => (
  <View style={styles.table} wrap>
    <View style={styles.thead} fixed>
      {headers.map((h, i) => (
        <View key={i} style={{ width: widths[i], borderRightWidth: i < headers.length - 1 ? 1 : 0, borderRightColor: styles.thead.borderBottomColor }}>
          <Text style={styles.th}>{h}</Text>
        </View>
      ))}
    </View>
    {rows.map((row, rIndex) => (
      <View key={rIndex} style={[styles.tr, rIndex % 2 === 0 ? styles.zebra : {}]} wrap={false}>
        {row.map((cell, cIndex) => (
          <View key={cIndex} style={{ width: widths[cIndex], borderRightWidth: cIndex < row.length - 1 ? 1 : 0, borderRightColor: styles.zebra.backgroundColor }}>
            <Text style={styles.td}>{cell || ''}</Text>
          </View>
        ))}
      </View>
    ))}
  </View>
)

  const RiderPDF: React.FC<RiderPDFProps> = ({ rider, language = 'pt', proBranding, options }) => {
    // Ensure rider data is properly structured
    const safeRider = rider || {}
  // Criar estilos dinâmicos baseados no tema
  const colorTheme = options?.colorTheme || 'default'
  const styles = createStyles(colorTheme)
  const theme = getColorTheme(colorTheme)
  
  // Extract data
  const pa = safeRider?.pa || {}
  const consolas = safeRider?.consolas || {}
  const se = safeRider?.['sistemas-escuta'] || {}
  const ea = safeRider?.['equipamento-auxiliar'] || {}
  const inputList = safeRider?.['input-list']?.inputs || []
  const monitorMixes = safeRider?.['monitor-mixes']?.mixes || []
  const observacoes = safeRider?.['observacoes-finais']?.observacoes || ''

  const standMap: Record<string, string> = Object.fromEntries(
    (Array.isArray(STAND_OPTIONS) ? STAND_OPTIONS : []).map((o: any) => [o.value, o.label])
  )

  const inputRows = inputList.map((i: any) => [
    String(i.canal || ''),
    String(i.fonte || ''),
    String(i.microDi || ''),
    String(standMap[i.stand] || ''),
    i.phantom ? 'Sim' : 'Não'
  ])

  const mixTipo: Record<string, string> = { iem: 'IEM', wedge: 'Wedge', sidefill: 'Side Fill' }
  const mixFormato: Record<string, string> = { mono: 'Mono', stereo: 'Stereo' }

  const computeMixNumber = (mixes: any[], idx: number) => {
    let channelNumber = 1
    for (let i = 0; i < idx; i++) channelNumber += mixes[i]?.formato === 'stereo' ? 2 : 1
    if (mixes[idx]?.formato === 'stereo') return `${channelNumber}/${channelNumber + 1}`
    return `${channelNumber}`
  }

  const mixRows = monitorMixes.map((m: any, idx: number) => [
    computeMixNumber(monitorMixes, idx),
    String(m.instrumentoMusico || ''),
    String(mixTipo[m.tipo] || m.tipo || ''),
    String(mixFormato[m.formato] || m.formato || '')
  ])

  // Função para verificar se há equipamento da banda
  const hasBandEquipment = () => {
    // Verificar PA
    if (pa?.mainSystem?.acceptedSystems?.some((sys: any) => sys.supplier === 'band')) return true
    
    // Verificar Consolas
    if (consolas?.foh?.consolaPreferida?.supplier === 'band') return true
    if (consolas?.mon?.consolaPreferida?.supplier === 'band') return true
    if (consolas?.foh?.outrasConsolas?.some((c: any) => c.supplier === 'band')) return true
    if (consolas?.mon?.outrasConsolas?.some((c: any) => c.supplier === 'band')) return true
    
    // Verificar Sistemas de Escuta
    if (se?.iems?.supplier === 'band') return true
    if (se?.sideFills?.supplier === 'band') return true
    if (se?.wedges?.supplier === 'band') return true
    if (se?.subs?.some((s: any) => s.supplier === 'band')) return true
    
    // Verificar Equipamento Auxiliar
    if (ea?.talkbacks?.supplier === 'band') return true
    if (ea?.intercom?.supplier === 'band') return true
    if (ea?.comunicacaoFohMon?.supplier === 'band') return true
    
    // Verificar Input List - verificar tanto boolean true quanto string 'band'
    if (inputList?.some((input: any) => input.supplier === true || input.supplier === 'band')) return true
    
    return false
  }

  // Dynamic pages based on available content
  const hasPA = Boolean(pa?.mainSystem?.acceptedSystems?.length || pa?.subwoofers?.required || pa?.frontFillRequired || pa?.generalRequirements?.performance || pa?.observacoes)
  const hasFOH = Boolean(consolas?.foh?.consolaPreferida?.marca || consolas?.foh?.outrasConsolas?.length)
  const hasMON = Boolean(consolas?.mon?.consolaPreferida?.marca || consolas?.mon?.outrasConsolas?.length)
  
  const hasSE = Boolean((se?.iems?.quantidade) || (se?.sideFills?.quantidade) || (se?.wedges?.quantidade) || (Array.isArray(se?.subs) && se.subs.length))
  const hasEA = Boolean((ea?.talkbacks?.quantidade) || (ea?.intercom?.quantidade) || (ea?.comunicacaoFohMon?.tipo))
  const hasInput = inputRows.length > 0
  const hasMixes = mixRows.length > 0
  const hasObs = Boolean((observacoes || '').trim())

  const pageBuilders: Array<(i: number, total: number) => React.ReactElement> = []

  // Cover
  const dados = safeRider['dados-gerais'] || {}
  pageBuilders.push((i, total) => (
    <Page key={`p-${i}-capa`} size="A4" style={styles.page}>
      <Cover
        logoDataUrl={proBranding?.logoDataUrl}
        title={dados.artista || 'Artista'}
        // Remove local/data da capa conforme pedido
        subtitle={undefined}
        imageDataUrl={dados?.imagemCapa?.data}
        contacts={{ roadManager: dados.roadManager, foh: dados.foh, mon: dados.mon }}
        version={dados.versaoRider}
        tourYear={dados.anoTour}
      />
      {/* Nota sobre equipamento da banda - só aparece se há equipamento da banda e não há observações finais */}
      {hasBandEquipment() && !hasObs && (
        <View style={{ marginTop: TOKENS.spacing.md, padding: TOKENS.spacing.sm, backgroundColor: styles.zebra.backgroundColor, borderLeft: `3px solid ${theme.accent}`, borderRadius: 4 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: TOKENS.spacing.xs, color: theme.accent }}>
            ⚠️ Equipamento da Banda
          </Text>
          <Text style={{ fontSize: 10, lineHeight: 1.3, color: theme.textSecondary }}>
            Alguns equipamentos especificados neste rider são fornecidos pela banda. 
            Por favor, confirme com a equipa técnica da banda quais equipamentos serão transportados 
            e quais necessitam de ser fornecidos pelo promotor/empresa de aluguer.
          </Text>
        </View>
      )}
      
      <PdfFooter
        render={({ pageNumber, totalPages }) => (
          options?.customFooter && options.customFooter.trim()
            ? `Página ${pageNumber} de ${totalPages} • Rider Forge • ${options.customFooter.trim()}`
            : `Página ${pageNumber} de ${totalPages} • Rider Forge`
        )}
      />
    </Page>
  ))

  // Sections page (only render sections with content). If none, skip.
  if (hasPA || hasFOH || hasMON || hasSE || hasEA) {
    pageBuilders.push((i, total) => (
      <Page key={`p-${i}-secs`} size="A4" style={styles.page}>
        {hasPA && (
          <Section
            title="PA"
            bullets={Array.isArray(pa?.mainSystem?.acceptedSystems) ? pa.mainSystem.acceptedSystems.map((system: any) => {
              if (typeof system === 'string') return system
              if (system && typeof system === 'object' && system.marca && system.modelo) {
                const supplierText = system.supplier === 'band' ? ' (Fornecido pela banda)' : ''
                return `${system.marca} ${system.modelo}${supplierText}`
              }
              return 'Sistema não especificado'
            }) : []}
          >
            {(() => {
              const perf = pa?.generalRequirements?.performance || {}
              const sys = pa?.generalRequirements?.systemConfig || {}
              const cov = pa?.generalRequirements?.coverage || {}
              const proc = pa?.generalRequirements?.processing || {}
              const subs = pa?.subwoofers || {}

              const yesNo = (v: any) => (v ? 'Sim' : 'Não')

              const perfItems: string[] = []
              if (perf?.splAtFOH) perfItems.push(`• SPL na Régie: ${perf.splAtFOH} ${perf.splUnit || ''}`)
              if (perf?.uniformity) perfItems.push(`• Uniformidade: ${perf.uniformity} ${perf.uniformityUnit || ''}`)
              if (perf?.frequencyResponse?.low || perf?.frequencyResponse?.high) perfItems.push(`• Resposta em frequência: ${perf.frequencyResponse?.low || '?'}–${perf.frequencyResponse?.high || '?'} ${perf.frequencyResponse?.unit || ''}`)
              if (typeof perf?.phaseAlignment === 'boolean' && perf.phaseAlignment) perfItems.push(`• Sistemas alinhados em fase`)
              if (typeof perf?.noiseFree === 'boolean' && perf.noiseFree) perfItems.push(`• Sistemas isentos de ruído`)

              const sysItems: string[] = []
              if (typeof sys?.lineArrayRequired === 'boolean' && sys.lineArrayRequired) sysItems.push(`• Sistema Line Array (OBRIGATÓRIO)`)
              if (typeof sys?.suspensionRequired === 'boolean' && sys.suspensionRequired) sysItems.push(`• Sistema sempre suspenso (OBRIGATÓRIO)`)
              if (typeof sys?.towerMounting === 'boolean' && sys.towerMounting) sysItems.push(`• Montagem em torres layer (IMPRESCINDÍVEL)`)

              const covItems: string[] = []
              if (cov?.audienceDepth) covItems.push(`Profundidade: ${cov.audienceDepth} m`)
              if (cov?.audienceWidth) covItems.push(`Largura: ${cov.audienceWidth} m`)
              if (typeof cov?.balconyCoverage === 'boolean') covItems.push(`Cobertura de balcão: ${yesNo(cov.balconyCoverage)}`)
              if (typeof cov?.underBalcony === 'boolean') covItems.push(`Cobertura sob balcão: ${yesNo(cov.underBalcony)}`)
              if (typeof cov?.delayZones === 'number') covItems.push(`Zonas de delay: ${cov.delayZones}`)
              if (cov?.coverageNotes) covItems.push(`Notas: ${cov.coverageNotes}`)

              const procItems: string[] = []
              if (proc?.systemProcessor) procItems.push(`Processador: ${proc.systemProcessor}`)
              if (typeof proc?.roomTuning === 'boolean') procItems.push(`Room tuning: ${yesNo(proc.roomTuning)}`)
              if (typeof proc?.autoAlignment === 'boolean') procItems.push(`Auto-alinhamento: ${yesNo(proc.autoAlignment)}`)
              if (proc?.measurementSystem) procItems.push(`Sistema de medição: ${proc.measurementSystem}`)
              if (proc?.processingNotes) procItems.push(`Notas: ${proc.processingNotes}`)

              const subsItems: string[] = []
              if (typeof subs?.required === 'boolean') subsItems.push(`Requeridos: ${yesNo(subs.required)}`)
              if (subs?.required) {
                if (subs?.mountingTypes) {
                  const m = subs.mountingTypes
                  const tipo = m.cardioide ? 'Cardioide' : m.endFire ? 'End Fire' : m.arcDelay ? 'Arc Delay' : '—'
                  subsItems.push(`Tipo de montagem: ${tipo}`)
                }
                if (typeof subs?.crossoverEnabled === 'boolean') subsItems.push(`Crossover: ${subs.crossoverEnabled ? `ativo em ${subs.crossoverFrequency || ''} Hz` : 'desativado'}`)
                if (subs?.notes) subsItems.push(`Observações: ${subs.notes}`)
              }

              const ffItems: string[] = []
              if (typeof pa?.frontFillRequired === 'boolean') ffItems.push(`Necessário: ${yesNo(pa.frontFillRequired)}`)
              if (pa?.frontFillRequired) {
                if (pa?.frontFillCoverage) ffItems.push(`Cobertura desde 1ª fila: ${pa.frontFillCoverage}`)
                if (pa?.frontFillNotes) ffItems.push(`Observações: ${pa.frontFillNotes}`)
              }

              return (
                <View>
                  {perfItems.length ? (
                    <View style={{ marginBottom: TOKENS.spacing.sm }}>
                      <Text style={{ fontWeight: 'bold' }}>Especificações de performance</Text>
                      <BulletList items={perfItems} />
                    </View>
                  ) : null}

                  {sysItems.length ? (
                    <View style={{ marginBottom: TOKENS.spacing.sm }}>
                      <Text style={{ fontWeight: 'bold' }}>Configuração do sistema</Text>
                      <BulletList items={sysItems} />
                    </View>
                  ) : null}

                  {covItems.length ? (
                    <View style={{ marginBottom: TOKENS.spacing.sm }}>
                      <Text style={{ fontWeight: 'bold' }}>Cobertura</Text>
                      <BulletList items={covItems} />
                    </View>
                  ) : null}

                  {procItems.length ? (
                    <View style={{ marginBottom: TOKENS.spacing.sm }}>
                      <Text style={{ fontWeight: 'bold' }}>Processamento e controlo</Text>
                      <BulletList items={procItems} />
                    </View>
                  ) : null}

                  {subsItems.length ? (
                    <View style={{ marginBottom: TOKENS.spacing.sm }}>
                      <Text style={{ fontWeight: 'bold' }}>Subwoofers</Text>
                      <BulletList items={subsItems} />
                    </View>
                  ) : null}

                  {ffItems.length ? (
                    <View style={{ marginBottom: TOKENS.spacing.sm }}>
                      <Text style={{ fontWeight: 'bold' }}>In/Front Fill</Text>
                      <BulletList items={ffItems} />
                    </View>
                  ) : null}

                  {pa?.riggingNotes ? (
                    <View style={{ marginBottom: TOKENS.spacing.sm }}>
                      <Text style={{ fontWeight: 'bold' }}>Rigging</Text>
                      <Text>{pa.riggingNotes}</Text>
                    </View>
                  ) : null}

                  {pa?.observacoes ? (
                    <View style={{ marginBottom: TOKENS.spacing.sm }}>
                      <Text style={{ fontWeight: 'bold' }}>Observações gerais</Text>
                      <Text>{pa.observacoes}</Text>
                    </View>
                  ) : null}
                </View>
              )
            })()}
          </Section>
        )}

        {hasFOH && (
          <Section title="FOH">
            <View>
              {consolas?.foh?.consolaPreferida?.marca ? (
                <Text>
                  <Text style={{ fontWeight: 'bold' }}>Consola preferida: </Text>
                  {consolas.foh.consolaPreferida.marca || ''} {consolas.foh.consolaPreferida.modelo || ''}
                  {consolas.foh.consolaPreferida.observacoes ? ` — ${consolas.foh.consolaPreferida.observacoes}` : ''}
                  {consolas.foh.consolaPreferida.supplier === 'band' ? ` (Fornecido pela banda)` : ''}
                </Text>
              ) : null}
              {Array.isArray(consolas?.foh?.outrasConsolas) && consolas.foh.outrasConsolas.length > 0 ? (
                <View style={{ marginTop: 4 }}>
                  <Text style={styles.small}><Text style={{ fontWeight: 'bold' }}>Alternativas aceites:</Text></Text>
                  <BulletList items={consolas.foh.outrasConsolas.map((c: any) => {
                    if (c && typeof c === 'object' && c.marca && c.modelo) {
                      const supplierText = c.supplier === 'band' ? ' (Fornecido pela banda)' : ''
                      return `${c.marca} ${c.modelo}${c.observacoes ? ` — ${c.observacoes}` : ''}${supplierText}`
                    }
                    return 'Consola não especificada'
                  })} />
                </View>
              ) : null}
            </View>
          </Section>
        )}

        {hasMON && (
          <Section title="MON">
            <View>
              {consolas?.mon?.consolaPreferida?.marca ? (
                <Text>
                  <Text style={{ fontWeight: 'bold' }}>Consola preferida: </Text>
                  {consolas.mon.consolaPreferida.marca || ''} {consolas.mon.consolaPreferida.modelo || ''}
                  {consolas.mon.consolaPreferida.observacoes ? ` — ${consolas.mon.consolaPreferida.observacoes}` : ''}
                  {consolas.mon.consolaPreferida.supplier === 'band' ? ` (Fornecido pela banda)` : ''}
                </Text>
              ) : null}
              {Array.isArray(consolas?.mon?.outrasConsolas) && consolas.mon.outrasConsolas.length > 0 ? (
                <View style={{ marginTop: 4 }}>
                  <Text style={styles.small}><Text style={{ fontWeight: 'bold' }}>Alternativas aceites:</Text></Text>
                  <BulletList items={consolas.mon.outrasConsolas.map((c: any) => {
                    if (c && typeof c === 'object' && c.marca && c.modelo) {
                      const supplierText = c.supplier === 'band' ? ' (Fornecido pela banda)' : ''
                      return `${c.marca} ${c.modelo}${c.observacoes ? ` — ${c.observacoes}` : ''}${supplierText}`
                    }
                    return 'Consola não especificada'
                  })} />
                </View>
              ) : null}
            </View>
          </Section>
        )}

        {hasSE && (() => {
              const items: string[] = []
              
              if (se?.iems?.quantidade) {
                const supplierText = se.iems.supplier === 'band' ? ' (Fornecido pela banda)' : ''
                items.push(`${se.iems.quantidade}x ${se.iems.modeloPreferido || 'IEMs'}${supplierText}`)
              }
              if (se?.sideFills?.quantidade) {
                const supplierText = se.sideFills.supplier === 'band' ? ' (Fornecido pela banda)' : ''
                items.push(`${se.sideFills.quantidade}x ${se.sideFills.modelo || 'Side Fills'}${supplierText}`)
              }
              if (se?.wedges?.quantidade) {
                const supplierText = se.wedges.supplier === 'band' ? ' (Fornecido pela banda)' : ''
                items.push(`${se.wedges.quantidade}x ${se.wedges.modelo || 'Wedges'}${supplierText}`)
              }
              if (Array.isArray(se?.subs)) se.subs.forEach((s: any) => {
                const supplierText = s.supplier === 'band' ? ' (Fornecido pela banda)' : ''
                items.push(`${s.quantidade}x ${s.modelo || 'Subs'}${s.paraInstrumento ? ` (${s.paraInstrumento})` : ''}${s.observacoes ? ` — ${s.observacoes}` : ''}${supplierText}`)
              })
              
          return (
            <Section title="Sistemas de Escuta" bullets={items}>
              {se?.observacoes ? (
                <View style={{ marginTop: TOKENS.spacing.xs }}>
                  <Text style={styles.small}>Observações:</Text>
                  <Text>{se.observacoes}</Text>
                </View>
              ) : null}
            </Section>
          )
            })()}

        {hasEA && (() => {
              const items: string[] = []
              if (ea?.talkbacks?.quantidade) {
                const supplierText = ea.talkbacks.supplier === 'band' ? ' (Fornecido pela banda)' : ''
                items.push(`${ea.talkbacks.quantidade}x ${ea.talkbacks.modelo || 'Talkbacks'}${supplierText}`)
              }
              if (ea?.intercom?.quantidade) {
                const supplierText = ea.intercom.supplier === 'band' ? ' (Fornecido pela banda)' : ''
                items.push(`${ea.intercom.quantidade}x ${ea.intercom.modelo || 'Intercom'}${supplierText}`)
              }
              if (ea?.comunicacaoFohMon?.tipo) {
                const supplierText = ea.comunicacaoFohMon.supplier === 'band' ? ' (Fornecido pela banda)' : ''
                items.push(`Comunicação FOH/MON: ${ea.comunicacaoFohMon.tipo}${ea.comunicacaoFohMon.observacoes ? ` — ${ea.comunicacaoFohMon.observacoes}` : ''}${supplierText}`)
              }
          return (
            <Section title="Equipamento Auxiliar" bullets={items}>
              {ea?.observacoes ? (
                <View style={{ marginTop: TOKENS.spacing.xs }}>
                  <Text style={styles.small}>Observações:</Text>
                  <Text>{ea.observacoes}</Text>
                </View>
              ) : null}
            </Section>
          )
            })()}

        <PdfFooter
          render={({ pageNumber, totalPages }) => (
            options?.customFooter && options.customFooter.trim()
              ? `Página ${pageNumber} de ${totalPages} • Rider Forge • ${options.customFooter.trim()}`
              : `Página ${pageNumber} de ${totalPages} • Rider Forge`
          )}
        />
      </Page>
    ))
  }

  if (hasInput) {
    pageBuilders.push((i, total) => (
      <Page key={`p-${i}-inputs`} size="A4" style={styles.page}>
        <Text style={styles.h2}>Input List</Text>
        {(() => {
          const columns = [
            { widthPercent: 9,  align: 'center' as const }, // Canal (+1%)
            { widthPercent: 26 },                           // Fonte
            { widthPercent: 22 },                           // Micro/DI
            { widthPercent: 12, align: 'center' as const }, // Stand
            { widthPercent: 11, align: 'center' as const }, // Phantom (+1% to avoid wrap)
            { widthPercent: 20, truncateLines: 3 },         // Notas
          ]

          const rows6 = (inputRows || []).map((r: Array<string>) => [
            r[0] ?? '',
            r[1] ?? '',
            r[2] ?? '',
            r[3] ?? '',
            r[4] ?? '',
            '', // Notas (sem dados por agora)
          ])

          return (
            <>
              <PdfTable
                columns={columns}
                headers={[ 'Canal', 'Fonte', 'Micro/DI', 'Stand', 'Phantom', 'Notas' ]}
                rows={rows6}
                rowsPerPage={22}
                rowMinHeight={18}
              />
              
              {/* Nota sobre equipamento fornecido pelo artista */}
              {(() => {
                const bandEquipment = inputList.filter((input: any) => input.supplier === true || input.supplier === 'band')
                if (bandEquipment.length > 0) {
                  // Melhorar detecção de microfones - verificar se contém marcas conhecidas de microfones
                  const microphoneBrands = ['Shure', 'Sennheiser', 'Neumann', 'AKG', 'Audix', 'DPA', 'Rode', 'Electro-Voice', 'Telefunken', 'Universal Audio']
                  const bandMicrophones = bandEquipment.filter((input: any) => {
                    if (!input.microDi) return false
                    
                    // Verificar se contém marcas conhecidas de microfones
                    const hasMicrophoneBrand = microphoneBrands.some(brand => input.microDi.includes(brand))
                    
                    // Verificar se não é DI ou XLR
                    const isNotDI = !input.microDi.includes('DI')
                    const isNotXLR = !input.microDi.includes('XLR')
                    
                    return hasMicrophoneBrand && isNotDI && isNotXLR
                  })
                  const bandDIs = bandEquipment.filter((input: any) => {
                    if (!input.microDi) return false
                    
                    // Verificar se contém "DI" no nome
                    const hasDI = input.microDi.includes('DI')
                    
                    // Verificar se contém marcas conhecidas de DI
                    const diBrands = ['Radial', 'Countryman', 'Palmer', 'BSS', 'Whirlwind', 'Pro Co', 'Behringer', 'ART']
                    const hasDIBrand = diBrands.some(brand => input.microDi.includes(brand))
                    
                    return hasDI || hasDIBrand
                  })
                  const bandXLR = bandEquipment.filter((input: any) => 
                    input.microDi && input.microDi.includes('XLR')
                  )
                  
                  return (
                    <View style={{ marginTop: TOKENS.spacing.md, padding: TOKENS.spacing.sm, backgroundColor: styles.zebra.backgroundColor, borderLeft: `3px solid ${theme.accent}`, borderRadius: 4 }}>
                      <Text style={{ fontWeight: 'bold', marginBottom: TOKENS.spacing.xs, color: theme.accent }}>
                        Equipamento fornecido pelo artista:
                      </Text>
                      {(() => {
                        const items: string[] = []
                        
                        // Função para agrupar equipamentos por nome e contar quantidades
                        const groupEquipment = (equipmentList: any[]) => {
                          const grouped: { [key: string]: number } = {}
                          equipmentList.forEach((input: any) => {
                            const name = input.microDi
                            grouped[name] = (grouped[name] || 0) + 1
                          })
                          return grouped
                        }
                        
                        if (bandMicrophones.length > 0) {
                          const groupedMics = groupEquipment(bandMicrophones)
                          const micItems = Object.entries(groupedMics).map(([name, count]) => 
                            count > 1 ? `${count}x "${name}"` : `"${name}"`
                          )
                          items.push(`• Microfones: ${micItems.join(', ')}`)
                        }
                        
                        if (bandDIs.length > 0) {
                          const groupedDIs = groupEquipment(bandDIs)
                          const diItems = Object.entries(groupedDIs).map(([name, count]) => 
                            count > 1 ? `${count}x "${name}"` : `"${name}"`
                          )
                          items.push(`• DI Boxes: ${diItems.join(', ')}`)
                        }
                        
                        if (bandXLR.length > 0) {
                          items.push(`• Cabos XLR: ${bandXLR.length} unidade(s)`)
                        }
                        
                        return items.map((item, index) => (
                          <Text key={index} style={{ fontSize: 10, lineHeight: 1.3, color: theme.textSecondary, marginBottom: TOKENS.spacing.xs }}>
                            {item}
                          </Text>
                        ))
                      })()}
                    </View>
                  )
                }
                return null
              })()}
            </>
          )
        })()}
        <PdfFooter
          render={({ pageNumber, totalPages }) => (
            options?.customFooter && options.customFooter.trim()
              ? `Página ${pageNumber} de ${totalPages} • Rider Forge • ${options.customFooter.trim()}`
              : `Página ${pageNumber} de ${totalPages} • Rider Forge`
          )}
        />
      </Page>
    ))
  }

  if (hasMixes) {
    pageBuilders.push((i, total) => (
      <Page key={`p-${i}-mixes`} size="A4" style={styles.page}>
        <Text style={styles.h2}>Output List</Text>
        <LegacyTable
          headers={[ 'Mix', 'Instrumento/Músico', 'Tipo', 'Formato' ]}
          widths={[ 60, 240, 100, 90 ]}
          rows={mixRows}
          styles={styles}
        />
        <PdfFooter
          render={({ pageNumber, totalPages }) => (
            options?.customFooter && options.customFooter.trim()
              ? `Página ${pageNumber} de ${totalPages} • Rider Forge • ${options.customFooter.trim()}`
              : `Página ${pageNumber} de ${totalPages} • Rider Forge`
          )}
        />
      </Page>
    ))
  }

  if (hasObs) {
    pageBuilders.push((i, total) => (
      <Page key={`p-${i}-obs`} size="A4" style={styles.page}>
        <Text style={styles.h2}>Observações Finais</Text>
        <Text style={{ lineHeight: 1.4 }}>{observacoes}</Text>
        
        {/* Nota sobre equipamento da banda - só aparece se há equipamento da banda */}
        {hasBandEquipment() && (
          <View style={{ marginTop: TOKENS.spacing.md, padding: TOKENS.spacing.sm, backgroundColor: styles.zebra.backgroundColor, borderLeft: `3px solid ${theme.accent}`, borderRadius: 4 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: TOKENS.spacing.xs, color: theme.accent }}>
              ⚠️ Equipamento da Banda
            </Text>
            <Text style={{ fontSize: 10, lineHeight: 1.3, color: theme.textSecondary }}>
              Alguns equipamentos especificados neste rider são fornecidos pela banda. 
              Por favor, confirme com a equipa técnica da banda quais equipamentos serão transportados 
              e quais necessitam de ser fornecidos pelo promotor/empresa de aluguer.
            </Text>
          </View>
        )}
        
        <PdfFooter
          render={({ pageNumber, totalPages }) => (
            options?.customFooter && options.customFooter.trim()
              ? `Página ${pageNumber} de ${totalPages} • Rider Forge • ${options.customFooter.trim()}`
              : `Página ${pageNumber} de ${totalPages} • Rider Forge`
          )}
        />
      </Page>
    ))
  }

  // Stage Plot page (optional)
  const hasStagePlot = Boolean(rider?.['dados-gerais']?.stagePlot?.data) && options?.includeStagePlot
  if (hasStagePlot) {
    pageBuilders.push((i, total) => (
      <Page key={`p-${i}-stage`} size="A4" style={styles.page}>
        <Text style={styles.h2}>Stage Plot</Text>
        <View style={{ alignItems: 'center', marginTop: TOKENS.spacing.md }}>
          <Image
            src={{ uri: rider['dados-gerais'].stagePlot.data }}
            style={{ width: '100%', height: 500, objectFit: 'contain', borderRadius: 6 }}
          />
        </View>
        <Footer current={i} total={total} customFooter={options?.customFooter} styles={styles} />
      </Page>
    ))
  }

  const total = pageBuilders.length
  return (
    <Document>
      {pageBuilders.map((build, idx) => build(idx + 1, total))}
    </Document>
  )
}

export default RiderPDF