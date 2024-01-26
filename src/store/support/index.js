import { RepositoryFactory } from '@/Repository/RepositoryFactory'
const Support = RepositoryFactory.get('support_repository')

const state = {
  tickets: null
}

const mutations = {
  setTickets: (state, payload) => state.tickets = payload
}

const actions = {
  // Get Tickets
  getTickets({ commit }, payload) {
    commit('setTickets', [])

    return Support.getTickets(payload).then(
      async (response) => {
        if (response.status === 200) {
          const data = { ...response.data.data }
          const tickets = [...data.support_tickets]
          const counts = { ...data.counts }

          delete data.tickets
          delete data.counts
          
          const pagination = { ...data.pagination }

          commit('setTickets', { tickets, pagination, counts })

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

  // Create Ticket
  createTicket({ commit }, payload) {
    return Support.createTicket(payload).then(
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

  // Update Ticket
  updateTicket({ commit }, payload) {
    return Support.updateTicket(payload).then(
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

  // Get Ticket
  getTicket({ commit }, id) {

    return Support.getTicket(id).then(
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

  async getAdminUsers({ commit }) {
    return await Support.getAdminUsers().then(
      (response) => {
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

  // Create Ticket Comment
  createTicketComment({ commit }, payload) {
    return Support.createTicketComment(payload).then(
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

  // Get Problem Types

  async getProblemTypes({ commit }) {
    return await Support.getProblemTypes().then(
      (response) => {
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

export default {
  namespaced: true,
  state,
  actions,
  mutations
}