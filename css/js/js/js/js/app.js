
import {
  products,
  categories,
  findProduct,
  formatPrice
} from "./products.js";

import {
  getCart,
  addToCart,
  changeQuantity,
  removeFromCart,
  clearCart,
  getCartCount
} from "./cart.js";

import { getRoute } from "./router.js";

const app = document.getElementById("app");
const cartCount = document.getElementById("cart-count");
const toast = document.getElementById("toast");

let activeCategory = "All";
let searchTerm = "";
let sortOrder = "featured";
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("visible");
  }, 2400);
}

function updateCartCount() {
  cartCount.textContent = getCartCount();
}

function productCard(product) {
  return `
    <article class="product-card">
      <div class="product-art"
           style="--product-bg:${product.color}">
        <span aria-hidden="true">${product.icon}</span>
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-bottom">
          <span class="product-price">${formatPrice(product.price)}</span>
          <button class="add-button"
                  type="button"
                  data-action="add"
                  data-id="${product.id}">
            + Add
          </button>
        </div>
      </div>
    </article>
  `;
}

function productGrid(items) {
  if (!items.length) {
    return `
      <div class="empty-state">
        <span aria-hidden="true">🔎</span>
        <h2>No products found</h2>
        <p>Try another search or category.</p>
      </div>
    `;
  }

  return `<div class="product-grid">${items.map(productCard).join("")}</div>`;
}

function renderHome() {
  const featured = products.slice(0, 4);

  app.innerHTML = `
    <section class="hero">
      <div class="hero-inner">
        <div>
          <span class="eyebrow">A LITTLE SOMETHING FOR YOU</span>
          <h1>Find your next <span>favorite.</span></h1>
          <p>
            Thoughtfully selected everyday essentials,
            modern accessories and tech finds — all in one place.
          </p>
          <a href="#/products" class="button button-light">
            Explore Collection →
          </a>
        </div>
        <div class="hero-art" aria-label="Shopping bag illustration">
          <span aria-hidden="true">🛍️</span>
        </div>
      </div>
    </section>

    <section class="container">
      <div class="section-heading">
        <div>
          <span class="eyebrow">HANDPICKED FOR YOU</span>
          <h2>Featured Finds</h2>
          <p>Everyday products with a little extra style.</p>
        </div>
        <a class="text-link" href="#/products">View all →</a>
      </div>

      ${productGrid(featured)}

      <div class="benefits">
        <article class="benefit">
          <span aria-hidden="true">🚚</span>
          <h3>Easy Shopping</h3>
          <p>Browse products in one simple catalog.</p>
        </article>
        <article class="benefit">
          <span aria-hidden="true">💜</span>
          <h3>Made for You</h3>
          <p>Explore useful everyday essentials.</p>
        </article>
        <article class="benefit">
          <span aria-hidden="true">📱</span>
          <h3>Shop Anywhere</h3>
          <p>A responsive experience across screen sizes.</p>
        </article>
      </div>
    </section>
  `;
}

