"use client";

import { useState } from "react";
import AdminSidebar from "@/components/layout/admin/AdminSidebar";

export default function AdminSidebarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <>
      <AdminSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <div 
        className={`min-h-screen transition-all duration-300 bg-gray-50 ${
          sidebarCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        {children}
      </div>
    </>
  );
}
