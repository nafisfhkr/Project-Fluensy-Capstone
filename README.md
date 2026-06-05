
# 🚀 Fluensy - Capstone Project

**Fluensy** adalah platform ekosistem cerdas yang mengintegrasikan **AI Smart Matching** dan **Budget Optimizer** untuk membantu UMKM menjalankan kampanye *influencer marketing* secara efisien, aman, dan berbasis data.

Proyek ini dibangun menggunakan arsitektur *Microservices*, memisahkan antarmuka pengguna (Frontend), logika peladen (Backend), serta sistem komputasi Kecerdasan Buatan (AI) ke dalam layanannya masing-masing.

## 📂 Struktur Repositori

Repositori ini terdiri dari 4 direktori utama:

* **`FS/` (Full Stack):** Merupakan direktori utama untuk aplikasi web yang terbagi menjadi dua:


* **`capstone_frontend/`**: Antarmuka pengguna (UI/UX) yang dibangun menggunakan kerangka kerja Next.js dan TypeScript.


* **`capstone_backend/`**: Peladen API dan manajemen *database* yang dibangun menggunakan kerangka kerja PHP Laravel.




* **`fluensy-ai-server-main/`**: Peladen *microservice* khusus AI yang menjalankan model prediksi harga. Direktori ini memuat skrip `ai_microservice.py` dan tugas latar belakang `background_worker.py`.


* **`Fluensy-Model-main/`**: Direktori ini berisi model *Deep Learning* yang sudah diekspor ke dalam format `fluensy_pricer_v3.keras`, beserta *Jupyter Notebook* untuk `model_generate_ratecard` dan *dataset* pelatihan.


* **`Data Science/`**: Ruang kerja komprehensif tim Data Science yang berisi dataset mentah, dataset final (`kol_data_final.csv`), *notebook* eksperimen utama (`Data_Science_Capstone_FINAL.ipynb`), skrip `app.py`, serta dokumen Laporan Capstone.



---

## ⚙️ Persyaratan Sistem (Prerequisites)

Sebelum melakukan instalasi, pastikan sistem Anda memiliki perangkat lunak berikut:

* **Node.js & npm/yarn** (Untuk `capstone_frontend`)
* **PHP & Composer** (Untuk `capstone_backend` berbasis Laravel)
* **Python 3.x & pip** (Untuk `fluensy-ai-server-main` dan eksperimen `Data Science`)
* **Database Server** (MySQL/PostgreSQL untuk Backend)

---

## 🛠️ Panduan Instalasi & Penggunaan

Untuk menjalankan ekosistem Fluensy secara lokal, Anda perlu menyalakan layanan Web dan AI secara terpisah di terminal yang berbeda.

### 1. Menjalankan Backend (Laravel)

Layanan ini mengelola data UMKM, kreator, dan transaksi.

1. Masuk ke direktori *backend*:


```bash
cd FS/capstone_backend

```



```
2. Instal dependensi PHP:
   ```bash
composer install

```

3. Salin pengaturan *environment* dan sesuaikan kredensial *database* Anda:
```bash

```



cp .env.example .env

```
4. Hasilkan kunci aplikasi dan jalankan migrasi *database*:
   ```bash
php artisan key:generate
php artisan migrate

```

5. Jalankan peladen lokal:
```bash

```



php artisan serve

```

### 2. Menjalankan Frontend (Next.js)
Layanan ini menampilkan antarmuka aplikasi Fluensy.
1. Masuk ke direktori *frontend*[cite: 5]:
   ```bash
   cd FS/capstone_frontend

```

2. Instal dependensi Node.js:
```bash

```



npm install

```
3. Jalankan aplikasi web:
   ```bash
npm run dev

```

### 3. Menjalankan AI Microservice (Python)

Layanan ini bertugas memproses *AI Smart Matching* dan simulasi *Rate Card* via model `.keras`.

1. Masuk ke direktori peladen AI:


```bash

```



cd fluensy-ai-server-main

```
2. Instal dependensi Python (Anda bisa merujuk pada `requirements.txt` di direktori `Data Science`)[cite: 5].
3. Jalankan peladen *microservice*:
   ```bash
python ai_microservice.py

```

4. (Opsional) Jika Anda perlu menjalankan pemrosesan data di latar belakang, buka terminal baru dan jalankan:


```bash

```



python background_worker.py

```

***
*Platform ini dikembangkan oleh Tim Capstone CC26-PSU142.*

```
