// This function runs when Add Medicine button is clicked
function addMedicine() {

  // Step 1 - Read what the user typed in the form
  const name = document.getElementById("medicineName").value;
  const batch = document.getElementById("batchNumber").value;
  const quantity = document.getElementById("quantity").value;
  const unit = document.getElementById("unit").value;
  const expiry = document.getElementById("expiryDate").value;

  // Step 2 - Check that all fields are filled
  if (!name || !batch || !quantity || !expiry) {
    alert("Please fill in all fields!");
    return;
  }

  // Step 3 - Calculate status based on expiry date
  const status = getStatus(expiry);

  // Step 4 - Create a new card and add it to the list
  const list = document.getElementById("medicineList");

  const card = document.createElement("div");
  card.className = "medicine-card";

  card.innerHTML = `
    <h3>${name}</h3>
    <p>Batch: <strong>${batch}</strong></p>
    <p>Quantity: <strong>${quantity} ${unit}</strong></p>
    <p>Expiry: <strong>${expiry}</strong></p>
    <span class="badge ${status.class}">${status.label}</span>
  `;

  list.prepend(card);

  // Step 5 - Clear the form after adding
  document.getElementById("medicineName").value = "";
  document.getElementById("batchNumber").value = "";
  document.getElementById("quantity").value = "";
  document.getElementById("expiryDate").value = "";

}

// This function calculates if medicine is safe, expiring, or expired
function getStatus(expiryDate) {
  const today = new Date();
  const expiry = new Date(expiryDate);

  // Calculate difference in days
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