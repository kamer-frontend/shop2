// Language switcher functionality
import { translations } from "./translations.js"

document.addEventListener("DOMContentLoaded", () => {
  // Default language
  const currentLang = localStorage.getItem("language") || "uz"

  // Set initial language
  setLanguage(currentLang)

  // Language switcher buttons
  const langButtons = document.querySelectorAll(".lang-btn")

  langButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const lang = this.getAttribute("data-lang")
      setLanguage(lang)

      // Update active class
      langButtons.forEach((btn) => btn.classList.remove("active"))
      this.classList.add("active")

      // Save language preference
      localStorage.setItem("language", lang)
    })

    // Set active class on page load
    if (button.getAttribute("data-lang") === currentLang) {
      button.classList.add("active")
    }
  })
})

// Function to set language
function setLanguage(lang) {
  if (!translations[lang]) return

  // Update text content for elements with data-i18n attribute
  const elements = document.querySelectorAll("[data-translate]")
  elements.forEach((element) => {
    const key = element.getAttribute("data-translate")

    if (translations[lang][key] !== undefined) {
      element.textContent = translations[lang][key]
    }
  })

  // Update placeholders for inputs with data-i18n-placeholder attribute
  const inputs = document.querySelectorAll("[data-translate-placeholder]")
  inputs.forEach((input) => {
    const key = input.getAttribute("data-translate-placeholder")

    if (translations[lang][key] !== undefined) {
      input.placeholder = translations[lang][key]
    }
  })
}

