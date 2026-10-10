
export function getRoute() {
  const hash = window.location.hash || "#/";
  const path = hash.slice(1).split("?")[0];

  if (path === "/") return "home";
  if (path === "/products") return "products";
  if (path === "/cart") return "cart";
  if (path === "/about") return "about";

  return "not-found";
}

export function navigate(path) {
  window.location.hash = path;
}
