<template>
  <div>
    <v-dialog v-model="dialog" max-width="500" persistent>
      <v-card>
        <v-card-text>
          <div class="d-flex justify-space-between align-center pt-2 pb-2">
            <div>
              <h2 class="black--text">Assign Cameras</h2>
              <h4 class="black--text mt-1">Order: {{ order.zoho_order_number }}</h4>
            </div>
            <v-icon @click="cancel">mdi-close</v-icon>
          </div>
          <v-divider></v-divider>

          <v-form ref="form" class="mt-3" lazy-validation @submit.prevent="save">
            <div v-for="item in assignedDevices" :key="item.index" class="d-flex align-center">
              <v-text-field v-model="item.device" disabled label="SN" class="mr-1"></v-text-field>
              <v-btn v-if="isWaiting()" icon no-ripple @click="editDevice(item)">
                <v-icon color="red">mdi-pencil</v-icon>
              </v-btn>
              <v-btn v-if="isWaiting()" icon no-ripple @click="removeDevice(item.index)">
                <v-icon color="red">mdi-close</v-icon>
              </v-btn>
            </div>
            <div v-for="(item, dIndex) in displayDevices" :key="item.index" class="d-flex align-center">
              <v-text-field
                v-model="item.device"
                :rules="rules"
                label="SN"
                class="mr-1"
                @keydown.tab="nextDevice"
              >
              </v-text-field>
              <v-btn
                :disabled="!item.device"
                icon
                no-ripple
                @click="openScanner(dIndex)"
              >
                <v-icon color="red">mdi-camera</v-icon>
              </v-btn>
              <v-btn
                v-if="displayDevices.length > 1"
                :disabled="!item.device"
                icon
                no-ripple
                @click="removeFromUI(item.index)"
              >
                <v-icon color="red">mdi-close</v-icon>
              </v-btn>
            </div>

            <template v-if="displayDevices.length < 1 && assignedDevices.length < 1">
              <p class="text-center">No Un-assigned camera found for you...</p>
            </template>

            <v-btn
              v-if="displayDevices.length < deviceList.length"
              icon
              small
              color="primary"
              @click="nextDevice"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>

            <div v-if="displayDevices.length > 0" class="mt-3">
              <v-btn color="primary" type="submit" :loading="isLoading">Save</v-btn>
              <v-btn color="grey lighten-2" class="ml-1" :disabled="isLoading" @click="cancel">Cancel</v-btn>
            </div>
          </v-form>

          <v-btn
            v-if="isAdmin() && assignedDevices.length > 0 && displayDevices.length < 1"
            class="mt-3"
            color="primary"
            depressed
            block
            :loading="finalizeLoading"
            @click="finalize"
          >Finalize Cameras</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="removeModal" max-width="400">
      <v-card>
        <v-card-text>
          <div class="d-flex justify-space-between align-center pt-2 pb-2">
            <div>
              <h2 class="black--text">Remove Device</h2>
            </div>
            <v-icon @click="removeModal = false">mdi-close</v-icon>
          </div>
          <v-divider></v-divider>

          <div class="text-center">
            <p class="mb-4">Are you sure you want to remove device from this order ?</p>

            <v-btn color="primary" :loading="removeLoading" @click="remove">Yes Remove</v-btn>
            <v-btn color="grey lighten-2" class="ml-1" :disabled="removeLoading" @click="removeModal = false">Cancel
            </v-btn>

          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editModal" max-width="400">
      <v-card>
        <v-card-text>
          <div class="d-flex justify-space-between align-center pt-2 pb-2">
            <div>
              <h2 class="black--text">Edit Device</h2>
            </div>
            <v-icon @click="editModal = false">mdi-close</v-icon>
          </div>
          <v-divider></v-divider>

          <v-form v-if="deviceToEdit && deviceToEdit.device" class="mt-3" @submit.prevent="edit">
            <v-text-field v-model="deviceToEdit.device" :rules="rules" label="SN"></v-text-field>

            <v-btn color="primary" type="submit" :loading="editLoading" @click="edit">Save</v-btn>
            <v-btn color="grey lighten-2" class="ml-1" :disabled="editLoading" @click="editModal = false">Cancel
            </v-btn>
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
    dialog: {
      type: Boolean,
      default: false
    },
    order: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      isLoading: false,
      scanDialog: false,
      finalizeLoading: false,
      removeLoading: false,
      removeModal: false,
      editModal: false,
      editLoading: false,
      deviceToEdit: null,
      deviceList: [],
      assignedDevices: [],
      displayDevices: [],
      removeIndex: null,
      currIndex: 0,
      scanIndex: null,
      rules: [(v) => !!v || 'Camera SN is Required'],
      camera: {
        project: null,
        location: null,
        position: null
      }
    }
  },
  mounted() {
    this.setDevices()
  },
  methods: {
    openScanner(index) {
      this.scanIndex = index
      this.scanDialog = true
    },
    onDecode(result) {
      this.displayDevices[this.scanIndex].camera = result
      this.scanDialog = false
    },
    isWaiting() {
      return this.order && this.order.status.toLowerCase() === 'waiting_assignment' ? true : false
    },
    setDevices() {
      console.log(this.order)
      const devices = JSON.parse(JSON.stringify(this.order.camera_assigned))

      this.assignedDevices = []
      this.deviceList = []
      devices.forEach((device, index) => {
        if (device.to_be_assigned_by === 'admin' && device.camera && device.camera.id) {
          this.assignedDevices.push({
            index,
            device: device.camera.SN
          })
        }
        if (device.to_be_assigned_by === 'admin' && (!device.camera || !device.camera.id)) {
          this.deviceList.push({
            index,
            device: null
          })
        }
      })

      if (this.deviceList.length) {
        this.displayDevices.push(this.deviceList[this.currIndex])
      }
    },
    nextDevice() {
      if (this.$refs.form.validate()) {
        const lastDevice = this.displayDevices.at(-1)

        if (lastDevice && lastDevice.device) {
          if (this.displayDevices.length < this.deviceList.length) {
            // find from device list where item is not available in display devices
            const usedIndex = this.displayDevices.map((item) => item.index)
            const device = this.deviceList.filter((item) => !usedIndex.includes(item.index))

            this.displayDevices = [...this.displayDevices, device[0]]
          }
        }
      }
    },
    removeFromUI(dIndex) {
      this.displayDevices = JSON.parse(JSON.stringify(this.displayDevices.filter((device) => device.index !== dIndex)))
    },
    removeDevice(dIndex) {
      this.removeIndex = dIndex
      this.removeModal = true
    },
    editDevice(item) {
      this.deviceToEdit = { ...item }
      this.editModal = true
    },
    remove() {
      this.removeLoading = true
      this.$store.dispatch('order/removeAssignedDevice', {
        id: this.order.id,
        index: this.removeIndex
      }).then(() => {
        this.assignedDevices = this.assignedDevices.filter((device) => device.index !== this.removeIndex)

        this.removeModal = false
        this.refresh()
      }).finally(() => {
        this.removeLoading = false
      })
    },
    async save() {
      if (this.$refs.form.validate()) {
        if (this.displayDevices.length && this.displayDevices.length > 0) {
          for await (const device of this.displayDevices) {
            await this.assignDevice(device)
          }

          console.log('All Devices Saved...')
          this.refresh()
        }
      }
    },
    async edit() {
      if (this.deviceToEdit) {
        await this.assignDevice(this.deviceToEdit)
      }
    },
    async assignDevice(device) {
      this.isLoading = true
      this.editLoading = true
      await this.$store.dispatch('order/assignDevice', {
        id: this.order.id,
        camera_id: device.device,
        index: device.index
      }).finally(() => {
        this.isLoading = false
        this.editLoading = false
      })
    },
    async finalize() {
      this.finalizeLoading = true
      this.$store.dispatch('order/finalizeAssignment', this.order.id).then(() => {
        this.refresh()
      }).finally(() => {
        this.finalizeLoading = false
      })
    },
    refresh() {
      this.$emit('refresh')
    },
    cancel() {
      this.$emit('close', true)
    }
  }
}
</script>