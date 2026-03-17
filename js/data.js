// ===== PS FURNITURE - Shared Data & Utilities =====

const ADMIN_PASSWORD = "PSfurniture2024!";
const DEFAULT_WA_NUMBER = "919876543210"; 
const DEFAULT_WA_MESSAGE = "Hello PS Furniture! I'm interested in your products.";
const DEFAULT_CONTACT = {
  phone: "910000000000",
  email: "info@psfurniture.com",
  address: "MG Road, Kochi, Kerala – 682016",
  whatsapp: "919876543210",
  waMessage: "Hello PS Furniture! I'm interested in your products.",
  facebook: "https://www.facebook.com/share/1DvxNpM5me/",
  instagram: "https://instagram.com/psfurniture",
  hidePhone: true
};

// ===== LOCAL STORAGE HELPERS =====
const DATA_VERSION = 'v3';
function getProducts() {
  // Version check: reset if outdated or missing
  if (localStorage.getItem('psf_data_version') !== DATA_VERSION) {
    const defaults = getDefaultProducts();
    localStorage.setItem('psf_products', JSON.stringify(defaults));
    localStorage.setItem('psf_data_version', DATA_VERSION);
    localStorage.removeItem('psf_cart'); // Clear cart on version reset
    return defaults;
  }
  const stored = localStorage.getItem('psf_products');
  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed && parsed.length > 0) return parsed;
  }
  const defaults = getDefaultProducts();
  saveProducts(defaults);
  return defaults;
}
function saveProducts(products) {
  localStorage.setItem('psf_products', JSON.stringify(products));
}
function getNextId() {
  const products = getProducts();
  return products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
}

// ===== CART HELPERS =====
function getCart() {
  const stored = localStorage.getItem('psf_cart');
  return stored ? JSON.parse(stored) : [];
}

function saveCart(cart) {
  localStorage.setItem('psf_cart', JSON.stringify(cart));
  updateNavbarCartCount();
}

function addToCart(productId) {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  let cart = getCart();
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1
    });
  }
  saveCart(cart);
  showToast(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
}

function updateCartQuantity(productId, quantity) {
  let cart = getCart();
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity = Math.max(1, quantity);
    saveCart(cart);
  }
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function clearCart() {
  localStorage.removeItem('psf_cart');
  updateNavbarCartCount();
}

// ===== CONTACT HELPERS =====
function getContactDetails() {
  const stored = localStorage.getItem('psf_contact');
  return stored ? JSON.parse(stored) : DEFAULT_CONTACT;
}

function saveContactDetails(details) {
  localStorage.setItem('psf_contact', JSON.stringify(details));
}

// ===== ORDER HELPERS =====
function getOrders() {
  const stored = localStorage.getItem('psf_orders');
  return stored ? JSON.parse(stored) : [];
}

function saveOrders(orders) {
  localStorage.setItem('psf_orders', JSON.stringify(orders));
}

function placeOrder(customerInfo) {
  const cart = getCart();
  if (cart.length === 0) return false;

  const order = {
    id: 'PS' + Date.now().toString().slice(-6),
    date: new Date().toISOString(),
    items: cart,
    total: getCartTotal(),
    customer: customerInfo,
    status: 'Pending',
    trackingId: '',
    trackingUrl: ''
  };

  const orders = getOrders();
  orders.push(order);
  saveOrders(orders);
  clearCart();
  return order;
}

function updateNavbarCartCount() {
  const cart = getCart();
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const badges = document.querySelectorAll('.cart-count');
  badges.forEach(b => {
    b.textContent = count;
    b.style.display = count > 0 ? 'flex' : 'none';
  });
}

// ===== DEFAULT PRODUCTS =====
function getDefaultProducts() {
  return [];
}

// ===== UTILITY FUNCTIONS =====
function formatPrice(price) {
  return '₹' + price.toLocaleString('en-IN');
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let html = '';
  for (let i = 0; i < full; i++) html += '★';
  if (half) html += '½';
  return html;
}

function getCategories() {
  const products = getProducts();
  const cats = [...new Set(products.map(p => p.category))];
  return cats;
}

function getWALink(message) {
  const contact = getContactDetails();
  const waNum = contact.whatsapp || DEFAULT_WA_NUMBER;
  const msg = message || contact.waMessage || DEFAULT_WA_MESSAGE;
  return `https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`;
}

function getIGLink() {
  const contact = getContactDetails();
  return contact.instagram || "https://instagram.com/psfurniture";
}

function getFBLink() {
  const contact = getContactDetails();
  return contact.facebook || "https://facebook.com/psfurniture";
}

function getProductWALink(product) {
  const msg = `Hello PS Furniture! I'm interested in *${product.name}* priced at ${formatPrice(product.price)}. Please share more details.`;
  return getWALink(msg);
}

function isAdminLoggedIn() {
  return sessionStorage.getItem('psf_admin') === 'true';
}

function adminLogin(password) {
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem('psf_admin', 'true');
    return true;
  }
  return false;
}

function adminLogout() {
  sessionStorage.removeItem('psf_admin');
}

