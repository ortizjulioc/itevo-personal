import apiRequest from '@/utils/lib/api-request/request';
import { useEffect, useState} from 'react';
import { Promotion } from '@prisma/client';
import Select from '@/components/ui/select';
import AsyncSelect from 'react-select/async';

export type SelectPromotionType = {
  value: string;
  label: string;
}

export interface PromotionsResponse {
  promotions: Promotion[];
  totalPromotions: number;
}

interface SelectPromotionProps {
  value?: string;
  onChange?: (selected: SelectPromotionType | null) => void;
}

export default function SelectPromotion({ value, ...rest }: SelectPromotionProps) {
  const [options, setOptions] = useState<SelectPromotionType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [defaultValue, setDefaultValue] = useState<SelectPromotionType | null>(null);

  const fetchPromotionData = async (inputValue: string = ''): Promise<SelectPromotionType[]> => {
    try {
      const query = inputValue ? `search=${inputValue}` : '';
      const response = await apiRequest.get<PromotionsResponse>(`/promotions?${query}`);
      if (!response.success) throw new Error(response.message);

      return response.data?.promotions.map(promo => ({
        value: promo.id,
        label: promo.description,
      })) || [];
    } catch (error) {
      console.error('Error fetching promotions data:', error);
      return [];
    }
  };

  const loadOptions = async (inputValue: string): Promise<SelectPromotionType[]> => {
    setLoading(true);
    const result = await fetchPromotionData(inputValue);
    setLoading(false);
    return result;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const fetchedOptions = await fetchPromotionData();
      setOptions(fetchedOptions);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (value) {
      const existingPromotion = options.find(option => option.value === value);
      if (existingPromotion) {
        setDefaultValue(existingPromotion);
      } else {
        const fetchPromotionById = async () => {
          try {
            const response = await apiRequest.get<Promotion>(`/promotions/${value}`);
            if (response.success && response.data) {
              const newOption = { value: response.data.id, label: response.data.description };
              setOptions(prev => [...prev, newOption]);
              setDefaultValue(newOption);
            }
          } catch (error) {
            console.error('Error fetching single promotion:', error);
          }
        };

        fetchPromotionById();
      }
    } else {
      setDefaultValue(null);
    }
  }, [value, options]);



  return (
    <div>
      <Select
        cacheOptions
        loadOptions={loadOptions}
        defaultOptions={options}
        placeholder="-Promociones-"
        noOptionsMessage={() => 'No hay opciones'}
        value={options.filter(({ value }) => value === defaultValue?.value)}
        isLoading={loading}
        asComponent={AsyncSelect}
        isClearable
        {...rest}
      />
    </div>
  );
}
