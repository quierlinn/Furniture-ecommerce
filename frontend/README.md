# Furniture Store Frontend

This is the frontend for the furniture store application built with React, Vite, and other modern technologies.

## API Contract

The frontend communicates with the backend through the following API endpoints:

### Products

- `GET /api/products` - Get all products with optional filters
- `GET /api/products/{id}` - Get a single product by ID
- `GET /api/products?category={categoryId}` - Get products by category
- `POST /api/products` - Create a new product (admin only)
- `PUT /api/products/{id}` - Update a product (admin only)
- `DELETE /api/products/{id}` - Delete a product (admin only)

### Categories

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category (admin only)

### Cart

- `POST /api/cart/add` - Add item to cart
- `GET /api/cart` - Get cart items
- `DELETE /api/cart/item/{id}` - Remove item from cart
- `PUT /api/cart/item/{id}` - Update item quantity in cart
- `DELETE /api/cart` - Clear cart

### Orders

- `POST /api/orders` - Create a new order
- `GET /api/orders/user` - Get user's orders
- `GET /api/orders/{id}` - Get order by ID
- `GET /api/orders` - Get all orders (admin only)
- `PUT /api/orders/{id}/status` - Update order status (admin only)

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile

## Environment Variables

- `VITE_API_BASE_URL` - Base URL for the API (defaults to http://localhost:8080/api)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
