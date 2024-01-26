<template>
  <v-dialog v-if="scanDialog" v-model="scanDialog" persistent max-width="550">
    <v-card>
      <v-card-text>
        <div class="pt-2 pb-2 d-flex justify-space-between align-center">
          <h2>Scan Serial Number</h2>
          <v-icon @click="close">mdi-close</v-icon>
        </div>
        <v-divider></v-divider>
        <div class="mt-3">
          <StreamBarcodeReader @decode="onDecode" @error="onError"></StreamBarcodeReader>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { StreamBarcodeReader } from 'vue-barcode-reader'
export default {
  components: {
    StreamBarcodeReader
  },
  props: {
    scanDialog: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    onDecode(result) {
      this.$emit('onDecode', result)
    },
    onError(err) {
      console.log('Scan Error...', err)
    }
  }
}
</script>