
import apiRequest from '@/utils/lib/api-request/request';
import { useEffect, useState} from 'react';
import AsyncSelect from 'react-select/async';
import { Product } from '@prisma/client';
import { Select } from '@/components/ui';
import { GroupBase } from 'react-select';

export interface ProductSelect {
  value: string;
  label: JSX.Element;
  price:number
}

export interface ProductsResponse {
  products: Product[];
  totalProducts: number;
}

interface SelectProductProps {
  value?: string;
  onChange?: (selected: ProductSelect | null) => void;
  disabled?: boolean; 
}

export default function SelectProduct({ value, onChange, disabled }: SelectProductProps) {
  const [options, setOptions] = useState<ProductSelect[]>([]);

  const fetchProductData = async (inputValue: string): Promise<ProductSelect[]> => {
    try {
      const response = await apiRequest.get<ProductsResponse>(`/products?search=${inputValue}`);
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data?.products.map(product => ({
        value: product.id,
        label: (
          <div className="flex flex-col">
            <span className="font-medium">{product.code} - {product.name}</span>
            <span className="text-sm text-gray-500">
              Precio: RD${product.price.toFixed(2)} | 
              <span className={product.stock <= 0 ? 'text-red-600 font-bold ml-1' : 'ml-1'}>
                Stock: {product.stock}
              </span>
            </span>
          </div>
        ),
        price: product.price, // Se añade el precio
      })) || [];
    } catch (error) {
      console.error('Error fetching Products data:', error);
      return [];
    }
  };

  const loadOptions = async (inputValue: string): Promise<ProductSelect[]> => {
    // const options = await fetchProductData(inputValue);
    // callback(options);
    return fetchProductData(inputValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchedOptions = await fetchProductData('');
      setOptions(fetchedOptions);

      if (value && !fetchedOptions.some(option => option.value === value)) {
        try {
          const response = await apiRequest.get<Product>(`/products/${value}`);
          if (response.success && response.data) {
            const newOption = {
              value: response.data.id,
              label: (
                <div className="flex flex-col">
                  <span className="font-medium">{response.data.code} - {response.data.name}</span>
                  <span className="text-sm text-gray-500">
                    Precio: RD${response.data.price.toFixed(2)} | 
                    <span className={response.data.stock <= 0 ? 'text-red-600 font-bold ml-1' : 'ml-1'}>
                      Stock: {response.data.stock}
                    </span>
                  </span>
                </div>
              ),
              price: response.data.price, // Añadimos el precio
            };
            setOptions(prevOptions => [...prevOptions, newOption]);
          }
        } catch (error) {
          console.error('Error fetching single Product:', error);
        }
      }
    };

    fetchData();
  }, [value]);

  return (
    <div>
      <Select<ProductSelect, false, GroupBase<ProductSelect>>
        loadOptions={loadOptions}
        cacheOptions
        defaultOptions={options}
        placeholder="-Productos-"
        noOptionsMessage={() => 'No hay opciones'}
        value={options.find(option => option.value === value) || null}
        isClearable
        asComponent={AsyncSelect}
        onChange={(selected: ProductSelect | null) => {
          if (selected) {
            // Pasa tanto el `productId` como el `price` al componente padre
            onChange?.(selected);
          } else {
            onChange?.(null);
          }
        }}
        isDisabled={disabled}
      />
    </div>
  );
}
