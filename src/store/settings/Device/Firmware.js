import { RepositoryFactory } from '@/Repository/RepositoryFactory'
const Setting = RepositoryFactory.get('settings_repository')

const state = {
  device_models: null,
  device_model: null
}

const getters = {}

const actions = {
  // Get Device Models
  getDeviceModels({ commit }) {
    commit('setDeviceModels', [])

    return Setting.getDeviceModels().then(
      async (response) => {
        if (response.status === 200) {
          commit('setDeviceModels', response.data.data)

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
      }
    )
  },

  // Get Device Model By Name
  getDeviceModel({ commit }, payload) {
    commit('setDeviceModel', null)

    return Setting.getDeviceModel(payload).then(
      async (response) => {
        if (response.status === 200) {
          commit('setDeviceModel', response.data.data)

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
      }
    )
  },

  // Get Model Versions
  getDeviceModelVersions({ commit }, payload) {
    return Setting.getDeviceModelVersions(payload).then(
      async (response) => {
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
      }
    )
  },

  // New Device Model
  createDeviceModel({ commit }, payload) {
    return Setting.createDeviceModel(payload).then(
      async (response) => {
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

  // New Firmware
  createFirmware({ commit }, payload) {
    return Setting.createFirmware(payload).then(
      async (response) => {
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
  setDeviceModels: (state, payload) => {
    state.device_models = payload
  },

  setDeviceModel: (state, payload) => {
    state.device_model = payload
  },

  setModelVersions: (state, payload) => {
    state.model_versions = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
