"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import BurgerButton from "./BurgerButton";

export default function Navbar() {
  const [isScrolled, setScrolled] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    handleScroll(); // Check scroll position on mount 
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <div className="h-20">
        <div
          className={`fixed inset-x-0 top-0 z-50 transform-gpu will-change-[padding,transform] transition-[padding,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isScrolled ? "px-4 pt-4 sm:px-6" : "px-0 pt-0"
            }`}
        >
          <div
            className={`bg-background border-b border-[#C1C7CE]/50 transform-gpu origin-top transition-[transform,box-shadow,border-radius,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isScrolled
                ? "w-full bg-background scale-[0.985] rounded-[18px] shadow-sm"
                : "scale-100 rounded-b-[14px]"
              }`}
          >
            <div className="mx-auto px-4 sm:px-20">
              <div className="flex items-center justify-between h-20">
                <div className="flex items-center gap-3">
                  <Link href={isAuthenticated ? "/dashboard" : "/"} className="md:text-h-7 text-primary-dark font-semibold md:font-bold text-body-2">
                    CareerFit <span className="text-[#ffba17]">AI</span>
                  </Link>
                </div>

                {/* desktop navigation */}
                <nav className="hidden md:flex items-center gap-3">
                  <ul className="flex items-center space-x-8 font-semibold list-none text-body-2 text-primary-dark">
                    <li>
                      <a href="#beranda" className="transition-colors hover:text-primary-dark/70">
                        Beranda
                      </a>
                    </li>
                    <li>
                      <a href="#masalah" className="transition-colors hover:text-primary-dark/70">
                        Tantangan
                      </a>
                    </li>
                    <li>
                      <a href="#ekosistem" className="transition-colors hover:text-primary-dark/70">
                        Ekosistem
                      </a>
                    </li>
                    <li>
                      <a href="#cara-kerja" className="transition-colors hover:text-primary-dark/70">
                        Cara Kerja
                      </a>
                    </li>
                  </ul>
                </nav>
                <div className="hidden md:flex items-center gap-3">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="px-4 py-2 text-sm font-semibold text-primary-dark transition-colors rounded-lg bg-primary-light hover:bg-primary-light/80 cursor-pointer"
                      >
                        Dashboard ({user?.name?.split(" ")[0] || "User"})
                      </Link>
                      <button
                        onClick={logout}
                        className="px-4 py-2 text-sm font-semibold text-red-600 transition-colors rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 cursor-pointer"
                      >
                        Keluar
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="px-4 py-2 text-sm font-semibold text-primary-dark transition-colors rounded-lg bg-primary-light hover:bg-primary-light/80 cursor-pointer"
                      >
                        Masuk
                      </Link>
                      <Link
                        href="/register"
                        className="px-4 py-2 text-sm font-semibold text-white transition-colors rounded-lg bg-primary-dark hover:bg-primary-dark/80 cursor-pointer"
                      >
                        Daftar Sekarang
                      </Link>
                    </>
                  )}
                </div>
                <BurgerButton onClick={() => console.log("Burger button clicked")} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}