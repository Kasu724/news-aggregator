'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import '@/styles/nprogress.css'

export default function LoadingBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Configure NProgress: no spinner, custom trickle speed
    NProgress.configure({ showSpinner: false, trickleSpeed: 200 });

    // Start the progress bar on route change
    NProgress.start();

    // Add a slight delay before marking as done, to ensure a visible animation
    const timer = setTimeout(() => {
      NProgress.done();
    }, 500); // Adjust the delay (in milliseconds) as needed

    // Cleanup: clear timer and finish the progress bar when route changes
    return () => {
      clearTimeout(timer);
      NProgress.done();
    }
  }, [pathname, searchParams]);

  return null;
}