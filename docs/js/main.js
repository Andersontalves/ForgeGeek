// Navbar scroll effect
window.addEventListener("scroll", () => {
  const nav = document.getElementById("navbar");
  if (window.scrollY > 50) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});

// Hamburger logic
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

if(hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        if(navLinks.classList.contains('active')){
            hamburger.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        } else {
            hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
    });
}

// Shopping Cart Logic
let cart = JSON.parse(localStorage.getItem("forgeGeekCart")) || [];

const cartIcon = document.getElementById("cart-icon");
const cartOverlay = document.getElementById("cart-overlay");
const cartSidebar = document.getElementById("cart-sidebar");
const closeCartBtn = document.getElementById("close-cart");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total-price");
const cartCountEls = document.querySelectorAll(".cart-count");

function openCart() {
  cartOverlay.classList.add("active");
  cartSidebar.classList.add("active");
  renderCart();
}

function closeCart() {
  cartOverlay.classList.remove("active");
  cartSidebar.classList.remove("active");
}

if (cartIcon)
  cartIcon.addEventListener("click", (e) => {
    e.preventDefault();
    openCart();
  });
if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

function addToCart(id, title, price, image) {
  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, title, price, image, quantity: 1 });
  }
  saveCart();
  showToast(`${title} adicionado ao inventário!`);

  // Simulate updating count animation
  cartCountEls.forEach((el) => {
    el.style.transform = "scale(1.5)";
    setTimeout(() => (el.style.transform = "scale(1)"), 200);
  });
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem("forgeGeekCart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartCountEls.forEach((el) => (el.textContent = count));
}

function renderCart() {
  if (!cartItemsContainer) return;

  cartItemsContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<p style="color: var(--text-muted); text-align:center; margin-top: 2rem;">Seu inventário está vazio.</p>';
  } else {
    cart.forEach((item) => {
      total += item.price * item.quantity;
      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted)">Qtd: ${item.quantity}</div>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2).replace(".", ",")}</div>
                    <span class="remove-item" onclick="removeFromCart(${item.id})">Remover</span>
                </div>
            `;
      cartItemsContainer.appendChild(div);
    });
  }

  cartTotalEl.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
}

// Toast Notifications
function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${message}`;

  container.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Advanced Variants Logic (for produto.html)
let basePrice = 120.00;
let currentVariantPrice = 120.00;

function updatePrice() {
    const scale = parseFloat(document.getElementById('variant-scale')?.value || 1);
    const materialPrice = document.getElementById('variant-material') ? parseFloat(document.getElementById('variant-material').value) : 0;
    const finishPrice = document.getElementById('variant-finish') ? parseFloat(document.getElementById('variant-finish').value) : 0;
    
    // Scale 1.5 adds R$ 40
    let scaleAdded = (scale === 1.5) ? 40 : 0;
    
    currentVariantPrice = basePrice + scaleAdded + materialPrice + finishPrice;
    
    const priceEl = document.getElementById('current-price');
    const installEl = document.getElementById('installment-price');
    
    if (priceEl && installEl) {
        priceEl.textContent = currentVariantPrice.toFixed(2).replace('.', ',');
        installEl.textContent = (currentVariantPrice / 3).toFixed(2).replace('.', ',');
    }
}

function addVariantToCart() {
    const scaleText = document.getElementById('variant-scale')?.options[document.getElementById('variant-scale').selectedIndex].text || '';
    const materialText = document.getElementById('variant-material')?.options[document.getElementById('variant-material').selectedIndex].text || '';
    const finishText = document.getElementById('variant-finish')?.options[document.getElementById('variant-finish').selectedIndex].text || '';
    
    const variantTitle = `Dragão Articulado (${scaleText.split(' ')[0]} - ${finishText.split(' ')[0]})`;
    
    // Using a random ID for the variants just to make sure they stack independently if they are different
    addToCart(Math.floor(Math.random() * 1000) + 10, variantTitle, currentVariantPrice, 'img/hero-dragon.png');
}

// Initialize
updatePrice();
updateCartCount();
