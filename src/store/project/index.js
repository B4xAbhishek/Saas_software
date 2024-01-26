import { RepositoryFactory } from '@/Repository/RepositoryFactory'
const Project = RepositoryFactory.get('project_repository')

import router from '../../router'

const state = {
  projects: [],
  projectInfo: null,
  projectLocations: {
    locations: [],
    pagination: null
  }
}

const getters = {
  projects: (state) => state.projects,
  projectInfo: (state) => state.projectInfo,
  projectLocations: (state) => state.projectLocations
}

const actions = {

  // Create Project
  createProject({ commit }, payload) {
    return Project.createProject(payload).then(
      async (response) => {
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

  // List Project
  async getProjects({ commit }, payload) {
    commit('setProjects', [])

    return await Project.getProjects(payload).then((response) => {
      if (response.status === 200) {
        commit('setProjects', response.data.data)

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

  // List User Project
  async getCustomerProjects({ commit }, payload) {
    return await Project.getCustomerProjects(payload).then((response) => {
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

  // List Customer Project Locations
  async getCustomerProjectLocations({ commit }, payload) {
    return await Project.getCustomerProjectLocations(payload).then((response) => {
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

  // List Customer Location
  async getCustomerLocationPositions({ commit }, payload) {
    return await Project.getCustomerLocationPositions(payload).then((response) => {
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

  // Get Single Project
  async getProject({ commit }, payload) {
    commit('setProjectInfo', null)

    return Project.getProject(payload).then(
      async (response) => {
        if (response.status === 200) {
          commit('setProjectInfo', response.data.data)

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

  // Update Project
  async updateProject({ commit }, payload) {
    return Project.updateProject(payload).then(
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

  // Update Location
  async updateLocation({ commit }, payload) {
    const { location_id } = payload

    return Project.updateLocation(payload).then(
      async (response) => {
        if (response.data.success) {
          commit(
            'setToast',
            {
              message: response.data.message,
              color: 'success',
              show: true
            },
            { root: true }
          )

          commit('setUpdatedLocation', { id: location_id, ...payload })
          
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

  // Update Position
  async updatePosition({ commit }, payload) {
    return Project.updatePosition(payload).then(
      async (response) => {
        if (response.data.success) {
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
      }
    )
  },

  // List Project Locations
  async getProjectLocations({ commit }, payload) {
    commit('setProjectLocations', [])

    return await Project.getProjectLocations(payload).then((response) => {
      if (response.status === 200) {
        commit('setProjectLocations', response.data.data)

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

  // List All Project Locations
  async getAllProjectLocations({ commit }, payload) {
    return await Project.getProjectLocations(payload).then((response) => {
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

  // List Project Positions
  async getLocationPositions({ commit }, payload) {
    return await Project.getLocationPositions(payload).then((response) => {
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

  // Get List of Accessible User sof a adevice
  async getAccessibleUsers({ commit }, payload) {
    let data = null

    try {
      const resp = await Project.getAccessibleUsers(payload)

      if (resp.status === 200) {
        data = resp.data
      }
    }
    catch (error) {
      commit('setToast', {
        message: error.response.data.message ? error.response.data.message : error.message,
        color: 'red',
        show: true
      }, { root: true })
    }

    return data
  }
}

const mutations = {
  setProjects(state, projects) {
    state.projects = JSON.parse(JSON.stringify(projects))
  },
  setProjectInfo(state, payload) {
    state.projectInfo = JSON.parse(JSON.stringify(payload))
  },
  setProjectLocations(state, locations) {
    state.projectLocations = JSON.parse(JSON.stringify(locations))
  },
  setUpdatedLocation(state, payload) {
    const locationIndex = state.projectLocations.locations.findIndex((loc) => loc.id === payload.id)

    if (locationIndex > -1) {
      const location = {
        id: payload.id,
        name: payload.name,
        description: payload.description
      }

      state.projectLocations.locations = state.projectLocations.locations.map((item, index) => index === locationIndex ? location : item)
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