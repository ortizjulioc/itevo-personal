import { NAV_ITEM_TYPE_ITEM, NAV_ITEM_TYPE_TITLE, NAV_ITEM_TYPE_COLLAPSE } from '@/constants/navigation.constant';
import {
    TbFileText,
    TbHome,
    TbLiveView,
    TbSpeakerphone,
    TbUserCog,
    TbUserEdit,
    TbUserScreen,
    TbUserShield,
    TbSchool,
    TbEdit,
    TbSettings,
    TbShoppingCart,
    TbReceiptTax,
    TbBrandCashapp,
    TbReportMoney,
    TbCheckupList,
    TbCashRegister,
} from 'react-icons/tb';

import { ADMIN, USER, CASHIER } from '@/constants/role.constant';

const navigationConfig = [
    {
        key: 'inicio',
        title: 'Inicio',
        icon: TbHome,
        url: '/',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: [ADMIN, USER, CASHIER]
    },
    {
        key: 'course-branch',
        title: 'Oferta Académica',
        icon: TbSchool,
        url: '/course-branch',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: [ADMIN, USER]
    },
    {
        key: 'enrollments',
        title: 'Inscripciones',
        icon: TbEdit,
        url: '/enrollments',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: [ADMIN, USER]
    },
    {
        key: 'attendances',
        title: 'Asistencia',
        icon: TbCheckupList,
        url: '/attendances',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: [ADMIN, USER]
    },
    {
        key: 'teachers',
        title: 'Profesores',
        icon: TbUserScreen,
        url: '/teachers',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: [ADMIN, USER]
    },
    {
        key: 'students',
        title: 'Estudiantes',
        icon: TbUserEdit,
        url: '/students',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: [ADMIN, USER]
    },
    {
        key: 'courses',
        title: 'Cursos',
        icon: TbFileText,
        url: '/courses',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: [ADMIN, USER]
    },
    {
        key: 'branches',
        title: 'Sucursales',
        icon: TbLiveView,
        url: '/branches',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: [ADMIN]
    },
    {
        key: 'promotions',
        title: 'Promociones',
        icon: TbSpeakerphone,
        url: '/promotions',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: [ADMIN, USER]
    },

    {
        key: 'maintenance',
        title: 'Mantenimientos',
        icon: TbSettings,
        type: NAV_ITEM_TYPE_COLLAPSE,
        auth: [ADMIN, USER],
        subItems: [
            {
                key: 'schedules',
                title: 'Horarios de clase',
                url: '/schedules',
                type: NAV_ITEM_TYPE_ITEM,
                subItems: [],
                auth: [ADMIN, USER],
            },
            {
                key: 'holidays',
                title: 'Días feriados',
                url: '/holidays',
                type: NAV_ITEM_TYPE_ITEM,
                subItems: [],
                auth: [ADMIN],
            },
        ],
    },
    {
        key: 'billing',
        title: 'Facturación',
        type: NAV_ITEM_TYPE_TITLE,
        subItems: [],
        auth: [ADMIN, CASHIER]
    },
    {
        key: 'invoices',
        title: 'Facturación',
        icon: TbBrandCashapp,
        url: '/invoices',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: [ADMIN, CASHIER]
    },
    {
        key: 'bills',
        title: 'Facturas',
        icon: TbReportMoney,
        url: '/bills',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: [ADMIN, CASHIER]
    },
    {
        key: 'cashRegisters',
        title: 'Cajas',
        icon: TbCashRegister,
        url: '/cash-registers',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: [ADMIN, CASHIER]
    },
    {
        key: 'products',
        title: 'Productos',
        icon: TbShoppingCart,
        url: '/products',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: [ADMIN, CASHIER]
    },
    {
        key: 'ncf',
        title: 'Rangos de NCF',
        icon: TbReceiptTax,
        url: '/ncfranges',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: [ADMIN, CASHIER]
    },
    {
        key: 'auth',
        title: 'Autorización',
        type: NAV_ITEM_TYPE_TITLE,
        subItems: [],
        auth: [ADMIN]
    },
    {
        key: 'users',
        title: 'Usuarios',
        icon: TbUserShield,
        url: '/users',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: [ADMIN]
    },
    {
        key: 'roles',
        title: 'Roles',
        icon: TbUserCog,
        url: '/roles',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: [ADMIN]
    }
];

export default navigationConfig;
