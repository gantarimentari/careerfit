"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/lib/api";
import Link from "next/link";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userTargetRoles, setUserTargetRoles] = useState([]);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [workModeFilter, setWorkModeFilter] = useState("");

  // Modal Detail & Match Score State
  const [selectedJob, setSelectedJob] = useState(null);
  const [userCvs, setUserCvs] = useState([]);
  const [selectedCvId, setSelectedCvId] = useState("");
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState(null);

  // Tracker Feedback State
  const [isAddingTracker, setIsAddingTracker] = useState(false);
  const [trackerMessage, setTrackerMessage] = useState("");

  useEffect(() => {
    fetchJobs();
    fetchUserCvs();
  }, [typeFilter, workModeFilter]);

  const fetchJobs = async (searchQuery = "") => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (typeFilter) params.type = typeFilter;
      if (workModeFilter) params.work_mode = workModeFilter;

      const res = await api.get("/jobs", { params });

      // Handle pagination or raw array
      const jobList = res.data?.data || res.data || [];
      setJobs(jobList);

      if (res.data?.user_target_roles) {
        setUserTargetRoles(res.data.user_target_roles);
      }
    } catch (err) {
      console.error("Gagal mengambil data lowongan:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCvs = async () => {
    try {
      const res = await api.get("/cv");
      const list = res.data || [];
      setUserCvs(list);
      if (list.length > 0) {
        setSelectedCvId(list[0].id);
      }
    } catch (err) {
      console.error("Gagal mengambil CV pengguna:", err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs(searchTerm);
  };

  const handleOpenDetailModal = (job) => {
    setSelectedJob(job);
    setMatchResult(null);
    setTrackerMessage("");
    const cvToUse = selectedCvId || (userCvs.length > 0 ? userCvs[0].id : null);
    handleCalculateMatch(job.id, cvToUse);
  };

  const handleCalculateMatch = async (jobId, cvIdOverride = null) => {
    const targetCvId = cvIdOverride || selectedCvId;
    setIsMatching(true);
    setMatchResult(null);
    try {
      const params = {};
      if (targetCvId) params.cv_id = targetCvId;
      const res = await api.get(`/jobs/${jobId}/match`, { params });
      setMatchResult(res.data);
    } catch (err) {
      console.error("Gagal menghitung match score:", err);
    } finally {
      setIsMatching(false);
    }
  };

  const handleAddToTracker = async (job) => {
    setIsAddingTracker(true);
    setTrackerMessage("");
    try {
      await api.post("/applications", {
        job_id: job.id,
        company: job.company,
        position: job.title,
        applied_date: new Date().toISOString().split("T")[0],
        type: job.type || "fulltime",
        location: job.location || "Indonesia",
        status: "applied",
      });
      setTrackerMessage("Berhasil ditambahkan ke Job Tracker!");
      setTimeout(() => setTrackerMessage(""), 4000);
    } catch (err) {
      setTrackerMessage(err.response?.data?.message || "Gagal menambahkan ke tracker.");
    } finally {
      setIsAddingTracker(false);
    }
  };

  return (
    <DashboardLayout pageTitle="Lowongan Kerja & Match Score">
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        {/* Top Title & Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1E3A5F]">
              Lowongan Kerja
            </h1>
            <p className="text-xs sm:text-sm text-[#738496]">
              Temukan lowongan pekerjaan yang cocok dan uji kecocokan CV kamu.
            </p>
          </div>

          {/* Target Roles Indicator Badges */}
          {userTargetRoles.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-[#738496]">Posisi Impian:</span>
              {userTargetRoles.map((role, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-[#2E6385]/10 text-[#2E6385] font-extrabold text-xs rounded-full border border-[#2E6385]/20"
                >
                  {role}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2EBF2] shadow-sm space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari posisi (misal: UI/UX, System Analyst, Software Engineer)..."
                className="w-full rounded-2xl border border-[#D5DFE8] bg-[#F9FBFC] px-4 py-3 text-xs sm:text-sm text-[#243449] focus:outline-none focus:border-[#2E6385]"
              />
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-2xl border border-[#D5DFE8] bg-[#F9FBFC] px-4 py-3 text-xs font-bold text-[#243449] focus:outline-none focus:border-[#2E6385]"
            >
              <option value="">Semua Tipe Pekerjaan</option>
              <option value="fulltime">Fulltime</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>

            {/* Work Mode Filter */}
            <select
              value={workModeFilter}
              onChange={(e) => setWorkModeFilter(e.target.value)}
              className="rounded-2xl border border-[#D5DFE8] bg-[#F9FBFC] px-4 py-3 text-xs font-bold text-[#243449] focus:outline-none focus:border-[#2E6385]"
            >
              <option value="">Semua Sistem Kerja</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">Onsite</option>
            </select>

            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-[#0F3D3E] hover:bg-[#092829] text-white font-extrabold text-xs sm:text-sm transition-all cursor-pointer shadow-sm"
            >
              Cari Lowongan
            </button>
          </form>
        </div>

        {/* Job Cards List */}
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E2EBF2] shadow-sm space-y-3">
            <svg className="animate-spin h-8 w-8 text-[#2E6385] mx-auto" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-xs text-[#738496] font-bold">Memuat daftar lowongan...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E2EBF2] shadow-sm space-y-2">
            <p className="text-sm font-extrabold text-[#243449]">Tidak ada lowongan ditemukan</p>
            <p className="text-xs text-[#738496]">Coba kata kunci pencarian lain atau ubah filter Anda.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-3xl p-6 border border-[#E2EBF2] shadow-sm hover:shadow-md transition-all duration-200 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Company & Title Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#2E6385]/10 text-[#2E6385] font-extrabold text-lg flex items-center justify-center flex-shrink-0 shadow-sm border border-[#2E6385]/20">
                        {job.company ? job.company.charAt(0) : "C"}
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-[#243449]">
                          {job.title}
                        </h3>
                        <p className="text-xs font-bold text-[#738496]">{job.company}</p>
                      </div>
                    </div>
                  </div>

                  {/* Badges Info */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="px-2.5 py-1 bg-[#F0F4F8] text-[#2E6385] font-semibold text-[11px] rounded-lg">
                      {job.location}
                    </span>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[11px] rounded-lg uppercase">
                      {job.work_mode}
                    </span>
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-[11px] rounded-lg capitalize">
                      {job.type}
                    </span>
                  </div>

                  {/* Description Snippet */}
                  <p className="text-xs text-[#556B7D] leading-relaxed line-clamp-2">
                    {job.description}
                  </p>

                  {/* Skills Chips */}
                  {job.required_skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.required_skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 bg-[#FAF9F5] text-[#4A5D6E] border border-[#E6E1D5] text-[10px] font-bold rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Salary Range */}
                  {job.salary_range && (
                    <p className="text-xs font-extrabold text-[#2E6385] pt-1">
                      {job.salary_range}
                    </p>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="pt-4 border-t border-[#E2EBF2] flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleOpenDetailModal(job)}
                    className="px-4 py-2.5 rounded-xl bg-[#F0F4F8] hover:bg-[#E2EBF2] text-[#2E6385] font-extrabold text-xs transition-colors cursor-pointer"
                  >
                    Detail & Match Score
                  </button>
                  <button
                    onClick={() => handleAddToTracker(job)}
                    className="px-4 py-2.5 rounded-xl bg-[#0F3D3E] hover:bg-[#092829] text-white font-extrabold text-xs transition-colors cursor-pointer shadow-sm"
                  >
                    Tambah ke Job Tracker
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* JOB DETAIL & MATCH SCORE MODAL */}
        {selectedJob && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-[#E2EBF2] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-[#E2EBF2] pb-4">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 bg-[#2E6385]/10 text-[#2E6385] text-[11px] font-extrabold rounded-md uppercase">
                    {selectedJob.company}
                  </span>
                  <h3 className="text-xl font-extrabold text-[#243449]">
                    {selectedJob.title}
                  </h3>
                  <p className="text-xs text-[#738496]">{selectedJob.location} · {selectedJob.salary_range}</p>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-gray-400 hover:text-gray-600 font-bold text-xl cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Match Score Calculator Box */}
              <div className="bg-gradient-to-br from-[#243449] to-[#2E6385] rounded-2xl p-5 text-white space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="text-sm font-extrabold">Uji Kecocokan CV (Match Score)</h4>
                    <p className="text-xs text-slate-300">
                      Bandingkan kata kunci CV Anda dengan persyarat lowongan ini.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedCvId}
                      onChange={(e) => setSelectedCvId(e.target.value)}
                      className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold text-white focus:outline-none"
                    >
                      {userCvs.map((cv) => (
                        <option key={cv.id} value={cv.id} className="text-[#243449]">
                          {cv.title}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => handleCalculateMatch(selectedJob.id)}
                      disabled={isMatching}
                      className="px-4 py-2 rounded-xl bg-[#ffba17] text-[#243449] font-extrabold text-xs hover:bg-[#f0ad10] transition-colors cursor-pointer"
                    >
                      {isMatching ? "Menghitung..." : "Hitung"}
                    </button>
                  </div>
                </div>

                {/* Match Calculation Result */}
                {matchResult && (
                  <div className="bg-white/10 p-4 rounded-xl border border-white/15 space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">Skor Kecocokan Keyword:</span>
                      <span className="text-2xl font-black text-[#ffba17]">
                        {matchResult.match_score}%
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      {matchResult.matched_keywords?.length > 0 && (
                        <div>
                          <span className="font-bold text-emerald-300">✓ Keyword Cocok:</span>{" "}
                          <span className="text-slate-200">{matchResult.matched_keywords.join(", ")}</span>
                        </div>
                      )}

                      {matchResult.missing_keywords?.length > 0 && (
                        <div>
                          <span className="font-bold text-amber-300">! Keyword Belum Ada di CV:</span>{" "}
                          <span className="text-slate-200">{matchResult.missing_keywords.join(", ")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#4A5D6E]">
                  Deskripsi Pekerjaan
                </h4>
                <p className="text-xs text-[#334155] leading-relaxed whitespace-pre-line bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2EBF2]">
                  {selectedJob.description}
                </p>
              </div>

              {/* Required Skills */}
              {selectedJob.required_skills?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#4A5D6E]">
                    Keahlian yang Dibutuhkan
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.required_skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-[#2E6385]/10 text-[#2E6385] text-xs font-bold rounded-xl"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tracker Notification */}
              {trackerMessage && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  {trackerMessage}
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex justify-end gap-3 pt-2 border-t border-[#E2EBF2]">
                <button
                  onClick={() => setSelectedJob(null)}
                  className="px-5 py-2.5 bg-[#F0F4F8] hover:bg-[#E2EBF2] text-[#243449] font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  onClick={() => handleAddToTracker(selectedJob)}
                  disabled={isAddingTracker}
                  className="px-6 py-2.5 bg-[#0F3D3E] hover:bg-[#092829] text-white font-extrabold text-xs rounded-xl transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isAddingTracker ? "Menambahkan..." : "Tambah ke Job Tracker"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
