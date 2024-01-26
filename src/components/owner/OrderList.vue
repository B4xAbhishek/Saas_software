<template>
  <div>
    <v-dialog v-model="planDialog" max-width="500" persistent :fullscreen="$vuetify.breakpoint.smAndDown">
      <v-card>
        <v-toolbar v-if="$vuetify.breakpoint.smAndDown">
          <v-icon color="primary" @click="close">mdi-chevron-left</v-icon>
          <v-toolbar-title class="primary--text pl-2">Select Plan</v-toolbar-title>
        </v-toolbar>
        <v-card-text>

          <template v-if="$vuetify.breakpoint.mdAndUp">
            <div class="pt-2 pb-2 d-flex justify-space-between align-center">
              <h2>Select Plan</h2>
              <v-icon @click="close">mdi-close</v-icon>
            </div>
            <v-divider></v-divider>
          </template>

          <template v-if="loading">
            <div class="text-center mt-4">
              <v-progress-circular
                :value="100"
                indeterminate
                color="primary"
              ></v-progress-circular>
              <h4>Loading Orders...</h4>
            </div>
          </template>

          <template v-if="!loading && !orderList.length">
            <div class="text-center">
              No order found...
            </div>
          </template>

          <template v-if="!loading && orderList.length">
            <h3 class="black--text mt-2">ABC Constructions</h3>
            <h4 class="black--text">Plans to Camera SN: {{ deviceInfo.SN }}</h4>

            <v-list>
              <template>
                <v-list-item v-for="(order, index) in orderList" :key="index+'plan'" :disabled="order.id === deviceInfo.order.id" @click="onSelect(order)">
                  <v-list-item-avatar color="primary" size="48">
                    <span class="white--text text-h5 text-capitalize">P</span>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>Plan {{ order.zoho_order_number }}</v-list-item-title>
                    <v-list-item-subtitle>{{ order.plan.subscription_duration || 0 }} day plan</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-divider :inset="true"></v-divider>
              </template>
            </v-list>
          </template>
        </v-card-text>
      </v-card>
    </v-dialog>

    <ConfirmPlan
      v-if="planInfo && confirmPlan && deviceInfo"
      :confirm-plan="confirmPlan"
      :plan="planInfo"
      :device="deviceInfo"
      @close="confirmPlan = false"
      @planSelect="onPlanSelect"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ConfirmPlan from './ConfirmPlan.vue'
export default {
  components: {
    ConfirmPlan
  },
  props: {
    planDialog: {
      type: Boolean,
      default: false
    },
    deviceInfo: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      confirmPlan: false,
      planInfo: null
    }
  },
  computed: {
    ...mapState({
      orders: (store) => store.order.orders
    }),
    orderList() {
      const userOrders = []
      const list = this.orders.orders

      console.log(list)
      
      if (list && list.length > 0) {
        list.forEach((order) => {
          const isDeviceNull = order.camera_assigned.filter((device) => !device.camera)

          if (order.to_be_assigned_by_customer > 0 && order.main_status.toLowerCase() === 'in_service' && isDeviceNull.length) {
            userOrders.push(order)
          }
        })
      }

      return userOrders
    },
    pagination() {
      return this.orders && this.orders.pagination
    }
  },
  created() {
    this.getOrders()
  },
  methods: {
    getOrders() {
      this.loading = true
      this.$store.dispatch('order/getOrders').finally(() => {
        this.loading = false
      })
    },
    close() {
      this.$emit('close')
    },
    onSelect(order) {
      this.planInfo = JSON.parse(JSON.stringify(order))
      this.confirmPlan = true
    },
    onPlanSelect() {
      this.confirmPlan = false
      this.close()
    }
  }
}
</script>