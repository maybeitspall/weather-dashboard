// Logika upload foto dan kamera untuk halaman monitoring
document.addEventListener("DOMContentLoaded", function () {
  // Elemen DOM
  const uploadArea = document.getElementById("uploadArea");
  const cameraArea = document.getElementById("cameraArea");
  const fileInput = document.getElementById("fileInput");
  const uploadBtn = document.getElementById("uploadBtn");
  const analyzeBtn = document.getElementById("analyzeBtn");
  const resultContainer = document.getElementById("resultContainer");

  // Elemen kamera
  const videoElement = document.getElementById("videoElement");
  const canvasElement = document.getElementById("canvasElement");
  const startCameraBtn = document.getElementById("startCameraBtn");
  const captureBtn = document.getElementById("captureBtn");
  const retakeBtn = document.getElementById("retakeBtn");
  const cameraResult = document.getElementById("cameraResult");
  const capturedImage = document.getElementById("capturedImage");

  // Tombol metode input
  const methodBtns = document.querySelectorAll(".method-btn");

  // Variabel global
  let stream = null;
  let currentImageFile = null;

  // Fungsi untuk mengganti metode input
  methodBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const method = this.getAttribute("data-method");

      // Hapus kelas aktif dari semua tombol
      methodBtns.forEach((b) => b.classList.remove("active"));
      // Tambah kelas aktif ke tombol yang diklik
      this.classList.add("active");

      // Tampilkan area yang sesuai
      if (method === "upload") {
        uploadArea.classList.add("active");
        cameraArea.classList.remove("active");
        stopCamera();
      } else if (method === "camera") {
        uploadArea.classList.remove("active");
        cameraArea.classList.add("active");
      }

      // Reset state saat mengganti metode
      currentImageFile = null;
    });
  });

  // ===== LOGIKA UPLOAD FILE =====

  // Event listener untuk tombol upload
  uploadBtn.addEventListener("click", () => {
    fileInput.click();
  });

  // Event listener untuk input file
  fileInput.addEventListener("change", function () {
    if (this.files && this.files[0]) {
      handleImageFile(this.files[0]);
    }
  });

  // Event listener untuk drag & drop
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    uploadArea.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ["dragenter", "dragover"].forEach((eventName) => {
    uploadArea.addEventListener(eventName, highlight, false);
  });

  ["dragleave", "drop"].forEach((eventName) => {
    uploadArea.addEventListener(eventName, unhighlight, false);
  });

  function highlight() {
    uploadArea.classList.add("highlight");
  }

  function unhighlight() {
    uploadArea.classList.remove("highlight");
  }

  uploadArea.addEventListener("drop", handleDrop, false);

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    if (files.length && files[0].type.startsWith("image/")) {
      fileInput.files = files;
      handleImageFile(files[0]);
    } else {
      alert("Silakan unggah file gambar yang valid.");
    }
  }

  // ===== LOGIKA KAMERA =====

  // Event listener untuk tombol aktifkan kamera
  startCameraBtn.addEventListener("click", startCamera);

  // Event listener untuk tombol ambil foto
  captureBtn.addEventListener("click", capturePhoto);

  // Event listener untuk tombol ambil ulang
  retakeBtn.addEventListener("click", retakePhoto);

  // Fungsi untuk memulai kamera
  async function startCamera() {
    try {
      // Hentikan kamera yang sedang berjalan (jika ada)
      if (stream) {
        stopCamera();
      }

      // Minta akses ke kamera
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Prioritaskan kamera belakang
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      // Tampilkan stream video
      videoElement.srcObject = stream;

      // Tampilkan tombol ambil foto, sembunyikan tombol aktifkan kamera
      startCameraBtn.style.display = "none";
      captureBtn.style.display = "inline-block";
    } catch (error) {
      console.error("Error mengakses kamera:", error);
      alert(
        "Tidak dapat mengakses kamera. Pastikan Anda memberikan izin akses kamera."
      );
    }
  }

  // Fungsi untuk menghentikan kamera
  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
    }
    videoElement.srcObject = null;
    startCameraBtn.style.display = "inline-block";
    captureBtn.style.display = "none";
  }

  // Fungsi untuk mengambil foto
  function capturePhoto() {
    const context = canvasElement.getContext("2d");
    const width = videoElement.videoWidth;
    const height = videoElement.videoHeight;

    // Set ukuran canvas sesuai dengan video
    canvasElement.width = width;
    canvasElement.height = height;

    // Gambar frame video ke canvas
    context.drawImage(videoElement, 0, 0, width, height);

    // Konversi canvas ke data URL
    const imageDataUrl = canvasElement.toDataURL("image/png");

    // Tampilkan hasil foto
    capturedImage.src = imageDataUrl;
    cameraResult.style.display = "block";

    // Tampilkan tombol ambil ulang
    retakeBtn.style.display = "inline-block";

    // Tampilkan dan aktifkan tombol analisis
    if (analyzeBtn) {
      analyzeBtn.style.display = "inline-block";
      analyzeBtn.disabled = false;
    }

    // Konversi data URL ke File object
    dataURLtoFile(imageDataUrl, "foto-daun-nilam.png");

    // Hentikan kamera setelah mengambil foto
    stopCamera();
  }

  // Fungsi untuk mengambil ulang foto
  function retakePhoto() {
    cameraResult.style.display = "none";
    retakeBtn.style.display = "none";
    
    // Disable analyze button until new photo is captured
    if (analyzeBtn) {
      analyzeBtn.disabled = true;
    }
    
    currentImageFile = null;
    startCamera();
  }

  // Fungsi untuk mengonversi data URL ke File object
  function dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    const file = new File([u8arr], filename, { type: mime });
    handleImageFile(file);
  }

  // ===== FUNGSI UMUM =====

  // Fungsi untuk menangani file gambar (baik dari upload maupun kamera)
  function handleImageFile(file) {
    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      alert("Silakan pilih file gambar yang valid.");
      return;
    }

    // Simpan file untuk analisis
    currentImageFile = file;

    // Tampilkan preview gambar
    const reader = new FileReader();
    reader.onload = function (e) {
      // Tampilkan preview di area yang sesuai
      if (uploadArea.classList.contains("active")) {
        uploadArea.innerHTML = `
                    <img src="${e.target.result}" style="max-width: 100%; max-height: 300px; border-radius: 4px;">
                    <p style="margin-top: 1rem;">Foto berhasil diunggah. Klik "Analisis dengan AI" untuk memproses.</p>
                    <button class="btn btn-secondary" id="changePhotoBtn">Ganti Foto</button>
                `;

        // Event listener untuk tombol ganti foto
        document
          .getElementById("changePhotoBtn")
          .addEventListener("click", function () {
            resetUploadArea();
          });
      }

      // Tampilkan tombol analisis
      analyzeBtn.style.display = "inline-block";
    };
    reader.readAsDataURL(file);
  }

  // Fungsi untuk mereset area upload
  function resetUploadArea() {
    uploadArea.innerHTML = `
            <div class="upload-icon">📷</div>
            <h3>Tarik & Lepas Foto Daun Nilam di Sini</h3>
            <p>atau</p>
            <input type="file" id="fileInput" accept="image/*" style="display: none;">
            <button class="btn" id="uploadBtn">Pilih dari Galeri</button>
            <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">
                <strong>Penting:</strong> Pastikan foto fokus dan hanya menampilkan 1-2 daun yang terkena penyakit.
            </p>
        `;

    // Re-attach event listeners
    document
      .getElementById("uploadBtn")
      .addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", function () {
      if (this.files && this.files[0]) {
        handleImageFile(this.files[0]);
      }
    });

    // Disable analyze button until new image is uploaded
    if (analyzeBtn) {
      analyzeBtn.disabled = true;
    }
    currentImageFile = null;
  }

  // Event listener untuk tombol analisis
  analyzeBtn.addEventListener("click", function () {
    if (!currentImageFile) {
      alert("Silakan pilih atau ambil foto terlebih dahulu.");
      return;
    }

    // Simulasi proses analisis
    analyzeBtn.textContent = "Menganalisis...";
    analyzeBtn.disabled = true;

    setTimeout(() => {
      // Tampilkan hasil
      resultContainer.style.display = "block";
      analyzeBtn.textContent = "Analisis dengan AI";
      analyzeBtn.disabled = false;

      // Scroll ke hasil
      resultContainer.scrollIntoView({ behavior: "smooth" });
    }, 2000);
  });

  // Hentikan kamera ketika meninggalkan halaman
  window.addEventListener("beforeunload", function () {
    stopCamera();
  });
});
