import { ADMIN, USER, CASHIER } from "@/constants/role.constant";

export const routeConfig = [
  {
    key: "inicio",
    url: "/",
    authorization: [ADMIN, USER, CASHIER],
  },
  {
    key: "users",
    url: "/users",
    authorization: [ADMIN],
  },
  {
    key: "users-subroutes",
    url: "/users/:path*",
    authorization: [ADMIN],
  },
  {
    key: "roles",
    url: "/roles",
    authorization: [ADMIN],
  },
  {
    key: "roles-subroutes",
    url: "/roles/:path*",
    authorization: [ADMIN],
  },
  {
    key: "branches",
    url: "/branches",
    authorization: [ADMIN],
  },
  {
    key: "branches-subroutes",
    url: "/branches/:path*",
    authorization: [ADMIN],
  },
  {
    key: "settings",
    url: "/settings",
    authorization: [ADMIN],
  },
  {
    key: "settings-subroutes",
    url: "/settings/:path*",
    authorization: [ADMIN],
  },
  {
    key: "teachers",
    url: "/teachers",
    authorization: [ADMIN, USER],
  },
  {
    key: "teachers-subroutes",
    url: "/teachers/:path*",
    authorization: [ADMIN, USER],
  },
  {
    key: "students",
    url: "/students",
    authorization: [ADMIN, USER],
  },
  {
    key: "students-subroutes",
    url: "/students/:path*",
    authorization: [ADMIN, USER],
  },
  {
    key: "course-branch",
    url: "/course-branch",
    authorization: [ADMIN, USER],
  },
  {
    key: "enrollments",
    url: "/enrollments",
    authorization: [ADMIN, USER],
  },
  {
    key: "attendances",
    url: "/attendances",
    authorization: [ADMIN, USER],
  },
  {
    key: "courses",
    url: "/courses",
    authorization: [ADMIN, USER],
  },
  {
    key: "promotions",
    url: "/promotions",
    authorization: [ADMIN, USER],
  },
  {
    key: "schedules",
    url: "/schedules",
    authorization: [ADMIN, USER],
  },
  {
    key: "holidays",
    url: "/holidays",
    authorization: [ADMIN],
  },
  {
    key: "invoices",
    url: "/invoices",
    authorization: [ADMIN, CASHIER],
  },
  {
    key: "bills",
    url: "/bills",
    authorization: [ADMIN, CASHIER],
  },
  {
    key: "cash-registers",
    url: "/cash-registers",
    authorization: [ADMIN, CASHIER],
  },
  {
    key: "products",
    url: "/products",
    authorization: [ADMIN, CASHIER],
  },
  {
    key: "ncfranges",
    url: "/ncfranges",
    authorization: [ADMIN, CASHIER],
  },
  {
    key: "api",
    url: "/api/:path*",
    authorization: [],
  },
];
