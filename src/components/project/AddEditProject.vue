<template>
  <v-dialog v-model="open" persistent max-width="550">
    <v-form ref="form" lazy-validation @submit.prevent="report">
      <v-card>
        <v-card-text>
          <div class="d-flex justify-space-between pb-2">
            <h2 class="black--text">Project Details</h2>
            <v-icon @click="$emit('close')">mdi-close</v-icon>
          </div>
          <v-divider></v-divider>

          <template v-if="loading && edit">
            <div class="text-center mt-4">
              <v-progress-circular :value="100" indeterminate color="primary"></v-progress-circular>
              <h4>Loading Project...</h4>
            </div>
          </template>
          
          <v-form ref="form" lazy-validation @submit.prevent="save">
            <v-row justify="center" no-gutters>
              <v-col cols="12">
                <v-card flat>
                  <v-card-text>
                    <v-text-field
                      v-model="project.name"
                      label="Project Name"
                      placeholder="Enter Project Name"
                      :rules="[(v) => !!v || 'Name is Required']"
                    ></v-text-field>
                    <v-text-field
                      v-model="project.address.street"
                      label="Address"
                      placeholder="Enter Address"
                      :rules="[(v) => !!v || 'Address 1 is Required']"
                    ></v-text-field>
                    <v-row no-gutters>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="project.address.city"
                          label="City"
                          placeholder="Enter City"
                          :rules="[(v) => !!v || 'City is Required']"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4" class="px-md-2">
                        <v-autocomplete
                          v-model="project.address.state"
                          :items="states"
                          item-text="name"
                          item-value="value"
                          label="State"
                          placeholder="Select State"
                          :rules="[(v) => !!v || 'State is Required']"
                        ></v-autocomplete>
                      </v-col>

                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="project.address.zip"
                          label="Zip"
                          type="number"
                          placeholder="Enter Zip"
                          :rules="[(v) => !!v || 'Zip is Required']"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <h3 class="black--text mb-2">Project Status</h3>

                    <v-select
                      v-model="project.status"
                      :items="[{ name: 'Active', value: 'active'}, {name: 'Finished', value: 'finished'}, { name: 'Cancelled', value: 'cancelled'}]"
                      item-text="name"
                      item-value="value"
                      label="Status"
                      placeholder="Select Status"
                    ></v-select>

                    <h3 class="black--text mb-2">Notes</h3>

                    <v-textarea
                      v-model="project.notes"
                      label="Notes"
                      placeholder="Enter Notes"
                      rows="2"
                    ></v-textarea>
                  </v-card-text>
                </v-card>
                <div class="">
                  <v-btn
                    color="primary"
                    type="submit"
                    :loading="isLoading"
                  >
                    Save
                  </v-btn>
                  <v-btn
                    color="gray"
                    class="ml-2"
                    to="/projects"
                    :disabled="isLoading"
                  >
                    Cancel
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-form>
  </v-dialog>
</template>
  
<script>
import states from '@/configs/states.json'
export default {
  name: 'ReportProblem',
  props: {
    open: {
      type: Boolean,
      default: false
    },
    edit: {
      type: Boolean,
      default: false
    },
    projectInfo: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      isLoading: false,
      states,
      project: {
        name: null,
        address: {
          street: null,
          city: null,
          state: null,
          zip: null
        },
        status: 'active',
        notes: null
      }
    }
  },
  created() {
    if (this.projectInfo && this.edit) {
      this.loadProject()
    }
  },
  methods: {
    loadProject() {
      this.loading = true

      this.$store.dispatch('project/getProject', this.projectInfo.id).then((resp) => {
        this.project = { ...resp }
      }).finally(() => {
        this.loading = false
      })
    },
    save() {
      if (this.$refs.form.validate()) {
        if (this.edit) {
          this.editProject()
        } else {
          this.createProject()
        } 
      }
    },

    createProject() {
      this.isLoading = true
      this.$store
        .dispatch('project/createProject', this.project)
        .then(() => {
          this.isLoading = false
          this.$emit('refresh')
        })
        .catch(() => {
          this.isLoading = false
        })
    },

    editProject() {
      let name = ''

      if (this.$route.params.name) {
        name = this.$route.params.name.replaceAll('%20', ' ')
      } else {
        name = this.project.name
      }

      this.project.old_name = name
      
      this.isLoading = true
      this.$store
        .dispatch('project/updateProject', this.project)
        .then(() => {
          this.isLoading = false
          this.$emit('refresh', {
            ...this.project
          })
        })
        .catch(() => {
          this.isLoading = false
        })
    }
  }
}
</script>