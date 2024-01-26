<template>
  <div>
    <v-dialog v-model="dialog" max-width="1200" persistent>
      <v-card>
        <v-card-text>
          <div class="d-flex justify-space-between align-center pt-2 pb-2">
            <div>
              <h4 v-if="!isLoading && orderInfo"><span class="black--text">Customer:</span> {{ orderInfo.user ?
                orderInfo.user.company : user.first_name + ' ' + user.last_name
              }}
              </h4>
              <h4 v-if="!isLoading && orderInfo"><span class="black--text">Order:</span> {{
                orderInfo.zoho_order_number
              }}</h4>
            </div>
            <v-icon @click="closeCustomer">mdi-close</v-icon>
          </div>
          <v-divider></v-divider>

          <template v-if="isAdmin()">
            <div v-if="orderInfo && devices.length > 0" class="d-flex flex-wrap align-end mt-1">
              <div>
                <strong class="black--text">Service Expiration:</strong>
                <span>{{ getMinDate && getMinDate.toLocaleDateString() }}</span>
                <!-- <span>{{ new Date(orderInfo.ideal_till_date).toLocaleDateString() }}</span> -->
                <v-btn
                  v-if="!change"
                  color="primary"
                  class="ml-1"
                  small
                  depressed
                  @click="change = !change"
                >Change
                </v-btn>
              </div>

              <div class="mx-md-3 d-flex flex-column">
                <div class="red--text mb-0">Suspend service for order until: </div>
                <DatePicker :date="order_suspend_till" @update="setOrderSuspendDate" />
              </div>
              <div class="">
                <v-btn
                  small
                  outlined
                  depressed
                  color="red"
                  :loading="suspendLoading"
                  :disabled="!order_suspend_till"
                  @click="suspendOrder"
                >Suspend</v-btn>
              </div>
            </div>

            <template v-if="change && orderInfo && devices.length > 0">
              <v-row no-gutters align-sm="end">
                <v-col cols="12" sm="6" md="4" lg="3">
                  <DatePicker :date="getMinDate" @update="changeDate" />
                </v-col>
                <v-col cols="12" sm="6" md="4" class="pl-sm-2">
                  <v-btn color="primary" small :loading="expiryLoading" @click="updateExpiry">Save</v-btn>
                  <v-btn
                    color="grey lighten-2"
                    class="ml-1"
                    small
                    :disabled="expiryLoading"
                    @click="change = false"
                  >
                    Cancel</v-btn>
                </v-col>
              </v-row>
            </template>
          </template>

          <v-row dense class="pa-2 align-center">
            <v-col cols="12" class="text-right">
              <v-btn v-if="isAdmin() && !isLoading && isWaiting()" color="primary" depressed @click="openAssignDialog">
                Assign Cameras
              </v-btn>
            </v-col>
            <v-col cols="12" md="6">
              <h2 class="black--text">Devices</h2>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="searchQuery"
                append-icon="mdi-magnify"
                class="flex-grow-1"
                solo
                hide-details
                dense
                clearable
                placeholder="Search"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-data-table
            :headers="headers"
            :items="devices"
            item-key="camera.id"
            :search="searchQuery"
            :loading="isLoading"
            class="flex-grow-1 cursor-pointer"
          >
            <template v-slot:[`item.service_start_date`]="{ item }">
              {{ item.service_start_date && new Date(item.service_start_date).toLocaleDateString() || 'N/A' }}
            </template>
            <template v-slot:[`item.service_end_date`]="{ item }">
              {{ item.service_end_date && new Date(item.service_end_date).toLocaleDateString() || 'N/A' }}
            </template>
            <template v-slot:[`item.camera.project.name`]="{ item }">
              {{ item.camera && item.camera.project && item.camera.project.name || 'N/A' }}
            </template>
            <template v-slot:[`item.camera.location.name`]="{ item }">
              {{ item.camera && item.camera.location && item.camera.location.name || 'N/A' }}
            </template>
            <template v-slot:[`item.camera.position.name`]="{ item }">
              {{ item.camera && item.camera.position && item.camera.position.name || 'N/A' }}
            </template>
            <template v-slot:[`item.action`]="{ item }">
              <div class="actions">
                <v-menu bottom origin="center center" transition="scale-transition">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>

                  <v-list dense>
                    <v-list-item v-if="isGPSAvailable(item)" @click="viewLocation(item)">
                      <v-list-item-icon>
                        <v-icon color="primary" size="20">mdi-map-marker</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Location</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="isAdmin()" @click="replace(item)">
                      <v-list-item-icon>
                        <v-icon color="primary" size="20">mdi-autorenew</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Replace</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="!isWaiting()" @click="edit(item)">
                      <v-list-item-icon>
                        <v-icon color="primary" size="20">mdi-pencil</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Edit</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="isAdmin()" @click="suspend(item)">
                      <v-list-item-icon>
                        <v-icon color="primary" size="20">mdi-pause-octagon-outline</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Suspend</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <!-- <v-btn icon color="primary" small @click="viewLocation(camera)">
                  
                </v-btn>
                <v-btn icon color="primary" small @click="replace(camera)">
                  <v-icon>mdi-autorenew</v-icon>
                </v-btn>
                <v-btn icon color="primary" small @click="edit(camera)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn> -->
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>

    <AssignCameras
      v-if="assignDialog && orderInfo"
      :order="orderInfo"
      :dialog="assignDialog"
      @close="assignDialog = false"
      @refresh="loadOrder"
    />

    <EditCamera
      v-if="cameraDialog && itemInfo"
      :user="user"
      :dialog="cameraDialog"
      :order="orderInfo"
      :item="itemInfo"
      @close="cameraDialog = false"
      @refresh="loadOrder"
    />

    <ReplaceCamera
      v-if="replaceDialog && itemInfo"
      :user="user"
      :dialog="replaceDialog"
      :item="itemInfo"
      :order="order"
      @close="replaceDialog = false"
      @refresh="loadOrder"
    />

    <SuspendCamera
      v-if="suspendDialog && itemInfo"
      :user="user"
      :dialog="suspendDialog"
      :item="itemInfo"
      :order="orderInfo"
      @close="suspendDialog = false"
      @refresh="loadOrder"
    />

    <CameraLocation
      v-if="viewDialog && itemInfo"
      :user="user"
      :dialog="viewDialog"
      :item="itemInfo"
      @close="viewDialog = false"
    />
  </div>
