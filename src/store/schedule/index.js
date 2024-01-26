import { RepositoryFactory } from '@/Repository/RepositoryFactory'
const Schedule = RepositoryFactory.get('scheduler_repository')

const state = {

}

const getters = {

}

const mutations = {

}

const actions = {
  /**************
  * Positions
  **************/
  
  async getAvailablePositions({ commit }) {
    return await Schedule.getAvailablePositions().then(
      (response) => {
        if (response.status === 200 || response.status === 201) {
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
            message: `Failed for ${payload.mobile}. ${message}`,
            color: 'red',
            show: true
          },
          { root: true }
        )

        return Promise.reject(message)
      }
    )
  },

  async getAvailablePosition({ commit }, id) {
    return await Schedule.getAvailablePosition(id).then(
      (response) => {
        if (response.status === 200 || response.status === 201) {
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
            message: `Failed for ${payload.mobile}. ${message}`,
            color: 'red',
            show: true
          },
          { root: true }
        )

        return Promise.reject(message)
      }
    )
  },

  async createPosition({ commit }, payload) {
    return await Schedule.createPosition(payload).then(
      (response) => {
        if (response.status === 200 || response.status === 201) {
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
            message: `Failed for ${payload.mobile}. ${message}`,
            color: 'red',
            show: true
          },
          { root: true }
        )

        return Promise.reject(message)
      }
    )
  },
  
  // Send SMS
  async sendSMS({ commit }, payload) {
    return await Schedule.sendSMS(payload).then(
      (response) => {
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

          return Promise.resolve(response.data)
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
            message: `Failed for ${payload.mobile}. ${message}`,
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

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}