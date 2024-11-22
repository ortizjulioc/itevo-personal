import { ADMIN } from "@/constants/role.constant";

export const routeConfig = [
    {
      key: 'inicio',
      url: '/',
      authorization: [], 
    },
    {
      key: 'users',
      url: '/users',
      authorization: [], 
    },
    {
      key: 'users-subroutes',
      url: '/users/:path*',
      authorization: [], 
    },
    {
      key: 'roles',
      url: '/roles',
      authorization: [], 
    },
    {
      key: 'roles-subroutes',
      url: '/roles/:path*',
      authorization: [], 
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
      key: 'settings-subroutes',
      url: '/settings/:path*',
      authorization: [ADMIN], 
    },
    {
      key: 'teachers',
      url: '/teachers',
      authorization: [], 
    },
    {
      key: 'teachers-subroutes',
      url: '/teachers/:path*',
      authorization: [], 
    },
    {
      key: 'contactos',
      url: '/contactos',
      authorization: [], 
    },
    {
      key: 'contactos-subroutes',
      url: '/contactos/:path*',
      authorization: [],
    }
  ];
  