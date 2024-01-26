import Repository from './Repository'

export default {

  /**************
   * Positions
  **************/

  getAvailablePositions() {
    return Repository.get('available_position')
  },

  getAvailablePosition(id) {
    return Repository.get(`available_position/${id}`)
  },
  
  createPosition(payload) {
    return Repository.post('available_position', payload)
  },

  // Send Test SMS
  sendSMS(payload) {
    const data = {
      phone_number: payload.mobile,
      stage: payload.trade
    }
    
    return Repository.post(`/project/${payload.project}/location/${payload.location}/sms_test`, data)
  }
}
