// ==============================
// 1. WHEN PAGE LOADS
// ==============================
window.onload = function() {
  loadMedicines();
};

// ==============================
// 2. ADD MEDICINE
// ==============================
function addMedicine() {

  const name = document.getElementById("medicineName").value;
  const batch = document.getElementById("batchNumber").value;
  const quantity = document.getElementById("quantity").value;
  const unit = document.getElementById("unit").value;
  const expiry = document.getElementById("expiryDate").value;

  if (!name || !batch || !quantity || !expiry) {
    alert("Please fill in all fields!");
    return;
  }

  const medicine = {
    id: Date.now(), // unique ID for each medicine
    name: name,
    batch: batch,
    quantity: quantity,
    unit: unit,
    expiry: expiry
  };

  const medicines = getSavedMedicines();
  medicines.push(medicine);
  localStorage.setItem("medicines", JSON.stringify(medicines));

  displayCard(medicine, true);
  updateDashboard();

  document.getElementById("medicineName").value = "";
  document.getElementById("batchNumber").value = "";
  document.getElementById("quantity").value = "";
  document.getElementById("expiryDate").value = "";
}

// ==============================
// 3. DELETE MEDICINE
// ==============================
function deleteMedicine(id) {
  // Get saved medicines
  let medicines = getSavedMedicines();

  // Remove the one with matching id
  medicines = medicines.filter(function(m) {
    return m.id !== id;
  });

  // Save updated list
  localStorage.setItem("medicines", JSON.stringify(medicines));

  // Reload all cards
  loadMedicines();
}

// ==============================
// 4. LOAD ALL MEDICINES
// ==============================
function loadMedicines() {
  const medicines = getSavedMedicines();
  const list = document.getElementById("medicineList");
  list.innerHTML = "";

  medicines.forEach(function(medicine) {
    displayCard(medicine, false);
  });

  updateDashboard();
}

// ==============================
// 5. DISPLAY ONE CARD
// ==============================
function displayCard(medicine, addToTop) {
  const status = getStatus(medicine.expiry);
  const list = document.getElementById("medicineList");

  const card = document.createElement("div");
  card.className = "medicine-card";

  card.innerHTML = `
    <button class="btn-delete" onclick="deleteMedicine(${medicine.id})">Delete</button>
    <h3>${medicine.name}</h3>
    <p>Batch: <strong>${medicine.batch}</strong></p>
    <p>Quantity: <strong>${medicine.quantity} ${medicine.unit}</strong></p>
    <p>Expiry: <strong>${medicine.expiry}</strong></p>
    <span class="badge ${status.class}">${status.label}</span>
  `;

  if (addToTop) {
    list.prepend(card);
  } else {
    list.appendChild(card);
  }
}

// ==============================
// 6. UPDATE DASHBOARD COUNTS
// ==============================
function updateDashboard() {
  const medicines = getSavedMedicines();

  let safe = 0;
  let expiring = 0;
  let expired = 0;

  medicines.forEach(function(medicine) {
    const status = getStatus(medicine.expiry);
    if (status.class === "safe") safe++;
    else if (status.class === "expiring") expiring++;
    else if (status.class === "expired") expired++;
  });

  document.getElementById("countSafe").textContent = safe;
  document.getElementById("countExpiring").textContent = expiring;
  document.getElementById("countExpired").textContent = expired;
}

// ==============================
// 7. GET SAVED MEDICINES
// ==============================
function getSavedMedicines() {
  const saved = localStorage.getItem("medicines");
  if (!saved) return [];
  return JSON.parse(saved);
}

// ==============================
// 8. GET STATUS
// ==============================
function getStatus(expiryDate) {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { class: "expired", label: "Expired" };
  } else if (diffDays <= 30) {
    return { class: "expiring", label: "Expiring Soon" };
  } else {
    return { class: "safe", label: "Safe" };
  }
}