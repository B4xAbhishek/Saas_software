<template>
  <v-dialog v-model="confirmPlan" hide-overlay max-width="400" persistent>
    <v-card color="grey lighten-2">
      <v-card-text>
        <div class="pt-4 pb-4">
          <h2 class="black--text mb-0">Apply plan to this device?</h2>
          <p class="px-0 mt-1">Apply {{ plan.zoho_order_number }} plan ({{ plan.plan.subscription_duration || 0 }} days) to camera with SN: {{ sn && sn }}</p>
        </div>

        <div class="text-right">
          <v-btn
            small
            text
            color="primary"
            :loading="loading"
            @click="onPlanSelect"
          >Accept</v-btn>
          <v-btn
            small
            text
            color="primary"
            :disabled="loading"
            @click="close"
          >Cancel</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    confirmPlan: { type: Boolean, default: false },
    plan: { type: Object, default: null, required: true },
    device: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    onPlanSelect() {
      this.loading = true
      this.$store.dispatch('order/setupOrder', { id: this.plan.id, camera: this.device.id }).then(() => {
        this.$emit('planSelect')
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>