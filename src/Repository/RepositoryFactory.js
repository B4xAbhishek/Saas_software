import User from './User'
import Project from './Project'
import Device from './Device'
import Customer from './Customer'
import Plan from './Plan'
import Order from './Order'
import Settings from './Settings'
import Support from './Support'
import Scheduler from './Scheduler'
import Role from './Role'

const repositories = {
  user_repository: User,
  project_repository: Project,
  device_repository: Device,
  customer_repository: Customer,
  plan_repository: Plan,
  order_repository: Order,
  settings_repository: Settings,
  support_repository: Support,
  scheduler_repository: Scheduler,
  role_repository: Role
}

export const RepositoryFactory = {
  get: (name) => repositories[name]
}