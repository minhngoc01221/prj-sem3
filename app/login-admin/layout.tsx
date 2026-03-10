import type { Metadata } from "next";
import "../globals.css";

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
    <div className="font-sans antialiased">
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {children}
      </div>
    </div>
  );
}
