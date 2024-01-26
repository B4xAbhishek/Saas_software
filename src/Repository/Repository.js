import axios from 'axios'

const baseURL = process.env.VUE_APP_API_URL
let token = null
const user = JSON.parse(localStorage.getItem('teoUserToken'))

if (user) {
  token = user.access_token
}

export default axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
    // Authorization: `Bearer ${token ? token : ''}`
  }
})