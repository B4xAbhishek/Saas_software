import axiosInstance from './Repository'
import mixins from '@/mixins/global'

// const user = JSON.parse(localStorage.getItem('teoUserToken'))

const setup = (store) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = mixins.methods.getAccessToken()

      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token
      }

      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
  axiosInstance.interceptors.response.use(
    (res) => {
      return res
    },
    async (err) => {
      const originalConfig = err.config

      if (err.response.status === 400 && err.response.data.error_code === 'user/refresh_token/no-cookie') {
        mixins.methods.logoutUser()
      }

      if (originalConfig.url !== 'user/login/email' && err.response) {
        // Access Token was expired
        if (err.response.status === 403 && !originalConfig._retry) {
          originalConfig._retry = true
          try {
            await store.dispatch('auth/refreshToken')

            return axiosInstance(originalConfig)
          } catch (_error) {
            mixins.methods.logoutUser()

            return Promise.reject(_error)
          }
        }
      }
      // mixins.methods.logoutUser()

      return Promise.reject(err)
    }
  )
}

export default setup