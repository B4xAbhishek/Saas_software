import { RepositoryFactory } from '@/Repository/RepositoryFactory'
const Setting = RepositoryFactory.get('settings_repository')

const state = {
  schedule_profiles: [],
  pagination: null
}

const getters = {

}

const actions = {
  // Get Schedule Profiles
  getScheduleProfiles({ commit }, payload) {
    commit('setScheduleProfiles', [])

    return Setting.getScheduleProfiles(payload).then(
      async (response) => {
        if (response.status === 200) {
          commit('setScheduleProfiles', response.data.data)

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

  // New Schedule Profile
  createScheduleProfile({ commit }, payload) {
    return Setting.createScheduleProfile(payload).then(
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

  // Set Schedule Profile Active
  activateScheduleProfile({ commit }, payload) {
    return Setting.activateScheduleProfile(payload).then(
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

  // Update Schedule Profile
  updateScheduleProfile({ commit }, payload) {
    return Setting.updateScheduleProfile(payload).then(
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

  // Delete Schedule Profile
  deleteScheduleProfile({ commit }, payload) {
    return Setting.deleteScheduleProfile(payload).then(
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

  getSchedulesByLevelAndTarget({ commit }, payload) {
    return Setting.getSchedulesByLevelAndTarget(payload).then((response) => {
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

  setSchedulesByLevelAndTarget({ commit }, payload) {
    return Setting.setSchedulesByLevelAndTarget(payload).then((response) => {
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

  deleteSchedulesByLevelAndTarget({ commit }, payload) {
    return Setting.deleteSchedulesByLevelAndTarget(payload).then((response) => {
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
  }
}

const mutations = {
  setScheduleProfiles: (state, payload) => {
    // let profiles = []

    // if (payload && payload.others) {
    //   profiles = [...payload.others]
    // }
    // if (payload && payload.active) {
    //   const activeProfile = { ...payload.active }

    //   activeProfile.active = 'Active'

    //   profiles.unshift(activeProfile)
    // }
    console.log(payload)
    if (payload.schedule && payload.pagination) {
      state.schedule_profiles = [...payload.schedule]
      state.pagination = payload.pagination
    } else {
      state.schedule_profiles = []
      state.pagination = null
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