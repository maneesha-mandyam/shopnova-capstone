
export const products = [
  {
    id: 1,
    name: "Cloud Sneakers",
    category: "Fashion",
    price: 1499,
    icon: "👟",
    color: "#e8e0ff",
    description: "Everyday comfort with a modern look."
  },
  {
    id: 2,
    name: "Studio Headphones",
    category: "Electronics",
    price: 2299,
    icon: "🎧",
    color: "#dce9ff",
    description: "Enjoy your favorite music in style."
  },
  {
    id: 3,
    name: "Classic Backpack",
    category: "Accessories",
    price: 1199,
    icon: "🎒",
    color: "#ffe3d6",
    description: "A practical companion for every day."
  },
  {
    id: 4,
    name: "Smart Watch",
    category: "Electronics",
    price: 3499,
    icon: "⌚",
    color: "#d7f4e8",
    description: "A sleek accessory for your daily routine."
  },
  {
    id: 5,
    name: "Everyday Sunglasses",
    category: "Accessories",
    price: 899,
    icon: "🕶️",
    color: "#ffedc9",
    description: "A stylish finishing touch to your outfit."
  },
  {
    id: 6,
    name: "Minimal T-Shirt",
    category: "Fashion",
    price: 699,
    icon: "👕",
    color: "#ffdeeb",
    description: "A versatile essential for your wardrobe."
  },
  {
    id: 7,
    name: "Wireless Speaker",
    category: "Electronics",
    price: 1799,
    icon: "🔊",
    color: "#e0e3ff",
    description: "Bring your music to your everyday moments."
  },
  {
    id: 8,
    name: "Travel Bottle",
    category: "Accessories",
    price: 499,
    icon: "🧴",
    color: "#d6f3f4",
    description: "A reusable bottle for life on the go."
  }
];

export const categories = [
  "All",
  ...new Set(products.map(product => product.category))
];

export function findProduct(id) {
  return products.find(product => product.id === Number(id));
}

export function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(price);
}
