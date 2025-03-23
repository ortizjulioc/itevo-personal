import { NAV_ITEM_TYPE_ITEM, NAV_ITEM_TYPE_TITLE, NAV_ITEM_TYPE_COLLAPSE } from '@/constants/navigation.constant';
import { TbFileText, TbHome, TbLiveView, TbSpeakerphone, TbUserCog, TbUserEdit, TbUserScreen, TbUserShield,TbSchool, TbEdit, TbSettings } from 'react-icons/tb';

const navigationConfig = [
    {
        key: 'inicio',
        title: 'Inicio',
        icon: TbHome,
        url: '/',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
    },
    {
        key: 'course-branch',
        title: 'Oferta Academica',
        icon: TbSchool,
        url: '/course-branch',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
    },
    {
        key: 'enrollments',
        title: 'Inscripciones',
        icon: TbEdit,
        url: '/enrollments',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
    },
    {
        key: 'teachers',
        title: 'Profesores',
        icon: TbUserScreen,
        url: '/teachers',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
    },
    {
        key: 'students',
        title: 'Estudiantes',
        icon: TbUserEdit,
        url: '/students',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
    },
    {
        key: 'courses',
        title: 'Cursos',
        icon: TbFileText,
        url: '/courses',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
    },
    {
        key: 'branches',
        title: 'Sucursales',
        icon: TbLiveView,
        url: '/branches',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
    },
    {
        key: 'promotions',
        title: 'Promociones',
        icon: TbSpeakerphone,
        url: '/promotions',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
    },

    {
        key: 'maintenance',
        title: 'Mantenimentos',
        icon: TbSettings,
        type: NAV_ITEM_TYPE_COLLAPSE,
        subItems: [
            {
                key: 'schedules',
                title: 'Horarios de clase',
                url: '/schedules',
                type: NAV_ITEM_TYPE_ITEM,
                subItems: [],
            },
            {
                key: 'holidays',
                title: 'Días feriados',
                url: '/holidays',
                type: NAV_ITEM_TYPE_ITEM,
                subItems: [],
            },
        ],
    },
    {
        key: 'auth',
        title: 'Autorización',
        type: NAV_ITEM_TYPE_TITLE,
        subItems: [],
    },
    {
        key: 'users',
        title: 'Usuarios',
        icon: TbUserShield,
        url: '/users',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
    },
    {
        key: 'roles',
        title: 'Roles',
        icon: TbUserCog,
        url: '/roles',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
    },
    // {
    //   key: 'page3',
    //   title: 'Page 3',
    //   icon: TbUserCog,
    //   url: '',
    //   type: NAV_ITEM_TYPE_TITLE,
    //   subItems: [],
    // }
];

export default navigationConfig;