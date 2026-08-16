"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout({ children, pageTitle = "Dashboard" }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#FDF8F1] text-[#243449] selection:bg-[#ffba17]/30">
      {/* Sidebar Component */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area Wrapper */}
      <div
        className={`transition-all duration-300 ease-in-out flex flex-col min-h-screen ${collapsed ? "lg:ml-20" : "lg:ml-64"
          }`}
      >
        {/* Top Header Bar */}
        <header className="bg-white border-b border-[#E2EBF2] sticky top-0 z-30 px-4 sm:px-8 py-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Burger Trigger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[#243449] hover:bg-[#F0F4F8] transition-colors"
              aria-label="Buka Menu Sidebar"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <h1 className="text-lg sm:text-xl font-extrabold text-[#243449] tracking-tight">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-[#F0F4F8] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#2E6385] text-[#ffba17] flex items-center justify-center font-extrabold text-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="flex flex-col ">
                <span className="hidden sm:inline text-xs sm:text-sm font-bold text-[#243449]">
                  {user?.name || "Profil Saya"}
                </span>
                <p className="text-[11px] text-[#738496] truncate">{user?.email || ""}</p>
              </div>

            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
