// ==============================
// 1. WHEN PAGE LOADS - show saved medicines
// ==============================
window.onload = function() {
  loadMedicines();
};

// ==============================
// 2. ADD MEDICINE - runs when button clicked
// ==============================
function addMedicine() {

  // Read form values
  const name = document.getElementById("medicineName").value;
  const batch = document.getElementById("batchNumber").value;
  const quantity = document.getElementById("quantity").value;
  const unit = document.getElementById("unit").value;
  const expiry = document.getElementById("expiryDate").value;

  // Check all fields filled
  if (!name || !batch || !quantity || !expiry) {
    alert("Please fill in all fields!");
    return;
  }

  // Create medicine object
  const medicine = {
    name: name,
    batch: batch,
    quantity: quantity,
    unit: unit,
    expiry: expiry
  };

  // Get existing medicines from localStorage
  const medicines = getSavedMedicines();

  // Add new medicine to the list
  medicines.push(medicine);

  // Save updated list back to localStorage
  localStorage.setItem("medicines", JSON.stringify(medicines));

  // Show the new card on screen
  displayCard(medicine, true);

  // Clear the form
  document.getElementById("medicineName").value = "";
  document.getElementById("batchNumber").value = "";
  document.getElementById("quantity").value = "";
  document.getElementById("expiryDate").value = "";

}

// ==============================
// 3. LOAD - read from localStorage and show all cards
// ==============================
function loadMedicines() {
  const medicines = getSavedMedicines();

  // Remove the 3 hardcoded cards first
  const list = document.getElementById("medicineList");
  list.innerHTML = "";

  // Show each saved medicine
  medicines.forEach(function(medicine) {
    displayCard(medicine, false);
  });
}

// ==============================
// 4. DISPLAY - create and show one card
// ==============================
function displayCard(medicine, addToTop) {
  const status = getStatus(medicine.expiry);
  const list = document.getElementById("medicineList");

  const card = document.createElement("div");
  card.className = "medicine-card";

  card.innerHTML = `
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
// 5. GET SAVED - read medicines array from localStorage
// ==============================
function getSavedMedicines() {
  const saved = localStorage.getItem("medicines");

  // If nothing saved yet, return empty array
  if (!saved) {
    return [];
  }

  // Convert text back to array
  return JSON.parse(saved);
}

// ==============================
// 6. STATUS - calculate badge from expiry date
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