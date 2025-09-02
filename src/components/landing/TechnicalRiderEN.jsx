import React, { useEffect } from 'react'
import { usePageSEO } from '../../hooks/useSEO'
import { trackEvent } from '../../utils/analytics'

function TechnicalRiderEN() {
  const pageUrl = 'https://www.riderforge.app/technical-rider'

  usePageSEO({
    title: 'What is a Technical Rider? Templates, Input Lists, and Tips',
    description: 'Learn what a technical rider is, how to build one, and get templates. Create input lists, define backline and hospitality. Try Rider Forge for free.',
    keywords: 'technical rider, band rider, input list, backline, hospitality rider, rider template, how to make a rider',
    image: 'https://www.riderforge.app/images/og-technical-rider-en.png',
    url: pageUrl,
    type: 'article',
    alternates: [
      { hreflang: 'en', href: pageUrl },
      { hreflang: 'pt', href: 'https://www.riderforge.app/pt/rider-tecnico' },
      { hreflang: 'x-default', href: pageUrl }
    ],
    canonical: pageUrl
  })

  useEffect(() => {
    const article = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'What is a Technical Rider? Templates, Input Lists, and Tips',
      description: 'Learn what a technical rider is, how to build one, and get templates.',
      inLanguage: 'en',
      author: {
        '@type': 'Organization',
        name: 'Rider Forge'
      },
      image: ['https://www.riderforge.app/images/og-technical-rider-en.png'],
      mainEntityOfPage: pageUrl
    }
    const howTo = {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'How to make a technical rider',
      totalTime: 'PT15M',
      step: [
        { '@type': 'HowToStep', name: 'List your inputs', text: 'Create a channel-by-channel input list.' },
        { '@type': 'HowToStep', name: 'Define backline', text: 'Specify amps, drums, DI boxes, stands.' },
        { '@type': 'HowToStep', name: 'Monitor and FOH', text: 'Describe monitor mixes and FOH notes.' },
        { '@type': 'HowToStep', name: 'Hospitality', text: 'Include hospitality and stage requirements.' }
      ]
    }
    const addJsonLd = (id, data) => {
      let s = document.getElementById(id)
      if (!s) {
        s = document.createElement('script')
        s.type = 'application/ld+json'
        s.id = id
        document.head.appendChild(s)
      }
      s.textContent = JSON.stringify(data)
    }
    addJsonLd('jsonld-article-en', article)
    addJsonLd('jsonld-howto-en', howTo)
    return () => {
      const ids = ['jsonld-article-en', 'jsonld-howto-en']
      ids.forEach((id) => {
        const el = document.getElementById(id)
        if (el && el.parentNode) el.parentNode.removeChild(el)
      })
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gradient">What is a Technical Rider?</h1>
          <p className="text-gray-300 mt-3">Everything you need: input lists, backline, hospitality, and tips.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="card p-6">
            <h2 className="text-2xl font-semibold text-white mb-3">Technical Rider vs Hospitality Rider</h2>
            <table className="w-full text-left text-sm">
              <thead className="text-gray-400">
                <tr>
                  <th className="py-2">Item</th>
                  <th className="py-2">Technical Rider</th>
                  <th className="py-2">Hospitality Rider</th>
                </tr>
              </thead>
              <tbody className="text-gray-200">
                <tr>
                  <td className="py-2">Purpose</td>
                  <td className="py-2">Sound, stage, and tech needs</td>
                  <td className="py-2">Food, lodging, and comfort</td>
                </tr>
                <tr>
                  <td className="py-2">Includes</td>
                  <td className="py-2">Input list, backline, monitors</td>
                  <td className="py-2">Catering, drinks, dressing room</td>
                </tr>
                <tr>
                  <td className="py-2">Owner</td>
                  <td className="py-2">Band and engineer</td>
                  <td className="py-2">Band and tour manager</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="card p-6">
            <h2 className="text-2xl font-semibold text-white mb-3">Quick Start</h2>
            <ol className="list-decimal list-inside text-gray-200 space-y-2">
              <li>List channels and microphones</li>
              <li>Define DI boxes and stands</li>
              <li>Describe monitor mixes</li>
              <li>Attach backline and hospitality notes</li>
            </ol>
            <button
              className="btn-primary mt-6"
              onClick={() => trackEvent('cta_click', { location: 'lp_en', cta: 'create_free' })}
            >Create your rider for free</button>
          </div>
        </div>

        <section className="card p-6 mb-10">
          <h2 className="text-2xl font-semibold text-white mb-3">FAQ</h2>
          <div className="space-y-4 text-gray-200">
            <details className="rounded-md">
              <summary className="cursor-pointer text-white">What is an input list?</summary>
              <p className="mt-2">A per-channel list of sources (vocals, guitars, keys) with mic/DI and notes.</p>
            </details>
            <details className="rounded-md">
              <summary className="cursor-pointer text-white">Do I need a hospitality rider?</summary>
              <p className="mt-2">It helps venues plan catering, dressing rooms, and schedules.</p>
            </details>
          </div>
        </section>

        <nav className="text-center text-sm text-gray-400">
          <a className="hover:text-gray-200" href="/">Home</a>
          <span className="mx-2">·</span>
          <a className="hover:text-gray-200" href="/pricing">Pricing</a>
          <span className="mx-2">·</span>
          <a className="hover:text-gray-200" href="/faq">FAQ</a>
        </nav>
      </div>
    </div>
  )
}

export default TechnicalRiderEN




