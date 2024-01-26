import { ROLES } from '../utils/constants'

export default [
  {
    path: '/projects',
    name: 'projects',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/Owner/Projects/Projects.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.CUSTOMER, ROLES.CUSTOMER_USER]
    }
  },
  {
    path: '/projects/:id',
    name: 'project-details',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/Owner/Projects/ProjectDetail.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.CUSTOMER, ROLES.CUSTOMER_USER]
    }
  },
  {
    path: '/orders',
    name: 'user-orders',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/Owner/Orders/Orders.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.CUSTOMER, ROLES.CUSTOMER_USER]
    }
  },
  {
    path: '/admin/projects',
    name: 'admin-projects',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/Owner/Admin/Projects/Projects.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.CUSTOMER, ROLES.CUSTOMER_USER]
    }
  },
  {
    path: '/admin/projects/add',
    name: 'admin-add-project',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/Owner/Admin/Projects/AddProject.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.CUSTOMER, ROLES.CUSTOMER_USER]
    }
  },
  {
    path: '/admin/projects/:id',
    name: 'admin-edit-project',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/Owner/Admin/Projects/EditProject.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.CUSTOMER, ROLES.CUSTOMER_USER]
    }
  },
  {
    path: '/admin/cameras',
    name: 'admin-cameras',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/Owner/Admin/Cameras/Cameras.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.CUSTOMER, ROLES.CUSTOMER_USER]
    }
  },
  {
    path: '/admin/cameras/:id',
    name: 'admin-edit-camera',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/Owner/Admin/Cameras/EditCamera.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.CUSTOMER, ROLES.CUSTOMER_USER]
    }
  },
  {
    path: '/admin/camera/setup',
    name: 'admin-setup-camera',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/Owner/Admin/Cameras/CameraSetup.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.CUSTOMER, ROLES.CUSTOMER_USER]
    }
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/Owner/Admin/Users/Users.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.CUSTOMER]
    }
  },
  {
    path: '/admin/support',
    name: 'admin-customer-support',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/Owner/Admin/Support/Tickets.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.CUSTOMER, ROLES.CUSTOMER_USER]
    }
  },
  {
    path: '/admin/roles',
    name: 'admin-customer-roles',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/Owner/Admin/Roles/Roles.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.CUSTOMER]
    }
  },
  {
    path: '/admin/users/:email',
    name: 'edit-user',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/Owner/Admin/Users/EditUser.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.CUSTOMER]
    }
  },
  {
    path: '/trade-scheduler',
    name: 'trade-scheduler',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/Owner/TradeScheduler/TradeScheduler.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.CUSTOMER, ROLES.CUSTOMER_USER]
    }
  },
  {
    path: '/resource-logs',
    name: 'resource-logs',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/Owner/ResourceLogs/ResourceLogs.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.CUSTOMER]
    }
  },
  {
    path: '/dashboard/admin',
    name: 'dashboard-admin',
    component: () =>
      import(/* webpackChunkName: "dashboard" */ '@/pages/Owner/Admin/Admin.vue'),
    meta: {
      requiresAuth: true,
      access: [ROLES.CUSTOMER, ROLES.CUSTOMER_USER]
    }
  },
  {
    path: '/dashboard/users',
    name: 'dashboard-users',
    component: () =>
      import(/* webpackChunkName: "dashboard" */ '@/pages/User/Users.vue'),
    meta: {
      requiresAuth: true,
      access: [ROLES.CUSTOMER]
    }
  },
  {
    path: '/profile',
    name: 'user-profile',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/users/EditUserPage.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.CUSTOMER, ROLES.ADMIN, ROLES.CUSTOMER_USER]
    }
  },
  {
    path: '/dashboard/contacts',
    name: 'dashboard-contacts',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/Owner/Contacts/Contacts.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.CUSTOMER, ROLES.CUSTOMER_USER]
    }
  },
  {
    path: '/dashboard/cameras',
    name: 'dashboard-cameras',
    component: () =>
      import(/* webpackChunkName: "dashboard" */ '@/pages/Owner/Cameras/Cameras.vue'),
    meta: {
      requiresAuth: true,
      access: [ROLES.CUSTOMER, ROLES.CUSTOMER_USER]
    }
  }
]
