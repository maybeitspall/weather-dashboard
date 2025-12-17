// ====================== //
// PRODUCTION SPECIFIC    //
// ====================== //

class ProductionController {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupTabs();
        this.setupForms();
        this.loadProductionHistory();
        this.loadPlantsList();
    }
    
    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.dataset.tab;
                
                // Remove active class from all tabs and contents
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                this.classList.add('active');
                const targetContent = document.getElementById(tabId);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }
    
    setupForms() {
        // Production form
        const productionForm = document.getElementById('productionForm');
        if (productionForm) {
            productionForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleProductionSubmit(e);
            });
            
            // Add real-time validation
            this.setupFormValidation(productionForm);
        }
        
        // Plant form  
        const plantForm = document.getElementById('tanamanForm');
        if (plantForm) {
            plantForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePlantSubmit(e);
            });
            
            // Add real-time validation
            this.setupFormValidation(plantForm);
        }
        
        // Auto-calculate production value
        const quantityInput = document.getElementById('jumlahProduksi');
        const priceInput = document.getElementById('hargaPerKg');
        const totalInput = document.getElementById('totalPendapatan');
        
        if (quantityInput && priceInput && totalInput) {
            const calculateTotal = () => {
                const quantity = parseFloat(quantityInput.value) || 0;
                const price = parseFloat(priceInput.value) || 0;
                totalInput.value = (quantity * price).toFixed(0);
            };
            
            quantityInput.addEventListener('input', calculateTotal);
            priceInput.addEventListener('input', calculateTotal);
        }
        
        // Export data button
        const exportBtn = document.getElementById('exportDataBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }
    }
    
    exportData() {
        const productions = JSON.parse(localStorage.getItem('productions')) || [];
        const plants = JSON.parse(localStorage.getItem('plants')) || [];
        
        const exportData = {
            productions,
            plants,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `nilamtrace-data-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        if (window.appController) {
            window.appController.showNotification('Data berhasil diekspor sebagai file JSON!', 'success');
        }
    }
    
    handleProductionSubmit(e) {
        const formData = new FormData(e.target);
        const productionData = {
            id: Date.now(),
            tanggal: formData.get('tanggal'),
            jenisProduk: formData.get('jenisProduk'),
            jumlahProduksi: parseFloat(formData.get('jumlahProduksi')),
            hargaPerKg: parseFloat(formData.get('hargaPerKg')),
            totalPendapatan: parseFloat(formData.get('totalPendapatan')),
            keterangan: formData.get('keterangan'),
            createdAt: new Date().toISOString()
        };
        
        // Validate required fields
        if (!productionData.tanggal || !productionData.jenisProduk || !productionData.jumlahProduksi) {
            if (window.appController) {
                window.appController.showNotification('Mohon lengkapi semua field yang wajib diisi', 'warning');
            }
            return;
        }
        
        // Save to localStorage
        const productions = JSON.parse(localStorage.getItem('productions')) || [];
        productions.push(productionData);
        localStorage.setItem('productions', JSON.stringify(productions));
        
        // Reset form
        e.target.reset();
        
        // Reload history
        this.loadProductionHistory();
        
        if (window.appController) {
            window.appController.showNotification('Data produksi berhasil disimpan!', 'success');
        }
    }
    
    handlePlantSubmit(e) {
        const formData = new FormData(e.target);
        const plantData = {
            id: Date.now(),
            namaVarietas: formData.get('namaVarietas'),
            jumlahBatang: parseInt(formData.get('jumlahBatang')),
            tanggalTanam: formData.get('tanggalTanam'),
            luasLahan: parseFloat(formData.get('luasLahan')),
            statusTanaman: formData.get('statusTanaman'),
            keterangan: formData.get('keterangan'),
            createdAt: new Date().toISOString()
        };
        
        // Validate required fields
        if (!plantData.namaVarietas || !plantData.jumlahBatang || !plantData.tanggalTanam) {
            if (window.appController) {
                window.appController.showNotification('Mohon lengkapi semua field yang wajib diisi', 'warning');
            }
            return;
        }
        
        // Save to localStorage
        const plants = JSON.parse(localStorage.getItem('plants')) || [];
        plants.push(plantData);
        localStorage.setItem('plants', JSON.stringify(plants));
        
        // Reset form
        e.target.reset();
        
        // Reload list
        this.loadPlantsList();
        
        if (window.appController) {
            window.appController.showNotification('Data tanaman berhasil disimpan!', 'success');
        }
    }
    
    loadProductionHistory() {
        const productions = JSON.parse(localStorage.getItem('productions')) || [];
        const historyContainer = document.getElementById('productionHistory');
        
        if (!historyContainer) return;
        
        if (productions.length === 0) {
            historyContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <h3>Belum Ada Data Produksi</h3>
                    <p>Tambahkan data produksi pertama Anda</p>
                </div>
            `;
            return;
        }
        
        historyContainer.innerHTML = '';
        productions.slice(-10).reverse().forEach(production => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const productName = this.getProductName(production.jenisProduk);
            const date = new Date(production.tanggal).toLocaleDateString('id-ID');
            
            historyItem.innerHTML = `
                <div class="history-content">
                    <h4>${productName}</h4>
                    <p><strong>Jumlah:</strong> ${production.jumlahProduksi} kg</p>
                    <p><strong>Pendapatan:</strong> Rp ${production.totalPendapatan?.toLocaleString('id-ID') || 0}</p>
                    <span class="date">${date}</span>
                </div>
                <div class="history-actions">
                    <button class="btn btn-sm btn-danger" onclick="productionController.deleteProduction(${production.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            historyContainer.appendChild(historyItem);
        });
    }
    
    loadPlantsList() {
        const plants = JSON.parse(localStorage.getItem('plants')) || [];
        const plantsContainer = document.getElementById('plantsList');
        
        if (!plantsContainer) return;
        
        if (plants.length === 0) {
            plantsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-seedling"></i>
                    <h3>Belum Ada Data Tanaman</h3>
                    <p>Tambahkan data tanaman pertama Anda</p>
                </div>
            `;
            return;
        }
        
        plantsContainer.innerHTML = '';
        plants.slice(-10).reverse().forEach(plant => {
            const plantItem = document.createElement('div');
            plantItem.className = 'plant-item';
            
            const plantDate = new Date(plant.tanggalTanam).toLocaleDateString('id-ID');
            const statusClass = this.getStatusClass(plant.statusTanaman);
            
            plantItem.innerHTML = `
                <div class="plant-content">
                    <h4>${plant.namaVarietas}</h4>
                    <p><strong>Jumlah:</strong> ${plant.jumlahBatang} batang</p>
                    <p><strong>Luas Lahan:</strong> ${plant.luasLahan} m²</p>
                    <p><strong>Status:</strong> <span class="status ${statusClass}">${this.getStatusText(plant.statusTanaman)}</span></p>
                    <span class="date">Ditanam: ${plantDate}</span>
                </div>
                <div class="plant-actions">
                    <button class="btn btn-sm btn-danger" onclick="productionController.deletePlant(${plant.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            plantsContainer.appendChild(plantItem);
        });
    }
    
    deleteProduction(id) {
        if (confirm('Apakah Anda yakin ingin menghapus data produksi ini?')) {
            const productions = JSON.parse(localStorage.getItem('productions')) || [];
            const filteredProductions = productions.filter(p => p.id !== id);
            localStorage.setItem('productions', JSON.stringify(filteredProductions));
            this.loadProductionHistory();
            
            if (window.appController) {
                window.appController.showNotification('Data produksi berhasil dihapus', 'success');
            }
        }
    }
    
    deletePlant(id) {
        if (confirm('Apakah Anda yakin ingin menghapus data tanaman ini?')) {
            const plants = JSON.parse(localStorage.getItem('plants')) || [];
            const filteredPlants = plants.filter(p => p.id !== id);
            localStorage.setItem('plants', JSON.stringify(filteredPlants));
            this.loadPlantsList();
            
            if (window.appController) {
                window.appController.showNotification('Data tanaman berhasil dihapus', 'success');
            }
        }
    }
    
    getProductName(code) {
        const products = {
            daun_segar: 'Daun Segar',
            minyak_nilam: 'Minyak Nilam',
            sabut_nilam: 'Sabut Nilam',
            bibit: 'Bibit'
        };
        return products[code] || code;
    }
    
    getStatusClass(status) {
        const statusClasses = {
            aktif: 'success',
            panen: 'warning',
            baru: 'info',
            'masa-pemeliharaan': 'secondary'
        };
        return statusClasses[status] || 'secondary';
    }
    
    getStatusText(status) {
        const statusTexts = {
            aktif: 'Aktif',
            panen: 'Siap Panen',
            baru: 'Baru Tanam',
            'masa-pemeliharaan': 'Masa Pemeliharaan'
        };
        return statusTexts[status] || status;
    }
}

// Global functions called from HTML
function editPlant(id) {
    const plants = JSON.parse(localStorage.getItem('plants')) || [];
    const plant = plants.find(p => p.id === id);
    
    if (plant) {
        if (window.appController) {
            window.appController.showNotification(`Edit tanaman: ${plant.namaVarietas} - Fitur edit akan segera tersedia!`, 'info');
        }
    }
}

function viewProduction(id) {
    const productions = JSON.parse(localStorage.getItem('productions')) || [];
    const production = productions.find(p => p.id === id);
    
    if (production) {
        const productNames = {
            'daun_segar': 'Daun Segar',
            'minyak_nilam': 'Minyak Nilam',
            'sabut_nilam': 'Sabut Nilam',
            'bibit': 'Bibit',
            'lainnya': 'Lainnya'
        };
        
        const message = `Detail Produksi:

Tanggal: ${new Date(production.tanggal).toLocaleDateString('id-ID')}
Jenis: ${productNames[production.jenisProduk] || production.jenisProduk}
Jumlah: ${production.jumlahProduksi} kg
Harga/kg: Rp ${production.hargaPerKg?.toLocaleString('id-ID') || 0}
Total: Rp ${production.totalPendapatan?.toLocaleString('id-ID') || 0}
Keterangan: ${production.keterangan || '-'}`;
        
        alert(message);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.productionController = new ProductionController();
    
    // Set current date as default
    const today = new Date().toISOString().split('T')[0];
    const tanggalInput = document.getElementById('tanggal');
    const tanggalTanamInput = document.getElementById('tanggalTanam');
    
    if (tanggalInput) tanggalInput.value = today;
    if (tanggalTanamInput) tanggalTanamInput.value = today;
    
    // Update last update time
    const lastUpdateElement = document.getElementById('lastUpdate');
    if (lastUpdateElement) {
        lastUpdateElement.textContent = `Update Terakhir: ${new Date().toLocaleDateString('id-ID', { 
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}`;
    }
});
    
    // Setup form validation
    setupFormValidation(form) {
        const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        fields.forEach(field => {
            // Validation rules based on field type and attributes
            const rules = {
                required: field.hasAttribute('required')
            };
            
            // Add specific rules based on field type
            if (field.type === 'email') {
                rules.email = true;
            }
            
            if (field.type === 'number') {
                rules.number = true;
                if (field.hasAttribute('min')) {
                    rules.min = parseFloat(field.getAttribute('min'));
                }
                if (field.hasAttribute('max')) {
                    rules.max = parseFloat(field.getAttribute('max'));
                }
            }
            
            if (field.hasAttribute('minlength')) {
                rules.minLength = parseInt(field.getAttribute('minlength'));
            }
            
            if (field.hasAttribute('maxlength')) {
                rules.maxLength = parseInt(field.getAttribute('maxlength'));
            }
            
            // Add blur validation
            field.addEventListener('blur', () => {
                AppUtils.validateField(field, rules);
            });
            
            // Add input validation for immediate feedback
            field.addEventListener('input', AppUtils.debounce(() => {
                if (field.classList.contains('error')) {
                    AppUtils.validateField(field, rules);
                }
            }, 500));
        });
    }
    
    // Validate entire form
    validateForm(form) {
        const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        fields.forEach(field => {
            const rules = {
                required: field.hasAttribute('required')
            };
            
            if (field.type === 'email') rules.email = true;
            if (field.type === 'number') {
                rules.number = true;
                if (field.hasAttribute('min')) rules.min = parseFloat(field.getAttribute('min'));
                if (field.hasAttribute('max')) rules.max = parseFloat(field.getAttribute('max'));
            }
            if (field.hasAttribute('minlength')) rules.minLength = parseInt(field.getAttribute('minlength'));
            if (field.hasAttribute('maxlength')) rules.maxLength = parseInt(field.getAttribute('maxlength'));
            
            if (!AppUtils.validateField(field, rules)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // Handle production form submission with validation
    handleProductionSubmit(e) {
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Validate form
        if (!this.validateForm(form)) {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            AppUtils.showNotification('Mohon perbaiki kesalahan pada form', 'error');
            
            // Focus on first error field
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.focus();
            }
            return;
        }
        
        try {
            // Get form data
            const formData = new FormData(form);
            const productionData = {
                id: Date.now().toString(),
                tanggal: formData.get('tanggal'),
                jenisProduk: formData.get('jenisProduk'),
                jumlahProduksi: parseFloat(formData.get('jumlahProduksi')),
                hargaJual: parseFloat(formData.get('hargaJual')),
                totalPendapatan: parseFloat(formData.get('jumlahProduksi')) * parseFloat(formData.get('hargaJual')),
                kualitas: formData.get('kualitas'),
                lokasiPanen: formData.get('lokasiPanen'),
                keterangan: formData.get('keterangan'),
                createdAt: new Date().toISOString()
            };
            
            // Save to localStorage
            const productions = JSON.parse(localStorage.getItem('productions')) || [];
            productions.push(productionData);
            localStorage.setItem('productions', JSON.stringify(productions));
            
            // Show success message
            AppUtils.showNotification('Data produksi berhasil disimpan!', 'success');
            
            // Reset form
            form.reset();
            
            // Update displays
            this.loadProductionHistory();
            this.updateDashboardStats();
            
        } catch (error) {
            console.error('Error saving production data:', error);
            AppUtils.showNotification('Terjadi kesalahan saat menyimpan data', 'error');
        } finally {
            // Remove loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }
    
    // Handle plant form submission with validation
    handlePlantSubmit(e) {
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Validate form
        if (!this.validateForm(form)) {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            AppUtils.showNotification('Mohon perbaiki kesalahan pada form', 'error');
            
            // Focus on first error field
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.focus();
            }
            return;
        }
        
        try {
            // Get form data
            const formData = new FormData(form);
            const plantData = {
                id: Date.now().toString(),
                namaVarietas: formData.get('namaVarietas'),
                tanggalTanam: formData.get('tanggalTanam'),
                jumlahBatang: parseInt(formData.get('jumlahBatang')),
                luasLahan: parseFloat(formData.get('luasLahan')),
                lokasiTanam: formData.get('lokasiTanam'),
                statusTanaman: formData.get('statusTanaman'),
                catatanTanaman: formData.get('catatanTanaman'),
                createdAt: new Date().toISOString()
            };
            
            // Save to localStorage
            const plants = JSON.parse(localStorage.getItem('plants')) || [];
            plants.push(plantData);
            localStorage.setItem('plants', JSON.stringify(plants));
            
            // Show success message
            AppUtils.showNotification('Data tanaman berhasil disimpan!', 'success');
            
            // Reset form
            form.reset();
            
            // Update displays
            this.loadPlantsList();
            this.updatePlantStats();
            
        } catch (error) {
            console.error('Error saving plant data:', error);
            AppUtils.showNotification('Terjadi kesalahan saat menyimpan data', 'error');
        } finally {
            // Remove loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }
    
    // Update dashboard statistics
    updateDashboardStats() {
        const productions = JSON.parse(localStorage.getItem('productions')) || [];
        const plants = JSON.parse(localStorage.getItem('plants')) || [];
        
        // Update footer stats if elements exist
        const totalProduction = productions.reduce((sum, prod) => sum + (prod.jumlahProduksi || 0), 0);
        const totalPlants = plants.reduce((sum, plant) => sum + (plant.jumlahBatang || 0), 0);
        
        const dataStatsElement = document.getElementById('dataStats');
        if (dataStatsElement) {
            dataStatsElement.textContent = `Total Produksi: ${totalProduction.toFixed(1)} kg | Total Tanaman: ${totalPlants} batang`;
        }
        
        const lastUpdateElement = document.getElementById('lastUpdate');
        if (lastUpdateElement) {
            lastUpdateElement.textContent = `Update Terakhir: ${AppUtils.formatDate(new Date(), { 
                day: 'numeric', 
                month: 'short', 
                hour: '2-digit', 
                minute: '2-digit' 
            })}`;
        }
    }
    
    // Update plant statistics
    updatePlantStats() {
        const plants = JSON.parse(localStorage.getItem('plants')) || [];
        
        const stats = {
            active: plants.filter(p => p.statusTanaman === 'aktif').length,
            ready: plants.filter(p => p.statusTanaman === 'panen').length,
            new: plants.filter(p => p.statusTanaman === 'baru').length,
            sick: plants.filter(p => p.statusTanaman === 'sakit').length
        };
        
        // Update stat displays
        Object.keys(stats).forEach(key => {
            const element = document.getElementById(`plant${key.charAt(0).toUpperCase() + key.slice(1)}Count`);
            if (element) {
                element.textContent = stats[key];
            }
        });
        
        this.updateDashboardStats();
    }