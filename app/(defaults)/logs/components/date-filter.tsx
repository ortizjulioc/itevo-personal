'use client';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import { useURLSearchParams } from '@/utils/hooks';
import { format } from 'date-fns';
import IconCalendar from '@/components/icon/icon-calendar';

export default function DateFilter() {
    const params = useURLSearchParams();
    const currentDate = params.get('date') || format(new Date(), 'yyyy-MM-dd');

    const handleChange = (dates: Date[]) => {
        if (dates.length > 0) {
            const formattedDate = format(dates[0], 'yyyy-MM-dd');
            params.set('date', formattedDate);
        }
    };

    return (
        <div className="relative">
            <Flatpickr
                value={currentDate}
                options={{
                    dateFormat: 'Y-m-d',
                    locale: Spanish,
                    maxDate: new Date(),
                }}
                className="form-input ltr:pl-10 rtl:pr-10"
                onChange={handleChange}
            />
            <div className="absolute inset-y-0 ltr:left-3 rtl:right-3 flex items-center pointer-events-none text-gray-500">
                <IconCalendar />
            </div>
        </div>
    );
}
