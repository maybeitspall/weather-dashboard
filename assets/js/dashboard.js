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
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new DashboardController();
});
