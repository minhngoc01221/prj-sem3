"use client";

import { useState } from 'react';
import { 
  Settings, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Image as ImageIcon,
  Save,
  Upload,
  Facebook,
  Instagram,
  Youtube,
  Link as LinkIcon,
  Menu,
  Banner,
  Bell,
  Database,
  Palette
} from 'lucide-react';

interface SettingsData {
  company?: {
    name: string;
    logo?: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
  social?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    zalo?: string;
  };
  navigation?: {
    items: { label: string; url: string }[];
  };
  banners?: {
    items: { id: string; image: string; url: string; isActive: boolean }[];
  };
  email?: {
    smtp?: {
      host?: string;
      port?: number;
      user?: string;
      password?: string;
    };
  };
}

interface SettingsContentProps {
  settings: SettingsData | null;
  isLoading: boolean;
}

export function SettingsContent({ settings: initialSettings, isLoading }: SettingsContentProps) {
  const [settings, setSettings] = useState<SettingsData>(initialSettings || {
    company: {
      name: 'Karnel Travels',
      description: 'Công ty du lịch và lữ hành hàng đầu Việt Nam',
      address: '123 Đường ABC, Quận 1, TP. Hồ Chí Minh',
      phone: '028 1234 5678',
      email: 'info@karneltravels.com',
      website: 'https://www.karneltravels.com'
    },
    social: {
      facebook: 'https://facebook.com/karneltravels',
      instagram: 'https://instagram.com/karneltravels',
      youtube: 'https://youtube.com/karneltravels',
      zalo: 'https://zalo.me/karneltravels'
    }
  });
  const [activeTab, setActiveTab] = useState('company');
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'company', label: 'Thông tin công ty', icon: Building2 },
    { id: 'social', label: 'Mạng xã hội', icon: Globe },
    { id: 'navigation', label: 'Menu điều hướng', icon: Menu },
    { id: 'banners', label: 'Banner trang chủ', icon: Banner },
    { id: 'email', label: 'Cấu hình email', icon: Mail },
    { id: 'backup', label: 'Sao lưu dữ liệu', icon: Database },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cài đặt</h1>
          <p className="text-gray-500 mt-1">Quản lý cấu hình hệ thống</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <nav className="p-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-orange-500 text-white' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'company' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Thông tin công ty</h2>
              
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-3xl font-bold">
                  {settings.company?.name?.charAt(0) || 'K'}
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Upload className="w-4 h-4" />
                  Tải lên logo
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên công ty</label>
                  <input
                    type="text"
                    value={settings.company?.name || ''}
                    onChange={(e) => setSettings({ ...settings, company: { ...settings.company!, name: e.target.value } })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="text"
                    value={settings.company?.website || ''}
                    onChange={(e) => setSettings({ ...settings, company: { ...settings.company!, website: e.target.value } })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả ngắn</label>
                  <textarea
                    rows={3}
                    value={settings.company?.description || ''}
                    onChange={(e) => setSettings({ ...settings, company: { ...settings.company!, description: e.target.value } })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={settings.company?.address || ''}
                      onChange={(e) => setSettings({ ...settings, company: { ...settings.company!, address: e.target.value } })}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Điện thoại</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={settings.company?.phone || ''}
                      onChange={(e) => setSettings({ ...settings, company: { ...settings.company!, phone: e.target.value } })}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={settings.company?.email || ''}
                      onChange={(e) => setSettings({ ...settings, company: { ...settings.company!, email: e.target.value } })}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Liên kết mạng xã hội</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                  <div className="relative">
                    <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600" />
                    <input
                      type="text"
                      value={settings.social?.facebook || ''}
                      onChange={(e) => setSettings({ ...settings, social: { ...settings.social!, facebook: e.target.value } })}
                      placeholder="https://facebook.com/yourpage"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-600" />
                    <input
                      type="text"
                      value={settings.social?.instagram || ''}
                      onChange={(e) => setSettings({ ...settings, social: { ...settings.social!, instagram: e.target.value } })}
                      placeholder="https://instagram.com/yourpage"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">YouTube</label>
                  <div className="relative">
                    <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                    <input
                      type="text"
                      value={settings.social?.youtube || ''}
                      onChange={(e) => setSettings({ ...settings, social: { ...settings.social!, youtube: e.target.value } })}
                      placeholder="https://youtube.com/yourchannel"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Zalo</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
                    <input
                      type="text"
                      value={settings.social?.zalo || ''}
                      onChange={(e) => setSettings({ ...settings, social: { ...settings.social!, zalo: e.target.value } })}
                      placeholder="https://zalo.me/yourpage"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'navigation' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Menu điều hướng</h2>
              <p className="text-gray-500">Quản lý các liên kết trong menu chính của website</p>
              
              <div className="space-y-3">
                {[
                  { label: 'Trang chủ', url: '/' },
                  { label: 'Giới thiệu', url: '/about' },
                  { label: 'Tìm kiếm', url: '/search' },
                  { label: 'Thông tin', url: '/information' },
                  { label: 'Liên hệ', url: '/contact' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <span className="font-medium text-gray-900 w-32">{item.label}</span>
                    <input
                      type="text"
                      value={item.url}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'banners' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Banner trang chủ</h2>
              <p className="text-gray-500">Quản lý các banner hiển thị trên trang chủ</p>
              
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Kéo thả hoặc click để tải lên banner</p>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                  <Upload className="w-4 h-4" />
                  Tải lên
                </button>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Cấu hình email SMTP</h2>
              <p className="text-gray-500">Cấu hình máy chủ email để gửi thông báo tự động</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                  <input
                    type="text"
                    placeholder="smtp.example.com"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                  <input
                    type="number"
                    placeholder="587"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    placeholder="your-email@example.com"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Sao lưu dữ liệu</h2>
              <p className="text-gray-500">Tạo và khôi phục bản sao lưu dữ liệu</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 border border-gray-200 rounded-xl">
                  <Database className="w-10 h-10 text-blue-600 mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Tạo bản sao lưu</h3>
                  <p className="text-sm text-gray-500 mb-4">Tải xuống toàn bộ dữ liệu hiện tại</p>
                  <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    <Download className="w-4 h-4" />
                    Sao lưu ngay
                  </button>
                </div>
                <div className="p-6 border border-gray-200 rounded-xl">
                  <Upload className="w-10 h-10 text-green-600 mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Khôi phục dữ liệu</h3>
                  <p className="text-sm text-gray-500 mb-4">Tải lên file sao lưu để khôi phục</p>
                  <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                    <Upload className="w-4 h-4" />
                    Khôi phục
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
