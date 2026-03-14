// ===== PS FURNITURE - Shared Data & Utilities =====

const ADMIN_PASSWORD = "PSfurniture2024!";
const DEFAULT_WA_NUMBER = "919876543210"; 
const DEFAULT_WA_MESSAGE = "Hello PS Furniture! I'm interested in your products.";
const DEFAULT_CONTACT = {
  phone: "+91 98765 43210",
  email: "info@psfurniture.com",
  address: "Near Andheri Station, Mumbai, Maharashtra – 400053",
  whatsapp: DEFAULT_WA_NUMBER,
  waMessage: DEFAULT_WA_MESSAGE
};

// ===== LOCAL STORAGE HELPERS =====
const DATA_VERSION = 'v2';
function getProducts() {
  // Version check: reset if outdated or missing
  if (localStorage.getItem('psf_data_version') !== DATA_VERSION) {
    const defaults = getDefaultProducts();
    localStorage.setItem('psf_products', JSON.stringify(defaults));
    localStorage.setItem('psf_data_version', DATA_VERSION);
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
    id: Date.now(),
    date: new Date().toISOString(),
    items: cart,
    total: getCartTotal(),
    customer: customerInfo,
    status: 'Pending'
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
  return [
    {
      id: 1,
      name: "Royal Chesterfield Sofa",
      category: "Sofas",
      price: 85000,
      originalPrice: 110000,
      rating: 4.8,
      reviews: 124,
      description: "Handcrafted Chesterfield sofa with premium tufted leather upholstery. Deep button detailing and solid wood legs finished in antique brass. A timeless statement piece for your living room.",
      specs: { Material: "Premium Full-Grain Leather", Dimensions: "220cm × 95cm × 85cm", Seating: "3-seater", Frame: "Solid Hardwood", Legs: "Antique Brass Finish", Colour: "Cognac Brown / Midnight Black" },
      images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80","https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&q=80"],
      featured: true,
      active: true,
      tags: ["Bestseller"]
    },
    {
      id: 2,
      name: "Executive Oak Dining Table",
      category: "Dining",
      price: 62000,
      originalPrice: 78000,
      rating: 4.7,
      reviews: 89,
      description: "Solid oak dining table with natural grain finish. Seats 6 comfortably. Sturdy mortise and tenon joinery ensures decades of use.",
      specs: { Material: "Solid Oak Wood", Dimensions: "180cm × 90cm × 76cm", Seating: "6-seater", Finish: "Natural Oil", Weight: "68 kg" },
      images: ["https://images.unsplash.com/photo-1615066638065-6e7a33a1c2fb?w=800&q=80","https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&q=80"],
      featured: true,
      active: true,
      tags: ["New Arrival"]
    },
    {
      id: 3,
      name: "Luxury King Bed Frame",
      category: "Bedroom",
      price: 95000,
      originalPrice: 125000,
      rating: 4.9,
      reviews: 203,
      description: "Statement king bed frame with upholstered headboard in plush velvet. Platform base with hidden storage drawers. Built for royalty.",
      specs: { Material: "Solid Wood + Velvet", Dimensions: "215cm × 200cm × 140cm", Size: "King (180×200cm)", Storage: "4 Drawer Hydraulic", Colour: "Midnight Blue / Charcoal" },
      images: ["https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80","https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"],
      featured: true,
      active: true,
      tags: ["Bestseller", "Featured"]
    },
    {
      id: 4,
      name: "Premium Office Chair",
      category: "Office",
      price: 28000,
      originalPrice: 38000,
      rating: 4.6,
      reviews: 178,
      description: "Ergonomic executive office chair with full lumbar support, adjustable armrests, and breathable mesh back. Work in comfort all day.",
      specs: { Material: "Mesh + Leather Seat", Adjustment: "Full Ergonomic", Armrests: "4D Adjustable", Recline: "120° Lockable", "Weight Capacity": "150 kg" },
      images: ["https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80","https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&q=80"],
      featured: false,
      active: true,
      tags: ["Sale"]
    },
    {
      id: 5,
      name: "Marble-Top Coffee Table",
      category: "Living Room",
      price: 32000,
      originalPrice: 42000,
      rating: 4.5,
      reviews: 67,
      description: "Stunning Italian marble top coffee table with brushed gold stainless steel legs. A centrepiece that elevates any living room.",
      specs: { Material: "Italian Marble + Stainless Steel", Dimensions: "120cm × 60cm × 42cm", Top: "20mm Marble Slab", Legs: "Brushed Gold Steel" },
      images: ["https://images.unsplash.com/photo-1567538096621-38d2284b23ff?w=800&q=80","https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80"],
      featured: false,
      active: true,
      tags: ["New Arrival"]
    },
    {
      id: 6,
      name: "Wardrobe with Mirror",
      category: "Bedroom",
      price: 72000,
      originalPrice: 90000,
      rating: 4.7,
      reviews: 95,
      description: "5-door wardrobe with full-length mirror panels and internal LED lighting. Ample storage with hanging rails and shelves.",
      specs: { Material: "Engineered Wood + Glass", Dimensions: "240cm × 220cm × 60cm", Doors: "5 (3 Mirror + 2 Wood)", Lighting: "Internal LED", Finish: "Premium Laminate" },
      images: ["https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=800&q=80","https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800&q=80"],
      featured: true,
      active: true,
      tags: []
    },
    {
      id: 7,
      name: "Bookshelf & Display Unit",
      category: "Living Room",
      price: 18500,
      originalPrice: 24000,
      rating: 4.4,
      reviews: 52,
      description: "Modern 6-shelf bookcase with open and closed storage. Walnut finish with gold hardware accents. Perfect for home office or living room.",
      specs: { Material: "Sheesham Wood", Dimensions: "100cm × 40cm × 210cm", Shelves: "6 (4 Open + 2 Closed)", Finish: "Walnut + Gold" },
      images: ["https://images.unsplash.com/photo-1588556987004-2c46ea0b2dbd?w=800&q=80","https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80"],
      featured: false,
      active: true,
      tags: ["Sale"]
    },
    {
      id: 8,
      name: "Accent Lounge Chair",
      category: "Living Room",
      price: 22000,
      originalPrice: 28000,
      rating: 4.8,
      reviews: 141,
      description: "Mid-century modern accent chair with solid walnut frame and premium fabric upholstery. Comes with matching footrest.",
      specs: { Material: "Walnut Wood + Premium Fabric", Dimensions: "75cm × 80cm × 82cm", Includes: "Matching Footrest", Upholstery: "Stain-Resistant Fabric" },
      images: ["https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80","https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"],
      featured: false,
      active: true,
      tags: ["Bestseller"]
    }
  ];
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
            <a href="#" class="social-btn">📘</a>
            <a href="#" class="social-btn">📸</a>
            <a href="${getWALink()}" target="_blank" class="social-btn">💬</a>
            <a href="#" class="social-btn">▶️</a>
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
            <li><a href="tel:${getContactDetails().phone.replace(/\s+/g, '')}">📞 ${getContactDetails().phone}</a></li>
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
