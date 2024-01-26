import Repository from './Repository'
import mixins from '@/mixins/global'

const support = 'admin/support'
const admin_support_ticket = 'admin/support_ticket'
const customer_support_ticket = 'customer/support_ticket'

export default {
  // List Tickets
  getTickets(payload) {
    const queryParams = {
      priority: payload && payload.priority ? payload.priority : '',
      status: payload && payload.status || null,
      page: payload && payload.page ? payload.page : 1,
      size: payload && payload.size ? payload.size : 10
    }

    const isAdmin = mixins.methods.isAdmin()

    if (isAdmin) {
      return Repository.get(`${admin_support_ticket}`, { params: queryParams })
    }

    return Repository.get(`${customer_support_ticket}`, { params: queryParams })
  },

  // Get Single Ticket
  getTicket(id) {
    const isAdmin = mixins.methods.isAdmin()

    if (isAdmin) {
      return Repository.get(`${admin_support_ticket}/${id}`)
    }

    return Repository.get(`${customer_support_ticket}/${id}`)
  },

  // Create Ticket
  createTicket(payload) {
    const isAdmin = mixins.methods.isAdmin()

    if (isAdmin) {
      return Repository.post(`${admin_support_ticket}`, payload)
    }

    return Repository.post(`${customer_support_ticket}`, payload)
  },

  // Update Ticket
  updateTicket(payload) {
    const isAdmin = mixins.methods.isAdmin()

    const { id } = payload

    delete payload.id

    if (isAdmin) {
      return Repository.put(`${admin_support_ticket}/${id}`, payload)
    }

    delete payload.assigned_to
    
    return Repository.put(`${customer_support_ticket}/${id}`, payload)
  },

  // Create Comment on Ticket
  createTicketComment(payload) {
    const isAdmin = mixins.methods.isAdmin()
    
    const { id } = payload

    delete payload.id

    if (isAdmin) {
      return Repository.post(`${admin_support_ticket}/${id}/comment`, payload)
    }

    return Repository.post(`${customer_support_ticket}/${id}/comment`, payload)
  },

  getAdminUsers() {
    return Repository.get('admin/user_management/teosite_admins')
  },

  // Get Problem Types
  getProblemTypes() {
    return Repository.get('public_static/problem_type')
  }
}
