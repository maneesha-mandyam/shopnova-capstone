
const STORAGE_KEY = "shopnova.cart.v1";

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    if (!Array.isArray(saved)) return [];

    return saved.filter(item =>
      Number.isInteger(item.id) &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0
    );
  } catch {
    return [];
  }
}

let cart = loadCart();

function saveCart() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    return true;
  } catch {
    return false;
  }
}

export function getCart() {
  return cart.map(item => ({ ...item }));
}

export function addToCart(id) {
  const existing = cart.find(item => item.id === Number(id));

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: Number(id), quantity: 1 });
  }

  return saveCart();
}

export function changeQuantity(id, amount) {
  const item = cart.find(entry => entry.id === Number(id));

  if (!item) return false;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(entry => entry.id !== Number(id));
  }

  return saveCart();
}

export function removeFromCart(id) {
  cart = cart.filter(item => item.id !== Number(id));
  return saveCart();
}

export function clearCart() {
  cart = [];
  return saveCart();
}

export function getCartCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}
