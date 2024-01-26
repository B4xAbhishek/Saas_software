<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Edit Schedule Profile</div>
        <bread-crumbs :items="breadcrumbs"></bread-crumbs>
      </div>
    </div>

    <template v-if="isLoading">
      <div class="text-center mt-4">
        <v-progress-circular
          :value="100"
          indeterminate
          color="primary"
        ></v-progress-circular>
        <h4>Loading Schedule Profile...</h4>
      </div>
    </template>
    <template v-else-if="!isLoading && !update_profile.id">
      <div class="text-center mt-4">
        <h4>Schedule Profile not found...</h4>
      </div>
    </template>
    <!-- <template v-else-if="!isLoading && update_profile.id && update_profile.active">
      <div class="text-center mt-4">
        <h4>Schedule Profile is already active. Please deactivate this profile to update...</h4>
      </div>
    </template> -->

    <v-form v-if="!isLoading && update_profile.id" ref="form" lazy-validation @submit.prevent="save">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-card>
            <v-card-text>
              <v-text-field
                v-model="update_profile.name"
                label="Profile Name"
                placeholder="Enter Profile Name"
                :rules="[(v) => !!v || 'Profile Name is Required']"
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
                  <v-btn
                    v-if="day.schedules.length < profileList.length"
                    small
                    color="primary"
                    class="mt-3 ml-1"
                    @click="addSchedule(day.id, index)"
                  >Add Schedule</v-btn>

                  <v-card
                    v-for="(schedule, sIndex) in day.schedules"
                    :key="sIndex+'schedule'"
                    class="mt-3 mx-1"
                  >
                    <v-card-text>
                      <v-row no-gutters>
                        <v-col cols="10">
                          <v-autocomplete
                            v-model="schedule.image_settings"
                            label="Camera Profile"
                            :items="cameraProfiles"
                            item-text="name"
                            item-value="id"
                            placeholder="Select Camera Profile"
                            @change="filterCameraProfiles($event, day, sIndex)"
                          ></v-autocomplete>
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
            </v-card-text>
          </v-card>

          <div class="mt-3">
            <v-btn color="primary" type="submit" :loading="editLoading">
              Save
            </v-btn>
            <v-btn
              color="gray"
              class="ml-2"
              :to="`/device-admin/details/${cameraModel.id}?tab=schedule-profile`"
              :disabled="editLoading"
            >
              Cancel
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>

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
import { mapState } from 'vuex'
export default {
  data() {
    return {
      cameraModel: null,
      isLoading: false,
      editLoading: false,
      cameraProfiles: [],
      update_profile: null,
      tab: 0,
      selectedDaySchedule: {},
      timeModal: false,
      time: null,
      days: [
        {
          id: 1,
          name: 'Mon',
          key: 'monday',
          schedules: []
        },
        {
          id: 2,
          name: 'Tue',
          key: 'tuesday',
          schedules: []
        },
        {
          id: 3,
          name: 'Wed',
          key: 'wednesday',
          schedules: []
        },
        {
          id: 4,
          name: 'Thu',
          key: 'thursday',
          schedules: []
        },
        {
          id: 5,
          name: 'Fri',
          key: 'friday',
          schedules: []
        },
        {
          id: 6,
          name: 'Sat',
          key: 'saturday',
          schedules: []
        },
        {
          id: 7,
          name: 'Sun',
          key: 'sunday',
          schedules: []
        },
        {
          id: 8,
          name: 'Mon-Fri',
          key: 'monday_to_friday',
          schedules: []
        },
        {
          id: 9,
          name: 'All Days',
          key: 'all_seven_days',
          schedules: []
        }
      ]
    }
  },
  computed: {
    ...mapState({
      profileList: (store) => store.imageProfile.image_profiles,
      allProfiles: (store) => store.scheduleProfile.schedule_profiles
    }),
    breadcrumbs() {
      return [
        {
          text: 'Schedule Profiles',
          disabled: false,
          to: `/device-admin/details/${this.cameraModel.id}?tab=schedule-profile`
        },
        {
          text: 'Edit Schedule Profile',
          disabled: true
        }
      ]
    }
  },
  async created() {
    const model = this.getSelectedModel()

    if (model) {
      this.cameraModel = { ...model }
    }

    await this.loadScheduleProfiles()
    this.loadImageProfiles()
  },
  methods: {
    async loadScheduleProfiles() {
      this.isLoading = true
      await this.$store.dispatch('scheduleProfile/getScheduleProfiles').then(async () => {
        await this.findProfile()
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    },
    async findProfile() {
      if (this.allProfiles && this.allProfiles.length) {
        const profile = this.allProfiles.find((p) => p.id === this.$route.params.id)

        if (profile) {
          this.update_profile = { ...profile }
          await this.setSchedules()
          console.log(this.update_profile)
        }
      }
    },
    async setSchedules() {
      const profile = JSON.parse(JSON.stringify(this.update_profile))

      this.days.forEach((day, index) => {
        const { key } = day
        const daySchedules = profile[key]

        if (daySchedules && daySchedules.length) {
          const allImageProfiles = daySchedules.map((ip) => ip.image_settings)

          const uniqueProfiles = [...new Set(allImageProfiles)]

          uniqueProfiles.forEach((profile) => {
            const sameProfileSchedules = daySchedules.filter((schedule) => schedule.image_settings === profile)

            const allTimes = sameProfileSchedules.map((st) => st.time)

            this.days[index].schedules.push({
              image_settings: profile,
              times: [...allTimes]
            })
          })
        }
      })
    },
    loadImageProfiles() {
      this.$store.dispatch('imageProfile/getImageProfiles').then(() => {
        this.cameraProfiles = JSON.parse(JSON.stringify(this.profileList))
      })
    },
    filterCameraProfiles(pId, day, sId) {
      const daySchedules = day.schedules

      const isProfileExists = daySchedules.filter((s) => s.image_settings === pId )

      if (isProfileExists && isProfileExists.length > 1) {
        this.days[day.id - 1].schedules[sId].image_settings = null
        this.$store.commit(
          'setToast',
          {
            message: 'Same camera profile can\'t be selceted again on same day',
            color: 'red',
            show: true
          },
          { root: true }
        )
      }
    },
    lessThanProfiles(id) {
      console.log(this.profileList.length)
      const day = this.days[id]

      if (day && day.schedules.length < this.profileList.length) {
        return true
      }
      
      return false
    },
    addSchedule(id, index) {
      const schedule = {
        image_settings: '',
        times: []
      }

      this.days[index].schedules.unshift(schedule)
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
    async setTime() {
      if (this.selectedDaySchedule) {
        const allDayScheduleTimes = this.days[this.selectedDaySchedule.dIndex].schedules.map((schedule) => schedule.times)

        const allTimes = allDayScheduleTimes.flat(Infinity)

        const isTimeAlreadyExists = await allTimes.find((t) => t === this.time)

        if (isTimeAlreadyExists) {
          this.time = null
          this.$store.commit(
            'setToast',
            {
              message: 'Same Time cannot be repeated in a day.',
              color: 'red',
              show: true
            },
            { root: true }
          )
        }
        else {
          this.days[this.selectedDaySchedule.dIndex].schedules[this.selectedDaySchedule.sIndex].times.push(this.time)
          this.closeTimeModal()
        }

        this.closeTimeModal()
      }
    },
    removeTime(dIndex, sIndex, tIndex) {
      this.days[dIndex].schedules[sIndex].times.splice(tIndex, 1)
    },
    async save() {
      if (this.$refs.form.validate()) {
        this.editLoading = true

        const daySchedules = this.days.filter((day) => day.schedules.length)

        if (daySchedules && daySchedules.length) {
          // Find any schedule where camera profile or time is not selected
          let isProfileAndTimeExists = true

          const allSchedules = daySchedules.map((ds) => ds.schedules)

          for (let item = 0; item < allSchedules.length; item++) {
            const isEmpty = allSchedules[item].find((sch) => !sch.image_settings || !sch.times.length)

            if (isEmpty) {
              isProfileAndTimeExists = false
              break
            }
          }

          if (isProfileAndTimeExists) {
            const payload = {
              id: this.update_profile.id,
              name: this.update_profile.name
            }

            this.days.forEach((day) => {
              const allScheduleTimes = day.schedules.filter((ds) => ds.times.length)

              if (allScheduleTimes && allScheduleTimes.length) {
                const scheduleList = []

                allScheduleTimes.forEach((sT) => {
                  sT.times.forEach((time) => {
                    scheduleList.push({
                      image_settings: sT.image_settings,
                      time: time
                    })
                  })
                })

                payload[day.key] = [...scheduleList]
              } else {
                payload[day.key] = []
              }
            })
            await this.$store
              .dispatch('scheduleProfile/updateScheduleProfile', payload)
              .then(() => {
                this.editLoading = false
                this.$router.push(`/device-admin/details/${this.cameraModel.id}?tab=schedule-profile`)
              })
              .catch(() => {
                this.editLoading = false
              })
          } else {
            this.$store.commit(
              'setToast',
              {
                message: 'Camera Profile and Time is required in all schedules.',
                color: 'red',
                show: true
              },
              { root: true }
            )
          }
        }

        this.editLoading = false
      }
    }
  }
}
</script>
