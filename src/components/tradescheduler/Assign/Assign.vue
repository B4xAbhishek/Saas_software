<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center">
      <div class="mt-3">
        <div class="d-flex flex-wrap align-center mb-3">
          <div class="d-flex align-center">
            <strong class="primary--text cursor-pointer">Locations: </strong>
            <strong class="ml-2">200</strong>
          </div>
          <div class="d-flex align-center mx-2">
            <strong class="primary--text cursor-pointer">Assigned: </strong>
            <strong class="ml-2">100</strong>
          </div>
          <div class="d-flex align-center mx-2">
            <strong class="primary--text cursor-pointer">Unassigned: </strong>
            <strong class="ml-2">100</strong>
          </div>
        </div>
      </div>
      
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="addNew"> Assign Schedule</v-btn>
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
            placeholder="e.g. filter for contact managers"
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
          :items="assigns"
          item-key="id"
          :search="searchQuery"
          :loading="isLoading"
          class="flex-grow-1 cursor-pointer"
          @click:row="edit"
        >
        </v-data-table>
      </template>
    </v-card>

    <AssignSchedule v-if="scheduleModal" :add="add" :schedule-modal="scheduleModal" @close="scheduleModal = false" />
  </div>
</template>
    
<script>
import { mapState } from 'vuex'
import AssignSchedule from './AssignSchedule'
// import AddEditModel from './AddEditModel'
    
export default {
  components: {
    AssignSchedule
  },
  data() {
    return {
      isLoading: false,
      add: false,
      searchQuery: '',
      scheduleModal: false,
      selectedPlans: [],
      headers: [
        { text: 'Project', value: 'project' },
        { text: 'Location', value: 'location' },
        { text: 'Schedule', value: 'schedule' },
        { text: 'Start Date', value: 'start_date' },
        { text: 'Stage', value: 'stage' },
        { text: 'Progress', value: 'progress' }
      ],
      assigns: [
        { id: 1, project: 'Aspire', location: 'LOT 23', schedule: 'XYZ', start_date: '01/01/23', stage: 'Exavation', progress: '80%' },
        { id: 2, project: 'Hamptons', location: 'LOT 25', schedule: 'NONE', start_date: '02/01/23', stage: 'Not Started', progress: '50%' }
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
    edit(item) {
      this.add = false
      this.scheduleModal = true
    },
    addNew() {
      this.add = true
      this.scheduleModal = true
    },
    refresh() {
      this.scheduleModal = false
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
