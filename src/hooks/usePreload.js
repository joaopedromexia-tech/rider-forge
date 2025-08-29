import { useEffect, useRef } from 'react'

// Hook for intelligent preloading
export const usePreload = (components, delay = 2000) => {
  const preloadedRef = useRef(new Set())

  useEffect(() => {
    const timer = setTimeout(() => {
      components.forEach(component => {
        if (component && !preloadedRef.current.has(component) && component._init) {
          component._init()
          preloadedRef.current.add(component)
        }
      })
    }, delay)

    return () => clearTimeout(timer)
  }, [components, delay])

  return preloadedRef.current
}

// Hook for preloading on hover
export const usePreloadOnHover = (component, enabled = true) => {
  const preloadedRef = useRef(false)

  const handleMouseEnter = () => {
    if (enabled && component && !preloadedRef.current && component._init) {
      component._init()
      preloadedRef.current = true
    }
  }

  return handleMouseEnter
}

// Hook for preloading on intersection
export const usePreloadOnIntersection = (component, enabled = true) => {
  const preloadedRef = useRef(false)

  useEffect(() => {
    if (!enabled || !component || preloadedRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && component._init) {
            component._init()
            preloadedRef.current = true
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )

    // Observe the document body as a fallback
    observer.observe(document.body)

    return () => observer.disconnect()
  }, [component, enabled])

  return preloadedRef.current
}
