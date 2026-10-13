[![Dikembangkan & Dipelihara oleh CaptainEXE](https://img.shields.io/badge/Developed%20%26%20Maintained%20by-CaptainEXE-00FFFF?style=for-the-badge&labelColor=0e1117&logo=reactivex&logoColor=white)](https://thecaptainexe.vercel.app)
---
# TypeEXE

TypeEXE — Aplikasi tes mengetik minimal, cepat, dan dapat disesuaikan. Dibangun dengan HTML5, CSS3, Chart.js, serta tema warna Catppuccin untuk pengalaman mengetik yang bersih dan modern.

![Lisensi](https://img.shields.io/badge/license-MIT-purple.svg)
![Tumpukan Teknologi](https://img.shields.io/badge/tech-HTML5%20%7C%20CSS3%20%7C%20JS-blue.svg)

## 🌐 Tautan Cepat

- **Demo Langsung (GitHub Pages):** [https://thecaptainexe.github.io/Type-EXE/](https://thecaptainexe.github.io/Type-EXE/)
- **Versi Terbaru / Unduhan:** Dapatkan rilis stabil dan riwayat pembaruan di [Halaman Versi](https://github.com/thecaptainexe/Type-EXE/releases).

## ✨ Fitur Utama

- **Mode Tes:**
  - **Waktu:** Uji kecepatan Anda dengan batas waktu tetap (5s, 15s, 30s).
  - **Kutipan:** Ketik kutipan pendek yang dipilih secara acak.
  - **Zen:** Mode tanpa batas dan tanpa gangguan. Tekan `` ` `` kapan saja untuk menyelesaikan dan melihat statistik.
- **Penyesuaian Kursor Presisi:** Kursor menyesuaikan ukuran dan posisi untuk akurasi visual lintas perangkat.
- **Analitik Kecepatan Waktu Nyata:** Grafik kecepatan (KPM) yang dihasilkan menggunakan **Chart.js** setelah setiap tes.
- **Tema Warna Catppuccin:** Pemilih tema bawaan (Mocha — Gelap, Macchiato — Kontras, Frappé — Sejuk, Latte — Terang).
- **Antarmuka Layar Penuh:** Tata letak responsif tanpa scrollbar yang dioptimalkan untuk perangkat seluler dan desktop.
- **Opsi Modifikasi:** Aktifkan angka dan tanda baca untuk tantangan tambahan.

## 🛠️ Tumpukan Teknologi

- **Frontend:** HTML5 murni, CSS3, JavaScript (ES6+)
- **Grafik:** [Chart.js](https://www.chartjs.org/)
- **Tipografi:** [Fira Code](https://fonts.google.com/specimen/Fira+Code) via Google Fonts

## 🚀 Memulai

### Opsi 1: Versi Web (GitHub Pages)
Mainkan langsung di peramban Anda tanpa mengunduh apa pun dengan mengunjungi [Deployment GitHub Pages](https://thecaptainexe.github.io/Type-EXE/).

### Opsi 2: Unduh Versi Terbaru
Untuk mendapatkan berkas zip versi terbaru yang diberi tag, kunjungi [Halaman Rilis / Versi](https://github.com/thecaptainexe/Type-EXE/releases) dan unduh paket aset terbaru.

### Opsi 3: Clone Repositori
Clone repositori secara lokal untuk mengedit atau menghosting sendiri:

1. Clone repositori:
   ```bash
   git clone https://github.com/thecaptainexe/Type-EXE.git
   ```
2. Masuk ke direktori proyek:
   ```bash
   cd Type-EXE
   ```
3. Buka `index.html` di peramban web pilihan Anda.

## 🎨 Kustomisasi Tema

Tema dikendalikan melalui properti kustom CSS di `style.css`. Anda dapat menambahkan palet warna baru dengan mendefinisikan aturan CSS baru pada elemen `body`:

```css
body.theme-custom {
    --bg: #1e1e2e;
    --main: #cba6f7; 
    --caret: #cba6f7;
    --sub: #6c7086;
    --text: #cdd6f4;
    --error: #f38ba8;
    --error-extra: #eba0ac;
}
```

## 📄 Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat `LICENSE` untuk informasi lebih lanjut.

---

<p align="center">
  Dikembangkan oleh <a href="https://thecaptainexe.vercel.app">CaptainEXE</a>
</p>
