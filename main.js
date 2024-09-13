

// Function to add a product to the cart in localStorage
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex(item => item.name === product.name && item.image === product.image);
    
    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += product.quantity;
    } else {
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}

// Event listener for search icon toggle
let search = document.querySelector('.search-box');
let navbar = document.querySelector('.navbar');

document.querySelector('#search-icon').onclick = () => {
    search.classList.toggle('active');
    navbar.classList.remove('active');
};

// Event listener for menu icon toggle
document.querySelector('#menu-icon').onclick = () => {
    navbar.classList.toggle('active');
    search.classList.remove('active');
};

// Hide navbar and search box on scroll
window.addEventListener('scroll', () => {
    navbar.classList.remove('active');
    search.classList.remove('active');
    header.classList.toggle('shadow', window.scrollY > 0);
});

// Add shadow to header on scroll
let header = document.querySelector('header');
header.classList.toggle('shadow', window.scrollY > 0);

// Smooth scrolling for navbar links
document.querySelectorAll('.navbar a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Event listener for "Add to Cart" buttons
document.querySelectorAll('.products-container .box .content a').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior

        // Get product details from the button's parent .box element
        const productElement = e.target.closest('.box');
        const product = {
            name: productElement.querySelector('h3').textContent,
            price: parseFloat(productElement.querySelector('.content span').textContent.replace('$', '')),
            quantity: 1, // Default quantity is 1
            image: productElement.querySelector('img').src // Get the image URL
        };

        // Add product to cart
        addToCart(product);

        // Show success message
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Item Added!',
                text: 'Your item has been added to the cart.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        }
    });
});

// Event listener for showing cart popup
document.getElementById('cart-icon').addEventListener('click', () => {
    const cartPopup = document.getElementById('cart-popup');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cartItemsContainer.innerHTML = ''; // Clear previous content
        let totalPrice = 0;

        cart.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('cart-item');
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="cart-item-image" />
                <div class="cart-item-details">
                    <h3>${product.name}</h3>
                    <p>Price: $${product.price.toFixed(2)}</p>
                    <p>Quantity: ${product.quantity}</p>
                </div>
            `;
            cartItemsContainer.appendChild(productElement);

            // Update total price
            totalPrice += product.price * product.quantity;
        });

        // Add total price to cart items container
        const totalPriceElement = document.createElement('div');
        totalPriceElement.classList.add('cart-total');
        totalPriceElement.innerHTML = `<h3>Total Price: $${totalPrice.toFixed(2)}</h3>`;
        cartItemsContainer.appendChild(totalPriceElement);
    }

    cartPopup.style.display = 'block'; // Show the popup
});

// Event listener for closing cart popup
document.getElementById('close-popup').addEventListener('click', () => {
    document.getElementById('cart-popup').style.display = 'none'; // Hide the popup
});

// Event listener for "Clear Cart" button
document.getElementById('clear-cart').addEventListener('click', () => {
    // Clear cart data from localStorage
    localStorage.removeItem('cart');

    // Update cart popup
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    
    // Optionally, you can also close the popup after clearing
    document.getElementById('cart-popup').style.display = 'none';
    
    // Show success message
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Cart Cleared!',
            text: 'Your cart has been cleared.',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    }
});

// Event listener for "Check-Out" button
document.getElementById('check-out').addEventListener('click', () => {
    const checkoutPopup = document.getElementById('checkout-popup');
    checkoutPopup.style.display = 'block'; // Show the checkout popup
});

// Event listener for closing checkout popup
document.getElementById('close-checkout-popup').addEventListener('click', () => {
    document.getElementById('checkout-popup').style.display = 'none'; // Hide the checkout popup
});

// Event listener for form submission (For demonstration; implement actual processing logic as needed)
document.getElementById('checkout-form').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form from submitting normally

    // Extract form data
    const name = document.getElementById('name').value;
    const cardNumber = document.getElementById('card-number').value;
    const expiryDate = document.getElementById('expiry-date').value;
    const cvv = document.getElementById('cvv').value;
    const address = document.getElementById('address').value;

    // Implement actual payment processing logic here

    // Show success message
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: 'Payment Successful!',
            text: 'Thank you for your purchase.',
            icon: 'success',
            confirmButtonText: 'OK'
        }).then(() => {
            // Clear cart and close the checkout popup
            localStorage.removeItem('cart');
            document.getElementById('cart-items').innerHTML = '<p>Your cart is empty.</p>';
            document.getElementById('checkout-popup').style.display = 'none';
        });
    }
});

// Function to search for a product
function searchProduct(query) {
    const products = document.querySelectorAll('.products-container .box');
    let found = false;

    products.forEach(product => {
        const productName = product.querySelector('h3').textContent.toLowerCase();

        if (productName.includes(query.toLowerCase())) {
            product.style.display = 'block'; // Show product
            product.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Scroll to product
            found = true;
        } else {
            product.style.display = 'none'; // Hide product
        }
    });

    if (!found) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Product Not Found!',
                text: 'No products match your search.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }
}

// Event listener for search input
document.getElementById('search-input').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        const query = e.target.value.trim();
        if (query) {
            searchProduct(query);
        } else {
            // If the search input is empty, show all products
            document.querySelectorAll('.products-container .box').forEach(product => {
                product.style.display = 'block';
            });
        }
    }
});

// Event listener for search button
document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-input').value.trim();
    if (query) {
        searchProduct(query);
    } else {
        // If the search input is empty, show all products
        document.querySelectorAll('.products-container .box').forEach(product => {
            product.style.display = 'block';
        });
    }
});
























