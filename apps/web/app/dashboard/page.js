"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/lib/api";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await api.get("/dashboard");
        setDashboardData(res.data);
      } catch (err) {
        console.error("Gagal mengambil data dashboard:", err);
      } finally {
        setLoadingData(false);
      }
    }
    fetchDashboard();
  }, []);

  const targetRoles = dashboardData?.target_roles || user?.target_roles || [];

  return (
    <DashboardLayout pageTitle="Dashboard">
      <div className="space-y-8 pb-12">
        {/* Hero Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2E6385] via-[#244C67] to-[#1E3A5F] text-white p-6 sm:p-10 shadow-lg space-y-4">
          <div className="relative z-10 max-w-3xl space-y-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Selamat datang kembali, {dashboardData?.greeting_name || user?.name || "Pengguna"}! 👋
            </h1>

            {/* Target Roles Subtitle Banner */}
            {targetRoles.length > 0 ? (
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-200">
                <span>Rekomendasi dipersonalisasi untuk posisi impian:</span>
                {targetRoles.map((role, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 bg-[#ffba17] text-[#243449] font-extrabold text-xs rounded-lg shadow-2xs"
                  >
                    {role}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                Optimalkan CV kamu, temukan lowongan yang cocok, dan pantau lamaran pekerjaanmu di satu tempat.
              </p>
            )}
          </div>
        </div>

        {/* 4 Summary Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Kelengkapan Profil */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2EBF2] shadow-sm flex flex-col justify-between space-y-3">
            <span className="text-xs font-bold text-[#738496] uppercase tracking-wider">
              Kelengkapan Profil
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-[#243449]">
                {loadingData ? "..." : `${dashboardData?.profile_completeness ?? 0}%`}
              </span>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                {dashboardData?.profile_completeness >= 80 ? "Sangat Baik" : "Perlu Diisi"}
              </span>
            </div>
            <div className="w-full bg-[#F0F4F8] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#ffba17] h-full rounded-full transition-all duration-500"
                style={{ width: `${dashboardData?.profile_completeness ?? 0}%` }}
              />
            </div>
          </div>

          {/* Card 2: Lowongan Cocok */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2EBF2] shadow-sm flex flex-col justify-between space-y-3">
            <span className="text-xs font-bold text-[#738496] uppercase tracking-wider">
              Lowongan Cocok
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-[#2E6385]">
                {loadingData ? "..." : dashboardData?.job_matches_count ?? 0}
              </span>
              {dashboardData?.job_matches_new_this_week > 0 && (
                <span className="text-xs text-[#2E6385] font-bold bg-[#2E6385]/10 px-2.5 py-1 rounded-lg">
                  +{dashboardData?.job_matches_new_this_week} minggu ini
                </span>
              )}
            </div>
            <p className="text-xs text-[#738496]">Sesuai dengan kualifikasi kamu</p>
          </div>

          {/* Card 3: Lamaran Aktif */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2EBF2] shadow-sm flex flex-col justify-between space-y-3">
            <span className="text-xs font-bold text-[#738496] uppercase tracking-wider">
              Lamaran Aktif
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-[#243449]">
                {loadingData ? "..." : dashboardData?.active_applications_count ?? 0}
              </span>
              <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                Terpantau
              </span>
            </div>
            <p className="text-xs text-[#738496]">Dalam tahap seleksi</p>
          </div>

          {/* Card 4: Jadwal Wawancara */}
          <div className="bg-white rounded-3xl p-6 border border-[#E2EBF2] shadow-sm flex flex-col justify-between space-y-3">
            <span className="text-xs font-bold text-[#738496] uppercase tracking-wider">
              Jadwal Wawancara
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-[#ffba17]">
                {loadingData ? "..." : dashboardData?.interviews_scheduled_count ?? 0}
              </span>
              <span className="text-xs text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                Mendatang
              </span>
            </div>
            <p className="text-xs text-[#738496]">Siapkan diri kamu</p>
          </div>
        </div>

        {/* 2-Column Main Section: Recommended Jobs (Left) & AI Tips + Quick Links (Right) */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: RECOMMENDED JOBS FROM CONTROLLER (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-[#243449] flex items-center gap-2">
                Rekomendasi Lowongan Teratas
              </h2>
              <Link
                href="/jobs"
                className="text-xs font-bold text-[#2E6385] hover:underline"
              >
                Lihat Semua Lowongan →
              </Link>
            </div>

            {loadingData ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-[#E2EBF2] shadow-sm space-y-2">
                <p className="text-xs text-[#738496] font-bold">Memuat rekomendasi lowongan...</p>
              </div>
            ) : !dashboardData?.recommended_jobs || dashboardData.recommended_jobs.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-[#E2EBF2] shadow-sm space-y-2">
                <p className="text-sm font-extrabold text-[#243449]">Belum ada rekomendasi lowongan</p>
                <p className="text-xs text-[#738496]">
                  Lengkapi data CV dan Posisi Impian kamu untuk mendapatkan rekomendasi yang presisi.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboardData.recommended_jobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-3xl p-5 border border-[#E2EBF2] shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-[#2E6385]/10 text-[#2E6385] font-extrabold text-lg flex items-center justify-center flex-shrink-0">
                        {job.company ? job.company.charAt(0) : "J"}
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-[#243449]">
                          {job.title}
                        </h4>
                        <p className="text-xs text-[#738496]">
                          {job.company} · <span className="font-semibold">{job.location}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {job.match_score > 0 ? (
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold rounded-xl">
                          {job.match_score}% Match
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl">
                          Rekomendasi
                        </span>
                      )}
                      <Link
                        href="/jobs"
                        className="px-4 py-2 rounded-xl bg-[#2E6385] text-white text-xs font-bold hover:bg-[#234d69] transition-colors"
                      >
                        Detail
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: AI TIPS & QUICK ACTIONS (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Card: Tips CareerFit AI */}
            <div className="bg-white rounded-3xl p-6 border border-[#E2EBF2] shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-[#243449] flex items-center gap-2">
                Rekomendasi Langkah Selanjutnya
              </h3>

              {dashboardData?.tips && dashboardData.tips.length > 0 ? (
                <ul className="space-y-3">
                  {dashboardData.tips.map((tip, idx) => (
                    <li
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#FAF9F5] border border-[#EBEFE9] text-xs text-[#334155] font-medium flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#ffba17] text-[#243449] font-black text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-[#738496]">Selesaikan profil kamu untuk saran optimasi AI.</p>
              )}
            </div>

            {/* Card: Quick Navigation Links */}
            <div className="bg-white rounded-3xl p-6 border border-[#E2EBF2] shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-[#243449]">
                Akses Cepat Fitur
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/cv"
                  className="p-4 rounded-2xl bg-[#F0F4F8] hover:bg-[#E2EBF2] text-[#2E6385] font-bold text-xs flex flex-col items-center justify-center text-center gap-2 transition-colors"
                >
                  <span className="text-xl">📄</span>
                  <span>CV & ATS Score</span>
                </Link>

                <Link
                  href="/jobs"
                  className="p-4 rounded-2xl bg-[#F0F4F8] hover:bg-[#E2EBF2] text-[#2E6385] font-bold text-xs flex flex-col items-center justify-center text-center gap-2 transition-colors"
                >
                  <span className="text-xl">💼</span>
                  <span>Lowongan Kerja</span>
                </Link>

                <Link
                  href="/applications"
                  className="p-4 rounded-2xl bg-[#F0F4F8] hover:bg-[#E2EBF2] text-[#2E6385] font-bold text-xs flex flex-col items-center justify-center text-center gap-2 transition-colors"
                >
                  <span className="text-xl">📌</span>
                  <span>Tracker Lamaran</span>
                </Link>

                <Link
                  href="/profile"
                  className="p-4 rounded-2xl bg-[#F0F4F8] hover:bg-[#E2EBF2] text-[#2E6385] font-bold text-xs flex flex-col items-center justify-center text-center gap-2 transition-colors"
                >
                  <span className="text-xl">👤</span>
                  <span>Profil Saya</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
