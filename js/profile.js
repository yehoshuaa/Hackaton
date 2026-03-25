const popup = document.getElementById("passwordPopup");
const openBtn = document.getElementById("openPopupBtn");
const saveBtn = document.getElementById("saveBtn");

// Popup openen
openBtn.addEventListener("click", () => {
    popup.style.display = "flex";
});

// Popup sluiten met opslaan
saveBtn.addEventListener("click", () => {
    const newPassword = document.getElementById("newPassword").value;
    const repeatPassword = document.getElementById("repeatPassword").value;

    if (newPassword === repeatPassword) {
        alert("Wachtwoord gewijzigd!");
        popup.style.display = "none";
    } else {
        alert("Wachtwoorden komen niet overeen!");
    }
});

// Klik buiten popup = sluiten
window.addEventListener("click", (e) => {
    if (e.target === popup) {
        popup.style.display = "none";
    }
});

const locationRow = document.getElementById("locationRow");
const dropdown = document.getElementById("locationDropdown");
const selectedLocation = document.getElementById("selectedLocation");

// Dropdown open/dicht
locationRow.addEventListener("click", () => {
    if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
    } else {
        dropdown.style.display = "block";
    }
});

// Locatie kiezen
document.querySelectorAll(".dropdown-item").forEach(item => {
    item.addEventListener("click", () => {
        selectedLocation.textContent = item.textContent + " ›";
        dropdown.style.display = "none";
    });
});