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
        this.setupHistoryControls();
        
        // Initialize accordion functionality with multiple attempts
        this.initAccordionWithRetry();
    }
    
    initAccordionWithRetry() {
        let attempts = 0;
        const maxAttempts = 10; // Increased attempts
        
        const tryInit = () => {
            attempts++;
            console.log(`Accordion init attempt ${attempts}`);
            
            const accordionHeaders = document.querySelectorAll('.disease-header');
            if (accordionHeaders.length > 0) {
                console.log(`Found ${accordionHeaders.length} accordion headers, initializing...`);
                initializeAccordion();
            } else if (attempts < maxAttempts) {
                console.log('No accordion headers found, retrying in 300ms...');
                setTimeout(tryInit, 300);
            } else {
                console.log('Failed to find accordion headers after maximum attempts');
                // Try one more time with a longer delay
                setTimeout(() => {
                    const headers = document.querySelectorAll('.disease-header');
                    if (headers.length > 0) {
                        console.log('Final attempt successful, initializing accordion...');
                        initializeAccordion();
                    }
                }, 1000);
            }
        };
        
        // Start immediately and also try after page load
        setTimeout(tryInit, 100);
        
        // Also try after window load event
        if (document.readyState === 'loading') {
            window.addEventListener('load', () => {
                setTimeout(tryInit, 200);
            });
        }
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
        
        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            if (window.appController) {
                window.appController.showNotification('Ukuran file terlalu besar. Maksimal 5MB.', 'error');
            }
            return;
        }
        
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            if (window.appController) {
                window.appController.showNotification('Format file tidak didukung. Gunakan JPG, PNG, atau WebP.', 'error');
            }
            return;
        }
        
        const reader = new FileReader();
        reader.onerror = () => {
            if (window.appController) {
                window.appController.showNotification('Gagal membaca file. Coba lagi.', 'error');
            }
        };
        
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
            this.updateClearButtonVisibility();
            return;
        }
        
        historyContainer.innerHTML = '';
        detections.slice(-5).reverse().forEach((detection, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const statusClass = detection.status === 'sehat' ? 'success' : 'warning';
            const actualIndex = detections.length - 1 - index; // Calculate actual index in original array
            
            historyItem.innerHTML = `
                <div class="history-image">
                    <img src="${detection.image || '../assets/images/nilam.png'}" alt="Deteksi">
                </div>
                <div class="history-content">
                    <h4>${detection.penyakit || 'Hasil Deteksi'}</h4>
                    <p class="status ${statusClass}">${detection.status || 'Unknown'}</p>
                    <span class="date">${new Date(detection.tanggal).toLocaleDateString('id-ID')}</span>
                </div>
                <button class="history-item-delete" title="Hapus riwayat ini" data-index="${actualIndex}" data-name="${detection.penyakit || 'Hasil Deteksi'}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            // Add event listener for individual delete button
            const deleteBtn = historyItem.querySelector('.history-item-delete');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event bubbling
                const itemIndex = parseInt(deleteBtn.dataset.index);
                const itemName = deleteBtn.dataset.name;
                this.showDeleteItemConfirmation(itemIndex, itemName);
            });
            
            historyContainer.appendChild(historyItem);
        });
        
        // Update clear button visibility
        this.updateClearButtonVisibility();
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
        
        if (!previewContainer || !previewContainer.innerHTML.trim()) {
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
    
    // ====================== //
    // HISTORY CONTROLS       //
    // ====================== //
    
    setupHistoryControls() {
        // Setup clear all history button
        const clearHistoryBtn = document.getElementById('clearHistoryBtn');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => {
                this.showClearHistoryConfirmation();
            });
        }
        
        // Update clear button visibility when history loads
        this.updateClearButtonVisibility();
    }
    
    updateClearButtonVisibility() {
        const detections = JSON.parse(localStorage.getItem('detections')) || [];
        const clearHistoryBtn = document.getElementById('clearHistoryBtn');
        
        if (clearHistoryBtn) {
            if (detections.length > 0) {
                clearHistoryBtn.style.display = 'block';
            } else {
                clearHistoryBtn.style.display = 'none';
            }
        }
    }
    
    showClearHistoryConfirmation() {
        // Create confirmation modal
        const modal = document.createElement('div');
        modal.className = 'confirmation-modal';
        modal.innerHTML = `
            <div class="confirmation-content">
                <h3><i class="fas fa-exclamation-triangle"></i> Konfirmasi Hapus</h3>
                <p>Apakah Anda yakin ingin menghapus semua riwayat deteksi? Tindakan ini tidak dapat dibatalkan.</p>
                <div class="confirmation-buttons">
                    <button class="btn btn-cancel" id="cancelClear">
                        <i class="fas fa-times"></i> Batal
                    </button>
                    <button class="btn btn-danger" id="confirmClear">
                        <i class="fas fa-trash"></i> Hapus Semua
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Show modal with animation
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // Handle cancel
        const cancelBtn = modal.querySelector('#cancelClear');
        cancelBtn.addEventListener('click', () => {
            this.hideConfirmationModal(modal);
        });
        
        // Handle confirm
        const confirmBtn = modal.querySelector('#confirmClear');
        confirmBtn.addEventListener('click', () => {
            this.clearAllHistory();
            this.hideConfirmationModal(modal);
        });
        
        // Handle click outside modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideConfirmationModal(modal);
            }
        });
        
        // Handle escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                this.hideConfirmationModal(modal);
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }
    
    hideConfirmationModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
    
    clearAllHistory() {
        // Clear localStorage
        localStorage.removeItem('detections');
        
        // Update UI
        this.loadDetectionHistory();
        this.updateDetectionStats();
        this.updateClearButtonVisibility();
        
        // Show success notification
        if (window.appController) {
            window.appController.showNotification('Semua riwayat deteksi berhasil dihapus!', 'success');
        }
    }
    
    deleteHistoryItem(index) {
        const detections = JSON.parse(localStorage.getItem('detections')) || [];
        
        if (index >= 0 && index < detections.length) {
            // Remove item from array
            detections.splice(index, 1);
            
            // Update localStorage
            localStorage.setItem('detections', JSON.stringify(detections));
            
            // Update UI
            this.loadDetectionHistory();
            this.updateDetectionStats();
            this.updateClearButtonVisibility();
            
            // Show success notification
            if (window.appController) {
                window.appController.showNotification('Riwayat deteksi berhasil dihapus!', 'success');
            }
        }
    }
    
    showDeleteItemConfirmation(index, itemName) {
        // Create confirmation modal for single item
        const modal = document.createElement('div');
        modal.className = 'confirmation-modal';
        modal.innerHTML = `
            <div class="confirmation-content">
                <h3><i class="fas fa-exclamation-triangle"></i> Konfirmasi Hapus</h3>
                <p>Apakah Anda yakin ingin menghapus riwayat deteksi "<strong>${itemName}</strong>"?</p>
                <div class="confirmation-buttons">
                    <button class="btn btn-cancel" id="cancelDelete">
                        <i class="fas fa-times"></i> Batal
                    </button>
                    <button class="btn btn-danger" id="confirmDelete">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Show modal with animation
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // Handle cancel
        const cancelBtn = modal.querySelector('#cancelDelete');
        cancelBtn.addEventListener('click', () => {
            this.hideConfirmationModal(modal);
        });
        
        // Handle confirm
        const confirmBtn = modal.querySelector('#confirmDelete');
        confirmBtn.addEventListener('click', () => {
            this.deleteHistoryItem(index);
            this.hideConfirmationModal(modal);
        });
        
        // Handle click outside modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideConfirmationModal(modal);
            }
        });
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

// Also initialize on window load as backup
window.addEventListener('load', () => {
    if (!window.monitoringController) {
        console.log('Backup initialization triggered');
        window.monitoringController = new MonitoringController();
    } else {
        // Re-initialize accordion if needed
        setTimeout(() => {
            const headers = document.querySelectorAll('.disease-header');
            if (headers.length > 0 && !headers[0].classList.contains('accordion-initialized')) {
                console.log('Re-initializing accordion on window load');
                initializeAccordion();
            }
        }, 500);
    }
    
    // Run auto-fix after everything is loaded
    setTimeout(() => {
        autoFixAccordion();
    }, 1000);
});

// Run periodic checks for accordion health
setInterval(() => {
    if (window.location.pathname.includes('monitoring')) {
        const headers = document.querySelectorAll('.disease-header');
        const uninitializedHeaders = Array.from(headers).filter(h => 
            !h.classList.contains('accordion-initialized')
        );
        
        if (uninitializedHeaders.length > 0) {
            console.log('Found uninitialized headers, auto-fixing...');
            autoFixAccordion();
        }
    }
}, 5000); // Check every 5 seconds

// ====================== //
// ACCORDION FUNCTIONALITY //
// ====================== //

// Global function for accordion toggle
function toggleAccordion(header) {
    try {
        console.log('toggleAccordion called'); // Debug log
        const accordionItem = header.closest('.accordion-item');
        if (!accordionItem) {
            console.log('No accordion item found'); // Debug log
            return;
        }
        
        const isActive = accordionItem.classList.contains('active');
        console.log('Is active:', isActive); // Debug log
        
        // Close all other accordion items in the same container
        const container = accordionItem.closest('.disease-list, .pest-list');
        if (container) {
            const allItems = container.querySelectorAll('.accordion-item');
            allItems.forEach(item => {
                if (item !== accordionItem) {
                    item.classList.remove('active');
                }
            });
        }
        
        // Toggle current item
        if (isActive) {
            accordionItem.classList.remove('active');
        } else {
            accordionItem.classList.add('active');
        }
        
        console.log('Accordion toggled, new state:', accordionItem.classList.contains('active')); // Debug log
        
        // Trigger a custom event for debugging
        const event = new CustomEvent('accordionToggled', {
            detail: { 
                element: accordionItem, 
                isActive: accordionItem.classList.contains('active') 
            }
        });
        document.dispatchEvent(event);
        
    } catch (error) {
        console.error('Error in toggleAccordion:', error);
    }
}

// Initialize accordion functionality
function initializeAccordion() {
    console.log('Initializing accordion...'); // Debug log
    
    // Wait a bit more for DOM to be fully ready
    setTimeout(() => {
        const accordionHeaders = document.querySelectorAll('.disease-header');
        console.log('Found accordion headers:', accordionHeaders.length); // Debug log
        
        if (accordionHeaders.length === 0) {
            console.log('No accordion headers found, retrying in 500ms...');
            setTimeout(initializeAccordion, 500);
            return;
        }
        
        accordionHeaders.forEach((header, index) => {
            console.log('Setting up header', index); // Debug log
            
            // Remove any existing event listeners and onclick attributes
            header.removeAttribute('onclick');
            
            // Create a completely new element to avoid event conflicts
            const newHeader = header.cloneNode(true);
            header.parentNode.replaceChild(newHeader, header);
            
            // Check if we're on mobile (accordion should work) or desktop (no accordion)
            const isMobile = window.innerWidth <= 768;
            
            if (isMobile) {
                // Add accordion functionality on mobile with multiple event types
                const handleAccordionClick = function(e) {
                    try {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        console.log('Header clicked:', index, 'Event type:', e.type); // Debug log
                        
                        // Add visual feedback
                        this.style.transform = 'scale(0.98)';
                        setTimeout(() => {
                            this.style.transform = '';
                        }, 150);
                        
                        toggleAccordion(this);
                    } catch (error) {
                        console.error('Error in accordion click handler:', error);
                    }
                };
                
                // Add both click and touchstart events for better mobile support
                newHeader.addEventListener('click', handleAccordionClick, { 
                    passive: false, 
                    capture: true 
                });
                
                // Only add touchstart if it's a touch device
                if ('ontouchstart' in window) {
                    newHeader.addEventListener('touchstart', handleAccordionClick, { 
                        passive: false, 
                        capture: true 
                    });
                }
                
                // Add cursor pointer style and touch-friendly styling
                newHeader.style.cursor = 'pointer';
                newHeader.style.touchAction = 'manipulation';
                newHeader.style.userSelect = 'none';
                newHeader.style.webkitTouchCallout = 'none';
                newHeader.style.webkitUserSelect = 'none';
                
                // Ensure minimum touch target size
                newHeader.style.minHeight = '44px';
                newHeader.style.display = 'flex';
                newHeader.style.alignItems = 'center';
                
                // Add data attribute for debugging
                newHeader.setAttribute('data-accordion-enabled', 'true');
                
            } else {
                // On desktop, remove cursor pointer and ensure content is always visible
                newHeader.style.cursor = 'default';
                const accordionItem = newHeader.closest('.accordion-item');
                if (accordionItem) {
                    accordionItem.classList.add('active'); // Always show content on desktop
                }
                
                newHeader.setAttribute('data-accordion-enabled', 'false');
            }
            
            // Add a test class to verify the element is being processed
            newHeader.classList.add('accordion-initialized');
        });
        
        // Listen for window resize to re-initialize if needed
        window.addEventListener('resize', debounce(() => {
            console.log('Window resized, re-initializing accordion...');
            initializeAccordion();
        }, 250));
        
        // Add global event listener for debugging
        document.addEventListener('accordionToggled', (e) => {
            console.log('Accordion toggled event:', e.detail);
        });
        
        console.log('Accordion initialization complete!');
    }, 100);
}

// Debounce function to limit resize event calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Test function to manually check accordion
function testAccordion() {
    console.log('=== ACCORDION TEST ===');
    
    const accordionItems = document.querySelectorAll('.accordion-item');
    console.log('Accordion items found:', accordionItems.length);
    
    const accordionHeaders = document.querySelectorAll('.disease-header');
    console.log('Accordion headers found:', accordionHeaders.length);
    
    const diseaseContent = document.querySelectorAll('.disease-content');
    console.log('Disease content found:', diseaseContent.length);
    
    if (accordionHeaders.length > 0) {
        console.log('Testing first accordion header...');
        const firstHeader = accordionHeaders[0];
        console.log('First header element:', firstHeader);
        console.log('First header classes:', firstHeader.className);
        console.log('First header styles:', {
            cursor: firstHeader.style.cursor,
            touchAction: firstHeader.style.touchAction,
            userSelect: firstHeader.style.userSelect
        });
        
        // Test manual toggle
        const firstItem = firstHeader.closest('.accordion-item');
        if (firstItem) {
            console.log('Toggling first item...');
            firstItem.classList.toggle('active');
            console.log('First item is now active:', firstItem.classList.contains('active'));
        }
        
        // Test event listener
        console.log('Testing click event...');
        firstHeader.click();
    }
    
    console.log('=== END TEST ===');
}

// Force accordion initialization function
function forceInitAccordion() {
    console.log('=== FORCE INIT ACCORDION ===');
    
    // Clear any existing event listeners
    const headers = document.querySelectorAll('.disease-header');
    headers.forEach(header => {
        header.classList.remove('accordion-initialized');
    });
    
    initializeAccordion();
    console.log('=== FORCE INIT COMPLETE ===');
}

// Diagnostic function to check accordion health
function diagnoseAccordion() {
    console.log('=== ACCORDION DIAGNOSIS ===');
    
    const accordionItems = document.querySelectorAll('.accordion-item');
    const accordionHeaders = document.querySelectorAll('.disease-header');
    const diseaseContent = document.querySelectorAll('.disease-content');
    
    console.log('Accordion items:', accordionItems.length);
    console.log('Accordion headers:', accordionHeaders.length);
    console.log('Disease content:', diseaseContent.length);
    
    // Check each header
    accordionHeaders.forEach((header, index) => {
        const isInitialized = header.classList.contains('accordion-initialized');
        const hasAccordionEnabled = header.getAttribute('data-accordion-enabled');
        const hasEventListeners = header.onclick !== null;
        
        console.log(`Header ${index}:`, {
            initialized: isInitialized,
            accordionEnabled: hasAccordionEnabled,
            hasOnclick: hasEventListeners,
            cursor: header.style.cursor,
            touchAction: header.style.touchAction
        });
    });
    
    // Check for common issues
    const issues = [];
    
    if (accordionItems.length !== accordionHeaders.length) {
        issues.push('Mismatch between accordion items and headers');
    }
    
    if (accordionHeaders.length === 0) {
        issues.push('No accordion headers found');
    }
    
    const uninitializedHeaders = Array.from(accordionHeaders).filter(h => 
        !h.classList.contains('accordion-initialized')
    );
    
    if (uninitializedHeaders.length > 0) {
        issues.push(`${uninitializedHeaders.length} headers not initialized`);
    }
    
    if (issues.length > 0) {
        console.warn('Issues found:', issues);
        console.log('Attempting to fix...');
        forceInitAccordion();
    } else {
        console.log('No issues found');
    }
    
    console.log('=== DIAGNOSIS COMPLETE ===');
    return issues;
}

// Auto-fix function that runs periodically
function autoFixAccordion() {
    const issues = diagnoseAccordion();
    if (issues.length > 0) {
        console.log('Auto-fixing accordion issues...');
        setTimeout(() => {
            forceInitAccordion();
        }, 100);
    }
}

// Make test functions available globally
window.testAccordion = testAccordion;
window.forceInitAccordion = forceInitAccordion;
window.diagnoseAccordion = diagnoseAccordion;
window.autoFixAccordion = autoFixAccordion;