import { CartItem, CartResponse } from '@/types/cart';

export const cartService = {
  // Get cart items from localStorage
  getCartItems: (): CartItem[] => {
    if (typeof window === 'undefined') return [];
    
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : [];
  },

  // Add item to cart
  addToCart: (item: CartItem): CartItem[] => {
    const cart = cartService.getCartItems();
    const existingItemIndex = cart.findIndex(cartItem => cartItem.productId === item.productId);
    
    if (existingItemIndex >= 0) {
      // Update quantity if item already exists
      cart[existingItemIndex].quantity += item.quantity;
    } else {
      // Add new item
      cart.push(item);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  },

  // Update item quantity
  updateCartItem: (productId: string, quantity: number): CartItem[] => {
    const cart = cartService.getCartItems();
    const itemIndex = cart.findIndex(item => item.productId === productId);
    
    if (itemIndex >= 0) {
      if (quantity <= 0) {
        cart.splice(itemIndex, 1); // Remove item if quantity is 0 or less
      } else {
        cart[itemIndex].quantity = quantity;
      }
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    return cart;
  },

  // Remove item from cart
  removeFromCart: (productId: string): CartItem[] => {
    const cart = cartService.getCartItems();
    const updatedCart = cart.filter(item => item.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    return updatedCart;
  },

  // Clear cart
  clearCart: (): void => {
    localStorage.removeItem('cart');
  },

  // Get cart total
  getCartTotal: (): number => {
    const cart = cartService.getCartItems();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  // Get cart item count
  getCartItemCount: (): number => {
    const cart = cartService.getCartItems();
    return cart.reduce((count, item) => count + item.quantity, 0);
  }
};
