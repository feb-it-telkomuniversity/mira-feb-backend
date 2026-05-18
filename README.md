# MIRA FEB Backend API 🚀

Backend API unified engine untuk sistem **MIRA FEB** (Media Informasi dan Relasi Anda - Fakultas Ekonomi dan Bisnis) Telkom University. Service ini mengelola seluruh operasional akademik, pengaduan keluhan (*Halo Dekan*), monitoring kontrak kinerja unit, penjadwalan kegiatan, notulensi rapat, serta asisten chatbot AI. 

Backend Express.js ini dirancang untuk melayani integrasi data berkecepatan tinggi yang dikonsumsi oleh Web Dashboard Administrator maupun Mobile Application.

---

## 🌟 Features

Backend MIRA FEB memiliki ekosistem fitur lengkap yang mendukung digitalisasi kampus:

| Fitur | Deskripsi |
| :--- | :--- |
| **🔐 Multi-Role Auth** | Login via password, OTP email resmi Telkom University, serta integrasi **Google OAuth** untuk sinkronisasi akun. |
| **🎫 HaloDekan Workflow** | Alur pelaporan berjenjang: Pengajuan mahasiswa ➔ Verifikasi Admin (*Triage*) ➔ Disposisi Dekan ke Unit ➔ Tindak lanjut Unit (+ Upload bukti fisik) ➔ ACC/Revisi Dekan. |
| **📊 Contract Kinerja (KM)** | Evaluasi Kontrak Kinerja Unit Kerja per Triwulan (TW-1 s.d TW-4) lengkap dengan kalkulasi skor otomatis (*achievement score*). |
| **📅 Activity & Conflict Monitor** | Sistem monitoring kegiatan terintegrasi kalender yang mendeteksi bentrok penggunaan Ruangan (*RoomConflict*) dan waktu Pejabat (*OfficialConflict*). |
| **📝 Meeting Minutes (Notulensi)** | Transaksi pencatatan rapat modular yang tersinkronisasi otomatis antara agenda rapat dengan penugasan *action items* (PIC & Deadline). |
| **🔔 WA Reminders & Cron Jobs** | Scheduler otomatis via **node-cron** dan **whatsapp-web.js** untuk mengirimkan WhatsApp alert pengingat agenda ke civitas akademika. |
| **📁 Master Directory & Blob** | Master data Dosen & Staf TPA terintegrasi, dengan sistem upload berkas/avatar dinamis menggunakan **Vercel Blob Storage**. |
| **🤖 Generative AI Chatbot** | Integrasi asisten chatbot cerdas berbasis **Google GenAI** (Gemini) untuk menjawab pertanyaan operasional mahasiswa secara otomatis. |

---

## 🛠️ Tech Stack

MIRA FEB Backend dibangun menggunakan ekosistem teknologi modern:

