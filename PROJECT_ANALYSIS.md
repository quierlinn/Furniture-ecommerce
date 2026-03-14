# Project Analysis: Furniture E-commerce Platform

## 1. Project Structure

```
furniture-ecommerce/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── api/             # API service layer
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── models/          # TypeScript interfaces/models
│   │   ├── hooks/           # Custom React hooks
│   │   ├── redux/           # Redux store and slices
│   │   └── assets/          # Images and other assets
│   ├── package.json
│   └── ...
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
├── src/main/resources/      # Configuration files
├── pom.xml                  # Maven build configuration
├── docker-compose.yml       # Docker orchestration
└── README.md
```

## 2. Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: Redux Toolkit + React Context API
- **Styling**: Tailwind CSS
- **Testing**: Cypress (E2E testing)
- **Icons**: React Icons

### Backend
- **Language**: Java 17
- **Framework**: Spring Boot 3
- **Database**: PostgreSQL
- **ORM**: JPA (Hibernate)
- **Authentication**: JWT + Spring Security
- **Validation**: Jakarta Validation
- **Migrations**: Flyway
- **Documentation**: Swagger/OpenAPI
- **Mapping**: MapStruct

### DevOps
- **Containerization**: Docker + Docker Compose
- **CI/CD**: Jenkins (configured via Jenkinsfiles)

## 3. Component Analysis

### Frontend Components
- **Layout Components**: Header/Navbar, Footer, Container
- **UI Components**: ProductCard, Cart, RatingStar, SearchBar, Reviews
- **Sections**: HeroSection, CategoryGrid, FeaturedProducts, Advantages
- **Pages**: Home, Product detail, Category listings, Search, Profile
- **Modals**: LoginModal, BannerPopup, CustomPopup
- **Specialized**: Cart management, Pagination, Sorting

### State Management
- **Redux Slices**: authSlice, cartSlice, homeSlice, productSlice
- **Context**: Used for authentication and cart functionality
- **Models**: Product, Category, CartItem, ReviewItem interfaces

## 4. API Architecture

### Backend Endpoints
- `/api/auth/*` - Authentication (register, login, profile)
- `/api/products/*` - Product management (CRUD operations)
- `/api/cart/*` - Shopping cart functionality
- `/api/orders/*` - Order management
- `/api/categories/*` - Category management

### Frontend API Layer
- Located in `frontend/src/api/products.js`
- Uses fetch API for HTTP requests
- Handles error responses and logging
- Communicates with backend at `http://localhost:8080/api`

## 5. Data Flow & Storage

### Product Data Structure
**Backend Entity** (`Product.java`):
- id: Long
- name: String
- description: String (TEXT field)
- price: BigDecimal
- imageUrl: String
- categoryId: Long

**Frontend Model** (`Product.ts`):
- id: number
- title: string
- images?: string[]
- price: number
- rating: number
- thumbnail?: string
- description?: string
- category: string
- brand?: string
- stock?: number
- discountPercentage?: number

### Data Flow
1. Backend stores data in PostgreSQL database
2. Entities are mapped to DTOs using MapStruct
3. DTOs are exposed via REST API endpoints
4. Frontend fetches data via API calls
5. Data is stored in Redux state and component states

## 6. Key Features Implemented

- **Product Catalog**: Browsing, searching, filtering by category
- **Shopping Cart**: Add/remove items, quantity adjustment
- **User Authentication**: Registration, login, profile management
- **Order Management**: Create and track orders
- **Responsive Design**: Mobile-friendly UI
- **Admin Panel**: Product and order management (role-based access)

## 7. Current State Assessment

This is a well-structured full-stack e-commerce application with:
- Clean separation of concerns between frontend and backend
- Proper authentication and authorization
- Comprehensive API coverage
- Good test coverage (Cypress E2E tests)
- Docker containerization for easy deployment
- Modern tech stack with React, TypeScript, Spring Boot, and PostgreSQL

## 8. Recommendations for Kitchen Furniture Store Transformation

Based on the reference site (https://kuhnivivat.ru/), the following enhancements would be needed:

- **Visual Design**: Update styling to match kitchen furniture aesthetic
- **Product Categories**: Focus on kitchen-specific categories (kitchen sets, cabinets, islands, etc.)
- **Image Gallery**: Enhanced product image viewing experience
- **Filtering Options**: More specific filters for kitchen furniture (size, material, style, etc.)
- **Showroom Integration**: Virtual showroom or 3D visualization features
- **Measurement Tools**: Kitchen planning and measurement features
- **Consultation Booking**: Integration for design consultation appointments
- **Material Samples**: Option to order material samples
- **Assembly Services**: Service offerings alongside products
