# CareerFit AI — Backend Kickoff (MVP 2 Hari)

Scope: CV Upload & ATS Score, Job Listing + Matching, Application Tracker, CV Builder + Generate.
Stack: Laravel 12 + MySQL + Sanctum + Gemini (primary) / Groq / OpenRouter (fallback).
Job data: dummy/static (JSON seeder), bukan JSearch live dulu.

---

## 0. Prinsip MVP (biar nggak molor)

- Auth: email+password only, token via Sanctum. Skip Google/LinkedIn SSO.
- AI fallback: implementasi urutan try Gemini → Groq → OpenRouter, tapi boleh SATU provider dulu (Gemini) jalan, fallback nyusul kalau waktu sisa.
- Matching score: mulai dari **keyword overlap** (skill CV vs skill lowongan, gampang & cepat). Kalau waktu ada, upgrade ke Gemini Embedding + cosine similarity — struktur data JSON-nya sama, jadi FE nggak perlu ganti apa-apa.
- Job data: seed 15–20 lowongan dummy langsung di database (dari mockup: Tokopedia, Ruangguru, Kata.ai, dst). **Keputusan final:** tetap dummy data untuk MVP/demo (bukan JSearch API real-time), sesuai proposal section 5.2 yang memang menyebutkan "JSearch API / Dummy untuk MVP" sebagai opsi sah. JSearch API asli masuk roadmap fase Scale — alasan: reliability saat demo lebih penting daripada realisme data, dan JSearch tidak mengembalikan `required_skills` terstruktur (perlu ekstraksi tambahan yang menambah kompleksitas & titik gagal).
- Queue/async: skip dulu, jalankan analisis AI secara sync di request (boleh lambat, yang penting jalan). Kalau ada waktu, baru pindah ke Laravel Queue.
- Notifikasi email/reminder di Tracker: skip, cukup CRUD status.

---

## 1. Environment Setup (jalankan di lokal)

```bash
# 1. Project baru
composer create-project laravel/laravel careerfit-backend
cd careerfit-backend

# 2. Sanctum (auth token)
composer require laravel/sanctum
php artisan install:api

# 3. .env — set DB & API keys
DB_CONNECTION=mysql
DB_DATABASE=careerfit
DB_USERNAME=root
DB_PASSWORD=

GEMINI_API_KEY=xxxx
GROQ_API_KEY=xxxx
OPENROUTER_API_KEY=xxxx

# 4. PDF/DOCX parser
composer require smalot/pdfparser
composer require phpoffice/phpword

# 5. Migrate
php artisan migrate

# 6. Jalankan
php artisan serve
```

Ambil API key gratis:
- Gemini: https://aistudio.google.com/apikey
- Groq: https://console.groq.com/keys
- OpenRouter: https://openrouter.ai/keys

Deploy tercepat kalau nggak sempat pakai VPS: **Railway** atau **Render** (connect repo, set env vars, auto deploy). Database bisa pakai Railway MySQL addon atau **PlanetScale/Aiven free tier**.

---

## 2. DB Schema (inti, migrations)

```
users
  id, name, email, password, created_at

cvs
  id, user_id, title, personal_info (json), summary (text),
  skills (json), experience (json), education (json), projects (json),
  source ('builder' | 'upload'), original_file_path (nullable),
  parsed_text (longtext, nullable), created_at, updated_at

jobs
  id, title, company, location, type (fulltime|contract|internship),
  work_mode (remote|onsite|hybrid), description (text),
  required_skills (json), salary_range (nullable), posted_at

cv_analyses
  id, cv_id, job_id (nullable), ats_score (int),
  strengths (json), improvements (json), suggestions (json),
  keyword_gaps (json), created_at

job_matches
  id, cv_id, job_id, match_score (float), matched_keywords (json), created_at

applications
  id, user_id, job_id (nullable, null kalau manual entry),
  company, position, applied_date, deadline, type,
  contact, location, status (not_started|applied|interview|offer|rejected|no_reply),
  created_at, updated_at
```

---

## 3. API Contract (kirim ke FE hari ini)

Base URL: `/api`
Auth: Bearer token (Sanctum) di header `Authorization: Bearer {token}`, kecuali endpoint publik.

### Auth

**POST /api/register**
```json
// request
{ "name": "Lala", "email": "lala@mail.com", "password": "secret123" }
// response 201
{ "user": { "id": 1, "name": "Lala", "email": "lala@mail.com" }, "token": "1|abcxyz..." }
```

