import { ADMIN, USER, CASHIER } from '@/constants/role.constant';

export const routeConfig = [
    {
        key: 'inicio',
        url: '/',
        authorization: [],
    },
    {
        key: 'users',
        url: '/users',
        authorization: [ADMIN],
    },
    {
        key: 'users-subroutes',
        url: '/users/:path*',
        authorization: [ADMIN],
    },
    {
        key: 'roles',
        url: '/roles',
        authorization: [ADMIN],
    },
    {
        key: 'roles-subroutes',
        url: '/roles/:path*',
        authorization: [ADMIN],
    },
    {
        key: 'branches',
        url: '/branches',
        authorization: [ADMIN],
    },
    {
        key: 'branches-subroutes',
        url: '/branches/:path*',
        authorization: [ADMIN],
    },
    {
        key: 'settings',
        url: '/settings',
        authorization: [ADMIN],
    },
    {
        key: 'teachers',
        url: '/teachers',
        authorization: [ADMIN],
    },
    {
        key: 'teachers-subroutes',
        url: '/teachers/:path*',
        authorization: [ADMIN],
    },
    {
        key: 'students',
        url: '/students',
        authorization: [ADMIN, USER],
    },
    {
        key: 'students-subroutes',
        url: '/students/:path*',
        authorization: [ADMIN, USER],
    },
    {
        key: 'course-branch',
        url: '/course-branch',
        authorization: [ADMIN, USER],
    },
    {
        key: 'course-branch-subroutes',
        url: '/course-branch/:path*',
        authorization: [ADMIN, USER],
    },
    {
        key: 'enrollments',
        url: '/enrollments',
        authorization: [ADMIN, USER],
    },
    {
        key: 'enrollments-subroutes',
        url: '/enrollments/:path*',
        authorization: [ADMIN, USER],
    },
    {
        key: 'attendances',
        url: '/attendances',
        authorization: [ADMIN, USER],
    },
    {
        key: 'courses',
        url: '/courses',
        authorization: [ADMIN, USER],
    },
    {
        key: 'courses-subroutes',
        url: '/courses/:path*',
        authorization: [ADMIN, USER],
    },
    {
        key: 'promotions',
        url: '/promotions',
        authorization: [ADMIN, USER],
    },
    ,
    {
        key: 'promotions-subroutes',
        url: '/promotions/:path*',
        authorization: [ADMIN, USER],
    },
    {
        key: 'schedules',
        url: '/schedules',
        authorization: [ADMIN, USER],
    },
    {
        key: 'holidays',
        url: '/holidays',
        authorization: [ADMIN],
    },
    {
        key: 'holidays-subroutes',
        url: '/holidays/:path*',
        authorization: [ADMIN],
    },
    {
        key: 'invoices',
        url: '/invoices',
        authorization: [ADMIN, CASHIER],
    },
    {
        key: 'invoices-subroutes',
        url: '/invoices/:path*',
        authorization: [ADMIN, CASHIER],
    },
    {
        key: 'bills',
        url: '/bills',
        authorization: [ADMIN],
    },
    {
        key: 'bills-subroutes',
        url: '/bills/:path*',
        authorization: [ADMIN],
    },
    {
        key: 'cash-registers',
        url: '/cash-registers',
        authorization: [ADMIN],
    },
    {
        key: 'cash-registers-subroutes',
        url: '/cash-registers/:path*',
        authorization: [ADMIN],
    },
    {
        key: 'accounts-receivable',
        url: '/accounts-receivable/',
        authorization: [ADMIN],
    },
    {
        key: 'accounts-receivable-subroutes',
        url: '/accounts-receivable/:path*',
        authorization: [ADMIN],
    },
    {
        key: 'products',
        url: '/products',
        authorization: [ADMIN],
    },
    {
        key: 'products-:path*',
        url: '/products/:path*',
        authorization: [ADMIN],
    },
    {
        key: 'ncfranges',
        url: '/ncfranges',
        authorization: [ADMIN],
    },
    {
        key: 'ncfranges-:path*',
        url: '/ncfranges/:path*',
        authorization: [ADMIN],
    },
    {
        key: 'cash-boxes',
        url: '/cash-boxes',
        authorization: [ADMIN],
    },{
        key: 'cash-boxes-subroutes',
        url: '/cash-boxes/:path*',
        authorization: [ADMIN],
    },
    {
        key: 'api',
        url: '/api/:path*',
        authorization: [],
    },
];
