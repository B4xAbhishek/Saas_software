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
        v-model="selectedUsers"
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

        <template v-slot:[`item.disabled`]="{ item }">
          <v-chip
            small
            :color="item.disabled ? 'red' : 'primary'"
            dark
          ><span class="white--text">{{ item.disabled ? 'Disabled' : 'Active' }}</span></v-chip>
        </template>

        <template v-slot:[`item.action`]="{ item }">
          <div class="actions">
            <v-btn icon :to="`/owner/projects/${item.id}`">
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
        { text: 'ID', value: 'id' },
        { text: 'Name', value: 'name' },
        { text: 'Email', value: 'email' },
        { text: 'Role', value: 'access' },
        { text: 'Status', value: 'disabled' },
        { text: '', sortable: false, align: 'right', value: 'action' }
      ]
    }
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
      this.$router.push(`/owner/projects/${item.id}`)
    },
    refresh() {
      this.$emit('refresh', true)
    },
    paginateUsers(value) {
      this.$emit('paginate', value)
    }
  }
}
</script>
