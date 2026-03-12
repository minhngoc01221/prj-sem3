"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import AuthLayout from "@/components/auth/AuthLayout"

interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

interface LoginErrors {
  email?: string
  password?: string
  general?: string
}

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [errors, setErrors] = useState<LoginErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Validation functions
  const validateEmail = (email: string): string | undefined => {
    if (!email) return "Email là bắt buộc"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return "Email không hợp lệ"
    return undefined
  }

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Mật khẩu là bắt buộc"
    if (password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự"
    return undefined
  }

  const handleChange = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    
    // Validate on change if field was touched
    if (touched[field]) {
      const newErrors = { ...errors }
      if (field === "email") {
        newErrors.email = validateEmail(value as string)
      } else if (field === "password") {
        newErrors.password = validatePassword(value as string)
      }
      setErrors(newErrors)
    }
  }

  const handleBlur = (field: keyof LoginFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    
    const newErrors = { ...errors }
    if (field === "email") {
      newErrors.email = validateEmail(formData.email)
    } else if (field === "password") {
      newErrors.password = validatePassword(formData.password)
    }
    setErrors(newErrors)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields
    const emailError = validateEmail(formData.email)
    const passwordError = validatePassword(formData.password)
    
    setErrors({
      email: emailError,
      password: passwordError,
    })
    setTouched({ email: true, password: true })

    if (emailError || passwordError) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      // Simulate API call - Replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      // Redirect to home after successful login
      router.push("/")
    } catch (error) {
      setErrors({
        general: "Email hoặc mật khẩu không đúng. Vui lòng thử lại.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: "google" | "facebook") => {
    // Implement social login logic here
    console.log(`Login with ${provider}`)
  }

  return (
    <AuthLayout
      title="Chào mừng trở lại!"
      subtitle="Đăng nhập để tiếp tục hành trình của bạn"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* General Error */}
        {errors.general && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-sm text-red-200">
            {errors.general}
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              error={errors.email}
              className="pl-11 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              disabled={isLoading}
            />
          </div>
          {errors.email && touched.email && (
            <p className="text-sm text-red-400">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-white">Mật khẩu</Label>
            <Link
              href="/forgot-password"
              className="text-sm text-orange-400 hover:text-orange-300 hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              onBlur={() => handleBlur("password")}
              error={errors.password}
              className="pl-11 pr-11 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && touched.password && (
            <p className="text-sm text-red-400">{errors.password}</p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="rememberMe"
            checked={formData.rememberMe}
            onCheckedChange={(checked: boolean) => handleChange("rememberMe", checked)}
            disabled={isLoading}
          />
          <Label
            htmlFor="rememberMe"
            className="text-sm text-gray-200 cursor-pointer"
          >
            Ghi nhớ đăng nhập
          </Label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 text-base bg-orange-500 hover:bg-orange-600"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Đang đăng nhập...
            </>
          ) : (
            "Đăng nhập"
          )}
        </Button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-transparent text-gray-300">hoặc đăng nhập với</span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant="outline"
            className="h-12 bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={() => handleSocialLogin("google")}
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-12 bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={() => handleSocialLogin("facebook")}
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </Button>
        </div>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-200 mt-6">
          Chưa có tài khoản?{" "}
          <Link
            href="/register"
            className="text-orange-400 hover:text-orange-300 font-semibold hover:underline"
          >
            Đăng ký ngay
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
