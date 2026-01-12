// Panduan JavaScript - Optimized for 35-50 age group with minimal literacy

class PanduanManager {
    constructor() {
        this.currentGuide = null;
        this.currentStep = 0;
        this.guideData = {};
        this.init();
    }

    init() {
        this.loadGuideData();
        this.bindEvents();
        this.initFAQ();
        // Theme toggle akan dihandle oleh DOMContentLoaded event
    }

    loadGuideData() {
        // Guide content optimized for minimal literacy users
        this.guideData = {
            // Quick Start Guides
            'dashboard': {
                title: 'Cara Melihat Dashboard',
                steps: [
                    {
                        title: '1. Buka Dashboard',
                        content: `
                            <h4><i class="fas fa-home"></i> Langkah 1: Buka Dashboard</h4>
                            <p>Dashboard adalah halaman utama yang menampilkan ringkasan data tanaman dan panen Anda.</p>
                            <div class="guide-tip">
                                <strong>Tips:</strong> Dashboard seperti "beranda" rumah Anda di aplikasi ini.
                            </div>
                            <p><strong>Cara membuka:</strong></p>
                            <p>• Klik tombol "Dashboard" di menu samping</p>
                            <p>• Atau klik logo NILAMTRACE di bagian atas</p>
                        `
                    },
                    {
                        title: '2. Lihat Ringkasan Data',
                        content: `
                            <h4><i class="fas fa-chart-bar"></i> Langkah 2: Memahami Angka-angka</h4>
                            <p>Di dashboard, Anda akan melihat kotak-kotak berisi angka penting:</p>
                            <p><strong>• Total Tanaman:</strong> Berapa banyak tanaman nilam Anda</p>
                            <p><strong>• Kesehatan Tanaman:</strong> Persentase tanaman yang sehat</p>
                            <p><strong>• Luas Lahan:</strong> Ukuran lahan dalam meter persegi</p>
                            <div class="guide-tip">
                                <strong>Tips:</strong> Angka-angka ini diperbarui otomatis setiap kali Anda input data baru.
                            </div>
                        `
                    },
                    {
                        title: '3. Lihat Grafik Produksi',
                        content: `
                            <h4><i class="fas fa-chart-line"></i> Langkah 3: Membaca Grafik</h4>
                            <p>Grafik menunjukkan perkembangan panen Anda selama 12 bulan terakhir.</p>
                            <p><strong>Garis naik:</strong> Produksi meningkat</p>
                            <p><strong>Garis turun:</strong> Produksi menurun</p>
                            <p><strong>Garis datar:</strong> Produksi stabil</p>
                            <div class="guide-tip">
                                <strong>Tips:</strong> Gunakan grafik ini untuk melihat bulan mana yang paling produktif.
                            </div>
                        `
                    }
                ]
            },
            'input': {
                title: 'Cara Input Data Produksi',
                steps: [
                    {
                        title: '1. Buka Halaman Input',
                        content: `
                            <h4><i class="fas fa-seedling"></i> Langkah 1: Masuk ke Input Produksi</h4>
                            <p>Untuk mencatat hasil panen, buka halaman "Input Produksi".</p>
                            <p><strong>Cara membuka:</strong></p>
                            <p>• Klik menu "Input Produksi" di sidebar</p>
                            <p>• Atau klik tombol "Input Produksi" di dashboard</p>
                            <div class="guide-tip">
                                <strong>Tips:</strong> Selalu input data segera setelah panen agar tidak lupa.
                            </div>
                        `
                    },
                    {
                        title: '2. Isi Data Panen',
                        content: `
                            <h4><i class="fas fa-edit"></i> Langkah 2: Mengisi Form</h4>
                            <p>Isi kolom-kolom berikut dengan teliti:</p>
                            <p><strong>• Tanggal Panen:</strong> Kapan Anda memanen</p>
                            <p><strong>• Jenis Produk:</strong> Pilih "Daun Segar", "Minyak Nilam", dll</p>
                            <p><strong>• Jumlah (kg):</strong> Berapa kilogram hasil panen</p>
                            <p><strong>• Harga per kg:</strong> Harga jual per kilogram</p>
                            <div class="guide-warning">
                                <strong>Penting:</strong> Kolom bertanda bintang (*) wajib diisi!
                            </div>
                        `
                    },
                    {
                        title: '3. Simpan Data',
                        content: `
                            <h4><i class="fas fa-save"></i> Langkah 3: Menyimpan</h4>
                            <p>Setelah semua kolom terisi:</p>
                            <p>1. Periksa kembali semua data</p>
                            <p>2. Klik tombol "Simpan Data Produksi"</p>
                            <p>3. Tunggu sampai muncul pesan "Data berhasil disimpan"</p>
                            <div class="guide-tip">
                                <strong>Tips:</strong> Total pendapatan akan dihitung otomatis (Jumlah × Harga).
                            </div>
                        `
                    }
                ]
            },
            'camera': {
                title: 'Cara Foto Penyakit Tanaman',
                steps: [
                    {
                        title: '1. Buka Deteksi Penyakit',
                        content: `
                            <h4><i class="fas fa-camera"></i> Langkah 1: Masuk ke Deteksi Penyakit</h4>
                            <p>Untuk memeriksa penyakit tanaman, buka halaman "Deteksi Penyakit".</p>
                            <p><strong>Cara membuka:</strong></p>
                            <p>• Klik menu "Deteksi Penyakit" di sidebar</p>
                            <p>• Atau klik tombol kamera di dashboard</p>
                            <div class="guide-tip">
                                <strong>Tips:</strong> Periksa tanaman secara rutin, terutama saat musim hujan.
                            </div>
                        `
                    },
                    {
                        title: '2. Ambil Foto yang Baik',
                        content: `
                            <h4><i class="fas fa-camera-retro"></i> Langkah 2: Tips Foto yang Benar</h4>
                            <p><strong>Syarat foto yang baik:</strong></p>
                            <p>• Cahaya terang (siang hari atau lampu cukup)</p>
                            <p>• Jarak 20-30 cm dari daun</p>
                            <p>• Fokus pada daun yang sakit</p>
                            <p>• Tidak ada bayangan</p>
                            <p>• Hanya satu daun per foto</p>
                            <div class="guide-warning">
                                <strong>Penting:</strong> Foto yang buram atau gelap tidak bisa dianalisis dengan baik.
                            </div>
                        `
                    },
                    {
                        title: '3. Upload dan Analisis',
                        content: `
                            <h4><i class="fas fa-upload"></i> Langkah 3: Proses Analisis</h4>
                            <p><strong>Cara upload foto:</strong></p>
                            <p>1. Klik "Pilih dari Galeri" atau "Ambil Foto"</p>
                            <p>2. Pilih foto daun yang sakit</p>
                            <p>3. Klik "Analisis dengan AI"</p>
                            <p>4. Tunggu 10-30 detik untuk hasil</p>
                            <div class="guide-tip">
                                <strong>Tips:</strong> Hasil analisis akan menunjukkan jenis penyakit dan cara mengatasinya.
                            </div>
                        `
                    }
                ]
            },
            // Basic Guides
            'intro': {
                title: 'Pengenalan NILAMTRACE',
                steps: [
                    {
                        title: 'Apa itu NILAMTRACE?',
                        content: `
                            <h4><i class="fas fa-info-circle"></i> Mengenal NILAMTRACE</h4>
                            <p>NILAMTRACE adalah aplikasi untuk membantu petani nilam mengelola tanaman dan produksi.</p>
                            <p><strong>Fitur utama:</strong></p>
                            <p>• Mencatat data panen dan tanaman</p>
                            <p>• Mendeteksi penyakit dengan foto</p>
                            <p>• Melihat grafik perkembangan produksi</p>
                            <p>• Mendapat saran perawatan tanaman</p>
                            <div class="guide-tip">
                                <strong>Manfaat:</strong> Membantu meningkatkan hasil panen dan mengurangi kerugian akibat penyakit.
                            </div>
                        `
                    }
                ]
            },
            'navigation': {
                title: 'Cara Navigasi Menu',
                steps: [
                    {
                        title: 'Mengenal Menu Utama',
                        content: `
                            <h4><i class="fas fa-compass"></i> Menu-menu Penting</h4>
                            <p><strong>Menu di sidebar kiri:</strong></p>
                            <p><strong>• Dashboard:</strong> Halaman utama, lihat ringkasan data</p>
                            <p><strong>• Deteksi Penyakit:</strong> Foto tanaman untuk cek penyakit</p>
                            <p><strong>• Input Produksi:</strong> Catat hasil panen dan data tanaman</p>
                            <p><strong>• Panduan:</strong> Halaman bantuan (yang sedang Anda baca)</p>
                            <div class="guide-tip">
                                <strong>Tips:</strong> Menu yang sedang aktif akan berwarna hijau.
                            </div>
                        `
                    }
                ]
            },
            'profile': {
                title: 'Cara Mengatur Profil',
                steps: [
                    {
                        title: '1. Buka Halaman Profil',
                        content: `
                            <h4><i class="fas fa-user-circle"></i> Langkah 1: Masuk ke Profil</h4>
                            <p>Profil berisi informasi pribadi dan pengaturan akun Anda.</p>
                            <p><strong>Cara membuka:</strong></p>
                            <p>• Klik foto profil di pojok kanan atas</p>
                            <p>• Pilih "Profil Saya" dari menu dropdown</p>
                            <p>• Atau klik "Pengaturan Akun" di sidebar</p>
                            <div class="guide-tip">
                                <strong>Tips:</strong> Lengkapi profil untuk pengalaman yang lebih personal.
                            </div>
                        `
                    },
                    {
                        title: '2. Edit Informasi Pribadi',
                        content: `
                            <h4><i class="fas fa-edit"></i> Langkah 2: Mengubah Data Diri</h4>
                            <p>Anda bisa mengubah informasi berikut:</p>
                            <p><strong>• Nama Lengkap:</strong> Nama yang akan ditampilkan</p>
                            <p><strong>• Email:</strong> Alamat email untuk notifikasi</p>
                            <p><strong>• Nomor Telepon:</strong> Untuk kontak darurat</p>
                            <p><strong>• Alamat:</strong> Lokasi lahan pertanian</p>
                            <div class="guide-warning">
                                <strong>Penting:</strong> Pastikan email dan nomor telepon benar untuk menerima notifikasi penting.
                            </div>
                        `
                    },
                    {
                        title: '3. Ganti Password',
                        content: `
                            <h4><i class="fas fa-key"></i> Langkah 3: Mengubah Kata Sandi</h4>
                            <p>Untuk keamanan akun, ganti password secara berkala:</p>
                            <p>1. Masukkan password lama</p>
                            <p>2. Ketik password baru (minimal 8 karakter)</p>
                            <p>3. Ulangi password baru</p>
                            <p>4. Klik "Simpan Perubahan"</p>
                            <div class="guide-tip">
                                <strong>Tips:</strong> Gunakan kombinasi huruf, angka, dan simbol untuk password yang kuat.
                            </div>
                        `
                    }
                ]
            },
            // Production Guides
            'harvest-input': {
                title: 'Input Data Panen Lengkap',
                steps: [
                    {
                        title: '1. Persiapan Data',
                        content: `
                            <h4><i class="fas fa-clipboard-list"></i> Langkah 1: Siapkan Data Panen</h4>
                            <p>Sebelum input, siapkan informasi berikut:</p>
                            <p><strong>• Tanggal panen:</strong> Kapan Anda memanen</p>
                            <p><strong>• Berat hasil:</strong> Timbang dalam kilogram</p>
                            <p><strong>• Jenis produk:</strong> Daun segar, minyak, atau sabut</p>
                            <p><strong>• Harga jual:</strong> Harga per kilogram</p>
                            <div class="guide-tip">
                                <strong>Tips:</strong> Timbang hasil panen saat masih segar untuk akurasi data.
                            </div>
                        `
                    },
                    {
                        title: '2. Mengisi Form Produksi',
                        content: `
                            <h4><i class="fas fa-form"></i> Langkah 2: Input Data ke Form</h4>
                            <p>Isi form dengan teliti:</p>
                            <p><strong>1. Tanggal Panen:</strong> Klik kalender, pilih tanggal</p>
                            <p><strong>2. Jenis Produk:</strong> Pilih dari dropdown menu</p>
                            <p><strong>3. Jumlah (kg):</strong> Masukkan angka berat</p>
                            <p><strong>4. Harga/kg:</strong> Masukkan harga jual</p>
                            <div class="guide-warning">
                                <strong>Perhatian:</strong> Total pendapatan akan dihitung otomatis (Jumlah × Harga).
                            </div>
                        `
                    },
                    {
                        title: '3. Tambah Informasi Opsional',
                        content: `
                            <h4><i class="fas fa-plus-circle"></i> Langkah 3: Informasi Tambahan</h4>
                            <p>Lengkapi dengan data opsional:</p>
                            <p><strong>• Kualitas:</strong> Premium, Standar, atau Ekonomi</p>
                            <p><strong>• Lokasi Panen:</strong> Blok atau area spesifik</p>
                            <p><strong>• Keterangan:</strong> Catatan khusus (cuaca, kondisi, dll)</p>
                            <div class="guide-tip">
                                <strong>Tips:</strong> Informasi tambahan membantu analisis pola produksi.
                            </div>
                        `
                    }
                ]
            },
            'plant-input': {
                title: 'Input Data Tanaman',
                steps: [
                    {
                        title: '1. Buka Tab Tanaman',
                        content: `
                            <h4><i class="fas fa-seedling"></i> Langkah 1: Masuk ke Input Tanaman</h4>
                            <p>Di halaman Input Produksi, klik tab "Input Data Tanaman".</p>
                            <p><strong>Fungsi input tanaman:</strong></p>
                            <p>• Mencatat varietas yang ditanam</p>
                            <p>• Menghitung total tanaman otomatis</p>
                            <p>• Monitoring status kesehatan</p>
                            <div class="guide-tip">
                                <strong>Tips:</strong> Input data tanaman membantu estimasi produksi masa depan.
                            </div>
                        `
                    },
                    {
                        title: '2. Isi Data Tanaman',
                        content: `
                            <h4><i class="fas fa-leaf"></i> Langkah 2: Lengkapi Informasi Tanaman</h4>
                            <p><strong>Data yang perlu diisi:</strong></p>
                            <p><strong>• Nama Varietas:</strong> Jenis nilam (Aceh, Jawa, dll)</p>
                            <p><strong>• Tanggal Tanam:</strong> Kapan mulai menanam</p>
                            <p><strong>• Luas Lahan:</strong> Ukuran area dalam m²</p>
                            <p><strong>• Lokasi:</strong> Blok atau area spesifik</p>
                            <div class="guide-warning">
                                <strong>Rumus:</strong> 1 m² = 1 tanaman nilam (jarak tanam standar).
                            </div>
                        `
                    },
                    {
                        title: '3. Pilih Status Tanaman',
                        content: `
                            <h4><i class="fas fa-heartbeat"></i> Langkah 3: Tentukan Status</h4>
                            <p><strong>Pilihan status tanaman:</strong></p>
                            <p><strong>• Aktif/Berkembang:</strong> Tanaman sehat dan tumbuh</p>
                            <p><strong>• Siap Panen:</strong> Sudah bisa dipanen</p>
                            <p><strong>• Tanaman Baru:</strong> Baru ditanam</p>
                            <p><strong>• Terkena Penyakit:</strong> Ada masalah kesehatan</p>
                            <div class="guide-tip">
                                <strong>Tips:</strong> Update status secara berkala untuk monitoring yang akurat.
                            </div>
                        `
                    }
                ]
            },
            'calculator': {
                title: 'Menggunakan Kalkulator Produksi',
                steps: [
                    {
                        title: 'Cara Menggunakan Kalkulator',
                        content: `
                            <h4><i class="fas fa-calculator"></i> Kalkulator Cepat</h4>
                            <p>Kalkulator membantu menghitung pendapatan sebelum input data resmi.</p>
                            <p><strong>Cara menggunakan:</strong></p>
                            <p>1. Masukkan jumlah panen (kg)</p>
                            <p>2. Masukkan harga per kg</p>
                            <p>3. Total akan dihitung otomatis</p>
                            <p>4. Klik "Terapkan ke Form" untuk mengisi form utama</p>
                            <div class="guide-tip">
                                <strong>Tips:</strong> Gunakan untuk simulasi harga sebelum menjual hasil panen.
                            </div>
                        `
                    }
                ]
            },
            // Detection Guides
            'photo-tips': {
                title: 'Tips Foto Penyakit yang Baik',
                steps: [
                    {
                        title: '1. Persiapan Foto',
                        content: `
                            <h4><i class="fas fa-camera"></i> Langkah 1: Persiapan</h4>
                            <p><strong>Waktu terbaik foto:</strong></p>
                            <p>• Pagi hari (jam 8-10) atau sore (jam 15-17)</p>
                            <p>• Cuaca cerah tapi tidak terik</p>
                            <p>• Hindari saat hujan atau angin kencang</p>
                            <div class="guide-tip">
                                <strong>Tips:</strong> Cahaya alami memberikan hasil foto terbaik untuk analisis AI.
                            </div>
                        `
                    },
                    {
                        title: '2. Teknik Pengambilan Foto',
                        content: `
                            <h4><i class="fas fa-crosshairs"></i> Langkah 2: Teknik yang Benar</h4>
                            <p><strong>Aturan foto yang baik:</strong></p>
                            <p>• Jarak 20-30 cm dari daun</p>
                            <p>• Fokus pada daun yang sakit</p>
                            <p>• Satu daun per foto</p>
                            <p>• Tangan stabil, tidak goyang</p>
                            <p>• Daun memenuhi sebagian besar frame</p>
                            <div class="guide-warning">
                                <strong>Hindari:</strong> Foto buram, terlalu gelap, atau ada bayangan.
                            </div>
                        `
                    }
                ]
            },
            'upload-photo': {
                title: 'Cara Upload Foto',
                steps: [
                    {
                        title: '1. Pilih Metode Upload',
                        content: `
                            <h4><i class="fas fa-upload"></i> Langkah 1: Pilih Cara Upload</h4>
                            <p><strong>3 cara upload foto:</strong></p>
                            <p><strong>• Upload Foto:</strong> Pilih dari galeri HP</p>
                            <p><strong>• Ambil Foto:</strong> Langsung foto dengan kamera</p>
                            <p><strong>• Riwayat:</strong> Lihat foto yang pernah dianalisis</p>
                            <div class="guide-tip">
                                <strong>Rekomendasi:</strong> "Ambil Foto" untuk hasil terbaik karena langsung fresh.
                            </div>
                        `
                    },
                    {
                        title: '2. Proses Upload',
                        content: `
                            <h4><i class="fas fa-cloud-upload-alt"></i> Langkah 2: Upload ke Sistem</h4>
                            <p><strong>Langkah upload:</strong></p>
                            <p>1. Pilih foto dari galeri atau ambil foto baru</p>
                            <p>2. Pastikan foto terlihat jelas di preview</p>
                            <p>3. Klik "Analisis dengan AI"</p>
                            <p>4. Tunggu proses analisis (10-30 detik)</p>
                            <div class="guide-warning">
                                <strong>Penting:</strong> Pastikan koneksi internet stabil saat upload.
                            </div>
                        `
                    }
                ]
            },
            'read-results': {
                title: 'Membaca Hasil Analisis',
                steps: [
                    {
                        title: '1. Memahami Hasil Deteksi',
                        content: `
                            <h4><i class="fas fa-search"></i> Langkah 1: Baca Hasil Deteksi</h4>
                            <p><strong>Informasi yang ditampilkan:</strong></p>
                            <p><strong>• Nama Penyakit:</strong> Jenis penyakit yang terdeteksi</p>
                            <p><strong>• Tingkat Keparahan:</strong> Ringan, Sedang, atau Parah</p>
                            <p><strong>• Akurasi:</strong> Seberapa yakin sistem (dalam %)</p>
                            <div class="guide-tip">
                                <strong>Tips:</strong> Akurasi di atas 80% menunjukkan hasil yang dapat diandalkan.
                            </div>
                        `
                    },
                    {
                        title: '2. Pahami Rekomendasi',
                        content: `
                            <h4><i class="fas fa-lightbulb"></i> Langkah 2: Ikuti Saran Penanganan</h4>
                            <p><strong>Jenis rekomendasi:</strong></p>
                            <p><strong>• Isolasi:</strong> Pisahkan tanaman sakit</p>
                            <p><strong>• Pengobatan:</strong> Jenis obat dan dosisnya</p>
                            <p><strong>• Pemangkasan:</strong> Bagian yang harus dipotong</p>
                            <p><strong>• Pencegahan:</strong> Cara mencegah penyebaran</p>
                            <div class="guide-warning">
                                <strong>Penting:</strong> Lakukan penanganan segera untuk mencegah penyebaran.
                            </div>
                        `
                    },
                    {
                        title: '3. Simpan dan Bagikan',
                        content: `
                            <h4><i class="fas fa-save"></i> Langkah 3: Dokumentasi Hasil</h4>
                            <p><strong>Opsi setelah analisis:</strong></p>
                            <p><strong>• Simpan Hasil:</strong> Masuk ke riwayat deteksi</p>
                            <p><strong>• Bagikan:</strong> Kirim ke penyuluh atau petani lain</p>
                            <p><strong>• Cetak Laporan:</strong> Buat laporan PDF</p>
                            <p><strong>• Deteksi Baru:</strong> Analisis foto lain</p>
                            <div class="guide-tip">
                                <strong>Tips:</strong> Simpan hasil untuk tracking perkembangan penyakit.
                            </div>
                        `
                    }
                ]
            },
            // Dashboard Guides
            'dashboard-overview': {
                title: 'Memahami Dashboard Lengkap',
                steps: [
                    {
                        title: '1. Ringkasan Statistik',
                        content: `
                            <h4><i class="fas fa-tachometer-alt"></i> Langkah 1: Baca Statistik Utama</h4>
                            <p><strong>Kotak statistik menampilkan:</strong></p>
                            <p><strong>• Total Tanaman:</strong> Jumlah seluruh tanaman nilam</p>
                            <p><strong>• Kesehatan Tanaman:</strong> Persentase tanaman sehat</p>
                            <p><strong>• Luas Lahan:</strong> Total area yang digunakan</p>
                            <div class="guide-tip">
                                <strong>Tips:</strong> Warna hijau = baik, kuning = perlu perhatian, merah = masalah.
                            </div>
                        `
                    },
                    {
                        title: '2. Aktivitas Terbaru',
                        content: `
                            <h4><i class="fas fa-clock"></i> Langkah 2: Lihat Aktivitas Terbaru</h4>
                            <p><strong>Bagian aktivitas menampilkan:</strong></p>
                            <p>• Input produksi terbaru</p>
                            <p>• Deteksi penyakit yang dilakukan</p>
                            <p>• Penambahan tanaman baru</p>
                            <p>• Perubahan status tanaman</p>
                            <div class="guide-tip">
                                <strong>Tips:</strong> Klik "Lihat Semua" untuk riwayat lengkap.
                            </div>
                        `
                    },
                    {
                        title: '3. Notifikasi Penting',
                        content: `
                            <h4><i class="fas fa-bell"></i> Langkah 3: Perhatikan Notifikasi</h4>
                            <p><strong>Jenis notifikasi:</strong></p>
                            <p><strong>• Tanaman siap panen:</strong> Waktunya memanen</p>
                            <p><strong>• Jadwal pemupukan:</strong> Reminder perawatan</p>
                            <p><strong>• Peringatan cuaca:</strong> Antisipasi hujan/kemarau</p>
                            <div class="guide-warning">
                                <strong>Penting:</strong> Notifikasi merah memerlukan tindakan segera.
                            </div>
                        `
                    }
                ]
            },
            'charts': {
                title: 'Membaca Grafik Produksi',
                steps: [
                    {
                        title: '1. Grafik Produksi Bulanan',
                        content: `
                            <h4><i class="fas fa-chart-line"></i> Langkah 1: Pahami Grafik Garis</h4>
                            <p><strong>Cara membaca grafik:</strong></p>
                            <p><strong>• Sumbu X (horizontal):</strong> Bulan (Jan-Des)</p>
                            <p><strong>• Sumbu Y (vertikal):</strong> Jumlah produksi (kg)</p>
                            <p><strong>• Garis naik:</strong> Produksi meningkat</p>
                            <p><strong>• Garis turun:</strong> Produksi menurun</p>
                            <div class="guide-tip">
                                <strong>Tips:</strong> Puncak grafik menunjukkan bulan panen terbaik.
                            </div>
                        `
                    },
                    {
                        title: '2. Grafik Pendapatan',
                        content: `
                            <h4><i class="fas fa-money-bill-wave"></i> Langkah 2: Analisis Pendapatan</h4>
                            <p>Klik tombol "Pendapatan" untuk melihat grafik uang:</p>
                            <p><strong>• Warna hijau:</strong> Pendapatan tinggi</p>
                            <p><strong>• Warna kuning:</strong> Pendapatan sedang</p>
                            <p><strong>• Warna merah:</strong> Pendapatan rendah</p>
                            <div class="guide-tip">
                                <strong>Analisis:</strong> Bandingkan grafik produksi vs pendapatan untuk lihat efisiensi harga.
                            </div>
                        `
                    }
                ]
            },
            'history': {
                title: 'Melihat Riwayat Data',
                steps: [
                    {
                        title: '1. Akses Riwayat Produksi',
                        content: `
                            <h4><i class="fas fa-history"></i> Langkah 1: Buka Riwayat</h4>
                            <p>Di halaman Input Produksi, klik tab "Riwayat Produksi".</p>
                            <p><strong>Informasi yang tersedia:</strong></p>
                            <p>• Tanggal panen</p>
                            <p>• Jenis dan jumlah produk</p>
                            <p>• Harga dan total pendapatan</p>
                            <p>• Kualitas produk</p>
                            <div class="guide-tip">
                                <strong>Tips:</strong> Gunakan filter untuk mencari data spesifik.
                            </div>
                        `
                    },
                    {
                        title: '2. Filter dan Pencarian',
                        content: `
                            <h4><i class="fas fa-filter"></i> Langkah 2: Gunakan Filter</h4>
                            <p><strong>Opsi filter tersedia:</strong></p>
                            <p><strong>• Periode:</strong> Hari ini, minggu ini, bulan ini</p>
                            <p><strong>• Jenis Produk:</strong> Daun segar, minyak, sabut</p>
                            <p><strong>• Rentang Tanggal:</strong> Pilih periode custom</p>
                            <div class="guide-tip">
                                <strong>Tips:</strong> Filter membantu analisis pola produksi per periode.
                            </div>
                        `
                    },
                    {
                        title: '3. Export dan Laporan',
                        content: `
                            <h4><i class="fas fa-file-export"></i> Langkah 3: Buat Laporan</h4>
                            <p><strong>Format export tersedia:</strong></p>
                            <p><strong>• PDF:</strong> Laporan formal untuk bank/koperasi</p>
                            <p><strong>• Excel:</strong> Data untuk analisis lanjutan</p>
                            <p><strong>• Print:</strong> Cetak langsung</p>
                            <div class="guide-tip">
                                <strong>Tips:</strong> Laporan PDF cocok untuk pengajuan kredit pertanian.
                            </div>
                        `
                    }
                ]
            }
        };
    }

