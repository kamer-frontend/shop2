// Simplified admin panel functionality
document.addEventListener("DOMContentLoaded", () => {
    console.log("Admin script loaded")
  
    // Check if user is logged in
    if (!sessionStorage.getItem("adminLoggedIn")) {
      window.location.href = "index.html"
      return
    }
  
    // Initialize products array with sample data if empty
    let products = JSON.parse(localStorage.getItem("products")) || [
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
    ]
  
    // Save sample products if not already saved
    if (!localStorage.getItem("products")) {
      localStorage.setItem("products", JSON.stringify(products))
    }
  
    // Get DOM elements
    const addProductBtn = document.querySelector(".add-product-btn")
    const addProductModal = document.getElementById("add-product-modal")
    const productForm = document.getElementById("product-form")
    const categoryTabs = document.querySelectorAll(".category-tab")
    const productTable = document.querySelector(".products-table tbody")
    const logoutBtn = document.getElementById("logout-btn")
    const searchInput = document.querySelector(".search-input")
    const editProductModal = document.getElementById("edit-product-modal") // Add edit modal
  
    console.log("Add Product Button:", addProductBtn)
    console.log("Add Product Modal:", addProductModal)
    console.log("Product Form:", productForm)
  
    // Add product button click handler
    if (addProductBtn) {
      addProductBtn.addEventListener("click", () => {
        console.log("Add product button clicked")
        if (addProductModal) {
          addProductModal.style.display = "block"
        }
      })
    }
  
    // Close modal buttons
    const closeButtons = document.querySelectorAll(".close-modal")
    closeButtons.forEach((button) => {
      button.addEventListener("click", function () {
        console.log("Close button clicked")
        const modal = this.closest(".modal")
        if (modal) {
          modal.style.display = "none"
        }
      })
    })
  
    // Close modal when clicking outside
    window.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal")) {
        e.target.style.display = "none"
      }
    })
  
    // Product form submission
    if (productForm) {
      productForm.addEventListener("submit", function (e) {
        e.preventDefault()
        console.log("Product form submitted")
  
        const formData = new FormData(this)
        const product = {
          id: products.length + 1,
          name: {
            uz: formData.get("name_uz"),
            ru: formData.get("name_ru"),
            en: formData.get("name_en"),
          },
          price: Number.parseInt(formData.get("price")),
          weight: formData.get("weight"),
          category: formData.get("category"),
          image: formData.get("image") || "https://via.placeholder.com/150",
          description: {
            uz: formData.get("description_uz"),
            ru: formData.get("description_ru"),
            en: formData.get("description_en"),
          },
        }
  
        // Add product to array and save
        products.push(product)
        localStorage.setItem("products", JSON.stringify(products))
  
        // Refresh table and close modal
        displayProducts()
        if (addProductModal) {
          addProductModal.style.display = "none"
        }
        this.reset()
      })
    }
  
    // Category filter handling
    categoryTabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        console.log("Category tab clicked:", this.getAttribute("data-category"))
        categoryTabs.forEach((t) => t.classList.remove("active"))
        this.classList.add("active")
  
        const category = this.getAttribute("data-category")
        displayProducts(category)
      })
    })
  
    // Logout button
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault()
        console.log("Logout button clicked")
        sessionStorage.removeItem("adminLoggedIn")
        window.location.href = "index.html"
      })
    }
  
    // Search functionality
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        const searchTerm = this.value.toLowerCase()
        const filteredProducts = products.filter(
          (product) =>
            product.name.uz.toLowerCase().includes(searchTerm) ||
            product.name.ru.toLowerCase().includes(searchTerm) ||
            product.name.en.toLowerCase().includes(searchTerm),
        )
        displayProducts(null, filteredProducts)
      })
    }
  
    // Display products function
    function displayProducts(category = null, productsToDisplay = products) {
      if (!productTable) {
        console.error("Product table not found")
        return
      }
  
      console.log("Displaying products, category:", category)
  
      let filteredProducts = productsToDisplay
      if (category && category !== "all") {
        filteredProducts = productsToDisplay.filter((p) => p.category === category)
      }
  
      productTable.innerHTML = ""
  
      filteredProducts.forEach((product) => {
        const row = document.createElement("tr")
        row.innerHTML = `
                  <td>${product.id}</td>
                  <td><img src="${product.image}" alt="${product.name.uz}" width="50"></td>
                  <td>${product.name.uz}</td>
                  <td>${product.category}</td>
                  <td>${product.price} UZS</td>
                  <td>${product.weight}</td>
                  <td>
                      
                      <button class="delete-btn" data-id="${product.id}">
                          <i class="fas fa-trash"></i>
                      </button>
                  </td>
              `
        productTable.appendChild(row)
      })
  
      // Add event listeners to edit and delete buttons
      document.querySelectorAll(".edit-btn").forEach((button) => {
        button.addEventListener("click", function () {
          const productId = Number.parseInt(this.getAttribute("data-id"))
          console.log("Edit button clicked for product ID:", productId)
          alert("Tahrirlash funksiyasi tez orada qo'shiladi")
        })
      })
  
      document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", function () {
          const productId = Number.parseInt(this.getAttribute("data-id"))
          console.log("Delete button clicked for product ID:", productId)
  
          if (confirm("Mahsulotni o'chirmoqchimisiz?")) {
            products = products.filter((p) => p.id !== productId)
            localStorage.setItem("products", JSON.stringify(products))
            displayProducts()
          }
        })
      })
    }
  
    // Edit modal functionality
    function openEditModal(product) {
      if (!editProductModal) return
  
      // Populate the form with product data
      const editForm = editProductModal.querySelector("#edit-product-form")
      editForm.querySelector('[name="id"]').value = product.id
      editForm.querySelector('[name="name_uz"]').value = product.name.uz
      editForm.querySelector('[name="name_ru"]').value = product.name.ru
      editForm.querySelector('[name="name_en"]').value = product.name.en
      editForm.querySelector('[name="price"]').value = product.price
      editForm.querySelector('[name="weight"]').value = product.weight
      editForm.querySelector('[name="category"]').value = product.category
      editForm.querySelector('[name="image"]').value = product.image
      editForm.querySelector('[name="description_uz"]').value = product.description.uz
      editForm.querySelector('[name="description_ru"]').value = product.description.ru
      editForm.querySelector('[name="description_en"]').value = product.description.en
  
      openModal(editProductModal)
  
      // Handle form submission
      editForm.addEventListener("submit", function (e) {
        e.preventDefault()
  
        const formData = new FormData(this)
        const productId = Number.parseInt(formData.get("id"))
  
        // Update the product in the products array
        products = products.map((p) => {
          if (p.id === productId) {
            return {
              id: productId,
              name: {
                uz: formData.get("name_uz"),
                ru: formData.get("name_ru"),
                en: formData.get("name_en"),
              },
              price: Number.parseInt(formData.get("price")),
              weight: formData.get("weight"),
              category: formData.get("category"),
              image: formData.get("image") || "https://via.placeholder.com/150",
              description: {
                uz: formData.get("description_uz"),
                ru: formData.get("description_ru"),
                en: formData.get("description_en"),
              },
            }
          }
          return p
        })
  
        // Save the updated products array
        localStorage.setItem("products", JSON.stringify(products))
  
        // Refresh the table and close the modal
        displayProducts()
        closeModal(editProductModal)
      })
    }
  
    // Modal handling functions
    function openModal(modal) {
      if (modal) {
        modal.style.display = "block"
      }
    }
  
    function closeModal(modal) {
      if (modal) {
        modal.style.display = "none"
      }
    }
  
    // Initialize products display
    displayProducts()
  
    console.log("Admin script initialization complete")
  
    // Add this code at the end of the DOMContentLoaded event listener
    // Sidebar toggle for mobile
    const sidebarToggle = document.getElementById("sidebar-toggle")
    const adminSidebar = document.querySelector(".admin-sidebar")
  
    if (sidebarToggle && adminSidebar) {
      sidebarToggle.addEventListener("click", () => {
        adminSidebar.classList.toggle("show")
      })
  
      // Close sidebar when clicking outside
      document.addEventListener("click", (e) => {
        if (
          adminSidebar.classList.contains("show") &&
          !adminSidebar.contains(e.target) &&
          e.target !== sidebarToggle &&
          !sidebarToggle.contains(e.target)
        ) {
          adminSidebar.classList.remove("show")
        }
      })
    }
  })
  
  