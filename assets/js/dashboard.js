// ====================== //
// DASHBOARD SPECIFIC     //
// ====================== //

class DashboardController {
    constructor() {
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
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
                    datasets: [{
                        label: 'Produksi (kg)',
                        data: [120, 150, 180, 200, 240, 260, 250, 230, 200, 180, 160, 140],
                        borderColor: '#2d5a27',
                        backgroundColor: 'rgba(45, 90, 39, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Produksi (kg)'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Bulan'
                            }
                        }
                    }
                }
            });
        }
    }
    
    setupChartButtons() {
        const chartBtns = document.querySelectorAll('.chart-btn');
        chartBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                chartBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const chartType = this.dataset.chart;
                console.log(`Switch to ${chartType} chart`);
            });
        });
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
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new DashboardController();
});
