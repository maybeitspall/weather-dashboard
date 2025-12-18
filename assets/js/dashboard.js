// ====================== //
// DASHBOARD SPECIFIC     //
// ====================== //

class DashboardController {
    constructor() {
        this.currentChart = null;
        this.currentChartType = 'production';
        this.init();
    }
    
    init() {
        this.updateGreeting();
        this.initProductionChart();
        this.setupChartButtons();
        this.setupQuickActions();
        this.setupRefreshButton();
        this.loadInitialData();
        this.updateLastUpdateTime();
    }
    
    updateGreeting() {
        const hour = new Date().getHours();
        let greeting = "Selamat Siang!";
        
        if (hour < 12) greeting = "Selamat Pagi!";
        else if (hour < 15) greeting = "Selamat Siang!";
        else if (hour < 19) greeting = "Selamat Sore!";
        else greeting = "Selamat Malam!";
        
        const greetingElement = document.getElementById('greetingMessage');
        if (greetingElement) greetingElement.textContent = greeting;
    }
    
    initProductionChart() {
        const ctx = document.getElementById('productionChart');
        if (ctx) {
            try {
                // Destroy existing chart if it exists
                if (this.currentChart) {
                    this.currentChart.destroy();
                }
                
                this.currentChart = new Chart(ctx, {
                    type: 'line',
                    data: this.getProductionChartData(),
                    options: this.getChartOptions('production')
                });
                
                console.log('Production chart initialized successfully');
            } catch (error) {
                console.error('Error initializing chart:', error);
                if (window.appController) {
                    window.appController.showNotification('Gagal memuat grafik', 'error');
                }
            }
        } else {
            console.error('Chart canvas element not found');
        }
    }
    
