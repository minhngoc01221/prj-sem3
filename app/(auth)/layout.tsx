import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import "../globals.css"

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Đăng nhập - Du Lịch Việt",
  description: "Đăng nhập vào hệ thống Du Lịch Việt để đặt tour và trải nghiệm dịch vụ du lịch hàng đầu.",
}

export default function AuthRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={dmSans.variable}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
