// production.js - Mengelola data produksi dengan perhitungan total yang benar

document.addEventListener("DOMContentLoaded", function () {
  const productionForm = document.getElementById("productionForm");
  const riwayatProduksiTbody = document.querySelector("#riwayatProduksi tbody");
  const jumlahProduksiInput = document.getElementById("jumlahProduksi");
  const hargaJualInput = document.getElementById("hargaJual");
  const totalPendapatanDisplay = document.getElementById(
    "totalPendapatanDisplay"
  );

  // Set tanggal default ke hari ini
  document.getElementById("tanggal").valueAsDate = new Date();

  // Event listener untuk menghitung total pendapatan saat input berubah
  jumlahProduksiInput.addEventListener("input", updateTotalPendapatan);
  hargaJualInput.addEventListener("input", updateTotalPendapatan);

  // Memuat riwayat produksi saat halaman dimuat
  loadRiwayatProduksi();

  // Event listener untuk form input produksi
  productionForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const tanggal = document.getElementById("tanggal").value;
    const jenisProduk = document.getElementById("jenisProduk").value;
    const jumlahProduksi = parseFloat(
      document.getElementById("jumlahProduksi").value
    );
    const hargaJual = parseInt(document.getElementById("hargaJual").value);
    const kualitas = document.getElementById("kualitas").value;
    const keterangan = document.getElementById("keterangan").value;

    // Validasi form
    if (
      !tanggal ||
      !jenisProduk ||
      isNaN(jumlahProduksi) ||
      isNaN(hargaJual) ||
      !kualitas
    ) {
      alert("Harap isi semua field yang wajib diisi.");
      return;
    }

    // Hitung total pendapatan
    const totalPendapatan = jumlahProduksi * hargaJual;

    // Simpan data produksi
    simpanDataProduksi(
      tanggal,
      jenisProduk,
      jumlahProduksi,
      hargaJual,
      totalPendapatan,
      kualitas,
      keterangan
    );

    // Reset form
    productionForm.reset();
    document.getElementById("tanggal").valueAsDate = new Date();
    updateTotalPendapatan(); // Reset display total

    // Muat ulang riwayat
    loadRiwayatProduksi();

    // Tampilkan notifikasi
    alert("Data produksi berhasil disimpan!");
  });

  // Fungsi untuk memperbarui display total pendapatan
  function updateTotalPendapatan() {
    const jumlahProduksi = parseFloat(jumlahProduksiInput.value) || 0;
    const hargaJual = parseInt(hargaJualInput.value) || 0;
    const totalPendapatan = jumlahProduksi * hargaJual;

    totalPendapatanDisplay.textContent = formatRupiah(totalPendapatan);
  }

  function simpanDataProduksi(
    tanggal,
    jenisProduk,
    jumlahProduksi,
    hargaJual,
    totalPendapatan,
    kualitas,
    keterangan
  ) {
    // Ambil data produksi yang sudah ada dari localStorage
    let dataProduksi = JSON.parse(localStorage.getItem("dataProduksi")) || [];

    // Generate ID unik
    const id = Date.now().toString();

    // Tambahkan data baru
    dataProduksi.push({
      id: id,
      tanggal: tanggal,
      jenisProduk: jenisProduk,
      jumlahProduksi: jumlahProduksi,
      hargaJual: hargaJual,
      totalPendapatan: totalPendapatan,
      kualitas: kualitas,
      keterangan: keterangan,
    });

    // Simpan kembali ke localStorage
    localStorage.setItem("dataProduksi", JSON.stringify(dataProduksi));
  }

  function loadRiwayatProduksi() {
    // Ambil data produksi dari localStorage
    const dataProduksi = JSON.parse(localStorage.getItem("dataProduksi")) || [];

    // Kosongkan tabel
    riwayatProduksiTbody.innerHTML = "";

    // Jika tidak ada data, tampilkan pesan
    if (dataProduksi.length === 0) {
      riwayatProduksiTbody.innerHTML =
        '<tr><td colspan="7" class="empty-state">Belum ada data produksi.</td></tr>';
      return;
    }

    // Urutkan data berdasarkan tanggal (terbaru di atas)
    dataProduksi.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    // Isi tabel dengan data
    dataProduksi.forEach((data) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${formatTanggal(data.tanggal)}</td>
                <td>${getNamaProduk(data.jenisProduk)}</td>
                <td>${data.jumlahProduksi} kg</td>
                <td>${formatRupiah(data.hargaJual)}</td>
                <td>${formatRupiah(data.totalPendapatan)}</td>
                <td><span class="badge kualitas-${data.kualitas}">${
        data.kualitas
      }</span></td>
                <td>
                    <button class="btn-danger" onclick="hapusDataProduksi('${
                      data.id
                    }')">Hapus</button>
                </td>
            `;
      riwayatProduksiTbody.appendChild(row);
    });
  }

  function getNamaProduk(kodeProduk) {
    const produkMap = {
      daun_segar: "Daun Segar",
      minyak_nilam: "Minyak Nilam",
      sabut_nilam: "Sabut Nilam",
      bibit: "Bibit",
    };
    return produkMap[kodeProduk] || kodeProduk;
  }

  function formatTanggal(tanggalString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(tanggalString).toLocaleDateString("id-ID", options);
  }

  function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  }

  // Fungsi global untuk menghapus data
  window.hapusDataProduksi = function (id) {
    if (confirm("Apakah Anda yakin ingin menghapus data produksi ini?")) {
      let dataProduksi = JSON.parse(localStorage.getItem("dataProduksi")) || [];
      dataProduksi = dataProduksi.filter((data) => data.id !== id);
      localStorage.setItem("dataProduksi", JSON.stringify(dataProduksi));
      loadRiwayatProduksi();
    }
  };
});
