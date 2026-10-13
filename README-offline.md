# TypeEXE — Menjalankan Offline

Aplikasi ini sekarang mendukung beban offline (PWA-like) menggunakan Service Worker. Untuk memastikan aplikasi berjalan sepenuhnya offline, ikuti langkah berikut:

Langkah wajib (satu kali, di mesin developer atau server Anda)
1. Pastikan branch yang mengandung perubahan ini telah dicheckout:
   ```bash
   git fetch origin
   git checkout translation/indonesian-ui
   ```

2. Letakkan file vendor yang diperlukan di folder berikut:
   - Chart.js (minified): `assets/vendor/chart.min.js`
   - Font Fira Code (woff2): `assets/fonts/FiraCode.woff2`
   - Logo (jika belum ada): `assets/logo.png`

   Catatan: Service worker akan mencoba meng-cache file-file ini saat penginstalan. Jika file belum tersedia, SW akan tetap terpasang tetapi asset tersebut mungkin tidak tersedia saat offline. Anda dapat mengunduh Chart.js dari https://www.chartjs.org/ (pilih versi stabil, minified) dan Fira Code dari repositori resminya atau Google Fonts (SIL Open Font License).

Menjalankan server lokal untuk pengujian
- Service worker bekerja hanya pada halaman yang disajikan via HTTPS atau `localhost`. Untuk pengujian lokal:
  ```bash
  # Python 3
  python -m http.server 8000
  # atau menggunakan http-server (Node)
  npx http-server -c-1
  ```
  lalu buka http://localhost:8000

Memverifikasi Offline
- Buka DevTools → Application → Service Workers: pastikan `sw.js` terdaftar.
- Di DevTools → Application → Cache Storage: pastikan cache `typeexe-static-v*` berisi aset inti.
- Matikan koneksi (Network → Offline) dan muat ulang halaman; aplikasi seharusnya tetap berfungsi.

Memperbarui aset (invalidate cache)
- Jika Anda menerbitkan pembaruan besar, tingkatkan nilai `CACHE_VERSION` di `sw.js` agar cache lama dibersihkan dan aset baru diambil.

Catatan lisensi
- Pastikan file font yang dimasukkan memiliki lisensi yang mengizinkan redistribusi (Fira Code menggunakan SIL Open Font License — umumnya aman).

