"use client";

import { useState } from "react";
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

export default function AdminSidebar({ isCollapsed = false, onToggle }: AdminSidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const pathname = usePathname();
  
  // Use internal state if props not provided
  const collapsed = isCollapsed !== undefined ? isCollapsed : internalCollapsed;
  const handleToggle = onToggle || (() => setInternalCollapsed(!internalCollapsed));

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 z-40 flex flex-col ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-slate-700/50">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Map className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-lg whitespace-nowrap">
              Karnel Admin
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6">
            {!isCollapsed && (
              <h3 className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {group.title}
              </h3>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      isActive(item.href)
                        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                        : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <item.icon className={`w-5 h-5 flex-shrink-0 ${
                      isActive(item.href) ? "text-white" : "text-slate-400 group-hover:text-white"
                    }`} />
                    {!isCollapsed && (
                      <span className="font-medium whitespace-nowrap">{item.label}</span>
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
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-400 transition-colors ${
            isCollapsed ? "justify-center" : ""
          }`}
          title={isCollapsed ? "Đăng xuất" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">Đăng xuất</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={handleToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-slate-700 border-2 border-slate-600 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-600 transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </aside>
  );
}
