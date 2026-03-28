const accessibilityOpenBtn = document.getElementById("accessibilityOpenBtn");
const accessibilityModal = document.getElementById("accessibilityModal");

const largeTextToggle = document.getElementById("largeTextToggle");
const contrastToggle = document.getElementById("contrastToggle");
const wheelchairToggle = document.getElementById("wheelchairToggle");
const languageSelect = document.getElementById("languageSelect");

const resetBtn = document.getElementById("resetBtn");
const saveBtn = document.getElementById("saveBtn");

const loginForm = document.getElementById("loginForm");
const forgotPasswordLink = document.getElementById("forgotPasswordLink");

const forgotModal = document.getElementById("forgotModal");
const closeForgotModal = document.getElementById("closeForgotModal");
const forgotForm = document.getElementById("forgotForm");

const errorModal = document.getElementById("errorModal");
const closeErrorModal = document.getElementById("closeErrorModal");
const errorOkBtn = document.getElementById("errorOkBtn");

function openModal(modal) {
  if (modal) {
    modal.classList.add("show");
  }
}

function closeModal(modal) {
  if (modal) {
    modal.classList.remove("show");
  }
}

function applySavedAccessibilitySettings() {
  let preferences = null;

  if (window.campusProfile && typeof window.campusProfile.getPreferences === "function") {
    preferences = window.campusProfile.getPreferences();
  }

  if (preferences) {
    document.body.classList.toggle("large-text", Boolean(preferences.largeText));
    document.body.classList.toggle("high-contrast", Boolean(preferences.highContrast));

    if (largeTextToggle) {
      largeTextToggle.checked = Boolean(preferences.largeText);
    }
    if (contrastToggle) {
      contrastToggle.checked = Boolean(preferences.highContrast);
    }
    if (wheelchairToggle) {
      wheelchairToggle.checked = Boolean(preferences.wheelchairRoute);
    }

    if (languageSelect) {
      languageSelect.value = preferences.language || getSavedLanguage();
    }

    return;
  }

  const savedLargeText = localStorage.getItem("largeText");
  const savedHighContrast = localStorage.getItem("highContrast");
  const savedWheelchair = localStorage.getItem("wheelchairRoute");

  if (savedLargeText === "true") {
    document.body.classList.add("large-text");
    if (largeTextToggle) {
      largeTextToggle.checked = true;
    }
  } else {
    document.body.classList.remove("large-text");
    if (largeTextToggle) {
      largeTextToggle.checked = false;
    }
  }

  if (savedHighContrast === "true") {
    document.body.classList.add("high-contrast");
    if (contrastToggle) {
      contrastToggle.checked = true;
    }
  } else {
    document.body.classList.remove("high-contrast");
    if (contrastToggle) {
      contrastToggle.checked = false;
    }
  }

  if (savedWheelchair === "true") {
    if (wheelchairToggle) {
      wheelchairToggle.checked = true;
    }
  } else {
    if (wheelchairToggle) {
      wheelchairToggle.checked = false;
    }
  }

  if (languageSelect) {
    languageSelect.value = getSavedLanguage();
  }
}

/* POPPETJE */
if (accessibilityOpenBtn) {
  accessibilityOpenBtn.addEventListener("click", () => {
    openModal(accessibilityModal);
  });
}

/* ACCESSIBILITY MODAL SLUITEN */
if (accessibilityModal) {
  accessibilityModal.addEventListener("click", (event) => {
    if (event.target === accessibilityModal) {
      closeModal(accessibilityModal);
    }
  });
}

/* OPSLAAN */
if (saveBtn) {
  saveBtn.addEventListener("click", () => {
    const newPreferences = {
      largeText: largeTextToggle && largeTextToggle.checked,
      highContrast: contrastToggle && contrastToggle.checked,
      wheelchairRoute: wheelchairToggle && wheelchairToggle.checked,
      language: (languageSelect && languageSelect.value) || getSavedLanguage()
    };

    if (window.campusProfile && typeof window.campusProfile.updatePreferences === "function") {
      window.campusProfile.updatePreferences(newPreferences);
    } else {
      if (newPreferences.largeText) {
        document.body.classList.add("large-text");
      } else {
        document.body.classList.remove("large-text");
      }

      if (newPreferences.highContrast) {
        document.body.classList.add("high-contrast");
      } else {
        document.body.classList.remove("high-contrast");
      }

      localStorage.setItem("largeText", newPreferences.largeText ? "true" : "false");
      localStorage.setItem("highContrast", newPreferences.highContrast ? "true" : "false");
      localStorage.setItem("wheelchairRoute", newPreferences.wheelchairRoute ? "true" : "false");
      setLanguage(newPreferences.language);
    }

    closeModal(accessibilityModal);
  });
}

/* RESET */
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    const defaults = {
      largeText: false,
      highContrast: false,
      wheelchairRoute: false,
      language: "nl"
    };

    if (window.campusProfile && typeof window.campusProfile.updatePreferences === "function") {
      window.campusProfile.updatePreferences(defaults);
    } else {
      localStorage.setItem("largeText", "false");
      localStorage.setItem("highContrast", "false");
      localStorage.setItem("wheelchairRoute", "false");
      setLanguage("nl");

      document.body.classList.remove("large-text");
      document.body.classList.remove("high-contrast");
    }

    if (largeTextToggle) {
      largeTextToggle.checked = false;
    }

    if (contrastToggle) {
      contrastToggle.checked = false;
    }

    if (wheelchairToggle) {
      wheelchairToggle.checked = false;
    }
  });
}

/* WACHTWOORD VERGETEN */
if (forgotPasswordLink) {
  forgotPasswordLink.addEventListener("click", (event) => {
    event.preventDefault();
    openModal(forgotModal);
  });
}

if (closeForgotModal) {
  closeForgotModal.addEventListener("click", () => {
    closeModal(forgotModal);
  });
}

if (forgotModal) {
  forgotModal.addEventListener("click", (event) => {
    if (event.target === forgotModal) {
      closeModal(forgotModal);
    }
  });
}

if (forgotForm) {
  forgotForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("forgotEmail").value.trim();
    if (!email) {
      alert("Voer een geldig e-mailadres in.");
      return;
    }

    // Replace with your EmailJS service ID, template ID, and public key from https://www.emailjs.com/
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
      to_email: email,
      reset_link: 'https://yehoshuaa.github.io/Hackaton/reset-password?token=demo' // Replace with actual reset URL
    }, 'YOUR_PUBLIC_KEY')
    .then(() => {
      alert('Reset link verzonden naar je e-mail!');
      closeModal(forgotModal);
    })
    .catch((error) => {
      console.error('EmailJS error:', error);
      alert('Er ging iets mis. Probeer later opnieuw.');
    });
  });
}

/* FOUT POPUP */
if (closeErrorModal) {
  closeErrorModal.addEventListener("click", () => {
    closeModal(errorModal);
  });
}

if (errorOkBtn) {
  errorOkBtn.addEventListener("click", () => {
    closeModal(errorModal);
  });
}

if (errorModal) {
  errorModal.addEventListener("click", (event) => {
    if (event.target === errorModal) {
      closeModal(errorModal);
    }
  });
}

/* LOGIN */
if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    console.log("Login attempt", { email, password });

    // 100% demo gedrag: altijd inloggen, zonder foutmelding.
    sessionStorage.setItem("showStarterGuide", "true");
    window.location.href = "pages/HomePagina.html";
  });
}

/* BIJ LADEN */
document.addEventListener("DOMContentLoaded", () => {
  applySavedAccessibilitySettings();
});
