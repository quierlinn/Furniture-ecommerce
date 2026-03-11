import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Container from '@/components/layout/Container';
import ProductCard from '@/components/product/ProductCard';
import { Product } from '@/types/product';
import { Star, Heart, Share2, Truck, Shield, RotateCcw, Minus, Plus } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const addToCart = useCartStore(state => state.addItem);

  // Mock product data
  const product: Product = {
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
    description: 'Стильный кухонный гарнитур в лофтовом стиле с современными элементами и удобной планировкой.',
    category: 'kitchen',
    brand: 'Мебельград',
    rating: 4.8,
    reviewsCount: 124
  };

  // Mock related products
  const relatedProducts: Product[] = [
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

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Mock images for gallery
  const productImages = [
    product.image.src,
    'https://images.unsplash.com/photo-1593064422265-9a42777b5e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    'https://images.unsplash.com/photo-1593064422265-9a42777b5e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
    'https://images.unsplash.com/photo-1593064422265-9a42777b5e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'
  ];

  return (
    <div className="py-8 bg-white">
      <Container>
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500">
          <ol className="flex items-center space-x-2">
            <li><a href="/" className="hover:text-amber-600">Главная</a></li>
            <li><span>/</span></li>
            <li><a href="/catalog" className="hover:text-amber-600">Каталог</a></li>
            <li><span>/</span></li>
            <li><a href="/catalog/kitchen" className="hover:text-amber-600">Кухни</a></li>
            <li><span>/</span></li>
            <li className="text-gray-900">Лофт-02 2140*2400*600 Cappuccino</li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Gallery */}
          <div>
            <div className="rounded-xl overflow-hidden mb-4">
              <img 
                src={productImages[selectedImage]} 
                alt={product.name} 
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-amber-600' : 'border-gray-200'}`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} ${index + 1}`} 
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <span className="text-sm text-gray-500">{product.article}</span>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < Math.floor(product.rating || 4) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">({product.reviewsCount} отзывов)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-amber-600">
                {Math.round(product.price).toLocaleString()} ₽
              </span>
              {product.oldPrice && (
                <span className="text-xl text-gray-500 line-through">
                  {Math.round(product.oldPrice).toLocaleString()} ₽
                </span>
              )}
              {product.badges?.includes('sale') && product.oldPrice && (
                <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  -{Math.round(100 - (product.price / product.oldPrice) * 100)}%
                </span>
              )}
            </div>

            {/* Dimensions */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Габариты (Ш*Г*В)</h3>
              <p className="text-gray-700">{product.dimensions} мм</p>
            </div>

            {/* Availability */}
            <div className="mb-8">
              <div className="flex items-center">
                {product.inStock ? (
                  <>
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-green-700 font-medium">В наличии</span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-red-700 font-medium">Нет в наличии</span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">Под заказ 2-3 недели</p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center mb-6">
              <span className="mr-4 text-gray-700">Количество:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button 
                  onClick={decreaseQuantity}
                  className="p-2 hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2">{quantity}</span>
                <button 
                  onClick={increaseQuantity}
                  className="p-2 hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Button 
                size="lg" 
                className="flex-1 min-w-[200px] bg-amber-600 hover:bg-amber-700"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                {!product.inStock ? 'Заказать' : 'Добавить в корзину'}
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-gray-300">
                <Heart className="w-5 h-5 mr-2" />
                В избранное
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-gray-300">
                <Share2 className="w-5 h-5 mr-2" />
                Поделиться
              </Button>
            </div>

            {/* Delivery Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Truck className="w-6 h-6 text-amber-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">Доставка</h4>
                  <p className="text-sm text-gray-600">По Москве от 500 ₽</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Shield className="w-6 h-6 text-amber-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">Гарантия</h4>
                  <p className="text-sm text-gray-600">12 месяцев</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <RotateCcw className="w-6 h-6 text-amber-600 mr-3" />
                <div>
                  <h4 className="font-medium text-gray-900">Возврат</h4>
                  <p className="text-sm text-gray-600">14 дней</p>
                </div>
              </div>
            </div>

            {/* Brand */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Бренд</h4>
              <p className="text-gray-700">{product.brand}</p>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <Tabs defaultValue="description" className="mt-16">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="description">Описание</TabsTrigger>
            <TabsTrigger value="specifications">Характеристики</TabsTrigger>
            <TabsTrigger value="reviews">Отзывы</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Описание товара</h3>
            <p className="text-gray-700 leading-relaxed">
              {product.description} Этот кухонный гарнитур сочетает в себе современный дизайн и 
              функциональность. Идеально подходит для просторных кухонь. Фасады выполнены из 
              высококачественного материала с надежной фурнитурой. В комплекте предусмотрены 
              все необходимые секции для хранения.
            </p>
          </TabsContent>
          <TabsContent value="specifications" className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Характеристики</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-b border-gray-200 pb-2">
                <span className="text-gray-500">Материал фасада</span>
                <p className="font-medium">МДФ с пленочным покрытием</p>
              </div>
              <div className="border-b border-gray-200 pb-2">
                <span className="text-gray-500">Материал корпуса</span>
                <p className="font-medium">ЛДСП</p>
              </div>
              <div className="border-b border-gray-200 pb-2">
                <span className="text-gray-500">Цвет фасада</span>
                <p className="font-medium">Cappuccino</p>
              </div>
              <div className="border-b border-gray-200 pb-2">
                <span className="text-gray-500">Тип ручек</span>
                <p className="font-medium">Алюминиевые профили</p>
              </div>
              <div className="border-b border-gray-200 pb-2">
                <span className="text-gray-500">Количество ящиков</span>
                <p className="font-medium">12 шт.</p>
              </div>
              <div className="border-b border-gray-200 pb-2">
                <span className="text-gray-500">Страна производства</span>
                <p className="font-medium">Россия</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Отзывы</h3>
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Анна Петрова</h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < 5 ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-3">23 марта 2023</p>
                <p className="text-gray-700">
                  Отличная мебель! Качество исполнения на высоте. Установили быстро и аккуратно. 
                  Очень довольны покупкой.
                </p>
              </div>
              <div className="pb-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Игорь Смирнов</h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < 4 ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-3">15 февраля 2023</p>
                <p className="text-gray-700">
                  Заказывали кухню в подарок дочери. Весь процесс оформления прошло без проблем. 
                  Ребята молодцы!
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Похожие товары</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProductPage;