function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✅' : '❌'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ===== NAVBAR RENDER =====
function renderNavbar(activePage = '') {
  const pages = [
    { href: '../index.html', label: 'Home', key: 'home' },
    { href: '../products.html', label: 'Products', key: 'products' },
    { href: '../contact.html', label: 'Contact', key: 'contact' },
  ];
  const links = pages.map(p =>
    `<li><a href="${p.href}" class="${activePage===p.key?'active':''}">${p.label}</a></li>`
  ).join('');
  return `
  <nav class="navbar" id="navbar">
    <div class="nav-inner">
      <a href="../index.html" class="nav-logo">
        <img src="../assets/logo.png" alt="PS Furniture" style="height:48px;width:auto;display:block;"/>
      </a>
      <ul class="nav-links">${links}</ul>
      <div class="nav-cta">
        <button class="nav-search-btn" onclick="window.location.href='../products.html'">🔍 Search</button>
        <a href="../products.html" class="btn btn-gold" style="padding:8px 20px;font-size:0.85rem;">Shop Now</a>
      </div>
      <button class="hamburger" id="hamburger" onclick="toggleMobileMenu()">
        <span></span><span></span><span></span>
      </button>
    </div>
    <div class="mobile-menu" id="mobile-menu">
      <a href="../index.html">Home</a>
      <a href="../products.html">Products</a>
      <a href="../contact.html">Contact</a>
    </div>
  </nav>`;
}

function renderNavbarRoot(activePage = '') {
  const pages = [
    { href: 'index.html', label: 'Home', key: 'home' },
    { href: 'products.html', label: 'Products', key: 'products' },
    { href: 'contact.html', label: 'Contact', key: 'contact' },
  ];
  const links = pages.map(p =>
    `<li><a href="${p.href}" class="${activePage===p.key?'active':''}">${p.label}</a></li>`
  ).join('');
  const cart = getCart();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  return `
  <nav class="navbar" id="navbar">
    <div class="nav-inner">
      <a href="index.html" class="nav-logo">
        <img src="assets/logo.png" alt="PS Furniture" style="height:48px;width:auto;display:block;"/>
      </a>
      <ul class="nav-links">${links}</ul>
      <div class="nav-cta">
        <button class="nav-search-btn" onclick="window.location.href='products.html'">🔍</button>
        <a href="cart.html" class="nav-cart-btn">
          🛒<span class="cart-count" style="display:${cartCount > 0 ? 'flex' : 'none'}">${cartCount}</span>
        </a>
        <a href="products.html" class="btn btn-gold" style="padding:8px 20px;font-size:0.85rem;">Shop Now</a>
      </div>
      <button class="hamburger" id="hamburger" onclick="toggleMobileMenu()">
        <span></span><span></span><span></span>
      </button>
    </div>
    <div class="mobile-menu" id="mobile-menu">
      <a href="index.html">Home</a>
      <a href="products.html">Products</a>
      <a href="contact.html">Contact</a>
      <a href="cart.html">Cart</a>
    </div>
  </nav>`;
}

function toggleMobileMenu() {
  const m = document.getElementById('mobile-menu');
  m.classList.toggle('open');
}

function renderFooter() {
  return `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="nav-logo"><img src="assets/logo.png" alt="PS Furniture" style="height:44px;width:auto;display:block;"/></a>
          <p>Crafting premium furniture that transforms houses into homes. Every piece tells a story of quality and craftsmanship.</p>
          <div class="footer-social">
            <a href="${getFBLink()}" target="_blank" class="social-btn">📘</a>
            <a href="${getIGLink()}" target="_blank" class="social-btn">📸</a>
            <a href="${getWALink()}" target="_blank" class="social-btn">💬</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="products.html">All Products</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Categories</h4>
          <ul>
            <li><a href="products.html?cat=Sofas">Sofas</a></li>
            <li><a href="products.html?cat=Bedroom">Bedroom</a></li>
            <li><a href="products.html?cat=Dining">Dining</a></li>
            <li><a href="products.html?cat=Office">Office</a></li>
            <li><a href="products.html?cat=Living Room">Living Room</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <ul>
            ${!getContactDetails().hidePhone ? `<li><a href="tel:${getContactDetails().phone.replace(/\s+/g, '')}">📞 ${getContactDetails().phone}</a></li>` : ''}
            <li><a href="mailto:${getContactDetails().email}">✉️ ${getContactDetails().email}</a></li>
            <li><a href="${getWALink()}" target="_blank">💬 WhatsApp Us</a></li>
            <li><a href="#">📍 ${getContactDetails().address.split(',')[0]}</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2024 PS Furniture. All rights reserved.</p>
        <p>Designed with ❤️ for premium living</p>
      </div>
    </div>
  </footer>
  <a href="${getWALink()}" target="_blank" class="wa-float" title="Chat on WhatsApp">💬</a>`;
}

function renderFooterFromAdmin() {
  return `
  <footer class="footer">
    <div class="container">
      <div class="footer-bottom">
        <p>© 2024 PS Furniture. All rights reserved.</p>
        <p><a href="../index.html" style="color:var(--gold);">← Back to Website</a></p>
      </div>
    </div>
  </footer>`;
}

// Navbar scroll effect
document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (nav) {
      if (window.scrollY > 50) nav.style.background = 'rgba(13,13,13,0.98)';
      else nav.style.background = 'rgba(13,13,13,0.85)';
    }
  });
});
