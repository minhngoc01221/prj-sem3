"use client";

import { useState } from "react";
import AdminSidebar from "@/components/layout/admin/AdminSidebar";

export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="flex pt-16">
        <AdminSidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        <div 
          className={`flex-1 min-h-screen transition-all duration-300 bg-gray-50 ${
            sidebarCollapsed ? "ml-20" : "ml-64"
          }`}
        >
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
