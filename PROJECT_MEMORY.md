# Project Memory: Photography Reservation System (PRS - Agung)

Dokumen ini mencatat seluruh rangkuman diskusi, keputusan arsitektur, dan hasil audit repositori referensi sebagai memori untuk dilanjutkan saat berdiskusi kembali dengan klien.

---

## 📌 1. Status Saat Ini & Konteks Proyek

- **Nama Proyek:** Photography Reservation System (PRS - Agung)
- **Basis Layanan:** Fotografer Panggilan (*on-demand / event photographer*)
- **Status Pengembangan:** Tahap Brainstorming & Perencanaan Arsitektur Awal.
- **Pending dari Klien:**
  - Desain logo & identitas visual/branding.
  - Daftar resmi paket foto, durasi, dan harga.
  - Nomor rekening pembayaran manual & nomor WhatsApp admin/fotografer.

---

## 💡 2. Keputusan Kunci Klien: Tanpa Payment Gateway (PG)

Klien menginginkan sistem yang **sederhana, cepat, dan tanpa biaya potongan transaksi pihak ketiga**:

1. **Alur Pemesanan Berbasis Invoice:**
   - Klien memilih kategori & paket foto (misal: Wedding, Prewedding, Wisuda, Portret).
   - Klien memilih tanggal pemotretan & mengisi alamat/lokasi acara.
   - Sistem menerbitkan **Invoice Resmi** dengan Kode Unik (misal: `INV-202611-001`).
2. **Pembayaran Manual & Konfirmasi WhatsApp:**
   - Halaman Invoice menampilkan rincian pesanan, total biaya / opsi DP, serta nomor rekening transfer bank (BCA/Mandiri/BRI).
   - Tersedia tombol **"Konfirmasi via WhatsApp"** yang otomatis membuka chat WA fotografer dengan teks terisi otomatis (Nomor Invoice, Nama Klien, Paket, Tanggal).
3. **Alur Status Booking:**
   - `PENDING`: Invoice telah terbit, slot tanggal ditandai menunggu konfirmasi.
   - `CONFIRMED`: Admin/fotografer telah menerima bukti transfer via WhatsApp dan mengonfirmasi pesanan dari Dashboard Admin (slot terkunci penuh).
   - `COMPLETED`: Sesi foto telah selesai dilaksanakan.
   - `CANCELLED`: Pesanan dibatalkan jika klien tidak konfirmasi dalam batas waktu tertentu.

---

## 🔍 3. Pembelajaran & Audit Dua Repositori Referensi

### A. Repositori Pemuda (`/home/alahar14/Projects/pemuda`)
- **Pola Rekayasa Tingkat Tinggi:** Pengerjaan bertahap 3 hari (Hari 1: Toolchain & Guardrails, Hari 2: Shell, Skema Database & Fitur Internal, Hari 3: SEO, Portal Publik & Notifikasi).
- **Mesin AST Guardrails:** Memasang aturan otomatis di awal (`oxc-parser`) untuk menjaga kebersihan kode (larangan input/button HTML mentah, kunci UI ke `shadcn/ui`, isolasi variabel lingkungan).
- **Schema-First Isolation:** Skema database dirancang dan di-seeding terlebih dahulu sebelum menyentuh antarmuka pengguna.

### B. Repositori Seniman Kamera (`https://github.com/senimankamera/senimankamera.git`)
- **Feature-Driven Clean Architecture:** Struktur rapi di bawah `src/modules/` dengan pemisahan tegas:
  - `actions/`: Validasi Zod & Server Actions (tanpa query Prisma langsung).
  - `use-cases/`: Logika bisnis murni (1 use-case per file).
  - `repositories/`: Akses query database Prisma (terisolasi).
  - `schemas/`: Skema validasi Zod per use-case.
- **Model Bisnis Fotografer:**
  - Fleksibilitas dua mode booking: `DATE_ONLY` (acara seharian) vs `TIME_BASED` (sesi jam).
  - Kunci kalender `CalendarSlot` agar tidak terjadi tabrakan jadwal (*double booking*).
  - Penanganan draft pemesanan dengan waktu kedaluwarsa (TTL).

---

## 🏗️ 4. Rencana Target Arsitektur `prs-agung`

Ketika pengerjaan dimulai, struktur proyek `prs-agung` akan ditata mengikuti standar Clean Architecture:

```txt
src/
├── app/                  # Routing, Layouts, Page Composition (< 150 baris)
│   ├── (public)/         # Halaman Publik (Beranda, Paket, Booking, Invoice)
│   ├── admin/            # Dashboard Fotografer (Kalender, Pesanan Masuk, Portofolio)
│   └── api/              # Route Handlers
├── modules/              # Business Logic Domain Fotografi
│   ├── booking/          # Pembuatan pesanan, generate invoice, kalkulasi biaya
│   ├── calendar/         # Manajemen jadwal pemotretan & slot tanggal
│   ├── customer/         # Master data klien & riwayat pemesanan
│   ├── gallery/          # Portofolio hasil foto/video per kategori
│   └── auth/             # Login admin/fotografer
├── infrastructure/       # External drivers (Prisma Client, Storage, dll.)
├── common/               # Komponen UI bersama (shadcn/ui), hooks, utils
└── types/                # Tipe data global TypeScript
```

---

## 📝 5. Checklist yang Perlu Dikonfirmasi ke Klien Saat Pertemuan Lanjutan

Saat bertemu kembali dengan klien, berikut poin-poin yang perlu disepakati:

1. [ ] **Mekanisme Bukti Transfer:** Cukup kirim bukti transfer langsung di chat WhatsApp, atau klien ingin ada formulir upload struk di halaman web invoice?
2. [ ] **Daftar Paket & Kategori:** Nama-nama paket yang ditawarkan, estimasi durasi, jumlah foto yang diedit, dan harganya.
3. [ ] **Ketentuan DP:** Berapa persentase uang muka (DP) minimal untuk mengunci tanggal pemotretan (misal: 30% atau 50%).
4. [ ] **Informasi Rekening Bank:** Nama Bank, Nomor Rekening, dan Atas Nama.
5. [ ] **Nomor WhatsApp Resmi:** Nomor WA yang dituju untuk pesan konfirmasi otomatis dari tombol invoice.
6. [ ] **Branding:** File logo studio dan nama merek resmi.

---

*Dokumen ini dibuat otomatis sebagai memori proyek pada 11 November 2026 dan siap dilanjutkan kapan pun sesi pengerjaan dimulai.*
