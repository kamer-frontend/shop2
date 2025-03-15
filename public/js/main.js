// Main JavaScript for Mini Cafe Website

// Define default image for error handling
const DEFAULT_IMAGE = "https://via.placeholder.com/800x400?text=Mini+Kafe"

// Cart functionality
let cart = JSON.parse(localStorage.getItem("cart")) || []

// Load products from localStorage (added in admin panel)
const products = JSON.parse(localStorage.getItem("products")) || [
  // Default products if none exist in localStorage
  {
    id: 1,
    name: {
      uz: "Qahva 1",
      ru: "Кофе 1",
      en: "Coffee 1",
    },
    price: 25000,
    weight: "250g",
    image: "https://via.placeholder.com/150",
    category: "coffee",
    description: {
      uz: "Tavsif 1",
      ru: "Описание 1",
      en: "Description 1",
    },
  },
  {
    id: 2,
    name: {
      uz: "Choy 1",
      ru: "Чай 1",
      en: "Tea 1",
    },
    price: 15000,
    weight: "50g",
    image: "https://via.placeholder.com/150",
    category: "tea",
    description: {
      uz: "Tavsif 2",
      ru: "Описание 2",
      en: "Description 2",
    },
  },
  {
    id: 3,
    name: {
      uz: "Desert 1",
      ru: "Десерт 1",
      en: "Dessert 1",
    },
    price: 30000,
    weight: "100g",
    image: "https://via.placeholder.com/150",
    category: "dessert",
    description: {
      uz: "Tavsif 3",
      ru: "Описание 3",
      en: "Description 3",
    },
  },
]

// Import translations
import { translations } from "./translations.js"

// Initialize navMenu variable globally
let navMenu = null

// Declare Telegram functions
let sendToTelegram
let formatOrderMessage

// Try to import Telegram functions if available
try {
  import("./telegram.js")
    .then((module) => {
      sendToTelegram = module.sendToTelegram
      formatOrderMessage = module.formatOrderMessage
      console.log("Telegram module loaded successfully")
    })
    .catch((err) => {
      console.error("Error loading Telegram module:", err)
    })
} catch (error) {
  console.error("Error importing Telegram module:", error)
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded")

  // Initialize navMenu after DOM is loaded
  navMenu = document.querySelector("nav ul")

  // Telegram login button
  const telegramLoginBtn = document.querySelector(".telegram-btn")
  if (telegramLoginBtn) {
    telegramLoginBtn.addEventListener("click", (e) => {
      e.preventDefault()
      console.log("Telegram login clicked")
      alert("Telegram login feature coming soon!")
    })
  }

  // Mobile menu toggle with proper error handling
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      navMenu.classList.toggle("show")
    })

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (navMenu.classList.contains("show") && !navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        navMenu.classList.remove("show")
      }
    })
  }

  // Image error handling
  const images = document.querySelectorAll("img")
  images.forEach((img) => {
    img.onerror = function () {
      this.src = "https://via.placeholder.com/150?text=Image+Not+Found"
      this.alt = "Image not found"
    }
  })

  // Initialize cart icon
  const cartIcon = document.querySelector(".cart-icon")
  if (cartIcon) {
    cartIcon.addEventListener("click", () => {
      openCartModal()
    })
  }

  // Initialize order button
  const orderBtn = document.querySelector(".order-btn")
  if (orderBtn) {
    orderBtn.addEventListener("click", () => {
      openCartModal()
    })
  }

  // Initialize language buttons
  const langButtons = document.querySelectorAll(".lang-btn")
  langButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault()
      const lang = this.getAttribute("data-lang")
      setLanguage(lang)

      // Update active class
      langButtons.forEach((btn) => btn.classList.remove("active"))
      this.classList.add("active")
    })
  })

  // Initialize filter buttons
  const filterButtons = document.querySelectorAll(".filter-btn")
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const category = this.getAttribute("data-category")

      // Update active class
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      this.classList.add("active")

      // Filter products
      filterProducts(category)
    })
  })

  // Initialize UI
  initializeUI()

  // Add event listener for cart modal
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("decrease-quantity")) {
      const cartItem = e.target.closest(".cart-item")
      if (cartItem) {
        const productId = Number.parseInt(cartItem.dataset.id)
        decreaseQuantity(productId)
      }
    } else if (e.target.classList.contains("increase-quantity")) {
      const cartItem = e.target.closest(".cart-item")
      if (cartItem) {
        const productId = Number.parseInt(cartItem.dataset.id)
        increaseQuantity(productId)
      }
    } else if (e.target.classList.contains("remove-item")) {
      const cartItem = e.target.closest(".cart-item")
      if (cartItem) {
        const productId = Number.parseInt(cartItem.dataset.id)
        removeFromCart(productId)
      }
    }
  })
})

