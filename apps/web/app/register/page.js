"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  UserIcon,
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  ArrowLeftIcon,
} from "@/components/Icons";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Konfirmasi kata sandi tidak cocok!");
      return;
    }
    console.log("Register submitted", { fullName, email, password, agreeTerms });
  };

  return (
    <div className="min-h-screen bg-[#FDF8F1] text-[#243449] flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden selection:bg-[#ffba17]/30">



      {/* Background Canvas Graphics & Decorative Illustrations (Left & Right Canvas) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">

        {/* Decorative Background Squiggles & Gradients */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-radial from-[#40789B]/10 via-[#ffba17]/5 to-transparent " />

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
          {/* LEFT CANVAS: Clean & Minimalist Organic Blobs */}
          <div className="absolute left-[2%] sm:left-[5%] lg:left-[8%] top-1/2 -translate-y-1/2 hidden md:block w-[300px] xl:w-[380px] h-[400px] pointer-events-none z-0">

            {/* Blob Utama (Warm Yellow Glow) */}
            <div className="absolute bottom-3/4 left-3/4 w-40 h-40 bg-[#ffba17]/15 rounded-full  animate-pulse duration-1000" />



            {/* Shape Abstrak Vektor Murni (Tanpa Teks / Tanpa Card) */}
            <svg
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full text-[#ffba17]/10"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="currentColor"
                d="M44.7,-59.1C56.8,-49.8,64.8,-35.3,68.4,-19.9C72,-4.5,71.2,11.8,64.8,25.9C58.4,40,46.4,51.8,32.3,59.3C18.2,66.8,2,70,-13.7,68.1C-29.4,66.2,-44.6,59.2,-55.8,47.5C-67,35.8,-74.2,19.4,-73.8,3.2C-73.4,-13,-65.4,-29,-54.1,-38.8C-42.8,-48.6,-28.2,-52.2,-13.9,-54.8C0.4,-57.4,28.7,-68.4,44.7,-59.1Z"
                transform="translate(100 100)"
              />
            </svg>
          </div>
          {/* Blob Kedua (Muted Blue Gradient) */}
          <div className="absolute  right-0 w-72 h-72 bg-red-300/70 rounded-full " />
        </div>

        {/* RIGHT CANVAS ILLUSTRATIONS & GRAPHIC */}
        <div className="absolute right-[3%] sm:right-[6%] lg:right-[8%] top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-4 max-w-[260px] xl:max-w-[320px] transition-all">

          {/* Main Hero Register Illustration */}
          <div className="relative w-56 h-56 xl:w-64 xl:h-64 aspect-square">
            <Image
              src="/landing-page/lp-4.png"
              alt="CareerFit Register Graphic"
              fill
              priority
              className="object-contain drop-shadow-lg transform rotate-2 hover:rotate-0 transition-transform duration-500"
            />
          </div>


        </div>

      </div>

      {/* Main Content Area: CENTER FLOATING CARD */}
      <main className="my-auto mx-auto w-full max-w-[460px] sm:max-w-[480px] py-6 relative z-20">
        <div className="bg-white rounded-2xl border-[1px] border-[#E2EBF2]   p-8 sm:p-10 ">
          {/* Header Inside Card */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#243449] tracking-tight">
              Buat Akun Baru
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#738496] leading-relaxed max-w-xs mx-auto">
              Lengkapi data kamu untuk mendaftar akun baru di CareerFit.
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#4A5D6E] uppercase tracking-wider mb-1.5">
                Nama Lengkap
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-[#8FA3B5]">
                  <UserIcon className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap Anda"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-2xl border border-[#D5DFE8] bg-[#F9FBFC] pl-12 pr-4 py-3 text-xs sm:text-sm text-[#243449] placeholder-[#A0B0C0] focus:border-[#2E6385] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2E6385]/10 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A5D6E] uppercase tracking-wider mb-1.5">
                Alamat Email
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-[#8FA3B5]">
                  <MailIcon className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-[#D5DFE8] bg-[#F9FBFC] pl-12 pr-4 py-3 text-xs sm:text-sm text-[#243449] placeholder-[#A0B0C0] focus:border-[#2E6385] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2E6385]/10 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A5D6E] uppercase tracking-wider mb-1.5">
                Kata Sandi
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-[#8FA3B5]">
                  <LockIcon className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Minimal 8 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-[#D5DFE8] bg-[#F9FBFC] pl-12 pr-16 py-3 text-xs sm:text-sm text-[#243449] placeholder-[#A0B0C0] focus:border-[#2E6385] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2E6385]/10 transition-all duration-200"
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

            <div>
              <label className="block text-xs font-bold text-[#4A5D6E] uppercase tracking-wider mb-1.5">
                Konfirmasi Kata Sandi
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-[#8FA3B5]">
                  <LockIcon className="w-5 h-5" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Ulangi kata sandi"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-2xl border border-[#D5DFE8] bg-[#F9FBFC] pl-12 pr-16 py-3 text-xs sm:text-sm text-[#243449] placeholder-[#A0B0C0] focus:border-[#2E6385] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2E6385]/10 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 text-xs font-bold text-[#8FA3B5] hover:text-[#2E6385] transition-colors py-1 px-1.5"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>



            {/* Primary Action Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-[#ffba17] hover:bg-[#f0ad10] active:scale-[0.99] text-[#243449] font-extrabold text-sm sm:text-base transition-all cursor-pointer mt-2"
            >
              Daftar Sekarang
            </button>
          </form>

          {/* Footer inside card */}
          <div className="mt-6 pt-5 border-t border-[#F0F4F8] text-center text-xs sm:text-sm text-[#738496]">
            <span>Sudah punya akun? </span>
            <Link
              href="/login"
              className="font-bold text-[#2E6385] hover:underline ml-1"
            >
              masuk sekarang
            </Link>
          </div>

        </div>
      </main>

    </div>
  );
}


