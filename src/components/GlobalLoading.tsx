'use client'

import { useEffect, useState } from 'react'
import LoadingSpinner from './LoadingSpinner'

type NetworkEffectiveType = 'slow-2g' | '2g' | '3g' | '4g'
type NetworkInformationLike = { effectiveType?: NetworkEffectiveType }
type NavigatorWithConnection = Navigator & { connection?: NetworkInformationLike }

export default function GlobalLoading() {
  const [isLoading, setIsLoading] = useState(true)
  const [showDelayedMessage, setShowDelayedMessage] = useState(false)

  useEffect(() => {
    // Hide loading after page is fully loaded
    const handleLoad = () => {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        setIsLoading(false)
      }, 300)
    }

    // If page is already loaded
    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
    }

    // Show delayed message if loading takes more than 3 seconds
    const delayedTimer = setTimeout(() => {
      if (isLoading) {
        setShowDelayedMessage(true)
      }
    }, 3000)

    return () => {
      window.removeEventListener('load', handleLoad)
      clearTimeout(delayedTimer)
    }
  }, [isLoading])

  // Also check for slow network connections
  useEffect(() => {
    if ('connection' in navigator) {
      const connection = (navigator as NavigatorWithConnection).connection
      if (connection) {
        const effectiveType = connection.effectiveType
        // If slow connection, show loading longer
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          setTimeout(() => {
            setShowDelayedMessage(true)
          }, 2000)
        }
      }
    }
  }, [])

  if (!isLoading) return null

  return (
    <LoadingSpinner 
      message={showDelayedMessage ? 'Taking a bit longer than usual...' : 'Loading...'} 
    />
  )
}

