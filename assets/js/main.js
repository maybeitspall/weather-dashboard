// ====================== //
// GRAFIK PRODUKSI        //
// ====================== //

document.addEventListener("DOMContentLoaded", function () {
  const ctx = document.getElementById("productionChart");
  if (ctx) {
    const productionChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "Mei",
          "Jun",
          "Jul",
          "Agu",
          "Sep",
          "Okt",
          "Nov",
          "Des",
        ],
        datasets: [
          {
            label: "Produksi (kg)",
            data: [120, 150, 180, 200, 240, 260, 250, 230, 200, 180, 160, 140],
            borderColor: "#2d5a27",
            backgroundColor: "rgba(45, 90, 39, 0.1)",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Produksi (kg)",
            },
          },
          x: {
            title: {
              display: true,
              text: "Bulan",
            },
          },
        },
      },
    });
  }
});

// ====================== //
// DASHBOARD FUNCTIONS    //
// ====================== //

// Dashboard Data Management
let productionChart = null;

document.addEventListener("DOMContentLoaded", function () {
  // Initialize dashboard
  initDashboard();

  // Setup event listeners
  const refreshBtn = document.getElementById("refreshBtn");
  const toggleChartBtn = document.getElementById("toggleChartType");
  const viewReportBtn = document.getElementById("viewReportBtn");

  if (refreshBtn) refreshBtn.addEventListener("click", refreshDashboard);
  if (toggleChartBtn) toggleChartBtn.addEventListener("click", toggleChartType);
  if (viewReportBtn) viewReportBtn.addEventListener("click", viewReport);

  // Auto-refresh every 60 seconds
  setInterval(refreshDashboard, 60000);

  // Listen for storage changes (from other tabs)
  window.addEventListener("storage", function (e) {
    if (
      e.key === "productions" ||
      e.key === "plants" ||
      e.key === "detections"
    ) {
      console.log("Data changed, refreshing dashboard...");
      refreshDashboard();
    }
  });
});

function initDashboard() {
  console.log("Initializing dashboard...");

  // Load all data
  loadDashboardData();
  loadProductionChart();
  loadAlerts();
  loadRecentActivities();
  loadProductionSummary();
  updatePlantStatusOverview();
  updateSystemInfo();

  // Update last update time
  updateLastUpdateTime();
}

function refreshDashboard() {
  console.log("Refreshing dashboard...");

  // Show loading state
  const refreshBtn = document.getElementById("refreshBtn");
  if (refreshBtn) {
    refreshBtn.classList.add("loading");
    refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  }

  // Refresh all components
  setTimeout(() => {
    loadDashboardData();
    loadProductionChart();
    loadAlerts();
    loadRecentActivities();
    loadProductionSummary();
    updatePlantStatusOverview();
    updateSystemInfo();

    // Update last update time
    updateLastUpdateTime();

    // Reset button
    if (refreshBtn) {
      refreshBtn.classList.remove("loading");
      refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
    }

    // Show success message
    showNotification("Dashboard berhasil diperbarui", "success");
  }, 500);
}

