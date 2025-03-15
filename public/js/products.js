// products.js
import { translations } from './translations.js';

// Sample products data
const products = [
    {
        id: 1,
        name: {
            uz: "Osh",
            ru: "Плов",
            en: "Pilaf"
        },
        category: "food",
        price: 35000,
        weight: "400g",
        description: {
            uz: "An'anaviy o'zbek oshi guruch, go'sht va sabzavotlar bilan",
            ru: "Традиционный узбекский плов с рисом, мясом и овощами",
            en: "Traditional Uzbek pilaf with rice, meat, and vegetables"
        },
        image: "img/products/pilaf.jpg"
    },
    {
        id: 2,
        name: {
            uz: "Lag'mon",
            ru: "Лагман",
            en: "Lagman"
        },
        category: "food",
        price: 30000,
        weight: "450g",
        description: {
            uz: "Qo'l bilan tayyorlangan uzun makaron, go'sht va sabzavotlar bilan",
            ru: "Длинная домашняя лапша с мясом и овощами",
            en: "Hand-pulled noodles with meat and vegetables"
        },
        image: "img/products/lagman.jpg"
    },
    {
        id: 3,
        name: {
            uz: "Shashlik",
            ru: "Шашлык",
            en: "Shashlik"
        },
        category: "food",
        price: 40000,
        weight: "250g",
        description: {
            uz: "Ko'mirda pishirilgan mol go'shti shashlik",
            ru: "Шашлык из говядины, приготовленный на углях",
            en: "Charcoal-grilled beef skewers"
        },
        image: "img/products/shashlik.jpg"
    },
    {
        id: 4,
        name: {
            uz: "Choy",
            ru: "Чай",
            en: "Tea"
        },
        category: "drinks",
        price: 5000,
        weight: "300ml",
        description: {
            uz: "An'anaviy o'zbek ko'k choyi",
            ru: "Традиционный узбекский зеленый чай",
            en: "Traditional Uzbek green tea"
        },
        image: "img/products/tea.jpg"
    },
    {
        id: 5,
        name: {
            uz: "Qahva",
            ru: "Кофе",
            en: "Coffee"
        },
        category: "drinks",
        price: 12000,
        weight: "200ml",
        description: {
            uz: "Yangi damlangan qahva",
            ru: "Свежесваренный кофе",
            en: "Freshly brewed coffee"
        },
        image: "img/products/coffee.jpg"
    },
    {
        id: 6,
        name: {
            uz: "Napaleon tort",
            ru: "Торт Наполеон",
            en: "Napoleon Cake"
        },
        category: "desserts",
        price: 25000,
        weight: "150g",
        description: {
            uz: "Qatlamli xamir va krem bilan tayyorlangan klassik tort",
            ru: "Классический торт из слоеного теста с кремом",
            en: "Classic layered cake with cream"
        },
        image: "img/products/napoleon.jpg"
    },
    {
        id: 7,
        name: {
            uz: "Manti",
            ru: "Манты",
            en: "Manti"
        },
        category: "food",
        price: 28000,
        weight: "350g",
        description: {
            uz: "Go'sht va piyoz bilan to'ldirilgan bug'da pishirilgan katta chuchvara",
            ru: "Большие пельмени на пару с начинкой из мяса и лука",
            en: "Steamed dumplings filled with meat and onions"
        },
        image: "img/products/manti.jpg"
    },
    {
        id: 8,
        name: {
            uz: "Limonli choy",
            ru: "Чай с лимоном",
            en: "Lemon Tea"
        },
        category: "drinks",
        price: 7000,
        weight: "300ml",
        description: {
            uz: "Yangi limon bilan damlangan choy",
            ru: "Чай с свежим лимоном",
            en: "Tea brewed with fresh lemon"
        },
        image: "img/products/lemon-tea.jpg"
    },
    {
        id: 9,
        name: {
            uz: "Medovik",
            ru: "Медовик",
            en: "Honey Cake"
        },
        category: "desserts",
        price: 22000,
        weight: "150g",
        description: {
            uz: "Asal va krem bilan tayyorlangan ko'p qatlamli tort",
            ru: "Многослойный торт с медом и кремом",
            en: "Multi-layered cake with honey and cream"
        },
        image: "img/products/honey-cake.jpg"
    }
];

// Mock functions for addToCart, openOrderModal, openProductModal, and deleteProduct
// In a real application, these would be defined elsewhere and potentially imported.
function addToCart(productId) {
    console.log(`Added product with ID ${productId} to cart.`);
}

function openOrderModal() {
    console.log('Opening order modal.');
}

function openProductModal(productId) {
    console.log(`Opening product modal for product ID: ${productId}`);
}

function deleteProduct(productId) {
    console.log(`Deleting product with ID: ${productId}`);
}

// Function to display products
function displayProducts(category = 'all', container = '.products-container') {
    const productsContainer = document.querySelector(container);
    if (!productsContainer) return;
    
    // Clear container
    productsContainer.innerHTML = '';
    
    // Get current language
    const currentLang = localStorage.getItem('language') || 'uz';
    
    // Filter products by category
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    
    // Display products
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-id', product.id);
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name[currentLang]}">
            </div>
            <div class="product-info">
                <h3>${product.name[currentLang]}</h3>
                <div class="product-meta">
                    <span class="product-weight">${product.weight}</span>
                    <span class="product-price">${product.price.toLocaleString()} so'm</span>
                </div>
                <p>${product.description[currentLang]}</p>
                <div class="product-actions">
                    <button class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i>
                        <span data-i18n="order.submit">Buyurtma berish</span>
                    </button>
                </div>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
        
        // Update translations for the newly added elements
        const elements = productCard.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const keys = key.split('.');
            
            let value = translations[currentLang];
            for (const k of keys) {
                if (value[k] !== undefined) {
                    value = value[k];
                } else {
                    value = key;
                    break;
                }
            }
            
            element.textContent = value;
        });
    });
    
    // Add event listeners to "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
            openOrderModal();
        });
    });
}

// Function to get product by ID
function getProductById(id) {
    return products.find(product => product.id === id);
}

// Function to display products in admin panel
function displayProductsInAdminPanel() {
    const tableBody = document.getElementById('products-table-body');
    if (!tableBody) return;
    
    // Clear table body
    tableBody.innerHTML = '';
    
    // Get current language
    const currentLang = localStorage.getItem('language') || 'uz';
    
    // Display products
    products.forEach(product => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${product.id}</td>
            <td class="product-image-cell">
                <img src="${product.image}" alt="${product.name[currentLang]}">
            </td>
            <td>${product.name[currentLang]}</td>
            <td>${translations[currentLang].menu[product.category]}</td>
            <td>${product.price.toLocaleString()} so'm</td>
            <td>${product.weight}</td>
            <td class="product-actions-cell">
                <button class="edit-btn" data-id="${product.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" data-id="${product.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to edit and delete buttons
    const editButtons = document.querySelectorAll('.edit-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            openProductModal(productId);
        });
    });
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            deleteProduct(productId);
        });
    });
}