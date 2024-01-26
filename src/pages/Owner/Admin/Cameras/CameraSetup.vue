<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div v-if="$vuetify.breakpoint.smAndDown" class="d-flex">
        <v-icon color="primary">mdi-chevron-left</v-icon>
        <h4 class="">{{ user.company_name }}</h4>
      </div>
      <div v-else>
        <div class="display-1">{{ user.company_name }}</div>
        <bread-crumbs :items="breadcrumbs"></bread-crumbs>
      </div>
    </div>

    <v-row>
      <v-col cols="12" md="8" lg="6" xl="5">
        <v-card>
          <v-card-text>
            <div class="d-flex">
              <v-text-field
                v-model="camera.sn"
                label="Serial Number"
                placeholder="000-000-000"
                :rules="required"
                :loading="isLoading"
                @input="loadNewDevice"
              >
              </v-text-field>

              <v-icon color="primary" class="ml-2" no-ripple @click="scanDialog = true">mdi-camera</v-icon>
            </div>
            <v-form ref="form" lazy-validation @submit.prevent="updateDevice">

              <div v-if="isDeviceExists && deviceOrder && deviceOrder.purchase_plan" class="plan mb-2">
                <v-list color="grey lighten-3">
                  <v-list-item>
                    <v-list-item-avatar color="primary" size="48">
                      <span class="white--text text-h5 text-capitalize">P</span>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>Plan: {{ deviceOrder.zoho_order_number }}</v-list-item-title>
                      <v-list-item-subtitle>
                        Status: <v-chip small class="px-1 ml-2">{{ getPlanStatus() }}</v-chip>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-icon @click="planDialog = true">mdi-dots-vertical</v-icon>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </div>

              <v-autocomplete
                v-model="camera.project"
                :items="projectList"
                :rules="required"
                item-text="name"
                item-value="id"
                label="Select Project"
                placeholder="Link Camera to project"
                :disabled="!isDeviceExists"
                @change="changeProject"
              >
              </v-autocomplete>

              <v-combobox
                v-model="camera.location"
                :items="locationList"
                :rules="required"
                item-text="name"
                item-value="name"
                label="Location"
                placeholder="Enter Camera Location"
                :disabled="!isDeviceExists"
              >
              </v-combobox>

              <v-text-field
                v-model="camera.label"
                :rules="required"
                label="Position"
                placeholder="Enter Camera Position"
                :disabled="!isDeviceExists"
              >
              </v-text-field>

              <!-- <v-combobox
                v-model="camera.label"
                :items="labels"
                :rules="required"
                item-text="label_name"
                item-value="label_name"
                label="Position"
                placeholder="Enter Camera Position"
                :disabled="!isDeviceExists"
              >
              </v-combobox> -->

              <v-btn
                color="primary"
                depressed
                type="submit"
                :loading="editLoading"
              > {{ !isDeviceActivated() ? 'Save & Activate' : 'Save' }}</v-btn>
            </v-form>

            <template v-if="false">
              <h4 class="px-0 black--text mt-3">Camera test picture</h4>
              <div v-if="latestImage" class="image mt-2 mb-2" :style="{ 'backgroundImage': `url(${latestImage})` }">
              </div>
              <v-btn
                rounded
                color="primary"
                class="mt-2"
                outlined
                depressed
                :loading="captureLoading"
                @click="captureImage"
              >
                <v-icon class="mr-1">mdi-refresh</v-icon> New Picture
              </v-btn>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <QRScan v-if="scanDialog" :scan-dialog="scanDialog" @close="scanDialog = false" @onDecode="onDecode" />
    <OrderList
      v-if="planDialog && deviceInfo"
      :plan-dialog="planDialog"
      :device-info="deviceInfo"
      @close="planDialog = false"
      @refreshOrder="refreshOrder"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import QRScan from '@/components/common/QRScan'
import OrderList from '@/components/owner/OrderList'
import moment from 'moment'

