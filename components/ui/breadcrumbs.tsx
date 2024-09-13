import React from 'react';
import IconHome from '../icon/icon-home';
import Link from 'next/link';

interface BreadcrumbsProps {
    items: { label: string; href: string; active?: boolean }[];
    hideIcon?: boolean;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, hideIcon }) => {
    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                {!hideIcon && (
                    <li>
                        <Link href={'/'} className="breadcrumb-icon">
                            <IconHome />
                        </Link>
                    </li>
                )}
                {items.map((item, index) => (
                    <>
                        {item.active ? (
                            <li key={index} className="breadcrumb-item">
                                <span>{item.label}</span>
                            </li>
                        ) : (
                            <li key={index} className="breadcrumb-item">
                                <Link href={item.href}>{item.label}</Link>
                            </li>
                        )}
                    </>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
