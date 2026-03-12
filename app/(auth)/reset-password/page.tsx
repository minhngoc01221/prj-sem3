"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, Lock, Loader2, CheckCircle, AlertCircle, ArrowLeft, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AuthLayout from "@/components/auth/AuthLayout"

interface ResetPasswordErrors {
  password?: string
  confirmPassword?: string
  general?: string
}

interface PasswordRequirement {
  label: string
  test: (password: string) => boolean
}

const passwordRequirements: PasswordRequirement[] = [
  { label: "Ít nhất 8 ký tự", test: (p) => p.length >= 8 },
  { label: "Có chữ hoa", test: (p) => /[A-Z]/.test(p) },
  { label: "Có chữ thường", test: (p) => /[a-z]/.test(p) },
  { label: "Có số", test: (p) => /\d/.test(p) },
  { label: "Có ký tự đặc biệt", test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
]

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null)
  
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<ResetPasswordErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setIsValidToken(false)
      return
    }

    // Simulate token validation - Replace with actual API
    const validateToken = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))
        // For demo, accept any token
        setIsValidToken(true)
      } catch {
        setIsValidToken(false)
      }
    }

    validateToken()
  }, [token])

  // Validation functions
  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Mật khẩu là bắt buộc"
    if (password.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự"
    if (!/[A-Z]/.test(password)) return "Mật khẩu phải có ít nhất 1 chữ hoa"
    if (!/[a-z]/.test(password)) return "Mật khẩu phải có ít nhất 1 chữ thường"
    if (!/\d/.test(password)) return "Mật khẩu phải có ít nhất 1 số"
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Mật khẩu phải có ít nhất 1 ký tự đặc biệt"
    return undefined
  }

  const validateConfirmPassword = (confirmPassword: string): string | undefined => {
    if (!confirmPassword) return "Vui lòng nhập lại mật khẩu"
    if (confirmPassword !== formData.password) return "Mật khẩu không khớp"
    return undefined
  }

  const handleChange = (field: "password" | "confirmPassword", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    
    if (touched[field]) {
      const newErrors = { ...errors }
      if (field === "password") {
        newErrors.password = validatePassword(value)
      } else {
        newErrors.confirmPassword = validateConfirmPassword(value)
      }
      setErrors(newErrors)
    }
  }

  const handleBlur = (field: "password" | "confirmPassword") => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    
    const newErrors = { ...errors }
    if (field === "password") {
      newErrors.password = validatePassword(formData.password)
    } else {
      newErrors.confirmPassword = validateConfirmPassword(formData.confirmPassword)
    }
    setErrors(newErrors)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: ResetPasswordErrors = {
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword),
    }
    
    setErrors(newErrors)
    setTouched({ password: true, confirmPassword: true })

    if (Object.values(newErrors).some((error) => error)) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      // Simulate API call - Replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      setIsSuccess(true)
    } catch (error) {
      setErrors({
        general: "Đặt lại mật khẩu thất bại. Vui lý thử lại sau.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const passwordMetRequirements = passwordRequirements.map((req) => ({
    ...req,
    met: req.test(formData.password),
  }))

  // Loading state while validating token
  if (isValidToken === null) {
    return (
      <AuthLayout
        title="Đang xác thực..."
        subtitle="Vui lòng chờ trong giây lát"
      >
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      </AuthLayout>
    )
  }

  // Invalid token
  if (isValidToken === false) {
    return (
      <AuthLayout
        title="Link không hợp lệ"
        subtitle="Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn"
      >
        <div className="text-center">
          {/* Error Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>

          {/* Message */}
          <div className="space-y-4 mb-8">
            <p className="text-gray-200">
              Link đặt lại mật khẩu của bạn có thể đã hết hạn hoặc không hợp lệ.
            </p>
            <p className="text-sm text-gray-400">
              Vui lòng thử lại bằng cách yêu cầu đặt lại mật khẩu mới.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/forgot-password"
              className="inline-flex items-center justify-center gap-2 w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
            >
              Yêu cầu link mới
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 w-full h-12 text-gray-200 hover:text-orange-400 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </AuthLayout>
    )
  }

  // Success State
  if (isSuccess) {
    return (
      <AuthLayout
        title="Đặt lại mật khẩu thành công!"
        subtitle="Mật khẩu của bạn đã được cập nhật"
      >
        <div className="text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>

          {/* Message */}
          <div className="space-y-4 mb-8">
            <p className="text-gray-200">
              Mật khẩu của bạn đã được đặt lại thành công.
            </p>
            <p className="text-sm text-gray-400">
              Bây giờ bạn có thể đăng nhập với mật khẩu mới.
            </p>
          </div>

          {/* Login Button */}
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </AuthLayout>
    )
  }

  // Form State
  return (
    <AuthLayout
      title="Đặt lại mật khẩu"
      subtitle="Nhập mật khẩu mới cho tài khoản của bạn"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* General Error */}
        {errors.general && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-sm text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {errors.general}
          </div>
        )}

        {/* New Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">Mật khẩu mới</Label>
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
          
          {/* Password Requirements */}
          {formData.password && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-2">
              {passwordMetRequirements.map((req, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-1 text-xs ${
                    req.met ? "text-green-400" : "text-gray-400"
                  }`}
                >
                  {req.met ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <X className="w-3 h-3" />
                  )}
                  {req.label}
                </div>
              ))}
            </div>
          )}
          {errors.password && touched.password && (
            <p className="text-sm text-red-400">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-white">Nhập lại mật khẩu mới</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              onBlur={() => handleBlur("confirmPassword")}
              error={errors.confirmPassword}
              className="pl-11 pr-11 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && touched.confirmPassword && (
            <p className="text-sm text-red-400">{errors.confirmPassword}</p>
          )}
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
              Đang cập nhật...
            </>
          ) : (
            "Đặt lại mật khẩu"
          )}
        </Button>

        {/* Back to Login */}
        <p className="text-center text-sm text-gray-200 mt-6">
          <Link
            href="/login"
            className="text-orange-400 hover:text-orange-300 font-semibold hover:underline inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại đăng nhập
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <AuthLayout
        title="Đang xác thực..."
        subtitle="Vui lòng chờ trong giây lát"
      >
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      </AuthLayout>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
