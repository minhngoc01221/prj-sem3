"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, ArrowLeft, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AuthLayout from "@/components/auth/AuthLayout"

interface ForgotPasswordErrors {
  email?: string
  general?: string
}

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState<ForgotPasswordErrors>({})
  const [touched, setTouched] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Validation function
  const validateEmail = (email: string): string | undefined => {
    if (!email) return "Email là bắt buộc"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return "Email không hợp lệ"
    return undefined
  }

  const handleChange = (value: string) => {
    setEmail(value)
    if (touched) {
      setErrors({ email: validateEmail(value) })
    }
  }

  const handleBlur = () => {
    setTouched(true)
    setErrors({ email: validateEmail(email) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const emailError = validateEmail(email)
    setErrors({ email: emailError })
    setTouched(true)

    if (emailError) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      // Simulate API call - Replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      // Show success state
      setIsSubmitted(true)
    } catch (error) {
      setErrors({
        general: "Không thể gửi email reset mật khẩu. Vui lòng thử lại sau.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendEmail = async () => {
    setIsLoading(true)
    
    try {
      // Simulate API call - Replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      // Show success notification (could use toast)
      alert("Email đã được gửi lại!")
    } catch (error) {
      setErrors({
        general: "Không thể gửi lại email. Vui lòng thử lại sau.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Success State
  if (isSubmitted) {
    return (
      <AuthLayout
        title="Kiểm tra email của bạn"
        subtitle="Chúng tôi đã gửi link đặt lại mật khẩu"
      >
        <div className="text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>

          {/* Message */}
          <div className="space-y-4 mb-8">
            <p className="text-gray-200">
              Chúng tôi đã gửi link đặt lại mật khẩu đến email:
            </p>
            <p className="font-semibold text-orange-400">{email}</p>
            <p className="text-sm text-gray-400">
              Vui lòng kiểm tra hộp thư của bạn và nhấp vào link trong email để đặt lại mật khẩu.
            </p>
          </div>

          {/* Didn't receive email */}
          <div className="bg-white/10 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-300 mb-2">
              Chưa nhận được email?
            </p>
            <button
              type="button"
              onClick={handleResendEmail}
              disabled={isLoading}
              className="text-orange-400 hover:text-orange-300 font-medium text-sm hover:underline disabled:opacity-50"
            >
              {isLoading ? "Đang gửi..." : "Gửi lại email"}
            </button>
          </div>

          {/* Back to Login */}
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-orange-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại đăng nhập
          </Link>
        </div>
      </AuthLayout>
    )
  }

  // Form State
  return (
    <AuthLayout
      title="Quên mật khẩu"
      subtitle="Nhập email để đặt lại mật khẩu của bạn"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Error */}
        {errors.general && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-sm text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {errors.general}
          </div>
        )}

        {/* Info Box */}
        <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-200">
            <strong>Lưu ý:</strong> Nếu tài khoản với email này tồn tại, bạn sẽ nhận được link đặt lại mật khẩu trong vòng 5-10 phút.
          </p>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => handleChange(e.target.value)}
              onBlur={handleBlur}
              error={errors.email}
              className="pl-11 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              disabled={isLoading}
            />
          </div>
          {errors.email && touched && (
            <p className="text-sm text-red-400">{errors.email}</p>
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
              Đang gửi...
            </>
          ) : (
            "Gửi link đặt lại mật khẩu"
          )}
        </Button>

        {/* Back to Login */}
        <p className="text-center text-sm text-gray-200 mt-6">
          Nhớ mật khẩu rồi?{" "}
          <Link
            href="/login"
            className="text-orange-400 hover:text-orange-300 font-semibold hover:underline"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
