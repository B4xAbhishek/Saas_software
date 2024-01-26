<template>
  <div class="d-flex flex-column flex-grow-1">
    <template v-if="!add">
      <div class="d-flex align-center py-3">
        <!-- <div>
        <div class="display-1">Schedules</div>
      </div> -->
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="add = true"> Add Schedule</v-btn>
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
              placeholder="e.g. filter for schedules"
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
            :items="schedules"
            item-key="id"
            :search="searchQuery"
            :loading="isLoading"
            class="flex-grow-1 cursor-pointer"
          >
            <template v-slot:[`item.assignments`]="{ }">
              <span class="text-underline primary--text px-0">view</span>
            </template>
          </v-data-table>
        </template>
      </v-card>
    </template>

    <template v-if="add">
      <AddSchedule @back="add = false" />
    </template>
  </div>
</template>
  
<script>
import { mapState } from 'vuex'
import AddSchedule from './AddSchedule'
  
export default {
  components: {
    AddSchedule
  },
  data() {
    return {
      isLoading: false,
      add: false,
      searchQuery: '',
      addModal: false,
      selectedPlans: [],
      headers: [
        { text: 'Schedule Name', value: 'name' },
        { text: 'Date Created', value: 'date' },
        { text: 'Assignments', value: 'assignments' }
      ],
      schedules: [
        { id: 1, name: 'XYZ', date: '11/02/22', assignments: '' },
        { id: 2, name: 'ABC', date: '12/02/22', assignments: '' }
      ]
    }
  },
  computed: {
    ...mapState({
      deviceModels: (store) => store.firmware.device_models
    })
  },
  created() {
    // this.loadDeviceModels()
  },
  methods: {
    searchUser() {},
    open() {},
    goToDevice(item) {
      localStorage.setItem('model', item.name)
      this.$router.push(`/device-admin/details/${item.name}`)
    },
    refresh() {
      this.addModal = false
      // this.loadDeviceModels()
    },
    async loadDeviceModels() {
      this.$store.dispatch('firmware/getDeviceModels').then(() => {
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    }
  }
}
</script>
