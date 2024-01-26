import Repository from './Repository'

const plan = 'admin/order_management/purchase_plan'

export default {
  // Get Plans
  getPlans(payload) {
    const queryParams = {
      page: payload && payload.page ? payload.page : 1,
      size: payload && payload.size ? payload.size : 10
    }

    return Repository.get(`${plan}`, queryParams)
  },

  getPlan(payload) {
    return Repository.get(`${plan}/${payload}`)
  },

  editPlan(payload) {
    return Repository.put(`${plan}/${payload.id}`, payload)
  },

  createPlan(payload) {
    return Repository.post(`${plan}`, payload)
  },

  disablePlan(payload) {
    return Repository.delete(`${plan}/${payload}`)
  }
}