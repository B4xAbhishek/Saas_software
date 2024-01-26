import router from '../router'
import { ROLES } from '../utils/constants'

export default {
  methods: {
    getSelectedModel() {
      const model = JSON.parse(localStorage.getItem('model'))

      if (model) {
        return model
      }

      return null
    },
    moveTo(to) {
      if (this.$route.path !== to) {
        this.$router.push(to).catch(() => {})
      }
    },
    getLoggedUser() {
      const user = JSON.parse(localStorage.getItem('teoUserToken'))

      if (user) {
        return user
      }

      return null
    },

    isAdmin() {
      const user = JSON.parse(localStorage.getItem('teoUserToken'))

      if (user && user.type === ROLES.ADMIN) {
        return true
      }

      return false
    },

    isCustomer() {
      const user = JSON.parse(localStorage.getItem('teoUserToken'))

      if (user && user.type === ROLES.CUSTOMER) {
        return true
      }

      return false
    },

    isCustomerUser() {
      const user = JSON.parse(localStorage.getItem('teoUserToken'))

      if (user && user.type === ROLES.CUSTOMER_USER) {
        return true
      }

      return false
    },

    getAccessToken() {
      const user = JSON.parse(localStorage.getItem('teoUserToken'))
      let token = null

      if (user) {
        token = user.access_token
      }

      return token
    },

    getRefreshToken() {
      const user = JSON.parse(localStorage.getItem('teoUserToken'))
      let token = null

      if (user) {
        token = user.refresh_token
      }

      return token
    },

    redirectUser(userInfo) {
      let user = null

      if (userInfo) {
        user = { ...userInfo }
      } else {
        user = this.getLoggedUser()
      }

      const userType = user.type || user.user_type

      if (user && userType === ROLES.CUSTOMER) {
        router.push('/projects').catch(() => { })
      }
      if (user && userType === ROLES.CUSTOMER_USER) {
        router.push('/projects').catch(() => {})
      }
      if (user && userType === ROLES.ADMIN) {
        router.push('/dashboard/analytics').catch(() => {})
      }
    },

    logoutUser() {
      const user = JSON.parse(localStorage.getItem('teoUserToken'))

      if (user) {
        localStorage.removeItem('teoUserToken')
      }

      this.moveTo('/auth/signin')
      
    },

    removeUser() {
      const user = JSON.parse(localStorage.getItem('teoUserToken'))

      if (user) {
        localStorage.removeItem('teoUserToken')
      }
    }
  }
}