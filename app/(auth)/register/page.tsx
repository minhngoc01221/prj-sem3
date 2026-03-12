"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, User, Mail, Phone, Lock, Loader2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import AuthLayout from "@/components/auth/AuthLayout"

interface RegisterFormData {
  fullName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

interface RegisterErrors {
  fullName?: string
  email?: string
  phone?: string
  password?: string
  confirmPassword?: string
  acceptTerms?: string
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

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  })
  const [errors, setErrors] = useState<RegisterErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Validation functions
  const validateFullName = (name: string): string | undefined => {
    if (!name) return "Họ tên là bắt buộc"
    if (name.length < 2) return "Họ tên phải có ít nhất 2 ký tự"
    return undefined
  }

  const validateEmail = (email: string): string | undefined => {
    if (!email) return "Email là bắt buộc"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return "Email không hợp lệ"
    return undefined
  }

  const validatePhone = (phone: string): string | undefined => {
    if (!phone) return "Số điện thoại là bắt buộc"
    const phoneRegex = /^(0[3-9])?\d{9}$/
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) return "Số điện thoại không hợp lệ"
    return undefined
  }

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

  const handleChange = (field: keyof RegisterFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    
    // Validate on change if field was touched
    if (touched[field]) {
      const newErrors = { ...errors }
      switch (field) {
        case "fullName":
          newErrors.fullName = validateFullName(value as string)
          break
        case "email":
          newErrors.email = validateEmail(value as string)
          break
        case "phone":
          newErrors.phone = validatePhone(value as string)
          break
        case "password":
          newErrors.password = validatePassword(value as string)
          break
        case "confirmPassword":
          newErrors.confirmPassword = validateConfirmPassword(value as string)
          break
      }
      setErrors(newErrors)
    }
  }

  const handleBlur = (field: keyof RegisterFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    
    const newErrors = { ...errors }
    switch (field) {
      case "fullName":
        newErrors.fullName = validateFullName(formData.fullName)
        break
      case "email":
        newErrors.email = validateEmail(formData.email)
        break
      case "phone":
        newErrors.phone = validatePhone(formData.phone)
        break
      case "password":
        newErrors.password = validatePassword(formData.password)
        break
      case "confirmPassword":
        newErrors.confirmPassword = validateConfirmPassword(formData.confirmPassword)
        break
    }
    setErrors(newErrors)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors: RegisterErrors = {
      fullName: validateFullName(formData.fullName),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword),
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Bạn cần đồng ý với điều khoản dịch vụ"
    }
    
    setErrors(newErrors)
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
      acceptTerms: true,
    })

    if (Object.values(newErrors).some((error) => error)) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      // Simulate API call - Replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      // Save user to localStorage (auto-login after registration)
      const user = {
        id: "1",
        name: formData.fullName,
        email: formData.email,
      }
      localStorage.setItem("user", JSON.stringify(user))
      
      // Redirect to home after successful registration
      router.push("/")
    } catch (error) {
      setErrors({
        general: "Đăng ký thất bại. Vui lòng thử lại sau.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const passwordMetRequirements = passwordRequirements.map((req) => ({
    ...req,
    met: req.test(formData.password),
  }))

  return (
    <AuthLayout
      title="Tạo tài khoản"
      subtitle="Tham gia cùng chúng tôi để khám phá Việt Nam"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* General Error */}
        {errors.general && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-sm text-red-200">
            {errors.general}
          </div>
        )}

        {/* Full Name Field */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-white">Họ và tên</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="fullName"
              type="text"
              placeholder="Nguyễn Văn A"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              onBlur={() => handleBlur("fullName")}
              error={errors.fullName}
              className="pl-11 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              disabled={isLoading}
            />
          </div>
          {errors.fullName && touched.fullName && (
            <p className="text-sm text-red-400">{errors.fullName}</p>
          )}
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

        {/* Phone Field */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-white">Số điện thoại</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="phone"
              type="tel"
              placeholder="0912345678"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              onBlur={() => handleBlur("phone")}
              error={errors.phone}
              className="pl-11 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              disabled={isLoading}
            />
          </div>
          {errors.phone && touched.phone && (
            <p className="text-sm text-red-400">{errors.phone}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">Mật khẩu</Label>
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
          <Label htmlFor="confirmPassword" className="text-white">Nhập lại mật khẩu</Label>
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

        {/* Terms and Conditions */}
        <div className="flex items-start gap-2 pt-2">
          <Checkbox
            id="acceptTerms"
            checked={formData.acceptTerms}
            onCheckedChange={(checked: boolean) => handleChange("acceptTerms", checked)}
            disabled={isLoading}
          />
          <Label
            htmlFor="acceptTerms"
            className="text-sm text-gray-200 cursor-pointer leading-relaxed"
          >
            Tôi đồng ý với{" "}
            <Link href="/terms" className="text-orange-400 hover:text-orange-300 hover:underline">
              Điều khoản dịch vụ
            </Link>{" "}
            và{" "}
            <Link href="/privacy" className="text-orange-400 hover:text-orange-300 hover:underline">
              Chính sách bảo mật
            </Link>
          </Label>
        </div>
        {errors.acceptTerms && touched.acceptTerms && (
          <p className="text-sm text-red-400">{errors.acceptTerms}</p>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 text-base bg-orange-500 hover:bg-orange-600 mt-4"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Đang đăng ký...
            </>
          ) : (
            "Đăng ký"
          )}
        </Button>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-200 mt-6">
          Đã có tài khoản?{" "}
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
