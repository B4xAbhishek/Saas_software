import Vue from 'vue'
import Router from 'vue-router'

// Routes
import AuthRoutes from './auth.routes'
import AdminRoutes from './admin.routes'
import CustomerUserRoutes from './customer_user.routes'
import CustomerRoutes from './customer.routes'

Vue.use(Router)

export const routes = [
  {
    path: '/',
    redirect: '/dashboard/analytics',
    meta: {
      requiresAuth: true
    }
  },
  ...AuthRoutes,
  ...CustomerRoutes,
  ...CustomerUserRoutes,
  ...AdminRoutes,
  {
    path: '/blank',
    name: 'blank',
    component: () =>
      import(/* webpackChunkName: "blank" */ '@/pages/BlankPage.vue')
  },
  {
    path: '*',
    name: 'error',
    component: () =>
      import(/* webpackChunkName: "error" */ '@/pages/error/NotFoundPage.vue'),
    meta: {
      layout: 'error'
    }
  }
]

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL || '/',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition

    return { x: 0, y: 0 }
  },
  routes
})

/**
 * Before each route update
 */
import mixin from '../mixins/global'
import subuserRoutes from './customer_user.routes'

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((x) => x.meta.requiresAuth)

  if (requiresAuth && !localStorage.getItem('teoUserToken')) {
    return next('/auth/signin')
  } else {
    const accessList = to.meta.access

    if (accessList ) {
      const user = mixin.methods.getLoggedUser()

      if (user && user.type) {
        const isValid = accessList.find(type => type === user.type)
        
        if (isValid) {
          return next()
        }

        return mixin.methods.redirectUser(user)
      }

      return next('/auth/signin')
    } else {
      return next()
    }
  }
})

/**
 * After each route update
 */
router.afterEach((to, from) => {
  const requiresAuth = to.matched.some((x) => x.meta.requiresAuth)

  if (requiresAuth && !localStorage.getItem('teoUserToken')) {
    return router.push('/auth/signin')
  } else {
    return to
  }
})

export default router