function loadDashboardData() {
  // Load plants data
  const plants = JSON.parse(localStorage.getItem("plants")) || [];
  const productions = JSON.parse(localStorage.getItem("productions")) || [];

  // Calculate total plants and area
  let totalPlants = 0;
  let totalArea = 0;
  let activePlants = 0;
  let readyToHarvest = 0;
  let plantStatusCount = {
    aktif: 0,
    panen: 0,
    baru: 0,
    "masa-pemeliharaan": 0,
  };

  plants.forEach((plant) => {
    totalPlants += plant.jumlahBatang || 0;
    totalArea += plant.luasLahan || 0;

    // Count by status
    if (plant.statusTanaman) {
      plantStatusCount[plant.statusTanaman] =
        plantStatusCount[plant.statusTanaman] || 0;
      plantStatusCount[plant.statusTanaman] += plant.jumlahBatang || 0;
    }

    // Count active plants
    if (plant.statusTanaman === "aktif" || plant.statusTanaman === "panen") {
      activePlants += plant.jumlahBatang || 0;
    }

    // Count ready to harvest
    if (plant.statusTanaman === "panen") {
      readyToHarvest += plant.jumlahBatang || 0;
    }
  });

  // Calculate health percentage
  const healthPercentage =
    plants.length > 0 ? Math.round((activePlants / totalPlants) * 100) : 0;

  // Update plant stats
  updateElementText("totalTanaman", `${totalPlants} Batang`);
  updateElementText("activePlantsInfo", `Tanaman aktif: ${activePlants}`);
  updateElementText("healthPercentage", `${healthPercentage}%`);

  const healthBar = document.getElementById("healthBar");
  if (healthBar) healthBar.style.width = `${healthPercentage}%`;

  updateElementText("healthyPlants", activePlants);
  updateElementText("readyToHarvest", readyToHarvest);

  // Update health status
  updateHealthStatus(healthPercentage);

  // Update area
  updateElementText("luasLahan", `${totalArea.toFixed(1)} m²`);

  // Calculate production data
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // This month's production
  const thisMonthProductions = productions.filter((prod) => {
    const prodDate = new Date(prod.tanggal);
    return (
      prodDate.getMonth() === currentMonth &&
      prodDate.getFullYear() === currentYear
    );
  });

  const thisMonthTotal = thisMonthProductions.reduce(
    (sum, prod) => sum + (prod.jumlahProduksi || 0),
    0
  );

  // Total production
  const totalProduction = productions.reduce(
    (sum, prod) => sum + (prod.jumlahProduksi || 0),
    0
  );

  // Calculate productivity rate (grams per plant)
  const productivityRate =
    totalPlants > 0 ? (totalProduction * 1000) / totalPlants : 0;

  // Calculate monthly estimate
  let monthEstimate = 0;
  if (productions.length > 0 && totalPlants > 0) {
    // Group by month
    const monthlyTotals = {};
    productions.forEach((prod) => {
      const prodDate = new Date(prod.tanggal);
      const monthKey = `${prodDate.getFullYear()}-${prodDate.getMonth()}`;

      if (!monthlyTotals[monthKey]) {
        monthlyTotals[monthKey] = 0;
      }
      monthlyTotals[monthKey] += prod.jumlahProduksi || 0;
    });

    const monthsCount = Math.max(1, Object.keys(monthlyTotals).length);
    const avgMonthly =
      Object.values(monthlyTotals).reduce((a, b) => a + b, 0) / monthsCount;

    // Estimate based on active plants
    monthEstimate = (avgMonthly / Math.max(1, totalPlants)) * activePlants;

    // Add ready to harvest estimate
    monthEstimate += readyToHarvest * 0.15; // 150g per plant
  }

  // Update production stats
  updateElementText("estimasiProduksi", `${monthEstimate.toFixed(1)} kg/Bulan`);
  updateElementText("thisMonthProduction", `${thisMonthTotal.toFixed(1)} kg`);
  updateElementText("totalProduction", `${totalProduction.toFixed(1)} kg`);
  updateElementText("productivityRate", `${productivityRate.toFixed(1)} g`);

  // Update plant status counts
  updateElementText("plantStatusAktif", plantStatusCount.aktif || 0);
  updateElementText("plantStatusPanen", plantStatusCount.panen || 0);
  updateElementText("plantStatusBaru", plantStatusCount.baru || 0);
  updateElementText(
    "plantStatusPemeliharaan",
    plantStatusCount["masa-pemeliharaan"] || 0
  );

  // Update record count in footer
  updateElementText(
    "recordCount",
    `Catatan: ${productions.length} produksi, ${plants.length} tanaman`
  );

  // Update welcome message based on time
  updateWelcomeMessage();
}

function updateHealthStatus(percentage) {
  const statusElement = document.getElementById("statusKesehatan");
  if (!statusElement) return;

  const statusContainer = statusElement.parentElement;
  const healthBar = document.getElementById("healthBar");

  if (percentage >= 80) {
    statusElement.textContent = "BAIK";
    statusElement.style.color = "#28a745";
    statusContainer.style.backgroundColor = "#d4edda";
    statusContainer.style.borderLeftColor = "#28a745";
    if (healthBar) healthBar.style.backgroundColor = "#28a745";
  } else if (percentage >= 60) {
    statusElement.textContent = "WASPADA";
    statusElement.style.color = "#ffc107";
    statusContainer.style.backgroundColor = "#fff3cd";
    statusContainer.style.borderLeftColor = "#ffc107";
    if (healthBar) healthBar.style.backgroundColor = "#ffc107";
  } else if (percentage > 0) {
    statusElement.textContent = "KRITIS";
    statusElement.style.color = "#dc3545";
    statusContainer.style.backgroundColor = "#f8d7da";
    statusContainer.style.borderLeftColor = "#dc3545";
    if (healthBar) healthBar.style.backgroundColor = "#dc3545";
  } else {
    statusElement.textContent = "MENUNGGU DATA";
    statusElement.style.color = "#6c757d";
    statusContainer.style.backgroundColor = "#f8f9fa";
    statusContainer.style.borderLeftColor = "#6c757d";
    if (healthBar) healthBar.style.backgroundColor = "#6c757d";
  }
}