</template>

<script>
import AssignCameras from './AssignCameras'
import EditCamera from './EditCamera'
import ReplaceCamera from './ReplaceCamera'
import SuspendCamera from './SuspendCamera'
import CameraLocation from './CameraLocation'
import DatePicker from '@/components/common/DatePicker'
import { mapState } from 'vuex'
export default {
  components: {
    DatePicker,
    AssignCameras,
    EditCamera,
    ReplaceCamera,
    SuspendCamera,
    CameraLocation
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
      searchQuery: '',
      change: false,
      isLoading: false,
      suspendLoading: false,
      cameraDialog: false,
      replaceDialog: false,
      assignDialog: false,
      viewDialog: false,
      suspendDialog: false,
      expiryLoading: false,
      orderInfo: null,
      itemInfo: null,
      minDate: null,
      expiry: {
        id: null,
        expiry_date: null
      },
      order_suspend_till: this.getMinDate,
      headers: [
        { text: 'SN', value: 'camera.SN', align: 'left' },
        { text: 'Expires', value: 'service_end_date', align: 'left' },
        { text: 'Assignment', value: 'service_start_date', align: 'left' },
        { text: 'Status', value: 'service_status', align: 'left' },
        { text: 'Project', value: 'camera.project.name', align: 'left' },
        { text: 'Location', value: 'camera.location.name', align: 'left' },
        { text: 'Position', value: 'camera.position.name', align: 'left' },
        { text: 'Action', sortable: false, align: 'left', value: 'action' }
      ],
      devices: []
    }
  },
  computed: {
    ...mapState({
      user: (store) => store.auth.user
    }),
    getMinDate() {
      if (this.devices && this.devices.length > 0) {
        const dates = this.devices.filter((item) => item.service_status === 'active').map((item) => new Date(item.service_end_date))
        
        const min = new Date(Math.min(...dates))
        
        return min
      }

      return null 
    }
  },
  created() {
    this.loadOrder()
  },
  methods: {
    loadOrder() {
      this.cameraDialog = false
      this.assignDialog = false
      this.replaceDialog = false
      this.suspendDialog = false

      this.isLoading = true
      this.devices = []
      this.$store.dispatch('order/getOrder', this.order.id).then((resp) => {
        this.orderInfo = { ...resp }
        this.devices = resp.camera_assigned.filter((device, index) => {
          device.index = index
          if (device.camera) return device

          this.isLoading = false
        })
      }).finally(() => {
        this.isLoading = false
      })
    },
    isWaiting() {
      return this.orderInfo && this.orderInfo.status.toLowerCase() === 'waiting_assignment' ? true : false
    },
    closeCustomer() {
      this.$emit('close')
    },
    openAssignDialog() {
      this.assignDialog = true
    },
    changeDate(value) {
      // Change Date
      // Update Order Device Expiry

      this.expiry.expiry_date = value
      this.expiry.id = this.orderInfo.id
    },
    setOrderSuspendDate(value) {
      this.order_suspend_till = value
    },
    updateExpiry() {
      if (this.expiry && this.expiry.expiry_date && this.expiry.id) {
        this.expiryLoading = true
        this.$store.dispatch('order/updateOrderExpiry', this.expiry).then(() => {
          this.loadOrder()
        }).finally(() => {
          this.expiryLoading = false
        })
      }
    },
    suspendOrder() {
      this.suspendLoading = true

      const payload = {
        order_id: this.order.id,
        suspeded_till: this.order_suspend_till
      }

      this.$store.dispatch('order/suspendOrder', payload).then(() => {
        this.loadOrder()
      }).finally(() => {
        this.suspendLoading = false
      })
    },
    edit(item) {
      this.itemInfo = { ...item }
      this.cameraDialog = true
      // this.closeCustomer()
    },
    suspend(item) {
      this.itemInfo = { ...item }
      this.suspendDialog = true
    },
    replace(item) {
      this.itemInfo = { ...item }
      this.replaceDialog = true
      // this.closeCustomer()
    },
    isGPSAvailable(item) {
      if (item.GPS && item.GPS.latitude && item.GPS.longitude) {
        return true
      }

      return false
    },
    viewLocation(item) {
      this.itemInfo = { ...item }
      this.viewDialog = true
    }
  }
}
</script>