* **Runtime & Package Manager**: [Bun](https://bun.sh/) (Fast all-in-one JS runtime) & [Node.js](https://nodejs.org/)
* **Framework**: [Express.js v5](https://expressjs.com/) (ES Modules)
* **Database**: [PostgreSQL](https://www.postgresql.org/)
* **ORM**: [Prisma ORM v6](https://www.prisma.io/)
* **Cloud Object Storage**: [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob)
* **AI Engine**: [Google GenAI / Gemini API](https://ai.google.dev/)

---

## 📥 Installation

Pastikan Anda telah menginstal [Bun](https://bun.sh) (atau Node.js/npm) dan PostgreSQL di mesin lokal Anda.

1. **Clone Repository**
   ```bash
   git clone https://github.com/ahmadsidikrofi/mira-feb-backend.git
   cd mira-feb-backend
   ```

2. **Instal Dependensi**
   ```bash
   bun install
   # atau menggunakan npm:
   # npm install
   ```

3. **Generate Prisma Client**
   ```bash
   bun run prisma:generate
   ```

4. **Konfigurasi Database & Migrasi**
   Pastikan PostgreSQL berjalan, lalu lakukan migrasi skema database:
   ```bash
   bunx prisma migrate dev --name init
   ```

5. **Seed Data Awal** (Opsional)
   Untuk mengisi unit kerja default dan akun admin awal:
   ```bash
   bunx prisma db seed
   ```

---

## 🔑 Environment Variables

Buat file `.env` di direktori utama proyek dan sesuaikan variabel berikut:

```env
# Server Port
PORT=3001

# Database Connection (PostgreSQL)
DATABASE_URL="postgresql://postgres:password@localhost:5432/mira_feb?schema=public"

# JWT Authentication
JWT_SECRET="mira_feb_super_secret_jwt_key_2026"

# Vercel Blob Storage Token (Untuk upload avatar & bukti laporan)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_token_example..."

# Google OAuth Credentials (Google Calendar & Login)
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/google/redirect"

# Google Gemini AI Key
GEMINI_API_KEY="your-gemini-api-key"

# Email SMTP (Untuk OTP Requests)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="mira.feb@telkomuniversity.ac.id"
SMTP_PASS="your-app-password"
```

---

## 🚀 Running the Project

Menjalankan server dalam mode development dengan auto-reload:

```bash
bun run dev
# atau menggunakan npm:
# npm run dev
```

Server akan aktif di `http://localhost:3001` dengan API Gateway terpasang pada route `/api`.

---

## 📖 API Documentation

MIRA FEB Backend mendokumentasikan seluruh API-nya secara komprehensif menggunakan standar **OpenAPI 3.0.3 (YAML)** yang langsung terintegrasi dengan **Scalar API Reference**.

* Berkas spesifikasi API utama tersimpan pada: [openapi.yaml](file:///e:/DevTools/PROJECT%20and%20PRACTICE/PROJECT/MIRA-FEB/mira-feb-backend/openapi.yaml)
* Anda dapat membacanya secara interaktif lewat browser di local server pada route `/api-docs` (misal: `http://localhost:3001/api-docs`) atau mengimpor langsung file `openapi.yaml` ke **Postman**, **Scalar**, atau **Swagger UI**.

---

## 🔒 Authentication

Sistem keamanan MIRA FEB menggunakan pengamanan ganda untuk membedakan hak akses publik dan internal:

1. **Stateful Session Cookie**: Token JWT disimpan secara aman di dalam cookie `auth_token` dengan flag `HttpOnly`, `Secure`, dan `SameSite=None` untuk mencegah serangan XSS.
2. **Bearer Token Fallback**: Menyediakan authorization header `Bearer <token>` untuk kemudahan integrasi dengan Mobile Application (Android/iOS).
3. **Google OAuth Linkage**: Pengguna terdaftar (Dosen/TPA/Mahasiswa) dapat menautkan (*linking*) akun Google mereka di menu profil untuk mengaktifkan fitur login instan Google 1-Click dan auto-sinkronisasi kalender rapat ke Google Calendar.

---

## 📁 Project Structure

```bash
mira-feb-backend/
├── controller/          # Logic handler pengendali endpoint API
├── docs/                # Berkas dokumentasi pendukung
├── handlers/            # Penanganan trigger socket / event bus
├── middleware/          # JWT Guard & validasi otorisasi Role
├── model/               # Query database PostgreSQL (Prisma Wrapper)
├── prisma/              # Prisma schema definition & migration logs
│   ├── schema.prisma    # Skema utama database PostgreSQL
│   └── seed.js          # Default database seeders
├── routes/              # Express Router mapping untuk endpoint API
├── services/            # Integrasi eksternal (WhatsApp BOT, Google API)
├── utils/               # Helper utilities (Bcrypt, Blob, JWT sign)
├── index.js             # Aplikasi server utama (Entrypoint)
├── openapi.yaml         # OpenAPI 3.0 API Specification
└── vercel.json          # Serverless deployment configuration
```

---

## 📜 Scripts

Berikut adalah perintah npm/bun scripts yang tersedia di dalam `package.json`:

| Perintah | Deskripsi |
| :--- | :--- |
| `bun run dev` | Menjalankan local server Express.js di port 3001. |
| `bun run build` | Menghasilkan/generate Prisma Client yang terbaru. |
| `bun run migrate:dev` | Membuat riwayat migrasi database baru dalam mode development. |
| `bun run migrate:prod` | Menerapkan migrasi database tertunda ke server produksi. |

---

## ☁️ Deployment

Proyek ini siap dideploy secara serverless ke **Vercel** atau platform containerized cloud:

### Deploy ke Vercel:
Konfigurasi routing serverless Express telah diatur di dalam `vercel.json`. Untuk mempublish:
```bash
npm install -g vercel
vercel --prod
```
*Pastikan seluruh Environment Variables sudah diatur pada tab settings proyek Vercel Anda.*

---

## 📝 Notes

* **WhatsApp Bot Initialization**: WhatsApp Notification Gateway berjalan di latar belakang menggunakan instansi browser Puppeteer (headless). Pastikan server memiliki dependensi browser linux jika dideploy pada Docker/Ubuntu server.
* **Email Constraints**: Permintaan kode OTP dibatasi secara ketat hanya untuk email resmi civitas akademika `@student.telkomuniversity.ac.id` dan `@telkomuniversity.ac.id`.

---
*Dibuat dengan 💻 dan ☕ oleh tim pengembang MIRA Fakultas Ekonomi & Bisnis Telkom University.*
