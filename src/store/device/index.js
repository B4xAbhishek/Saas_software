import { RepositoryFactory } from '@/Repository/RepositoryFactory'
const Device = RepositoryFactory.get('device_repository')

import router from '../../router'

const state = {
  devices: [],
  projectImages: null,
  inventory: null
}

const getters = {
  devices: (state) => state.devices,
  inventory: (state) => state.inventory
}

const actions = {

  // List Device
  async getDevices({ commit }, payload) {
    try {
      commit('setDevices', [])
      const resp = await Device.getDevices(payload)
      
      if (resp.status === 200) {
        commit('setDevices', resp.data.data)
      }
    } catch (err) {
      commit('setToast', {
        message: err.response.data.message ? err.response.data.message : err.message,
        color: 'red',
        show: true
      }, { root: true })
    }
  },

  // Get Device Info
  async getDeviceInfo({ commit }, payload) {
    let data = null

    try {
      const resp = await Device.getDeviceInfo(payload)

      if (resp.status === 200) {
        data = { ...resp.data.data }
      }
    }
    catch (err) {
      commit('setToast', {
        message: err.response.data.message ? err.response.data.message : err.message,
        color: 'red',
        show: true
      }, { root: true })
    }

    return data
  },

  // Update Device Info
  async updateDeviceInfo({ commit }, payload) {
    return await Device.updateDeviceInfo(payload).then(
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

  // Update Device Info for Admin
  async updateDeviceInfoForAdmin({ commit }, payload) {
    return await Device.updateDeviceInfoForAdmin(payload).then(
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

  // Get Device Info
  async getDeviceImage({ commit }, payload) {
    let data = null

    return await Device.getDeviceImage(payload).then(
      async (response) => {
        if (response.status === 200) {
          data = response.data.data
        }

        return Promise.resolve(data)
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

        return Promise.reject(data)
      }
    )
  },

  // Create Device Link
  async createDeviceLink({ commit }, payload) {
    let data = null

    try {
      const resp = await Device.createDeviceLink(payload)

      if (resp.status === 200) {
        data = resp.data.link
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
  },

  // Add New Device
  async addNewDevice({ commit }, payload) {
    return await Device.addNewDevice(payload).then(
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

  // Get Project Images
  async getProjectImages({ commit }, payload) {
    return await Device.getProjectImages(payload).then(
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

  // Get Device Inventory
  async getDeviceInventory({ commit }, payload) {
    commit('setDeviceInventory', null)

    return await Device.getDeviceInventory(payload).then(
      async (response) => {
        if (response.status === 200) {
          commit('setDeviceInventory', response.data.data)
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

  // Setup Device
  async setupDevice({ commit }, payload) {
    return await Device.setupDevice(payload).then(
      async (response) => {
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
  
  // Capture Image
  async captureImage({ commit }, payload) {
    return await Device.captureImage(payload).then(
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

  async getWarehouses({ commit }, payload) {

    return await Device.getWarehouses(payload).then(
      async (response) => {
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

  async deactivateDevice({ commit }, payload) {
    return await Device.deactivateDevice(payload).then(
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

  async getDevicePasswordFile({ commit }, payload) {
    return await Device.getDevicePasswordFile(payload).then(
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

  async getPasswordFlashManifest({ commit }, payload) {
    return await Device.getPasswordFlashManifest(payload).then(
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
  }
}

const mutations = {
  setDevices(state, devices) {
    state.devices = JSON.parse(JSON.stringify(devices))
  },

  setDeviceInventory(state, payload) {
    state.inventory = JSON.parse(JSON.stringify(payload))
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}