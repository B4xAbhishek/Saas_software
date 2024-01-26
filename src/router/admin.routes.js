import { ROLES } from '../../src/utils/constants'

export default [
  {
    path: '/dashboard/analytics',
    name: 'dashboard-analytics',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/SuperAdmin/dashboard/DashboardPage.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.ADMIN]
    }
  },
  {
    path: '/customers',
    name: 'admin-customers',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/SuperAdmin/Customers/Customers.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.ADMIN]
    }
  },

  {
    path: '/customers/:id',
    name: 'admin-edit-customer',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/SuperAdmin/Customers/EditCustomer.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.ADMIN]
    }
  },

  {
    path: '/inventory',
    name: 'admin-inventory',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/SuperAdmin/Inventory/Inventory.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.ADMIN]
    }
  },

  {
    path: '/inventory/add-camera',
    name: 'admin-add-camera',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/SuperAdmin/Inventory/AddCamera.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.ADMIN]
    }
  },

  {
    path: '/inventory/edit/:id',
    name: 'admin-edit-inventory',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/SuperAdmin/Inventory/EditFirmware.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.ADMIN]
    }
  },

  {
    path: '/device-admin',
    name: 'device-admin',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/SuperAdmin/DeviceAdmin/DeviceAdmin.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.ADMIN]
    }
  },

  {
    path: '/device-admin/details/:id',
    name: 'device-admin-details',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/SuperAdmin/DeviceAdmin/DeviceDetails.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.ADMIN]
    }
  },

  {
    path: '/device-admin/setting-profile/create',
    name: 'create-device-setting-profile',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/SuperAdmin/DeviceAdmin/SettingProfile/CreateDeviceProfile.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.ADMIN]
    }
  },

  {
    path: '/device-admin/setting-profile/:id',
    name: 'edit-device-setting-profile',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/SuperAdmin/DeviceAdmin/SettingProfile/EditDeviceProfile.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.ADMIN]
    }
  },

  {
    path: '/device-admin/camera-profile/create',
    name: 'create-device-camera-profile',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/SuperAdmin/DeviceAdmin/CameraProfile/AddCameraProfile.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.ADMIN]
    }
  },

  {
    path: '/device-admin/camera-profile/:id',
    name: 'edit-device-camera-profile',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/SuperAdmin/DeviceAdmin/CameraProfile/EditCameraProfile.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.ADMIN]
    }
  },

  {
    path: '/device-admin/schedule-profile/create',
    name: 'create-device-schedule-profile',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/SuperAdmin/DeviceAdmin/ScheduleProfile/AddScheduleProfile.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.ADMIN]
    }
  },

  {
    path: '/device-admin/schedule-profile/:id',
    name: 'edit-device-schedule-profile',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/SuperAdmin/DeviceAdmin/ScheduleProfile/EditScheduleProfile.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.ADMIN]
    }
  },

  {
    path: '/device-admin/ota-firmware/create',
    name: 'create-firmware',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/SuperAdmin/DeviceAdmin/Firmware/AddFirmware.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.ADMIN]
    }
  },

  {
    path: '/plans',
    name: 'plans',
    component: () =>
      import(/* webpackChunkName: "dashboard" */ '@/pages/SuperAdmin/Plans/Plans.vue'),
    meta: {
      requiresAuth: true,
      access: [ROLES.ADMIN]
    }
  },

  {
    path: '/plans/create',
    name: 'create-plan',
    component: () =>
      import(/* webpackChunkName: "dashboard" */ '@/pages/SuperAdmin/Plans/AddPlan.vue'),
    meta: {
      requiresAuth: true,
      access: [ROLES.ADMIN]
    }
  },

  {
    path: '/plans/edit/:id',
    name: 'edit-plan',
    component: () =>
      import(/* webpackChunkName: "dashboard" */ '@/pages/SuperAdmin/Plans/EditPlan.vue'),
    meta: {
      requiresAuth: true,
      access: [ROLES.ADMIN]
    }
  },

  {
    path: '/admin/orders',
    name: 'orders',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/SuperAdmin/Orders/Orders.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.ADMIN]
    }
  },

  {
    path: '/admin/orders/edit/:id',
    name: 'edit-order',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/SuperAdmin/Orders/EditOrder.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.ADMIN]
    }
  },

  {
    path: '/support',
    name: 'admin-support',
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ '@/pages/SuperAdmin/Support/Tickets.vue'
      ),
    meta: {
      requiresAuth: true,
      access: [ROLES.ADMIN]
    }
  }
]
