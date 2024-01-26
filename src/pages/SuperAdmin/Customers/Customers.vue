<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Customers</div>
        <bread-crumbs :items="breadcrumbs"></bread-crumbs>
      </div>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="inviteModal = true">
        New Customer
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
            placeholder="e.g. filter for email, name, etc"
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

      <template v-if="customerList && customerList.length">
        <v-data-table
          v-model="selectedCustomers"
          show-select
          :headers="headers"
          :items="customerList"
          item-key="email"
          :search="searchQuery"
          :loading="isLoading"
          class="flex-grow-1 cursor-pointer"
          @click:row="goToCustomer"
        >

          <template v-slot:[`item.is_suspended`]="{ item }">
            <v-chip
              small
              :color="item.is_suspended ? 'red' : 'primary'"
              dark
            ><span class="white--text">{{ item.is_suspended ? 'Disabled' : 'Active' }}</span></v-chip>
          </template>

          <template v-slot:[`item.action`]="{ item }">
            <div class="actions">
              <v-btn icon :to="`/customers/${item.id}`">
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

    <InviteUserAccount
      v-if="inviteModal"
      :open="inviteModal"
      @close="inviteModal = false"
    />
  </div>
</template>

<script>
import InviteUserAccount from '@/components/account/InviteUserAccount'
import { mapState } from 'vuex'

export default {
  components: { InviteUserAccount },
  data() {
    return {
      isLoading: false,
      inviteModal: false,
      searchQuery: '',
      selectedCustomers: [],
      headers: [
        { text: 'Company', value: 'company_name' },
        { text: 'Name', value: 'name' },
        { text: 'Email', value: 'email' },
        { text: 'Status', value: 'is_suspended' },
        { text: '', sortable: false, align: 'right', value: 'action' }
      ],
      breadcrumbs: [{
        text: 'Customers',
        disabled: true,
        to: '/customers'
      }, {
        text: 'List',
        disabled: true
      }]
    }
  },
  computed: {
    ...mapState({
      customers: (state) => state.customer.accounts
    }),
    customerList() {
      return this.customers
    }
  },
  watch: {
    selectedCustomers(val) {

    }
  },
  created() {
    this.loadCustomers()
  },
  methods: {
    searchUser() {},
    open() {},
    goToCustomer(item) {
      this.$router.push(`/customers/${item.id}`)
    },
    refresh() {
      this.loadCustomers()
    },
    async loadCustomers() {
      this.isLoading = true
      await this.$store.dispatch('customer/getAccounts')
      this.isLoading = false
    }
    // paginateUsers(value) {
    //   this.loadCustomers({ page: value })
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
