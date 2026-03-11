import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Container from '@/components/layout/Container';
import ProductCard from '@/components/product/ProductCard';
import { Product } from '@/types/product';

const Home = () => {
  // Mock data for featured products
  const featuredProducts: Product[] = [
    {
      id: '1',
      name: 'Лофт-02 2140*2400*600 Cappuccino',
      article: 'Артикул: 078-9070',
      dimensions: '2140*2400*600',
      price: 65451,
      oldPrice: 72000,
      currency: 'RUB',
      inStock: true,
      badges: ['new', 'sale'],
      image: {
        src: 'https://images.unsplash.com/photo-1503602642458-23211ab5128c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
        alt: 'Кухонный гарнитур Лофт-02',
        hoverSrc: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'
      },
      description: 'Стильный кухонный гарнитур в лофтовом стиле',
      category: 'kitchen',
      brand: 'Мебельград',
      rating: 4.8,
      reviewsCount: 124
    },
    {
      id: '2',
      name: 'Классик-05 1800*2200*550 Белый',
      article: 'Артикул: 078-9071',
      dimensions: '1800*2200*550',
      price: 45600,
      currency: 'RUB',
      inStock: true,
      badges: ['hit'],
      image: {
        src: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
        alt: 'Кухонный гарнитур Классик-05',
        hoverSrc: 'https://images.unsplash.com/photo-1505842381624-c6b0571b0a12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'
      },
      description: 'Классический кухонный гарнитур с фасадами из МДФ',
      category: 'kitchen',
      brand: 'Мебельград',
      rating: 4.7,
      reviewsCount: 89
    },
    {
      id: '3',
      name: 'Модерн-03 2000*2500*600 Дуб сонома',
      article: 'Артикул: 078-9072',
      dimensions: '2000*2500*600',
      price: 78900,
      oldPrice: 85000,
      currency: 'RUB',
      inStock: true,
      badges: ['new'],
      image: {
        src: 'https://images.unsplash.com/photo-1556020685-ae41abfc9367?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
        alt: 'Кухонный гарнитур Модерн-03',
        hoverSrc: 'https://images.unsplash.com/photo-1597752109036-a07a4d1d5e34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'
      },
      description: 'Современный кухонный гарнитур с глянцевыми фасадами',
      category: 'kitchen',
      brand: 'Мебельград',
      rating: 4.9,
      reviewsCount: 156
    },
    {
      id: '4',
      name: 'Премиум-01 2200*2600*650 Венге',
      article: 'Артикул: 078-9073',
      dimensions: '2200*2600*650',
      price: 92300,
      currency: 'RUB',
      inStock: false,
      badges: ['sale'],
      image: {
        src: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
        alt: 'Кухонный гарнитур Премиум-01',
        hoverSrc: 'https://images.unsplash.com/photo-1505842381624-c6b0571b0a12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'
      },
      description: 'Премиальный кухонный гарнитур с системой хранения',
      category: 'kitchen',
      brand: 'Мебельград',
      rating: 4.6,
      reviewsCount: 78
    }
  ];

  // Mock data for categories
  const categories = [
    { id: 'kitchen', name: 'Кухни', image: 'https://images.unsplash.com/photo-1505842381624-c6b0571b0a12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80' },
    { id: 'wardrobe', name: 'Шкафы-купе', image: 'https://images.unsplash.com/photo-1597752109036-a07a4d1d5e34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80' },
    { id: 'living-room', name: 'Гостиные', image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80' },
    { id: 'bedroom', name: 'Спальни', image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="h-[500px] bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
          alt="Modern furniture" 
          className="w-full h-full object-cover absolute inset-0"
        />
        <div className="relative z-20 h-full flex items-center justify-center text-center text-white">
          <div className="max-w-3xl px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Modern Furniture For Your Home</h1>
            <p className="text-lg md:text-xl mb-8">Discover our collection of high-quality furniture designed to enhance your living space</p>
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white text-lg px-8 py-4 rounded-lg">
              Browse Catalog
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-lg text-gray-600">Our most popular furniture pieces loved by customers</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600">Find the perfect furniture for every room in your home</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;
