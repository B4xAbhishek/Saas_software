<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Administration</div>
        <bread-crumbs :items="breadcrumbs"></bread-crumbs>
      </div>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="inviteModal = true">
        Invite Users
      </v-btn>
    </div>

    <UserList
      :user-list="userList"
      :is-loading="isLoading"
      :admin="true"
      @refresh="loadUsers"
    />

    <InviteUser
      v-if="inviteModal"
      :open="inviteModal"
      @close="inviteModal = false"
    />
  </div>
</template>

<script>
import UserList from '@/components/user/UserList'
import InviteUser from '@/components/user/InviteUser'
import { mapState } from 'vuex'

export default {
  components: { UserList, InviteUser },
  data() {
    return {
      isLoading: false,
      inviteModal: false,
      breadcrumbs: [{
        text: 'Administrator',
        disabled: true,
        to: '/admin/users'
      }, {
        text: 'Users',
        disabled: true,
        to: '/admin/users'
      }, {
        text: 'List',
        disabled: true
      }]
    }
  },
  computed: {
    ...mapState({
      users: (store) => store.user.subUsers
    }),
    userList() {
      return this.users
    }
  },
  watch: {
    selectedUsers(val) {

    }
  },
  created() {
    this.loadUsers()
  },
  methods: {
    searchUser() {},
    open() {},
    async loadUsers() {
      this.isLoading = true
      await this.$store.dispatch('user/getCustomerUsers')
      this.isLoading = false
    }
    // paginateUsers(value) {
    //   this.loadUsers({ page: value })
    // }
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