function renderCatalog() {
  const grid = document.getElementById("catalog-grid");
  const resultCount = document.getElementById("result-count");

  if (!grid || !resultCount) return;

  const query = searchTerm.trim().toLowerCase();

  let filtered = products.filter(product => {
    const matchesCategory =
      activeCategory === "All" ||
      product.category === activeCategory;

    const searchable =
      `${product.name} ${product.category} ${product.description}`
        .toLowerCase();

    return matchesCategory && searchable.includes(query);
  });

  if (sortOrder === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortOrder === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  resultCount.textContent =
    `${filtered.length} product${filtered.length === 1 ? "" : "s"} found`;

  grid.innerHTML = productGrid(filtered);
}

function renderProducts() {
  activeCategory = "All";
  searchTerm = "";
  sortOrder = "featured";

  app.innerHTML = `
    <section class="container">
      <div class="section-heading">
        <div>
          <span class="eyebrow">THE SHOPNOVA COLLECTION</span>
          <h1 class="page-title">Explore Products</h1>
          <p>Find something you'll love.</p>
        </div>
      </div>

      <div class="catalog-toolbar">
        <label>
          <span class="sr-only">Search products</span>
          <input id="product-search" class="search-input"
                 type="search"
                 placeholder="Search products..."
                 autocomplete="off">
        </label>

        <label>
          <span class="sr-only">Sort products</span>
          <select id="product-sort" class="sort-select">
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </label>
      </div>

      <div class="category-filters" aria-label="Product categories">
        ${categories.map(category => `
          <button type="button"
                  class="category-button ${category === "All" ? "active" : ""}"
                  data-action="category"
                  data-category="${category}"
                  aria-pressed="${category === "All"}">
            ${category}
          </button>
        `).join("")}
      </div>

      <p id="result-count" class="status-message" aria-live="polite"></p>
      <div id="catalog-grid"></div>
    </section>
  `;

  renderCatalog();
}

function renderCart() {
  const items = getCart();

  if (!items.length) {
    app.innerHTML = `
      <section class="container">
        <span class="eyebrow">YOUR SHOPPING BAG</span>
        <h1 class="page-title">Your Cart</h1>
        <div class="empty-state">
          <span aria-hidden="true">🛍️</span>
          <h2>Your cart is waiting for you</h2>
          <p>Looks like you haven't added anything yet.</p>
          <a class="button" href="#/products">Explore Products →</a>
        </div>
      </section>
    `;
    return;
  }

  const validItems = items
    .map(item => ({ ...item, product: findProduct(item.id) }))
    .filter(item => item.product);

  const total = validItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const quantity = validItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  app.innerHTML = `
    <section class="container">
      <span class="eyebrow">ALMOST YOURS</span>
      <h1 class="page-title">Your Cart</h1>
      <p class="status-message">${quantity} item(s) in your cart</p>

      <div class="cart-layout">
        <div class="cart-list">
          ${validItems.map(item => `
            <article class="cart-row">
              <div class="cart-art"
                   style="--product-bg:${item.product.color}"
                   aria-hidden="true">${item.product.icon}</div>

              <div>
                <h3>${item.product.name}</h3>
                <p>${formatPrice(item.product.price)} each</p>

                <div class="quantity-controls"
                     aria-label="Quantity controls for ${item.product.name}">
                  <button type="button" data-action="decrease"
                          data-id="${item.id}"
                          aria-label="Decrease quantity">−</button>
                  <span>${item.quantity}</span>
                  <button type="button" data-action="increase"
                          data-id="${item.id}"
                          aria-label="Increase quantity">+</button>
                </div>

                <button type="button" class="remove-button"
                        data-action="remove" data-id="${item.id}">
                  Remove
                </button>
              </div>

              <strong>${formatPrice(item.product.price * item.quantity)}</strong>
            </article>
          `).join("")}
        </div>

        <aside class="order-summary">
          <h2>Order Summary</h2>
          <div class="summary-line">
            <span>Items (${quantity})</span>
            <strong>${formatPrice(total)}</strong>
          </div>
          <div class="summary-line">
            <span>Delivery</span>
            <strong>Free</strong>
          </div>
          <div class="summary-line summary-total">
            <span>Total</span>
            <strong>${formatPrice(total)}</strong>
          </div>
          <button type="button" class="button full-width"
                  data-action="checkout">
            Continue to Checkout
          </button>
          <p class="disclaimer">
            Demo checkout only. No payment will be collected.
          </p>
        </aside>
      </div>
    </section>
  `;
}

function renderAbout() {
  app.innerHTML = `
    <section class="container">
      <span class="eyebrow">OUR LITTLE CORNER</span>
      <h1 class="page-title">About ShopNova</h1>

      <article class="about-card">
        <h2>Simple shopping. Thoughtful design.</h2>
        <p>
          ShopNova is an e-commerce catalog capstone project
          created to demonstrate modular frontend architecture,
          client-side routing, product filtering, cart state
          management and responsive design.
        </p>
        <p>
          The catalog uses sample products and illustrative
          icons. It is a demonstration project, not a live store.
        </p>
        <a class="button" href="#/products">Explore Products →</a>
      </article>
    </section>
  `;
}

function renderNotFound() {
  app.innerHTML = `
    <section class="container empty-state">
      <span aria-hidden="true">🔎</span>
      <h1>Page not found</h1>
      <p>The page you requested doesn't exist.</p>
      <a class="button" href="#/">Return Home</a>
    </section>
  `;
}

function renderRoute() {
  const route = getRoute();

  if (route === "home") renderHome();
  else if (route === "products") renderProducts();
  else if (route === "cart") renderCart();
  else if (route === "about") renderAbout();
  else renderNotFound();

  updateCartCount();
}

app.addEventListener("input", event => {
  if (event.target.id === "product-search") {
    searchTerm = event.target.value;
    renderCatalog();
  }
});

app.addEventListener("change", event => {
  if (event.target.id === "product-sort") {
    sortOrder = event.target.value;
    renderCatalog();
  }
});

app.addEventListener("click", event => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  const id = Number(button.dataset.id);

  if (action === "add") {
    const product = findProduct(id);
    if (!product) return;

    if (addToCart(id)) {
      updateCartCount();
      showToast(`${product.name} added to cart!`);
    } else {
      showToast("Unable to save your cart in this browser.");
    }
  }

  if (action === "category") {
    activeCategory = button.dataset.category;

    document.querySelectorAll("[data-action='category']")
      .forEach(categoryButton => {
        const selected =
          categoryButton.dataset.category === activeCategory;

        categoryButton.classList.toggle("active", selected);
        categoryButton.setAttribute("aria-pressed", String(selected));
      });

    renderCatalog();
  }

  if (action === "increase" || action === "decrease") {
    const saved = changeQuantity(id, action === "increase" ? 1 : -1);
    renderCart();
    updateCartCount();

    if (!saved) showToast("Unable to save your cart.");
  }

  if (action === "remove") {
    const saved = removeFromCart(id);
    renderCart();
    updateCartCount();

    if (!saved) showToast("Unable to save your cart.");
    else showToast("Product removed from cart.");
  }

  if (action === "checkout") {
    const confirmed = window.confirm(
      "This is a demonstration checkout. No real order or payment will be processed. Clear the demo cart?"
    );

    if (confirmed) {
      if (clearCart()) {
        renderCart();
        updateCartCount();
        showToast("Demo cart cleared successfully.");
      } else {
        showToast("Unable to save your cart.");
      }
    }
  }
});

window.addEventListener("hashchange", renderRoute);

renderRoute();
