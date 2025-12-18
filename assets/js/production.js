// ====================== //
// PRODUCTION SPECIFIC    //
// ====================== //

class ProductionController {
    constructor() {
        this.init();
    }
    
    init() {
        // Ensure DOM is ready before setting up tabs
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeComponents();
            });
        } else {
            this.initializeComponents();
        }
    }
    
    initializeComponents() {
        this.setupTabs();
        this.setupTabDelegation(); // Additional tab handling
        this.setupForms();
        this.setupFilters();
        this.setupCalculator();
        this.setupButtons();
        this.loadProductionHistory();
        this.loadPlantsList();
        this.updatePlantStats();
    }
    
    setupTabDelegation() {
        // Event delegation for tab buttons
        const tabContainer = document.getElementById('tabContainer');
        if (tabContainer) {
            tabContainer.addEventListener('click', (e) => {
                const tabBtn = e.target.closest('.tab-btn');
                if (tabBtn) {
                    e.preventDefault();
                    this.switchTab(tabBtn.dataset.tab);
                }
            });
        }
    }
    
    switchTab(tabId) {
        console.log('Switching to tab:', tabId);
        
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        // Remove active from all
        tabBtns.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Activate selected tab
        const activeBtn = document.querySelector(`[data-tab="${tabId}"]`);
        const activeContent = document.getElementById(`tab-${tabId}`);
        
        if (activeBtn) {
            activeBtn.classList.add('active');
            activeBtn.setAttribute('aria-selected', 'true');
        }
        
        if (activeContent) {
            activeContent.classList.add('active');
            console.log('Tab switched successfully to:', tabId);
        } else {
            console.error('Tab content not found:', `tab-${tabId}`);
        }
    }
    
    setupFilters() {
        // Production history filters
        const periodFilter = document.getElementById('filterPeriod');
        const productFilter = document.getElementById('filterProduct');
        
        if (periodFilter) {
            periodFilter.addEventListener('change', () => this.loadProductionHistory());
        }
        
        if (productFilter) {
            productFilter.addEventListener('change', () => this.loadProductionHistory());
        }
        
        // Plant filters
        const plantSearch = document.getElementById('plantSearch');
        const plantStatusFilter = document.getElementById('plantStatusFilter');
        
        if (plantSearch) {
            plantSearch.addEventListener('input', () => this.loadPlantsList());
        }
        
        if (plantStatusFilter) {
            plantStatusFilter.addEventListener('change', () => this.loadPlantsList());
        }
    }
    
    setupCalculator() {
        const calcJumlah = document.getElementById('calcJumlah');
        const calcHarga = document.getElementById('calcHarga');
        const calcTotal = document.getElementById('calcTotal');
        const applyCalcBtn = document.getElementById('applyCalcBtn');
        
        const updateCalcTotal = () => {
            if (calcJumlah && calcHarga && calcTotal) {
                const jumlah = parseFloat(calcJumlah.value) || 0;
                const harga = parseFloat(calcHarga.value) || 0;
                const total = jumlah * harga;
                calcTotal.textContent = total.toLocaleString('id-ID');
            }
        };
        
        if (calcJumlah) calcJumlah.addEventListener('input', updateCalcTotal);
        if (calcHarga) calcHarga.addEventListener('input', updateCalcTotal);
        
        if (applyCalcBtn) {
            applyCalcBtn.addEventListener('click', () => {
                const jumlah = parseFloat(calcJumlah.value) || 0;
                const harga = parseFloat(calcHarga.value) || 0;
                
                const jumlahProduksiInput = document.getElementById('jumlahProduksi');
                const hargaJualInput = document.getElementById('hargaJual');
                
                if (jumlahProduksiInput) {
                    jumlahProduksiInput.value = jumlah;
                    jumlahProduksiInput.dispatchEvent(new Event('input'));
                }
                
                if (hargaJualInput) {
                    hargaJualInput.value = harga;
                    hargaJualInput.dispatchEvent(new Event('input'));
                }
                
                if (window.appController) {
                    window.appController.showNotification('Nilai telah diterapkan ke form produksi!', 'success');
                } else {
                    alert('Nilai telah diterapkan ke form produksi!');
                }
            });
        }
    }
    
    setupButtons() {
        // Clear history button
        const clearHistoryBtn = document.getElementById('clearHistoryBtn');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => {
                if (confirm('Apakah Anda yakin ingin menghapus semua riwayat produksi?')) {
                    localStorage.removeItem('productions');
                    this.loadProductionHistory();
                    
                    if (window.appController) {
                        window.appController.showNotification('Riwayat produksi berhasil dihapus!', 'success');
                    } else {
                        alert('Riwayat produksi berhasil dihapus!');
                    }
                }
            });
        }
        
        // Export buttons
        document.querySelectorAll('.export-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const type = this.classList.contains('pdf') ? 'PDF' :
                           this.classList.contains('excel') ? 'Excel' :
                           this.classList.contains('csv') ? 'CSV' : 'Print';
                
                if (window.appController) {
                    window.appController.showNotification(`Fitur ekspor ${type} akan segera tersedia!`, 'info');
                } else {
                    alert(`Fitur ekspor ${type} akan segera tersedia!`);
                }
            });
        });
        

    }
    
    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        console.log('Setting up tabs:', tabBtns.length, 'buttons found,', tabContents.length, 'contents found');
        
        // Add scrollIntoViewIfNeeded polyfill for better browser support
        this.addScrollPolyfill();
        
        if (tabBtns.length === 0) {
            console.warn('No tab buttons found');
            return;
        }
        
        tabBtns.forEach((btn, index) => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const tabId = this.dataset.tab;
                console.log('Tab clicked:', tabId);
                
                // Remove active class from all tabs and contents
                tabBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');
                
                // Scroll active tab into view on mobile
                this.scrollIntoViewIfNeeded();
                
                // Find target content with correct ID format (tab-{tabId})
                const targetContent = document.getElementById(`tab-${tabId}`);
                if (targetContent) {
                    targetContent.classList.add('active');
                    console.log('Tab content activated:', `tab-${tabId}`);
                } else {
                    console.error(`Tab content with ID 'tab-${tabId}' not found`);
                    // Fallback: try without prefix
                    const fallbackContent = document.getElementById(tabId);
                    if (fallbackContent) {
                        fallbackContent.classList.add('active');
                        console.log('Fallback tab content activated:', tabId);
                    }
                }
            });
        });
        
        // Ensure first tab is active on load
        const firstTab = tabBtns[0];
        const firstTabId = firstTab?.dataset.tab;
        if (firstTabId) {
            const firstContent = document.getElementById(`tab-${firstTabId}`);
            if (firstContent && !firstContent.classList.contains('active')) {
                firstContent.classList.add('active');
                console.log('First tab content activated on load:', `tab-${firstTabId}`);
            }
        }
    }
    
    addScrollPolyfill() {
        // Add scrollIntoViewIfNeeded polyfill for better browser support
        if (!Element.prototype.scrollIntoViewIfNeeded) {
            Element.prototype.scrollIntoViewIfNeeded = function(centerIfNeeded = true) {
                const parent = this.parentElement;
                if (!parent) return;
                
                const parentRect = parent.getBoundingClientRect();
                const thisRect = this.getBoundingClientRect();
                
                if (thisRect.left < parentRect.left || thisRect.right > parentRect.right) {
                    const scrollLeft = centerIfNeeded 
                        ? thisRect.left - parentRect.left - (parentRect.width - thisRect.width) / 2
                        : thisRect.left - parentRect.left;
                    
                    parent.scrollBy({
                        left: scrollLeft,
                        behavior: 'smooth'
                    });
                }
            };
        }
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
        
        // Auto-calculate production value with validation
        const quantityInput = document.getElementById('jumlahProduksi');
        const priceInput = document.getElementById('hargaJual');
        const totalDisplay = document.getElementById('totalPendapatanDisplay');
        
        if (quantityInput && priceInput && totalDisplay) {
            const calculateTotal = () => {
                const quantity = parseFloat(quantityInput.value) || 0;
                const price = parseFloat(priceInput.value) || 0;
                
                // Validate inputs
                if (quantity < 0) {
                    quantityInput.value = 0;
                    return;
                }
                if (price < 0) {
                    priceInput.value = 0;
                    return;
                }
                
                const total = quantity * price;
                
                const totalValue = totalDisplay.querySelector('.total-value');
                if (totalValue) {
                    totalValue.textContent = total.toLocaleString('id-ID');
                }
            };
            
            quantityInput.addEventListener('input', calculateTotal);
            priceInput.addEventListener('input', calculateTotal);
            
            // Prevent negative values
            quantityInput.addEventListener('keydown', (e) => {
                if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                    e.preventDefault();
                }
            });
            
            priceInput.addEventListener('keydown', (e) => {
                if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                    e.preventDefault();
                }
            });
        }
        

    }
    

    
    handleProductionSubmit(e) {
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Show loading state
        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        }
        
        // Validate form
        if (!this.validateForm(form)) {
            if (submitBtn) {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
            
            if (window.appController) {
                window.appController.showNotification('Mohon perbaiki kesalahan pada form', 'error');
            } else {
                alert('Mohon lengkapi semua field yang wajib diisi');
            }
            
            // Focus on first error field
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.focus();
            }
            return;
        }
        
        try {
            const formData = new FormData(form);
            const jumlahProduksi = parseFloat(formData.get('jumlahProduksi'));
            const hargaJual = parseFloat(formData.get('hargaJual'));
            
            const productionData = {
                id: Date.now().toString(),
                tanggal: formData.get('tanggal'),
                jenisProduk: formData.get('jenisProduk'),
                jumlahProduksi: jumlahProduksi,
                hargaJual: hargaJual,
                totalPendapatan: jumlahProduksi * hargaJual,
                kualitas: formData.get('kualitas'),
                lokasiPanen: formData.get('lokasiPanen'),
                keterangan: formData.get('keterangan'),
                createdAt: new Date().toISOString()
            };
            
            // Save to localStorage
            const productions = JSON.parse(localStorage.getItem('productions')) || [];
            productions.push(productionData);
            localStorage.setItem('productions', JSON.stringify(productions));
            
            // Reset form
            form.reset();
            
            // Reset total display
            const totalDisplay = document.getElementById('totalPendapatanDisplay');
            if (totalDisplay) {
                const totalValue = totalDisplay.querySelector('.total-value');
                if (totalValue) {
                    totalValue.textContent = '0';
                }
            }
            
            // Reload history
            this.loadProductionHistory();
            this.updateDashboardStats();
            
            if (window.appController) {
                window.appController.showNotification('Data produksi berhasil disimpan!', 'success');
            } else {
                alert('Data produksi berhasil disimpan!');
            }
        } catch (error) {
            console.error('Error saving production data:', error);
            if (window.appController) {
                window.appController.showNotification('Terjadi kesalahan saat menyimpan data', 'error');
            } else {
                alert('Terjadi kesalahan saat menyimpan data');
            }
        } finally {
            // Remove loading state
            if (submitBtn) {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        }
    }
    
    handlePlantSubmit(e) {
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Show loading state
        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        }
        
        // Validate form
        if (!this.validateForm(form)) {
            if (submitBtn) {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
            
            if (window.appController) {
                window.appController.showNotification('Mohon perbaiki kesalahan pada form', 'error');
            } else {
                alert('Mohon lengkapi semua field yang wajib diisi');
            }
            
            // Focus on first error field
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.focus();
            }
            return;
        }
        
        try {
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
            
            // Reset form
            form.reset();
            
            // Reload list
            this.loadPlantsList();
            this.updatePlantStats();
            
            if (window.appController) {
                window.appController.showNotification('Data tanaman berhasil disimpan!', 'success');
            } else {
                alert('Data tanaman berhasil disimpan!');
            }
        } catch (error) {
            console.error('Error saving plant data:', error);
            if (window.appController) {
                window.appController.showNotification('Terjadi kesalahan saat menyimpan data', 'error');
            } else {
                alert('Terjadi kesalahan saat menyimpan data');
            }
        } finally {
            // Remove loading state
            if (submitBtn) {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        }
    }
    
    loadProductionHistory() {
        const productions = JSON.parse(localStorage.getItem('productions')) || [];
        const tbody = document.querySelector('#riwayatProduksi tbody');
        
        if (!tbody) return;
        
        if (productions.length === 0) {
            tbody.innerHTML = `
                <tr class="empty-row">
                    <td colspan="7" class="empty-state">
                        <i class="fas fa-history"></i>
                        <p>Belum ada data produksi. Mulai dengan input data produksi pertama Anda.</p>
                    </td>
                </tr>
            `;
            this.updateSummaryInfo([]);
            return;
        }
        
        // Apply filters
        const periodFilter = document.getElementById('filterPeriod')?.value || 'all';
        const productFilter = document.getElementById('filterProduct')?.value || 'all';
        
        let filteredProductions = productions;
        
        // Period filter
        if (periodFilter !== 'all') {
            const now = new Date();
            filteredProductions = filteredProductions.filter(prod => {
                const prodDate = new Date(prod.tanggal);
                
                switch(periodFilter) {
                    case 'today':
                        return prodDate.toDateString() === now.toDateString();
                    case 'week':
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        return prodDate >= weekAgo;
                    case 'month':
                        return prodDate.getMonth() === now.getMonth() && 
                               prodDate.getFullYear() === now.getFullYear();
                    case 'year':
                        return prodDate.getFullYear() === now.getFullYear();
                    default:
                        return true;
                }
            });
        }
        
        // Product filter
        if (productFilter !== 'all') {
            filteredProductions = filteredProductions.filter(prod => prod.jenisProduk === productFilter);
        }
        
        if (filteredProductions.length === 0) {
            tbody.innerHTML = `
                <tr class="empty-row">
                    <td colspan="7" class="empty-state">
                        <i class="fas fa-filter"></i>
                        <p>Tidak ada data produksi dengan filter yang dipilih.</p>
                    </td>
                </tr>
            `;
            this.updateSummaryInfo([]);
            return;
        }
        
        // Sort by date (newest first)
        filteredProductions.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
        
        // Build table rows
        let html = '';
        filteredProductions.forEach(prod => {
            const productNames = {
                'daun_segar': 'Daun Segar',
                'minyak_nilam': 'Minyak Nilam',
                'sabut_nilam': 'Sabut Nilam',
                'bibit': 'Bibit',
                'lainnya': 'Lainnya'
            };
            
            const qualityColors = {
                'premium': 'success',
                'standar': 'warning',
                'ekonomi': 'secondary'
            };
            
            const formatRupiah = (angka) => {
                return new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                }).format(angka);
            };
            
            const formatDate = (dateString) => {
                const date = new Date(dateString);
                return date.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                });
            };
            
            html += `
                <tr>
                    <td>${formatDate(prod.tanggal)}</td>
                    <td>${productNames[prod.jenisProduk] || prod.jenisProduk}</td>
                    <td>${(prod.jumlahProduksi || 0).toFixed(1)} kg</td>
                    <td>${formatRupiah(prod.hargaJual || 0)}</td>
                    <td>${formatRupiah(prod.totalPendapatan || 0)}</td>
                    <td>
                        <span class="quality-badge ${qualityColors[prod.kualitas] || ''}">
                            ${prod.kualitas || '-'}
                        </span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-action view" onclick="viewProduction('${prod.id}')" aria-label="Lihat detail">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn-action delete" onclick="deleteProduction('${prod.id}')" aria-label="Hapus produksi">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        tbody.innerHTML = html;
        this.updateSummaryInfo(filteredProductions);
    }
    
    updateSummaryInfo(productions) {
        const totalProduction = productions.reduce((sum, prod) => sum + (prod.jumlahProduksi || 0), 0);
        const totalRevenue = productions.reduce((sum, prod) => sum + (prod.totalPendapatan || 0), 0);
        const avgPrice = totalProduction > 0 ? totalRevenue / totalProduction : 0;
        
        const formatRupiah = (angka) => {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(angka);
        };
        
        const totalProductionEl = document.getElementById('totalProductionSum');
        const totalRevenueEl = document.getElementById('totalRevenueSum');
        const avgPriceEl = document.getElementById('avgPriceSum');
        
        if (totalProductionEl) totalProductionEl.textContent = `${totalProduction.toFixed(1)} kg`;
        if (totalRevenueEl) totalRevenueEl.textContent = formatRupiah(totalRevenue);
        if (avgPriceEl) avgPriceEl.textContent = formatRupiah(avgPrice);
    }
    
    loadPlantsList() {
        const plants = JSON.parse(localStorage.getItem('plants')) || [];
        const plantsContainer = document.getElementById('plantsList');
        
        if (!plantsContainer) return;
        
        if (plants.length === 0) {
            plantsContainer.innerHTML = `
                <div class="empty-plants">
                    <i class="fas fa-seedling"></i>
                    <p>Belum ada data tanaman. Tambahkan data tanaman terlebih dahulu.</p>
                </div>
            `;
            return;
        }
        
        // Get filter values
        const searchTerm = document.getElementById('plantSearch')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('plantStatusFilter')?.value || 'all';
        
        let filteredPlants = plants;
        
        // Apply search filter
        if (searchTerm) {
            filteredPlants = filteredPlants.filter(plant =>
                plant.namaVarietas.toLowerCase().includes(searchTerm) ||
                (plant.lokasiTanam && plant.lokasiTanam.toLowerCase().includes(searchTerm))
            );
        }
        
        // Apply status filter
        if (statusFilter !== 'all') {
            filteredPlants = filteredPlants.filter(plant => plant.statusTanaman === statusFilter);
        }
        
        if (filteredPlants.length === 0) {
            plantsContainer.innerHTML = `
                <div class="empty-plants">
                    <i class="fas fa-search"></i>
                    <p>Tidak ditemukan tanaman dengan kriteria tersebut.</p>
                </div>
            `;
            return;
        }
        
        // Build HTML
        let html = '';
        filteredPlants.forEach(plant => {
            const statusClass = this.getStatusClass(plant.statusTanaman);
            const statusText = this.getStatusText(plant.statusTanaman);
            const age = calculateAge(plant.tanggalTanam);
            
            html += `
                <div class="plant-item ${statusClass}">
                    <div class="plant-icon">
                        <i class="fas fa-seedling"></i>
                    </div>
                    <div class="plant-info">
                        <h4>${plant.namaVarietas}</h4>
                        <div class="plant-details">
                            <span class="plant-detail">
                                <i class="fas fa-tree"></i>
                                ${plant.jumlahBatang} batang
                            </span>
                            <span class="plant-detail">
                                <i class="fas fa-ruler"></i>
                                ${plant.luasLahan} m²
                            </span>
                            <span class="plant-detail">
                                <i class="fas fa-calendar"></i>
                                ${age} hari
                            </span>
                        </div>
                        <p class="plant-location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${plant.lokasiTanam || '-'}
                        </p>
                    </div>
                    <div class="plant-status">
                        <span class="status-badge ${statusClass}">${statusText}</span>
                        <div class="plant-actions">
                            <button class="btn-action edit" onclick="editPlant('${plant.id}')" aria-label="Edit tanaman">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-action delete" onclick="deletePlant('${plant.id}')" aria-label="Hapus tanaman">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        plantsContainer.innerHTML = html;
        
        // Update plant statistics
        this.updatePlantStats();
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
            'masa-pemeliharaan': 'Masa Pemeliharaan',
            sakit: 'Sakit'
        };
        return statusTexts[status] || status;
    }
    
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
                if (window.AppUtils) {
                    window.AppUtils.validateField(field, rules);
                }
            });
            
            // Add input validation for immediate feedback
            field.addEventListener('input', () => {
                if (field.classList.contains('error') && window.AppUtils) {
                    window.AppUtils.validateField(field, rules);
                }
            });
        });
    }
    
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
            
            if (window.AppUtils && !window.AppUtils.validateField(field, rules)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    updateDashboardStats() {
        const productions = JSON.parse(localStorage.getItem('productions')) || [];
        const plants = JSON.parse(localStorage.getItem('plants')) || [];
        
        const totalProduction = productions.reduce((sum, prod) => sum + (prod.jumlahProduksi || 0), 0);
        const totalPlants = plants.reduce((sum, plant) => sum + (plant.jumlahBatang || 0), 0);
        
        const dataStatsElement = document.getElementById('dataStats');
        if (dataStatsElement) {
            dataStatsElement.textContent = `Total Produksi: ${totalProduction.toFixed(1)} kg | Total Tanaman: ${totalPlants} batang`;
        }
        
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
    }
    
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
            const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
            const element = document.getElementById(`plant${capitalizedKey}Count`);
            if (element) {
                element.textContent = stats[key];
            }
        });
        
        this.updateDashboardStats();
    }
}

