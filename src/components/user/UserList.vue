<template>
  <v-card>
    <!-- users list -->
    <v-row dense class="pa-2 align-center">
      <v-col cols="6">
        <v-menu offset-y left>
          <template v-slot:activator="{ on }">
            <transition name="slide-fade" mode="out-in">
              <v-btn v-show="selectedUsers.length > 0" v-on="on">
                Actions
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </transition>
          </template>
          <v-list dense>
            <v-list-item @click="disableUsers">
              <v-list-item-title>Disable</v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="deleteUsers">
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
          placeholder="e.g. filter for id, email, name, etc"
          @keyup.enter="searchUser(searchQuery)"
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

    <template v-if="userList && userList.length">
      <v-data-table
        key="email"
        v-model="selectedUsers"
        item-key="email"
        show-select
        :headers="headers"
        :items="userList"
        :search="searchQuery"
        :loading="isLoading"
        class="flex-grow-1 cursor-pointer"
        @click:row="goToUser"
      >
        <template v-slot:[`item.id`]="{ item }">
          <div class="font-weight-bold">
            # <copy-label :text="item.id + ''" />
          </div>
        </template>

        <template v-slot:[`item.roles`]="{ item }">
          <v-chip v-for="role in item.roles" :key="role" small>
            {{ getRole(role) }}
          </v-chip>
        </template>

        <template v-slot:[`item.is_active`]="{ item }">
          <v-chip
            small
            :color="item.is_active ? 'red' : 'primary'"
            dark
          ><span class="white--text">{{ item.is_active ? 'Active' : 'Disabled' }}</span></v-chip>
        </template>

        <template v-slot:[`item.action`]="{ item }">
          <div class="actions">
            <v-btn icon :to="`/admin/users/${item.email}`">
              <v-icon>mdi-account-edit</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
      <!-- <v-pagination
        v-model="pagination.page"
        :length="pagination.pagingCounter"
        @input="paginateUsers"
      ></v-pagination> -->
    </template>
  </v-card>
</template>

<script>
import CopyLabel from '@/components/common/CopyLabel'
import { mapState } from 'vuex'
export default {
  name: 'UserList',
  components: { CopyLabel },
  props: {
    userList: { type: Array, default: null },
    isLoading: { type: Boolean, default: false },
    admin: { type: Boolean, default: false }
  },
  data() {
    return {
      users: [],
      pagination: null,
      searchQuery: '',
      selectedUsers: [],
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Email', value: 'email' },
        { text: 'Role', value: 'roles' },
        { text: 'Status', value: 'is_active' },
        { text: '', sortable: false, align: 'right', value: 'action' }
      ]
    }
  },
  computed: {
    ...mapState({
      roles: (store) => store.auth.roles
    })
  },
  watch: {
    userList(val) {
      if (val && val.length) {
        this.users = JSON.parse(JSON.stringify(val))
      }
    }
    // paginationObj(val) {
    //   if (val) {
    //     this.pagination = JSON.parse(JSON.stringify(val))
    //   } 
    // }
  },
  created() {
    if (this.userList && this.userList.length) {
      this.users = JSON.parse(JSON.stringify(this.userList))
    }
    // if (this.paginationObj) {
    //   this.pagination = JSON.parse(JSON.stringify(this.paginationObj))
    // }
  },
  methods: {
    searchUser() {},
    open() {},
    goToUser(item) {
      this.$router.push(`/admin/users/${item.email}`)
    },
    refresh() {
      this.$emit('refresh', true)
    },
    getRole(id) {
      const role = this.roles.find((r) => r.id === id)

      if (role) {
        return role.name
      }

      return ''
    },
    async disableUsers() {
      if (this.selectedUsers && this.selectedUsers.length) {
        const requests = []

        this.selectedUsers.forEach((user) => {
          if (user.is_active) {
            const payload = { ...user }

            delete payload.name

            payload.is_active = false

            requests.push(this.$store.dispatch('user/updateCustomerUser', payload))
          }
        })

        if (requests.length) {
          Promise.all(requests).then(() => {
            this.selectedUsers = []
            this.refresh()
          })
        } else {
          this.selectedUsers = []
        }
      }
    },
    async deleteUsers() {
      if (this.selectedUsers && this.selectedUsers.length) {
        const requests = []

        this.selectedUsers.forEach((user) => {
          const payload = { email: user.email }

          requests.push(this.$store.dispatch('user/deleteCustomerUser', payload))
        })

        if (requests.length) {
          Promise.all(requests).then(() => {
            this.selectedUsers = []
            this.refresh()
          }).catch((err) => {
            console.log('Error...', err)
          })
        } else {
          this.selectedUsers = []
        }
      }
    },
    paginateUsers(value) {
      this.$emit('paginate', value)
    }
  }
}
</script>
