<template>
  <div class="flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Edit User {{ user.name && `- ${user.name}` }}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
      <v-spacer></v-spacer>
      <v-btn icon @click="loadUser">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </div>

    <AccountTab :loading="loading" :user="user" />

    <!-- <v-tabs v-model="tab" :show-arrows="false" background-color="transparent">
      <v-tab to="#tabs-account">Account</v-tab>
      <v-tab to="#tabs-information">Information</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item value="tabs-account">
        <account-tab ref="tabs-account" ></account-tab>
      </v-tab-item>

      <v-tab-item value="tabs-information">
        <information-tab ref="tabs-information" :user="user"></information-tab>
      </v-tab-item>
    </v-tabs-items> -->
  </div>
</template>

<script>
// import CopyLabel from '../../components/common/CopyLabel'
import AccountTab from './EditUser/AccountTab'
// import InformationTab from './EditUser/InformationTab'
import { mapState } from 'vuex'

export default {
  components: {
    AccountTab
    // InformationTab
  },
  data() {
    return {
      loading: false,
      tab: null,
      breadcrumbs: [
        {
          text: 'Users',
          to: '/admin/users',
          exact: true
        },
        {
          text: 'Edit User'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      user: (store) => store.auth.user
    })
  },
  created() {
    this.loadUser()
  },
  methods: {
    async loadUser() {
      this.loading = true
      await this.$store.dispatch('auth/getUser')
      this.loading = false
    }
  }
}
</script>
