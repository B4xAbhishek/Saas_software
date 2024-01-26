<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Administration</div>
        <bread-crumbs :items="breadcrumbs"></bread-crumbs>
      </div>
    </div>

    <template v-if="isLoading">
      <div class="text-center mt-4">
        <v-progress-circular
          :value="100"
          indeterminate
          color="primary"
        ></v-progress-circular>
        <h4>Loading User...</h4>
      </div>
    </template>
    <template v-if="!isLoading && !user">
      <div class="text-center mt-4">
        <h4>User not found against {{ this.$route.params.email }}</h4>
      </div>
    </template>

    <v-form v-if="user && !isLoading" lazy-validation @submit.prevent="save">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-card>
            <v-card-title>Edit User</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="user.name"
                label="Full Name"
                placeholder="Enter Full Name"
                disabled
              ></v-text-field>
              <v-text-field
                v-model="user.email"
                label="Email"
                type="email"
                placeholder="Enter Email"
                disabled
              ></v-text-field>
              <v-autocomplete
                v-model="user.roles"
                :items="roleList"
                item-text="name"
                item-value="id"
                label="Roles"
                multiple
                small-chips
                deletable-chips
                placeholder="Select Roles"
              ></v-autocomplete>
            </v-card-text>
          </v-card>
          <v-card class="mt-3">
            <v-card-title>Actions</v-card-title>
            <v-card-text>
              <div class="mb-3">
                <h4>{{ user.disabled ? "Enable" : "Disable" }} User</h4>
                <v-btn
                  depressed
                  :color="user.disabled ? 'green lighten-2' : 'grey'"
                  class="white--text mt-1"
                  :loading="editLoading"
                  :disabled="saveLoading || deleteLoading"
                  @click="updateSubUser"
                >
                  <v-icon class="mr-1">mdi-pencil</v-icon>
                  {{ user.disabled ? "Enable" : "Disable" }} User
                </v-btn>
              </div>

              <h4 class>Delete User</h4>
              <v-btn
                depressed
                color="red"
                class="white--text mt-1"
                :disabled="deleteLoading || editLoading"
                :loading="deleteLoading"
                @click="deleteCustomerUser"
              >
                <v-icon class="mr-1">mdi-delete</v-icon>
                Delete User
              </v-btn>
            </v-card-text>
          </v-card>

          <div class="mt-3">
            <v-btn
              color="primary"
              type="submit"
              :loading="saveLoading"
              :disabled="deleteLoading || editLoading"
            >Save</v-btn>
            <v-btn color="gray" :disabled="deleteLoading || editLoading" class="ml-2" to="/admin/users">Cancel</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      isLoading: false,
      editLoading: false,
      deleteLoading: false,
      saveLoading: false,
      user: null,
      breadcrumbs: [
        {
          text: 'Administrator',
          disabled: false,
          to: '/admin/users'
        },
        {
          text: 'Users',
          disabled: false,
          to: '/admin/users'
        },
        {
          text: 'Edit User',
          disabled: true
        }
      ]
    }
  },
  computed: {
    ...mapState({
      users: (store) => store.user.subUsers,
      roleList: (store) => store.auth.roles
    }),
    userList() {
      return this.users
    }
  },
  watch: {
    userList(val) {
      this.checkUser(val)
    }
  },
  created() {
    this.loadUsers()
  },
  methods: {
    checkUser(users) {
      if (users && users.length) {
        this.user = users.find((u) => u.email === this.$route.params.email)
        this.user.name = this.user.first_name + ' ' + this.user.last_name
      }
    },
    async loadUsers() {
      this.isLoading = true
      await this.$store.dispatch('user/getCustomerUsers')

      this.isLoading = false
    },
    async deleteCustomerUser() {
      this.deleteLoading = true
      await this.$store.dispatch('user/deleteCustomerUser', {
        id: this.user.id
      }).then(() => {
        this.deleteLoading = false
      }).catch(() => {
        this.deleteLoading = false
      })
    },
    async updateSubUser() {
      this.editLoading = true
      await this.$store.dispatch('user/updateCustomerUser', {
        ...this.user,
        is_active: !this.user.is_active
      }).then(() => {
        this.user.disabled = !this.user.disabled
        this.editLoading = false
      }).catch(() => {
        this.editLoading = false
      })
    },
    async save() {
      this.saveLoading = true
      const payload = {
        ...this.user,
        email: this.user.email,
        roles: this.user.roles
      }

      await this.$store
        .dispatch('user/updateCustomerUser', payload)
        .then(() => {
          this.saveLoading = false
          this.$router.push('/admin/users')
        })
        .catch(() => {
          this.saveLoading = false
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