// Global functions called from HTML
function calculateAge(tanggalTanam) {
    const tanamDate = new Date(tanggalTanam);
    const today = new Date();
    const diffTime = Math.abs(today - tanamDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function editPlant(id) {
    const plants = JSON.parse(localStorage.getItem('plants')) || [];
    const plant = plants.find(p => p.id === id);
    
    if (plant) {
        if (window.appController) {
            window.appController.showNotification(`Edit tanaman: ${plant.namaVarietas} - Fitur edit akan segera tersedia!`, 'info');
        } else {
            alert(`Edit tanaman: ${plant.namaVarietas}\n\nFitur edit akan segera tersedia!`);
        }
    }
}

function deletePlant(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data tanaman ini?')) {
        let plants = JSON.parse(localStorage.getItem('plants')) || [];
        plants = plants.filter(p => p.id !== id);
        localStorage.setItem('plants', JSON.stringify(plants));
        
        // Reload the plants list
        if (window.productionController) {
            window.productionController.loadPlantsList();
            window.productionController.updatePlantStats();
        }
        
        if (window.appController) {
            window.appController.showNotification('Data tanaman berhasil dihapus!', 'success');
        } else {
            alert('Data tanaman berhasil dihapus!');
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
Harga/kg: Rp ${(production.hargaJual || 0).toLocaleString('id-ID')}
Total: Rp ${(production.totalPendapatan || 0).toLocaleString('id-ID')}
Kualitas: ${production.kualitas || '-'}
Lokasi: ${production.lokasiPanen || '-'}
Keterangan: ${production.keterangan || '-'}`;
        
        alert(message);
    }
}

function deleteProduction(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data produksi ini?')) {
        let productions = JSON.parse(localStorage.getItem('productions')) || [];
        productions = productions.filter(p => p.id !== id);
        localStorage.setItem('productions', JSON.stringify(productions));
        
        // Reload the production history
        if (window.productionController) {
            window.productionController.loadProductionHistory();
            window.productionController.updateDashboardStats();
        }
        
        if (window.appController) {
            window.appController.showNotification('Data produksi berhasil dihapus!', 'success');
        } else {
            alert('Data produksi berhasil dihapus!');
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Production page DOM loaded');
    
    // Initialize controller
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
    
    // Additional tab setup as fallback
    setTimeout(() => {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        console.log('Fallback tab check:', tabBtns.length, 'buttons,', tabContents.length, 'contents');
        
        // Ensure first tab is properly activated
        if (tabBtns.length > 0 && tabContents.length > 0) {
            const firstTab = tabBtns[0];
            const firstTabId = firstTab.dataset.tab;
            const firstContent = document.getElementById(`tab-${firstTabId}`);
            
            if (firstContent && !firstContent.classList.contains('active')) {
                // Remove active from all
                tabContents.forEach(c => c.classList.remove('active'));
                tabBtns.forEach(b => b.classList.remove('active'));
                
                // Activate first
                firstTab.classList.add('active');
                firstContent.classList.add('active');
                console.log('Fallback: Activated first tab');
            }
        }
    }, 100);
});