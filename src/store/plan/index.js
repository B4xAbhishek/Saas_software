import { RepositoryFactory } from '@/Repository/RepositoryFactory'
const Plan = RepositoryFactory.get('plan_repository')

import Vue from 'vue'

const state = {
  plans: {
    purchase_plans: [],
    pagination: null
  },
  plan: null
}

const getters = {
  plans: (state) => state.plans,
  plan: (state) => state.plan
}

const mutations = {
  setPlans: (state, payload) => {
    if (payload && payload.pagination && payload.purchase_plans) {
      state.plans.pagination = { ...payload.pagination }

      state.plans.purchase_plans = payload.purchase_plans.sort((a, b) => b.active - a.active)
    } else {
      state.plans.purchase_plans = []
      state.pagination = null
    }
  },
  setPlan: (state, payload) => (state.plan = payload),
  removePlan: (state, payload) => {
    state.plans.purchase_plans = state.plans.purchase_plans.filter((plan) => plan.id !== payload.id)

    payload.active = false
    state.plans.purchase_plans.push(payload)
  }
}

const actions = {
  // Get All Plans
  getPlans({ commit }, payload) {
    commit('setPlans', null)

    return Plan.getPlans(payload).then(
      async (response) => {
        if (response.status === 200) {
          commit('setPlans', response.data.data)

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

  // Get Single Plan
  getPlan({ commit }, id) {
    commit('setPlan', null)

    return Plan.getPlan(id).then(
      async (response) => {
        if (response.status === 200) {
          commit('setPlan', response.data.data)

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

  // Create New Plan
  createPlan({ commit }, payload) {
    return Plan.createPlan(payload).then(
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

  // Edit Plan
  editPlan({ commit }, payload) {
    return Plan.editPlan(payload).then(
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

  // Disable Plan
  disablePlan({ commit }, payload) {
    const { id } = payload

    return Plan.disablePlan(id).then(
      async (response) => {
        if (response.status === 200) {
          commit('removePlan', payload)
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
