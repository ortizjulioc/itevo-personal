'use client';
import React, { use } from 'react';
import IconCaretDown from '../icon/icon-caret-down';
import IconCaretsDown from '../icon/icon-carets-down';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import classNames from 'classnames';

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
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const totalPages = Math.ceil(total / top);
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    return (
        <ul className="inline-flex items-center mb-4">

            <PaginationLink
                href={createPageURL(1)}
                disabled={isFirstPage}
                isFirst
            >
                <IconCaretsDown className='rotate-90 size-5' />
            </PaginationLink>
            <PaginationLink
                href={createPageURL(currentPage - 1)}
                disabled={isFirstPage}
            >
                <IconCaretDown className='rotate-90 size-5' />
            </PaginationLink>
            {!isFirstPage && (
                <PaginationLink
                    href={createPageURL(currentPage - 1)}
                >
                    {currentPage - 1}
                </PaginationLink>
            )}

            <PaginationLink
                href={'#'}
                isActive={true}
            >
                {currentPage}
            </PaginationLink>
            {!isLastPage && (
                <PaginationLink
                    href={createPageURL(currentPage + 1)}
                >
                    {currentPage + 1}
                </PaginationLink>
            )}
            <PaginationLink
                href={createPageURL(currentPage + 1)}
                disabled={isLastPage}
            >
                <IconCaretDown className='-rotate-90 size-5' />
            </PaginationLink>
            <PaginationLink
                href={createPageURL(totalPages)}
                disabled={isLastPage}
                isLast
            >
                <IconCaretsDown className='-rotate-90 size-5' />
            </PaginationLink>
        </ul>
    );
};

export default Pagination;

interface PaginationLinkProps {
    children: React.ReactNode;
    href: string;
    disabled?: boolean;
    isFirst?: boolean;
    isLast?: boolean;
    isActive?: boolean;
}

const PaginationLink: React.FC<PaginationLinkProps> = ({ children, href, disabled = false, isActive = false, isFirst = false, isLast = false }) => {
    const linkClasses = classNames(
        'flex justify-center font-semibold px-3.5 py-2 transition', // Clases comunes
        {
          'bg-primary text-white dark:text-white-light dark:bg-primary': isActive, // Clases para el estado activo
          'bg-white-light text-dark hover:text-white hover:bg-primary dark:text-white-light dark:bg-[#191e3a] dark:hover:bg-primary':
            !isActive && !disabled, // Clases para el estado no activo
          'bg-white-light text-dark dark:text-white-light dark:bg-[#191e3a] opacity-50 cursor-not-allowed ': disabled,
          'rounded-l-full': isFirst, // Estilo para el primer botón
          'rounded-r-full': isLast,  // Estilo para el último botón
        }
      );

    return (
        <li>
            {(disabled || isActive) ? (
                <span className={linkClasses}>{children}</span>
            ) : (
                <Link href={href} className={linkClasses}>
                    {children}
                </Link>
            )}
        </li>
    );
};
