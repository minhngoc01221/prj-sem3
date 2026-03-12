"use client"

import Link from "next/link"
import { Plane } from "lucide-react"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')`,
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50" />

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

      {/* Form Container - Glassmorphism */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <Plane className="w-6 h-6 text-white transform -rotate-45" />
            </div>
            <span className="text-2xl font-bold text-white">Du Lịch Việt</span>
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
            {subtitle && (
              <p className="text-gray-200">{subtitle}</p>
            )}
          </div>

          {/* Children Form */}
          {children}

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link 
              href="/" 
              className="text-sm text-gray-300 hover:text-orange-400 transition-colors"
            >
              ← Quay về trang chủ
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>© 2026 Du Lịch Việt. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
