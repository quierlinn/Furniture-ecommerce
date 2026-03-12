import { FC, useEffect, useState } from "react";
import { getProducts } from "../api/products";
import { Product } from "../models/Product";
import SortProducts from "../components/SortProducts"
import PaginatedProducts from "../components/PaginatedProducts";

const AllProducts: FC = () => {
  const [currentProducts, setCurrentProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const productsData = await getProducts();
        setAllProducts(productsData);
        setCurrentProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto min-h-[83vh] p-4 font-karla">
      <div className="grid grid-cols-4 gap-1">
        <div className="col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg dark:text-white">PRODUCTS</span>
            <SortProducts products={currentProducts} onChange={setCurrentProducts} />
          </div>

          <PaginatedProducts products={currentProducts} isLoading={isLoading} initialRows={5} />
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
