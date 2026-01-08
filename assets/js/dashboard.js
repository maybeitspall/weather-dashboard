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
        
        // Return data real (bisa kosong jika belum ada input)
        
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
            btn.addEventListener('click', () => {
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
        
        // Setup clear data button
        const clearDataBtn = document.getElementById('clearDataBtn');
        if (clearDataBtn) {
            clearDataBtn.addEventListener('click', () => {
                if (confirm('Apakah Anda yakin ingin menghapus semua data produksi dan tanaman? Tindakan ini tidak dapat dibatalkan.')) {
                    this.clearAllData();
                }
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
        // Total tanaman now calculated from luas lahan (1 m² = 1 tanaman)
        const totalTanaman = plants.reduce((sum, plant) => {
            const luasLahan = plant.luasLahan || 0;
            return sum + Math.floor(luasLahan); // 1 m² = 1 tanaman
        }, 0);
        
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
    }
    
    // Fungsi untuk menghapus semua data (untuk testing)
    clearAllData() {
        localStorage.removeItem('productions');
        localStorage.removeItem('plants');
        this.updateStats();
        this.refreshChart();
        if (window.appController) {
            window.appController.showNotification('Semua data telah dihapus', 'info');
        }
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
