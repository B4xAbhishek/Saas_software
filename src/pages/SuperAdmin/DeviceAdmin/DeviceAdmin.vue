<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Device Admin</div>
        <bread-crumbs :items="breadcrumbs"></bread-crumbs>
      </div>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="addModal = true"> Add Device Model </v-btn>
    </div>

    <v-card>
      <!-- users list -->
      <v-row dense class="pa-2 align-center">
        <v-col cols="6" offset="6" class="d-flex text-right align-center">
          <v-text-field
            v-model="searchQuery"
            append-icon="mdi-magnify"
            class="flex-grow-1 mr-md-2"
            solo
            hide-details
            dense
            clearable
            placeholder="e.g. filter for device models"
          ></v-text-field>
          <v-btn
            :loading="isLoading"
            icon
            small
            class="ml-2"
            @click="refresh"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <template>
        <v-data-table
          v-model="selectedPlans"
          :headers="headers"
          :items="deviceModels"
          item-key="name"
          :search="searchQuery"
          :loading="isLoading"
          class="flex-grow-1 cursor-pointer"
          @click:row="goToDevice"
        >
          <template v-slot:[`item.price`]="{ item }">
            ${{ item.price || 0 }}
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <div class="actions">
              <v-btn text color="primary" @click.stop="goToDevice(item)"> Edit </v-btn>
            </div>
          </template>
        </v-data-table>
      </template>
    </v-card>

    <v-dialog v-model="addModal" max-width="600">
      <AddEditModel v-if="addModal" @close="addModal = false" @added="refresh" />
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AddEditModel from './AddEditModel'

export default {
  components: {
    AddEditModel
  },
  data() {
    return {
      isLoading: false,
      searchQuery: '',
      addModal: false,
      selectedPlans: [],
      headers: [
        { text: 'Device Name', value: 'name' },
        { text: 'Version', value: 'hardware_version' },
        { text: 'FW Version', value: 'firmware_version' },
        { text: 'Action', sortable: false, value: 'action' }
      ],
      breadcrumbs: [
        {
          text: 'Device Admin',
          disabled: true,
          to: '/device-admin'
        },
        {
          text: 'Device Models',
          disabled: true
        }
      ]
    }
  },
  computed: {
    ...mapState({
      deviceModels: (store) => store.firmware.device_models
    })
  },
  created() {
    this.loadDeviceModels()
  },
  methods: {
    searchUser() {},
    open() {},
    goToDevice(item) {
      localStorage.setItem('model', JSON.stringify(item))
      this.$router.push(`/device-admin/details/${item.id}`)
    },
    refresh() {
      this.addModal = false
      this.loadDeviceModels()
    },
    async loadDeviceModels() {
      this.isLoading = true
      this.$store.dispatch('firmware/getDeviceModels').then(() => {
      }).finally(() => {
        this.isLoading = false
      })
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
