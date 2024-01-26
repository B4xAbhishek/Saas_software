import Repository from './Repository'

export default {
  // Create Project
  createProject(payload) {
    return Repository.post('project', payload)
  },

  // Get Customer Projects
  getCustomerProjects(payload) {
    return Repository.get(`admin/customer_takeover/${payload.id}/project`)
  },

  getCustomerProjectLocations(payload) {
    return Repository.get(`admin/customer_takeover/${payload.customer}/project/${payload.project}/location`)
  },

  getCustomerLocationPositions(payload) {
    return Repository.get(`admin/customer_takeover/${payload.customer}/project/${payload.project}/location/${payload.location}/position`)
  },

  // List Projects
  getProjects(payload) {
    return Repository.get('project', { params: { 
      page: payload ? payload.page : 1,
      size: payload ? payload.size : 10
    } })
  },

  // Get Single Project
  getProject(payload) {
    return Repository.get(`project/${payload}`)
  },

  // Update Project
  updateProject(payload) {
    const name = payload.old_name || payload.name
    
    if (payload.old_name) {
      delete payload.old_name
    }

    return Repository.put(`project/${payload.id}`, payload)
  },

  getProjectLocations(payload) {
    const { id } = payload

    delete payload.id
    const queryParams = {
      page: (payload && payload.page) ? payload.page : 1,
      size: (payload && payload.perPage) ? payload.perPage : 10
    }

    return Repository.get('project/' + id + '/location' , { params: queryParams })
  },

  updateLocation(payload) {
    const { id, location_id } = payload

    delete payload.id
    delete payload.location_id

    return Repository.put('project/' + id + '/location/' + location_id, payload)
  },

  updatePosition(payload) {
    const { project_id, location_id, position_id } = payload

    delete payload.project_id
    delete payload.location_id
    delete payload.position_id
    
    const data = {
      pan_degrees: payload.pan_degrees,
      tags: payload.tags,
      current_stage: payload.current_stage
    }

    return Repository.put('project/' + project_id + '/location/' + location_id + '/position/' + position_id, data)
  },

  getLocationPositions(payload) {
    return Repository.get('project/' + payload.project_id + '/location/' + payload.location_id + '/position')
  },

  getDeviceImage(payload) {
    const { device_serial_no } = payload

    delete payload.device_serial_no
    const queryParams = {
      page: (payload && payload.page) ? payload.page : 1,
      size: (payload && payload.perPage) ? payload.perPage : 1
    }

    return Repository.get('device/' + device_serial_no + '/image' , { params: queryParams })
  },

  getDeviceInfo(payload) {
    return Repository.get('device/' + payload.device_serial_no)
  },

  createDeviceLink(payload) {
    return Repository.post('device/' + payload.device_serial_no + '/share_access', payload)
  },

  getAccessibleUsers(payload) {
    return Repository.post('device/' + payload.device_serial_no + '/share_access')
  },

  // CREATE Project Schedules
  createProjectSchedules(payload) {
    return Repository.post('device/settings/schedule/PROJECT/' + payload.name, payload)
  },

  // UPDATE Project Schedules
  updateProjectSchedules(payload) {
    const { id } = payload

    delete payload.id

    return Repository.put('device/settings/schedule/PROJECT/' + payload.name + '/' + id, payload)
  }
}