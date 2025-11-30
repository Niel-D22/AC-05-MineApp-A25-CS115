Tentu, ini adalah *file* `README.md` (dalam format Markdown) yang ringkas dengan instruksi untuk menjalankan *backend* Anda setelah *pull* kode.

# 🚀 MineApp Backend Setup & Run Guide

Panduan ini akan membantu Anda menyiapkan dan menjalankan server *backend* Express.js MineApp di lingkungan lokal.

-----

## 📋 Prasyarat

Pastikan *software* berikut sudah terinstal di sistem Anda:

  * **Node.js & npm (atau yarn):** Untuk menjalankan aplikasi JavaScript.
  * **MySQL Server:** Untuk menjalankan *database*.

-----

## 🛠️ Langkah-Langkah Setup

### 1\. Instal Dependencies

Buka terminal di direktori proyek *backend* Anda (`/be`) dan instal semua paket yang diperlukan (Express, `mysql2`, `bcrypt`, `jsonwebtoken`, dll.):

```bash
npm install
# atau
yarn install
```

### 2\. Konfigurasi Database

Anda perlu membuat *database* dan memastikan kredensial koneksi diatur dengan benar.

  * **Database Name:** Buat *database* bernama **`mineapp_db`** di MySQL Anda.
  * **Kredensial:** Verifikasi *user*, *password*, dan *host* di *file* konfigurasi *database* Anda (`config/db.js` atau di *file* utama jika digabungkan) sudah sesuai dengan pengaturan MySQL lokal Anda.

### 3\. Setup User Awal (Seeding)

Aplikasi ini menggunakan `bcrypt` untuk mengamankan password.

a. **Generate Hash:** Gunakan *script* `hash.js` untuk mendapatkan *hash* password yang aman (misalnya, untuk password "password123"):
` bash node hash.js  `
b. **Update Database:** Salin nilai **HASH** yang dihasilkan (`$2b$10$...`) dan tempelkan secara manual ke kolom `password` di tabel `users` untuk pengguna awal.

-----

## ▶️ Menjalankan Server

Setelah semua *dependencies* diinstal dan *database* disiapkan:

1.  Jalankan server Express Anda (asumsikan *file* utama Anda bernama `app.js` atau `server.js`):
    ```bash
    node app.js
    # atau jika menggunakan Nodemon (disarankan untuk development):
    # nodemon app.js 
    ```
2.  Server akan berjalan dan siap menerima permintaan di **`http://localhost:3000`**.