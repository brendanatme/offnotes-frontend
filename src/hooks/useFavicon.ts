import { useEffect } from 'react'

export function useFavicon(isOnline: boolean) {
  useEffect(() => {
    const greenImg = new Image()
    const amberImg = new Image()
    greenImg.src = '/favicon-green.svg'
    amberImg.src = '/favicon-amber.svg'
  }, [])

  useEffect(() => {
    const link = document.querySelector('link[rel="icon"]') as HTMLLinkElement
    if (link) {
      link.href = isOnline ? '/favicon-green.svg' : '/favicon-amber.svg'
    }
  }, [isOnline])
}