function updateWelcomeMessage() {
  const hour = new Date().getHours();
  let greeting = "Selamat siang";

  if (hour < 12) greeting = "Selamat pagi";
  else if (hour < 15) greeting = "Selamat siang";
  else if (hour < 19) greeting = "Selamat sore";
  else greeting = "Selamat malam";

  const welcomeMessage = document.getElementById("welcomeMessage");
  if (welcomeMessage) {
    welcomeMessage.innerHTML = `
            <h3>${greeting}!</h3>
            <p>Selamat datang di NILAMTRACE, sistem monitoring tanaman nilam terpadu. 
            Dashboard ini menampilkan data real-time dari input produksi dan tanaman Anda.</p>
        `;
  }
}

function loadProductionChart() {
  const ctx = document.getElementById("productionChart");
  if (!ctx) return;

  const productions = JSON.parse(localStorage.getItem("productions")) || [];
  const now = new Date();
  const currentYear = now.getFullYear();

  // Group productions by month for current year
  const monthlyData = new Array(12).fill(0);
  const monthlyRevenue = new Array(12).fill(0);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  productions.forEach((prod) => {
    const prodDate = new Date(prod.tanggal);
    if (prodDate.getFullYear() === currentYear) {
      const month = prodDate.getMonth();
      monthlyData[month] += prod.jumlahProduksi || 0;
      monthlyRevenue[month] += prod.totalPendapatan || 0;
    }
  });

  // Update chart period
  updateElementText("chartPeriod", `Jan - Des ${currentYear}`);

  // Create or update chart
  if (productionChart) {
    productionChart.data.datasets[0].data = monthlyData;
    productionChart.data.datasets[1].data = monthlyRevenue;
    productionChart.update();
  } else {
    const chartData = {
      labels: monthNames,
      datasets: [
        {
          label: "Produksi (kg)",
          data: monthlyData,
          borderColor: "#2d5a27",
          backgroundColor: "rgba(45, 90, 39, 0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          yAxisID: "y",
        },
        {
          label: "Pendapatan (Rp)",
          data: monthlyRevenue,
          borderColor: "#ffc107",
          backgroundColor: "rgba(255, 193, 7, 0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          yAxisID: "y1",
          hidden: true,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || "";
              if (label) {
                label += ": ";
              }
              if (context.datasetIndex === 0) {
                label += context.parsed.y.toFixed(1) + " kg";
              } else {
                label += new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(context.parsed.y);
              }
              return label;
            },
          },
        },
      },
      scales: {
        y: {
          type: "linear",
          display: true,
          position: "left",
          title: {
            display: true,
            text: "Produksi (kg)",
          },
          ticks: {
            callback: function (value) {
              return value + " kg";
            },
          },
        },
        y1: {
          type: "linear",
          display: false,
          position: "right",
          title: {
            display: true,
            text: "Pendapatan (Rp)",
          },
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            callback: function (value) {
              if (value >= 1000000) {
                return "Rp" + (value / 1000000).toFixed(1) + "jt";
              }
              return "Rp" + (value / 1000).toFixed(0) + "k";
            },
          },
        },
        x: {
          title: {
            display: true,
            text: "Bulan",
          },
        },
      },
    };

    productionChart = new Chart(ctx, {
      type: "line",
      data: chartData,
      options: chartOptions,
    });
  }
}

function toggleChartType() {
  if (!productionChart) return;

  const currentType = productionChart.config.type;
  const newType = currentType === "line" ? "bar" : "line";

  productionChart.config.type = newType;
  productionChart.update();

  const button = document.getElementById("toggleChartType");
  if (button) {
    button.innerHTML =
      newType === "line"
        ? '<i class="fas fa-chart-bar"></i> Ganti Grafik'
        : '<i class="fas fa-chart-line"></i> Ganti Grafik';
  }

  showNotification(
    `Grafik diubah ke ${newType === "line" ? "garis" : "batang"}`,
    "info"
  );
}

