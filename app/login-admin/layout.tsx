import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "../globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Đăng nhập - Karnel Travels",
  description: "Đăng nhập vào hệ thống quản trị",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${dmSans.variable} font-sans antialiased`}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {children}
      </div>
    </div>
  );
}
