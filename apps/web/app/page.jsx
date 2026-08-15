"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  TargetPinIcon,
  CVBuilderIcon,
  SmartMatchingIcon,
  ATSScoreIcon,
  MultiVersionIcon,
  TrackerIcon,
  CloudUploadIcon,
  AnalyzeIcon,
  OptimizeIcon,
  ApplyIcon,
  ChevronDownIcon,
} from "@/components/Icons";

export default function Home() {
  // State to track expanded/collapsed state for Ecosystem cards (default all closed)
  const [openCards, setOpenCards] = useState({});

  const toggleCard = (id) => {
    setOpenCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const ecosystemLeft = [
    {
      id: 0,
      title: "AI CV Analyzer",
      desc: "Analisis semantik mendalam atas pengalamanmu sesuai standar industri. Temukan potensi tersembunyi yang tidak kamu sadari.",
      icon: TargetPinIcon,
    },
    {
      id: 1,
      title: "Keyword Gap",
      desc: "Temukan dan masukkan keterampilan penting yang belum ada di profil CV-mu secara otomatis.",
      icon: CVBuilderIcon,
    },
    {
      id: 2,
      title: "Smart Matching",
      desc: "Dapatkan rekomendasi pekerjaan yang benar-benar sesuai dengan keterampilan dan target gajimu.",
      icon: SmartMatchingIcon,
    },
  ];

  const ecosystemRight = [
    {
      id: 3,
      title: "ATS Score",
      desc: "Umpan balik langsung secara real-time tentang seberapa baik CV-mu menembus filter sistem ATS perusahaan.",
      icon: ATSScoreIcon,
    },
    {
      id: 4,
      title: "Multi-Version Generator",
      desc: "Buat berbagai versi CV yang disesuaikan untuk berbagai posisi pekerjaan dalam hitungan detik. Satu klik, potensi tanpa batas.",
      icon: MultiVersionIcon,
    },
    {
      id: 5,
      title: "Application Tracker",
      desc: "Pantau status, jadwal interview, dan riwayat seluruh lamaran kerjamu secara teratur dalam satu tempat.",
      icon: TrackerIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-[#243449] scroll-smooth">
      <Navbar />

      <main className="mx-auto w-full max-w-[92rem] justify-center px-4 pb-8 pt-6 sm:px-6 lg:px-8">
        {/* Section 1: Hero Banner */}
        <section id="beranda" className="relative flex min-h-[calc(100vh-6.5rem)] w-full items-start justify-center">
          <div className="relative mt-6 flex w-full overflow-hidden rounded-[28px] bg-[radial-gradient(ellipse_at_center,#40789B_0%,#2E6385_100%)] px-6 py-10 shadow-[0_18px_50px_rgba(27,54,72,0.12)] sm:px-10 sm:py-12 lg:px-14 lg:py-16">
            <div className="relative z-10 grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
              <div className="flex w-full flex-col items-start">
                <h1 className="text-[2.35rem] font-bold leading-[1.05] tracking-[-0.04em] text-[#ffba17] sm:text-[3.1rem] lg:text-[3.6rem]">
                  Karier Terbaik Dimulai Dari Kecocokan Yang Tepat.
                </h1>

                <p className="mt-6 max-w-[28rem] text-[0.86rem] font-semibold leading-relaxed text-white/95 sm:text-[0.95rem]">
                  Dapatkan rekomendasi pekerjaan yang lebih relevan berdasarkan pengalaman kerja, pendidikan, skill, dan minatmu.
                </p>

                <Link
                  href="/register"
                  className="mt-8 inline-flex h-10 items-center rounded-[7px] bg-[#ffb61a] px-6 text-[0.85rem] font-bold text-white shadow-[0_8px_18px_rgba(255,182,26,0.26)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#f3ab10]"
                >
                  Get Started
                </Link>
              </div>

              <div className="relative flex w-full items-center justify-center lg:justify-end">
                <div className="relative aspect-[4/3] w-full max-w-[28rem] sm:max-w-[32rem] lg:max-w-[36rem]">
                  <Image
                    src="/landing-page/lp-1.png"
                    alt="CareerFit illustration"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    fill
                    priority
                    className="object-contain object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Realita Pasar Kerja Memang Menantang */}
        <section id="masalah" className="mt-20 sm:mt-28 w-full text-center">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug text-[#2E6385]">
              Realita Pasar Kerja Memang Menantang.
              <br className="hidden sm:inline" /> Saatnya Kamu Bertindak Pintar.
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-[#4C6479] leading-relaxed max-w-3xl mx-auto">
              Sebagian besar lamaran gugur pada tahapan seleksi berkas. Di sini, Kami hadir untuk memperbesar peluangmu lolos tahapan pertama seleksi.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[76rem] mx-auto px-4">
            {/* Card 1 */}
            <div className="bg-white/80 backdrop-blur-sm border border-[#D5DFE8] rounded-[20px] p-6 sm:p-8 flex flex-col justify-between text-left shadow-xs hover:shadow-md transition-shadow min-h-[220px]">
              <div>
                <span className="text-3xl sm:text-4xl font-bold text-[#E55B5B]">75%</span>
                <h3 className="mt-4 text-sm sm:text-base font-bold text-[#2E6385]">Auto-Rejection</h3>
                <p className="mt-2 text-xs sm:text-sm text-[#556B7D] leading-relaxed">
                  Berkas CV gugur di sistem ATS sebelum pernah dilihat langsung oleh tim HRD karena format dan kata kunci yang tidak sesuai.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white/80 backdrop-blur-sm border border-[#D5DFE8] rounded-[20px] p-6 sm:p-8 flex flex-col justify-between text-left shadow-xs hover:shadow-md transition-shadow min-h-[220px]">
              <div>
                <span className="text-3xl sm:text-4xl font-bold text-transparent invisible select-none">—</span>
                <h3 className="mt-4 text-sm sm:text-base font-bold text-[#2E6385]">Pengangguran Lulusan Baru</h3>
                <p className="mt-2 text-xs sm:text-sm text-[#556B7D] leading-relaxed">
                  Data BPS menunjukkan angka pengangguran lulusan perguruan tinggi meningkat akibat adanya mismatch antara kompetensi dan kebutuhan industri.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white/80 backdrop-blur-sm border border-[#D5DFE8] rounded-[20px] p-6 sm:p-8 flex flex-col justify-between text-left shadow-xs hover:shadow-md transition-shadow min-h-[220px]">
              <div>
                <span className="text-3xl sm:text-4xl font-bold text-[#E55B5B]">60%</span>
                <h3 className="mt-4 text-sm sm:text-base font-bold text-[#2E6385]">Skill Gaps</h3>
                <p className="mt-2 text-xs sm:text-sm text-[#556B7D] leading-relaxed">
                  Kandidat gagal menonjolkan keterampilan teknis (technical skills) yang dicari industri dalam dokumen CV mereka.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Berhenti Kirim Lamaran Tanpa Hasil */}
        <section className="mt-24 sm:mt-32 w-full max-w-[76rem] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="relative aspect-[4/3] w-full max-w-[24rem] sm:max-w-[28rem] mx-auto lg:max-w-none">
              <Image
                src="/landing-page/lp-2.png"
                alt="Berhenti Kirim Lamaran Tanpa Hasil"
                fill
                className="object-contain object-center"
              />
            </div>
            <div className="flex flex-col items-start text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2E6385] leading-snug">
                Berhenti Kirim Lamaran Tanpa Hasil.
              </h2>
              <p className="mt-4 text-xs sm:text-sm lg:text-base text-[#556B7D] leading-relaxed max-w-lg">
                Temukan lowongan kerja yang benar-benar cocok dengan keahlian dan pengalamanmu, sekaligus optimalkan CV-mu secara otomatis agar lolos seleksi ATS.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: OUR ECOSYSTEM */}
        <section id="ekosistem" className="mt-24 sm:mt-32 w-full max-w-[82rem] mx-auto text-center px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#2E6385] tracking-widest uppercase">
            OUR ECOSYSTEM
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
            Precision Tools for Modern Careers
          </p>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            {/* Left 3 Expandable Cards */}
            <div className="flex flex-col gap-5">
              {ecosystemLeft.map((item) => {
                const IconComponent = item.icon;
                const isOpen = !!openCards[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCard(item.id)}
                    className="group bg-white/95 border border-[#D5DFE8] rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer text-left"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className="p-2.5 rounded-xl bg-[#EBF3FA] group-hover:bg-[#DCEBF7] transition-colors">
                          <IconComponent className="w-5 h-5 text-[#2E6385]" />
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-[#2E6385]">
                          {item.title}
                        </h3>
                      </div>
                      <ChevronDownIcon
                        className={`w-5 h-5 text-[#2E6385] transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
                          }`}
                      />
                    </div>
                    {isOpen && (
                      <p className="mt-3 text-xs sm:text-sm text-[#556B7D] leading-relaxed border-t border-[#F0F4F8] pt-3 animate-fadeIn">
                        {item.desc}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Center Illustration */}
            <div className="relative aspect-square w-full max-w-[22rem] sm:max-w-[26rem] mx-auto self-center">
              <Image
                src="/landing-page/lp-3.png"
                alt="Our Ecosystem"
                fill
                className="object-contain object-center"
              />
            </div>

            {/* Right 3 Expandable Cards */}
            <div className="flex flex-col gap-5">
              {ecosystemRight.map((item) => {
                const IconComponent = item.icon;
                const isOpen = !!openCards[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCard(item.id)}
                    className="group bg-white/95 border border-[#D5DFE8] rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer text-left"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className="p-2.5 rounded-xl bg-[#EBF3FA] group-hover:bg-[#DCEBF7] transition-colors">
                          <IconComponent className="w-5 h-5 text-[#2E6385]" />
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-[#2E6385]">
                          {item.title}
                        </h3>
                      </div>
                      <ChevronDownIcon
                        className={`w-5 h-5 text-[#2E6385] transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
                          }`}
                      />
                    </div>
                    {isOpen && (
                      <p className="mt-3 text-xs sm:text-sm text-[#556B7D] leading-relaxed border-t border-[#F0F4F8] pt-3 animate-fadeIn">
                        {item.desc}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 5: Langkah Mudah Menuju Karier Impian */}
        <section id="cara-kerja" className="mt-24 sm:mt-32 w-full max-w-[78rem] mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2E6385]">
            Langkah Mudah Menuju Karier Impian
          </h2>

          <div className="relative mt-16 max-w-[72rem] mx-auto">
            {/* Connecting horizontal line for desktop */}
            <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-[#D1DCE5] z-0" />

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-[#EBF3FA] flex items-center justify-center text-[#2E6385] border-2 border-white shadow-xs">
                  <CloudUploadIcon className="w-6 h-6 text-[#2E6385]" />
                </div>
                <h3 className="mt-4 text-base font-bold text-[#2E6385]">Upload</h3>
                <p className="mt-2 text-xs text-[#556B7D] leading-relaxed max-w-[14rem]">
                  Unggah berkas CV-mu dalam format PDF atau DOCX untuk mulai dianalisis.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-[#FFF9ED] flex items-center justify-center text-[#2E6385] border-2 border-white shadow-xs">
                  <AnalyzeIcon className="w-6 h-6 text-[#2E6385]" />
                </div>
                <h3 className="mt-4 text-base font-bold text-[#2E6385]">Analyze</h3>
                <p className="mt-2 text-xs text-[#556B7D] leading-relaxed max-w-[14rem]">
                  AI menganalisis kelayakan ATS, kata kunci, serta tingkat kesesuaian dengan lowongan target.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-[#EBF3FA] flex items-center justify-center text-[#2E6385] border-2 border-white shadow-xs">
                  <OptimizeIcon className="w-6 h-6 text-[#2E6385]" />
                </div>
                <h3 className="mt-4 text-base font-bold text-[#2E6385]">Optimize</h3>
                <p className="mt-2 text-xs text-[#556B7D] leading-relaxed max-w-[14rem]">
                  Dapatkan rekomendasi perbaikan CV dan penyesuaian kata kunci sesuai industri secara instan.
                </p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-[#2E6385] flex items-center justify-center text-white border-2 border-white shadow-md">
                  <ApplyIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="mt-4 text-base font-bold text-[#2E6385]">Apply</h3>
                <p className="mt-2 text-xs text-[#556B7D] leading-relaxed max-w-[14rem]">
                  Kirim lamaran dengan CV terbaik yang memiliki tingkat relevansi dan ATS Score tinggi.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Bottom CTA Banner */}
        <section className="mt-24 sm:mt-32 mb-12 w-full max-w-[84rem] mx-auto px-4">
          <div className="relative overflow-hidden rounded-[28px] bg-[#1E384C] px-6 py-10 sm:px-12 sm:py-14 lg:px-16 lg:py-16 text-white shadow-xl">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="relative aspect-[4/3] w-full max-w-[20rem] sm:max-w-[24rem] mx-auto lg:max-w-[28rem]">
                <Image
                  src="/landing-page/lp-4.png"
                  alt="Daftar Sekarang"
                  fill
                  className="object-contain object-center"
                />
              </div>

              <div className="flex flex-col items-start text-left">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                  Langkah Pertama Menuju Kerja Impian Berawal di Sini.
                </h2>
                <p className="mt-4 text-xs sm:text-sm lg:text-base text-white/90 leading-relaxed max-w-lg">
                  Buat CV-mu ramah ATS dan temukan lowongan yang benar-benar pas dengan skill-mu sekarang.
                </p>
                <Link
                  href="/register"
                  className="mt-8 inline-flex items-center justify-center rounded-[7px] bg-white px-6 py-2.5 text-xs sm:text-sm font-bold text-[#2E6385] shadow-md transition-transform duration-200 hover:-translate-y-0.5 hover:bg-gray-100"
                >
                  Daftar Sekarang
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}