function loadAlerts() {
  const plants = JSON.parse(localStorage.getItem("plants")) || [];
  const productions = JSON.parse(localStorage.getItem("productions")) || [];

  const alertsContainer = document.getElementById("alertsContainer");
  if (!alertsContainer) return;

  let alerts = [];

  // Check for ready to harvest plants
  const readyPlants = plants.filter((p) => p.statusTanaman === "panen");
  if (readyPlants.length > 0) {
    const totalReady = readyPlants.reduce(
      (sum, p) => sum + (p.jumlahBatang || 0),
      0
    );
    alerts.push({
      type: "warning",
      icon: "fa-exclamation-triangle",
      title: "Tanaman Siap Panen",
      message: `${readyPlants.length} blok tanaman (${totalReady} batang) siap dipanen. Segera lakukan panen untuk hasil optimal.`,
    });
  }

  // Check for new plants that need care
  const newPlants = plants.filter((p) => p.statusTanaman === "baru");
  if (newPlants.length > 0) {
    alerts.push({
      type: "info",
      icon: "fa-info-circle",
      title: "Tanaman Baru",
      message: `${newPlants.length} blok tanaman baru memerlukan perawatan intensif. Pastikan penyiraman dan pemupukan rutin.`,
    });
  }

  // Check for low production this month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthProductions = productions.filter((prod) => {
    const prodDate = new Date(prod.tanggal);
    return (
      prodDate.getMonth() === currentMonth &&
      prodDate.getFullYear() === currentYear
    );
  });

  if (thisMonthProductions.length === 0 && productions.length > 0) {
    alerts.push({
      type: "warning",
      icon: "fa-clipboard-list",
      title: "Belum Ada Input Produksi",
      message: `Bulan ${now.toLocaleDateString("id-ID", {
        month: "long",
      })} belum ada data produksi. Segera input data produksi terbaru.`,
    });
  }

  // Check if plants data is empty
  if (plants.length === 0) {
    alerts.push({
      type: "danger",
      icon: "fa-seedling",
      title: "Data Tanaman Kosong",
      message:
        "Belum ada data tanaman. Tambahkan data tanaman melalui menu Input Produksi > Tab Tanaman.",
    });
  }

  // If no alerts, show all good message
  if (alerts.length === 0) {
    alerts.push({
      type: "success",
      icon: "fa-check-circle",
      title: "Semua Sistem Berjalan Baik",
      message:
        "Tidak ada masalah yang terdeteksi. Semua data dan sistem berfungsi dengan normal.",
    });
  }

  // Render alerts
  alertsContainer.innerHTML = "";
  alerts.forEach((alert) => {
    const alertBox = document.createElement("div");
    alertBox.className = "alert-box";

    let borderColor = "#ffc107";
    if (alert.type === "success") borderColor = "#28a745";
    else if (alert.type === "danger") borderColor = "#dc3545";
    else if (alert.type === "info") borderColor = "#17a2b8";

    alertBox.style.borderLeftColor = borderColor;

    alertBox.innerHTML = `
            <div class="alert-icon" style="color: ${borderColor}">
                <i class="fas ${alert.icon}"></i>
            </div>
            <div class="alert-content">
                <h4 style="color: ${
                  alert.type === "success"
                    ? "#155724"
                    : alert.type === "danger"
                    ? "#721c24"
                    : "#856404"
                }">
                    ${alert.title}
                </h4>
                <p style="color: ${
                  alert.type === "success"
                    ? "#155724"
                    : alert.type === "danger"
                    ? "#721c24"
                    : "#856404"
                }">
                    ${alert.message}
                </p>
            </div>
        `;

    alertsContainer.appendChild(alertBox);
  });
}

