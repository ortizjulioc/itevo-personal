
import apiRequest from '@/utils/lib/api-request/request';
import { useEffect, useState} from 'react';
import AsyncSelect from 'react-select/async';
import { Product } from '@prisma/client';
import { Select } from '@/components/ui';

interface ProductSelect {
  value: string;
  label: string;
}

export interface ProductsResponse {
  products: Product[];
  totalProducts: number;
}

interface SelectProductProps {
  value?: string;
  onChange?: (selected: ProductSelect | null) => void;
}

export default function SelectProduct({ value, ...rest }: SelectProductProps) {
  const [options, setOptions] = useState<ProductSelect[]>([]);

  const fetchProductData = async (inputValue: string): Promise<ProductSelect[]> => {
    try {
      const response = await apiRequest.get<ProductsResponse>(`/products?search=${inputValue}`);
      if (!response.success) {
        throw new Error(response.message);
      }
   
      return response.data?.products.map(Product => ({ value: Product.id, label: Product.name })) || [];
    } catch (error) {
      console.error('Error fetching Products data:', error);
      return [];
    }
  };

  const loadOptions = async (inputValue: string, callback: (options: ProductSelect[]) => void) => {
    const options = await fetchProductData(inputValue);
    callback(options);
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchedOptions = await fetchProductData('');
      setOptions(fetchedOptions);

      if (value && !fetchedOptions.some(option => option.value === value)) {
        try {
          const response = await apiRequest.get<Product>(`/products/${value}`);
          if (response.success && response.data) {
            const newOption = { value: response.data.id, label: response.data.name };
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
      <Select
        loadOptions={loadOptions}
        cacheOptions
        defaultOptions={options}
        placeholder="-Productos-"
        noOptionsMessage={() => 'No hay opciones'}
        value={options.find((option) => option.value === value) || null}
        isClearable
        asComponent={AsyncSelect}
        {...rest}
      />
    </div>
  );
}
