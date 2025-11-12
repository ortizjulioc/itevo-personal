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
const allRoles = [SUPER_ADMIN, GENERAL_ADMIN, ACADEMIC_ADMIN, BILLING_ADMIN, CASHIER, ASSISTANT];
const adminRoles = [SUPER_ADMIN, GENERAL_ADMIN];
const academicRoles = [SUPER_ADMIN, GENERAL_ADMIN, ACADEMIC_ADMIN];
const billingRoles = [SUPER_ADMIN, GENERAL_ADMIN, BILLING_ADMIN];
const cashierRoles = [SUPER_ADMIN, GENERAL_ADMIN, BILLING_ADMIN, CASHIER];
const assistantRoles = [SUPER_ADMIN, GENERAL_ADMIN, ACADEMIC_ADMIN, ASSISTANT];

export const routeConfig = [
    {
        key: 'inicio',
        url: '/',
        authorization: [],
    },
    // Usuarios - Solo super_admin y general_admin
    {
        key: 'users',
        url: '/users',
        authorization: adminRoles,
    },
    {
        key: 'users-subroutes',
        url: '/users/:path*',
        authorization: adminRoles,
    },
    // Roles - Solo super_admin (general_admin NO puede crear roles)
    {
        key: 'roles',
        url: '/roles',
        authorization: [SUPER_ADMIN],
    },
    {
        key: 'roles-subroutes',
        url: '/roles/:path*',
        authorization: [SUPER_ADMIN],
    },
    // Sucursales - Solo super_admin y general_admin
    {
        key: 'branches',
        url: '/branches',
        authorization: adminRoles,
    },
    {
        key: 'branches-subroutes',
        url: '/branches/:path*',
        authorization: adminRoles,
    },
    // Configuración - Solo super_admin y general_admin
    {
        key: 'settings',
        url: '/settings',
        authorization: adminRoles,
    },
    // Profesores - AcademicAdmin, GeneralAdmin, SuperAdmin
    {
        key: 'teachers',
        url: '/teachers',
        authorization: academicRoles,
    },
    {
        key: 'teachers-subroutes',
        url: '/teachers/:path*',
        authorization: academicRoles,
    },
    // Estudiantes - AcademicAdmin, Assistant, GeneralAdmin, SuperAdmin
    {
        key: 'students',
        url: '/students',
        authorization: [...academicRoles, ASSISTANT],
    },
    {
        key: 'students-subroutes',
        url: '/students/:path*',
        authorization: [...academicRoles, ASSISTANT],
    },
    // Ofertas académicas (course-branch) - AcademicAdmin, GeneralAdmin, SuperAdmin
    {
        key: 'course-branch',
        url: '/course-branch',
        authorization: academicRoles,
    },
    {
        key: 'course-branch-subroutes',
        url: '/course-branch/:path*',
        authorization: academicRoles,
    },
    // Inscripciones - AcademicAdmin, Assistant, GeneralAdmin, SuperAdmin
    {
        key: 'enrollments',
        url: '/enrollments',
        authorization: [...academicRoles, ASSISTANT],
    },
    {
        key: 'enrollments-subroutes',
        url: '/enrollments/:path*',
        authorization: [...academicRoles, ASSISTANT],
    },
    // Asistencias - AcademicAdmin, Assistant, GeneralAdmin, SuperAdmin
    {
        key: 'attendances',
        url: '/attendances',
        authorization: [...academicRoles, ASSISTANT],
    },
    // Cursos - AcademicAdmin, GeneralAdmin, SuperAdmin
    {
        key: 'courses',
        url: '/courses',
        authorization: academicRoles,
    },
    {
        key: 'courses-subroutes',
        url: '/courses/:path*',
        authorization: academicRoles,
    },
    // Promociones - AcademicAdmin, GeneralAdmin, SuperAdmin
    {
        key: 'promotions',
        url: '/promotions',
        authorization: academicRoles,
    },
    {
        key: 'promotions-subroutes',
        url: '/promotions/:path*',
        authorization: academicRoles,
    },
    // Horarios - AcademicAdmin, GeneralAdmin, SuperAdmin
    {
        key: 'schedules',
        url: '/schedules',
        authorization: academicRoles,
    },
    // Días festivos - AcademicAdmin, GeneralAdmin, SuperAdmin
    {
        key: 'holidays',
        url: '/holidays',
        authorization: academicRoles,
    },
    {
        key: 'holidays-subroutes',
        url: '/holidays/:path*',
        authorization: academicRoles,
    },
    // Facturas - Cashier, BillingAdmin, GeneralAdmin, SuperAdmin
    {
        key: 'invoices',
        url: '/invoices',
        authorization: cashierRoles,
    },
    {
        key: 'invoices-subroutes',
        url: '/invoices/:path*',
        authorization: cashierRoles,
    },
    // Cuentas por pagar - BillingAdmin, GeneralAdmin, SuperAdmin
    {
        key: 'bills',
        url: '/bills',
        authorization: billingRoles,
    },
    {
        key: 'bills-subroutes',
        url: '/bills/:path*',
        authorization: billingRoles,
    },
    // Cajas registradoras - BillingAdmin, GeneralAdmin, SuperAdmin
    {
        key: 'cash-registers',
        url: '/cash-registers',
        authorization: billingRoles,
    },
    {
        key: 'cash-registers-subroutes',
        url: '/cash-registers/:path*',
        authorization: billingRoles,
    },
    // Cuentas por cobrar - BillingAdmin, GeneralAdmin, SuperAdmin
    {
        key: 'accounts-receivable',
        url: '/accounts-receivable/',
        authorization: billingRoles,
    },
    {
        key: 'accounts-receivable-subroutes',
        url: '/accounts-receivable/:path*',
        authorization: billingRoles,
    },
    // Productos - BillingAdmin, GeneralAdmin, SuperAdmin
    {
        key: 'products',
        url: '/products',
        authorization: billingRoles,
    },
    {
        key: 'products-:path*',
        url: '/products/:path*',
        authorization: billingRoles,
    },
    // Rangos NCF - BillingAdmin, GeneralAdmin, SuperAdmin
    {
        key: 'ncfranges',
        url: '/ncfranges',
        authorization: billingRoles,
    },
    {
        key: 'ncfranges-:path*',
        url: '/ncfranges/:path*',
        authorization: billingRoles,
    },
    // Cajas - BillingAdmin, GeneralAdmin, SuperAdmin
    {
        key: 'cash-boxes',
        url: '/cash-boxes',
        authorization: billingRoles,
    },
    {
        key: 'cash-boxes-subroutes',
        url: '/cash-boxes/:path*',
        authorization: billingRoles,
    },
    // API - Sin restricciones (se validan en cada endpoint)
    {
        key: 'api',
        url: '/api/:path*',
        authorization: [],
    },
];
