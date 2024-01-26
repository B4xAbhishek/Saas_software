<template>
  <div>
    <div class="display-1 my-3">Test</div>
    
    <v-card>
      <v-card-text>
        <v-form ref="form" lazy-validation @submit.prevent="submit">
          <v-row v-for="(test, index) in tests" :key="index" no-gutters>
            <v-col cols="12" sm="6" md="3" lg="3">
              <v-autocomplete
                v-model="test.trade"
                label="Trade"
                class="px-1"
                :items="['Excavation', 'Fottings & Foundations', 'Farming', 'Windows', 'HVAC-Plumbing-Electrical', 'Insulation', 'Drywall', 'Exterior work', 'Inspection']"
                :rules="[v => !!v || 'Trade is Required']"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" md="3" lg="3">
              <!-- Mobile Validation will be added later -->
              <v-text-field
                v-model="test.mobile"
                label="Mobile"
                class="px-1"
                :rules="[v => !!v || 'Mobile is Required']"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3" lg="3">
              <v-autocomplete
                v-model="test.project"
                :items="projectItems"
                class="px-1"
                item-text="name"
                item-value="id"
                label="Project"
                :rules="[v => !!v || 'Project is required.']"
                @change="getProjectLocations(index)"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" sm="6" md="3" lg="3">
              <v-combobox
                v-model="test.location"
                :items="test.locations"
                class="px-1"
                item-text="name"
                item-value="name"
                label="Location"
                :rules="[v => !!v || 'Location is required.']"
              >
              </v-combobox>
            </v-col>

            <v-col v-if="index === tests.length - 1" cols="12" class="text-right">
              <v-btn color="primary" fab @click="addNewTest">
                <v-icon size="28">mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-btn color="primary" :loading="loading" type="submit">Send Test</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
    //   locations: [],
      loading: false,
      projectItems: [],
      tests: [
        {
          locations: [],
          project: null,
          location: null,
          trade: null,
          mobile: null
        }
      ]
    //   test: {
    //     project: null,
    //     location: null
    //   }
    }
  },
  computed: {
    ...mapState({
      projects: (store) => store.project.projects,
      locations: (store) => store.project.projectLocations
    }),
    projectList() {
      return this.projectItems ? this.projectItems.projects : []
    },
    locationList() {
      return this.locations && this.locations.locations
        ? this.locations.locations
        : []
    },
    pagination() {
      return this.projectItems && this.projectItems.pagination
    }
  },

  created() {
    this.getProjects()
  },

  methods: {
    addNewTest() {
      this.tests.push({
        trade: null,
        mobile: null,
        project: null,
        location: null,
        locations: []
      })
    },
    getProjects() {
      this.$store.dispatch('project/getProjects', { page: 1, size: 100000 }).then((resp) => {
        this.projectItems = [...resp.projects]
      })
    },

    async getProjectLocations(index) {
      this.tests[index].locations = []

      await this.$store.dispatch('project/getProjectLocations', { id: this.tests[index].project, perPage: 100000 }).then((resp) => {
        if (resp.locations && resp.locations.length) {
          // const locs = resp.locations.map((loc) => {
          //   const locLables = loc.labels.map((label) => {
          //     return { name: label.label_name, device_sn: label.device_sn }
          //   })

          //   return { name: loc.location_name, desc: loc.desc, labels: locLables }
          // })

          this.tests[index].locations = [...resp.locations]
        }
          
      })
    },

    async submit() {
      if (this.$refs.form.validate()) {
        if (this.tests && this.tests.length) {

          let total = this.tests.length
          const errors = []

          for (let index = 0; index < this.tests.length; index++) {
            const payload = {
              ...this.tests[index],
              location: this.tests[index].location.name
            }

            this.loading = true
            // eslint-disable-next-line no-await-in-loop
            await this.$store
              .dispatch('schedule/sendSMS', payload)
              .catch(() => {
                errors.push(this.tests[index])
              })
              .finally(() => {
                this.loading = false
              })

            total = total - 1
          }
        }
      }
    }
  }
}
</script>