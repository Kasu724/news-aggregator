'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import '@/styles/nprogress.css' // <-- import your custom styling

export default function LoadingBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Start the progress bar on route change
    NProgress.start()

    // When the component unmounts or the effect re-runs (route changes again),
    // complete the progress bar
    return () => {
      NProgress.done()
    }
  }, [pathname, searchParams])

  return null
}