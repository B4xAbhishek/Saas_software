import Repository from './Repository'
import mixins from '@/mixins/global'

export default {
  /******************
    Setting Profiles
  ******************/

  // List Device Profiles
  getDeviceProfiles(payload) {
    const queryParams = {
      page: payload && payload.page ? payload.page : 1,
      size: payload && payload.size ? payload.size : 10
    }

    return Repository.get('admin/camera/settings_management/power_network_setting', queryParams)
  },

  // Get Device Profile
  getDeviceProfile(id) {
    return Repository.get(`admin/camera/settings_management/power_network_setting/${id}`)
  },

  // New Device Profile
  createDeviceProfile(payload) {
    return Repository.post('admin/camera/settings_management/power_network_setting', payload)
  },

  // Set Device Profile Active
  activateDeviceProfile(payload) {
    return Repository.post(`admin/camera/settings_management/power_network_setting/${payload}/active`)
  },

  // Delete Device Profile
  deleteDeviceProfile(payload) {
    return Repository.delete(`admin/camera/settings_management/power_network_setting/${payload}`)
  },

  // Update Device Profile
  updateDeviceProfile(payload) {
    const { id } = payload

    delete payload.id

    return Repository.put(`admin/camera/settings_management/power_network_setting/${id}`, payload)
  },

  /******************
    Camera Profiles
  ******************/

  // List camera Profiles
  getImageProfiles(payload) {
    const isCustomer = mixins.methods.isCustomer()
    const isAdmin = mixins.methods.isAdmin()

    const queryParams = {
      page: payload && payload.page ? payload.page : 1,
      size: payload && payload.size ? payload.size : 10
    }
    
    if (isAdmin) {
      return Repository.get('admin/camera/settings_management/image_setting', queryParams)
    }

    queryParams.size = 9999

    return Repository.get('customer/settings_management/image_setting', queryParams)
    
  },

  // New Image Profile
  createImageProfile(payload) {
    return Repository.post('admin/camera/settings_management/image_setting', payload)
  },

  // Update Image Profile
  updateImageProfile(payload) {
    const { id } = payload

    delete payload.id

    return Repository.put(`admin/camera/settings_management/image_setting/${id}`, payload)
  },

  // Delete Image Profile
  deleteImageProfile(payload) {
    return Repository.delete(`admin/camera/settings_management/image_setting/${payload}`)
  },

  /******************
    Schedule Profiles
  ******************/

  // List Schedule Profiles
  getScheduleProfiles(payload) {
    const queryParams = {
      page: payload && payload.page ? payload.page : 1,
      size: payload && payload.size ? payload.size : 10
    }

    return Repository.get('admin/camera/settings_management/schedule', queryParams)
  },

  // New Schedule Profile
  createScheduleProfile(payload) {
    return Repository.post('admin/camera/settings_management/schedule', payload)
  },

  // Set Schedule Profile Active
  activateScheduleProfile(payload) {
    return Repository.post(`admin/camera/settings_management/schedule/${payload}/active`)
  },

  // Delete Schedule Profile
  deleteScheduleProfile(payload) {
    return Repository.delete(`admin/device_settings/schedule/${payload}`)
  },

  // Update Schedule Profile
  updateScheduleProfile(payload) {
    const { id } = payload

    // delete payload.id

    return Repository.put(`admin/camera/settings_management/schedule/${id}`, payload)
  },

  // Get Schedules By Level and Target
  getSchedulesByLevelAndTarget(payload) {
    const { level, target } = payload

    const isCustomer = mixins.methods.isCustomer() || mixins.methods.isCustomerUser()
    
    if (isCustomer) {
      return Repository.get(`customer/settings_management/${level}/${target}/schedule`)
    }

    return null
  },

  // Set Schedules By Level and Target
  setSchedulesByLevelAndTarget(payload) {
    const { level, target } = payload

    const isCustomer = mixins.methods.isCustomer() || mixins.methods.isCustomerUser()
    
    if (isCustomer) {
      delete payload.level
      delete payload.target
      
      return Repository.post(`customer/settings_management/${level}/${target}/schedule`, payload)
    }

    return null
  },

  // Delete Schedules By Level and Target
  deleteSchedulesByLevelAndTarget(payload) {
    const { level, target } = payload

    const isCustomer = mixins.methods.isCustomer() || mixins.methods.isCustomerUser()
    
    if (isCustomer) {
      delete payload.level
      delete payload.target
      
      return Repository.delete(`customer/settings_management/${level}/${target}/schedule`)
    }

    return null
  },

  /******************
    Device Admin & OTA and Firmware
  ******************/
  // Create DeviceModel
  createDeviceModel(payload) {
    return Repository.post('admin/camera_models', payload)
  },

  // List Device Models
  getDeviceModels() {
    return Repository.get('admin/camera_models')
  },

  // Get Device Model
  getDeviceModel(payload) {
    return Repository.get(`admin/camera_models/${payload}`)
  },

  // List Model Versions
  getDeviceModelVersions(payload) {
    return Repository.get(`admin/camera_models/${payload.model}/firmware_versions`)
  },

  // Create Firmware
  createFirmware(payload) {
    const { id } = payload
    
    delete payload.id

    return Repository.post(`admin/camera_models/${id}/firmware_versions`, payload.data)
  },

  // Get Image profiles by level and target
  getImageProfilesByLevelAndTarget(payload) {
    return Repository.get(`/device/settings/image_profile/${payload.level}/${payload.target}`)
  }
}