<template>
  <v-dialog v-model="dialog" max-width="500" persistent>
    <v-card>
      <v-card-text>
        <div class="d-flex justify-space-between align-center pt-2 pb-2">
          <div>
            <h2 class="black--text">Suspend Camera</h2>
            <h4 class="black--text mt-1">SN: {{ item.camera.SN }}</h4>
          </div>
          <v-icon @click="cancel">mdi-close</v-icon>
        </div>
        <v-divider></v-divider>
        <div class="red--text mt-2">Suspend service for order until: </div>
        <v-form ref="form" class="" lazy-validation @submit.prevent="save">
          <DatePicker :date="order.ideal_till_date" @update="changeDate" />
          <div class="mt-3">
            <v-btn color="primary" type="submit" :loading="isLoading">Suspend</v-btn>
            <v-btn color="grey lighten-2" class="ml-1" :disabled="isLoading" @click="cancel">Cancel</v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
      
<script>
import DatePicker from '@/components/common/DatePicker'
export default {
  components: {
    DatePicker
  },
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    order: {
      type: Object,
      default: null
    },
    item: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      isLoading: false,
      suspeded_till: null
    }
  },
  created() {
    this.setCameraInfo()
  },
  methods: {
    setCameraInfo() {
      // this.camera
    },
    changeDate(value) {
      this.suspeded_till = value
    },
    save() {
      const payload = {
        order_id: this.order.id,
        index: this.item.index,
        suspeded_till: this.suspeded_till
      }

      this.isLoading = true

      this.$store.dispatch('order/suspendCamera', payload).then(() => {
        this.$emit('refresh')
      }).finally(() => {
        this.isLoading = false
      }) 
    },
    cancel() {
      this.$emit('close', true)
    }
  }
}
</script>