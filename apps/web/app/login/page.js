"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  ArrowLeftIcon,
} from "@/components/Icons";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const res = await login(email, password);
    setIsSubmitting(false);

    if (res.success) {
      router.push("/dashboard");
    } else {
      setError(res.error);
    }
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

        {/* RIGHT CANVAS ILLUSTRATIONS & GRAPHIC */}
        <div className="absolute right-[3%] sm:right-[6%] lg:right-[8%] top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-4 max-w-[260px] xl:max-w-[320px] transition-all">
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
        <div className="bg-white rounded-2xl border-[1px] border-[#E2EBF2] p-8 sm:p-10 shadow-sm">

          {/* Header Inside Card */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#243449] tracking-tight">
              Masuk
            </h1>
            <p className="mt-2.5 text-xs sm:text-sm text-[#738496] leading-relaxed max-w-xs mx-auto">
              Halo, masukkan detail akun kamu untuk masuk ke platform CareerFit.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

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
                  disabled={isSubmitting}
                  className="w-full rounded-2xl border border-[#D5DFE8] bg-[#F9FBFC] pl-12 pr-4 py-3.5 text-xs sm:text-sm text-[#243449] placeholder-[#A0B0C0] focus:border-[#2E6385] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2E6385]/10 transition-all duration-200 disabled:opacity-50"
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
                  disabled={isSubmitting}
                  className="w-full rounded-2xl border border-[#D5DFE8] bg-[#F9FBFC] pl-12 pr-16 py-3.5 text-xs sm:text-sm text-[#243449] placeholder-[#A0B0C0] focus:border-[#2E6385] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2E6385]/10 transition-all duration-200 disabled:opacity-50"
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



            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-[#ffba17] hover:bg-[#f0ad10] active:scale-[0.99] text-[#243449] font-extrabold text-sm sm:text-base transition-all cursor-pointer mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-[#243449]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Memproses...</span>
                </>
              ) : (
                "Masuk Sekarang"
              )}
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
