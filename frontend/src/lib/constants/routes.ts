/**
 * Application route constants
 */

export const ROUTES = {
  HOME: '/',
  CATALOG: '/catalog',
  PRODUCT: '/product',
  CART: '/cart',
  CHECKOUT: '/checkout',
  AUTH: '/auth',
  ADMIN: '/admin',
  ABOUT: '/about',
  CONTACT: '/contact',
  DELIVERY: '/delivery',
  PAYMENT: '/payment',
} as const;

export type RouteName = keyof typeof ROUTES;
