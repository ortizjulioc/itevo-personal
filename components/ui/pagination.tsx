'use client';
import React, { use } from 'react';
import IconCaretDown from '../icon/icon-caret-down';
import IconCaretsDown from '../icon/icon-carets-down';
import { useURLSearchParams } from '@/utils/hooks';

interface PaginationProps {
    currentPage: number; // Página actual
    total: number; // Total de ítems
    top: number; // Ítems por página
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    total,
    top,
}) => {
    const params = useURLSearchParams();

    const totalPages = Math.ceil(total / top);
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        params.set('page', page.toString());
    };

    return (
        <ul className="inline-flex items-center mb-4">

            <li>
                <button
                    type="button"
                    disabled={isFirstPage}
                    onClick={() => handlePageChange(1)}
                    className="flex justify-center font-semibold ltr:rounded-l-full rtl:rounded-r-full px-3.5 py-2 transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white-light disabled:hover:text-dark"
                >
                    <IconCaretsDown className='rotate-90 size-5' />
                </button>
            </li>
            <li>
                <button
                    type="button"
                    disabled={isFirstPage}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="flex justify-center font-semibold px-3.5 py-2 transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white-light disabled:hover:text-dark"
                >
                    <IconCaretDown className='rotate-90 size-5' />
                </button>
            </li>
            {!isFirstPage && (
                <li>
                    <button
                        type="button"
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="flex justify-center font-semibold px-3.5 py-2 transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                    >
                        { currentPage - 1}
                    </button>
                </li>
            )}
            <li>
                <button type="button" className="flex justify-center font-semibold px-3.5 py-2 transition bg-primary text-white dark:text-white-light dark:bg-primary">
                    { currentPage}
                </button>
            </li>
            {!isLastPage && (
                <li>
                    <button
                        type="button"
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="flex justify-center font-semibold px-3.5 py-2 transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary"
                    >
                        {currentPage + 1}
                    </button>
                </li>
            )}
            <li>
                <button
                    type="button"
                    disabled={isLastPage}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="flex justify-center font-semibold px-3.5 py-2 transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white-light disabled:hover:text-dark"
                >
                    <IconCaretDown className='-rotate-90 size-5' />
                </button>
            </li>
            <li>
                <button
                    type="button"
                    disabled={isLastPage}
                    onClick={() => handlePageChange(totalPages)}
                    className="flex justify-center font-semibold ltr:rounded-r-full rtl:rounded-l-full px-3.5 py-2 transition bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white-light disabled:hover:text-dark"
                >
                    <IconCaretsDown className='-rotate-90 size-5' />
                </button>
            </li>
        </ul>
    );
};

export default Pagination;
