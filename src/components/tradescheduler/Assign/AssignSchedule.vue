<template>
  <div>
    <v-dialog v-model="scheduleModal" persistent max-width="600">
      <v-card>
        <v-card-text>
          <div class="d-flex justify-space-between align-center pt-2 pb-2">
            <div>
              <h2 class="black--text">{{ add ? 'Assign a' : 'Edit' }} Schedule</h2>
            </div>
            <v-icon @click="close">mdi-close</v-icon>
          </div>
          <v-divider></v-divider>
  
          <v-form ref="form" lazy-validation @submit.prevent>
            <v-row>
              <v-col cols="12" md="10" lg="8">
                <v-autocomplete
                  label="Project"
                  :items="['Project 1', 'Project 2']"
                  :rules="[v => !!v || 'Project is Required']"
                  small-chips
                  deletable-chips
                  multiple
                ></v-autocomplete>
                <v-autocomplete
                  label="Location"
                  :items="['Location 1', 'Location 2']"
                  :rules="[v => !!v || 'Location is Required']"
                  small-chips
                  deletable-chips
                  multiple
                ></v-autocomplete>
                <v-autocomplete
                  label="Schedule"
                  :items="['Schedule 1', 'Schedule 2']"
                  :rules="[v => !!v || 'Schedule is Required']"
                ></v-autocomplete>
                <v-text-field
                  label="Start Date"
                  :rules="[v => !!v || 'Start Date is Required']"
                  type="date"
                ></v-text-field>
  
                <div class="mt-1">
                  <v-btn type="submit" color="primary" class="mr-1">Save</v-btn>
                  <v-btn color="grey lighten-2" @click="close">Cancel</v-btn>
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    scheduleModal: {
      type: Boolean,
      default: false
    },
    add: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>