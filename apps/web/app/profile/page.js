"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { UserIcon, MailIcon, LockIcon } from "@/components/Icons";

export default function ProfilePage() {
  const { user, updateProfile, deleteAccount } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [targetRoles, setTargetRoles] = useState([]);
  const [newRoleInput, setNewRoleInput] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setTargetRoles(Array.isArray(user.target_roles) ? user.target_roles : []);
    }
  }, [user]);

  const handleAddRole = (e) => {
    e.preventDefault();
    const trimmed = newRoleInput.trim();
    if (trimmed && !targetRoles.includes(trimmed)) {
      setTargetRoles([...targetRoles, trimmed]);
      setNewRoleInput("");
    }
  };

  const handleRemoveRole = (roleToRemove) => {
    setTargetRoles(targetRoles.filter((r) => r !== roleToRemove));
  };

  const handleKeyDownRole = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddRole(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setIsSubmitting(true);

    const payload = {
      name,
      email,
      target_roles: targetRoles,
    };

    const res = await updateProfile(payload);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage("Profil berhasil diperbarui!");
      setTimeout(() => setSuccessMessage(""), 4000);
    } else {
      setErrorMessage(res.error);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    await deleteAccount();
  };

  return (
    <DashboardLayout pageTitle="Profil Saya">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2EBF2] shadow-sm flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2E6385] to-[#40789B] text-[#ffba17] flex items-center justify-center font-extrabold text-3xl shadow-md flex-shrink-0">
            {name ? name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#243449]">
              {name || "Pengguna CareerFit"}
            </h2>
            <p className="text-xs sm:text-sm text-[#738496]">{email}</p>
            <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start pt-1">
              {targetRoles.length > 0 ? (
                targetRoles.map((role, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 bg-[#2E6385]/10 text-[#2E6385] font-semibold text-[11px] rounded-md"
                  >
                    {role}
                  </span>
                ))
              ) : (
                <span className="text-xs italic text-[#A0B0C0]">Belum ada peran impian diatur</span>
              )}
            </div>
          </div>
        </div>

        {/* Notifications */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
            <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Edit Profile Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2EBF2] shadow-sm space-y-6">
          <div className="border-b border-[#E2EBF2] pb-4">
            <h3 className="text-lg font-extrabold text-[#243449]">Detail Informasi Akun</h3>
            <p className="text-xs sm:text-sm text-[#738496]">
              Perbarui informasi diri dan peran pekerjaan impian kamu.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-xs font-bold text-[#4A5D6E] uppercase tracking-wider mb-2">
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full rounded-2xl border border-[#D5DFE8] bg-[#F9FBFC] pl-12 pr-4 py-3.5 text-xs sm:text-sm text-[#243449] placeholder-[#A0B0C0] focus:border-[#2E6385] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2E6385]/10 transition-all duration-200"
                />
              </div>
            </div>

            {/* Email Input */}
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
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full rounded-2xl border border-[#D5DFE8] bg-[#F9FBFC] pl-12 pr-4 py-3.5 text-xs sm:text-sm text-[#243449] placeholder-[#A0B0C0] focus:border-[#2E6385] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2E6385]/10 transition-all duration-200"
                />
              </div>
            </div>

            {/* Target Roles Chip Input */}
            <div>
              <label className="block text-xs font-bold text-[#4A5D6E] uppercase tracking-wider mb-2">
                Peran Impian / Target Roles
              </label>
              <p className="text-xs text-[#738496] mb-3">
                Tambahkan peran pekerjaan yang kamu minati untuk personalisasi rekomendasi lowongan dan CV.
              </p>

              {/* Tag Chips Container */}
              <div className="flex flex-wrap gap-2 mb-3">
                {targetRoles.map((role, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2E6385] text-white text-xs font-bold rounded-xl shadow-sm"
                  >
                    {role}
                    <button
                      type="button"
                      onClick={() => handleRemoveRole(role)}
                      className="hover:text-[#ffba17] transition-colors font-bold ml-1"
                      title="Hapus peran ini"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>

              {/* Add New Role Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Contoh: Product Designer, Backend Engineer..."
                  value={newRoleInput}
                  onChange={(e) => setNewRoleInput(e.target.value)}
                  onKeyDown={handleKeyDownRole}
                  disabled={isSubmitting}
                  className="flex-1 rounded-2xl border border-[#D5DFE8] bg-[#F9FBFC] px-4 py-3 text-xs sm:text-sm text-[#243449] placeholder-[#A0B0C0] focus:border-[#2E6385] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#2E6385]/10 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={handleAddRole}
                  disabled={!newRoleInput.trim()}
                  className="px-5 py-3 rounded-2xl bg-[#2E6385] hover:bg-[#234d69] text-white font-bold text-xs sm:text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Tambah
                </button>
              </div>
            </div>

            {/* Action Submit Button */}
            <div className="pt-4 border-t border-[#E2EBF2] flex justify-between">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-6 py-3 border-2 border-red-600 hover:bg-red-700 text-red-600 hover:text-white   font-extrabold text-xs sm:text-sm rounded-2xl transition-all shadow-sm cursor-pointer"
              >
                Hapus Akun Permanen
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-2xl bg-[#ffba17] hover:bg-[#f0ad10] active:scale-[0.99] text-[#243449] font-extrabold text-sm transition-all cursor-pointer shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-[#243449]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  "Simpan Perubahan"
                )}
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E2EBF2] shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-extrabold text-[#243449]">Konfirmasi Hapus Akun</h3>
              <p className="text-xs sm:text-sm text-[#738496] leading-relaxed">
                Apakah kamu yakin ingin menghapus akun ini? Seluruh data profil dan CV kamu di CareerFit AI akan dihapus secara permanen.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 py-3 bg-[#F0F4F8] hover:bg-[#E2EBF2] text-[#243449] font-bold text-xs sm:text-sm rounded-2xl transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isDeleting ? "Hapus Akun..." : "Ya, Hapus Akun"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
