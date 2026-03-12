import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import "../globals.css"

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Login - Karnel Travels",
  description: "Login to Karnel Travels to book tours and experience premium travel services.",
}

export default function AuthRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="font-sans antialiased">
      {children}
    </div>
  )
}