function loadRecentActivities() {
  const activitiesContainer = document.getElementById("recentActivities");
  if (!activitiesContainer) return;

  const plants = JSON.parse(localStorage.getItem("plants")) || [];
  const productions = JSON.parse(localStorage.getItem("productions")) || [];
  const detections = JSON.parse(localStorage.getItem("detections")) || [];

  let activities = [];

  // Add recent productions
  productions
    .slice(-3)
    .reverse()
    .forEach((prod) => {
      activities.push({
        type: "production",
        icon: "fa-box",
        message: `Input produksi: ${prod.jumlahProduksi} kg ${getProductName(
          prod.jenisProduk
        )}`,
        time: formatTimeAgo(new Date(prod.tanggal)),
      });
    });

  // Add recent plant additions
  plants
    .slice(-2)
    .reverse()
    .forEach((plant) => {
      activities.push({
        type: "plant",
        icon: "fa-seedling",
        message: `Tanaman baru: ${plant.namaVarietas} (${plant.jumlahBatang} batang)`,
        time: formatTimeAgo(new Date(plant.createdAt || plant.tanggalTanam)),
      });
    });

  // Add recent detections
  detections
    .slice(-2)
    .reverse()
    .forEach((detection) => {
      activities.push({
        type: "detection",
        icon: "fa-camera",
        message: `Deteksi penyakit: ${
          detection.penyakit || "Penyakit terdeteksi"
        }`,
        time: formatTimeAgo(new Date(detection.tanggal)),
      });
    });

  // Sort by time (newest first)
  activities.sort((a, b) => new Date(b.time) - new Date(a.time));

  // Take only 5 most recent
  activities = activities.slice(0, 5);

  // If no activities, show message
  if (activities.length === 0) {
    activities.push({
      type: "info",
      icon: "fa-info-circle",
      message:
        "Belum ada aktivitas terbaru. Mulai dengan input data produksi atau tanaman.",
      time: "Sekarang",
    });
  }

  // Render activities
  activitiesContainer.innerHTML = "";
  activities.forEach((activity) => {
    const activityItem = document.createElement("div");
    activityItem.className = "activity-item";

    let iconColor = "#2d5a27";
    if (activity.type === "production") iconColor = "#28a745";
    else if (activity.type === "detection") iconColor = "#dc3545";
    else if (activity.type === "info") iconColor = "#6c757d";

    activityItem.innerHTML = `
            <div class="activity-icon" style="background-color: ${iconColor}20; color: ${iconColor}">
                <i class="fas ${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <p>${activity.message}</p>
                <div class="activity-time">${activity.time}</div>
            </div>
        `;

    activitiesContainer.appendChild(activityItem);
  });
}

function loadProductionSummary() {
  const tableBody = document.getElementById("productionSummaryTable");
  if (!tableBody) return;

  const productions = JSON.parse(localStorage.getItem("productions")) || [];

  if (productions.length === 0) {
    tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    <i class="fas fa-chart-bar"></i><br>
                    Belum ada data produksi
                </td>
            </tr>
        `;
    return;
  }

  // Group by month and product type
  const summary = {};

  productions.forEach((prod) => {
    const date = new Date(prod.tanggal);
    const monthYear = date.toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });
    const productType = getProductName(prod.jenisProduk);

    const key = `${monthYear}|${productType}`;

    if (!summary[key]) {
      summary[key] = {
        month: monthYear,
        product: productType,
        quantity: 0,
        revenue: 0,
        count: 0,
      };
    }

    summary[key].quantity += prod.jumlahProduksi || 0;
    summary[key].revenue += prod.totalPendapatan || 0;
    summary[key].count += 1;
  });

  // Convert to array and sort by month (newest first)
  const summaryArray = Object.values(summary);
  summaryArray.sort((a, b) => {
    // Parse month-year for sorting
    const [aMonth, aYear] = a.month.split(" ");
    const [bMonth, bYear] = b.month.split(" ");

    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const aMonthIndex = months.indexOf(aMonth);
    const bMonthIndex = months.indexOf(bMonth);

    if (aYear !== bYear) return parseInt(bYear) - parseInt(aYear);
    return bMonthIndex - aMonthIndex;
  });

  // Take only top 6 for display
  const displaySummary = summaryArray.slice(0, 6);

  // Render table
  tableBody.innerHTML = "";
  displaySummary.forEach((item) => {
    const avgPrice = item.quantity > 0 ? item.revenue / item.quantity : 0;

    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${item.month}</td>
            <td>${item.product}</td>
            <td>${item.quantity.toFixed(1)} kg</td>
            <td>${formatRupiah(item.revenue)}</td>
            <td>${formatRupiah(avgPrice)}</td>
        `;
    tableBody.appendChild(row);
  });

  // Add total row if there are more items
  if (summaryArray.length > 6) {
    const totalRow = document.createElement("tr");
    totalRow.innerHTML = `
            <td colspan="5" style="text-align: center; font-style: italic; color: #666;">
                Dan ${summaryArray.length - 6} data produksi lainnya...
            </td>
        `;
    tableBody.appendChild(totalRow);
  }
}

