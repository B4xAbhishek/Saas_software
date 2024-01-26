<template>
  <div>
    <v-card>
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
            placeholder="e.g. filter for customer, sale order, plan etc"
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
        v-model="selectedPlans"
        :headers="headers"
        :items="orderList"
        item-key="id"
        :search="searchQuery"
        :loading="isLoading"
        class="flex-grow-1 cursor-pointer"
        :page.sync="pagination.page"
        :items-per-page="pagination.limit"
        hide-default-footer
        @click:row="goToOrder"
        @page-count="pagination.pagingCounter = $event"
      >
        <template v-slot:[`item.plan_payment_term`]="{ item }">
          <v-icon v-if="item.plan_payment_term === 'prepay'" color="success">mdi-check</v-icon>
          <v-icon v-else color="red">mdi-close</v-icon>
        </template>
        <template v-slot:[`item.status`]="{ item }">
          <span class="text-capitalize">{{ getServiceStatus(item) }}</span>
        </template>
        <template v-slot:[`item.payment_status`]="{ item }">
          <span class="text-capitalize">{{ getPaidStatus(item) }}</span>
        </template>
        <!-- <template v-slot:[`item.shipment_status`]="{ item }">
          <span class="text-capitalize">{{ item.zoho_status_list.shipped_status }}</span>
        </template> -->
        <!-- <template v-slot:[`item.devices`]="{ item }">
          {{ item.devices_assigned ? item.devices_assigned.length : 0 }}
        </template> -->
        <template v-slot:[`item.action`]="{ item }">
          <div class="actions">
            <v-btn icon color="primary" small @click="goToOrder(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
  
      <v-pagination
        v-if="orderList && orderList.length"
        v-model="pagination.pagination.page"
        :length="pagination.pagination.pagingCounter"
        @input="paginateOrders"
      ></v-pagination>
    </v-card>
  
    <CustomerOrder v-if="customerDialog && itemInfo" :order="itemInfo" :dialog="customerDialog" @close="customerDialog = false" />
  </div>
</template>
    
<script>
import { mapState } from 'vuex'
import CustomerOrder from './CustomerOrder'
    
export default {
  components: { CustomerOrder },
  data() {
    return {
      isLoading: false,
      customerDialog: false,
      searchQuery: '',
      selectedPlans: [],
      itemInfo: null
    }
  },
  computed: {
    ...mapState({
      orders: (store) => store.order.orders
    }),
    orderList() {
      return this.orders ? this.orders.orders : []
    },
    pagination() {

      if (this.orders && this.orders.pagination) {
        return this.orders && this.orders.pagination
      }
      
      return {
        page: 1,
        limit: 10
      }
    },
    headers() {
      const items = [
        { text: 'Customer', value: 'customer.company_name', align: 'left' },  
        { text: 'Order', value: 'zoho_order_id', align: 'left' },
        { text: 'Plan', value: 'plan_subscription_duration', align: 'left' },
        { text: 'Service Status', value: 'status', align: 'left' },
        { text: 'Shipment Status', value: 'zoho_order_shipped_status', align: 'left' },
        { text: 'Payment', value: 'payment_status', align: 'left' },
        { text: 'Pre-pay', value: 'plan_payment_term', align: 'left' },
        { text: 'Cameras', value: 'camera_quantity', align: 'left' },
        { text: 'Action', sortable: false, align: 'left', value: 'action' }
      ]

      if (this.isAdmin()) {
        return items
      }

      items.shift()

      return items
    }
  },
  created() {
    this.loadOrders()
  },
  methods: {
    searchUser() {},
    open() {},
    getServiceStatus(item) {
      const status = item.status.replaceAll('_', ' ')
  
      return status
    },
    getPaidStatus(item) {
      if (item.zoho_order_status === 'paid') {
        return 'paid'
      }
  
      if (item.zoho_order_status === 'invoiced' && zoho_order_status === 'unpaid') {
        return 'sent'
      }
  
      return 'not sent'
    },
    goToOrder(item) {
      this.itemInfo = { ...item }
      this.customerDialog = true
    },
    refresh() {
      this.loadOrders()
    },
    async loadOrders(payload = null) {
      this.isLoading = true

      await this.$store.dispatch('order/getOrders', payload)
      
      this.isLoading = false
    },
    paginateOrders(value) {
      this.loadOrders({ page: value })
    }
  }
}
</script>