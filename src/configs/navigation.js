import menuUI from './menus/ui.menu'
import menuApps from './menus/apps.menu'
import menuPages from './menus/pages.menu'
import { ROLES } from '../utils/constants'

export default {
  // main navigation - side menu
  menu: [
    {
      text: '',
      key: '',
      items: [
        {
          icon: 'mdi-view-dashboard-outline',
          key: 'menu.dashboard',
          text: 'Dashboard',
          link: '/dashboard/analytics',
          accessLevel: [ROLES.ADMIN]
        },
        {
          icon: 'mdi-camera-account',
          key: 'menu.customers',
          text: 'Customers',
          link: '/customers',
          accessLevel: [ROLES.ADMIN]
        },
        {
          icon: 'mdi-cash-multiple',
          key: 'menu.inventory',
          text: 'Inventory',
          link: '/inventory',
          accessLevel: [ROLES.ADMIN]
        },
        {
          icon: 'mdi-package-variant',
          key: 'menu.plans',
          text: 'Plans',
          link: '/plans',
          accessLevel: [ROLES.ADMIN]
        },
        {
          icon: 'mdi-cart-variant',
          key: 'menu.orders',
          text: 'Orders',
          link: '/admin/orders',
          accessLevel: [ROLES.ADMIN]
        },
        {
          icon: 'mdi-home-city',
          key: 'menu.projects',
          text: 'Projects',
          link: '/projects',
          accessLevel: [ROLES.CUSTOMER, ROLES.CUSTOMER_USER]
        },
        {
          icon: 'mdi-account-multiple',
          key: 'menu.trade_scheduler',
          text: 'Trade Scheduler',
          link: '/trade-scheduler',
          accessLevel: [ROLES.CUSTOMER, ROLES.CUSTOMER_USER]
        },
        {
          icon: 'mdi-clock',
          key: 'menu.resource_logs',
          text: 'Resource Logs',
          link: '/resource-logs',
          accessLevel: [ROLES.CUSTOMER]
        },
        {
          icon: 'mdi-cart-variant',
          key: 'menu.orders',
          text: 'Orders',
          link: '/orders',
          accessLevel: [ROLES.CUSTOMER, ROLES.CUSTOMER_USER]
        },
        {
          icon: 'mdi-cog',
          key: 'menu.deviceAdmin',
          text: 'Device Admin',
          link: '/device-admin',
          accessLevel: [ROLES.ADMIN]
        },
        {
          icon: 'mdi-face-agent',
          key: 'menu.support',
          text: 'Support',
          link: '/support',
          accessLevel: [ROLES.ADMIN]
        },
        // {
        //   icon: 'mdi-account-multiple',
        //   key: 'menu.owners',
        //   text: 'Owners',
        //   link: '/owners',
        //   accessLevel: [ROLES.CUSTOMER_USER]
        // },
        // { icon: 'mdi-cog', key: 'menu.admin', text: 'Admin', link: '/dashboard/admin' },
        {
          text: 'Admin',
          icon: 'mdi-cog',
          key: 'menu.admin',
          accessLevel: [ROLES.CUSTOMER, ROLES.CUSTOMER_USER],
          items: [
            {
              icon: 'mdi-home-city',
              key: 'menu.projects',
              text: 'Projects',
              link: '/admin/projects',
              accessLevel: [ROLES.CUSTOMER, ROLES.CUSTOMER_USER]
            },
            {
              icon: 'mdi-camera',
              key: 'menu.cameras',
              text: 'Cameras',
              link: '/admin/cameras',
              accessLevel: [ROLES.CUSTOMER, ROLES.CUSTOMER_USER]
            },
            {
              icon: 'mdi-video',
              key: 'menu.cameraSetup',
              text: 'Camera Setup',
              link: '/admin/camera/setup',
              accessLevel: [ROLES.CUSTOMER, ROLES.CUSTOMER_USER]
            },
            {
              key: 'menu.users',
              text: 'Users',
              icon: 'mdi-account-group',
              link: '/admin/users',
              accessLevel: [ROLES.CUSTOMER]
            },
            {
              key: 'menu.support',
              text: 'Support',
              icon: 'mdi-face-agent',
              link: '/admin/support',
              accessLevel: [ROLES.CUSTOMER, ROLES.CUSTOMER_USER]
            },
            {
              key: 'menu.roles',
              text: 'Roles',
              icon: 'mdi-key',
              link: '/admin/roles',
              accessLevel: [ROLES.CUSTOMER]
            }
          ]
        }
      ]
    }
    // {
    //   text: 'Apps',
    //   items: menuApps
    // }, {
    //   text: 'Landing Pages',
    //   items: [
    //     { icon: 'mdi-airplane-landing', key: 'menu.landingPage', text: 'Landing Page', link: '/landing' },
    //     { icon: 'mdi-cash-usd-outline', key: 'menu.pricingPage', text: 'Pricing Page', link: '/landing/pricing' }
    //   ]
    // }, {
    //   text: 'UI - Theme Preview',
    //   items: menuUI
    // }, {
    //   text: 'Pages',
    //   key: 'menu.pages',
    //   items: menuPages
    // }, {
    //   text: 'Other',
    //   key: 'menu.others',
    //   items: [
    //     { icon: 'mdi-file-outline', key: 'menu.blank', text: 'Blank Page', link: '/blank' },
    //     { key: 'menu.levels', text: 'Menu Levels',
    //       items: [
    //         { text: 'Menu Levels 2.1' },
    //         { text: 'Menu Levels 2.2',
    //           items: [
    //             { text: 'Menu Levels 3.1' },
    //             { text: 'Menu Levels 3.2' }
    //           ]
    //         }
    //       ]
    //     },
    //     { key: 'menu.disabled', text: 'Menu Disabled', disabled: true }
    //   ]
    // }
  ],

  // footer links
  footer: [
    // {
    //   text: 'Docs',
    //   key: 'menu.docs',
    //   href: 'https://vuetifyjs.com',
    //   target: '_blank'
    // }
  ]
}
