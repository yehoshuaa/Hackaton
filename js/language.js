const translations = {
  nl: {
    loginTitle: "Login",
    emailLabel: "E-mail adress",
    passwordLabel: "Wachtwoord",
    forgotPasswordLink: "Wachtwoord vergeten",
    rememberLabel: "Onthoud mij",
    loginButton: "Inloggen",

    accessibilityTitle: "Toegankelijkheid",
    largeTextTitle: "Grote tekst",
    largeTextDesc: "→ Vergroot alle tekst",
    contrastTitle: "Hoog contrast",
    contrastDesc: "→ Betere zichtbaarheid",
    wheelchairTitle: "Rolstoelroute",
    wheelchairDesc: "→ Vermijd trappen",
    languageLabel: "Taal/Language",
    resetBtn: "Reset",
    saveBtn: "Opslaan",

    forgotModalTitle: "Wachtwoord vergeten",
    forgotModalDesc: "vul uw mail in en krijg een tijdelijk wachtwoord",
    forgotEmailLabel: "E-mail adress",
    forgotSendBtn: "Verzenden",

    errorModalTitle: "Inloggen mislukt",
    errorModalDesc: "Uw gebruikersnaam of wachtwoord is onjuist.",
    errorOkBtn: "OK",

    homeTitle: "Home pagina"
  },
  en: {
    loginTitle: "Login",
    emailLabel: "Email address",
    passwordLabel: "Password",
    forgotPasswordLink: "Forgot password",
    rememberLabel: "Remember me",
    loginButton: "Log in",

    accessibilityTitle: "Accessibility",
    largeTextTitle: "Large text",
    largeTextDesc: "→ Enlarge all text",
    contrastTitle: "High contrast",
    contrastDesc: "→ Better visibility",
    wheelchairTitle: "Wheelchair route",
    wheelchairDesc: "→ Avoid stairs",
    languageLabel: "Language",
    resetBtn: "Reset",
    saveBtn: "Save",

    forgotModalTitle: "Forgot password",
    forgotModalDesc: "Enter your email to receive a temporary password",
    forgotEmailLabel: "Email address",
    forgotSendBtn: "Send",

    errorModalTitle: "Login failed",
    errorModalDesc: "Your username or password is incorrect.",
    errorOkBtn: "OK",

    homeTitle: "Home page"
  }
};

function setLanguage(language) {
  localStorage.setItem("selectedLanguage", language);
  applyLanguage(language);
}

function getSavedLanguage() {
  return localStorage.getItem("selectedLanguage") || "nl";
}

function applyLanguage(language) {
  document.documentElement.lang = language;

  const elements = document.querySelectorAll("[data-translate]");

  elements.forEach((element) => {
    const key = element.getAttribute("data-translate");
    if (translations[language] && translations[language][key]) {
      element.textContent = translations[language][key];
    }
  });

  const languageSelect = document.getElementById("languageSelect");
  if (languageSelect) {
    languageSelect.value = language;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const savedLanguage = getSavedLanguage();
  applyLanguage(savedLanguage);
});