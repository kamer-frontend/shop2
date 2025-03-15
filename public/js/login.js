// Login functionality
document.addEventListener("DOMContentLoaded", () => {
  console.log("Login script loaded")

  // Get login form and modal elements
  const loginForm = document.getElementById("login-form")
  const loginButton = document.getElementById("login-button")
  const loginModal = document.getElementById("login-modal")
  const telegramLoginBtn = document.querySelector(".telegram-btn")

  // Show login modal when login button is clicked
  if (loginButton) {
    loginButton.addEventListener("click", () => {
      console.log("Login button clicked")
      if (loginModal) {
        loginModal.style.display = "block"
      }
    })
  }

  // Handle Telegram login button
  if (telegramLoginBtn) {
    telegramLoginBtn.addEventListener("click", (e) => {
      e.preventDefault()
      console.log("Telegram login clicked")
      alert("Telegram login feature coming soon!")
    })
  }

  // Handle login form submission
  if (loginForm) {
    console.log("Login form found")

    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()
      console.log("Login form submitted")

      // Get username and password values
      const username = document.getElementById("username")
      const password = document.getElementById("password")

      if (!username || !password) {
        console.error("Username or password field not found")
        return
      }

      const usernameValue = username.value.trim()
      const passwordValue = password.value.trim()

      console.log("Login attempt:", usernameValue)

      // Simple authentication (in a real app, this would be more secure)
      if (usernameValue === "admin" && passwordValue === "admin123") {
        console.log("Login successful")
        sessionStorage.setItem("adminLoggedIn", "true")
        window.location.href = "admin.html"
      } else {
        console.log("Login failed")
        alert("Noto'g'ri login yoki parol") // Invalid username or password in Uzbek
      }
    })
  } else {
    console.error("Login form not found")
  }

  // Close modal when clicking on close button or outside
  const closeButtons = document.querySelectorAll(".close-modal")
  closeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const modal = this.closest(".modal")
      if (modal) {
        modal.style.display = "none"
      }
    })
  })

  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      e.target.style.display = "none"
    }
  })
})

