"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/lib/api";

export default function ApplicationTrackerPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Form State
  const [form, setForm] = useState({
    company: "",
    position: "",
    applied_date: "",
    deadline: "",
    type: "Full-time",
    contact: "",
    location: "",
    status: "applied",
  });

  const statusOptions = [
    { value: "interview", label: "Interview", bg: "bg-[#FEF3C7]", text: "text-[#D97706]", border: "border-[#FDE68A]" },
    { value: "applied", label: "Applied", bg: "bg-[#E0F2FE]", text: "text-[#0284C7]", border: "border-[#BAE6FD]" },
    { value: "offer", label: "Offer", bg: "bg-[#DCFCE7]", text: "text-[#16A34A]", border: "border-[#BBF7D0]" },
    { value: "rejected", label: "Rejected", bg: "bg-[#FEE2E2]", text: "text-[#DC2626]", border: "border-[#FECACA]" },
    { value: "no_reply", label: "No Reply", bg: "bg-[#FEF3C7]", text: "text-[#92400E]", border: "border-[#FDE68A]" },
    { value: "not_started", label: "Not Started", bg: "bg-[#F1F5F9]", text: "text-[#64748B]", border: "border-[#E2E8F0]" },
  ];

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/applications");
      setApplications(res.data || []);
    } catch (err) {
      console.error("Gagal mengambil data lamaran:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setForm({
      company: "",
      position: "",
      applied_date: new Date().toISOString().split("T")[0],
      deadline: "",
      type: "Full-time",
      contact: "",
      location: "",
      status: "applied",
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (app) => {
    setIsEditing(true);
    setEditingId(app.id);
    setForm({
      company: app.company || "",
      position: app.position || "",
      applied_date: app.applied_date || "",
      deadline: app.deadline || "",
      type: app.type || "Full-time",
      contact: app.contact || "",
      location: app.location || "",
      status: app.status || "applied",
    });
    setShowModal(true);
  };

  const handleStatusChangeInline = async (appId, newStatus) => {
    try {
      await api.patch(`/applications/${appId}`, { status: newStatus });
      setApplications((prev) =>
        prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
      );
    } catch (err) {
      console.error("Gagal memperbarui status:", err);
    }
  };

  const handleDeleteApplication = async (appId) => {
    if (!confirm("Apakah kamu yakin ingin menghapus catatan lamaran ini?")) return;
    try {
      await api.delete(`/applications/${appId}`);
      setApplications((prev) => prev.filter((app) => app.id !== appId));
    } catch (err) {
      console.error("Gagal menghapus lamaran:", err);
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      if (isEditing && editingId) {
        await api.patch(`/applications/${editingId}`, form);
        setMessage({ type: "success", text: "Lamaran berhasil diperbarui!" });
      } else {
        await api.post("/applications", form);
        setMessage({ type: "success", text: "Lamaran baru berhasil ditambahkan!" });
      }
      fetchApplications();
      setTimeout(() => {
        setShowModal(false);
        setMessage({ type: "", text: "" });
      }, 1000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Gagal menyimpan lamaran.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateDisplay = (dateString) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatShortDate = (dateString) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (statusValue) => {
    const found = statusOptions.find((s) => s.value === statusValue);
    if (found) return found;
    return { value: statusValue, label: statusValue, bg: "bg-[#F1F5F9]", text: "text-[#64748B]", border: "border-[#E2E8F0]" };
  };

  return (
    <DashboardLayout pageTitle="Job Tracker">
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        {/* Top Title & Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1E3A5F]">
              Job Tracker
            </h1>
            <p className="text-xs sm:text-sm text-[#738496]">
              Semua lamaran kamu dalam satu tampilan.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-6 py-3 rounded-full bg-[#0F3D3E] hover:bg-[#092829] text-white font-extrabold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <span>+ Tambah Manual</span>
          </button>
        </div>

        {/* Table Container Card */}
        <div className="bg-[#FAF9F5] rounded-3xl border border-[#E2EBF2] shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center space-y-3">
              <svg className="animate-spin h-8 w-8 text-[#0F3D3E] mx-auto" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-xs text-[#738496] font-bold">Memuat daftar pelacakan lamaran...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <p className="text-sm font-extrabold text-[#243449]">Belum ada lamaran dicatat</p>
              <p className="text-xs text-[#738496]">
                Klik tombol <strong>+ Tambah Manual</strong> di atas atau simpan lowongan dari menu Lowongan Kerja.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#EBEFE9] text-[11px] font-extrabold text-[#556B7D] uppercase tracking-wider bg-[#F5F2EA]/60">
                    <th className="py-4 px-5">Perusahaan</th>
                    <th className="py-4 px-5">Posisi</th>
                    <th className="py-4 px-5">Tanggal</th>
                    <th className="py-4 px-5">Deadline</th>
                    <th className="py-4 px-5">Tipe</th>
                    <th className="py-4 px-5">Kontak</th>
                    <th className="py-4 px-5">Lokasi</th>
                    <th className="py-4 px-5 text-center">Status</th>
                    <th className="py-4 px-5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBEFE9] text-xs text-[#243449]">
                  {applications.map((app) => {
                    const badge = getStatusBadge(app.status);
                    return (
                      <tr key={app.id} className="hover:bg-white/80 transition-colors">
                        <td className="py-4 px-5 font-bold text-[#0F172A]">
                          {app.company}
                        </td>
                        <td className="py-4 px-5 font-medium text-[#334155]">
                          {app.position}
                        </td>
                        <td className="py-4 px-5 text-[#64748B]">
                          {formatDateDisplay(app.applied_date)}
                        </td>
                        <td className="py-4 px-5 text-[#64748B]">
                          {formatShortDate(app.deadline)}
                        </td>
                        <td className="py-4 px-5">
                          <span className="px-2.5 py-1 bg-[#F5F2EA] text-[#4A5D6E] font-semibold text-[11px] rounded-lg border border-[#E6E1D5]">
                            {app.type || "Full-time"}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-[#64748B]">
                          {app.contact || "—"}
                        </td>
                        <td className="py-4 px-5 text-[#64748B]">
                          {app.location || "—"}
                        </td>
                        <td className="py-4 px-5 text-center">
                          {/* Status Select Badge */}
                          <select
                            value={app.status || "applied"}
                            onChange={(e) => handleStatusChangeInline(app.id, e.target.value)}
                            className={`px-3 py-1 text-[11px] font-bold rounded-full border ${badge.bg} ${badge.text} ${badge.border} cursor-pointer focus:outline-none appearance-none text-center shadow-2xs`}
                          >
                            {statusOptions.map((opt) => (
                              <option key={opt.value} value={opt.value} className="bg-white text-[#243449]">
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-4 px-5 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(app)}
                            className="text-[#2E6385] hover:underline font-bold text-[11px] cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteApplication(app.id)}
                            className="text-red-600 hover:underline font-bold text-[11px] cursor-pointer ml-2"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MODAL FOR ADD / EDIT APPLICATION */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#E2EBF2] shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between border-b border-[#E2EBF2] pb-4">
                <h3 className="text-lg font-extrabold text-[#243449]">
                  {isEditing ? "Edit Catatan Lamaran" : "Tambah Lamaran Baru"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 font-bold text-xl cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {message.text && (
                <div
                  className={`p-3 rounded-xl text-xs border ${
                    message.type === "success"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmitForm} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#4A5D6E] uppercase tracking-wider mb-1.5">
                      Nama Perusahaan *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="Contoh: Tokopedia"
                      className="w-full rounded-2xl border border-[#D5DFE8] bg-[#F9FBFC] px-4 py-2.5 text-xs text-[#243449] focus:outline-none focus:border-[#2E6385]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4A5D6E] uppercase tracking-wider mb-1.5">
                      Posisi Pekerjaan *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.position}
                      onChange={(e) => setForm({ ...form, position: e.target.value })}
                      placeholder="Contoh: Junior UI/UX Designer"
                      className="w-full rounded-2xl border border-[#D5DFE8] bg-[#F9FBFC] px-4 py-2.5 text-xs text-[#243449] focus:outline-none focus:border-[#2E6385]"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#4A5D6E] uppercase tracking-wider mb-1.5">
                      Tanggal Melamar
                    </label>
                    <input
                      type="date"
                      value={form.applied_date}
                      onChange={(e) => setForm({ ...form, applied_date: e.target.value })}
                      className="w-full rounded-2xl border border-[#D5DFE8] bg-[#F9FBFC] px-4 py-2.5 text-xs text-[#243449] focus:outline-none focus:border-[#2E6385]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4A5D6E] uppercase tracking-wider mb-1.5">
                      Deadline / Tenggat
                    </label>
                    <input
                      type="date"
                      value={form.deadline}
                      onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                      className="w-full rounded-2xl border border-[#D5DFE8] bg-[#F9FBFC] px-4 py-2.5 text-xs text-[#243449] focus:outline-none focus:border-[#2E6385]"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#4A5D6E] uppercase tracking-wider mb-1.5">
                      Tipe Pekerjaan
                    </label>
                    <input
                      type="text"
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      placeholder="Full-time, Internship, Contract..."
                      className="w-full rounded-2xl border border-[#D5DFE8] bg-[#F9FBFC] px-4 py-2.5 text-xs text-[#243449] focus:outline-none focus:border-[#2E6385]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4A5D6E] uppercase tracking-wider mb-1.5">
                      Kontak Recruiter / PIC
                    </label>
                    <input
                      type="text"
                      value={form.contact}
                      onChange={(e) => setForm({ ...form, contact: e.target.value })}
                      placeholder="Diana R. / HRD"
                      className="w-full rounded-2xl border border-[#D5DFE8] bg-[#F9FBFC] px-4 py-2.5 text-xs text-[#243449] focus:outline-none focus:border-[#2E6385]"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#4A5D6E] uppercase tracking-wider mb-1.5">
                      Lokasi / System
                    </label>
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="Jakarta, Remote, Bandung..."
                      className="w-full rounded-2xl border border-[#D5DFE8] bg-[#F9FBFC] px-4 py-2.5 text-xs text-[#243449] focus:outline-none focus:border-[#2E6385]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4A5D6E] uppercase tracking-wider mb-1.5">
                      Status Lamaran
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full rounded-2xl border border-[#D5DFE8] bg-[#F9FBFC] px-4 py-2.5 text-xs text-[#243449] focus:outline-none focus:border-[#2E6385]"
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2EBF2] flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-[#F0F4F8] hover:bg-[#E2EBF2] text-[#243449] font-bold text-xs cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-[#0F3D3E] hover:bg-[#092829] text-white font-extrabold text-xs cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {isSubmitting ? "Menyimpan..." : "Simpan Lamaran"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
