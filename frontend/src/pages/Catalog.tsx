import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Container from '@/components/layout/Container';
import ProductCard from '@/components/product/ProductCard';
import { Product } from '@/types/product';

const Catalog = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [inStock, setInStock] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');

  // Mock data for products
  const products: Product[] = [
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
    },
    {
      id: '5',
      name: 'Минимализм-04 1900*2300*580 Ясень',
      article: 'Артикул: 078-9074',
      dimensions: '1900*2300*580',
      price: 56700,
      currency: 'RUB',
      inStock: true,
      badges: [],
      image: {
        src: 'https://images.unsplash.com/photo-1556906781-9a42777b5e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
        alt: 'Кухонный гарнитур Минимализм-04',
        hoverSrc: 'https://images.unsplash.com/photo-1593064422265-9a7cfb3bfafb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'
      },
      description: 'Минималистичный кухонный гарнитур с функциональной планировкой',
      category: 'kitchen',
      brand: 'Мебельград',
      rating: 4.5,
      reviewsCount: 67
    },
    {
      id: '6',
      name: 'Эко-06 1700*2100*520 Орех',
      article: 'Артикул: 078-9075',
      dimensions: '1700*2100*520',
      price: 38900,
      oldPrice: 42000,
      currency: 'RUB',
      inStock: true,
      badges: ['sale'],
      image: {
        src: 'https://images.unsplash.com/photo-1590134280403-b3c6d27bc1ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80',
        alt: 'Кухонный гарнитур Эко-06',
        hoverSrc: 'https://images.unsplash.com/photo-1593064422265-9a42777b5e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'
      },
      description: 'Экологичный кухонный гарнитур из натуральных материалов',
      category: 'kitchen',
      brand: 'Мебельград',
      rating: 4.4,
      reviewsCount: 92
    }
  ];

  // Mock data for filters
  const colors = [
    { id: 'white', name: 'Белый' },
    { id: 'black', name: 'Черный' },
    { id: 'brown', name: 'Коричневый' },
    { id: 'gray', name: 'Серый' },
    { id: 'beige', name: 'Бежевый' },
  ];

  const materials = [
    { id: 'wood', name: 'Дерево' },
    { id: 'mdf', name: 'МДФ' },
    { id: 'glass', name: 'Стекло' },
    { id: 'metal', name: 'Металл' },
    { id: 'laminate', name: 'Ламинат' },
  ];

  const handleColorChange = (colorId: string) => {
    if (selectedColors.includes(colorId)) {
      setSelectedColors(selectedColors.filter(id => id !== colorId));
    } else {
      setSelectedColors([...selectedColors, colorId]);
    }
  };

  const handleMaterialChange = (materialId: string) => {
    if (selectedMaterials.includes(materialId)) {
      setSelectedMaterials(selectedMaterials.filter(id => id !== materialId));
    } else {
      setSelectedMaterials([...selectedMaterials, materialId]);
    }
  };

  return (
    <div className="py-8 bg-gray-50">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {categoryId ? `${categoryId.charAt(0).toUpperCase() + categoryId.slice(1)} - ` : 'Каталог мебели'}
          </h1>
          <p className="text-gray-600 mt-2">
            {products.length} товаров найдено
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Фильтры</h2>
                <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700">
                  Сбросить
                </Button>
              </div>

              {/* Price filter */}
              <div className="mb-8">
                <h3 className="font-medium mb-4 text-gray-900">Цена, ₽</h3>
                <div className="px-1">
                  <Slider
                    defaultValue={[0, 100000]}
                    max={100000}
                    min={0}
                    step={1000}
                    onValueChange={setPriceRange}
                    className="mb-4"
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{priceRange[0].toLocaleString()}</span>
                  <span className="text-sm text-gray-600">{priceRange[1].toLocaleString()}</span>
                </div>
              </div>

              {/* Color filter */}
              <div className="mb-8">
                <h3 className="font-medium mb-4 text-gray-900">Цвет</h3>
                <div className="space-y-2">
                  {colors.map((color) => (
                    <div key={color.id} className="flex items-center">
                      <Checkbox
                        id={`color-${color.id}`}
                        checked={selectedColors.includes(color.id)}
                        onCheckedChange={() => handleColorChange(color.id)}
                      />
                      <label htmlFor={`color-${color.id}`} className="ml-2 text-sm text-gray-700">
                        {color.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Material filter */}
              <div className="mb-8">
                <h3 className="font-medium mb-4 text-gray-900">Материал</h3>
                <div className="space-y-2">
                  {materials.map((material) => (
                    <div key={material.id} className="flex items-center">
                      <Checkbox
                        id={`material-${material.id}`}
                        checked={selectedMaterials.includes(material.id)}
                        onCheckedChange={() => handleMaterialChange(material.id)}
                      />
                      <label htmlFor={`material-${material.id}`} className="ml-2 text-sm text-gray-700">
                        {material.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability filter */}
              <div className="mb-8">
                <div className="flex items-center">
                  <Checkbox
                    id="in-stock"
                    checked={inStock}
                    onCheckedChange={(checked) => setInStock(!!checked)}
                  />
                  <label htmlFor="in-stock" className="ml-2 text-sm text-gray-700">
                    В наличии
                  </label>
                </div>
              </div>

              {/* Sort by */}
              <div>
                <h3 className="font-medium mb-4 text-gray-900">Сортировка</h3>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="По популярности" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">По популярности</SelectItem>
                    <SelectItem value="price-asc">Сначала дешевые</SelectItem>
                    <SelectItem value="price-desc">Сначала дорогие</SelectItem>
                    <SelectItem value="newest">Новинки</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full mt-8 bg-amber-600 hover:bg-amber-700">
                Применить фильтры
              </Button>
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <p className="text-gray-600">
                Показано {products.length} из {products.length} товаров
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Сортировка:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="По популярности" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">По популярности</SelectItem>
                    <SelectItem value="price-asc">Сначала дешевые</SelectItem>
                    <SelectItem value="price-desc">Сначала дорогие</SelectItem>
                    <SelectItem value="newest">Новинки</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <nav className="flex items-center space-x-1">
                <Button variant="outline" size="sm" className="border-gray-300" disabled>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Button>
                <Button variant="outline" size="sm" className="border-gray-300 w-10 h-10">1</Button>
                <Button variant="outline" size="sm" className="border-gray-300 w-10 h-10">2</Button>
                <Button variant="outline" size="sm" className="border-gray-300 w-10 h-10">3</Button>
                <span className="mx-1 text-gray-500">...</span>
                <Button variant="outline" size="sm" className="border-gray-300 w-10 h-10">10</Button>
                <Button variant="outline" size="sm" className="border-gray-300 w-10 h-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Catalog;
