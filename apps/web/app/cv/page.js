"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function CvPage() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("builder"); // 'ats' | 'builder'

  // --- ATS Tab State ---
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedCv, setUploadedCv] = useState(null); // { cv_id, parsed_preview, status }
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [atsError, setAtsError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  // --- CV Builder State ---
  const [cvList, setCvList] = useState([]);
  const [selectedCvId, setSelectedCvId] = useState(null);
  const [isSavingCv, setIsSavingCv] = useState(false);
  const [builderMessage, setBuilderMessage] = useState({ type: "", text: "" });

  const [cvTitle, setCvTitle] = useState("CV Utama");
  const [personalInfo, setPersonalInfo] = useState({
    full_name: "",
    headline: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
  });
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  const [experienceList, setExperienceList] = useState([
    { company: "", role: "", start: "", end: "", description: "" },
  ]);
  const [educationList, setEducationList] = useState([
    { school: "", degree: "", start: "", end: "" },
  ]);
  const [projectList, setProjectList] = useState([
    { name: "", link: "", description: "" },
  ]);

  // Fetch CVs on mount
  useEffect(() => {
    fetchUserCvs();
  }, []);

  useEffect(() => {
    if (user && !personalInfo.full_name) {
      setPersonalInfo((prev) => ({
        ...prev,
        full_name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const fetchUserCvs = async () => {
    try {
      const res = await api.get("/cv");
      if (Array.isArray(res.data) && res.data.length > 0) {
        setCvList(res.data);
      }
    } catch (err) {
      console.error("Gagal mengambil daftar CV:", err);
    }
  };

  const loadCvDetail = async (cvId) => {
    try {
      const res = await api.get(`/cv/${cvId}`);
      const data = res.data;
      setSelectedCvId(data.id);
      setCvTitle(data.title || "CV Utama");
      setPersonalInfo({
        full_name: data.personal_info?.full_name || "",
        headline: data.personal_info?.headline || "",
        email: data.personal_info?.email || "",
        phone: data.personal_info?.phone || "",
        location: data.personal_info?.location || "",
        linkedin: data.personal_info?.linkedin || "",
      });
      setSummary(data.summary || "");
      setSkills(Array.isArray(data.skills) ? data.skills : []);
      setExperienceList(
        Array.isArray(data.experience) && data.experience.length > 0
          ? data.experience
          : [{ company: "", role: "", start: "", end: "", description: "" }]
      );
      setEducationList(
        Array.isArray(data.education) && data.education.length > 0
          ? data.education
          : [{ school: "", degree: "", start: "", end: "" }]
      );
      setProjectList(
        Array.isArray(data.projects) && data.projects.length > 0
          ? data.projects
          : [{ name: "", link: "", description: "" }]
      );
    } catch (err) {
      console.error("Gagal memuat detail CV:", err);
    }
  };

  // --- ATS Tab Handlers ---
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const ext = file.name.split(".").pop().toLowerCase();
      if (ext !== "pdf" && ext !== "docx") {
        setAtsError("Format file harus .pdf atau .docx");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setAtsError("Ukuran file tidak boleh melebihi 10MB");
        return;
      }
      setAtsError("");
      setSelectedFile(file);
    }
  };

  const handleUploadCv = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setAtsError("");
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await api.post("/cv/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadedCv(res.data);
      fetchUserCvs();
    } catch (err) {
      setAtsError(
        err.response?.data?.message || "Gagal mengunggah CV. Periksa format file."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRunAnalysis = async () => {
    if (!uploadedCv?.cv_id) return;
    setIsAnalyzing(true);
    setAtsError("");

    try {
      const res = await api.post(`/cv/${uploadedCv.cv_id}/analyze`);
      setAnalysisResult(res.data);
    } catch (err) {
      setAtsError(
        err.response?.data?.message || "Analisis AI gagal. Silakan coba beberapa saat lagi."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- CV Builder Handlers ---
  const handleAddSkill = (e) => {
    if (e) e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSaveCvBuilder = async (e) => {
    e.preventDefault();
    setIsSavingCv(true);
    setBuilderMessage({ type: "", text: "" });

    const payload = {
      title: cvTitle,
      personal_info: personalInfo,
      summary,
      skills,
      experience: experienceList.filter((exp) => exp.company || exp.role),
      education: educationList.filter((edu) => edu.school || edu.degree),
      projects: projectList.filter((proj) => proj.name),
    };

    try {
      let res;
      if (selectedCvId) {
        res = await api.patch(`/cv/${selectedCvId}`, payload);
        setBuilderMessage({ type: "success", text: "CV berhasil diperbarui!" });
      } else {
        res = await api.post("/cv", payload);
        setSelectedCvId(res.data.id);
        setBuilderMessage({ type: "success", text: "CV baru berhasil dibuat!" });
      }
      fetchUserCvs();
      setTimeout(() => setBuilderMessage({ type: "", text: "" }), 4000);
    } catch (err) {
      setBuilderMessage({
        type: "error",
        text: err.response?.data?.message || "Gagal menyimpan CV.",
      });
    } finally {
      setIsSavingCv(false);
    }
  };

  return (
    <DashboardLayout pageTitle="CV & ATS Score">
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* Top Title & Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1E3A5F]">
              CV & ATS Score
            </h1>
            <p className="text-xs sm:text-sm text-[#738496]">
              Buat CV profesional berstandar ATS atau analisis skor ATS file CV Anda dengan AI.
            </p>
          </div>

          {/* Tab Navigation Switches */}
          <div className="bg-[#FAF9F5] p-1.5 rounded-full flex items-center gap-1 border border-[#E2EBF2] self-stretch sm:self-auto">
            <button
              onClick={() => setActiveTab("builder")}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer ${
                activeTab === "builder"
                  ? "bg-[#0F3D3E] text-white shadow-md"
                  : "text-[#556B7D] hover:text-[#243449]"
              }`}
            >
              CV Builder & Live Preview
            </button>
            <button
              onClick={() => setActiveTab("ats")}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer ${
                activeTab === "ats"
                  ? "bg-[#0F3D3E] text-white shadow-md"
                  : "text-[#556B7D] hover:text-[#243449]"
              }`}
            >
              Analisis ATS File Upload
            </button>
          </div>
        </div>

        {/* TAB 1: CV BUILDER WITH LIVE ATS PREVIEW */}
        {activeTab === "builder" && (
          <div className="space-y-6">
            {/* Top Draft Selector Bar */}
            {cvList.length > 0 && (
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E2EBF2] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-0.5 text-center sm:text-left">
                  <h4 className="text-sm font-extrabold text-[#243449]">
                    Draft CV Tersimpan
                  </h4>
                  <p className="text-xs text-[#738496]">
                    Pilih draft CV yang pernah Anda buat untuk diperbarui.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={selectedCvId || ""}
                    onChange={(e) => {
                      if (e.target.value) loadCvDetail(e.target.value);
                      else {
                        setSelectedCvId(null);
                        setCvTitle("CV Utama");
                        setSummary("");
                        setSkills([]);
                        setExperienceList([{ company: "", role: "", start: "", end: "", description: "" }]);
                        setEducationList([{ school: "", degree: "", start: "", end: "" }]);
                        setProjectList([{ name: "", link: "", description: "" }]);
                      }
                    }}
                    className="rounded-2xl border border-[#D5DFE8] bg-[#F9FBFC] px-4 py-2 text-xs font-bold text-[#243449] focus:outline-none focus:border-[#2E6385]"
                  >
                    <option value="">-- Buat CV Baru --</option>
                    {cvList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} (ID: {c.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Notification Messages */}
            {builderMessage.text && (
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm border flex items-center gap-3 ${builderMessage.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-red-50 border-red-200 text-red-800"
                  }`}
              >
                <span>{builderMessage.text}</span>
              </div>
            )}

            {/* Main 2-Column Layout (Form on Left, ATS Live Preview on Right) */}
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* LEFT COLUMN: FORM INPUT CARDS (7 Cols) */}
              <form onSubmit={handleSaveCvBuilder} className="lg:col-span-6 space-y-6">
                {/* Judul CV Input */}
                <div className="bg-white rounded-3xl p-6 border border-[#E2EBF2] shadow-sm space-y-3">
                  <label className="block text-xs font-bold text-[#4A5D6E] uppercase tracking-wider">
                    Judul CV / Profil
                  </label>
                  <input
                    type="text"
                    required
                    value={cvTitle}
                    onChange={(e) => setCvTitle(e.target.value)}
                    placeholder="Contoh: CV Utama 2026"
                    className="w-full rounded-2xl border border-[#D5DFE8] bg-[#F9FBFC] px-4 py-3 text-xs sm:text-sm text-[#243449] focus:outline-none focus:border-[#2E6385]"
                  />
                </div>

                {/* Card 1: Informasi Pribadi */}
                <div className="bg-white rounded-3xl p-6 border border-[#E2EBF2] shadow-sm space-y-4">
                  <h3 className="text-base font-extrabold text-[#243449]">
                    Informasi Pribadi
                  </h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#738496] font-medium mb-1.5">
                        Nama lengkap
                      </label>
                      <input
                        type="text"
                        required
                        value={personalInfo.full_name}
                        onChange={(e) =>
                          setPersonalInfo({ ...personalInfo, full_name: e.target.value })
                        }
                        placeholder="Contoh: Larasati Ayu Gantari"
                        className="w-full rounded-2xl border border-[#EBEFE9] bg-[#FAF9F5] px-4 py-3 text-xs sm:text-sm text-[#243449] focus:outline-none focus:border-[#2E6385]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-[#738496] font-medium mb-1.5">
                        Headline / posisi target
                      </label>
                      <input
                        type="text"
                        value={personalInfo.headline}
                        onChange={(e) =>
                          setPersonalInfo({ ...personalInfo, headline: e.target.value })
                        }
                        placeholder="Contoh: Junior UI/UX Designer"
                        className="w-full rounded-2xl border border-[#EBEFE9] bg-[#FAF9F5] px-4 py-3 text-xs sm:text-sm text-[#243449] focus:outline-none focus:border-[#2E6385]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-[#738496] font-medium mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={personalInfo.email}
                        onChange={(e) =>
                          setPersonalInfo({ ...personalInfo, email: e.target.value })
                        }
                        placeholder="larasati@email.com"
                        className="w-full rounded-2xl border border-[#EBEFE9] bg-[#FAF9F5] px-4 py-3 text-xs sm:text-sm text-[#243449] focus:outline-none focus:border-[#2E6385]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-[#738496] font-medium mb-1.5">
                        No. HP
                      </label>
                      <input
                        type="text"
                        value={personalInfo.phone}
                        onChange={(e) =>
                          setPersonalInfo({ ...personalInfo, phone: e.target.value })
                        }
                        placeholder="0812-3456-7890"
                        className="w-full rounded-2xl border border-[#EBEFE9] bg-[#FAF9F5] px-4 py-3 text-xs sm:text-sm text-[#243449] focus:outline-none focus:border-[#2E6385]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#738496] font-medium mb-1.5">
                      Lokasi
                    </label>
                    <input
                      type="text"
                      value={personalInfo.location}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, location: e.target.value })
                      }
                      placeholder="Yogyakarta, Indonesia"
                      className="w-full rounded-2xl border border-[#EBEFE9] bg-[#FAF9F5] px-4 py-3 text-xs sm:text-sm text-[#243449] focus:outline-none focus:border-[#2E6385]"
                    />
                  </div>
                </div>

                {/* Card 2: Ringkasan Profil */}
                <div className="bg-white rounded-3xl p-6 border border-[#E2EBF2] shadow-sm space-y-2">
                  <h3 className="text-base font-extrabold text-[#243449]">
                    Ringkasan Profil
                  </h3>
                  <p className="text-xs text-[#738496]">
                    Maksimal 3 baris, sebutkan peran dan satu hasil terukur
                  </p>
                  <textarea
                    rows={4}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Desainer produk dengan fokus pada riset pengguna dan design system. Berpengalaman merancang alur transaksi mobile yang meningkatkan penyelesaian checkout."
                    className="w-full rounded-2xl border border-[#EBEFE9] bg-[#FAF9F5] p-4 text-xs sm:text-sm text-[#243449] focus:outline-none focus:border-[#2E6385] leading-relaxed"
                  />
                </div>

                {/* Card 3: Skills */}
                <div className="bg-white rounded-3xl p-6 border border-[#E2EBF2] shadow-sm space-y-4">
                  <h3 className="text-base font-extrabold text-[#243449]">
                    Skills
                  </h3>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSkill(e);
                        }
                      }}
                      placeholder="Contoh: Usability Testing"
                      className="flex-1 rounded-2xl border border-[#EBEFE9] bg-[#FAF9F5] px-4 py-3 text-xs sm:text-sm text-[#243449] focus:outline-none focus:border-[#2E6385]"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="w-12 h-12 rounded-2xl bg-[#FAF9F5] border border-[#EBEFE9] hover:bg-[#2E6385] hover:text-white text-[#243449] font-bold text-xl flex items-center justify-center transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {skills.map((sk, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F2EA] text-[#4A5D6E] text-xs font-semibold rounded-xl border border-[#E6E1D5]"
                      >
                        {sk}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(sk)}
                          className="hover:text-red-600 font-bold ml-1 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card 4: Pengalaman Kerja */}
                <div className="bg-white rounded-3xl p-6 border border-[#E2EBF2] shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-[#243449]">
                      Pengalaman Kerja
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        setExperienceList([
                          ...experienceList,
                          { company: "", role: "", start: "", end: "", description: "" },
                        ])
                      }
                      className="text-xs font-bold text-[#2E6385] hover:underline cursor-pointer"
                    >
                      + Tambah Pengalaman
                    </button>
                  </div>

                  {experienceList.map((exp, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#EBEFE9] space-y-3 relative">
                      {experienceList.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setExperienceList(experienceList.filter((_, i) => i !== idx))
                          }
                          className="absolute top-4 right-4 text-xs text-red-600 font-bold hover:underline cursor-pointer"
                        >
                          Hapus
                        </button>
                      )}
                      <div className="grid sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Posisi (misal: UI/UX Design Intern)"
                          value={exp.role}
                          onChange={(e) => {
                            const updated = [...experienceList];
                            updated[idx].role = e.target.value;
                            setExperienceList(updated);
                          }}
                          className="rounded-xl border border-[#EBEFE9] bg-white px-3.5 py-2.5 text-xs text-[#243449]"
                        />
                        <input
                          type="text"
                          placeholder="Perusahaan (misal: Kalibrr)"
                          value={exp.company}
                          onChange={(e) => {
                            const updated = [...experienceList];
                            updated[idx].company = e.target.value;
                            setExperienceList(updated);
                          }}
                          className="rounded-xl border border-[#EBEFE9] bg-white px-3.5 py-2.5 text-xs text-[#243449]"
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Periode (misal: Jan 2025 – Jun 2025)"
                          value={exp.start}
                          onChange={(e) => {
                            const updated = [...experienceList];
                            updated[idx].start = e.target.value;
                            setExperienceList(updated);
                          }}
                          className="rounded-xl border border-[#EBEFE9] bg-white px-3.5 py-2.5 text-xs text-[#243449]"
                        />
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Mendesain ulang alur pendaftaran kandidat, menurunkan drop-off form sebesar 18% dalam dua bulan."
                        value={exp.description}
                        onChange={(e) => {
                          const updated = [...experienceList];
                          updated[idx].description = e.target.value;
                          setExperienceList(updated);
                        }}
                        className="w-full rounded-xl border border-[#EBEFE9] bg-white p-3 text-xs text-[#243449]"
                      />
                    </div>
                  ))}
                </div>

                {/* Card 5: Pendidikan */}
                <div className="bg-white rounded-3xl p-6 border border-[#E2EBF2] shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-[#243449]">
                      Pendidikan
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        setEducationList([
                          ...educationList,
                          { school: "", degree: "", start: "", end: "" },
                        ])
                      }
                      className="text-xs font-bold text-[#2E6385] hover:underline cursor-pointer"
                    >
                      + Tambah Pendidikan
                    </button>
                  </div>

                  {educationList.map((edu, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#EBEFE9] space-y-3 relative">
                      {educationList.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setEducationList(educationList.filter((_, i) => i !== idx))
                          }
                          className="absolute top-4 right-4 text-xs text-red-600 font-bold hover:underline cursor-pointer"
                        >
                          Hapus
                        </button>
                      )}
                      <div className="grid sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Institusi (misal: Universitas Gadjah Mada)"
                          value={edu.school}
                          onChange={(e) => {
                            const updated = [...educationList];
                            updated[idx].school = e.target.value;
                            setEducationList(updated);
                          }}
                          className="rounded-xl border border-[#EBEFE9] bg-white px-3.5 py-2.5 text-xs text-[#243449]"
                        />
                        <input
                          type="text"
                          placeholder="Gelar / Jurusan (misal: S1 Ilmu Komputer)"
                          value={edu.degree}
                          onChange={(e) => {
                            const updated = [...educationList];
                            updated[idx].degree = e.target.value;
                            setEducationList(updated);
                          }}
                          className="rounded-xl border border-[#EBEFE9] bg-white px-3.5 py-2.5 text-xs text-[#243449]"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Tahun (misal: 2022 – 2026)"
                        value={edu.start}
                        onChange={(e) => {
                          const updated = [...educationList];
                          updated[idx].start = e.target.value;
                          setEducationList(updated);
                        }}
                        className="w-full rounded-xl border border-[#EBEFE9] bg-white px-3.5 py-2.5 text-xs text-[#243449]"
                      />
                    </div>
                  ))}
                </div>

                {/* Card 6: Project */}
                <div className="bg-white rounded-3xl p-6 border border-[#E2EBF2] shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-[#243449]">
                      Project
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        setProjectList([
                          ...projectList,
                          { name: "", link: "", description: "" },
                        ])
                      }
                      className="text-xs font-bold text-[#2E6385] hover:underline cursor-pointer"
                    >
                      + Tambah Project
                    </button>
                  </div>

                  {projectList.map((proj, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#EBEFE9] space-y-3 relative">
                      {projectList.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setProjectList(projectList.filter((_, i) => i !== idx))
                          }
                          className="absolute top-4 right-4 text-xs text-red-600 font-bold hover:underline cursor-pointer"
                        >
                          Hapus
                        </button>
                      )}
                      <div className="grid sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Nama Project (misal: CareerFit AI)"
                          value={proj.name}
                          onChange={(e) => {
                            const updated = [...projectList];
                            updated[idx].name = e.target.value;
                            setProjectList(updated);
                          }}
                          className="rounded-xl border border-[#EBEFE9] bg-white px-3.5 py-2.5 text-xs text-[#243449]"
                        />
                        <input
                          type="text"
                          placeholder="Link (misal: careerfit.ai)"
                          value={proj.link}
                          onChange={(e) => {
                            const updated = [...projectList];
                            updated[idx].link = e.target.value;
                            setProjectList(updated);
                          }}
                          className="rounded-xl border border-[#EBEFE9] bg-white px-3.5 py-2.5 text-xs text-[#243449]"
                        />
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Merancang design system dan alur analisis CV."
                        value={proj.description}
                        onChange={(e) => {
                          const updated = [...projectList];
                          updated[idx].description = e.target.value;
                          setProjectList(updated);
                        }}
                        className="w-full rounded-xl border border-[#EBEFE9] bg-white p-3 text-xs text-[#243449]"
                      />
                    </div>
                  ))}
                </div>

                {/* Save CV Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSavingCv}
                    className="w-full py-4 rounded-2xl bg-[#ffba17] hover:bg-[#f0ad10] text-[#243449] font-extrabold text-sm transition-all shadow-md cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isSavingCv ? "Menyimpan CV..." : "Simpan Draft CV"}
                  </button>
                </div>
              </form>

              {/* RIGHT COLUMN: LIVE ATS CV PREVIEW CARD (6 Cols, Sticky) */}
              <div className="lg:col-span-6 lg:sticky lg:top-8 space-y-3">
                <span className="text-[11px] font-extrabold text-[#738496] uppercase tracking-wider block">
                  PREVIEW — TEMPLATE SATU KOLOM, ATS-SAFE
                </span>

                {/* Clean White ATS Paper Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2EBF2] shadow-md space-y-6 font-sans text-[#1E293B]">
                  {/* Name & Title Header */}
                  <div className="space-y-1">
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A]">
                      {personalInfo.full_name || "Larasati Ayu Gantari"}
                    </h2>
                    <p className="text-sm font-semibold text-black">
                      {personalInfo.headline || "Junior UI/UX Designer"}
                    </p>
                    <p className="text-xs text-[#64748B] pt-0.5">
                      {[
                        personalInfo.email || "larasati@email.com",
                        personalInfo.phone || "0812-3456-7890",
                        personalInfo.location || "Yogyakarta, Indonesia",
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>

                  {/* Section: RINGKASAN */}
                  <div className="border-t border-[#E2EBF2] pt-4 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-black">
                      RINGKASAN
                    </h4>
                    <p className="text-xs text-[#334155] leading-relaxed">
                      {summary ||
                        "Desainer produk dengan fokus pada riset pengguna dan design system. Berpengalaman merancang alur transaksi mobile yang meningkatkan penyelesaian checkout."}
                    </p>
                  </div>

                  {/* Section: SKILLS */}
                  <div className="border-t border-[#E2EBF2] pt-4 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-black">
                      SKILLS
                    </h4>
                    <p className="text-xs text-[#334155] font-medium leading-relaxed">
                      {skills.length > 0
                        ? skills.join(" · ")
                        : "Figma · Design System · Prototyping · User Research"}
                    </p>
                  </div>

                  {/* Section: PENGALAMAN */}
                  <div className="border-t border-[#E2EBF2] pt-4 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-black">
                      PENGALAMAN
                    </h4>
                    {experienceList.map((exp, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-start justify-between flex-wrap gap-1">
                          <span className="text-xs sm:text-sm font-semibold text-[#334155]">
                            {exp.role || "UI/UX Design Intern"}
                          </span>
                          <span className="text-xs text-[#64748B]">
                            {exp.start || "Jan 2025 – Jun 2025"}
                          </span>
                        </div>
                        <p className="text-xs text-[#64748B]">
                          {exp.company || "Kalibrr"}
                        </p>
                        {exp.description && (
                          <p className="text-xs text-[#334155] leading-relaxed pt-0.5">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Section: PENDIDIKAN */}
                  <div className="border-t border-[#E2EBF2] pt-4 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-black">
                      PENDIDIKAN
                    </h4>
                    {educationList.map((edu, idx) => (
                      <div key={idx} className="space-y-0.5">
                        <span className="text-xs sm:text-sm font-bold text-[#0F172A] block">
                          {edu.school || "Universitas Gadjah Mada"}
                        </span>
                        <p className="text-xs text-[#64748B]">
                          {[edu.degree || "S1 Ilmu Komputer", edu.start || "2022 – 2026"]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Section: PROJECT */}
                  <div className="border-t border-[#E2EBF2] pt-4 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-black">
                      PROJECT
                    </h4>
                    {projectList.map((proj, idx) => (
                      <div key={idx} className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-[#0F172A]">
                            {proj.name}
                          </span>
                          {proj.link && (
                            <span className="text-xs text-[#64748B]">
                              — {proj.link}
                            </span>
                          )}
                        </div>
                        {proj.description && (
                          <p className="text-xs text-[#334155] leading-relaxed">
                            {proj.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer disclaimer */}
                <p className="text-xs italic text-[#738496] px-2 text-center sm:text-left">
                  Satu kolom, tanpa tabel dan ikon dekoratif — struktur ini yang paling aman dibaca parser ATS.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ATS SCORE FILE UPLOAD */}
        {activeTab === "ats" && (
          <div className="space-y-6">
            {/* Upload Area Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2EBF2] shadow-sm space-y-6">
              <div className="border-b border-[#E2EBF2] pb-4">
                <h3 className="text-lg font-extrabold text-[#243449]">
                  Unggah Dokumen CV
                </h3>
                <p className="text-xs sm:text-sm text-[#738496]">
                  Format yang didukung: <strong>.pdf</strong> atau <strong>.docx</strong> (Maksimal 10MB).
                </p>
              </div>

              {atsError && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-center gap-3">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{atsError}</span>
                </div>
              )}

              {/* Drag & Drop File Zone */}
              <div className="relative border-2 border-dashed border-[#C4D5E5] hover:border-[#2E6385] bg-[#F8FAFC] hover:bg-[#F0F4F8] rounded-3xl p-8 text-center transition-all duration-200">
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-[#2E6385]/10 text-[#2E6385] flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    {selectedFile ? (
                      <div className="space-y-1">
                        <p className="text-sm font-extrabold text-[#2E6385]">
                          📄 {selectedFile.name}
                        </p>
                        <p className="text-xs text-[#738496]">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-bold text-[#243449]">
                          Klik atau geser file CV kamu ke area ini
                        </p>
                        <p className="text-xs text-[#738496]">PDF atau DOCX hingga 10MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleUploadCv}
                  disabled={!selectedFile || isUploading}
                  className="px-6 py-3 rounded-2xl bg-[#2E6385] hover:bg-[#234d69] text-white font-bold text-xs sm:text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Mengunggah...</span>
                    </>
                  ) : (
                    <> Proses File CV</>
                  )}
                </button>

                {uploadedCv && (
                  <button
                    type="button"
                    onClick={handleRunAnalysis}
                    disabled={isAnalyzing}
                    className="px-8 py-3.5 rounded-2xl bg-[#ffba17] hover:bg-[#f0ad10] text-[#243449] font-extrabold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {isAnalyzing ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-[#243449]" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>AI Sedang Menganalisis...</span>
                      </>
                    ) : (
                      <>Mulai Analisis ATS dengan AI</>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Parsed Preview Section */}
            {uploadedCv?.parsed_preview && (
              <div className="bg-white rounded-3xl p-6 border border-[#E2EBF2] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#2E6385] uppercase tracking-wider">
                    Hasil Ektraksi Teks CV
                  </span>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-xs font-bold text-[#738496] hover:text-[#2E6385] transition-colors cursor-pointer"
                  >
                    {showPreview ? "Sembunyikan" : "Tampilkan Teks Ekstraksi"}
                  </button>
                </div>
                {showPreview && (
                  <pre className="p-4 bg-[#F8FAFC] rounded-2xl text-xs text-[#334155] overflow-x-auto whitespace-pre-wrap font-mono border border-[#E2EBF2]">
                    {uploadedCv.parsed_preview}
                  </pre>
                )}
              </div>
            )}

            {/* ATS Analysis Results Presentation */}
            {analysisResult && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2EBF2] shadow-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                {/* Score Header Card */}
                <div className="bg-gradient-to-r from-[#243449] to-[#2E6385] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
                  <div className="space-y-2 text-center sm:text-left">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/30">
                      Hasil Analisis Gemini AI
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold">
                      {analysisResult.headline || "Analisis Resume Selesai"}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
                      Skor ini diukur berdasarkan keterbacaan struktur kata kunci, kelengkapan elemen penting, dan kompatibilitas ATS.
                    </p>
                  </div>

                  <div className="flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 min-w-[140px]">
                    <span className="text-4xl sm:text-5xl font-black text-[#ffba17]">
                      {analysisResult.ats_score}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mt-1">
                      Skor ATS / 100
                    </span>
                  </div>
                </div>

                {/* Grid Sections for Strengths & Improvements */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-3xl p-6 space-y-4">
                    <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm sm:text-base">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Kekuatan CV (Strengths)</span>
                    </div>
                    <ul className="space-y-3">
                      {analysisResult.strengths?.map((item, idx) => (
                        <li key={idx} className="bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-2xs space-y-1">
                          <p className="text-xs sm:text-sm font-bold text-emerald-950">
                            {typeof item === "string" ? item : item.title}
                          </p>
                          {item.description && (
                            <p className="text-xs text-emerald-800/80">{item.description}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Improvements */}
                  <div className="bg-amber-50/60 border border-amber-200/80 rounded-3xl p-6 space-y-4">
                    <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm sm:text-base">
                      <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>Area Perbaikan (Improvements)</span>
                    </div>
                    <ul className="space-y-3">
                      {analysisResult.improvements?.map((item, idx) => (
                        <li key={idx} className="bg-white p-3.5 rounded-2xl border border-amber-100 shadow-2xs space-y-1">
                          <p className="text-xs sm:text-sm font-bold text-amber-950">
                            {typeof item === "string" ? item : item.title}
                          </p>
                          {item.description && (
                            <p className="text-xs text-amber-800/80">{item.description}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Suggestions Section */}
                {analysisResult.suggestions?.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-base font-extrabold text-[#243449]">
                      Rekomendasi Optimasi AI
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {analysisResult.suggestions.map((sug, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2EBF2] space-y-2">
                          <span className="px-2.5 py-0.5 bg-[#2E6385]/10 text-[#2E6385] text-[11px] font-bold rounded-md">
                            {sug.section}
                          </span>
                          <p className="text-xs font-bold text-[#243449]">{sug.tip}</p>
                          {sug.example && (
                            <p className="text-[11px] italic text-[#738496] bg-white p-2 rounded-xl border border-[#E2EBF2]">
                              &quot;{sug.example}&quot;
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Keyword Gaps */}
                {analysisResult.keyword_gaps?.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#4A5D6E]">
                      Kata Kunci Relevan yang Perlu Ditambahkan (Keyword Gaps)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.keyword_gaps.map((kw, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 text-xs font-semibold rounded-xl"
                        >
                          + {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
