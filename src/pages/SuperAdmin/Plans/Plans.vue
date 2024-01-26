<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Plans</div>
        <bread-crumbs :items="breadcrumbs"></bread-crumbs>
      </div>
      <v-spacer></v-spacer>
      <v-btn color="primary" to="/plans/create"> Add Plan </v-btn>
    </div>

    <v-card>
      <!-- plans list -->
      <v-row dense class="pa-2 align-center">
        <v-col cols="6" offset="6" class="d-flex text-right align-center">
          <v-text-field
            v-model="searchQuery"
            append-icon="mdi-magnify"
            class="flex-grow-1 mr-md-2"
            solo
            hide-details
            dense
            clearable
            placeholder="e.g. filter for plan, bill, cycles etc"
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

      <v-data-table
        :headers="headers"
        :items="plans"
        item-key="_id"
        :search="searchQuery"
        :loading="isLoading"
        hide-default-footer
        class="flex-grow-1 cursor-pointer"
        @click:row="gotToPlan"
      >
        <template v-slot:[`item.price`]="{ item }">
          ${{ item.price || 0 }}
        </template>
        <template v-slot:[`item.customer`]="{ item }">
          {{ item.customer ? item.customer.first_name + ' ' + item.customer.last_name : 'N/A' }}
        </template>
        <template v-slot:[`item.is_active`]="{ item }">
          {{ item.is_active ? 'Active' : 'Inactive' }}
        </template>
      </v-data-table>

      <v-pagination
        v-if="plans && plans.length"
        v-model="pagination.page"
        :length="pagination.pagingCounter"
        @input="paginatePlans"
      ></v-pagination>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      isLoading: false,
      searchQuery: '',
      selectedPlans: [],
      headers: [
        { text: 'Plans', value: 'name', align: 'left' },  
        { text: 'Customer', value: 'customer', align: 'left' },
        { text: 'Payment Term', value: 'payment_term', align: 'left' },
        { text: 'Price', value: 'price', align: 'left' },
        { text: 'Status', value: 'is_active', align: 'left' }
      ],
      breadcrumbs: [
        {
          text: 'Plans',
          disabled: true,
          to: '/plans'
        },
        {
          text: 'List',
          disabled: true
        }
      ]
    }
  },
  computed: {
    ...mapState({
      plans: (store) => store.plan.plans.purchase_plans,
      paginationObj: (store) => store.plan.plans.pagination
    }),
    pagination() {
      if (this.plans && this.paginationObj) {
        return this.paginationObj
      }

      return {
        page: 1,
        limit: 10
      }
    }
    //   planList() {
    //     return this.accounts
    //   }
  },
  created() {
    this.loadPlans()
  },
  methods: {
    formatPrice(value) {
      return '$' + value
    },
    searchUser() {},
    open() {},
    gotToPlan(item) {
      if (item.is_active) {
        this.$router.push(`/plans/edit/${item.id}`)
      }
    },
    refresh() {
      this.loadPlans()
    },
    async loadPlans(payload = null) {
      this.isLoading = true
      await this.$store.dispatch('plan/getPlans', payload)
      this.isLoading = false
    },
    paginatePlans(value) {
      this.loadPlans({ page: value })
    },
    async disablePlan(plan) {
      await this.$store.dispatch('plan/disablePlan', plan)
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
