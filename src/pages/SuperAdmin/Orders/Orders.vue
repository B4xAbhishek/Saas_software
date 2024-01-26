<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Orders</div>
        <bread-crumbs :items="breadcrumbs"></bread-crumbs>
      </div>
      <v-spacer></v-spacer>
    </div>

    <OrderList />
  </div>
</template>
  
<script>
import OrderList from '@/components/order/OrderList'
  
export default {
  components: { OrderList },
  data() {
    return {
      breadcrumbs: [
        {
          text: 'Orders',
          disabled: true,
          to: '/admin/orders'
        },
        {
          text: 'List',
          disabled: true
        }
      ]
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