// Modal handling functions
function showModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.style.display = "block"
  }
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.style.display = "none"
  }
}

// Handle login button clicks
document.addEventListener("click", (e) => {
  if (e.target.id === "login-button" || e.target.closest("#login-button")) {
    showModal("login-modal")
  }
})

// Close modal when clicking on close button or outside
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("close-modal")) {
    const modal = e.target.closest(".modal")
    if (modal) {
      modal.style.display = "none"
    }
  } else if (e.target.classList.contains("modal")) {
    e.target.style.display = "none"
  }
})

// Function for setting language
function setLanguage(lang) {
  localStorage.setItem("language", lang)
  document.documentElement.setAttribute("lang", lang)

  // Update content based on language
  updateContent(lang)
}

function updateContent(lang) {
  // Update UI elements with translations
  const elements = document.querySelectorAll("[data-translate]")
  elements.forEach((element) => {
    const key = element.getAttribute("data-translate")
    if (translations[lang] && translations[lang][key]) {
      element.textContent = translations[lang][key]
    }
  })

  // Update placeholders
  const placeholders = document.querySelectorAll("[data-translate-placeholder]")
  placeholders.forEach((element) => {
    const key = element.getAttribute("data-translate-placeholder")
    if (translations[lang] && translations[lang][key]) {
      element.placeholder = translations[lang][key]
    }
  })

  // Re-initialize products to update language-specific content
  initializeProducts()

  // Update cart display if open
  if (document.getElementById("cart-modal").style.display === "block") {
    openCartModal()
  }
}

function initializeUI() {
  // Set initial language
  const currentLang = localStorage.getItem("language") || "uz"
  setLanguage(currentLang)

  // Update cart count
  updateCartCount()

  // Initialize products if on menu page
  if (document.querySelector(".products-container")) {
    initializeProducts()
  }
}

// Function to initialize products
function initializeProducts() {
  const productsContainer = document.querySelector(".products-container")
  if (!productsContainer) return

  console.log("Initializing products:", products.length)

  // Get current language
  const currentLang = localStorage.getItem("language") || "uz"

  // Clear container
  productsContainer.innerHTML = ""

  // Add products with improved media structure
  products.forEach((product) => {
    const productCard = document.createElement("div")
    productCard.className = "product-card"
    productCard.setAttribute("data-category", product.category)

    productCard.innerHTML = `
      <div class="product-media">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name[currentLang]}" onerror="this.src='${DEFAULT_IMAGE}'">
        </div>
        <div class="product-badge ${product.category}">
          <span>${getCategoryName(product.category, currentLang)}</span>
        </div>
      </div>
      <div class="product-info">
        <h3>${product.name[currentLang]}</h3>
        <div class="product-meta">
          <span class="product-price">${product.price.toLocaleString()} ${
            translations[currentLang]?.currency || "UZS"
          }</span>
          <span class="product-weight">${product.weight}</span>
        </div>
        <p class="product-description">${product.description[currentLang]}</p>
        <div class="product-actions">
       
        </div>
      </div>
    `

    productsContainer.appendChild(productCard)
  })

  // Add event listeners to add-to-cart buttons
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = Number.parseInt(this.getAttribute("data-id"))
      addToCart(productId)
    })
  })
}

// Helper function to get category name in current language
function getCategoryName(category, lang) {
  const categoryMap = {
    coffee: {
      uz: "Qahva",
      ru: "Кофе",
      en: "Coffee",
    },
    tea: {
      uz: "Choy",
      ru: "Чай",
      en: "Tea",
    },
    dessert: {
      uz: "Desert",
      ru: "Десерт",
      en: "Dessert",
    },
  }

  return categoryMap[category]?.[lang] || category
}

// Function to filter products
function filterProducts(category) {
  const productCards = document.querySelectorAll(".product-card")

  console.log("Filtering products by category:", category)

  productCards.forEach((card) => {
    if (category === "all" || card.getAttribute("data-category") === category) {
      card.style.display = ""
    } else {
      card.style.display = "none"
    }
  })
}

