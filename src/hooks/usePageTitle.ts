import { useEffect } from 'react'

export function usePageTitle(title: string) {
  const pathname=window.location.pathname
  useEffect(() => {
    document.title = title
    const url=`https://xiaotianaya.com${pathname}`
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href',url)
    document.querySelector('meta[property="og:url"]')?.setAttribute('content',url)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content',title)
    return () => {
      document.title = '小天Aya'
    }
  }, [title,pathname])
}
