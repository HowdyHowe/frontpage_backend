# Backend Service - Express.js (TypeScript)

## 📘 Deskripsi Proyek
Proyek ini merupakan layanan backend yang dibangun menggunakan **Express.js** dengan **TypeScript** sebagai bahasa pemrograman utama.
Basis data yang digunakan adalah **MySQL**, dikelola melalui **Prisma ORM** untuk mempermudah proses migrasi dan pengelolaan skema data.

## 🧩 Teknologi yang Digunakan
- Node.js v22+
- Express.js
- TypeScript
- Prisma ORM
- MySQL (via XAMPP)
- Docker (opsional)

## 📂 Struktur Direktori Utama
backend/
├── src/
│   ├── app.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── routes/
│   ├── controllers/
│   └── middlewares/
├── package.json
├── tsconfig.json
└── Dockerfile

## ⚙️ Langkah Instalasi

### 1. Persiapan Lingkungan
Pastikan telah menginstal:
- Node.js (versi 22 atau lebih baru)
- MySQL / XAMPP dengan database bernama 'frontpage'
- npm (biasanya sudah terinstal bersama Node.js)

### 2. Kloning Repositori
git clone <url-repositori>
cd backend

### 3. Instalasi Dependensi
npm install

### 4. Konfigurasi Environment
Buat file `.env` di direktori utama dengan format berikut:

DATABASE_URL="mysql://root:@localhost:3306/frontpage"
PORT=5000

### 5. Generate Prisma Client
npm run prisma:generate

### 6. Sinkronisasi Skema Database
npm run prisma:push

### 7. Menjalankan Server (Mode Pengembangan)
npm run dev

Server akan berjalan di:
http://localhost:5000

## 🧠 Skrip NPM
Perintah              | Deskripsi
----------------------|---------------------------------
npm run dev           | Menjalankan server dalam mode pengembangan
npm run build         | Melakukan kompilasi TypeScript ke JavaScript
npm start             | Menjalankan hasil build produksi
npm run prisma:generate | Menghasilkan Prisma Client
npm run prisma:push   | Sinkronisasi struktur database

## 🧾 Lisensi
Proyek ini dikembangkan untuk keperluan pembelajaran dan pengembangan sistem backend berbasis Express.js.
