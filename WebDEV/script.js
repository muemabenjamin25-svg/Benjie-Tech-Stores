/* ===== CART STORAGE ===== */
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* ===== UPDATE CART COUNT ===== */
function updateCartCount() {
    let count = 0;
    cart.forEach(item => count += item.quantity);

    const cartCount = document.getElementById("cartCount");
    if (cartCount) cartCount.textContent = count;
}

/* ===== ADD TO CART ===== */
function addToCart(name, price) {
    price = Number(price);

    let item = cart.find(p => p.name === name);

    if (item) {
        item.quantity++;
    } else {
        cart.push({ name: name, price: price, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert(`${name} added to cart`);
}

/* ===== REMOVE FROM CART ===== */
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

/* ===== DISPLAY CART ===== */
function displayCart() {
    const cartBox = document.getElementById("cartItems");
    const totalBox = document.getElementById("cartTotal");
    const paymentContainer = document.getElementById("paymentContainer");

    if (!cartBox || !totalBox) return;

    cartBox.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        cartBox.innerHTML += `
            <div class="cart-item">
                <strong>${item.name}</strong><br>
                Price: KSH ${item.price}<br>
                Quantity: ${item.quantity}<br>
                <button onclick="removeFromCart('${item.name}')">Remove</button>
                <hr>
            </div>
        `;
    });

    totalBox.textContent = "KSH " + total;

    if (paymentContainer) {
        paymentContainer.innerHTML = cart.length > 0
            ? `<button onclick="mpesaPayment()">Pay via M-Pesa</button>`
            : "";
    }
}

/* ===== M-PESA PAYMENT ===== */
function mpesaPayment() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const phone = prompt("Enter your M-Pesa phone number (2547XXXXXXXX):");
    if (!phone || !/^2547\d{8}$/.test(phone)) {
        alert("Invalid phone number! Use format 2547XXXXXXXX.");
        return;
    }

    let total = 0;
    cart.forEach(item => total += item.price * item.quantity);

    // Show payment instructions
    const instructions = `Please pay KSH ${total} via M-Pesa Paybill:\n\n` +
        `Paybill Number: 123456\n` +
        `Account Name: Benjie Tech Stores\n` +
        `Amount: KSH ${total}\n` +
        `Phone Number: ${phone}\n\n` +
        `After payment, send confirmation via WhatsApp.`;
    alert(instructions);

    // WhatsApp confirmation link
    const message = encodeURIComponent(`Hello Benjie Tech Stores, I have paid KSH ${total} via M-Pesa. Phone: ${phone}`);
    const whatsappNumber = "254746664269";
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");

    // Clear cart after payment
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

/* ===== WHATSAPP ORDER CHECKOUT ===== */
function checkoutViaWhatsApp() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let message = "Hello Benjie Tech Stores,%0AI want to order:%0A";
    let total = 0;

    cart.forEach(item => {
        message += `- ${item.name} (x${item.quantity}) - KSH ${item.price * item.quantity}%0A`;
        total += item.price * item.quantity;
    });

    message += `%0ATotal: KSH ${total}`;

    const whatsappNumber = "254746664269";
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
}

/* ===== GREETING MESSAGE ===== */
function greetingMessage() {
    const greet = document.getElementById("greeting");
    if (!greet) return;

    const hour = new Date().getHours();
    let msg = "Welcome to Benjie Tech Stores";

    if (hour < 12) msg = "Good Morning ";
    else if (hour < 18) msg = "Good Afternoon ";
    else msg = "Good Evening ";

    greet.textContent = msg;
}

/* ===== THEME TOGGLE ===== */
function toggleTheme() {
    document.body.classList.toggle("dark-theme");
    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark-theme") ? "dark" : "light"
    );
}

/* ===== LOAD SAVED THEME ===== */
function loadTheme() {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-theme");
    }
}

/* ===== CONTACT FORM VALIDATION ===== */
function validateForm() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();

    if (name.length < 2) {
        alert("Please enter your name");
        return false;
    }

    if (!email.includes("@")) {
        alert("Please enter a valid email");
        return false;
    }

    alert("Message sent successfully!");
    return true;
}

/* ===== INITIALIZE WEBSITE ===== */
document.addEventListener("DOMContentLoaded", function () {
    updateCartCount();
    greetingMessage();
    loadTheme();
    displayCart();
});