'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !user && !pathname.startsWith('/auth')) {
      router.push('/auth/login')
    }
  }, [user, isLoading, router, pathname])

  if (isLoading) {
    return <div>Načítání...</div>
  }

  if (!user && !pathname.startsWith('/auth')) {
    return null
  }

  return <>{children}</>
} 