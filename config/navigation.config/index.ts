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
    TbChartBar,
    TbCertificate,
} from 'react-icons/tb';

import {
    SUPER_ADMIN,
    GENERAL_ADMIN,
    ACADEMIC_ADMIN,
    BILLING_ADMIN,
    CASHIER,
    ASSISTANT,
    // Mantener compatibilidad
    ADMIN,
    USER
} from '@/constants/role.constant';

// Helper para definir roles permitidos
// SuperAdmin tiene acceso a todo
const adminRoles = [SUPER_ADMIN, GENERAL_ADMIN];
const academicRoles = [SUPER_ADMIN, GENERAL_ADMIN, ACADEMIC_ADMIN];
const billingRoles = [SUPER_ADMIN, GENERAL_ADMIN, BILLING_ADMIN];
const cashierRoles = [SUPER_ADMIN, GENERAL_ADMIN, BILLING_ADMIN, CASHIER];
const assistantRoles = [SUPER_ADMIN, GENERAL_ADMIN, ACADEMIC_ADMIN, ASSISTANT];
import { HiOutlineCurrencyDollar } from 'react-icons/hi';
import { LiaCashRegisterSolid } from "react-icons/lia";

const navigationConfig = [
    {
        key: 'inicio',
        title: 'Inicio',
        icon: TbHome,
        url: '/',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: []
    },
    {
        key: 'course-branch',
        title: 'Oferta Académica',
        icon: TbSchool,
        url: '/course-branch',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: academicRoles
    },
    {
        key: 'enrollments',
        title: 'Inscripciones',
        icon: TbEdit,
        url: '/enrollments',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: [...academicRoles, ASSISTANT]
    },
    {
        key: 'attendances',
        title: 'Asistencia',
        icon: TbCheckupList,
        url: '/attendances',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: [...academicRoles, ASSISTANT]
    },
    {
        key: 'teachers',
        title: 'Profesores',
        icon: TbUserScreen,
        url: '/teachers',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: academicRoles
    },
    {
        key: 'students',
        title: 'Estudiantes',
        icon: TbUserEdit,
        url: '/students',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: [...academicRoles, ASSISTANT]
    },
    {
        key: 'courses',
        title: 'Cursos',
        icon: TbFileText,
        url: '/courses',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: academicRoles
    },
    {
        key: 'branches',
        title: 'Sucursales',
        icon: TbLiveView,
        url: '/branches',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: adminRoles
    },
    {
        key: 'promotions',
        title: 'Promociones',
        icon: TbSpeakerphone,
        url: '/promotions',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: academicRoles
    },
    {
        key: 'scholarships',
        title: 'Catalogo de Becas',
        icon: TbCertificate,
        url: '/scholarships',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: [SUPER_ADMIN, GENERAL_ADMIN, ADMIN]
    },

    {
        key: 'maintenance',
        title: 'Mantenimientos',
        icon: TbSettings,
        type: NAV_ITEM_TYPE_COLLAPSE,
        auth: academicRoles,
        subItems: [
            {
                key: 'schedules',
                title: 'Horarios de clase',
                url: '/schedules',
                type: NAV_ITEM_TYPE_ITEM,
                subItems: [],
                auth: academicRoles,
            },
            {
                key: 'holidays',
                title: 'Días feriados',
                url: '/holidays',
                type: NAV_ITEM_TYPE_ITEM,
                subItems: [],
                auth: academicRoles,
            },
        ],
    },
    {
        key: 'billing',
        title: 'Facturación',
        type: NAV_ITEM_TYPE_TITLE,
        subItems: [],
        auth: cashierRoles
    },
    {
        key: 'invoices',
        title: 'Facturación',
        icon: TbBrandCashapp,
        url: '/invoices',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: cashierRoles
    },
    {
        key: 'bills',
        title: 'Facturas',
        icon: TbReportMoney,
        url: '/bills',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: billingRoles
    },
    {
        key: 'cashRegisters',
        title: 'Cuadre de Cajas',
        icon: TbCashRegister,
        url: '/cash-registers',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: billingRoles
    },
    {
        key: 'cashBoxes',
        title: 'Cajas',
        icon: LiaCashRegisterSolid,
        url: '/cash-boxes',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: billingRoles
    },
    {
        key: 'accounts-receivable',
        title: 'Cuentas por cobrar',
        icon: HiOutlineCurrencyDollar,
        url: '/accounts-receivable',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: billingRoles
    },
    {
        key: 'products',
        title: 'Productos',
        icon: TbShoppingCart,
        url: '/products',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: billingRoles
    },
    {
        key: 'ncf',
        title: 'Rangos de NCF',
        icon: TbReceiptTax,
        url: '/ncfranges',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: billingRoles
    },
    {
        key: 'reports',
        title: 'Reportes',
        type: NAV_ITEM_TYPE_TITLE,
        subItems: [],
        auth: billingRoles
    },
    {
        key: 'general-sales-report',
        title: 'Reporte General',
        icon: TbChartBar,
        url: '/reports/general-sales',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: billingRoles
    },
    {
        key: 'sales-report',
        title: 'Ventas por Productos',
        icon: TbChartBar,
        url: '/reports/sold-inventory',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: billingRoles
    },
    {
        key: 'sales-courses-report',
        title: 'Ventas por Curso',
        icon: TbChartBar,
        url: '/reports/sold-courses',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: billingRoles
    },
    {
        key: 'auth',
        title: 'Autorización',
        type: NAV_ITEM_TYPE_TITLE,
        subItems: [],
        auth: adminRoles
    },
    {
        key: 'users',
        title: 'Usuarios',
        icon: TbUserShield,
        url: '/users',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: adminRoles
    },
    {
        key: 'roles',
        title: 'Roles',
        icon: TbUserCog,
        url: '/roles',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
        auth: [SUPER_ADMIN]
    }
];

export default navigationConfig;
