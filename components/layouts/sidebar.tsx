'use client';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { toggleSidebar } from '@/store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '@/store';
import { useState, useEffect } from 'react';
import IconCaretsDown from '@/components/icon/icon-carets-down';
import IconCaretDown from '@/components/icon/icon-caret-down';
import { usePathname } from 'next/navigation';
import { getTranslation } from '@/i18n';
import { NAV_ITEM_TYPE_ITEM, NAV_ITEM_TYPE_COLLAPSE, NAV_ITEM_TYPE_TITLE } from "@/constants/navigation.constant";
import navigationConfig from '@/config/navigation.config';

interface NavigationConfigInterface {
    key: string;
    title: string;
    icon?: React.ElementType;
    url: string;
    type: string;
    subItems: Array<{
        key: string;
        title: string;
        url: string;
        type: string;
        subItems?: Array<{ key: string; title: string; url: string }>;
    }>;
};

const NavigationConfig: NavigationConfigInterface[] = navigationConfig as NavigationConfigInterface[];
const Sidebar = () => {
    const dispatch = useDispatch();
    const { t } = getTranslation();
    const pathname = usePathname();
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const [errorSubMenu, setErrorSubMenu] = useState(false);
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };
    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);
    useEffect(() => {
        setActiveRoute();
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [pathname]);

    const setActiveRoute = () => {
        document.querySelectorAll('.sidebar ul a.active').forEach(link => {
            link.classList.remove('active');
        });

        document.querySelectorAll('.sidebar ul a').forEach(link => {
            const href = link.getAttribute('href');
            if (href && window.location.pathname.startsWith(href)) {
                // Verifica que sea una coincidencia exacta o comience con la ruta y un separador '/'
                if (window.location.pathname === href || window.location.pathname.startsWith(`${href}/`)) {
                    link.classList.add('active');
                }
            }
        });
    };
    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="h-full bg-white dark:bg-black">
                    <div className="flex items-center justify-between px-4 py-3">
                        <Link href="/" className="main-logo flex shrink-0 items-center">
                            <img className="ml-[5px] w-8 flex-none" src="/assets/images/logo.svg" alt="logo" />
                            <span className="align-middle text-2xl font-semibold ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light lg:inline">ITEVO</span>
                        </Link>
                        <button
                            type="button"
                            className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>
                    <PerfectScrollbar className="relative h-[calc(100vh-80px)]">
                        {NavigationConfig.map(({
                            key,
                            title,
                            icon: Icon,
                            url,
                            type,
                            subItems,
                        }, index) => (
                            <ul key={key + index} className="relative space-y-0.5 p-4 py-0 font-semibold">
                                {type === NAV_ITEM_TYPE_TITLE && (
                                    <span key={index} className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                                        <span>{title}</span>
                                    </span>
                                )}
                                {type === NAV_ITEM_TYPE_COLLAPSE && (
                                    <li key={index} className="menu nav-item">
                                        <button type="button" className={`${currentMenu === key ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu(key)}>
                                            <div className="flex items-center">
                                                {Icon && (<Icon className="shrink-0 group-hover:!text-primary" />)}                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{title}</span>
                                            </div>

                                            <div className={currentMenu !== key ? '-rotate-90 rtl:rotate-90' : ''}>
                                                <IconCaretDown />
                                            </div>
                                        </button>

                                        <AnimateHeight duration={300} height={currentMenu === key ? 'auto' : 0}>
                                            <ul className="sub-menu text-gray-500">
                                                {subItems.map((subItem, subIndex) => (
                                                    <li key={subIndex}>
                                                        <Link href={subItem.url}>{subItem.title}</Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </AnimateHeight>
                                    </li>
                                )}
                                {type === NAV_ITEM_TYPE_ITEM && (
                                    <li className="menu nav-item" key={index}>
                                        <Link href={url}>
                                            <button type="button" className={`${currentMenu === key ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu(key)}>
                                                <div className="flex items-center">
                                                    {Icon && <Icon className="shrink-0 group-hover:!text-primary" />}
                                                    <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{title}</span>
                                                </div>
                                            </button>
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        ))}
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
