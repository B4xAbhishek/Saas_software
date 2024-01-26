<template>
  <div class="return-camera">
    <v-dialog v-model="returnModal" max-width="550" persistent>
      <v-card>
        <v-card-text>
          <div class="pt-2 pb-2 d-flex justify-space-between align-center">
            <h2 class="black--text">Return Camera</h2>
            <v-icon @click="close">mdi-close</v-icon>
          </div>
          <v-divider></v-divider>

          <div class="d-flex">
            <v-text-field
              v-model="camera.SN"
              label="Serial Number"
              placeholder="000-000-000"
              :rules="required"
              :loading="isLoading"
              @input="loadNewDevice"
            >
            </v-text-field>

            <v-icon color="primary" class="ml-2" no-ripple @click="scanDialog = true">mdi-camera
            </v-icon>
          </div>

          <div v-if="deviceInfo && !isOwned">
            <h4 class="primary--text text-center">This device isn't owned by you...</h4>
          </div>
          <v-form v-if="isDeviceExists && deviceInfo && isOwned" ref="form" lazy-validation @submit.prevent="returnDevice">
            <v-row no-gutters>
              <v-col cols="12" sm="6" class="mb-1">
                <div class="d-flex align-center">
                  <h3 class="primary--text mr-2">Ownership: </h3>
                  <h3 class="text-capitalize">{{ deviceInfo.ownership_status }}</h3>
                </div>
              </v-col>
              <v-col cols="12" sm="6" class="mb-1">
                <div class="d-flex align-center">
                  <h3 class="primary--text mr-2">Network Status: </h3>
                  <h3 class="text-capitalize" :class="isActivated ? 'green--text' : 'red--text'">{{ deviceInfo.networking_status }}</h3>
                </div>
              </v-col>

              <v-col v-if="isActivated" cols="12" class="mt-1">
                <v-btn color="grey lighten-1" :block="$vuetify.breakpoint.xsOnly" :loading="deactivating" @click="deactivate">Deactivate</v-btn>
                <div>Camera returning to inventory must be deactivated</div>
              </v-col>

              <v-col cols="12" lg="8">
                <v-autocomplete
                  v-model="camera.warehouse"
                  label="Warehouse"
                  placeholder="Select a Warehouse"
                  :items="warehouseList"
                  item-value="_id"
                  item-text="name"
                  :rules="required"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" lg="8">
                <v-autocomplete
                  v-model="camera.condition"
                  label="Camera Condition*"
                  :items="['Good', 'Damage working', 'Damage Failed', 'Failed']"
                  :rules="required"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" lg="8">
                <v-textarea
                  v-model="camera.notes"
                  label="Notes"
                  rows="2"
                  no-resize
                ></v-textarea>
              </v-col>
              <v-col cols="12" class="mt-2">
                <v-btn color="primary" type="submit" :disabled="isActivated" :loading="returnLoading">Return</v-btn>
                <v-btn color="grey lighten-2" class="ml-1" :disabled="returnLoading" @click="close">Cancel</v-btn>
                <p v-if="isActivated" class="my-0 px-0 red--text">Please deactivate the device to return.</p>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <QRScan v-if="scanDialog" :scan-dialog="scanDialog" @close="scanDialog = false" @onDecode="onDecode" />
  </div>
</template>

<script>
import QRScan from '@/components/common/QRScan'
export default {
  components: {
    QRScan
  },
  props: {
    returnModal: {
      type: Boolean, default: false
    }
  },
  data() {
    return {
      isLoading: false,
      returnLoading: false,
      deactivating: false,
      required: [(v) => !!v || 'Required'],
      scanDialog: false,
      isDeviceExists: false,
      deviceInfo: null,
      isActivated: false,
      isOwned: false,
      timer: null,
      warehouseList: [],
      camera: {
        SN: null,
        warehouse: null,
        condition: null,
        notes: null
      }
    }
  },
  methods: {
    onDecode(result) {
      this.camera.SN = result
      this.scanDialog = false
      this.loadDevice()
    },
    close() {
      this.$emit('close')
    },
    loadNewDevice() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.loadDevice()
      }, 500)
    },
    async loadDevice() {
      if (!this.camera.SN) {
        return
      }

      const { SN } = this.camera

      this.isDeviceExists = false
      this.isActivated = false
      this.isOwned = false
      this.deviceInfo = null

      this.isLoading = true
      await this.$store
        .dispatch('device/getDeviceInfo', {
          device_serial_no: SN
        })
        .then((resp) => {
          if (resp && resp.SN) {
            this.deviceInfo = { ...resp }

            if (this.deviceInfo.networking_status.toLowerCase() === 'active') {
              this.isActivated = true
            }

            if (this.deviceInfo.ownership_status.toLowerCase() === 'owned') {
              this.isOwned = true
            }

            this.isDeviceExists = true

            this.getWarehouses()
          }
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    getWarehouses() {
      this.warehouseList = []
      this.$store.dispatch('device/getWarehouses').then((resp) => {
        this.warehouseList = [...resp]
      })
    },
    deactivate() {
      const payload = {
        sn: this.camera.SN,
        status: 0
      }

      this.deactivating = true
      this.$store.dispatch('device/deactivateDevice', payload).then((resp) => {
        console.log(resp)
        this.isActivated = false
      }).finally(() => {
        this.deactivating = false
      })
    },
    returnDevice() {
      if (this.$refs.form.validate()) {
        const data = { ...this.camera }

        data.condition = data.condition && data.condition.toLowerCase()

        this.returnLoading = true
        this.$store.dispatch('order/returnDevice', data).then((resp) => {
          this.$emit('returned')
        }).finally(() => {
          this.returnLoading = false
        })
      }
    }
  }
}
</script>