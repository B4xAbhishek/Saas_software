import { RepositoryFactory } from '@/Repository/RepositoryFactory'
const Setting = RepositoryFactory.get('settings_repository')

const state = {
  image_profiles: null
}

const getters = {

}

const actions = {
  // Get Image Profiles By level and target
  getImageProfilesByLevelAndTarget({ commit }, payload) {
    return Setting.getImageProfilesByLevelAndTarget(payload).then(
      async (response) => {
        if (response.status === 200) {
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
  // Get Image Profiles
  getImageProfiles({ commit }, payload) {
    return Setting.getImageProfiles(payload).then(
      async (response) => {
        if (response.status === 200) {
          commit('setImageProfiles', response.data.data.image_settings)

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

  // New Image Profile
  createImageProfile({ commit }, payload) {
    return Setting.createImageProfile(payload).then(
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

  // Update Image Profile
  updateImageProfile({ commit }, payload) {
    return Setting.updateImageProfile(payload).then(
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

  // Delete Image Profile
  deleteImageProfile({ commit }, payload) {
    return Setting.deleteImageProfile(payload).then(
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
  setImageProfiles: (state, payload) => state.image_profiles = payload
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}