function updatePlantStatusOverview() {
  // Update the trends
  const trends = ["trendAktif", "trendPanen", "trendBaru", "trendPemeliharaan"];

  trends.forEach((trendId) => {
    const element = document.getElementById(trendId);
    if (element) {
      // For demo, we'll show random trends
      const change = (Math.random() * 10 - 5).toFixed(1);
      if (change > 0) {
        element.textContent = `+${change}%`;
        element.className = "trend trend-up";
      } else if (change < 0) {
        element.textContent = `${change}%`;
        element.className = "trend trend-down";
      } else {
        element.textContent = "0%";
        element.className = "trend";
      }
    }
  });
}

function updateSystemInfo() {
  const now = new Date();
  const lastUpdateTime =
    localStorage.getItem("lastDashboardUpdate") || now.toISOString();

  updateElementText(
    "systemLastUpdate",
    new Date(lastUpdateTime).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  // Update data info in footer
  updateElementText(
    "dataInfo",
    `Data diperbarui: ${now.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}`
  );

  // Save last update time
  localStorage.setItem("lastDashboardUpdate", now.toISOString());
}

function updateLastUpdateTime() {
  const now = new Date();
  updateElementText(
    "lastUpdateTime",
    `Diperbarui: ${now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })}`
  );
}

function viewReport() {
  showNotification("Membuka laporan produksi...", "info");

  // Simulate opening report
  setTimeout(() => {
    alert(
      "Fitur laporan lengkap akan segera tersedia. Untuk saat ini, Anda dapat melihat ringkasan produksi di tabel di atas."
    );
  }, 500);
}

// Utility functions
function getProductName(code) {
  const products = {
    daun_segar: "Daun Segar",
    minyak_nilam: "Minyak Nilam",
    sabut_nilam: "Sabut Nilam",
    bibit: "Bibit",
  };
  return products[code] || code;
}

function formatTimeAgo(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Baru saja";
  if (diffMins < 60) return `${diffMins} menit yang lalu`;
  if (diffHours < 24) return `${diffHours} jam yang lalu`;
  if (diffDays === 1) return "Kemarin";
  if (diffDays < 7) return `${diffDays} hari yang lalu`;

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
}

function updateElementText(elementId, text) {
  const element = document.getElementById(elementId);
  if (element) element.textContent = text;
}

function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `alert-box`;

  let icon = "fa-info-circle";
  let borderColor = "#17a2b8";

  if (type === "success") {
    icon = "fa-check-circle";
    borderColor = "#28a745";
  } else if (type === "warning") {
    icon = "fa-exclamation-triangle";
    borderColor = "#ffc107";
  } else if (type === "danger") {
    icon = "fa-times-circle";
    borderColor = "#dc3545";
  }

  notification.style.borderLeftColor = borderColor;
  notification.style.position = "fixed";
  notification.style.top = "20px";
  notification.style.right = "20px";
  notification.style.zIndex = "1000";
  notification.style.maxWidth = "300px";
  notification.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";

  notification.innerHTML = `
        <div class="alert-icon" style="color: ${borderColor}">
            <i class="fas ${icon}"></i>
        </div>
        <div class="alert-content">
            <p style="margin: 0;">${message}</p>
        </div>
    `;

  document.body.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transition = "opacity 0.5s";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 500);
  }, 3000);
}

// Initialize dashboard on load
window.addEventListener("load", initDashboard);
// ====================== //
// NAVIGATION CONTROLLER //
// ====================== //

class NavigationController {
    constructor() {
        this.isSidebarOpen = false;
        this.isDropdownOpen = false;
        this.isMobile = window.innerWidth <= 1024;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupResizeHandler();
        this.loadUserData();
        this.updateGreeting();
    }
    
