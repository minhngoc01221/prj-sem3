"use client";

import { useState, useEffect, useRef } from 'react';
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
  LayoutTemplate,
  Database,
  Check,
  X,
  Loader2,
  Trash2,
  Edit2,
  Plus,
  GripVertical,
  AlertCircle,
  Eye,
  EyeOff,
  Server
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  url: string;
  icon?: string;
  position: number;
  isActive: boolean;
}

interface Banner {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  position: number;
  isActive: boolean;
}

interface SettingsContentProps {
  settings?: Record<string, any>;
  menus?: MenuItem[];
  banners?: Banner[];
  emailConfig?: any;
  isLoading: boolean;
}

const defaultSettings = {
  companyName: 'Karnel Travels',
  companyEmail: 'info@karneltravels.com',
  companyPhone: '028 1234 5678',
  companyAddress: '123 Đường ABC, Quận 1, TP. Hồ Chí Minh',
  companyWebsite: 'https://www.karneltravels.com',
  companyDescription: 'Công ty du lịch và lữ hành hàng đầu Việt Nam',
  logo: '',
  facebook: 'https://facebook.com/karneltravels',
  instagram: 'https://instagram.com/karneltravels',
  youtube: 'https://youtube.com/karneltravels',
  zalo: '',
};

export function SettingsContent({ settings = {}, menus = [], banners = [], emailConfig = null, isLoading }: SettingsContentProps) {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Form states
  const [formData, setFormData] = useState(defaultSettings);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(menus);
  const [bannerItems, setBannerItems] = useState<Banner[]>(banners);
  const [emailForm, setEmailForm] = useState({
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    fromEmail: '',
    fromName: 'Karnel Travels',
    useTLS: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [logoPreview, setLogoPreview] = useState(settings.logo || '');
  const [isUploading, setIsUploading] = useState(false);
  
  // Backup state
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);

  // Menu modal
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);
  const [menuForm, setMenuForm] = useState({ name: '', url: '', icon: '' });

  // Banner modal
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerForm, setBannerForm] = useState({ title: '', description: '', imageUrl: '', linkUrl: '' });

  useEffect(() => {
    if (Object.keys(settings).length > 0) {
      setFormData({
        ...defaultSettings,
        companyName: settings.companyName || defaultSettings.companyName,
        companyEmail: settings.companyEmail || defaultSettings.companyEmail,
        companyPhone: settings.companyPhone || defaultSettings.companyPhone,
        companyAddress: settings.companyAddress || defaultSettings.companyAddress,
        companyWebsite: settings.companyWebsite || defaultSettings.companyWebsite,
        companyDescription: settings.companyDescription || defaultSettings.companyDescription,
        logo: settings.logo || '',
        facebook: settings.facebook || '',
        instagram: settings.instagram || '',
        youtube: settings.youtube || '',
        zalo: settings.zalo || '',
      });
      setLogoPreview(settings.logo || '');
    }
  }, [settings]);

  useEffect(() => {
    setMenuItems(menus);
  }, [menus]);

  useEffect(() => {
    setBannerItems(banners);
  }, [banners]);

  useEffect(() => {
    if (emailConfig) {
      setEmailForm({
        smtpHost: emailConfig.smtpHost || '',
        smtpPort: String(emailConfig.smtpPort || '587'),
        smtpUser: emailConfig.smtpUser || '',
        smtpPassword: emailConfig.password === '••••••••' ? '' : (emailConfig.smtpPassword || ''),
        fromEmail: emailConfig.fromEmail || '',
        fromName: emailConfig.fromName || 'Karnel Travels',
        useTLS: emailConfig.useTLS !== false,
      });
    }
  }, [emailConfig]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // Save General Settings (F227, F229)
  const handleSaveGeneral = async () => {
    setIsSaving(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      
      // Save each setting
      const settingsToSave = [
        { key: 'companyName', value: formData.companyName },
        { key: 'companyEmail', value: formData.companyEmail },
        { key: 'companyPhone', value: formData.companyPhone },
        { key: 'companyAddress', value: formData.companyAddress },
        { key: 'companyWebsite', value: formData.companyWebsite },
        { key: 'companyDescription', value: formData.companyDescription },
        { key: 'logo', value: formData.logo },
        { key: 'facebook', value: formData.facebook },
        { key: 'instagram', value: formData.instagram },
        { key: 'youtube', value: formData.youtube },
        { key: 'zalo', value: formData.zalo },
      ];

      for (const setting of settingsToSave) {
        await fetch(`${baseUrl}/api/admin/settings/general`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: setting.key, value: setting.value }),
        });
      }

      showToast('success', 'Lưu cài đặt thành công!');
    } catch (error) {
      console.error('Error saving settings:', error);
      showToast('error', 'Lưu thất bại. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  // Upload Logo (F228)
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('type', 'logo');

      const response = await fetch(`${baseUrl}/api/admin/settings/upload`, {
        method: 'POST',
        body: formDataUpload,
      });
      const result = await response.json();

      if (result.success) {
        setFormData(prev => ({ ...prev, logo: result.data.url }));
        setLogoPreview(result.data.url);
        showToast('success', 'Tải logo thành công!');
      } else {
        showToast('error', result.message || 'Tải file thất bại');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      showToast('error', 'Lỗi khi tải file');
    } finally {
      setIsUploading(false);
    }
  };

  // Save Email Config (F233)
  const handleSaveEmailConfig = async () => {
    setIsSaving(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/admin/settings/email-config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailForm),
      });
      const result = await response.json();

      if (result.success) {
        showToast('success', 'Lưu cấu hình email thành công!');
      } else {
        showToast('error', result.message || 'Lưu thất bại');
      }
    } catch (error) {
      console.error('Error saving email config:', error);
      showToast('error', 'Lỗi khi lưu cấu hình');
    } finally {
      setIsSaving(false);
    }
  };

  // Backup (F234)
  const handleBackup = async () => {
    setIsBackingUp(true);
    setBackupProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setBackupProgress(prev => Math.min(prev + 20, 90));
      }, 500);

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/admin/settings/backup`, {
        method: 'POST',
      });
      const result = await response.json();

      clearInterval(progressInterval);
      setBackupProgress(100);

      if (result.success) {
        showToast('success', `Sao lưu thành công! File: ${result.data.filename}`);
      } else {
        showToast('error', result.message || 'Sao lưu thất bại');
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      showToast('error', 'Lỗi khi sao lưu');
    } finally {
      setTimeout(() => {
        setIsBackingUp(false);
        setBackupProgress(0);
      }, 1500);
    }
  };

  // Menu CRUD
  const handleSaveMenu = async () => {
    if (!menuForm.name || !menuForm.url) {
      showToast('error', 'Vui lòng nhập tên và URL');
      return;
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      
      if (editingMenu) {
        await fetch(`${baseUrl}/api/admin/settings/menu`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingMenu.id, ...menuForm, position: editingMenu.position }),
        });
        setMenuItems(prev => prev.map(m => m.id === editingMenu.id ? { ...m, ...menuForm } : m));
        showToast('success', 'Cập nhật menu thành công!');
      } else {
        const response = await fetch(`${baseUrl}/api/admin/settings/menu`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...menuForm, position: menuItems.length }),
        });
        const result = await response.json();
        if (result.success) {
          setMenuItems(prev => [...prev, { ...result.data, id: result.data._id }]);
          showToast('success', 'Thêm menu thành công!');
        }
      }

      setIsMenuModalOpen(false);
      setEditingMenu(null);
      setMenuForm({ name: '', url: '', icon: '' });
    } catch (error) {
      showToast('error', 'Lỗi khi lưu menu');
    }
  };

  const handleDeleteMenu = async (id: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      await fetch(`${baseUrl}/api/admin/settings/menu?id=${id}`, { method: 'DELETE' });
      setMenuItems(prev => prev.filter(m => m.id !== id));
      showToast('success', 'Xóa menu thành công!');
    } catch (error) {
      showToast('error', 'Lỗi khi xóa menu');
    }
  };

  // Banner CRUD
  const handleSaveBanner = async () => {
    if (!bannerForm.title || !bannerForm.imageUrl) {
      showToast('error', 'Vui lòng nhập tiêu đề và chọn ảnh');
      return;
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      
      if (editingBanner) {
        await fetch(`${baseUrl}/api/admin/settings/banners`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingBanner.id, ...bannerForm, position: editingBanner.position }),
        });
        setBannerItems(prev => prev.map(b => b.id === editingBanner.id ? { ...b, ...bannerForm } : b));
        showToast('success', 'Cập nhật banner thành công!');
      } else {
        const response = await fetch(`${baseUrl}/api/admin/settings/banners`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...bannerForm, position: bannerItems.length }),
        });
        const result = await response.json();
        if (result.success) {
          setBannerItems(prev => [...prev, { ...result.data, id: result.data._id }]);
          showToast('success', 'Thêm banner thành công!');
        }
      }

      setIsBannerModalOpen(false);
      setEditingBanner(null);
      setBannerForm({ title: '', description: '', imageUrl: '', linkUrl: '' });
    } catch (error) {
      showToast('error', 'Lỗi khi lưu banner');
    }
  };

  const handleDeleteBanner = async (id: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      await fetch(`${baseUrl}/api/admin/settings/banners?id=${id}`, { method: 'DELETE' });
      setBannerItems(prev => prev.filter(b => b.id !== id));
      showToast('success', 'Xóa banner thành công!');
    } catch (error) {
      showToast('error', 'Lỗi khi xóa banner');
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('type', 'banner');

      const response = await fetch(`${baseUrl}/api/admin/settings/upload`, {
        method: 'POST',
        body: formDataUpload,
      });
      const result = await response.json();

      if (result.success) {
        setBannerForm(prev => ({ ...prev, imageUrl: result.data.url }));
        showToast('success', 'Tải ảnh thành công!');
      } else {
        showToast('error', result.message || 'Tải file thất bại');
      }
    } catch (error) {
      console.error('Error uploading banner:', error);
      showToast('error', 'Lỗi khi tải file');
    } finally {
      setIsUploading(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'Chung', icon: Building2 },
    { id: 'interface', label: 'Giao diện', icon: LayoutTemplate },
    { id: 'connection', label: 'Kết nối', icon: Globe },
    { id: 'system', label: 'Hệ thống', icon: Database },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
        <div className="bg-white rounded-xl shadow-sm border p-6">
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
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cài đặt hệ thống</h1>
          <p className="text-gray-500 mt-1">Quản lý cấu hình và tài nguyên</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <nav className="p-2 space-y-1">
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
                  <span className="font-medium text-sm">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {/* General Tab (F227, F228, F229) */}
          {activeTab === 'general' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Thông tin chung</h2>
                <button 
                  onClick={handleSaveGeneral}
                  disabled={isSaving}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Lưu
                </button>
              </div>

              {/* Logo Upload */}
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer">
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    Tải Logo
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" disabled={isUploading} />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF. Max 5MB</p>
                </div>
              </div>

              {/* Company Info Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên công ty</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="text"
                    value={formData.companyWebsite}
                    onChange={e => setFormData({ ...formData, companyWebsite: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.companyEmail}
                    onChange={e => setFormData({ ...formData, companyEmail: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Điện thoại</label>
                  <input
                    type="text"
                    value={formData.companyPhone}
                    onChange={e => setFormData({ ...formData, companyPhone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                  <input
                    type="text"
                    value={formData.companyAddress}
                    onChange={e => setFormData({ ...formData, companyAddress: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <textarea
                    rows={3}
                    value={formData.companyDescription}
                    onChange={e => setFormData({ ...formData, companyDescription: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Interface Tab (F231, F232) */}
          {activeTab === 'interface' && (
            <div className="space-y-6">
              {/* Menu Management */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Quản lý Menu</h2>
                  <button 
                    onClick={() => { setEditingMenu(null); setMenuForm({ name: '', url: '', icon: '' }); setIsMenuModalOpen(true); }}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Thêm menu
                  </button>
                </div>

                <div className="space-y-2">
                  {menuItems.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Chưa có menu nào</p>
                  ) : (
                    menuItems.map((menu, index) => (
                      <div key={menu.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />
                        <span className="font-medium">{menu.name}</span>
                        <span className="text-gray-500 text-sm">{menu.url}</span>
                        <div className="ml-auto flex items-center gap-2">
                          <button 
                            onClick={() => { setEditingMenu(menu); setMenuForm({ name: menu.name, url: menu.url, icon: menu.icon || '' }); setIsMenuModalOpen(true); }}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteMenu(menu.id)}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Banner Management */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Quản lý Banner</h2>
                  <button 
                    onClick={() => { setEditingBanner(null); setBannerForm({ title: '', description: '', imageUrl: '', linkUrl: '' }); setIsBannerModalOpen(true); }}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Thêm banner
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bannerItems.length === 0 ? (
                    <p className="col-span-full text-gray-500 text-center py-4">Chưa có banner nào</p>
                  ) : (
                    bannerItems.map(banner => (
                      <div key={banner.id} className="relative group rounded-lg overflow-hidden border border-gray-200">
                        <img src={banner.imageUrl} alt={banner.title} className="w-full h-32 object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button 
                            onClick={() => { setEditingBanner(banner); setBannerForm({ title: banner.title, description: banner.description || '', imageUrl: banner.imageUrl, linkUrl: banner.linkUrl || '' }); setIsBannerModalOpen(true); }}
                            className="p-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteBanner(banner.id)}
                            className="p-2 bg-white rounded-lg text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="p-2">
                          <p className="font-medium text-sm truncate">{banner.title}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Connection Tab (F229, F233) */}
          {activeTab === 'connection' && (
            <div className="space-y-6">
              {/* Social Links */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Liên kết mạng xã hội</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                    <div className="relative">
                      <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600" />
                      <input
                        type="text"
                        value={formData.facebook}
                        onChange={e => setFormData({ ...formData, facebook: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                    <div className="relative">
                      <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-600" />
                      <input
                        type="text"
                        value={formData.instagram}
                        onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">YouTube</label>
                    <div className="relative">
                      <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                      <input
                        type="text"
                        value={formData.youtube}
                        onChange={e => setFormData({ ...formData, youtube: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                        placeholder="https://youtube.com/..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zalo</label>
                    <input
                      type="text"
                      value={formData.zalo}
                      onChange={e => setFormData({ ...formData, zalo: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="https://zalo.me/..."
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <button 
                    onClick={handleSaveGeneral}
                    disabled={isSaving}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Lưu liên kết
                  </button>
                </div>
              </div>

              {/* Email Config */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Cấu hình SMTP (F233)</h2>
                  <button 
                    onClick={handleSaveEmailConfig}
                    disabled={isSaving}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Lưu
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
                    <input
                      type="text"
                      value={emailForm.smtpHost}
                      onChange={e => setEmailForm({ ...emailForm, smtpHost: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
                    <input
                      type="text"
                      value={emailForm.smtpPort}
                      onChange={e => setEmailForm({ ...emailForm, smtpPort: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="587"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      value={emailForm.smtpUser}
                      onChange={e => setEmailForm({ ...emailForm, smtpUser: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="your-email@gmail.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password/App Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={emailForm.smtpPassword}
                        onChange={e => setEmailForm({ ...emailForm, smtpPassword: e.target.value })}
                        className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
                    <input
                      type="email"
                      value={emailForm.fromEmail}
                      onChange={e => setEmailForm({ ...emailForm, fromEmail: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="noreply@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Name</label>
                    <input
                      type="text"
                      value={emailForm.fromName}
                      onChange={e => setEmailForm({ ...emailForm, fromName: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="Karnel Travels"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={emailForm.useTLS}
                        onChange={e => setEmailForm({ ...emailForm, useTLS: e.target.checked })}
                        className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700">Sử dụng TLS</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System Tab (F234) */}
          {activeTab === 'system' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Sao lưu dữ liệu</h2>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <Server className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Sao lưu toàn bộ dữ liệu</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Hệ thống sẽ xuất tất cả dữ liệu ra file JSON để lưu trữ.
                    </p>
                  </div>
                </div>
              </div>

              {isBackingUp && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Đang sao lưu...</span>
                    <span className="text-orange-600 font-medium">{backupProgress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 transition-all duration-300"
                      style={{ width: `${backupProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <button 
                onClick={handleBackup}
                disabled={isBackingUp}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2"
              >
                {isBackingUp ? <Loader2 className="w-5 h-5 animate-spin" /> : <Database className="w-5 h-5" />}
                {isBackingUp ? 'Đang sao lưu...' : 'Bắt đầu sao lưu'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Menu Modal */}
      {isMenuModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMenuModalOpen(false)}></div>
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">{editingMenu ? 'Sửa menu' : 'Thêm menu'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên menu</label>
                <input
                  type="text"
                  value={menuForm.name}
                  onChange={e => setMenuForm({ ...menuForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="Trang chủ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="text"
                  value={menuForm.url}
                  onChange={e => setMenuForm({ ...menuForm, url: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="/"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsMenuModalOpen(false)} className="px-4 py-2 border border-gray-200 rounded-lg">Hủy</button>
              <button onClick={handleSaveMenu} className="px-4 py-2 bg-orange-500 text-white rounded-lg">Lưu</button>
            </div>
          </div>
        </div>
      )}

      {/* Banner Modal */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsBannerModalOpen(false)}></div>
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h3 className="text-lg font-semibold mb-4">{editingBanner ? 'Sửa banner' : 'Thêm banner'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                <input
                  type="text"
                  value={bannerForm.title}
                  onChange={e => setBannerForm({ ...bannerForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="Banner khuyến mãi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={bannerForm.description}
                  onChange={e => setBannerForm({ ...bannerForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh banner</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                    {bannerForm.imageUrl ? (
                      <img src={bannerForm.imageUrl} alt="Banner" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <label className="px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Chọn ảnh'}
                    <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" disabled={isUploading} />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link (tùy chọn)</label>
                <input
                  type="text"
                  value={bannerForm.linkUrl}
                  onChange={e => setBannerForm({ ...bannerForm, linkUrl: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsBannerModalOpen(false)} className="px-4 py-2 border border-gray-200 rounded-lg">Hủy</button>
              <button onClick={handleSaveBanner} className="px-4 py-2 bg-orange-500 text-white rounded-lg">Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
