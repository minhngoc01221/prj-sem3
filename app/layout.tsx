import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import UserNavbar from "@/components/layout/user/UserNavbar";
import Footer from "@/components/layout/user/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Karnel Travels - Discover Vietnam",
  description: "Leading travel company in Vietnam. Book tours, hotels, resorts and experience memorable journeys.",
  keywords: ["travel", "tour", "hotel", "resort", "vietnam", "karnel travels"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <UserNavbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
