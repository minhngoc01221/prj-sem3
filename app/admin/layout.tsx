import type { Metadata } from "next";
import AdminSidebarWrapper from "@/components/layout/admin/AdminSidebarWrapper";

export const metadata: Metadata = {
  title: "Admin Panel - Karnel Travels",
  description: "Hệ thống quản lý nội dung du lịch",
};

export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      
      <div className="flex pt-16">
        <AdminSidebarWrapper>
          <div className="flex-1 p-6 lg:p-8">
            {children}
          </div>
        </AdminSidebarWrapper>
      </div>
      
    </div>
  );
}
