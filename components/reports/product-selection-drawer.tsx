'use client';

import { useState, useEffect } from 'react';
import Drawer from '@/components/ui/drawer';
import { IconSearch, IconX } from '@/components/icon';
import Checkbox from '@/components/ui/checkbox';
import { Button } from '@/components/ui';
import { useDebounce } from 'use-debounce';

interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
  stock: number;
}

interface ProductSelectionDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedProducts: Product[];
  onSelectionChange: (products: Product[]) => void;
}

const ProductSelectionDrawer = ({ open, onClose, selectedProducts, onSelectionChange }: ProductSelectionDrawerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products?search=${debouncedSearchTerm}&top=20`);
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchProducts();
    }
  }, [debouncedSearchTerm, open]);

  const handleToggleProduct = (product: Product) => {
    const isSelected = selectedProducts.some((p) => p.id === product.id);
    let newSelection;
    if (isSelected) {
      newSelection = selectedProducts.filter((p) => p.id !== product.id);
    } else {
      newSelection = [...selectedProducts, product];
    }
    onSelectionChange(newSelection);
  };

  const isSelected = (productId: string) => {
    return selectedProducts.some((p) => p.id === productId);
  };

  return (
    <Drawer open={open} onClose={onClose} title="Seleccionar Productos">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <input
              type="search"
              placeholder="Buscar productos..."
              className="form-input ltr:pl-9 rtl:pr-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute ltr:left-2 rtl:right-2 top-1/2 -translate-y-1/2 text-gray-500">
              <IconSearch />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <span className="animate-spin border-4 border-primary border-l-transparent rounded-full w-8 h-8 inline-block align-middle m-auto"></span>
            </div>
          ) : products.length > 0 ? (
            <div className="space-y-2">
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${isSelected(product.id)
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                    }`}
                  onClick={() => handleToggleProduct(product)}
                >
                  <div onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={isSelected(product.id)}
                      onChange={() => handleToggleProduct(product)}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{product.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Code: {product.code}
                    </div>
                    <div className="flex justify-between items-center mt-2 text-xs">
                      <span className="font-medium text-primary">RD${product.price.toFixed(2)}</span>
                      <span className={product.stock <= 0 ? 'text-danger' : 'text-success'}>
                        Stock: {product.stock}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No se encontraron productos
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium">
              {selectedProducts.length} producto{selectedProducts.length !== 1 ? 's' : ''} seleccionado{selectedProducts.length !== 1 ? 's' : ''}
            </span>
            {selectedProducts.length > 0 && (
              <button
                type="button"
                className="text-xs text-danger hover:underline"
                onClick={() => onSelectionChange([])}
              >
                Limpiar todo
              </button>
            )}
          </div>
          <Button className="w-full" onClick={onClose}>
            Confirmar Selección
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default ProductSelectionDrawer;
