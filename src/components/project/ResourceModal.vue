<template>
  <v-dialog v-model="open" persistent max-width="650">
    <v-form ref="form" lazy-validation @submit.prevent="">
      <v-card class="time-logs">
        <v-card-text>
          <div class="d-flex justify-space-between pb-2">
            <h2 class="black--text">LOT 1 Onsite time logs</h2>
            <v-icon @click="$emit('close')">mdi-close</v-icon>
          </div>
          <v-divider></v-divider>

          <v-row class="ma-0 pa-0" align="center" justify="center">
            <v-col
              cols="12"
            >
              <div class="d-flex align-center justify-center">
                <v-icon @click="prevDay">mdi-chevron-left</v-icon>
                <div class="px-3" style="max-width: 230px;">
                  <v-menu
                    v-model="picker"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="date"
                        placeholder="Select Date"
                        prepend-inner-icon="mdi-calendar"
                        readonly
                        dense
                        hide-details
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="date"
                      @input="picker = false"
                    ></v-date-picker>
                  </v-menu>
                </div>
              
                <v-icon @click="nextDay">mdi-chevron-right</v-icon>
              </div>
            </v-col>
          </v-row>

          <div class="timeline-header">
            <v-row no-gutters align="center" class="pa-0 ma-0 mb-3">
              <v-col cols="4" class="">
                <strong class="black--text">Resource</strong>
              </v-col>
              <v-col cols="4" class="">
                <strong class="black--text">OnSite</strong>
              </v-col>
              <v-col cols="4" class="">
                <strong class="black--text">Last Onsite</strong>
              </v-col>
            </v-row>
          </div>

          <v-timeline
            dense
          >
            <v-timeline-item
              v-for="i in 3"
              :key="i"
              color="primary"
              small
            >
          
              <v-row no-gutters align="center" class="pa-0 ma-0">
                <v-col cols="4">
                  <strong>Joe Shmoe</strong><br/>
                  <span class="pa-0">XYZ Contracting</span>
                </v-col>
                <v-col cols="4" class="">
                  <strong>9:30 AM</strong>
                </v-col>
                <v-col cols="4" class="">
                  <span class="pa-0">2:00 PM</span>
                </v-col>
              </v-row>
            </v-timeline-item>
          </v-timeline>
        </v-card-text>
      </v-card>
    </v-form>
  </v-dialog>
</template>
  
<script>
export default {
  name: 'ResourceTime',
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isLoading: false,
      picker: false,
      date: null,
      step: 1
    }
  },
  created() {
  },
  methods: {
    nextDay() {
      if (this.date) {
        const current = new Date(this.date)
        const newDate = new Date(current.setDate(new Date(current).getDate() + 1)).toISOString()

        this.date = newDate.split('T')[0]
      }
      
    },
    prevDay() {
      if (this.date) {
        const current = new Date(this.date)
        const newDate = new Date(current.setDate(new Date(current).getDate() - 1)).toISOString()

        this.date = newDate.split('T')[0]
      }
      
    }
  }
}
</script>

<style scoped>
.time-logs {
    overflow: hidden;
}

.timeline-header {
    margin-left: 16% !important;
}
</style>