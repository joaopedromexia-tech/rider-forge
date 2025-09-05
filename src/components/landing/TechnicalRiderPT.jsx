import React, { useEffect } from 'react'
import { usePageSEO } from '../../hooks/useSEO'
import { trackEvent } from '../../utils/analytics'

function TechnicalRiderPT() {
  const pageUrl = 'https://www.riderforge.app/pt/rider-tecnico'

  usePageSEO({
    title: 'O que é um Rider Técnico? Modelos, Input List e Dicas',
    description: 'Entenda o que é um rider técnico, como montar e baixe modelos. Crie input lists, defina backline e hospitalidade. Experimente o Rider Forge grátis.',
    keywords: 'rider técnico, rider banda, input list, backline, hospitalidade, modelo de rider, como fazer rider',
    image: 'https://www.riderforge.app/images/og-technical-rider-pt.png',
    url: pageUrl,
    type: 'article',
    alternates: [
      { hreflang: 'pt', href: pageUrl },
      { hreflang: 'en', href: 'https://www.riderforge.app/technical-rider' },
      { hreflang: 'x-default', href: 'https://www.riderforge.app/technical-rider' }
    ],
    canonical: pageUrl
  })

  useEffect(() => {
    const article = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'O que é um Rider Técnico? Modelos, Input List e Dicas',
      description: 'Entenda o que é um rider técnico, como montar e baixe modelos.',
      inLanguage: 'pt',
      author: {
        '@type': 'Organization',
        name: 'Rider Forge'
      },
      image: ['https://www.riderforge.app/images/og-technical-rider-pt.png'],
      mainEntityOfPage: pageUrl
    }
    const howTo = {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'Como fazer um rider técnico',
      totalTime: 'PT15M',
      step: [
        { '@type': 'HowToStep', name: 'Liste seus canais', text: 'Crie um input list com microfones/DI e observações.' },
        { '@type': 'HowToStep', name: 'Defina o backline', text: 'Especifique amps, bateria, DI e pedestais.' },
        { '@type': 'HowToStep', name: 'Monitores e PA', text: 'Descreva mixes de monitor e notas para FOH.' },
        { '@type': 'HowToStep', name: 'Hospitalidade', text: 'Inclua hospitalidade e requisitos de palco.' }
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
    addJsonLd('jsonld-article-pt', article)
    addJsonLd('jsonld-howto-pt', howTo)
    return () => {
      const ids = ['jsonld-article-pt', 'jsonld-howto-pt']
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
          <h1 className="text-4xl font-bold text-gradient">O que é um Rider Técnico?</h1>
          <p className="text-gray-300 mt-3">Tudo que você precisa: input list, backline, hospitalidade e dicas.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="card p-6">
            <h2 className="text-2xl font-semibold text-white mb-3">Rider Técnico vs Rider de Hospitalidade</h2>
            <table className="w-full text-left text-sm">
              <thead className="text-gray-400">
                <tr>
                  <th className="py-2">Item</th>
                  <th className="py-2">Rider Técnico</th>
                  <th className="py-2">Rider de Hospitalidade</th>
                </tr>
              </thead>
              <tbody className="text-gray-200">
                <tr>
                  <td className="py-2">Objetivo</td>
                  <td className="py-2">Som, palco e necessidades técnicas</td>
                  <td className="py-2">Alimentação, hospedagem e conforto</td>
                </tr>
                <tr>
                  <td className="py-2">Inclui</td>
                  <td className="py-2">Input list, backline, monitores</td>
                  <td className="py-2">Catering, bebidas, camarim</td>
                </tr>
                <tr>
                  <td className="py-2">Responsável</td>
                  <td className="py-2">Banda e técnico</td>
                  <td className="py-2">Banda e tour manager</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="card p-6">
            <h2 className="text-2xl font-semibold text-white mb-3">Comece Agora</h2>
            <ol className="list-decimal list-inside text-gray-200 space-y-2">
              <li>Liste canais e microfones</li>
              <li>Defina DI e pedestais</li>
              <li>Descreva os mixes de monitor</li>
              <li>Anexe observações de backline e hospitalidade</li>
            </ol>
            <button
              className="btn-primary mt-6"
              onClick={() => trackEvent('cta_click', { location: 'lp_pt', cta: 'create_free' })}
            >Crie seu rider grátis</button>
          </div>
        </div>

        <section className="card p-6 mb-10">
          <h2 className="text-2xl font-semibold text-white mb-3">FAQ</h2>
          <div className="space-y-4 text-gray-200">
            <details className="rounded-md">
              <summary className="cursor-pointer text-white">O que é um input list?</summary>
              <p className="mt-2">Uma lista por canal de fontes (voz, guitarras, teclas) com mic/DI e notas.</p>
            </details>
            <details className="rounded-md">
              <summary className="cursor-pointer text-white">Preciso de rider de hospitalidade?</summary>
              <p className="mt-2">Ajuda locais a planejar catering, camarim e horários.</p>
            </details>
          </div>
        </section>

        <nav className="text-center text-sm text-gray-400">
          <a className="hover:text-gray-200" href="/pt">Início</a>
          <span className="mx-2">·</span>
          <a className="hover:text-gray-200" href="/pricing">Preços</a>
          <span className="mx-2">·</span>
          <a className="hover:text-gray-200" href="/faq">FAQ</a>
        </nav>
      </div>
    </div>
  )
}

export default TechnicalRiderPT







