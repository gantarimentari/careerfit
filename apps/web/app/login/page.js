"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  ArrowLeftIcon,
} from "@/components/Icons";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted", { email, password });
  };

  return (
    <div className="min-h-screen bg-[#FDF8F1] text-[#243449] flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden selection:bg-[#ffba17]/30">



      {/* Background Canvas Graphics & Decorative Illustrations (Left & Right Canvas) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">

        {/* Decorative Background Squiggles & Gradients */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-radial from-[#40789B]/10 via-[#ffba17]/5 to-transparent rounded-full blur-3xl" />

        {/* Squiggly doodle line vector (Left Side) */}
        <svg className="absolute top-1/4 left-[8%] w-48 h-48 text-[#2E6385]/15 opacity-80 hidden lg:block" viewBox="0 0 200 200" fill="none">
          <path d="M20 100 Q 50 30, 90 90 T 170 80 T 190 140" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>

        {/* Squiggly doodle line vector (Right Side) */}
        <svg className="absolute bottom-1/4 right-[8%] w-56 h-56 text-[#ffba17]/30 opacity-80 hidden lg:block" viewBox="0 0 200 200" fill="none">
          <path d="M10 50 Q 60 150, 110 70 T 180 120" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 6" fill="none" />
        </svg>

        {/* LEFT CANVAS ILLUSTRATIONS & CARDS */}
        <div className="absolute left-[3%] sm:left-[6%] lg:left-[8%] top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-6 max-w-[260px] xl:max-w-[320px] transition-all">




        </div>

        {/* RIGHT CANVAS ILLUSTRATIONS & GRAPHIC */}
        <div className="absolute right-[3%] sm:right-[6%] lg:right-[8%] top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-4 max-w-[260px] xl:max-w-[320px] transition-all">

          {/* Main Hero Person Illustration */}
          <div className="relative w-56 h-56 xl:w-64 xl:h-64 aspect-square">
            <Image
              src="/landing-page/lp-1.png"
              alt="CareerFit Graphic"
              fill
              priority
              className="object-contain drop-shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-500"
            />
          </div>


        </div>

      </div>

      {/* Main Content Area: CENTER FLOATING CARD */}
      <main className="my-auto mx-auto w-full max-w-[440px] sm:max-w-[480px] py-8 relative z-20">
        <div className="bg-white rounded-2xl border-[1px] border-[#E2EBF2]   p-8 sm:p-10 ">

          {/* Subtle top color bar line */}
          {/* <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#2E6385] via-[#40789B] to-[#ffba17]" /> */}

          {/* Header Inside Card */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#243449] tracking-tight">
              Masuk
            </h1>
            <p className="mt-2.5 text-xs sm:text-sm text-[#738496] leading-relaxed max-w-xs mx-auto">
              Halo, masukkan detail akun kamu untuk masuk ke platform CareerFit.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#4A5D6E] uppercase tracking-wider mb-2">
                Alamat Email
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-[#8FA3B5]">
                  <MailIcon className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Enter Email / Username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-[#D5DFE8] bg-[#F9FBFC] pl-12 pr-4 py-3.5 text-xs sm:text-sm text-[#243449] placeholder-[#A0B0C0] focus:border-[#2E6385] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2E6385]/10 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A5D6E] uppercase tracking-wider mb-2">
                Kata Sandi
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-[#8FA3B5]">
                  <LockIcon className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Passcode"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-[#D5DFE8] bg-[#F9FBFC] pl-12 pr-16 py-3.5 text-xs sm:text-sm text-[#243449] placeholder-[#A0B0C0] focus:border-[#2E6385] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2E6385]/10 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-xs font-bold text-[#8FA3B5] hover:text-[#2E6385] transition-colors py-1 px-1.5"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Forgot password link */}
            <div className="flex items-center justify-start pt-1">
              <a
                href="#"
                className="text-xs font-semibold text-[#556B7D] hover:text-[#2E6385] transition-colors underline decoration-dotted"
              >
                Having trouble in sign in?
              </a>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-[#ffba17] hover:bg-[#f0ad10] active:scale-[0.99] text-[#243449] font-extrabold text-sm sm:text-base transition-all cursor-pointer mt-2"
            >
              Masuk Sekarang
            </button>
          </form>

          {/* Footer inside card */}
          <div className="mt-8 pt-6 border-t border-[#F0F4F8] text-center text-xs sm:text-sm text-[#738496]">
            <span>belum punya akun? </span>
            <Link
              href="/register"
              className="font-bold text-[#2E6385] hover:underline ml-1"
            >
              Daftar Sekarang
            </Link>
          </div>

        </div>
      </main>


    </div>
  );
}


