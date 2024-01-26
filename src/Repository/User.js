import Repository from './Repository'
import mixins from '@/mixins/global'

const refresh_token = 'auth/refresh_token'

const user_login = 'auth/login'
const user_logout = 'auth/logout'

const forget_password = 'auth/forget_password'
const recover_password = 'auth/forget_password/code'

const customer_user = 'customer_user'
const accept_customer_invite = 'auth/customer/invite'
const customer_profile = 'customer/user_management/profile'
const customer_user_profile = 'customer_user/profile'
const customer_user_roles = 'customer/user_management/customer_user_role'
const accept_customer_user_invite = 'auth/customer_user/invite'

const admin_profile = 'admin/user_management/profile'
const customer_users = 'customer/user_management/customer_user'

const special_users = 'admin/special/users'
const customer_invite_info = 'auth/customer/invite'
const customer_user_invite_info = 'auth/customer_user/invite'

export default {
  // Refresh Token
  refreshToken(payload) {
    return Repository.post(`${refresh_token}`, payload)
  },

  // Logout Request
  logoutUser() {
    return Repository.post(`${user_logout}`)
  },

  // Login Request
  loginUser(payload) {
    return Repository.post(`${user_login}`, payload)
  },

  // Forget Request
  forgetPassword(payload) {
    return Repository.post(`${forget_password}`, payload)
  },

  // Recover Request
  recoverPassword(payload) {
    return Repository.post(`${recover_password}`, payload)
  },

  // Get Special Users
  getSpecialUsers() {
    return Repository.get(`${customer_users}`)
  },

  // Get Customer Profile
  getCustomerProfile() {
    return Repository.get(`${customer_profile}`)
  },

  // Get Customer User Profile
  getCustomerUserProfile() {
    return Repository.get(`${customer_user_profile}`)
  },

  // Get Admin Profile
  getAdminProfile() {
    return Repository.get(`${admin_profile}`)
  },

  // Get User
  getUser() {
    return Repository.get(`${user}`)
  },

  // Get Customer User Roles
  getCustomerUserRoles() {
    return Repository.get(`${customer_user_roles}`)
  },

  // Update User
  updateUser(payload) {
    const isCustomer = mixins.methods.isCustomer()
    const isCustomerUser = mixins.methods.isCustomerUser()
    const isAdmin = mixins.methods.isAdmin()

    if (isCustomer) {
      return Repository.put(`${customer_profile}`, payload)
    }

    if (isCustomerUser) {
      return Repository.put(`${customer_user_profile}`, payload)
    }

    if (isAdmin) {
      return Repository.put(`${admin_profile}`, payload)
    }

    return null
  },

  // Update password
  updatePassword(payload) {
    const isCustomer = mixins.methods.isCustomer()
    const isCustomerUser = mixins.methods.isCustomerUser()
    const isAdmin = mixins.methods.isAdmin()

    if (isCustomer) {
      return Repository.post(`${customer_profile}/change_password`, payload)
    }

    if (isCustomerUser) {
      return Repository.post(`${customer_user_profile}/change_password`, payload)
    }

    if (isAdmin) {
      return Repository.post(`${admin_profile}/change_password`, payload)
    }

    return null
    
  },

  // Get Customer Users
  getCustomerUsers() {
    return Repository.get(`${customer_users}`)
  },

  // Get Sub User
  getSubUser() {
    return Repository.get(`${customer_user}`)
  },

  // Create New User
  registerUser(payload) {
    return Repository.post(`${user}`, payload)
  },

  deleteCustomerUser(payload) {
    return Repository.delete(`${customer_users}/${payload.id}`)
  },

  inviteCustomerUser(payload) {
    return Repository.post(`${customer_users}`, payload)
  },

  getInviteInfo(id) {
    return Repository.get(`${customer_user_invite_info}/${id}`)
  },

  getCustomerInviteInfo(id) {
    return Repository.get(`${customer_invite_info}/${id}`)
  },

  acceptCustomerInvite(payload) {
    const { code } = payload

    delete payload.code

    return Repository.post(`${accept_customer_invite}/${code}`, payload)
  },

  updateCustomerUser(payload) {
    return Repository.put(`${customer_users}/${payload.id}`, payload)
  },

  acceptInviteForCustomerUser(payload) {
    return Repository.post(`${accept_customer_user_invite}/${payload.id}`, payload)
  },

  acceptInviteForOldUser(payload) {
    const { id } = payload
    
    return Repository.post(`${customer_user_invite_info}/${id}`, payload)
  }
}