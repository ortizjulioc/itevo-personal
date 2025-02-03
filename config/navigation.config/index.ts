import IconMenuDashboard from '@/components/icon/menu/icon-menu-dashboard';
import { NAV_ITEM_TYPE_COLLAPSE, NAV_ITEM_TYPE_ITEM, NAV_ITEM_TYPE_TITLE } from '@/constants/navigation.constant';
import IconMenuContacts from '@/components/icon/menu/icon-menu-contacts';
import IconMenuWidgets from '@/components/icon/menu/icon-menu-widgets';
import IconMenuAuthentication from '@/components/icon/menu/icon-menu-authentication';
import { IconMenuTodo, IconMenuUsers } from '@/components/icon/menu';
import { TbFileText, TbHome, TbLiveView,TbBooks, TbSpeakerphone, TbUserCog, TbUserEdit, TbUserScreen, TbUserShield } from "react-icons/tb";

const navigationConfig = [
  {
    key: 'inicio',
    title: 'Inicio',
    icon: TbHome,
    url: '/',
    type: NAV_ITEM_TYPE_ITEM,
    subItems: [],
  }
  ,
  {
    key: 'course-branch',
    title: 'Gestion Academica',
    icon: TbBooks,
    url: '/course-branch',
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
  //   icon: IconMenuDashboard,
  //   url: '',
  //   type: NAV_ITEM_TYPE_TITLE,
  //   subItems: [],
  // },
  // {
  //   key: 'page3',
  //   title: 'Page 3',
  //   icon: IconMenuWidgets,
  //   url: '/page2',
  //   type: NAV_ITEM_TYPE_COLLAPSE,
  //   subItems: [
  //     {
  //       key: 'page3-1',
  //       title: 'Page 3-1',
  //       url: '/page3-1',
  //       type: NAV_ITEM_TYPE_ITEM,
  //       subItems: [],
  //     },
  //     {
  //       key: 'page3-2',
  //       title: 'Page 3-2',
  //       url: '/page3-2',
  //       type: NAV_ITEM_TYPE_ITEM,
  //       subItems: [],
  //     },
  //   ],
  // },
];

export default navigationConfig;
