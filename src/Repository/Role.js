import Repository from './Repository'
import mixins from '@/mixins/global'

const admin = 'admin/user_management/roles'
const customer = 'customer/user_management/customer_user_role'

export default {
  getRoleModules() {
    return Repository.get('public_static/static_info')
  },
  getRoles() {
    const isAdmin = mixins.methods.isAdmin()
    const isCustomer = mixins.methods.isCustomer()

    if (isAdmin) {
      return Repository.get(admin)
    }

    if (isCustomer) {
      return Repository.get(customer)
    }

    return null
  },
  getRole(id) {
    const isAdmin = mixins.methods.isAdmin()
    const isCustomer = mixins.methods.isCustomer()

    if (isAdmin) {
      return Repository.get(`${admin}/${id}`)
    }

    if (isCustomer) {
      return Repository.get(`${customer}/${id}`)
    }

    return null
  },
  createRole(payload) {
    const isAdmin = mixins.methods.isAdmin()
    const isCustomer = mixins.methods.isCustomer()

    if (isAdmin) {
      return Repository.post(admin, payload)
    }

    if (isCustomer) {
      return Repository.post(customer, payload)
    }

    return null
  },
  updateRole(payload) {
    const isAdmin = mixins.methods.isAdmin()
    const isCustomer = mixins.methods.isCustomer()

    const { id } = payload
    
    delete payload.id

    if (isAdmin) {
      return Repository.put(`${admin}/${id}`, payload)
    }

    if (isCustomer) {
      return Repository.put(`${customer}/${id}`, payload)
    }

    return null
  },
  deleteRole(id) {
    const isAdmin = mixins.methods.isAdmin()
    const isCustomer = mixins.methods.isCustomer()

    if (isAdmin) {
      return Repository.delete(`${admin}/${id}`)
    }

    if (isCustomer) {
      return Repository.delete(`${customer}/${id}`)
    }

    return null
  }
}
