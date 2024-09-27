import IconMenuDashboard from '@/components/icon/menu/icon-menu-dashboard';
import IconMenuChat from '@/components/icon/menu/icon-menu-chat';
import { NAV_ITEM_TYPE_COLLAPSE, NAV_ITEM_TYPE_ITEM, NAV_ITEM_TYPE_TITLE } from '@/constants/navigation.constant';
import IconMenuContacts from '@/components/icon/menu/icon-menu-contacts';
import IconMenuWidgets from '@/components/icon/menu/icon-menu-widgets';
import IconUser from '@/components/icon/icon-user';
import IconMenuAuthentication from '@/components/icon/menu/icon-menu-authentication';

const navigationConfig = [
  {
    key: 'inicio',
    title: 'Inicio',
    icon: IconMenuDashboard,
    url: '/',
    type: NAV_ITEM_TYPE_ITEM,
    subItems: [],
  },
  {
    key: 'contactos',
    title: 'Contactos',
    icon: IconMenuContacts,
    url: '/contactos',
    type: NAV_ITEM_TYPE_ITEM,
    subItems: [],
  },
  {
    key: 'chats',
    title: 'Chats',
    icon: IconMenuChat,
    url: '/chats',
    type: NAV_ITEM_TYPE_ITEM,
    subItems: [],
  },
  {
    key: 'branches',
    title: 'Sucursales',
    icon: IconMenuContacts,
    url: '/branches',
    type: NAV_ITEM_TYPE_ITEM,
    subItems: [],
  },
  {
    key: 'auth',
    title: 'Acceso',
    type: NAV_ITEM_TYPE_TITLE,
    subItems: [],
  },
  {
    key: 'users',
    title: 'Usuarios',
    icon: IconUser,
    url: '/users',
    type: NAV_ITEM_TYPE_ITEM,
    subItems: [],
  },
  {
    key: 'roles',
    title: 'Roles',
    icon: IconMenuAuthentication,
    url: '/roles',
    type: NAV_ITEM_TYPE_ITEM,
    subItems: [],
  },
  {
    key: 'page3',
    title: 'Page 3',
    icon: IconMenuDashboard,
    url: '',
    type: NAV_ITEM_TYPE_TITLE,
    subItems: [],
  },
  {
    key: 'page3',
    title: 'Page 3',
    icon: IconMenuWidgets,
    url: '/page2',
    type: NAV_ITEM_TYPE_COLLAPSE,
    subItems: [
      {
        key: 'page3-1',
        title: 'Page 3-1',
        url: '/page3-1',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
      },
      {
        key: 'page3-2',
        title: 'Page 3-2',
        url: '/page3-2',
        type: NAV_ITEM_TYPE_ITEM,
        subItems: [],
      },
    ],
  },
];

export default navigationConfig;
