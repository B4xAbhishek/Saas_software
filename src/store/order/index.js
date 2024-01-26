import { RepositoryFactory } from '@/Repository/RepositoryFactory'
const Order = RepositoryFactory.get('order_repository')

import Vue from 'vue'

const state = {
  orders: null,
  order: null
}

const getters = {
  orders: (state) => state.orders,
  order: (state) => state.order
}

const mutations = {
  setOrders: (state, payload) => {
    state.orders = payload
  },
  setOrder: (state, payload) => (state.order = payload)
}

const actions = {
  // Get All Orders
  getOrders({ commit }, payload) {
    commit('setOrders', [])

    return Order.getOrders(payload).then(
      async (response) => {
        if (response.status === 200) {
          const data = { ...response.data.data }
          const orders = [...data.orders]

          delete data.orders
          const pagination = { ...data }

          commit('setOrders', { orders, pagination })

          return Promise.resolve(response)
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

  // Get Single Order
  getOrder({ commit }, id) {
    commit('setOrder', null)

    return Order.getOrder(id).then(
      async (response) => {
        if (response.status === 200) {
          commit('setOrder', response.data.data)

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

  // Assign Device to Order
  assignDevice({ commit }, payload) {
    return Order.assignDevice(payload).then(
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

  // Remove Assigned Device from Order
  removeAssignedDevice({ commit }, payload) {
    return Order.removeAssignedDevice(payload).then(
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

  // Finalize Assigned Device for Order
  finalizeAssignment({ commit }, payload) {
    return Order.finalizeAssignment(payload).then(
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

  // Return Device
  returnDevice({ commit }, payload) {
    return Order.returnDevice(payload).then(
      async (response) => {
        if (response.status === 200 || response.status === 201) {
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

  // Update Order Device Expiry
  updateOrderDeviceExpiry({ commit }, payload) {
    return Order.updateOrderDeviceExpiry(payload).then(
      async (response) => {
        if (response.status === 200 || response.status === 201) {
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

  // Update Order Expiry
  updateOrderExpiry({ commit }, payload) {
    return Order.updateOrderExpiry(payload).then(
      async (response) => {
        if (response.status === 200 || response.status === 201) {
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

  // Replace Order Camera
  replaceCamera({ commit }, payload) {
    return Order.replaceCamera(payload).then(
      async (response) => {
        if (response.status === 200 || response.status === 201) {
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

  // Suspend Order Camera
  suspendCamera({ commit }, payload) {
    return Order.suspendCamera(payload).then(
      async (response) => {
        if (response.status === 200 || response.status === 201) {
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

  // Suspend Order
  suspendOrder({ commit }, payload) {
    return Order.suspendOrder(payload).then(
      async (response) => {
        if (response.status === 200 || response.status === 201) {
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

  // Setup Order
  setupOrder({ commit }, payload) {
    return Order.setupOrder(payload).then(
      async (response) => {
        if (response.status === 200 || response.status === 201) {
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

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
