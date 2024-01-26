<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Edit Sales Order</div>
        <bread-crumbs :items="breadcrumbs"></bread-crumbs>
      </div>
    </div>

    <div>
      <strong class="mr-3">Customer: </strong> ABC Construction
    </div>
    <div class="mt-1">
      <strong class="mr-1">Sales Order: </strong> SO-22222
    </div>
    <div class="mt-1">
      <strong class="mr-5">Invoice: </strong> <v-chip label small color="primary" class="px-0"><span class="white--text">Invoiced</span></v-chip>
    </div>
    <div class="mt-1">
      <strong class="mr-4">Payment: </strong> <v-chip label small color="primary" class="px-0"><span class="white--text">Paid</span></v-chip>
    </div>
    <div class="mt-1">
      <strong class="mr-3">Shipment: </strong> <v-chip label small color="primary" class="px-0"><span class="white--text">Pending</span></v-chip>
    </div>

  </div>
</template>
  
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      isLoading: false,
      required: [(v) => !!v || 'Required'],
      breadcrumbs: [
        {
          text: 'Sales Orders',
          disabled: false,
          to: '/sales-orders'
        },
        {
          text: 'Edit Sales Order',
          disabled: true
        }
      ]
    }
  },
  methods: {
  
    async resetForm() {
      this.$refs.form.reset()
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
