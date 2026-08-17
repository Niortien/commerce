'use client'

import { HeroUIProvider } from '@heroui/react'
import { Toaster } from 'react-hot-toast'
import { QueryProvider } from './query-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <QueryProvider>
        {children}
        <Toaster position="top-right" />
      </QueryProvider>
    </HeroUIProvider>
  )
}
