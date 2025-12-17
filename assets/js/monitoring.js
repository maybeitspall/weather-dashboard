// ====================== //
// MONITORING SPECIFIC    //
// ====================== //

class MonitoringController {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupInputMethodTabs();
        this.setupAnalyzeButton();
        this.setupActionButtons();
        this.loadDetectionHistory();
        this.updateDetectionStats();
        this.setupImageUpload();
        this.setupEnhancedUpload();
    }
    
    setupInputMethodTabs() {
        const methodBtns = document.querySelectorAll('.method-btn');
        const uploadArea = document.getElementById('uploadArea');
        const cameraArea = document.getElementById('cameraArea');
        const historyArea = document.getElementById('historyArea');
        
        methodBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const method = btn.dataset.method;
                
                // Update active tab
                methodBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Show corresponding area
                if (uploadArea) uploadArea.classList.remove('active');
                if (cameraArea) cameraArea.classList.remove('active');
                if (historyArea) historyArea.classList.remove('active');
                
                if (method === 'upload' && uploadArea) {
                    uploadArea.classList.add('active');
                } else if (method === 'camera' && cameraArea) {
                    cameraArea.classList.add('active');
                } else if (method === 'history' && historyArea) {
                    historyArea.classList.add('active');
                    this.loadDetectionHistory();
                }
            });
        });
    }
    
    setupAnalyzeButton() {
        const analyzeBtn = document.getElementById('analyzeBtn');
        const resultsSection = document.getElementById('resultsSection');
        
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => {
                // Simulate analysis process
                analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menganalisis...';
                analyzeBtn.disabled = true;
                
                setTimeout(() => {
                    // Show results
                    if (resultsSection) {
                        resultsSection.style.display = 'block';
                        resultsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                    
                    analyzeBtn.innerHTML = '<i class="fas fa-robot"></i> Analisis dengan AI';
                    analyzeBtn.disabled = false;
                    
                    // Save to history and update stats
                    this.saveDetectionToHistory();
                    this.updateDetectionStats();
                }, 2000);
            });
        }
    }
    
    setupActionButtons() {
        const saveResultBtn = document.getElementById('saveResultBtn');
        const shareResultBtn = document.getElementById('shareResultBtn');
        const newDetectionBtn = document.getElementById('newDetectionBtn');
        const printResultBtn = document.getElementById('printResultBtn');
        
        if (saveResultBtn) {
            saveResultBtn.addEventListener('click', () => {
                if (window.appController) {
                    window.appController.showNotification('Hasil deteksi berhasil disimpan ke riwayat!', 'success');
                }
            });
        }
        
        if (shareResultBtn) {
            shareResultBtn.addEventListener('click', () => {
                if (window.appController) {
                    window.appController.showNotification('Fitur berbagi akan segera tersedia!', 'info');
                }
            });
        }
        
        if (newDetectionBtn) {
            newDetectionBtn.addEventListener('click', () => {
                const resultsSection = document.getElementById('resultsSection');
                if (resultsSection) {
                    resultsSection.style.display = 'none';
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                // Reset to upload tab
                const firstMethodBtn = document.querySelector('.method-btn');
                if (firstMethodBtn) firstMethodBtn.click();
            });
        }
        
        if (printResultBtn) {
            printResultBtn.addEventListener('click', () => {
                window.print();
            });
        }
    }
    
    saveDetectionToHistory() {
        const detections = JSON.parse(localStorage.getItem('detections')) || [];
        
        const newDetection = {
            id: Date.now(),
            disease: 'Penyakit Budok',
            severity: 'high',
            accuracy: '92',
            status: 'sakit',
            penyakit: 'Penyakit Budok',
            tanggal: new Date().toISOString(),
            date: new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            location: 'Blok A, Desa Teuladan',
            recommendations: [
                'Isolasi tanaman yang terinfeksi',
                'Aplikasi fungisida setiap 7 hari',
                'Pemangkasan bagian terinfeksi',
                'Pengaturan irigasi yang tepat'
            ]
        };
        
        detections.unshift(newDetection);
        localStorage.setItem('detections', JSON.stringify(detections));
    }
    
    setupEnhancedUpload() {
        const uploadBtn = document.getElementById('uploadBtn');
        const fileInput = document.getElementById('fileInput');
        const uploadArea = document.getElementById('uploadArea');
        
        if (uploadBtn && fileInput && uploadArea) {
            uploadBtn.addEventListener('click', () => fileInput.click());
            
            fileInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    this.handleImageFile(e.target.files[0]);
                }
            });
            
            // Drag and drop functionality
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                uploadArea.addEventListener(eventName, this.preventDefaults, false);
            });
            
            ['dragenter', 'dragover'].forEach(eventName => {
                uploadArea.addEventListener(eventName, () => uploadArea.classList.add('highlight'), false);
            });
            
            ['dragleave', 'drop'].forEach(eventName => {
                uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('highlight'), false);
            });
            
            uploadArea.addEventListener('drop', (e) => {
                const dt = e.dataTransfer;
                const files = dt.files;
                
                if (files.length && files[0].type.startsWith('image/')) {
                    fileInput.files = files;
                    this.handleImageFile(files[0]);
                } else {
                    if (window.appController) {
                        window.appController.showNotification('Silakan unggah file gambar yang valid.', 'warning');
                    }
                }
            }, false);
        }
    }
    
    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    handleImageFile(file) {
        const uploadArea = document.getElementById('uploadArea');
        if (!uploadArea) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadArea.innerHTML = `
                <div class="upload-preview">
                    <img src="${e.target.result}" alt="Preview">
                    <div class="preview-actions">
                        <button class="btn btn-secondary" id="changePhotoBtn">
                            <i class="fas fa-exchange-alt"></i>
                            Ganti Foto
                        </button>
                        <button class="btn btn-success" id="usePhotoBtn">
                            <i class="fas fa-check"></i>
                            Gunakan Foto Ini
                        </button>
                    </div>
                </div>
            `;
            
            document.getElementById('changePhotoBtn')?.addEventListener('click', () => this.resetUploadArea());
            document.getElementById('usePhotoBtn')?.addEventListener('click', () => {
                const analyzeBtn = document.getElementById('analyzeBtn');
                if (analyzeBtn) analyzeBtn.disabled = false;
            });
        };
        reader.readAsDataURL(file);
    }
    
    resetUploadArea() {
        const uploadArea = document.getElementById('uploadArea');
        if (!uploadArea) return;
        
        uploadArea.innerHTML = `
            <div class="upload-content">
                <div class="upload-icon">
                    <i class="fas fa-cloud-upload-alt"></i>
                </div>
                <h3>Seret & Lepas Foto di Sini</h3>
                <p>atau</p>
                <input type="file" id="fileInput" accept="image/*" hidden>
                <button class="btn btn-primary" id="uploadBtn">
                    <i class="fas fa-folder-open"></i>
                    Pilih dari Galeri
                </button>
                <p class="upload-tips">
                    <i class="fas fa-info-circle"></i>
                    <strong>Tips:</strong> Pastikan foto fokus, pencahayaan cukup, dan hanya menampilkan daun yang terkena penyakit
                </p>
            </div>
        `;
        
        // Re-setup upload functionality
        this.setupEnhancedUpload();
    }
    
    loadDetectionHistory() {
        const detections = JSON.parse(localStorage.getItem('detections')) || [];
        const historyContainer = document.getElementById('detectionHistory');
        
        if (!historyContainer) return;
        
        if (detections.length === 0) {
            historyContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-camera"></i>
                    <h3>Belum Ada Riwayat Deteksi</h3>
                    <p>Upload foto tanaman untuk memulai deteksi penyakit</p>
                </div>
            `;
            return;
        }
        
        historyContainer.innerHTML = '';
        detections.slice(-5).reverse().forEach(detection => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const statusClass = detection.status === 'sehat' ? 'success' : 'warning';
            
            historyItem.innerHTML = `
                <div class="history-image">
                    <img src="${detection.image || '../assets/images/nilam.png'}" alt="Deteksi">
                </div>
                <div class="history-content">
                    <h4>${detection.penyakit || 'Hasil Deteksi'}</h4>
                    <p class="status ${statusClass}">${detection.status || 'Unknown'}</p>
                    <span class="date">${new Date(detection.tanggal).toLocaleDateString('id-ID')}</span>
                </div>
            `;
            
            historyContainer.appendChild(historyItem);
        });
    }
    
    updateDetectionStats() {
        const detections = JSON.parse(localStorage.getItem('detections')) || [];
        
        const totalDetections = detections.length;
        const healthyCount = detections.filter(d => d.status === 'sehat').length;
        const diseaseCount = detections.filter(d => d.status === 'sakit').length;
        const healthyPercent = detections.length > 0 ? Math.max(85 - (detections.length * 2), 50) : 85;
        
        // Update stat elements if they exist
        const totalElement = document.getElementById('totalDetections');
        const healthyElement = document.getElementById('healthyDetections');
        const diseaseElement = document.getElementById('diseaseDetections');
        
        if (totalElement) totalElement.textContent = totalDetections;
        if (healthyElement) healthyElement.textContent = healthyCount;
        if (diseaseElement) diseaseElement.textContent = diseaseCount;
        
        // Update stat values in the stats grid
        const statValues = document.querySelectorAll('.stat-value');
        if (statValues.length >= 4) {
            statValues[0].textContent = `${healthyPercent}%`; // Healthy percentage
            statValues[1].textContent = `${100 - healthyPercent}%`; // Disease percentage
            statValues[2].textContent = totalDetections; // Total detections
            // statValues[3] is accuracy, keep as 95%
        }
        
        // Update footer info
        const detectionInfo = document.getElementById('detectionInfo');
        const lastDetection = document.getElementById('lastDetection');
        
        if (detectionInfo) {
            detectionInfo.textContent = `Total Deteksi: ${totalDetections} | Akurasi: 95%`;
        }
        
        if (lastDetection && detections.length > 0) {
            lastDetection.textContent = `Deteksi Terakhir: ${detections[0].date}`;
        }
    }
    
    setupImageUpload() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('imageInput');
        const previewContainer = document.getElementById('imagePreview');
        
        if (!uploadArea || !fileInput) return;
        
        // Click to upload
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });
        
        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileUpload(files[0]);
            }
        });
        
        // File input change
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileUpload(e.target.files[0]);
            }
        });
    }
    
    handleFileUpload(file) {
        if (!file.type.startsWith('image/')) {
            if (window.appController) {
                window.appController.showNotification('Please select an image file', 'error');
            }
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewContainer = document.getElementById('imagePreview');
            if (previewContainer) {
                previewContainer.innerHTML = `
                    <img src="${e.target.result}" alt="Preview" style="max-width: 100%; height: auto; border-radius: 8px;">
                    <button type="button" class="btn btn-secondary mt-2" onclick="this.parentElement.innerHTML=''">
                        <i class="fas fa-times"></i> Hapus
                    </button>
                `;
            }
            
            // Enable detect button
            const detectBtn = document.getElementById('detectBtn');
            if (detectBtn) {
                detectBtn.disabled = false;
            }
        };
        reader.readAsDataURL(file);
    }
    
    setupDetectionForm() {
        const detectBtn = document.getElementById('detectBtn');
        if (!detectBtn) return;
        
        detectBtn.addEventListener('click', () => {
            this.performDetection();
        });
    }
    
    performDetection() {
        const previewContainer = document.getElementById('imagePreview');
        const resultContainer = document.getElementById('detectionResult');
        
        if (!previewContainer.innerHTML.trim()) {
            if (window.appController) {
                window.appController.showNotification('Silakan upload gambar terlebih dahulu', 'warning');
            }
            return;
        }
        
        // Simulate detection process
        if (window.appController) {
            window.appController.showNotification('Memproses deteksi...', 'info');
        }
        
        setTimeout(() => {
            // Simulate random detection result
            const diseases = [
                { name: 'Tanaman Sehat', status: 'sehat', confidence: 95 },
                { name: 'Busuk Batang', status: 'sakit', confidence: 87 },
                { name: 'Layu Bakteri', status: 'sakit', confidence: 92 },
                { name: 'Bercak Daun', status: 'sakit', confidence: 78 }
            ];
            
            const result = diseases[Math.floor(Math.random() * diseases.length)];
            
            // Save to localStorage
            const detections = JSON.parse(localStorage.getItem('detections')) || [];
            const newDetection = {
                id: Date.now(),
                tanggal: new Date().toISOString(),
                penyakit: result.name,
                status: result.status,
                confidence: result.confidence,
                image: previewContainer.querySelector('img')?.src
            };
            
            detections.push(newDetection);
            localStorage.setItem('detections', JSON.stringify(detections));
            
            // Show result
            if (resultContainer) {
                const statusClass = result.status === 'sehat' ? 'success' : 'danger';
                resultContainer.innerHTML = `
                    <div class="alert alert-${statusClass}">
                        <h4><i class="fas fa-${result.status === 'sehat' ? 'check-circle' : 'exclamation-triangle'}"></i> ${result.name}</h4>
                        <p>Confidence: ${result.confidence}%</p>
                        ${result.status === 'sakit' ? '<p><strong>Rekomendasi:</strong> Segera lakukan tindakan perawatan sesuai panduan.</p>' : ''}
                    </div>
                `;
            }
            
            // Update stats and history
            this.updateDetectionStats();
            this.loadDetectionHistory();
            
            if (window.appController) {
                window.appController.showNotification('Deteksi selesai!', 'success');
            }
        }, 2000);
    }
}

// Global function for viewing detection details (called from HTML)
function viewDetection(index) {
    const detections = JSON.parse(localStorage.getItem('detections')) || [];
    if (detections[index]) {
        const detection = detections[index];
        const message = `Detail Deteksi:

Penyakit: ${detection.disease}
Keparahan: ${detection.severity === 'high' ? 'Parah' : 'Sedang'}
Akurasi: ${detection.accuracy}%
Tanggal: ${detection.date}
Lokasi: ${detection.location}`;
        
        if (window.appController) {
            window.appController.showNotification('Detail deteksi ditampilkan', 'info');
        }
        alert(message);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.monitoringController = new MonitoringController();
});