**POST /api/login**
```json
// request
{ "email": "lala@mail.com", "password": "secret123" }
// response 200
{ "user": { "id": 1, "name": "Lala", "email": "lala@mail.com" }, "token": "1|abcxyz..." }
```

**GET /api/me** → response: `{ "id":1, "name":"Lala", "email":"...", "target_roles": ["Product Designer", "Backend Engineer"] }`

**PATCH /api/me** (update profil, semua field opsional)
```json
// request
{ "name": "Lala Baru", "email": "lala.baru@mail.com", "target_roles": ["Product Designer", "Backend Engineer"] }
// response 200
{ "id": 1, "name": "Lala Baru", "email": "lala.baru@mail.com", "target_roles": [...] }
```

**DELETE /api/me** (hapus akun permanen) → `{ "message": "account deleted" }`

**POST /api/logout** → `{ "message": "logged out" }`

---

### Dashboard

**GET /api/dashboard**
```json
{
  "greeting_name": "Lala",
  "target_roles": ["Product Designer", "Backend Engineer"],
  "profile_completeness": 78,
  "job_matches_count": 25,
  "job_matches_new_this_week": 5,
  "active_applications_count": 14,
  "interviews_scheduled_count": 2,
  "recommended_jobs": [
    { "id": 12, "title": "Junior UI/UX Designer", "company": "Tokopedia", "location": "Jakarta - Hybrid", "match_score": 88 }
  ],
  "tips": [
    "Selesaikan CV Builder untuk meningkatkan skor akurasi lowongan",
    "Analisis CV terhadap 3 lowongan pertama minggu ini"
  ]
}
```
Catatan: `target_roles` dipakai FE untuk subtitle personalisasi ("Ini yang kami rekomendasikan untuk role {target_roles[0]} & {target_roles[1]}"). Kalau user belum isi `target_roles` (via `PATCH /me`), array-nya kosong `[]` — FE perlu fallback teks generic.

---

### CV Builder

**POST /api/cv** (create/update builder CV)
```json
// request
{
  "title": "CV Utama",
  "personal_info": { "full_name": "Sarah Al-Azhar", "email": "sarah@mail.com", "phone": "0812...", "linkedin": "linkedin.com/in/sarah" },
  "summary": "Fresh graduate ...",
  "skills": ["Python", "React", "SQL"],
  "experience": [
    { "company": "PT ABC", "role": "Intern", "start": "2024-06", "end": "2024-12", "description": "..." }
  ],
  "education": [
    { "school": "UGM", "degree": "S1 Informatika", "start": "2021", "end": "2025" }
  ],
  "projects": [
    { "name": "CareerFit AI", "link": "github.com/...", "description": "..." }
  ]
}
// response 200/201
{ "id": 5, "title": "CV Utama", ...(sama seperti request), "updated_at": "..." }
```

**GET /api/cv/{id}** → response sama struktur di atas.

**PATCH /api/cv/{id}** (update CV yang sudah ada — dipakai setelah CV pertama kali dibuat, supaya "Simpan CV" tidak bikin CV baru tiap klik)
```json
// request: sama seperti body POST /api/cv, semua field opsional
{ "summary": "Ringkasan yang diupdate..." }
// response 200: sama seperti response POST /api/cv
```

**GET /api/cv/{id}/download** — response: file `.txt` (attachment) berisi konten CV. *(MVP pakai plain text dulu; upgrade ke PDF kalau ada waktu sisa.)*

**GET /api/cv** → list ringkas semua CV milik user: `[{ "id":5, "title":"CV Utama", "updated_at":"..." }]`

---

### CV Upload & ATS Analysis

**POST /api/cv/upload** (multipart/form-data, field `file`, `.pdf`/`.docx`, maks 10MB)
```json
// response 201
{ "cv_id": 6, "parsed_preview": "teks hasil ekstraksi (dipotong)...", "status": "parsed" }
```