    getProductionChartData() {
        const productions = JSON.parse(localStorage.getItem('productions')) || [];
        const monthlyData = this.processMonthlyData(productions, 'production');
        
        return {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
            datasets: [{
                label: 'Produksi (kg)',
                data: monthlyData,
                borderColor: '#2d5a27',
                backgroundColor: 'rgba(45, 90, 39, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        };
    }
    
    getRevenueChartData() {
        const productions = JSON.parse(localStorage.getItem('productions')) || [];
        const monthlyData = this.processMonthlyData(productions, 'revenue');
        
        return {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
            datasets: [{
                label: 'Pendapatan (Rp)',
                data: monthlyData,
                borderColor: '#1e7e34',
                backgroundColor: 'rgba(30, 126, 52, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        };
    }
    
    processMonthlyData(productions, type) {
        const monthlyData = new Array(12).fill(0);
        const currentYear = new Date().getFullYear();
        
        try {
            productions.forEach(production => {
                if (production && production.tanggalProduksi) {
                    const date = new Date(production.tanggalProduksi);
                    if (!isNaN(date.getTime()) && date.getFullYear() === currentYear) {
                        const month = date.getMonth();
                        const jumlah = parseFloat(production.jumlahProduksi) || 0;
                        
                        if (type === 'production') {
                            monthlyData[month] += jumlah;
                        } else if (type === 'revenue') {
                            // Hitung pendapatan berdasarkan harga per kg
                            const hargaPerKg = this.getHargaPerKg(production.jenisProduksi);
                            monthlyData[month] += jumlah * hargaPerKg;
                        }
                    }
                }
            });
        } catch (error) {
            console.warn('Error processing monthly data:', error);
        }
        
        // Jika tidak ada data real atau semua data 0, gunakan data contoh
        const hasRealData = monthlyData.some(val => val > 0);
        if (!hasRealData) {
            if (type === 'production') {
                return [120, 150, 180, 200, 240, 260, 250, 230, 200, 180, 160, 140];
            } else {
                return [12000000, 15000000, 18000000, 20000000, 24000000, 26000000, 
                       25000000, 23000000, 20000000, 18000000, 16000000, 14000000];
            }
        }
        
        return monthlyData;
    }
    
    getHargaPerKg(jenisProduksi) {
        // Harga per kg berdasarkan jenis produksi (dalam Rupiah)
        const hargaMap = {
            'daun-segar': 100000,
            'daun-kering': 150000,
            'minyak-nilam': 2000000,
            'bibit': 50000
        };
        
        return hargaMap[jenisProduksi] || 100000;
    }
    
    getChartOptions(type) {
        const isRevenue = type === 'revenue';
        
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (isRevenue) {
                                return `Pendapatan: ${new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                    minimumFractionDigits: 0
                                }).format(context.parsed.y)}`;
                            } else {
                                return `Produksi: ${context.parsed.y} kg`;
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: isRevenue ? 'Pendapatan (Rp)' : 'Produksi (kg)'
                    },
                    ticks: {
                        callback: function(value) {
                            if (isRevenue) {
                                return new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                    minimumFractionDigits: 0,
                                    notation: 'compact'
                                }).format(value);
                            } else {
                                return value + ' kg';
                            }
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Bulan'
                    }
                }
            }
        };
    }
    
    setupChartButtons() {
        const chartBtns = document.querySelectorAll('.chart-btn');
        chartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                chartBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const chartType = btn.dataset.chart;
                this.switchChart(chartType);
            });
        });
    }
    
    switchChart(chartType) {
        if (this.currentChart && this.currentChartType !== chartType) {
            console.log(`Switching chart from ${this.currentChartType} to ${chartType}`);
            this.currentChartType = chartType;
            
            try {
                // Update chart data and options
                if (chartType === 'production') {
                    const productionData = this.getProductionChartData();
                    console.log('Production data:', productionData);
                    this.currentChart.data = productionData;
                    this.currentChart.options = this.getChartOptions('production');
                } else if (chartType === 'revenue') {
                    const revenueData = this.getRevenueChartData();
                    console.log('Revenue data:', revenueData);
                    this.currentChart.data = revenueData;
                    this.currentChart.options = this.getChartOptions('revenue');
                }
                
                // Update chart
                this.currentChart.update('active');
                
                // Show notification
                if (window.appController) {
                    const chartName = chartType === 'production' ? 'Produksi' : 'Pendapatan';
                    window.appController.showNotification(`Menampilkan grafik ${chartName}`, 'info');
                }
            } catch (error) {
                console.error('Error switching chart:', error);
                if (window.appController) {
                    window.appController.showNotification('Gagal mengganti grafik', 'error');
                }
            }
        }
    }
    
    setupQuickActions() {
        // Clear notifications
        const clearNotifications = document.getElementById('clearNotifications');
        if (clearNotifications) {
            clearNotifications.addEventListener('click', function() {
                if (confirm('Hapus semua notifikasi?')) {
                    document.getElementById('notificationsList').innerHTML = 
                        '<div class="empty-notifications">Tidak ada notifikasi</div>';
                }
            });
        }
        
        // Generate report
        const generateReport = document.getElementById('generateReport');
        if (generateReport) {
            generateReport.addEventListener('click', function(e) {
                e.preventDefault();
                if (window.appController) {
                    window.appController.showNotification('Fitur laporan sedang dalam pengembangan!', 'info');
                }
            });
        }
    }
    
    setupRefreshButton() {
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshDashboard();
            });
        }
    }
    
    refreshDashboard() {
        const refreshBtn = document.getElementById('refreshBtn');
        
        // Show loading state
        if (refreshBtn) {
            refreshBtn.classList.add('loading');
            refreshBtn.disabled = true;
        }
        
        // Show notification
        if (window.appController) {
            window.appController.showNotification('Memperbarui data dashboard...', 'info');
        }
        
        // Simulate data refresh with timeout
        setTimeout(() => {
            // Update greeting
            this.updateGreeting();
            
            // Update stats with random variations
            this.updateStats();
            
            // Update chart with fresh data
            this.refreshChart();
            
            // Update last update time
            this.updateLastUpdateTime();
            
            // Remove loading state
            if (refreshBtn) {
                refreshBtn.classList.remove('loading');
                refreshBtn.disabled = false;
            }
            
            // Show success notification
            if (window.appController) {
                window.appController.showNotification('Dashboard berhasil diperbarui!', 'success');
            }
        }, 1500);
    }
    
    refreshChart() {
        if (this.currentChart) {
            // Update chart data based on current type
            if (this.currentChartType === 'production') {
                this.currentChart.data = this.getProductionChartData();
            } else if (this.currentChartType === 'revenue') {
                this.currentChart.data = this.getRevenueChartData();
            }
            
            this.currentChart.update('active');
        }
    }
    
    updateStats() {
        // Get real data from localStorage
        const productions = JSON.parse(localStorage.getItem('productions')) || [];
        const plants = JSON.parse(localStorage.getItem('plants')) || [];
        
        // Calculate real statistics from actual data
        const totalTanaman = plants.reduce((sum, plant) => sum + (plant.jumlahBatang || 0), 0);
        const totalProduction = productions.reduce((sum, prod) => sum + (prod.jumlahProduksi || 0), 0);
        const totalLuasLahan = plants.reduce((sum, plant) => sum + (plant.luasLahan || 0), 0);
        
        // Update total tanaman
        const totalTanamanEl = document.getElementById('totalTanaman');
        if (totalTanamanEl) {
            totalTanamanEl.textContent = totalTanaman;
        }
        
        // Update estimasi produksi (based on actual production data)
        const estimasiProduksiEl = document.getElementById('estimasiProduksi');
        if (estimasiProduksiEl) {
            // Calculate monthly average from production data
            const monthlyEstimate = productions.length > 0 ? 
                Math.round(totalProduction / Math.max(1, productions.length) * 4) : 0;
            estimasiProduksiEl.textContent = monthlyEstimate;
        }
        
        // Update health percentage (based on plant status)
        const healthPercentageEl = document.getElementById('healthPercentage');
        const healthBarEl = document.getElementById('healthBar');
        const healthStatusEl = document.getElementById('healthStatus');
        if (healthPercentageEl && healthBarEl) {
            let healthPercentage = 0;
            let healthStatus = 'Tidak ada data';
            
            if (plants.length > 0) {
                const healthyPlants = plants.filter(p => 
                    p.statusTanaman === 'aktif' || 
                    p.statusTanaman === 'panen' || 
                    p.statusTanaman === 'baru'
                ).length;
                healthPercentage = Math.round((healthyPlants / plants.length) * 100);
                
                if (healthPercentage >= 90) healthStatus = 'Sangat Baik';
                else if (healthPercentage >= 75) healthStatus = 'Baik';
                else if (healthPercentage >= 50) healthStatus = 'Sedang';
                else healthStatus = 'Perlu Perhatian';
            }
            
            healthPercentageEl.textContent = `${healthPercentage}%`;
            healthBarEl.style.width = `${healthPercentage}%`;
            if (healthStatusEl) healthStatusEl.textContent = healthStatus;
        }
        
        // Update luas lahan
        const luasLahanEl = document.getElementById('luasLahan');
        if (luasLahanEl) {
            luasLahanEl.textContent = totalLuasLahan;
        }
    }
    
    loadInitialData() {
        // Load real data on page load
        this.updateStats();
        
        // Initialize sample data if none exists
        this.initializeSampleData();
    }
    
    initializeSampleData() {
        const productions = JSON.parse(localStorage.getItem('productions')) || [];
        const plants = JSON.parse(localStorage.getItem('plants')) || [];
        
        // Add sample production data if none exists
        if (productions.length === 0) {
            const sampleProductions = this.generateSampleProductionData();
            localStorage.setItem('productions', JSON.stringify(sampleProductions));
        }
        
        // Add sample plant data if none exists
        if (plants.length === 0) {
            const samplePlants = this.generateSamplePlantData();
            localStorage.setItem('plants', JSON.stringify(samplePlants));
        }
    }
    
    generateSampleProductionData() {
        const currentYear = new Date().getFullYear();
        const sampleData = [];
        const jenisProduks = ['daun-segar', 'daun-kering', 'minyak-nilam'];
        
        // Generate data for last 12 months
        for (let month = 0; month < 12; month++) {
            const recordsPerMonth = Math.floor(Math.random() * 3) + 1; // 1-3 records per month
            
            for (let i = 0; i < recordsPerMonth; i++) {
                const date = new Date(currentYear, month, Math.floor(Math.random() * 28) + 1);
                const jenisProduksi = jenisProduks[Math.floor(Math.random() * jenisProduks.length)];
                
                sampleData.push({
                    id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    tanggalProduksi: date.toISOString().split('T')[0],
                    jenisProduksi: jenisProduksi,
                    jumlahProduksi: Math.floor(Math.random() * 50) + 10, // 10-60 kg
                    kualitas: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
                    catatan: 'Data contoh untuk demonstrasi',
                    createdAt: date.toISOString()
                });
            }
        }
        
        return sampleData;
    }
    
    generateSamplePlantData() {
        const sampleData = [];
        const varietasOptions = ['Nilam Aceh', 'Nilam Jawa', 'Nilam Sumatera'];
        const statusOptions = ['aktif', 'panen', 'baru'];
        
        for (let i = 0; i < 5; i++) {
            const plantDate = new Date();
            plantDate.setMonth(plantDate.getMonth() - Math.floor(Math.random() * 12));
            
            sampleData.push({
                id: `plant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                namaTanaman: `Blok ${String.fromCharCode(65 + i)}`, // Blok A, B, C, etc.
                varietas: varietasOptions[Math.floor(Math.random() * varietasOptions.length)],
                tanggalTanam: plantDate.toISOString().split('T')[0],
                jumlahBatang: Math.floor(Math.random() * 100) + 50, // 50-150 batang
                luasLahan: Math.floor(Math.random() * 500) + 100, // 100-600 m²
                statusTanaman: statusOptions[Math.floor(Math.random() * statusOptions.length)],
                catatan: 'Data contoh untuk demonstrasi',
                createdAt: plantDate.toISOString()
            });
        }
        
        return sampleData;
    }
    
    updateLastUpdateTime() {
        const lastUpdateEl = document.getElementById('lastUpdateTime');
        if (lastUpdateEl) {
            const now = new Date();
            const timeString = now.toLocaleString('id-ID', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            });
            lastUpdateEl.textContent = `Terakhir diperbarui: ${timeString}`;
        }
        
        // Update footer information
        this.updateFooterInfo();
    }
    
    updateFooterInfo() {
        const productions = JSON.parse(localStorage.getItem('productions')) || [];
        const plants = JSON.parse(localStorage.getItem('plants')) || [];
        
        // Update data info
        const dataInfoEl = document.getElementById('dataInfo');
        if (dataInfoEl) {
            const now = new Date();
            const dateString = now.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            dataInfoEl.textContent = `Data diperbarui: ${dateString}`;
        }
        
        // Update record count
        const recordCountEl = document.getElementById('recordCount');
        if (recordCountEl) {
            recordCountEl.textContent = `Catatan: ${productions.length} produksi, ${plants.length} tanaman`;
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new DashboardController();
});
