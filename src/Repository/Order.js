import Repository from './Repository'
import mixins from '@/mixins/global'

const order = 'admin/order'
const customer_order = 'customer/order_management'
const admin_order = 'admin/order_management/order'

export default {
  // Get Orders
  getOrders(payload) {
    const isAdmin = mixins.methods.isAdmin()

    if (isAdmin) {
      return Repository.get(`${admin_order}`, {
        params: {
          page: payload ? payload.page : 1
        }
      })
    }

    return Repository.get(`${customer_order}`, {
      params: {
        page: payload && payload.page ? payload.page : 1,
        size: payload && payload.size ? payload.size : 10
      }
    })
  },

  getOrder(payload) {
    const isAdmin = mixins.methods.isAdmin()

    if (isAdmin) {
      return Repository.get(`${admin_order}/${payload}`)
    }

    return Repository.get(`${customer_order}/${payload}`)

  },

  assignDevice(payload) {
    const { id, index } = payload

    delete payload.id
    delete payload.index

    return Repository.post(`${admin_order}/${id}/assign/${index}`, payload)
  },

  removeAssignedDevice(payload) {
    return Repository.delete(
      `${admin_order}/${payload.id}/assign/${payload.index}`
    )
  },

  finalizeAssignment(payload) {
    return Repository.post(`${admin_order}/${payload}/finalize`)
  },

  returnDevice(payload) {
    return Repository.post(`${admin_order}/return`, payload)
  },

  updateOrderExpiry(payload) {
    const { id } = payload
    
    delete payload.id

    return Repository.post(`${admin_order}/${id}/expiry_date`, payload)
  },

  updateOrderDeviceExpiry(payload) {
    const { id, index } = payload
    
    delete payload.id
    delete payload.index

    return Repository.post(`${admin_order}/${id}/expiry_date/${index}`, payload)
  },

  replaceCamera(payload) {
    const { order_id, index } = payload
    
    delete payload.index
    delete payload.order_id

    return Repository.post(`admin/order_management/order/${order_id}/replace/${index}`, payload)
  },

  suspendCamera(payload) {
    const { order_id, index } = payload
    
    delete payload.index
    delete payload.order_id

    return Repository.post(`admin/order_management/order/${order_id}/suspend/${index}`, payload)
  },

  suspendOrder(payload) {
    const { order_id } = payload
    
    delete payload.order_id

    return Repository.post(`admin/order_management/order/${order_id}/suspend`, payload)
  },

  setupOrder(payload) {
    return Repository.post(`customer/order_management/${payload.id}/setup`, payload)
  }
}