**POST /api/cv/{id}/analyze**
```json
// request
{ "job_id": 12 }   // optional, null = analisis umum tanpa target lowongan
// response 200
{
  "ats_score": 88,
  "headline": "CV-mu Hampir Sempurna!",
  "strengths": [
    { "title": "Strong Action Verbs", "description": "Penggunaan kata kerja seperti 'Optimized', 'Led' meningkatkan otoritas profesionalmu." },
    { "title": "Technical Skills Identified", "description": "Sistem mendeteksi Python, React, SQL relevan dengan industri tech." }
  ],
  "improvements": [
    { "title": "Summary Terlalu Panjang", "description": "Ringkas jadi 3-4 kalimat padat prestasi." },
    { "title": "LinkedIn Link Hilang", "description": "90% recruiter mengecek profil LinkedIn." }
  ],
  "suggestions": [
    { "section": "Summary", "tip": "Gunakan pola 'Who + What + How'", "example": "Lulusan [Major] yang antusias dengan pengalaman [X tahun]..." },
    { "section": "Experience", "tip": "Kuantifikasi pencapaian", "example": "Tambahkan angka: 'Meningkatkan efisiensi workflow sebesar 20%'" },
    { "section": "Skills", "tip": "Kelompokkan Hard & Soft Skills", "example": null }
  ],
  "keyword_gaps": ["Figma", "User Research"]
}
```

**POST /api/cv/{id}/generate**
```json
// request
{ "job_id": 12 }
// response 200
{ "generated_cv_id": 7, "download_url": "/api/cv/7/download", "highlighted_keywords": ["Figma", "User Research"] }
```

---

### Jobs

**GET /api/jobs?search=&location=&type=&work_mode=&page=1**
*(`search` mencocokkan title, company, DAN required_skills)*
```json
{
  "data": [
    { "id": 12, "title": "Junior UI/UX Designer", "company": "Tokopedia", "location": "Jakarta - Hybrid", "type": "fulltime", "work_mode": "hybrid", "logo_url": null }
  ],
  "meta": { "page": 1, "per_page": 10, "total": 25 }
}
```

**GET /api/jobs/{id}** → detail lengkap termasuk `description`, `required_skills`.

**GET /api/jobs/{id}/match?cv_id=5**
```json
{ "match_score": 88, "matched_keywords": ["React", "SQL"], "missing_keywords": ["Figma"] }
```

---

### Application Tracker

**GET /api/applications**
```json
[
  { "id": 1, "company": "Tokopedia", "position": "Junior UI/UX Designer", "applied_date": "2026-07-12", "deadline": "2026-07-28", "type": "fulltime", "contact": "Diana R.", "location": "Jakarta", "status": "interview" }
]
```

**POST /api/applications**
```json
{ "job_id": 12, "company": "Tokopedia", "position": "Junior UI/UX Designer", "applied_date": "2026-07-12", "deadline": "2026-07-28", "type": "fulltime", "contact": "Diana R.", "location": "Jakarta", "status": "applied" }
```

**PATCH /api/applications/{id}** — body: field apa saja yang mau diupdate, termasuk `status`.

**DELETE /api/applications/{id}** → `{ "message": "deleted" }`

---

### Status enum (dipakai FE untuk badge warna)
`not_started | applied | interview | offer | rejected | no_reply`

### Error format standar (semua endpoint)
```json
{ "message": "Validation failed", "errors": { "email": ["Email sudah terdaftar"] } }
```
HTTP codes: 200/201 sukses, 401 unauthenticated, 422 validasi, 404 not found, 500 server error.

---

## 4. AI Wiring — Gemini Service (contoh inti)

```php
// app/Services/AiService.php
class AiService
{
    public function analyzeCv(string $cvText, ?string $jobDescription = null): array
    {
        $prompt = $this->buildAnalysisPrompt($cvText, $jobDescription);
        try {
            return $this->callGemini($prompt);
        } catch (\Throwable $e) {
            try {
                return $this->callGroq($prompt);
            } catch (\Throwable $e2) {
                return $this->callOpenRouter($prompt);
            }
        }
    }

    private function callGemini(string $prompt): array
    {
        $res = Http::post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' . env('GEMINI_API_KEY'),
            [
                'contents' => [['parts' => [['text' => $prompt]]]],
                'generationConfig' => ['response_mime_type' => 'application/json'],
            ]
        )->throw()->json();

        return json_decode($res['candidates'][0]['content']['parts'][0]['text'], true);
    }

    private function buildAnalysisPrompt(string $cvText, ?string $jobDesc): string
    {
        return <<<PROMPT
        Kamu adalah sistem analisis ATS. Analisis CV berikut{$this->targetLine($jobDesc)}.
        Kembalikan HANYA JSON dengan struktur persis:
        {"ats_score": int, "strengths":[{"title":"","description":""}], "improvements":[{"title":"","description":""}], "suggestions":[{"section":"","tip":"","example":""}], "keyword_gaps":[""]}

        CV:
        {$cvText}
        PROMPT;
    }

    private function targetLine(?string $jobDesc): string
    {
        return $jobDesc ? " untuk lowongan berikut: {$jobDesc}" : "";
    }
}
```
Prompt di atas dipakai bareng untuk `analyze`, matching bisa pakai versi lebih sederhana (keyword extraction) tanpa perlu embedding dulu.