    setupEventListeners() {
        // Hamburger button
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        if (hamburgerBtn) {
            hamburgerBtn.addEventListener('click', () => this.toggleSidebar());
        }
        
        // Close sidebar button
        const closeSidebar = document.getElementById('closeSidebar');
        if (closeSidebar) {
            closeSidebar.addEventListener('click', () => this.closeSidebar());
        }
        
        // Profile dropdown
        const profileBtn = document.getElementById('profileBtn');
        if (profileBtn) {
            profileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown();
            });
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            if (this.isDropdownOpen) {
                this.closeDropdown();
            }
        });
        
        // Close sidebar when clicking overlay
        const overlay = document.getElementById('overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.closeSidebar());
        }
        
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Logout buttons
        const logoutBtns = document.querySelectorAll('#logoutBtn, #sidebarLogout');
        logoutBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        });
        
        // Menu items - close sidebar on mobile
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                if (this.isMobile) {
                    this.closeSidebar();
                }
            });
        });
    }
    
    setupResizeHandler() {
        window.addEventListener('resize', () => {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 1024;
            
            if (wasMobile && !this.isMobile) {
                // Switched to desktop
                this.openSidebar();
            } else if (!wasMobile && this.isMobile) {
                // Switched to mobile
                this.closeSidebar();
            }
        });
    }
    
    toggleSidebar() {
        if (this.isSidebarOpen) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }
    
    openSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        const mainContent = document.getElementById('mainContent');
        
        if (sidebar && overlay) {
            sidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.classList.add('sidebar-active');
            this.isSidebarOpen = true;
            
            // Add focus trap for accessibility
            if (this.isMobile) {
                this.setupFocusTrap(sidebar);
            }
        }
    }
    
    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        
        if (sidebar && overlay) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('sidebar-active');
            this.isSidebarOpen = false;
            
            // Return focus to hamburger button
            const hamburgerBtn = document.getElementById('hamburgerBtn');
            if (hamburgerBtn) {
                hamburgerBtn.focus();
            }
        }
    }
    
    toggleDropdown() {
        const dropdownMenu = document.getElementById('dropdownMenu');
        const profileBtn = document.getElementById('profileBtn');
        
        if (dropdownMenu && profileBtn) {
            dropdownMenu.classList.toggle('show');
            profileBtn.classList.toggle('active');
            this.isDropdownOpen = !this.isDropdownOpen;
        }
    }
    
    closeDropdown() {
        const dropdownMenu = document.getElementById('dropdownMenu');
        const profileBtn = document.getElementById('profileBtn');
        
        if (dropdownMenu && profileBtn) {
            dropdownMenu.classList.remove('show');
            profileBtn.classList.remove('active');
            this.isDropdownOpen = false;
        }
    }
    
    setupFocusTrap(element) {
        // Get all focusable elements
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            firstElement.focus();
            
            // Trap focus inside sidebar
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            lastElement.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            firstElement.focus();
                            e.preventDefault();
                        }
                    }
                }
                
                if (e.key === 'Escape') {
                    this.closeSidebar();
                }
            });
        }
    }
    
    toggleTheme() {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        const themeToggle = document.getElementById('themeToggle');
        
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            const text = themeToggle.querySelector('span');
            
            if (isDarkMode) {
                icon.className = 'fas fa-sun';
                text.textContent = 'Mode Terang';
                localStorage.setItem('theme', 'dark');
            } else {
                icon.className = 'fas fa-moon';
                text.textContent = 'Mode Gelap';
                localStorage.setItem('theme', 'light');
            }
        }
    }
    
    loadUserData() {
        const userData = JSON.parse(localStorage.getItem('user')) || {
            name: 'Petani Nilam',
            email: 'petani@nilam.com',
            village: 'Desa Teuladan'
        };
        
        // Update all profile elements
        document.querySelectorAll('.profile-name, .dropdown-info h4, .user-details h4').forEach(el => {
            el.textContent = userData.name;
        });
        
        const emailElement = document.querySelector('.dropdown-info p');
        if (emailElement) emailElement.textContent = userData.email;
        
        const villageElement = document.querySelector('.user-details p');
        if (villageElement) villageElement.textContent = userData.village;
        
        // Update avatars with initials
        const initials = userData.name.charAt(0).toUpperCase();
        document.querySelectorAll('.profile-avatar, .dropdown-avatar, .user-avatar').forEach(avatar => {
            if (!avatar.querySelector('i')) {
                avatar.innerHTML = `<span>${initials}</span>`;
            }
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) {
                const icon = themeToggle.querySelector('i');
                const text = themeToggle.querySelector('span');
                icon.className = 'fas fa-sun';
                text.textContent = 'Mode Terang';
            }
        }
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
    
    handleLogout() {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            localStorage.removeItem('user');
            window.location.href = '../auth/login.html';
        }
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.navigationController = new NavigationController();
    
    // Auto initialize sidebar on desktop
    if (window.innerWidth > 1024) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.add('active');
        }
    }
});
