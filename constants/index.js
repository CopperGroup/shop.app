import { Store, LayoutDashboard, BarChart3, Package, Link, ShoppingCart, Users, CreditCard, BarChart4, FolderTree, Code, Receipt, Ticket, PlusCircle } from 'lucide-react'

// export const sidebarLinks = [
//   {
//     title: 'Overview',
//     items: [
//       {
//         icon: LayoutDashboard,
//         label: 'Dashboard',
//         href: '/admin/dashboard',
//       },
//       {
//         icon: BarChart3,
//         label: 'Statistics',
//         href: '/admin/statistics',
//       },
//     ],
//   },
//   {
//     title: 'Inventory',
//     items: [
//       {
//         icon: Package,
//         label: 'Stock',
//         href: '/admin/products',
//       },
//       {
//         icon: Link,
//         label: 'Fetch XML',
//         href: '/admin/fetchUrl',
//       },
//       {
//         icon: PlusCircle,
//         label: 'Create Product',
//         href: '/admin/createProduct',
//       },
//       {
//         icon: FolderTree,
//         label: 'Categories',
//         href: '/admin/categories',
//       },
//     ],
//   },
//   {
//     title: 'Sales',
//     items: [
//       {
//         icon: ShoppingCart,
//         label: 'Orders',
//         href: '/admin/Orders',
//       },
//       {
//         icon: Users,
//         label: 'Clients',
//         href: '/admin/clients',
//       },
//     ],
//   },
//   {
//     title: 'Finances',
//     items: [
//       {
//         icon: CreditCard,
//         label: 'Payments',
//         href: '/admin/payments',
//       },
//       {
//         icon: Receipt,
//         label: 'Billing',
//         href: '/admin/billing',
//       },
//       {
//         icon: BarChart4,
//         label: 'Stripe',
//         href: '/admin/stripe',
//       },
//       {
//         icon: Ticket,
//         label: 'Coupons',
//         href: '/admin/coupons',
//       },
//     ],
//   },
//   {
//     title: 'Extensions',
//     items: [
//       {
//         icon: Code,
//         label: 'Marketplace',
//         href: '/admin/extensions/marketplace',
//       },
//       {
//         icon: Code,
//         label: 'Installed',
//         href: '/admin/extensions/installed',
//       },
//     ],
//   },
//   {
//     title: 'Management',
//     items: [
//       {
//         icon: Users,
//         label: 'Staff',
//         href: '/admin/staff',
//       },
//     ],
//   },
// ]
export const sidebarLinks = [
  {
      svgPath: "M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605",
      route: "/admin/dashboard",
      label: "Dashboard"
  },
  {
      svgPath: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z",
      route: "/admin/products",
      label: "Stock",
  },
  {
      svgPath: "M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244",
      route: "/admin/fetchUrl",
      label: "Fetch XML",
  },
  {
      svgPath: "M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
      route: "/admin/createProduct",
      label: "Create product"
  },
  {
      svgPath: "M7 4C5.89543 4 5 4.89543 5 6V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V6C19 4.89543 18.1046 4 17 4H7ZM7 6H17V19H7V6Z M9 9H15 M9 13H15 M9 17H13",
      route: "/admin/Orders",
      label: "Orders"
  },
  {
      svgPath: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z",
      route: "/admin/clients",
      label: "Clients"
  },
  {
      svgPath: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z",
      route: "/admin/payments",
      label: "Payments"
  },
  {
      svgPath: "M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941",
      route: "/admin/statistics",
      label: "Statistics"
  },
  {
      svgPath: "M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z",
      route: "/admin/categories",
      label: "Categories"
  },
  {
      svgPath: "M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5",
      route: "/admin/pixel",
      label: "Pixel"
  }
]

export const headerLinks = [
    {
        label: "Головна",
        href: "/"
      }, 
      {
        label: "Каталог",
        href: "/catalog"
      }
]