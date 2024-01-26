<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Support</div>
        <bread-crumbs :items="breadcrumbs"></bread-crumbs>
      </div>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="roleDialog = !roleDialog">
        Create Role
      </v-btn>
    </div>
    
    <v-card>
      <!-- users list -->
      <v-row dense class="pa-2 align-center">
        <v-col cols="6">
          <v-menu offset-y left>
            <template v-slot:activator="{ on }">
              <transition name="slide-fade" mode="out-in">
                <v-btn v-show="selectedCustomers.length > 0" v-on="on">
                  Actions
                  <v-icon right>mdi-menu-down</v-icon>
                </v-btn>
              </transition>
            </template>
            <v-list dense>
              <v-list-item>
                <v-list-item-title>Verify</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Disable</v-list-item-title>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item>
                <v-list-item-title>Delete</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
        <v-col cols="6" class="d-flex text-right align-center">
          <v-text-field
            v-model="searchQuery"
            append-icon="mdi-magnify"
            class="flex-grow-1 mr-md-2"
            solo
            hide-details
            dense
            clearable
            placeholder="e.g. filter for problem, status, priority"
          ></v-text-field>
          <v-btn
            :loading="isLoading"
            icon
            small
            class="ml-2"
            @click="refresh"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    
      <template>
        <v-data-table
          :headers="headers"
          :items="roles"
          item-key="id"
          :search="searchQuery"
          :loading="isLoading"
          class="flex-grow-1 cursor-pointer"
          hide-default-footer
          @click:row="goToRole"
        >
          <template v-slot:[`item.permissions`]="{ item }">
            <v-chip v-for="(role, index) in item.accessList" :key="index" small class="px-0 mr-1 text-capitalize">{{ displayRoles(role) }}</v-chip>
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <div class="actions">
              <v-btn icon @click.stop="editRole(item)">
                <v-icon color="primary">mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click.stop="deleteRole(item)">
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </template>
    </v-card>
    
    <CreateRole
      v-if="roleDialog"
      :customer="true"
      :create-modal="roleDialog"
      @close="roleDialog = false"
      @refresh="refresh"
    />
  
    <DeleteRole
      v-if="deleteRoleDialog"
      :customer="true"
      :role="roleItem"
      :delete-modal="deleteRoleDialog"
      @close="deleteRoleDialog = false"
      @refresh="refresh"
    />
    
    <EditRole
      v-if="editRoleDialog"
      :customer="true"
      :item="roleItem"
      :edit-modal="editRoleDialog"
      @close="editRoleDialog = false"
      @refresh="refresh"
    />
  </div>
</template>
      
<script>
import CreateRole from '@/components/roles/CreateRole'
import EditRole from '@/components/roles/EditRole'
import DeleteRole from '@/components/roles/DeleteRole'

export default {
  components: { CreateRole, EditRole, DeleteRole },
  data() {
    return {
      isLoading: false,
      roles: [],
      roleDialog: false,
      editRoleDialog: false,
      deleteRoleDialog: false,
      searchQuery: '',
      selectedCustomers: [],
      roleItem: null,
      filterBy: '',
      headers: [
        { text: 'Role', value: 'name' },
        { text: 'Permissions', value: 'permissions' },
        { text: 'Action', value: 'action' }
      ],
      breadcrumbs: [{
        text: 'Roles',
        disabled: true,
        to: '/roles'
      }, {
        text: 'Role List',
        disabled: true
      }]
    }
  },
  created() {
    this.loadRoles()
  },
  methods: {
    searchUser() { },
    open() { },
    displayRoles(role) {
      if (role.access.read && role.access.write) {
        return role.name + '(r, w)'
      } else if (role.access.read && !role.access.write) {
        return role.name + '(r)'
      } else if (!role.access.read && role.access.write) {
        return role.name + '(w)'
      }
      
      return ''
    },
    goToRole(item) {
      this.roleItem = { ...item }
      this.editRoleDialog = true
    },
    deleteRole(item) {
      this.roleItem = { ...item }
      this.deleteRoleDialog = true
    },
    editRole(item) {
      this.roleItem = { ...item }
      this.editRoleDialog = true
    },
    refresh() {
      this.roleDialog = false
      this.editRoleDialog = false
      this.loadRoles()
    },
    loadRoles() {
      this.isLoading = true
      this.$store.dispatch('role/getRoles').then((res) => {
        this.setRoles(res)
      }).finally(() => {
        this.isLoading = false
      })
      
    },
    setRoles(role) {
      this.roles = []
      
      role.forEach((item) => {
        const accessList = []
        const modules = item.access_list.map((access) => access.split('__')[0])
        const uniqueModules = [...new Set(modules)].map((access) => {
          return {
            name: access.split('__')[0],
            access: {
              read: false,
              write: false
            }
          }
        })

        uniqueModules.forEach((uM) => {
          const read = uM.name + '__read'
          const write = uM.name + '__write'

          if (item.access_list.includes(read)) {
            uM.access.read = true
          } else {
            uM.access.read = false
          }

          if (item.access_list.includes(write)) {
            uM.access.write = true
          } else {
            uM.access.write = false
          }

          accessList.push(uM)
        })

        this.roles.push({
          id: item.id,
          name: item.name,
          accessList: [...accessList]
        })
      })
    }
  }
}
</script>
      
    <style lang="scss" scoped>
    .slide-fade-enter-active {
        transition: all 0.3s ease;
    }
    
    .slide-fade-leave-active {
        transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
    }
    
    .slide-fade-enter,
    .slide-fade-leave-to {
        transform: translateX(10px);
        opacity: 0;
    }
    </style>
