'use client'

import { useEffect, useState } from 'react'

export default function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ 
        background: 'var(--color-cream)',
      }}
    >
      <div className="text-center">
        {/* Spinning Circle */}
        <div className="relative mb-8">
          <div 
            className="inline-block rounded-full border-4 border-solid animate-spin"
            style={{
              width: '64px',
              height: '64px',
              borderColor: 'var(--color-pink-medium)',
              borderTopColor: 'transparent',
              borderRightColor: 'transparent',
              animation: 'spin 1s linear infinite'
            }}
          />
          {/* Inner circle for depth */}
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid var(--color-olive)',
              borderTopColor: 'transparent',
              borderRightColor: 'transparent',
              animation: 'spin 0.8s linear infinite reverse'
            }}
          />
        </div>
        
        {/* Loading Text */}
        <p 
          className="text-xl md:text-2xl font-semibold"
          style={{ 
            fontFamily: 'var(--font-leiko)', 
            color: 'var(--color-brown-dark)'
          }}
        >
          {message}
        </p>
        
        {/* Subtle dots animation */}
        <div className="flex justify-center gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-full animate-pulse"
              style={{
                width: '8px',
                height: '8px',
                background: 'var(--color-pink-medium)',
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1.4s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

