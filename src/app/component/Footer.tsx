"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "@/lib/api-config";

export default function Footer() {
  const pathname = usePathname();
  const [settings, setSettings] = useState({
    footerLogoText: "KRIANGKRAI.P",
    footerDescription: "พัฒนาและเรียนรู้เทคโนโลยีใหม่ ๆ อย่างต่อเนื่อง",
    footerEmail: "kik550123@gmail.com",
    footerLocation: "ภูเก็ต, Thailand",
    footerBgColor: "#1f2937",
    footerTextColor: "#ffffff",
  });

  // ซ่อน Footer ในหน้า admin
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  // โหลด settings จาก API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.SETTINGS, {
          credentials: "include",
        });
        const data = await response.json();
        if (data && !data.error) {
          setSettings({
            footerLogoText: data.footerLogoText || "KRIANGKRAI.P",
            footerDescription: data.footerDescription || "พัฒนาและเรียนรู้เทคโนโลยีใหม่ ๆ อย่างต่อเนื่อง",
            footerEmail: data.footerEmail || "kik550123@gmail.com",
            footerLocation: data.footerLocation || "ภูเก็ต, Thailand",
            footerBgColor: data.footerBgColor || "#1f2937",
            footerTextColor: data.footerTextColor || "#ffffff",
          });
        }
      } catch (error) {
        console.error("Error loading footer settings:", error);
      }
    };
    loadSettings();
  }, []);

  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 border-t" style={{ backgroundColor: settings.footerBgColor }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div>
            <h2 className="text-xl font-bold" style={{ color: settings.footerTextColor }}>{settings.footerLogoText}</h2>
            <p className="mt-2" style={{ color: settings.footerTextColor, opacity: 0.9 }}>{settings.footerDescription}</p>
          </div>

          <div className="flex md:justify-center">
            <ul className="space-y-2" style={{ color: settings.footerTextColor, opacity: 0.9 }}>
              <li>
                <a className="hover:opacity-100 transition-opacity" style={{ color: settings.footerTextColor }} href="/#">หน้าแรก</a>
              </li>
              <li>
                <a className="hover:opacity-100 transition-opacity" style={{ color: settings.footerTextColor }} href="/#contact">ติดต่อ</a>
              </li>
            </ul>
          </div>

          <div className="md:text-right" style={{ color: settings.footerTextColor, opacity: 0.9 }}>
            <p>
              <span className="font-medium" style={{ opacity: 1 }}>อีเมล:</span> {settings.footerEmail}
            </p>
            <p className="mt-1">
              <span className="font-medium" style={{ opacity: 1 }}>{settings.footerLocation}</span>
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t pt-6" style={{ borderColor: settings.footerTextColor, opacity: 0.3 }}>
          <p className="text-sm" style={{ color: settings.footerTextColor, opacity: 0.9 }}>© {year} {settings.footerLogoText}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm hover:opacity-100 transition-opacity" style={{ color: settings.footerTextColor, opacity: 0.9 }}>Privacy</a>
            <a href="/" className="text-sm hover:opacity-100 transition-opacity" style={{ color: settings.footerTextColor, opacity: 0.9 }}>Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}


