import { RepositoryFactory } from '@/Repository/RepositoryFactory'
const Role = RepositoryFactory.get('role_repository')

const state = {

}

const mutations = {

}

const actions = {
  getRoleModules({ commit }) {
    return Role.getRoleModules().then(
      async (response) => {
        if (response.status === 200 || response.status === 201) {
          return Promise.resolve(response.data.data.customer_user_permission)
        }
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

  getRoles({ commit }) {
    return Role.getRoles().then((response) => {
      if (response.status === 200 || response.status === 201) {
        return Promise.resolve(response.data.data)
      }
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

  getRole({ commit }, id) {
    return Role.getRole(id).then((response) => {
      if (response.status === 200 || response.status === 201) {
        return Promise.resolve(response.data.data)
      }
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

  createRole({ commit }, payload) {
    return Role.createRole(payload).then((response) => {
      if (response.status === 200 || response.status === 201) {
        commit(
          'setToast',
          {
            message: response.data.message,
            color: 'success',
            show: true
          },
          { root: true }
        )

        return Promise.resolve(response.data.data)
      }
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

  deleteRole({ commit }, payload) {
    return Role.deleteRole(payload).then((response) => {
      if (response.status === 200 || response.status === 201) {
        commit(
          'setToast',
          {
            message: response.data.message,
            color: 'success',
            show: true
          },
          { root: true }
        )

        return Promise.resolve(response.data.data)
      }
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

  updateRole({ commit }, payload) {
    return Role.updateRole(payload).then((response) => {
      if (response.status === 200 || response.status === 201) {
        commit(
          'setToast',
          {
            message: response.data.message,
            color: 'success',
            show: true
          },
          { root: true }
        )

        return Promise.resolve(response.data.data)
      }
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}