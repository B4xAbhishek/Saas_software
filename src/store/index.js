import Vue from 'vue'
import Vuex from 'vuex'

// Global vuex
import AppModule from './app'
import AuthModule from './auth'
import UserModule from './user'
import ProjectModule from './project'
import DeviceModule from './device'

import CustomerModule from './customer'
import PlanModule from './plan'
import OrderModule from './order'
import DeviceSettingProfileModule from './settings/Device/SettingProfile'
import DeviceCameraProfileModule from './settings/Device/CameraProfile'
import DeviceScheduleProfileModule from './settings/Device/ScheduleProfile'
import FirmwareModule from './settings/Device/Firmware'
import SupportModule from './support'
import ScheduleModule from './schedule'
import RoleModule from './role'

// Example Apps
import BoardModule from '../apps/board/store'
import EmailModule from '../apps/email/store'
import TodoModule from '../apps/todo/store'

Vue.use(Vuex)

/**
 * Main Vuex Store
 */
const store = new Vuex.Store({
  state: {
    toast: {
      show: false,
      message: null,
      color: null
    }
  },
  getters: {
    getToast: (state) => state.toast
  },
  mutations: {
    setToast: (state, payload) => (state.toast = payload)
  },
  modules: {
    app: AppModule,
    auth: AuthModule,
    user: UserModule,
    project: ProjectModule,
    device: DeviceModule,
    customer: CustomerModule,
    plan: PlanModule,
    order: OrderModule,
    settingProfile: DeviceSettingProfileModule,
    imageProfile: DeviceCameraProfileModule,
    scheduleProfile: DeviceScheduleProfileModule,
    firmware: FirmwareModule,
    support: SupportModule,
    schedule: ScheduleModule,
    role: RoleModule,
    'board-app': BoardModule,
    'email-app': EmailModule,
    'todo-app': TodoModule
  }
})

export default store
