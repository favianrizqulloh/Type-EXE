Perubahan untuk mendukung pemakaian offline diterapkan pada branch ini.

Ringkasan perubahan yang ditambahkan:
- sw.js: service worker sederhana untuk cache-first aplikasi.
- manifest.json: descriptor PWA minimal.
- README-offline.md: instruksi menjalankan aplikasi offline dan langkah pengujian.
- assets/vendor/chart.min.js: placeholder — silakan letakkan Chart.js minified di path tersebut.
- assets/fonts/README.txt: instruksi untuk meletakkan FiraCode.woff2 di path tersebut.
- style.css: menambahkan @font-face local yang mengacu ke assets/fonts/FiraCode.woff2.
- index.html: mengganti referensi Chart.js ke path lokal, menautkan manifest, dan mendaftarkan service worker.

Catatan penting:
- Untuk sepenuhnya offline, letakkan Chart.js (minified) di `assets/vendor/chart.min.js` dan file font `assets/fonts/FiraCode.woff2`.
- Service worker akan cache file-file ini pada instalasi.

Langkah selanjutnya yang saya rekomendasikan:
1. Unggah Chart.js (minified) ke `assets/vendor/chart.min.js`.
2. Unggah Fira Code woff2 ke `assets/fonts/FiraCode.woff2`.
3. Jalankan server lokal (localhost) lalu buka aplikasi dan verifikasi SW terdaftar.

Jika Anda mau, saya bisa otomatis mengunduh Chart.js dan/atau font dan commit ke repo (minta konfirmasi eksplisit).