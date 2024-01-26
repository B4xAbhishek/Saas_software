import Repository from './Repository'
import mixins from '@/mixins/global'

export default {
  // List Devices
  getDevices(payload) {
    return Repository.get('customer/camera', { params: { 
      page: payload ? payload.page : 1 
    } })
  },

  getProjectImages(payload) {
    const { project, location, position, start_date, end_date, size } = payload

    const params = {
      start_date,
      end_date,
      size: size || 99999,
      page: 1
    }

    return Repository.get(`project/${project}/location/${location}/position/${position}/image`, { params: { ...params } })
  },

  getDeviceImage(payload) {
    const { device_serial_no } = payload

    delete payload.device_serial_no
    const queryParams = {
      page: (payload && payload.page) ? payload.page : 1,
      size: (payload && payload.perPage) ? payload.perPage : 10
    }

    return Repository.get('device/' + device_serial_no + '/image' , { params: queryParams })
  },

  getDeviceInfo(payload) {
    const isAdmin = mixins.methods.isAdmin()

    if (isAdmin) {
      return Repository.get('admin/camera_inventory/' + payload.id)
    }

    return Repository.get('customer/camera/' + payload.id)
  },

  updateDeviceInfo(payload) {
    const { id } = payload

    delete payload.id

    const isAdmin = mixins.methods.isAdmin()

    if (isAdmin) {
      return Repository.put('admin/camera/' + id, payload)
    }

    return Repository.put('customer/camera/' + id, payload)
  },

  updateDeviceInfoForAdmin(payload) {
    const { customer_id, camera_id } = payload

    delete payload.customer_id
    delete payload.camera_id

    return Repository.post('admin/customer_takeover/' + customer_id + '/camera/' + camera_id, payload)
  },

  createDeviceLink(payload) {
    return Repository.post('device/' + payload.device_serial_no + '/share_access', payload)
  },

  addNewDevice(payload) {
    return Repository.post('admin/camera_inventory', payload)
  },

  getDeviceInventory(payload) {
    const queryParams = {
      page: (payload && payload.page) ? payload.page : 1,
      size: (payload && payload.perPage) ? payload.perPage : 10,
      status: (payload && payload.status) && payload.status,
      search: (payload && payload.search) && payload.search
    }

    return Repository.get('admin/camera_inventory', { params: queryParams })
  },

  setupDevice(payload) {
    return Repository.post(`subcription/${payload.id}/setup`, { device: payload.device })
  },

  captureImage(payload) {
    return Repository.post(`device/${payload}/settings/action/send`)
  },

  getWarehouses() {
    return Repository.get('admin/warehouse')
  },

  deactivateDevice(payload) {
    return Repository.post(`admin/device/${payload.sn}/networking/${payload.status}`)
  },

  getDevicePasswordFile(payload) {
    return Repository({
      url: `admin/camera_inventory/${payload}/password_nvs_file`,
      method: 'GET',
      responseType: 'blob'
    })
    
    // return Repository.get(`admin/device/${payload}/password_file`)
  },

  getPasswordFlashManifest(payload) {
    return Repository.get(`admin/camera_inventory/${payload.id}/password_nvs_file/manifest/${payload.blob_url}`)
  },

  getImageSettings() {
    const isCustomer = mixins.methods.isCustomer() || mixins.methods.isCustomerUser()

    if (isCustomer) {
      return Repository.get('customer/camera/settings_management/image_setting')
    }
    
    return null
  }
}