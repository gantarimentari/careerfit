<?php

namespace Database\Seeders;

use App\Models\Job;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class JobSeeder extends Seeder
{
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        Job::truncate();
        Schema::enableForeignKeyConstraints();

        $jobs = [
            // --- SYSTEM ANALYST & BUSINESS ANALYST JOBS ---
            [
                'title' => 'Junior System Analyst',
                'company' => 'Telkom Indonesia',
                'location' => 'Jakarta - Hybrid',
                'type' => 'fulltime',
                'work_mode' => 'hybrid',
                'description' => 'Menganalisis kebutuhan sistem informasi perusahaan, merancang diagram UML/ERD, dan menyusun spesifikasi kebutuhan teknis (SRS) untuk tim pengembang.',
                'required_skills' => ['System Analysis', 'UML', 'SQL', 'SDLC', 'Business Requirements'],
                'salary_range' => 'Rp 7.500.000 - 11.000.000',
                'posted_at' => now()->subDays(1),
            ],
            [
                'title' => 'Senior System Analyst',
                'company' => 'Bank Mandiri',
                'location' => 'Jakarta',
                'type' => 'fulltime',
                'work_mode' => 'onsite',
                'description' => 'Memimpin evaluasi arsitektur sistem perbankan core digital, menyusun flow bisnis enterprise, dan memastikan integrasi API berjalan sesuai prosedur keamanan.',
                'required_skills' => ['System Architecture', 'SQL', 'Flowchart', 'Enterprise System', 'UML'],
                'salary_range' => 'Rp 14.000.000 - 20.000.000',
                'posted_at' => now()->subDays(2),
            ],
            [
                'title' => 'IT System Analyst',
                'company' => 'Indosat Ooredoo Hutchison',
                'location' => 'Jakarta - Hybrid',
                'type' => 'fulltime',
                'work_mode' => 'hybrid',
                'description' => 'Bertanggung jawab melakukan analisis fungsional sistem telekomunikasi, merancang struktur database relational, dan koordinasi sprint Agile.',
                'required_skills' => ['System Analysis', 'REST API', 'Database Design', 'Agile', 'Jira'],
                'salary_range' => 'Rp 9.000.000 - 13.500.000',
                'posted_at' => now()->subDays(3),
            ],
            [
                'title' => 'System Analyst Intern',
                'company' => 'Bank BCA',
                'location' => 'Tangerang',
                'type' => 'internship',
                'work_mode' => 'onsite',
                'description' => 'Membantu analis senior dalam dokumentasi workflow sistem, pembuatan flowchart, dan pengujian fungsionalitas aplikasi perbankan.',
                'required_skills' => ['UML', 'Business Analysis', 'Flowchart', 'Dokumentasi Sistem'],
                'salary_range' => 'Rp 3.000.000 - 4.500.000',
                'posted_at' => now()->subDays(4),
            ],
            [
                'title' => 'Business Analyst',
                'company' => 'OVO',
                'location' => 'Jakarta',
                'type' => 'fulltime',
                'work_mode' => 'hybrid',
                'description' => 'Menjembatani kebutuhan bisnis produk pembayaran digital dan spesifikasi teknis tim engineer, termasuk query analisis SQL.',
                'required_skills' => ['Data Analysis', 'SQL', 'Business Process', 'Requirement Gathering'],
                'salary_range' => 'Rp 8.500.000 - 12.000.000',
                'posted_at' => now()->subDays(5),
            ],

            // --- UI/UX & PRODUCT DESIGN JOBS ---
            [
                'title' => 'Junior UI/UX Designer',
                'company' => 'Tokopedia',
                'location' => 'Jakarta - Hybrid',
                'type' => 'fulltime',
                'work_mode' => 'hybrid',
                'description' => 'Mendesain wireframe, prototype, dan melakukan user research untuk fitur e-commerce. Kolaborasi erat dengan tim product dan engineering.',
                'required_skills' => ['Figma', 'User Research', 'Prototyping', 'Design System'],
                'salary_range' => 'Rp 6.000.000 - 9.000.000',
                'posted_at' => now()->subDays(1),
            ],
            [
                'title' => 'Product Designer',
                'company' => 'Ruangguru',
                'location' => 'Remote',
                'type' => 'fulltime',
                'work_mode' => 'remote',
                'description' => 'Merancang pengalaman belajar digital untuk jutaan siswa. Membutuhkan pemahaman kuat tentang design thinking dan riset pengguna.',
                'required_skills' => ['Figma', 'Design Thinking', 'User Research', 'Wireframing'],
                'salary_range' => 'Rp 7.500.000 - 11.000.000',
                'posted_at' => now()->subDays(2),
            ],
            [
                'title' => 'UX Researcher Intern',
                'company' => 'Kata.ai',
                'location' => 'Bandung',
                'type' => 'internship',
                'work_mode' => 'onsite',
                'description' => 'Membantu tim UX melakukan riset pengguna untuk produk chatbot AI, termasuk usability testing dan analisis data kualitatif.',
                'required_skills' => ['User Research', 'Usability Testing', 'Data Analysis'],
                'salary_range' => 'Rp 2.500.000 - 3.500.000',
                'posted_at' => now()->subDays(4),
            ],
            [
                'title' => 'UI Designer',
                'company' => 'Dana Indonesia',
                'location' => 'Jakarta',
                'type' => 'contract',
                'work_mode' => 'onsite',
                'description' => 'Mendesain antarmuka aplikasi fintech dengan standar keamanan dan kemudahan penggunaan tinggi.',
                'required_skills' => ['Figma', 'Design System', 'Mobile Design', 'Micro-interaction'],
                'salary_range' => 'Rp 8.000.000 - 12.000.000',
                'posted_at' => now()->subDays(6),
            ],
            [
                'title' => 'Design System Specialist',
                'company' => 'Gojek',
                'location' => 'Remote',
                'type' => 'fulltime',
                'work_mode' => 'remote',
                'description' => 'Mengembangkan dan memelihara library komponen UI standar untuk konsistensi seluruh produk super-app Gojek.',
                'required_skills' => ['Figma', 'Design System', 'Component Library', 'Design Tokens'],
                'salary_range' => 'Rp 11.000.000 - 16.000.000',
                'posted_at' => now()->subDays(7),
            ],

            // --- SOFTWARE ENGINEERING & DATA JOBS ---
            [
                'title' => 'Frontend Developer (React)',
                'company' => 'Traveloka',
                'location' => 'Jakarta - Hybrid',
                'type' => 'fulltime',
                'work_mode' => 'hybrid',
                'description' => 'Membangun antarmuka web menggunakan React.js dan TypeScript untuk platform travel booking berskala besar.',
                'required_skills' => ['React', 'TypeScript', 'JavaScript', 'CSS'],
                'salary_range' => 'Rp 9.000.000 - 14.000.000',
                'posted_at' => now()->subDays(2),
            ],
            [
                'title' => 'Backend Engineer (Laravel/Node)',
                'company' => 'Ajaib',
                'location' => 'Remote',
                'type' => 'fulltime',
                'work_mode' => 'remote',
                'description' => 'Mengembangkan API dan sistem backend berkinerja tinggi untuk platform investasi saham dan reksadana.',
                'required_skills' => ['PHP', 'Laravel', 'MySQL', 'REST API', 'Redis'],
                'salary_range' => 'Rp 10.000.000 - 15.000.000',
                'posted_at' => now()->subDays(3),
            ],
            [
                'title' => 'Data Analyst Intern',
                'company' => 'Blibli',
                'location' => 'Jakarta',
                'type' => 'internship',
                'work_mode' => 'onsite',
                'description' => 'Menganalisis data transaksi dan perilaku pengguna untuk mendukung keputusan bisnis tim marketing.',
                'required_skills' => ['SQL', 'Python', 'Data Analysis', 'Tableau'],
                'salary_range' => 'Rp 2.800.000 - 3.800.000',
                'posted_at' => now()->subDays(5),
            ],
            [
                'title' => 'Mobile Developer (React Native)',
                'company' => 'Halodoc',
                'location' => 'Jakarta - Hybrid',
                'type' => 'fulltime',
                'work_mode' => 'hybrid',
                'description' => 'Mengembangkan fitur baru pada aplikasi mobile kesehatan digital menggunakan React Native.',
                'required_skills' => ['React Native', 'JavaScript', 'REST API', 'Redux'],
                'salary_range' => 'Rp 9.500.000 - 13.500.000',
                'posted_at' => now()->subDays(6),
            ],
            [
                'title' => 'DevOps Engineer',
                'company' => 'Xendit',
                'location' => 'Remote',
                'type' => 'fulltime',
                'work_mode' => 'remote',
                'description' => 'Mengelola infrastruktur cloud dan CI/CD pipeline untuk sistem pembayaran otomatis.',
                'required_skills' => ['Docker', 'Kubernetes', 'CI/CD', 'AWS'],
                'salary_range' => 'Rp 12.500.000 - 18.000.000',
                'posted_at' => now()->subDays(8),
            ],
        ];

        foreach ($jobs as $job) {
            Job::create($job);
        }
    }
}