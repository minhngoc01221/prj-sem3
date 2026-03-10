import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Du Lịch Việt - Khám Phá Vẻ Đẹp Miền Nam",
  description: "Công ty du lịch hàng đầu Việt Nam. Đặt tour, khách sạn, resort và trải nghiệm du lịch đáng nhớ.",
  keywords: ["du lịch", "tour", "khách sạn", "resort", "việt nam", "travel"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${dmSans.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
