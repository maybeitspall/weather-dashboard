// utilities.js (file baru di assets/js/)
function formatNumber(number) {
  return new Intl.NumberFormat("id-ID").format(number);
}

function formatWeight(kg) {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(1)} ton`;
  }
  return `${kg.toFixed(1)} kg`;
}

function calculateProductivity(plants, productions) {
  if (plants.length === 0) return 0;

  const totalPlants = plants.reduce(
    (sum, plant) => sum + (plant.jumlahBatang || 0),
    0
  );

  if (totalPlants === 0) return 0;

  const totalProduction = productions.reduce(
    (sum, prod) => sum + (prod.jumlahProduksi || 0),
    0
  );

  const monthsWithData = new Set();
  productions.forEach((prod) => {
    const date = new Date(prod.tanggal);
    monthsWithData.add(`${date.getFullYear()}-${date.getMonth()}`);
  });

  const monthsCount = Math.max(1, monthsWithData.size);
  const avgMonthlyProduction = totalProduction / monthsCount;

  return (avgMonthlyProduction / totalPlants) * 1000; // gram per tanaman
}

// Tambahkan ke main.js
document.addEventListener("DOMContentLoaded", function () {
  // Update statistik detail
  updateDetailedStats();
});

function updateDetailedStats() {
  const plants = JSON.parse(localStorage.getItem("plants")) || [];
  const productions = JSON.parse(localStorage.getItem("productions")) || [];

  // Hitung produktivitas (gram per tanaman)
  const productivity = calculateProductivity(plants, productions);

  // Update jika ada elemen produktivitas
  const prodElement = document.getElementById("produktivitasTanaman");
  if (prodElement) {
    prodElement.textContent = `${productivity.toFixed(1)} g/tanaman`;
  }

  // Update statistik lainnya
  const totalPlants = plants.reduce(
    (sum, plant) => sum + (plant.jumlahBatang || 0),
    0
  );
  const totalProductions = productions.reduce(
    (sum, prod) => sum + (prod.jumlahProduksi || 0),
    0
  );

  document.getElementById(
    "totalProduksiKumulatif"
  ).textContent = `${formatWeight(totalProductions)}`;
}
