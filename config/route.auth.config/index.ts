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
      authorization: [], 
    },
    {
      key: 'branches-subroutes',
      url: '/branches/:path*',
      authorization: [], 
    },
    {
      key: 'settings',
      url: '/settings',
      authorization: ['admin'], 
    },
  ];
  