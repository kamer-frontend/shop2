// Shopping cart and order functionality
let cart = [];

// Function to add product to cart
function addToCart(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    
    // Update cart display
    updateCartDisplay();
}

// Function to remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
}

// Function to update product quantity in cart
function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
        }
    }
}

// Function to calculate total price
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Function to update cart display
function updateCartDisplay() {
    const orderItems = document.querySelector('.order-items');
    const orderTotal = document.querySelector('.order-total p');
    
    if (!orderItems || !orderTotal) return;
    
    // Clear order items
    orderItems.innerHTML = '';
    
    // Get current language
    const currentLang = localStorage.getItem('language') || 'uz';
    
    // Display cart items
    if (cart.length === 0) {
        orderItems.innerHTML = `<p class="empty-cart">${translations[currentLang].order.emptyCart || 'Your cart is empty'}</p>`;
    } else {
        cart.forEach(item => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.setAttribute('data-id', item.id);
            
            orderItem.innerHTML = `
                <div class="order-item-info">
                    <div class="order-item-name">${item.name[currentLang]}</div>
                    <div class="order-item-price">${item.price.toLocaleString()} so'm</div>
                </div>
                <div class="order-item-quantity">
                    <button class="quantity-btn decrease">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn increase">+</button>
                </div>
                <div class="order-item-total">${(item.price * item.quantity).toLocaleString()} so'm</div>
                <button class="remove-item">×</button>
            `;
            
            orderItems.appendChild(orderItem);
        });
        
        // Add event listeners to quantity buttons and remove buttons
        const decreaseButtons = document.querySelectorAll('.quantity-btn.decrease');
        const increaseButtons = document.querySelectorAll('.quantity-btn.increase');
        const removeButtons = document.querySelectorAll('.remove-item');
        
        decreaseButtons.forEach(button => {
            button.addEventListener('click', function() {
                const orderItem = this.closest('.order-item');
                const productId = parseInt(orderItem.getAttribute('data-id'));
                const currentQuantity = parseInt(orderItem.querySelector('.quantity-value').textContent);
                updateQuantity(productId, currentQuantity - 1);
            });
        });
        
        increaseButtons.forEach(button => {
            button.addEventListener('click', function() {
                const orderItem = this.closest('.order-item');
                const productId = parseInt(orderItem.getAttribute('data-id'));
                const currentQuantity = parseInt(orderItem.querySelector('.quantity-value').textContent);
                updateQuantity(productId, currentQuantity + 1);
            });
        });
        
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const orderItem = this.closest('.order-item');
                const productId = parseInt(orderItem.getAttribute('data-id'));
                removeFromCart(productId);
            });
        });
    }
    
    // Update total
    const total = calculateTotal();
    orderTotal.textContent = `${total.toLocaleString()} so'm`;
}

// Function to open order modal
function openOrderModal() {
    const orderModal = document.getElementById('order-modal');
    if (orderModal) {
        orderModal.style.display = 'block';
        updateCartDisplay();
    }
}

// Order form submission
document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Check if cart is empty
            if (cart.length === 0) {
                alert('Your cart is empty');
                return;
            }
            
            // Get form data
            const name = document.getElementById('order-name').value;
            const phone = document.getElementById('order-phone').value;
            const comment = document.getElementById('order-comment').value;
            
            // Create order object
            const order = {
                customer: name,
                phone: phone,
                comment: comment,
                items: cart.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                total: calculateTotal(),
                date: new Date().toISOString()
            };
            
            // Send order to Telegram bot (in a real app)
            sendOrderToTelegram(order);
            
            // Clear cart and close modal
            cart = [];
            updateCartDisplay();
            document.getElementById('order-modal').style.display = 'none';
            
            // Reset form
            this.reset();
            
            // Show success message
            alert('Your order has been placed successfully!');
        });
    }
});

// Function to send order to Telegram bot
function sendOrderToTelegram(order) {
    // In a real app, this would send a request to your server
    // which would then forward the order to the Telegram bot
    console.log('Sending order to Telegram:', order);
    
    // Example of how this might work with fetch API
    /*
    fetch('/api/send-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Order sent successfully:', data);
    })
    .catch(error => {
        console.error('Error sending order:', error);
    });
    */
}

function formatOrderMessage(order) {
    return `
        <b>Order ID:</b> <code>${order.id}</code><br>
        <b>Customer:</b> ${order.customer}<br>
        <b>Items:</b> ${order.items.map(item => `<code>${item.name} x${item.quantity}</code>`).join(', ')}<br>
        <b>Total:</b> ${order.total} ${order.currency}<br>
        <b>Date:</b> ${order.date}<br>
        <b>Comment:</b> ${order.comment || 'N/A'}<br>
    `;
}