import { RepositoryFactory } from '@/Repository/RepositoryFactory'
const User = RepositoryFactory.get('user_repository')

import router from '../../router'

const state = {
  subUsers: [],
  subUser: null,
  specialUsers: []
}

const getters = {
  subUsers: (state) => state.subUsers,
  subUser: (state) => state.subUser,
  specialUsers: (state) => state.specialUsers
}

const actions = {
  // Get Special Users List
  async getSpecialUsers({ commit }) {
    try {
      commit('setSpecialUsers', [])
      const resp = await User.getSpecialUsers()

      if (resp.status === 200) {
        commit('setSpecialUsers', resp.data.data)
      }
    } catch (err) {
      commit(
        'setToast',
        {
          message: err.response.data.message
            ? err.response.data.message
            : err.message,
          color: 'red',
          show: true
        },
        { root: true }
      )
    }
  },

  // Get Customer Users List
  async getCustomerUsers({ commit }) {
    try {
      commit('setCustomerUsers', [])
      const resp = await User.getCustomerUsers()

      if (resp.status === 200) {
        commit('setCustomerUsers', resp.data.data)
      }
    } catch (err) {
      commit(
        'setToast',
        {
          message: err.response.data.message
            ? err.response.data.message
            : err.message,
          color: 'red',
          show: true
        },
        { root: true }
      )
    }
  },

  // Get Sub User
  async getSubUser({ commit }) {
    try {
      const resp = await User.getSubUser()

      if (resp.status === 200) {
        commit('setSubUser', resp.data)
      }
    } catch (err) {
      commit(
        'setToast',
        {
          message: err.response.data.message
            ? err.response.data.message
            : err.message,
          color: 'red',
          show: true
        },
        { root: true }
      )
    }
  },

  // Invite Customer User
  async inviteCustomerUser({ commit }, payload) {
    try {
      const resp = await User.inviteCustomerUser(payload)

      if (resp.status === 200) {
        commit(
          'setToast',
          {
            message: 'Invite sent to ' + payload.email,
            color: 'success',
            show: true
          },
          { root: true }
        )
      }
    } catch (err) {
      commit(
        'setToast',
        {
          message: err.response.data.message
            ? err.response.data.message
            : err.message,
          color: 'red',
          show: true
        },
        { root: true }
      )
    }
  },

  // Delete Customer User
  async deleteCustomerUser({ commit }, payload) {
    try {
      const resp = await User.deleteCustomerUser(payload)

      if (resp.status === 200) {
        commit(
          'setToast',
          {
            message: 'User Deleted Successfully.',
            color: 'success',
            show: true
          },
          { root: true }
        )
        router.push('/admin/users')
      }
    } catch (err) {
      commit(
        'setToast',
        {
          message: err.response.data.message
            ? err.response.data.message
            : err.message,
          color: 'red',
          show: true
        },
        { root: true }
      )
    }
  },

  async updateUser({ commit }, payload) {
    return await User.updateUser(payload).then(
      (response) => {
        if (response.status === 200) {
          commit(
            'setToast',
            {
              message: response.data.message,
              color: 'success',
              show: true
            },
            { root: true }
          )
        }

        return Promise.resolve(response.data)
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
      }
    )
  },

  async updatePassword({ commit }, payload) {
    return await User.updatePassword(payload).then(
      (response) => {
        if (response.status === 200) {
          commit(
            'setToast',
            {
              message: response.data.message,
              color: 'success',
              show: true
            },
            { root: true }
          )
        }

        return Promise.resolve(response.data)
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
      }
    )
  },

  async updateCustomerUser({ commit }, payload) {
    return await User.updateCustomerUser(payload).then(
      (response) => {
        if (response.status !== 200) {
          commit(
            'setToast',
            {
              message: response.data.message
                ? err.response.data.message
                : 'Something went wrong.',
              color: 'red',
              show: true
            },
            { root: true }
          )
        }

        return Promise.resolve(response.data)
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
      }
    )
  },

  async getCustomerInviteInfo({ commit }, id) {
    return await User.getCustomerInviteInfo(id).then(
      (response) => {
        if (response.status !== 200) {
          commit(
            'setToast',
            {
              message: response.data.message
                ? err.response.data.message
                : 'Something went wrong.',
              color: 'red',
              show: true
            },
            { root: true }
          ) 
        }

        return Promise.resolve(response.data.data)
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
      }
    )
  },

  async acceptCustomerInvite({ commit }, payload) {
    return await User.acceptCustomerInvite(payload).then(
      (response) => {
        if (response.status !== 200) {
          commit(
            'setToast',
            {
              message: response.data.message
                ? err.response.data.message
                : 'Something went wrong.',
              color: 'red',
              show: true
            },
            { root: true }
          ) 
        }

        return Promise.resolve(response.data)
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
      }
    )
  },

  async getInviteInfo({ commit }, id) {
    return await User.getInviteInfo(id).then(
      (response) => {
        if (response.status !== 200) {
          commit(
            'setToast',
            {
              message: response.data.message
                ? err.response.data.message
                : 'Something went wrong.',
              color: 'red',
              show: true
            },
            { root: true }
          ) 
        }

        return Promise.resolve(response.data.data)
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
      }
    )
  },

  async acceptInviteForCustomerUser({ commit }, payload) {
    return await User.acceptInviteForCustomerUser(payload).then(
      (response) => {
        if (response.status !== 200) {
          commit(
            'setToast',
            {
              message: response.data.message
                ? err.response.data.message
                : 'Something went wrong.',
              color: 'red',
              show: true
            },
            { root: true }
          ) 
        }

        return Promise.resolve(response.data.data)
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
      }
    )
  },

  async acceptInviteForOldUser({ commit }, payload) {
    return await User.acceptInviteForOldUser(payload).then(
      (response) => {
        if (response.status !== 200) {
          commit(
            'setToast',
            {
              message: response.data.message
                ? err.response.data.message
                : 'Something went wrong.',
              color: 'red',
              show: true
            },
            { root: true }
          ) 
        }

        return Promise.resolve(response.data)
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
      }
    )
  }
}

const mutations = {
  setCustomerUsers(state, payload) {
    if (payload.customer_users && Array.isArray(payload.customer_users) && payload.customer_users.length) {
      const users = payload.customer_users.map((user) => {
        user.name = user.first_name + ' ' + user.last_name

        return user
      })

      state.subUsers = JSON.parse(JSON.stringify(users))
    } else {
      state.subUsers = JSON.parse(JSON.stringify(payload))
    }
  },
  setSpecialUsers(state, payload) {
    state.specialUsers = payload
  },
  setSubUser(state, payload) {
    const data = JSON.parse(JSON.stringify(payload))

    if (data && data.owners) {
      const users = payload.owners.map((user) => {
        user.name = user.first_name + ' ' + user.last_name

        return user
      })

      data.owners = JSON.parse(JSON.stringify(users))

      state.subUser = JSON.parse(JSON.stringify(data))
    } else {
      state.subUser = JSON.parse(JSON.stringify(payload))
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
