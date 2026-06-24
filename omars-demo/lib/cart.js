const CART_KEY = 'omars-cart';

export function getCart() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '{}');
  } catch {
    return {};
  }
}

export function saveCart(cart) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(item) {
  const cart = getCart();
  cart[item.id] = { item, qty: (cart[item.id]?.qty || 0) + 1 };
  saveCart(cart);
  return cart;
}

export function cartCount(cart) {
  return Object.values(cart).reduce((sum, line) => sum + line.qty, 0);
}
