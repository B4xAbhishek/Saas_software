<template>
  <v-dialog v-model="dialog" max-width="500" persistent>
    <v-card>
      <v-card-text>
        <div class="d-flex justify-space-between align-center pt-2 pb-2">
          <div>
            <h2 class="black--text">Replace Camera</h2>
            <h4 class="black--text mt-1">SN: {{ item.camera.SN }}</h4>
          </div>
          <v-icon @click="cancel">mdi-close</v-icon>
        </div>
        <v-divider></v-divider>
    
        <v-form ref="form" class="mt-3" lazy-validation @submit.prevent="save">
          <v-text-field
            v-model="camera.camera_id"
            label="Replacement Camera ID"
            :rules="[v => !!v || 'Camera ID is required']"
          ></v-text-field>
          <v-autocomplete
            v-model="camera.reason"
            :items="['Damage', 'Stolen', 'Failed', 'Other']"
            label="Reason"
            :rules="[v => !!v || 'Reason is required']"
          ></v-autocomplete>
          <v-textarea
            v-model="camera.details"
            rows="3"
            label="More details"
            :rules="[v => !!v || 'Details are required']"
          ></v-textarea>
  
          <div class="mt-3">
            <v-btn color="primary" type="submit" :loading="isLoading">Save</v-btn>
            <v-btn color="grey lighten-2" class="ml-1" :disabled="isLoading" @click="cancel">Cancel</v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
    
<script>
export default {
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
      camera: {
        camera_id: null,
        reason: null,
        details: null
      }
    }
  },
  created() {
    this.setCameraInfo()
  },
  methods: {
    setCameraInfo() {
      // this.camera
    },
    save() {
      if (this.$refs.form.validate()) {
        const payload = {
          ...this.camera,
          order_id: this.order.id,
          index: this.item.index
        }

        this.isLoading = true

        this.$store.dispatch('order/replaceCamera', payload).then(() => {
          this.$emit('refresh')
        }).finally(() => {
          this.isLoading = false
        })
      }
    },
    cancel() {
      this.$emit('close', true)
    }
  }
}
</script>