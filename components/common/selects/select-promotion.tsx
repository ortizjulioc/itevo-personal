import { Select } from 'components/ui';
import apiRequest from '@/utils/lib/api-request/request';
import { useEffect, useState} from 'react';
import AsyncSelect from 'react-select/async';
import { Promotion } from '@prisma/client';

interface PromotionSelect {
  value: string;
  label: string;
}

export interface PromotionsResponse {
  promotions: Promotion[];
  totalPromotions: number;
}

interface SelectPromotionProps {
  value?: string;
  onChange?: (selected: PromotionSelect | null) => void;
}

export default function SelectPromotion({ value, ...rest }: SelectPromotionProps) {
  const [options, setOptions] = useState<PromotionSelect[]>([]);

  const fetchPromotionData = async (inputValue: string): Promise<PromotionSelect[]> => {
    try {
      const response = await apiRequest.get<PromotionsResponse>(`/promotions?search=${inputValue}`);
      if (!response.success) {
        throw new Error(response.message);
      }
      console.log('response:', response.data?.promotions);
      return response.data?.promotions.map(promo => ({ value: promo.id, label: promo.description })) || [];
    } catch (error) {
      console.error('Error fetching promotions data:', error);
      return [];
    }
  };

  const loadOptions = async (inputValue: string, callback: (options: PromotionSelect[]) => void) => {
    const options = await fetchPromotionData(inputValue);
    callback(options);
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchedOptions = await fetchPromotionData('');
      setOptions(fetchedOptions);

      if (value && !fetchedOptions.some(option => option.value === value)) {
        try {
          const response = await apiRequest.get<Promotion>(`/promotions/${value}`);
          if (response.success && response.data) {
            const newOption = { value: response.data.id, label: response.data.description };
            setOptions(prevOptions => [...prevOptions, newOption]);
          }
        } catch (error) {
          console.error('Error fetching single promotion:', error);
        }
      }
    };

    fetchData();
  
  }, [value]);
 console.log('options:', options);
 

  return (
    <div>
      <AsyncSelect
        loadOptions={loadOptions}
        cacheOptions
        defaultOptions={options}
        placeholder="-Promociones-"
        noOptionsMessage={() => 'No hay opciones'}
        value={options.find((option) => option.value === value) || null}
        
        isClearable
        {...rest}
      />
    </div>
  );
}