    bindEvents() {
        // Quick start buttons
        document.querySelectorAll('.quick-start-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const guideType = card.dataset.guide;
                console.log('Quick start clicked:', guideType); // Debug log
                this.openGuide(guideType);
            });
        });

        // Guide items
        document.querySelectorAll('.guide-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const guideType = item.dataset.guide;
                console.log('Guide item clicked:', guideType); // Debug log
                if (guideType && this.guideData[guideType]) {
                    this.openGuide(guideType);
                }
            });
        });

        // Modal controls
        const closeModal = document.getElementById('closeModal');
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                console.log('Close modal clicked'); // Debug log
                this.closeGuide();
            });
        }

        const modalOverlay = document.getElementById('modalOverlay');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => {
                console.log('Modal overlay clicked'); // Debug log
                this.closeGuide();
            });
        }

        const nextStep = document.getElementById('nextStep');
        if (nextStep) {
            nextStep.addEventListener('click', () => {
                console.log('Next step clicked'); // Debug log
                this.nextStep();
            });
        }

        const prevStep = document.getElementById('prevStep');
        if (prevStep) {
            prevStep.addEventListener('click', () => {
                console.log('Previous step clicked'); // Debug log
                this.prevStep();
            });
        }

        // FAQ toggle
        const faqBtn = document.getElementById('faqBtn');
        if (faqBtn) {
            faqBtn.addEventListener('click', () => {
                console.log('FAQ button clicked'); // Debug log
                this.toggleFAQ();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.currentGuide) {
                if (e.key === 'Escape') {
                    this.closeGuide();
                } else if (e.key === 'ArrowRight') {
                    this.nextStep();
                } else if (e.key === 'ArrowLeft') {
                    this.prevStep();
                }
            }
        });
    }

    initFAQ() {
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.parentElement;
                const isActive = faqItem.classList.contains('active');
                
                // Close all FAQ items
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    faqItem.classList.add('active');
                }
            });
        });
    }

    openGuide(guideType) {
        console.log('Opening guide:', guideType); // Debug log
        
        if (!this.guideData[guideType]) {
            console.error('Guide not found:', guideType);
            alert('Panduan tidak ditemukan: ' + guideType);
            return;
        }

        this.currentGuide = guideType;
        this.currentStep = 0;
        
        const modal = document.getElementById('guideModal');
        const overlay = document.getElementById('modalOverlay');
        
        if (modal && overlay) {
            console.log('Showing modal for guide:', guideType); // Debug log
            this.updateModalContent();
            modal.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            console.error('Modal elements not found');
            alert('Error: Modal elements tidak ditemukan');
        }
    }

    closeGuide() {
        const modal = document.getElementById('guideModal');
        const overlay = document.getElementById('modalOverlay');
        
        if (modal && overlay) {
            modal.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        this.currentGuide = null;
        this.currentStep = 0;
    }

    nextStep() {
        if (!this.currentGuide) return;
        
        const guide = this.guideData[this.currentGuide];
        if (this.currentStep < guide.steps.length - 1) {
            this.currentStep++;
            this.updateModalContent();
        } else {
            // Guide completed
            this.showCompletionMessage();
        }
    }

    prevStep() {
        if (!this.currentGuide) return;
        
        if (this.currentStep > 0) {
            this.currentStep--;
            this.updateModalContent();
        }
    }

    updateModalContent() {
        if (!this.currentGuide) {
            console.error('No current guide set');
            return;
        }
        
        const guide = this.guideData[this.currentGuide];
        if (!guide || !guide.steps || !guide.steps[this.currentStep]) {
            console.error('Invalid guide data:', this.currentGuide, this.currentStep);
            return;
        }
        
        const step = guide.steps[this.currentStep];
        
        const titleElement = document.getElementById('modalTitle');
        const bodyElement = document.getElementById('modalBody');
        const nextBtn = document.getElementById('nextStep');
        const prevBtn = document.getElementById('prevStep');
        
        if (titleElement) {
            titleElement.textContent = `${guide.title} (${this.currentStep + 1}/${guide.steps.length})`;
        } else {
            console.error('Modal title element not found');
        }
        
        if (bodyElement) {
            bodyElement.innerHTML = step.content;
        } else {
            console.error('Modal body element not found');
        }
        
        // Update button states
        if (prevBtn) {
            prevBtn.style.display = this.currentStep > 0 ? 'flex' : 'none';
        }
        
        if (nextBtn) {
            const isLastStep = this.currentStep === guide.steps.length - 1;
            nextBtn.innerHTML = isLastStep ? 
                '<i class="fas fa-check"></i> Selesai' : 
                'Selanjutnya <i class="fas fa-arrow-right"></i>';
        }
        
        console.log('Modal content updated for step:', this.currentStep + 1, 'of', guide.steps.length);
    }

    showCompletionMessage() {
        const bodyElement = document.getElementById('modalBody');
        if (bodyElement) {
            bodyElement.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 4rem; color: #4CAF50; margin-bottom: 1rem;">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3 style="color: #4CAF50; margin-bottom: 1rem;">Selamat!</h3>
                    <p style="font-size: 1.1rem; margin-bottom: 2rem;">
                        Anda telah menyelesaikan panduan ini. Sekarang Anda bisa mencoba langsung di aplikasi.
                    </p>
                    <button class="btn btn-primary" onclick="panduanManager.closeGuide()" style="padding: 1rem 2rem; font-size: 1.1rem;">
                        <i class="fas fa-rocket"></i>
                        Mulai Praktik
                    </button>
                </div>
            `;
        }
        
        // Hide navigation buttons
        const nextBtn = document.getElementById('nextStep');
        const prevBtn = document.getElementById('prevStep');
        if (nextBtn) nextBtn.style.display = 'none';
        if (prevBtn) prevBtn.style.display = 'none';
    }

    toggleFAQ() {
        const faqSection = document.getElementById('faqSection');
        const faqBtn = document.getElementById('faqBtn');
        
        if (faqSection && faqBtn) {
            const isVisible = faqSection.style.display !== 'none';
            
            if (isVisible) {
                faqSection.style.display = 'none';
                faqBtn.innerHTML = '<i class="fas fa-list"></i> Lihat FAQ';
            } else {
                faqSection.style.display = 'block';
                faqBtn.innerHTML = '<i class="fas fa-times"></i> Tutup FAQ';
                
                // Smooth scroll to FAQ
                faqSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    }

    // Utility method to highlight elements (for future interactive tutorials)
    highlightElement(selector, message) {
        const element = document.querySelector(selector);
        if (element) {
            element.style.position = 'relative';
            element.style.zIndex = '1002';
            element.style.boxShadow = '0 0 0 4px #4CAF50, 0 0 0 8px rgba(76, 175, 80, 0.3)';
            element.style.borderRadius = '8px';
            
            // Add tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'highlight-tooltip';
            tooltip.innerHTML = message;
            tooltip.style.cssText = `
                position: absolute;
                top: -60px;
                left: 50%;
                transform: translateX(-50%);
                background: #333;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                font-size: 0.9rem;
                white-space: nowrap;
                z-index: 1003;
            `;
            element.appendChild(tooltip);
        }
    }

    removeHighlight(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.style.position = '';
            element.style.zIndex = '';
            element.style.boxShadow = '';
            element.style.borderRadius = '';
            
            const tooltip = element.querySelector('.highlight-tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        }
    }

    // Setup theme toggle functionality
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        }
    }

    // Toggle theme function
    toggleTheme() {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        const themeToggle = document.getElementById('themeToggle');
        
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            const text = themeToggle.querySelector('span');
            
            if (isDarkMode) {
                icon.className = 'fas fa-sun';
                text.textContent = 'Mode Terang';
                localStorage.setItem('theme', 'dark');
            } else {
                icon.className = 'fas fa-moon';
                text.textContent = 'Mode Gelap';
                localStorage.setItem('theme', 'light');
            }
        }
    }

    // Load saved theme
    loadSavedTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) {
                const icon = themeToggle.querySelector('i');
                const text = themeToggle.querySelector('span');
                
                if (icon && text) {
                    icon.className = 'fas fa-sun';
                    text.textContent = 'Mode Terang';
                }
            }
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing panduan...'); // Debug log
    
    // Check if required elements exist
    const requiredElements = [
        'guideModal',
        'modalOverlay', 
        'modalTitle',
        'modalBody',
        'nextStep',
        'prevStep',
        'closeModal',
        'faqBtn',
        'faqSection'
    ];
    
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    if (missingElements.length > 0) {
        console.error('Missing required elements:', missingElements);
    } else {
        console.log('All required elements found');
    }
    
    // Initialize PanduanManager
    try {
        window.panduanManager = new PanduanManager();
        console.log('PanduanManager initialized successfully');
    } catch (error) {
        console.error('Error initializing PanduanManager:', error);
    }
    
    // Initialize CommonManager for navigation and theme
    if (typeof CommonManager !== 'undefined') {
        try {
            window.commonManager = new CommonManager();
            console.log('CommonManager initialized successfully');
            
            // Give CommonManager time to set up theme toggle
            setTimeout(() => {
                const themeToggle = document.getElementById('themeToggle');
                if (themeToggle && !themeToggle.hasAttribute('data-initialized')) {
                    console.log('CommonManager did not initialize theme toggle, using fallback');
                    initializeFallbackThemeToggle();
                }
            }, 100);
        } catch (error) {
            console.error('Error initializing CommonManager:', error);
            initializeFallbackThemeToggle();
        }
    } else {
        console.log('CommonManager not available, using fallback theme toggle');
        initializeFallbackThemeToggle();
    }
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Load saved theme immediately (independent of theme toggle initialization)
    const savedTheme = localStorage.getItem('theme');
    console.log('Saved theme:', savedTheme);
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        console.log('Dark mode applied from localStorage');
        
        // Update theme toggle UI if it exists
        setTimeout(() => {
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) {
                const icon = themeToggle.querySelector('i');
                const text = themeToggle.querySelector('span');
                
                if (icon && text) {
                    icon.className = 'fas fa-sun';
                    text.textContent = 'Mode Terang';
                    console.log('Theme toggle UI updated for dark mode');
                }
            }
        }, 50);
    }
    
    console.log('Panduan initialization complete');
});

// Fallback theme toggle function
function initializeFallbackThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle && !themeToggle.hasAttribute('data-initialized')) {
        console.log('Initializing fallback theme toggle');
        themeToggle.setAttribute('data-initialized', 'true');
        
        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Fallback theme toggle clicked');
            
            const isDarkMode = document.body.classList.toggle('dark-mode');
            const icon = this.querySelector('i');
            const text = this.querySelector('span');
            
            if (isDarkMode) {
                icon.className = 'fas fa-sun';
                text.textContent = 'Mode Terang';
                localStorage.setItem('theme', 'dark');
                console.log('Switched to dark mode');
            } else {
                icon.className = 'fas fa-moon';
                text.textContent = 'Mode Gelap';
                localStorage.setItem('theme', 'light');
                console.log('Switched to light mode');
            }
        });
        
        // Load saved theme for fallback
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            const icon = themeToggle.querySelector('i');
            const text = themeToggle.querySelector('span');
            
            if (icon && text) {
                icon.className = 'fas fa-sun';
                text.textContent = 'Mode Terang';
                console.log('Dark mode loaded from localStorage (fallback)');
            }
        }
    }
}

// Export for global access
window.PanduanManager = PanduanManager;