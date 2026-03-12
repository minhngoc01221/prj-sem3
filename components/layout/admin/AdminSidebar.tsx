"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  Building2,
  Utensils,
  Palmtree,
  Bus,
  Plane,
  ShoppingCart,
  Tag,
  MessageCircle,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Map,
  GripVertical,
} from "lucide-react";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    title: "Tổng quan",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    title: "Quản lý nội dung",
    items: [
      { label: "Điểm du lịch", href: "/admin/spots", icon: MapPin },
      { label: "Khách sạn", href: "/admin/hotels", icon: Building2 },
      { label: "Nhà hàng", href: "/admin/restaurants", icon: Utensils },
      { label: "Resort", href: "/admin/resorts", icon: Palmtree },
      { label: "Phương tiện", href: "/admin/vehicles", icon: Bus },
      { label: "Tour", href: "/admin/tours", icon: Plane },
    ],
  },
  {
    title: "Vận hành",
    items: [
      { label: "Đơn đặt", href: "/admin/bookings", icon: ShoppingCart },
      { label: "Khuyến mãi", href: "/admin/promotions", icon: Tag },
      { label: "Liên hệ", href: "/admin/contacts", icon: MessageCircle },
    ],
  },
  {
    title: "Hệ thống",
    items: [
      { label: "Người dùng", href: "/admin/users", icon: Users },
      { label: "Cài đặt", href: "/admin/settings", icon: Settings },
    ],
  },
];

interface AdminSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export default function AdminSidebar({ isCollapsed: externalCollapsed, onToggle: externalOnToggle }: AdminSidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const pathname = usePathname();
  
  // Use external state if provided
  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  const handleToggle = externalOnToggle || (() => setInternalCollapsed(!internalCollapsed));

  // Handle drag to resize
  useEffect(() => {
    let startX = 0;
    let startWidth = 0;

    const handleMouseDown = (e: MouseEvent) => {
      const sidebar = document.getElementById('admin-sidebar');
      if (!sidebar) return;
      
      const rect = sidebar.getBoundingClientRect();
      if (Math.abs(e.clientX - rect.right) < 10) {
        setIsDragging(true);
        startX = e.clientX;
        startWidth = rect.width;
        document.body.style.cursor = 'ew-resize';
        document.body.style.userSelect = 'none';
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const diff = e.clientX - startX;
      const newWidth = Math.max(180, Math.min(400, startWidth + diff));
      
      // Calculate collapsed state based on width
      if (newWidth < 200 && !internalCollapsed) {
        setInternalCollapsed(true);
      } else if (newWidth > 200 && internalCollapsed) {
        setInternalCollapsed(false);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, internalCollapsed]);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside
      id="admin-sidebar"
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white transition-all duration-200 z-40 flex flex-col ${
        isCollapsed ? "w-20" : "w-64"
      } ${isDragging ? 'cursor-ew-resize' : ''}`}
      style={{ 
        boxShadow: '4px 0 20px rgba(0, 0, 0, 0.15)',
      }}
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-slate-700/50 relative">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20">
            <Map className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-lg whitespace-nowrap bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Karnel Admin
              </span>
              <span className="text-xs text-slate-500">Hệ thống quản lý</span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 overflow-x-hidden">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-5">
            {!isCollapsed && (
              <h3 className="px-3 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                {group.title}
              </h3>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                      isActive(item.href)
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25"
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    {/* Active indicator */}
                    {isActive(item.href) && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full" />
                    )}
                    <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                      isActive(item.href) ? "text-white" : "text-slate-500 group-hover:text-white group-hover:scale-110"
                    }`} />
                    {!isCollapsed && (
                      <span className="font-medium whitespace-nowrap truncate">{item.label}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-3 border-t border-slate-700/50">
        <button
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 ${
            isCollapsed ? "justify-center" : ""
          }`}
          title={isCollapsed ? "Đăng xuất" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">Đăng xuất</span>}
        </button>
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={handleToggle}
        className="absolute -right-3 top-20 w-7 h-7 bg-gradient-to-br from-orange-500 to-amber-500 border-2 border-white/20 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-orange-500/30"
        title={isCollapsed ? "Mở rộng" : "Thu gọn"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Drag Handle Indicator */}
      <div 
        className="absolute top-0 right-0 w-1 h-full cursor-ew-resize hover:bg-orange-500/50 transition-colors"
        title="Kéo để thay đổi độ rộng"
      />
    </aside>
  );
}
