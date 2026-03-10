import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import AdminLayoutClient from "./admin-layout-client";
import "../globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Admin Panel - Karnel Travels",
  description: "Hệ thống quản lý nội dung du lịch",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${dmSans.variable} font-sans antialiased bg-gray-50`}>
      <AdminLayoutClient>
        {children}
      </AdminLayoutClient>
    </div>
  );
}
