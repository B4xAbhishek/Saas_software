<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Administration</div>
        <bread-crumbs :items="breadcrumbs"></bread-crumbs>
      </div>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="addScheduleModal = true">
        Add Schedule
      </v-btn>
    </div>

    <DeviceList
      :device-list="deviceList"
      :pagination-obj="pagination"
      :is-loading="isLoading"
      :admin="true"
      @refresh="loadDevices"
      @paginate="paginateDevices"
    />

    <v-dialog v-model="addScheduleModal" persistent max-width="600">
      <v-card>
        <v-card-text>
          <div class="py-2 d-flex justify-space-between">
            <h2>Schedule Profile</h2>
            <v-icon @click="addScheduleModal = false">mdi-close</v-icon>
          </div>
          <v-divider></v-divider>

          <v-text-field
            label="Schedule Profile Name"
            placeholder="Schedule Profile Name"
          ></v-text-field>

          <v-tabs
            v-model="tab"
            color="primary"
          >
            <v-tab
              v-for="day in days"
              :key="day.id"
            >
              {{ day.name }}
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item
              v-for="(day, index) in days"
              :key="day.id"
              class="pb-3"
            >
              <v-btn small color="primary" class="mt-3 ml-1" @click="addSchedule(day.id, index)">Add Schedule</v-btn>

              <v-card
                v-for="(schedule, sIndex) in day.schedules"
                :key="sIndex+'schedule'"
                class="mt-3 mx-1"
              >
                <v-card-text>
                  <v-row no-gutters>
                    <v-col cols="10">
                      <v-select
                        v-model="schedule.setting"
                        label="Camera Settings"
                        :items="['Default']"
                        placeholder="Select Camera Settings"
                      ></v-select>
                      <v-btn small color="primary" outlined @click="addTime(index, sIndex)">Add</v-btn>

                      <br>

                      <v-chip
                        v-for="(sTime, tIndex) in schedule.times"
                        :key="tIndex+'time'"
                        close
                        small
                        class="mr-1 mt-2"
                        outlined
                        color="primary"
                        @click:close="removeTime(index, sIndex, tIndex)"
                      >
                        <span class="primary--text">{{ sTime }}</span>
                      </v-chip>
                    </v-col>
                    <v-col cols="2" class="text-right">
                      <v-icon color="red" @click="deleteSchedule(index, sIndex)">mdi-delete</v-icon>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
          <div class="text-right">
            <v-btn color="primary" text @click="closeScheduleModal">Save</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="timeModal" persistent max-width="400">
      <v-card>
        <v-card-text>
          <div class="py-2 d-flex justify-space-between">
            <h2>Set Time</h2>
            <v-icon @click="closeTimeModal">mdi-close</v-icon>
          </div>
          <v-divider></v-divider>

          <v-text-field
            v-model="time"
            label="Set Time"
            type="time"
          ></v-text-field>

          <div class="text-right">
            <v-btn color="primary" text :disabled="!time" @click="setTime">Set Time</v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import DeviceList from '@/components/device/DeviceList'
import { mapState } from 'vuex'

export default {
  components: {
    DeviceList
  },
  data() {
    return {
      isLoading: false,
      addScheduleModal: false,
      tab: 0,
      selectedDaySchedule: {},
      timeModal: false,
      time: null,
      days: [
        {
          id: 1,
          name: 'Mon',
          schedules: []
        },
        {
          id: 2,
          name: 'Tue',
          schedules: []
        },
        {
          id: 3,
          name: 'Wed',
          schedules: []
        },
        {
          id: 4,
          name: 'Thu',
          schedules: []
        },
        {
          id: 5,
          name: 'Fri',
          schedules: []
        },
        {
          id: 6,
          name: 'Sat',
          schedules: []
        },
        {
          id: 7,
          name: 'Sun',
          schedules: []
        }
      ],
      breadcrumbs: [{
        text: 'Administrator',
        disabled: true,
        to: '/admin/cameras'
      }, {
        text: 'Cameras',
        disabled: true,
        to: '/admin/cameras'
      }, {
        text: 'List',
        disabled: true
      }]
    }
  },
  computed: {
    ...mapState({
      devices: (store) => store.device.devices
    }),
    deviceList() {
      return this.devices ? this.devices.cameras : []
    },
    pagination() {
      return this.devices && this.devices.pagination
    }
  },
  watch: {
    selectedDevices(val) {

    }
  },
  created() {
    this.loadDevices()
  },
  methods: {
    searchUser() {},
    defaultDays() {
      return [
        {
          id: 1,
          name: 'Mon',
          schedules: []
        },
        {
          id: 2,
          name: 'Tue',
          schedules: []
        },
        {
          id: 3,
          name: 'Wed',
          schedules: []
        },
        {
          id: 4,
          name: 'Thu',
          schedules: []
        },
        {
          id: 5,
          name: 'Fri',
          schedules: []
        },
        {
          id: 6,
          name: 'Sat',
          schedules: []
        },
        {
          id: 7,
          name: 'Sun',
          schedules: []
        }
      ]
    },
    addSchedule(id, index) {
      const schedule = {
        setting: '',
        times: []
      }

      this.days[index].schedules.push(schedule)
    },
    deleteSchedule(dIndex, sIndex) {
      this.days[dIndex].schedules.splice(sIndex, 1)
    },
    addTime(dIndex, sIndex) {
      this.selectedDaySchedule = {
        dIndex,
        sIndex
      }
      this.time = null
      this.timeModal = true
    },
    closeTimeModal() {
      this.timeModal = false
      this.time = null
      this.selectedDaySchedule = null
    },
    setTime() {
      if (this.selectedDaySchedule) {
        this.days[this.selectedDaySchedule.dIndex].schedules[this.selectedDaySchedule.sIndex].times.push(this.time)

        this.closeTimeModal()
      }
    },
    removeTime(dIndex, sIndex, tIndex) {
      this.days[dIndex].schedules[sIndex].times.splice(tIndex, 1)
    },
    closeScheduleModal() {
      this.days = this.defaultDays()
      this.addScheduleModal = false
    },
    open() {},
    async loadDevices(payload = null) {
      this.isLoading = true
      await this.$store.dispatch('device/getDevices', payload)
      this.isLoading = false
    },
    paginateDevices(value) {
      this.loadDevices({ page: value })
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