---

## 5. Breakdown 2 Hari

**Hari 1**
- Setup project, migration, auth (register/login/me)
- CRUD CV Builder (POST/GET /api/cv)
- Upload CV + parsing PDF/DOCX → simpan `parsed_text`
- AiService + endpoint `/analyze` (Gemini only dulu, fallback nyusul kalau sempat)
- Seed 15-20 dummy jobs

**Hari 2**
- Endpoint Jobs (list + filter + detail)
- Matching (keyword overlap) di `/jobs/{id}/match`
- Application Tracker CRUD
- Endpoint Dashboard (agregat dari data yang sudah ada)
- Deploy ke Railway/Render, tes end-to-end dengan FE
- (kalau sempat) fallback Groq/OpenRouter, generate CV endpoint

---

## 6. Catatan Penting untuk FE (baca sebelum mulai integrasi)

1. **Response time AI nggak instan.** Endpoint `POST /cv/{id}/analyze` dan `POST /cv/{id}/generate` manggil Gemini secara sync, bisa makan 5–15 detik (lebih lama kalau fallback ke Groq/OpenRouter). Wajib ada loading state jelas di layar CV Analysis & Generate — jangan asumsi cepat kayak endpoint lain. Set timeout request client minimal 30 detik.

2. **Endpoint AI bisa gagal sesekali.** Karena pakai free tier, walau sudah ada 3-provider fallback, kadang tetap bisa dapat `500`. Siapkan state error generik khusus di layar itu ("Analisis gagal, coba lagi"), jangan di-treat sama seperti error validasi biasa.

3. **Auth token tanpa auto-refresh.** Token dari Sanctum berlaku terus sampai logout manual, nggak ada expiry pendek/refresh mechanism di MVP. Simpan token di storage, kirim di header `Authorization: Bearer {token}`, redirect ke halaman login kalau dapat `401`.

4. **Format tanggal ISO 8601** (`YYYY-MM-DD`), konsisten di semua field tanggal (`applied_date`, `deadline`, dst).

5. **Upload CV:**
   - Field name: `file`, content-type `multipart/form-data`
   - Hanya `.pdf` / `.docx`, maks 10MB
   - Validasi format & ukuran di client dulu sebelum kirim ke server, supaya UX nggak nunggu round-trip buat tau file salah.

6. **`logo_url` bisa `null`.** Data lowongan MVP masih dummy, jadi kemungkinan besar belum ada logo perusahaan. Siapkan fallback icon/placeholder, jangan asumsi selalu ada gambar.

7. **Match score = estimasi keyword-based, bukan AI/embedding penuh (untuk saat ini).** Tetap berupa integer 0–100 sesuai kontrak di section 3, jadi kalaupun nanti backend upgrade ke embedding, struktur JSON di FE tidak perlu berubah. Cukup jangan overclaim akurasinya pas demo.

8. **Base URL belum final.** Sementara ini pakai `localhost` untuk dev; URL staging (rencana Railway/Render) akan dibagikan begitu deploy pertama jalan. FE bisa mulai duluan pakai mock data sesuai kontrak section 3, tidak perlu menunggu.

9. **CORS.** Kirim domain dev kalian (`localhost:port` atau URL preview Vercel) supaya bisa di-whitelist di backend dari awal, biar tidak stuck CORS error saat mulai tes integrasi.

10. **Kontrak ini masih bisa berubah kecil selama 2 hari pengerjaan.** Kalau ada field yang berubah nama/ditambah, akan diinfokan lewat channel komunikasi tim (WA/Slack) secepatnya — pantau terus, jangan asumsi kontrak ini 100% final.

---

## 7. Yang dikirim ke FE hari ini
- File ini secara keseluruhan sebagai acuan integrasi bersama
- Base URL sementara (localhost / staging Railway) begitu deploy pertama jalan
- Enum status Tracker (section 3) supaya badge warna konsisten
