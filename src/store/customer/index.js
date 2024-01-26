import { RepositoryFactory } from '@/Repository/RepositoryFactory'
const Account = RepositoryFactory.get('customer_repository')

import router from '../../router'

const state = {
  accounts: []
}

const getters = {
  accounts: (state) => state.accounts
}

const actions = {
  // Get Accounts List
  async getAccounts({ commit }) {
    try {
      const resp = await Account.getAccounts()
      
      if (resp.status === 200) {
        commit('setAccounts', resp.data.data)
      }
    } catch (err) {
      commit('setToast', {
        message: err.response.data.message ? err.response.data.message : err.message,
        color: 'red',
        show: true
      }, { root: true })
    }
  },

  async getAccount({ commit }, payload) {
    return await Account.getAccount(payload).then((response) => {
      if (response.status === 200) {
        return Promise.resolve(response.data.data)
      }

      return Promise.reject(response)
    },
    (error) => {
      const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString()

      commit(
        'setToast',
        {
          message: message,
          color: 'red',
          show: true
        },
        { root: true }
      )

      return Promise.reject(message)
    })
    
  },

  // New Account
  async newAccount({ commit }, payload) {
    try {
      const resp = await Account.newAccount(payload)
      
      if (resp.status === 200) {
        commit('setToast', {
          message: 'Invite sent to ' + payload.email,
          color: 'success',
          show: true
        }, { root: true })
      }
    } catch (err) {
      commit('setToast', {
        message: err.response.data.message ? err.response.data.message : err.message,
        color: 'red',
        show: true
      }, { root: true })
    }
  },

  // Edit Account
  async editAccount({ commit }, payload) {
    try {
      const resp = await Account.editAccount(payload)
      
      if (resp.status === 200) {
        commit('setToast', {
          message: 'Account updated Successfully.',
          color: 'success',
          show: true
        }, { root: true })

        router.push('/customers')
      }
    } catch (err) {
      commit('setToast', {
        message: err.response.data.message ? err.response.data.message : err.message,
        color: 'red',
        show: true
      }, { root: true })
    }
  }
}

const mutations = {
  setAccounts(state, payload) {
    if (payload && payload.length && Array.isArray(payload)) {
      const users = payload.map((user) => {
        user.name = user.first_name + ' ' + user.last_name

        return user
      })

      state.accounts = JSON.parse(JSON.stringify(users))
    } else {
      state.accounts = JSON.parse(JSON.stringify(payload))
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}