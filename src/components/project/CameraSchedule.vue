<template>
  <v-dialog v-model="model" persistent max-width="650">
    <v-card>
      <v-card-text>
        <div class="pt-2 pb-2 d-flex justify-space-between align-center">
          <h2 class="black--text text-capitalize">Set {{ level.toLowerCase() }} Schedule</h2>
          <v-icon @click="close()">mdi-close</v-icon>
        </div>
        <v-divider></v-divider>
        <div class="mt-3">
          <strong v-if="level === 'PROJECT'" class="black-text">This schedule will be applied to all the locations and positions for this project.</strong>

          <strong v-if="level === 'LOCATION'" class="black-text">This schedule will be applied to this location and positions for this location.</strong>

          <strong v-if="level === 'CAMERA'" class="black-text">This schedule will be applied to this position.</strong>

          <template v-if="isLoading">
            <div class="text-center mt-4">
              <v-progress-circular :value="100" indeterminate color="primary"></v-progress-circular>
              <h4>Loading Project Schedules...</h4>
            </div>
          </template>
          <template v-if="!isLoading">
            <v-row no-gutters class="mt-3">
              <v-col cols="4">
                <h4 class="black--text mb-2">Set Days</h4>
              </v-col>
              <v-col cols="3" class="px-2">
                <h4 class="black--text mb-2">Set Times</h4>
              </v-col>
              <v-col cols="3">
                <h4 class="black--text mb-2">Image Profiles</h4>
              </v-col>
            </v-row>

            <v-row
              v-for="(item, index) in schedule"
              :key="index+'sch'"
              no-gutters
            >
              <v-col cols="4">
                <v-select
                  v-model="item.day"
                  label="Select Schedule"
                  dense
                  :items="dayItems"
                  item-text="name"
                  item-value="key"
                ></v-select>
              </v-col>
              <v-col cols="3" class="px-2">
                
                <v-select
                  v-model="item.time"
                  label="Select Time"
                  dense
                  :items="timesList"
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="item.image_settings"
                  label="Select Profile"
                  dense
                  :items="profileList"
                  item-text="name"
                  item-value="id"
                ></v-select>
              </v-col>
              <v-col cols="2" class="text-center pt-2">
                
                <v-icon v-if="index === schedule.length - 1" color="primary" @click="addSchedule">mdi-plus</v-icon>
                <v-icon color="red darken-3" @click="removeSchedule(index)">mdi-delete</v-icon>
              </v-col>
            </v-row>

            <div class="mt-5">
              <v-btn depressed color="primary" :loading="scheduleLoading" @click="saveSchedule">Save</v-btn>
              <v-btn
                depressed
                class="ml-1"
                color="grey lighten-2"
                :disabled="scheduleLoading"
                @click="close"
              >Cancel</v-btn>
            </div>
          </template>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'CameraSchedule',
  props: {
    model: {
      type: Boolean,
      default: false
    },
    level: {
      type: String,
      required: true
    },
    target: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isLoading: false,
      scheduleLoading: false,
      profileList: [],
      scheduleInfo: null,
      schedule: [
        {
          day: null,
          time: null,
          image_settings: null
        }
      ],
      dayItems: [
        {
          schedules: [],
          id: 1,
          key: 'all_seven_days',
          name: 'All Days'
        },
        {
          schedules: [],
          id: 2,
          key: 'monday_to_friday',
          name: 'Monday - Friday'
        },
        {
          schedules: [],
          id: 3,
          key: 'monday',
          name: 'Monday'
        },
        {
          schedules: [],
          id: 4,
          key: 'tuesday',
          name: 'Tuesaday'
        },
        {
          schedules: [],
          id: 5,
          key: 'wednesday',
          name: 'Wednesday'
        },
        {
          schedules: [],
          id: 6,
          key: 'thursday',
          name: 'Thursday'
        },
        {
          schedules: [],
          id: 7,
          key: 'friday',
          name: 'Friday'
        },
        {
          schedules: [],
          id: 8,
          key: 'saturday',
          name: 'Saturday'
        },
        {
          schedules: [],
          id: 9,
          key: 'sunday',
          name: 'Sunday'
        }
      ],
      timesList: [
        '12:00 AM',
        '12:30 AM',
        '1:00 AM',
        '1:30 AM',
        '2:00 AM',
        '2:30 AM',
        '3:00 AM',
        '3:30 AM',
        '4:00 AM',
        '4:30 AM',
        '5:00 AM',
        '5:30 AM',
        '6:00 AM',
        '6:30 AM',
        '7:00 AM',
        '7:30 AM',
        '8:00 AM',
        '8:30 AM',
        '9:00 AM',
        '9:30 AM',
        '10:00 AM',
        '10:30 AM',
        '11:00 AM',
        '11:30 AM',
        '12:00 PM',
        '12:30 PM',
        '1:00 PM',
        '1:30 PM',
        '2:00 PM',
        '2:30 PM',
        '3:00 PM',
        '3:30 PM',
        '4:00 PM',
        '4:30 PM',
        '5:00 PM',
        '5:30 PM',
        '6:00 PM',
        '6:30 PM',
        '7:00 PM',
        '7:30 PM',
        '8:00 PM',
        '8:30 PM',
        '9:00 PM',
        '9:30 PM',
        '10:00 PM',
        '10:30 PM',
        '11:00 PM',
        '11:30 PM'
      ]
    }
  },
  mounted() {
    // Get Available image profiles
    this.loadImageProfiles()
    // Load Schedules
    this.loadProjectSchedule()
  },
  methods: {
    loadImageProfiles() {
      this.$store.dispatch('imageProfile/getImageProfiles', {
      }).then((resp) => {
        this.profileList = [...resp.image_settings]
      })
    },
    loadProjectSchedule() {
      this.isLoading = true
      this.$store.dispatch('scheduleProfile/getSchedulesByLevelAndTarget', {
        level: this.level,
        target: this.target
      }).then((resp) => {
        this.scheduleInfo = { ...resp }
        this.setScheduleData(resp)
      }).finally(() => {
        this.isLoading = false
      })
    },
    setScheduleData(data) {
      console.log(data)
      this.schedule = []
      const scheduleItems = []

      for (const key in data) {
        if (typeof data[key] === 'object') {
          if (data[key].length > 0) {
            const daySchedules = data[key].map((item) => item)

            daySchedules.forEach((item) => {
              const obj = {
                ...item,
                time: this.convertTime(item.time),
                day: key
              }

              this.schedule.push(obj)
            })
          }
        }
      }

      if (this.schedule.length < 1) {
        this.addSchedule()
      }

      console.log(this.schedule)
    },
    addSchedule() {
      this.schedule.push({
        day: null,
        time: null,
        image_settings: null
      })
    },
    removeSchedule(index) {
      this.schedule.splice(index, 1)
    },
    saveSchedule() {
      const schedules = []
      const daySchedules = {}

      const payload = {
        name: this.scheduleInfo.name,
        level: this.level,
        target: this.target
      }

      if (this.level === 'PROJECT' && !this.schedule.length) {
        this.scheduleLoading = true
        this.$store.dispatch('scheduleProfile/deleteSchedulesByLevelAndTarget', payload).then((resp) => {
          this.close()
        }).finally(() => {
          this.scheduleLoading = false
        })

        return
      }

      // Check if there is any empty time, day, or profile
      const isEmpty = this.schedule.some((item) => !item.day || !item.time || !item.image_settings)
      
      if (isEmpty) {
        this.$store.commit(
          'setToast',
          {
            message: 'Please select Day, Time and Profile for all schedules.',
            color: 'red',
            show: true
          },
          { root: true }
        )

        return
      }

      for (let day = 0; day < this.dayItems.length - 1; day++) {
        const dayName = this.dayItems[day].key

        const schedules = this.schedule.filter((item) => item.day === dayName)

        daySchedules[dayName] = [...schedules]
        
        this.dayItems[day].schedules = [...schedules].map((item) => {
          return { time: this.formatTime(item.time), image_settings: item.image_settings }
        })

        // const isDuplicateProfile = this.filterCameraProfiles(this.dayItems[day])
        // const isDuplicateTime = this.filterTime(this.dayItems[day])
      }

      this.dayItems.forEach((item) => {
        payload[item.key] = [...item.schedules]
      })

      this.scheduleLoading = true
      this.$store.dispatch('scheduleProfile/setSchedulesByLevelAndTarget', payload).then((resp) => {
        this.close()
      }).finally(() => {
        this.scheduleLoading = false
      })

    },
    filterTime(day) {
      const daySchedules = [...day.schedules]

      const allTimes = daySchedules.map((item) => item.time)
      const uniqueTimes = [...new Set(allTimes)]

      if (uniqueTimes.length < allTimes.length) {
        this.$store.commit(
          'setToast',
          {
            message: 'Same time can\'t be selected again on same day',
            color: 'red',
            show: true
          },
          { root: true }
        )

        return true
      }

      return false
    },
    filterCameraProfiles(day) {
      const daySchedules = [...day.schedules]

      const allProfiles = daySchedules.map((item) => item.image_settings)
      const uniqueProfiles = [...new Set(allProfiles)]

      console.log(allProfiles, uniqueProfiles)
      console.log(allProfiles.length, uniqueProfiles.length)

      if (uniqueProfiles.length < allProfiles.length) {
        this.$store.commit(
          'setToast',
          {
            message: 'Same image profile can\'t be selected again on same day',
            color: 'red',
            show: true
          },
          { root: true }
        )

        return true
      }

      return false
    },
    convertTime(time) {
      const hours = time.split(':')

      if (hours[0] === '00') {
        return '12:' + hours[1] + ' AM'
      }

      else if (hours[0] === '12') {
        return '12:' + hours[1] + ' PM'
      }
      
      else if (Number(hours[0]) > 12) {
        return hours[0] - 12 + ':' + hours[1] + ' PM'
      }

      return time + ' AM'
    },
    formatTime(time) {
      // eslint-disable-next-line prefer-destructuring
      const hrs = time.split(':')[0]
      // eslint-disable-next-line prefer-destructuring
      const mins = time.split(':')[1].split(' ')[0]
      // eslint-disable-next-line prefer-destructuring
      const format = time.split(':')[1].split(' ')[1]

      if (format === 'AM' && hrs === '12') {
        return '00:' + mins
      }

      else if (format === 'PM' && hrs === '12') {
        return '12:' + mins
      }

      else if (format === 'PM' && hrs !== '12') {
        return (Number(hrs) + 12) + ':' + mins
      } else {
        return hrs + ':' + mins
      }
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>