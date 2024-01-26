import { RepositoryFactory } from '@/Repository/RepositoryFactory'
const Setting = RepositoryFactory.get('settings_repository')

const state = {
  device_profiles: null
}

const getters = {

}

const actions = {
  // Get Device Profiles
  getDeviceProfiles({ commit }, payload) {
    return Setting.getDeviceProfiles(payload).then(
      async (response) => {
        if (response.status === 200) {
          commit('setDeviceProfiles', response.data.data)

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

  // Get Device Profile
  getDeviceProfile({ commit }, payload) {
    return Setting.getDeviceProfile(payload).then(
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

  // New Device Profile
  createDeviceProfile({ commit }, payload) {
    return Setting.createDeviceProfile(payload).then(
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

  // Set Device Profile Active
  activateDeviceProfile({ commit }, payload) {
    return Setting.activateDeviceProfile(payload).then(
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

  // Update Device Profile
  updateDeviceProfile({ commit }, payload) {
    return Setting.updateDeviceProfile(payload).then(
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

  // Delete Device Profile
  deleteDeviceProfile({ commit }, payload) {
    return Setting.deleteDeviceProfile(payload).then(
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
  setDeviceProfiles: (state, payload) => {
    console.log(payload)
    if (payload && !payload.pagination) {
      state.device_profiles = [...payload]
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