export default {
  components: {
    QRScan,
    OrderList
  },
  data() {
    return {
      required: [(v) => !!v || 'Required'],
      isDeviceExists: false,
      captureLoading: false,
      editLoading: false,
      isLoading: false,
      scanDialog: false,
      planDialog: false,
      confirmPlan: false,
      deviceOrder: null,
      isImageLoaded: false,
      latestImage: null,
      interval: null,
      timer: null,
      labels: [],
      camera: {
        id: null,
        sn: null,
        location: null,
        project: null,
        label: null
      },
      pickedFile: {
        name: null,
        file: null
      },
      breadcrumbs: [
        {
          text: 'Administrator',
          disabled: false,
          to: '/admin/cameras'
        },
        {
          text: 'Cameras',
          disabled: false,
          to: '/admin/cameras'
        },
        {
          text: 'Edit Camera',
          disabled: true
        }
      ]
    }
  },
  computed: {
    ...mapState({
      user: (store) => store.auth.user,
      projects: (store) => store.project.projects,
      locations: (store) => store.project.projectLocations
    }),
    projectList() {
      return this.projects ? this.projects.projects : []
    },
    locationList() {
      return this.locations && this.locations.locations
        ? this.locations.locations
        : []
    },
    pagination() {
      return this.projects && this.projects.pagination
    }
  },
  watch: {
    selectedProjects(val) { },
    isImageLoaded(val) {
      if (val) {
        this.interval = setTimeout(() => {
          // this.loadDeviceImage()
        },5000)
      }
    }
  },
  beforeDestroy() {
    clearTimeout(this.interval)
  },
  methods: {
    onDecode(result) {
      this.camera.sn = result
      this.scanDialog = false
      this.loadDevice()
    },
    async loadDeviceImage() {
      if (this.isDeviceExists) {
        this.isImageLoaded = false

        const { sn } = this.camera

        const payload = {
          device_serial_no: sn,
          perPage: 1
        }

        await this.$store.dispatch('device/getDeviceImage', payload).then((resp) => {

          const image = resp.images && resp.images.length > 0 ? resp.images.at(-1) : null

          if (image && image.image_url !== this.latestImage) {
            this.latestImage = image.image_url
          }

        }).finally(() => {
          clearTimeout(this.interval)
          this.isImageLoaded = true
        })
      }
    },
    loadNewDevice() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.loadDevice()
      }, 500)
    },
    refreshOrder() {
      if (this.deviceOrder && this.deviceOrder.id) {
        this.getOrder(this.deviceOrder.id)
      }
    },
    async loadDevice(payload = null) {
      if (!this.camera.sn) {
        return
      }

      const { sn } = this.camera

      this.camera = {
        id: null,
        sn,
        location: null,
        project: null,
        label: null
      },

      this.isDeviceExists = false
      this.deviceOrder = null

      this.isLoading = true
      await this.$store
        .dispatch('device/getDeviceInfo', {
          id: sn
        })
        .then(async (resp) => {

          if (resp && resp.order) {
            // Call Order API and get Assigned Devices
            this.getOrder(resp.order.id)
            // this.$store.dispatch('device/setupDevice', { id: resp.order._id, device: resp.SN })
          }

          if (resp && resp.SN) {
            this.deviceInfo = { ...resp }
            this.camera.id = resp.id
            this.camera.project = resp.project.id
            this.camera.location = resp.location.name
            this.camera.label = resp.position.name

            this.isDeviceExists = true
            // await this.loadDeviceImage()
            await this.$store
              .dispatch('project/getProjects', { size: 100000 })
              .then(() => {
                if (this.camera.project) {
                  this.loadLocations(this.camera.project)
                }
              })
          }
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    changeProject(id) {
      this.camera.location = null
      this.camera.label = null
      this.loadLocations(id)
    },
    loadLocations(id) {
      this.$store.dispatch('project/getProjectLocations', { id: id })
    },
    setLocation(loc) {
      this.labels = []
      if (typeof loc === 'object') {
        this.camera.location = loc.location_name
        this.labels = [...loc.labels]
      } else {
        this.camera.location = loc
        const allLocs = this.locations && this.locations.locations
          ? this.locations.locations
          : []

        const isLoc = allLocs.find((location) => location.location_name === loc)

        if (isLoc) {
          this.labels = [...isLoc.labels]
        }
      }
    },
    getOrder(id) {
      this.$store.dispatch('order/getOrder', id).then((resp) => {
        console.log(resp)
        this.deviceOrder = { ...resp }
      })
    },
    isDeviceActivated() {
      if (this.deviceOrder) {
        const slot = this.deviceOrder.camera_assigned.find((device) => device.camera.id === this.camera.id)

        if (slot && !slot.is_suspended && slot.service_status.toLowerCase() === 'inactive' && !slot.service_end_date) {
          return false
        }
      }

      return true
    },
    getPlanStatus() {
      const assigned_device = this.deviceOrder.camera_assigned.find((device) => device.camera.id === this.camera.id)

      if (assigned_device) {

        if (assigned_device.has_service_ended) {
          return 'Expired on ' + moment(assigned_device.service_end_date).format('MMM DD, YYYY')
        }
        if (assigned_device.is_suspended) {
          return 'Suspended'
        }
        if (assigned_device.service_status && assigned_device.service_status.toLowerCase() === 'inactive') {
          return 'Inactive'
        }
        if (assigned_device.service_status && assigned_device.service_status.toLowerCase() === 'active') {
          return 'Active till ' + moment(assigned_device.service_end_date).format('MMM DD, YYYY')
        }
      }

      return 'N/A'
    },

    captureImage() {
      this.captureLoading = true
      this.$store.dispatch('device/captureImage', this.camera.sn).then((resp) => {
        console.log(resp)
      }).finally(() => {
        this.captureLoading = false
      })
    },

    updateDevice() {
      console.log(this.camera)

      // eslint-disable-next-line no-unreachable
      if (this.$refs.form.validate() && !this.isLoading) {
        this.editLoading = true
        const payload = {
          id: this.camera.id,
          project_id: this.camera.project,
          location_name: typeof this.camera.location === 'object' ? this.camera.location.name : this.camera.location,
          position_name: this.camera.label
        }

        this.$store.dispatch('device/updateDeviceInfo', payload).then(() => {
          if (!this.isDeviceActivated()) {
            this.$store.dispatch('order/setupOrder', { id: this.deviceOrder.id, camera: this.camera.id })
          }
        }).finally(() => {
          this.editLoading = false
        })
      }
    }
  }
}
</script>

<style scoped>
.image {
  width: 100%;
  height: 200px;
  border: 1px solid #ddd !important;
  border-radius: 4px;
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>

/* if the request is a success then only prefill the Project, Location, and position ( label ),
also add a save button to apply changes to the project, Location, and Position.

To list the Plan section, There You are supposed to show the current plan that the device is on, to do that, use order._id from the device info response to call (/subscription/get user order),

show order.zoho_order_number in Plan: NNN 

then, You need to find the slot from the order.assigned_devices where device SN === slot.device

about status ( below the plan: NNN ), 

put expired if slot.has_service_ended is true,

put suspended if slot.is_suspended is true

put active if slot.service_status is active

put inactive if slot.service_status is inactive

 about the date next to the status:

if the status is expired then you will have a date in slot.service_end_date show “on {{date}}” 

if the status is active then you will have a date in slot.service_end_date show “till {{date}}”

in other status don’t show any dates

When clicking on the three dots next to the plan:

show orders using (/subscriptions/list user orders ). */