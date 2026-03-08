# Furniture Store – AI Friendly Project

## Project Overview

This is a production-ready fullstack web application for an online furniture store built with React 18, Spring Boot 3, and PostgreSQL.

## Features

- Browse furniture products with filtering and search
- View detailed product information
- Add items to cart and manage cart
- User authentication and authorization
- Order management system
- Admin dashboard for managing products and orders
- Responsive design for mobile and desktop

## Technology Stack

### Frontend
- React 18
- Vite
- React Router v6
- Axios
- Context API
- CSS Modules

### Backend
- Java 17 (Temurin distribution)
- Spring Boot 3
- Spring Security
- JWT Authentication
- PostgreSQL
- JPA (Hibernate)
- MapStruct
- Jakarta Validation
- Flyway (database migrations)
- Swagger / OpenAPI

### DevOps
- Docker
- docker-compose

## Project Structure

```
furniture-ecommerce/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── api/             # API service layer
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── router/          # Routing configuration
│   │   └── styles/          # Global styles
│   └── package.json
├── src/main/java/com/store/ # Spring Boot backend
│   ├── controller/          # REST controllers
│   ├── service/             # Business logic
│   ├── repository/          # Data access layer
│   ├── entity/              # JPA entities
│   ├── dto/                 # Data transfer objects
│   ├── mapper/              # MapStruct mappers
│   ├── config/              # Configuration classes
│   ├── security/            # Security configuration
│   └── exception/           # Global exception handler
├── pom.xml                  # Maven build configuration
├── docker-compose.yml       # Docker orchestration
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile

### Products
- `GET /api/products` - Get all products with optional filters
- `GET /api/products/{id}` - Get a single product by ID
- `GET /api/products?category={categoryId}` - Get products by category
- `POST /api/products` - Create a new product (admin only)
- `PUT /api/products/{id}` - Update a product (admin only)
- `DELETE /api/products/{id}` - Delete a product (admin only)

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

## Getting Started

### Prerequisites
- Java 17
- Node.js 18+
- Docker and Docker Compose
- PostgreSQL (or use Docker Compose to run it)

### Running the Application

#### Option 1: Using Docker Compose (Recommended)
````
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- Database: PostgreSQL on localhost:5432

#### Option 2: Running Locally
1. Start the database:
````
# Using Docker
docker run --name furniture-db -e POSTGRES_DB=furniture_store -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
```

2. Start the backend:
````
cd furniture-ecommerce
./mvnw spring-boot:run
```

3. Start the frontend:
````
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (application.properties)
````
spring.datasource.url=jdbc:postgresql://localhost:5432/furniture_store
spring.datasource.username=postgres
spring.datasource.password=password
jwt.secret=mySecretKey
jwt.expiration=86400
```

### Frontend (.env)
````
VITE_API_BASE_URL=http://localhost:8080/api
```

## Development

### Backend Development
- The backend follows a layered architecture: Controller → Service → Repository → Database
- DTOs are used for data transfer between layers
- MapStruct is used for mapping between entities and DTOs
- Spring Security with JWT is used for authentication and authorization

### Frontend Development
- The frontend uses React with functional components and hooks
- Context API is used for state management
- An API abstraction layer handles HTTP requests
- Components are organized in a modular structure

## Docker Configuration

The project includes Docker configuration for easy deployment:

- `docker-compose.yml`: Orchestrates the entire application stack with Maven build for the backend and Node.js for the frontend

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
