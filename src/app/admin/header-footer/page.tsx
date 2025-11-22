"use client";

/**
 * Header & Footer Settings Page
 * 
 * จัดการเนื้อหาและรูปแบบของ Header และ Footer
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminSession } from "../../hooks/useAdminSession";
import { API_ENDPOINTS } from "@/lib/api-config";

interface HeaderFooterSettings {
  headerLogoText: string;
  headerMenuItems: string | null;
  headerBgColor: string;
  footerLogoText: string;
  footerDescription: string;
  footerEmail: string;
  footerLocation: string;
  footerLinks: string | null;
  footerBgColor: string;
}

const defaultSettings: HeaderFooterSettings = {
  headerLogoText: "KRIANGKRAI.P",
  headerMenuItems: null,
  headerBgColor: "#ffffff",
  footerLogoText: "KRIANGKRAI.P",
  footerDescription: "พัฒนาและเรียนรู้เทคโนโลยีใหม่ ๆ อย่างต่อเนื่อง",
  footerEmail: "kik550123@gmail.com",
  footerLocation: "ภูเก็ต, Thailand",
  footerLinks: null,
  footerBgColor: "#1f2937",
};

export default function HeaderFooterPage() {
  const router = useRouter();
  useAdminSession();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<HeaderFooterSettings>(defaultSettings);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
    } else {
      setAuthenticated(true);
      loadSettings();
    }
  }, [router]);

  /**
   * โหลดการตั้งค่าจาก API
   */
  const loadSettings = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.SETTINGS, {
        credentials: "include",
      });
      const data = await response.json();
      if (data && !data.error) {
        setSettings({
          headerLogoText: data.headerLogoText || defaultSettings.headerLogoText,
          headerMenuItems: data.headerMenuItems || null,
          headerBgColor: data.headerBgColor || defaultSettings.headerBgColor,
          footerLogoText: data.footerLogoText || defaultSettings.footerLogoText,
          footerDescription: data.footerDescription || defaultSettings.footerDescription,
          footerEmail: data.footerEmail || defaultSettings.footerEmail,
          footerLocation: data.footerLocation || defaultSettings.footerLocation,
          footerLinks: data.footerLinks || null,
          footerBgColor: data.footerBgColor || defaultSettings.footerBgColor,
        });
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * แสดงข้อความ
   */
  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  /**
   * บันทึกการตั้งค่า
   */
  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(API_ENDPOINTS.SETTINGS, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        showMessage("success", "✅ บันทึกการตั้งค่าสำเร็จ!");
      } else {
        const errorData = await response.json();
        showMessage("error", `❌ ${errorData.message || "เกิดข้อผิดพลาดในการบันทึก"}`);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      showMessage("error", "❌ เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setSaving(false);
    }
  };

  /**
   * Reset เป็นค่าเริ่มต้น
   */
  const handleReset = () => {
    if (confirm("คุณต้องการรีเซ็ตการตั้งค่าเป็นค่าเริ่มต้นหรือไม่?")) {
      setSettings(defaultSettings);
      showMessage("success", "🔄 รีเซ็ตเป็นค่าเริ่มต้นแล้ว");
    }
  };

  if (!authenticated || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-lg border-b-2 border-blue-200 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                <span className="text-4xl">🎨</span>
                จัดการ Header & Footer
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                ปรับแต่งเนื้อหาและรูปแบบของ Header และ Footer
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                href="/admin"
                className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-2 px-6 rounded-xl shadow-lg transition-all"
              >
                ← กลับ
              </Link>
              <Link
                href="/"
                target="_blank"
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold py-2 px-6 rounded-xl shadow-lg transition-all"
              >
                🌐 ดูหน้าเว็บ
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div
            className={`rounded-lg p-4 ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            {message.text}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Header Settings */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-3xl">📋</span>
              Header Settings
            </h2>

            {/* Logo Text */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ข้อความโลโก้
              </label>
              <input
                type="text"
                value={settings.headerLogoText}
                onChange={(e) =>
                  setSettings({ ...settings, headerLogoText: e.target.value })
                }
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="KRIANGKRAI.P"
              />
            </div>

            {/* Background Color */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                สีพื้นหลัง Header
              </label>
              <div className="flex gap-4">
                <input
                  type="color"
                  value={settings.headerBgColor}
                  onChange={(e) =>
                    setSettings({ ...settings, headerBgColor: e.target.value })
                  }
                  className="w-20 h-10 border-2 border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.headerBgColor}
                  onChange={(e) =>
                    setSettings({ ...settings, headerBgColor: e.target.value })
                  }
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="#ffffff"
                />
              </div>
            </div>

            {/* Preview */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 font-semibold mb-2">Header Preview:</p>
              <div
                className="p-4 rounded-lg border-2 border-gray-200"
                style={{ backgroundColor: settings.headerBgColor }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-800">
                    {settings.headerLogoText || "KRIANGKRAI.P"}
                  </span>
                  <div className="flex gap-4 text-sm text-gray-700">
                    <span>หน้าแรก</span>
                    <span>เกี่ยวกับฉัน</span>
                    <span>ผลงาน</span>
                    <span>ติดต่อ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Settings */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-3xl">📄</span>
              Footer Settings
            </h2>

            {/* Logo Text */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ข้อความโลโก้
              </label>
              <input
                type="text"
                value={settings.footerLogoText}
                onChange={(e) =>
                  setSettings({ ...settings, footerLogoText: e.target.value })
                }
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="KRIANGKRAI.P"
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                คำอธิบาย
              </label>
              <textarea
                value={settings.footerDescription}
                onChange={(e) =>
                  setSettings({ ...settings, footerDescription: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="พัฒนาและเรียนรู้เทคโนโลยีใหม่ ๆ อย่างต่อเนื่อง"
              />
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                อีเมล
              </label>
              <input
                type="email"
                value={settings.footerEmail}
                onChange={(e) =>
                  setSettings({ ...settings, footerEmail: e.target.value })
                }
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="kik550123@gmail.com"
              />
            </div>

            {/* Location */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ที่อยู่
              </label>
              <input
                type="text"
                value={settings.footerLocation}
                onChange={(e) =>
                  setSettings({ ...settings, footerLocation: e.target.value })
                }
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="ภูเก็ต, Thailand"
              />
            </div>

            {/* Background Color */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                สีพื้นหลัง Footer
              </label>
              <div className="flex gap-4">
                <input
                  type="color"
                  value={settings.footerBgColor}
                  onChange={(e) =>
                    setSettings({ ...settings, footerBgColor: e.target.value })
                  }
                  className="w-20 h-10 border-2 border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.footerBgColor}
                  onChange={(e) =>
                    setSettings({ ...settings, footerBgColor: e.target.value })
                  }
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="#1f2937"
                />
              </div>
            </div>

            {/* Preview */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 font-semibold mb-2">Footer Preview:</p>
              <div
                className="p-4 rounded-lg border-2 border-gray-200 text-white"
                style={{ backgroundColor: settings.footerBgColor }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      {settings.footerLogoText || "KRIANGKRAI.P"}
                    </h3>
                    <p className="text-sm opacity-90">
                      {settings.footerDescription || "คำอธิบาย..."}
                    </p>
                  </div>
                  <div className="flex md:justify-center">
                    <ul className="space-y-2 text-sm">
                      <li>
                        <a href="/" className="hover:underline">หน้าแรก</a>
                      </li>
                      <li>
                        <a href="/Contact" className="hover:underline">ติดต่อ</a>
                      </li>
                    </ul>
                  </div>
                  <div className="md:text-right text-sm">
                    <p>
                      <span className="font-medium">อีเมล:</span> {settings.footerEmail || "email@example.com"}
                    </p>
                    <p className="mt-1">
                      <span className="font-medium">{settings.footerLocation || "Location"}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-end">
          <button
            onClick={handleReset}
            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all"
          >
            🔄 รีเซ็ต
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "กำลังบันทึก..." : "💾 บันทึกการตั้งค่า"}
          </button>
        </div>
      </div>
    </div>
  );
}