// Function to add product to cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId)

  if (product) {
    const existingItem = cart.find((item) => item.id === productId)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        weight: product.weight,
        image: product.image,
        quantity: 1,
      })
    }

    // Save cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart))

    // Update cart count
    updateCartCount()

    // Animate cart icon
    const cartIcon = document.querySelector(".cart-icon")
    if (cartIcon) {
      cartIcon.classList.add("cart-added")
      setTimeout(() => {
        cartIcon.classList.remove("cart-added")
      }, 1000)
    }

    // Show success message
    const currentLang = localStorage.getItem("language") || "uz"
    alert(translations[currentLang]?.addedToCart || "Product added to cart!")
  }
}

// Function to update cart count
function updateCartCount() {
  const cartCount = document.querySelector(".cart-count")

  if (cartCount) {
    const count = cart.reduce((total, item) => total + item.quantity, 0)
    cartCount.textContent = count

    if (count > 0) {
      cartCount.style.display = "flex"
    } else {
      cartCount.style.display = "none"
    }
  }
}

// Function to open cart modal with improved media structure
function openCartModal() {
  const modal = document.getElementById("cart-modal")
  if (!modal) return

  const currentLang = localStorage.getItem("language") || "uz"
  const cartItems = modal.querySelector(".cart-items")
  const totalAmount = modal.querySelector(".total-amount")
  const orderForm = modal.querySelector("#order-form")

  if (!cartItems || !totalAmount || !orderForm) {
    console.error("Cart modal elements not found")
    return
  }

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <p>${translations[currentLang]?.emptyCart || "Your cart is empty"}</p>
      </div>
    `
    orderForm.style.display = "none"
    totalAmount.textContent = formatPrice(0)
  } else {
    cartItems.innerHTML = ""

    cart.forEach((item) => {
      const cartItemElement = document.createElement("div")
      cartItemElement.className = "cart-item"
      cartItemElement.dataset.id = item.id

      // Get product name in current language or fallback to any available language
      let productName = ""
      if (item.name && item.name[currentLang]) {
        productName = item.name[currentLang]
      } else if (item.name) {
        // Fallback to any available language
        for (const lang in item.name) {
          if (item.name[lang]) {
            productName = item.name[lang]
            break
          }
        }
      } else {
        productName = "Product"
      }

      cartItemElement.innerHTML = `
        <div class="cart-item-media">
          <img src="${item.image || DEFAULT_IMAGE}" alt="${productName}" onerror="this.src='${DEFAULT_IMAGE}'">
        </div>
        <div class="cart-item-details">
          <div class="cart-item-name">${productName}</div>
          <div class="cart-item-price">${formatPrice(item.price)}</div>
        </div>
        <div class="quantity-controls">
          <button type="button" class="quantity-btn decrease-quantity">-</button>
          <span class="quantity-value">${item.quantity}</span>
          <button type="button" class="quantity-btn increase-quantity">+</button>
        </div>
        <div class="cart-item-total">${formatPrice(item.price * item.quantity)}</div>
        <button type="button" class="remove-item">&times;</button>
      `

      cartItems.appendChild(cartItemElement)
    })

    orderForm.style.display = "block"
    totalAmount.textContent = formatPrice(calculateTotal())
  }

  modal.style.display = "block"
}

// Function to calculate total
function calculateTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0)
}

// Function to decrease quantity
function decreaseQuantity(productId) {
  const item = cart.find((item) => item.id === productId)

  if (item) {
    if (item.quantity > 1) {
      item.quantity -= 1
      // Save cart to localStorage
      localStorage.setItem("cart", JSON.stringify(cart))
      updateCartCount()
      openCartModal() // Refresh modal
    }
  }
}

// Function to increase quantity
function increaseQuantity(productId) {
  const item = cart.find((item) => item.id === productId)

  if (item) {
    item.quantity += 1
    // Save cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart))
    updateCartCount()
    openCartModal() // Refresh modal
  }
}

// Function to remove from cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  // Save cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()
  openCartModal() // Refresh modal
}

// Function to format price
function formatPrice(price) {
  return price.toLocaleString("uz-UZ") + " UZS"
}

// Handle order submission
async function handleOrderSubmission(orderData) {
  try {
    // Show loading state
    const submitButton = document.querySelector(".submit-order")
    if (!submitButton) return { success: false }

    const buttonText = submitButton.querySelector("span")
    const loadingSpinner = submitButton.querySelector(".loading-spinner")

    if (buttonText) buttonText.style.opacity = "0"
    if (loadingSpinner) loadingSpinner.style.display = "inline-block"
    submitButton.disabled = true

    if (typeof sendToTelegram === "function" && typeof formatOrderMessage === "function") {
      const message = formatOrderMessage(orderData)
      const result = await sendToTelegram(message)
      return { success: result }
    } else {
      // Simulate success if Telegram functions not available
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("Order submitted:", orderData)
          resolve({ success: true })
        }, 1000)
      })
    }
  } catch (error) {
    console.error("Error submitting order:", error)
    return { success: false }
  } finally {
    // Reset button state
    const submitButton = document.querySelector(".submit-order")
    if (submitButton) {
      const buttonText = submitButton.querySelector("span")
      const loadingSpinner = submitButton.querySelector(".loading-spinner")

      if (buttonText) buttonText.style.opacity = "1"
      if (loadingSpinner) loadingSpinner.style.display = "none"
      submitButton.disabled = false
    }
  }
}

// Error handling
window.addEventListener("error", (e) => {
  console.error("Error:", e.error)
})

// Order form submission
document.addEventListener("submit", async (e) => {
  if (e.target.id === "order-form") {
    e.preventDefault()

    // Get form data
    const name = document.getElementById("customer-name").value
    const phone = document.getElementById("customer-phone").value
    const address = document.getElementById("customer-address").value
    const comment = document.getElementById("order-comment")?.value || ""

    // Create order data
    const currentLang = localStorage.getItem("language") || "uz"
    const orderData = {
      customer: name,
      phone: phone,
      address: address,
      comment: comment,
      items: cart.map((item) => {
        // Get product name in current language or fallback to any available language
        let productName = ""
        if (item.name && item.name[currentLang]) {
          productName = item.name[currentLang]
        } else if (item.name) {
          // Fallback to any available language
          for (const lang in item.name) {
            if (item.name[lang]) {
              productName = item.name[lang]
              break
            }
          }
        } else {
          productName = "Product"
        }

        return {
          id: item.id,
          name: productName,
          price: item.price,
          quantity: item.quantity,
        }
      }),
      total: calculateTotal(),
    }

    // Send order
    const result = await handleOrderSubmission(orderData)

    if (result.success) {
      // Clear cart
      cart = []
      localStorage.setItem("cart", JSON.stringify(cart))
      updateCartCount()

      // Show success message
      const currentLang = localStorage.getItem("language") || "uz"

      // Replace form with success message
      const orderForm = document.getElementById("order-form")
      const successMessage = document.createElement("div")
      successMessage.className = "order-success"
      successMessage.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <h3>${translations[currentLang]?.order?.success || "Your order has been placed successfully!"}</h3>
        <p>${translations[currentLang]?.order?.successMessage || "We will contact you shortly to confirm your order."}</p>
        <button class="close-modal">${translations[currentLang]?.close || "Close"}</button>
      `

      if (orderForm && orderForm.parentNode) {
        orderForm.parentNode.replaceChild(successMessage, orderForm)

        // Add event listener to close button
        const closeButton = successMessage.querySelector(".close-modal")
        if (closeButton) {
          closeButton.addEventListener("click", () => {
            hideModal("cart-modal")

            // Restore order form after modal is closed
            setTimeout(() => {
              if (successMessage.parentNode) {
                successMessage.parentNode.replaceChild(orderForm, successMessage)
              }
            }, 300)
          })
        }
      }
    } else {
      // Show error message
      const currentLang = localStorage.getItem("language") || "uz"
      alert(translations[currentLang]?.order?.error || "There was an error placing your order. Please try again.")
    }
  }
})

// Add to cart event delegation
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart") || e.target.closest(".add-to-cart")) {
    const button = e.target.classList.contains("add-to-cart") ? e.target : e.target.closest(".add-to-cart")
    const productId = Number.parseInt(button.getAttribute("data-id"))
    addToCart(productId)
  }
})

// Export functions for use in other modules
export { addToCart, removeFromCart, updateCartCount, openCartModal, calculateTotal }

