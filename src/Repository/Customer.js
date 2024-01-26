import Repository from './Repository'

const new_account = 'admin/user_management/customers/invite'
const get_account = 'admin/user_management/customers'
const edit_account = 'admin/user_management/customers'
const accounts = 'admin/user_management/customers'

export default {
  // Get Accounts
  getAccounts() {
    return Repository.get(`${accounts}`)
  },

  getAccount(payload) {
    return Repository.get(`${get_account}/${payload}`)
  },

  editAccount(payload) {
    return Repository.put(`${edit_account}/${payload.id}`, payload)
  },

  newAccount(payload) {
    return Repository.post(`${new_account}`, payload)
  }
}