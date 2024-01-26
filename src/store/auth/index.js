import Repository from '@/Repository/Repository'
import { RepositoryFactory } from '@/Repository/RepositoryFactory'
const User = RepositoryFactory.get('user_repository')

import mixins from '@/mixins/global'
import { ROLES } from '../../utils/constants'
import router from '../../router'

const state = {
  user: null,
  roles: [],
  redirectPath: '/',
  idToken: null
}

const getters = {
  getUser(state) {
    return state.user
  },
  GET_TOKEN(state) {
    return state.idToken
  }
}

const actions = {
  async createUser({ commit, dispatch }, { email, password, accountDetail }) {
    const data = {
      email: email,
      password: password,
      phone: accountDetail.phone,
      address: {
        add_1: accountDetail.address_1,
        add_2: accountDetail.address_2,
        city: accountDetail.city,
        state: accountDetail.state,
        zip: accountDetail.zip
      }
    }

    axios
      .post(`${process.env.BASE_URL}/user`, data)
      .then((res) => {
        this.$router.push('/auth/login')
        //now login the user
        // commit('SET_USER', res.data);
      })
      .catch((error) => {
        if (error.response) {
          this.$store.dispatch('snackbar/setSnackBar', {
            message: error.response.message,
            show: true,
            color: 'red'
          })
        }
      })
  },

  // Login User
  async loginUser({ commit }, payload) {
    return await User.loginUser(payload).then(
      async (response) => {
        if (response.status === 200 &&
          response.data.success) {

          commit('setToken', response.data.data)

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

  // Forget User
  async forgetPassword({ commit }, payload) {
    return await User.forgetPassword(payload).then(
      async (response) => {
        if (response.status === 200 &&
          response.data.success) {

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

  // Recover Password
  async recoverPassword({ commit }, payload) {
    return await User.recoverPassword(payload).then(
      async (response) => {
        if (response.status === 200 &&
          response.data.success) {

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

  // Login User
  async refreshToken({ commit, dispatch }, payload) {
    try {
      const resp = await User.refreshToken(payload)

      if (resp && resp.status === 200) {
        if (resp && resp.data) {
          commit('setToken', resp.data.data)
          const user = await dispatch('getUser')

          // if (!payload || !payload.id) {
          //   if (user && user.type === 'owner') {
          //     // router.push('/projects').catch(() => {})
          //   }
          //   if (user && user.type === 'sub-user') {
          //     // router.push('/owners').catch(() => {})
          //   }
          //   if (user && user.type === 'teo-admin') {
          //     // router.push('/dashboard/analytics').catch(() => {})
          //   }
          // }
        }

        return Promise.resolve(resp)
      }
    } catch (err) {
      commit(
        'setToast',
        {
          message: err.response && err.response.data.message
            ? err.response.data.message
            : 'Session Expired. Please Login again.',
          color: 'red',
          show: true
        },
        { root: true }
      )

      if (err.response && err.response.status === 400 && !err.response.data.success) {
        mixins.methods.logoutUser()
      }
    }

    return Promise.reject(err)
  },

  // Get User
  async getUser({ commit, dispatch }) {
    const user = mixins.methods.getLoggedUser()
    let profile = null

    if (user && user.type) {
      if (user.type === ROLES.CUSTOMER) {
        profile = User.getCustomerProfile()
      }
  
      if (user.type === ROLES.CUSTOMER_USER) {
        profile = User.getCustomerUserProfile()
      }
  
      if (user.type === ROLES.ADMIN) {
        profile = User.getAdminProfile()
      }
  
      return await profile.then(
        async (response) => {
          if (response.status === 200) {
            commit('setUser', response.data.data)
            if (user.type === ROLES.CUSTOMER) {
              dispatch('getCustomerUserRoles')
            }
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
    }

    return null
  },

  // Get User
  async getCustomerUserRoles({ commit }) {
    return await User.getCustomerUserRoles().then(
      async (response) => {
        if (response.status === 200) {
          commit('setUserRoles', response.data.data)
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

  // Logout User
  async logoutUser({ commit }) {
    return await User.logoutUser().then(
      async (response) => {
        if (response.status === 200) {
          mixins.methods.logoutUser()
          
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

        return Promise.reject(message)
      }
    )
  }
}

const mutations = {
  setToken: (state, payload) => {
    const tokens = {
      access_token: payload.access_token,
      type: payload.user_type
    }

    Repository.defaults.headers.Authorization = `Bearer ${payload.access_token}`
    localStorage.setItem('teoUserToken', JSON.stringify(tokens))
  },
  setUser(state, user) {
    state.user = JSON.parse(JSON.stringify(user))
  },
  setUserRoles(state, roles) {
    state.roles = [...roles]
  },
  UPDATE_USER(state, roleInfo) {
    state.user['roleInfo'] = roleInfo
  },
  SET_TOKEN(state, token) {
    state.idToken = token
  },
  SET_REDIRECT_PATH(state, path) {
    state.redirectPath = path
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
