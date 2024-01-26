<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Administration</div>
        <bread-crumbs :items="breadcrumbs"></bread-crumbs>
      </div>
      <!-- <v-spacer></v-spacer>
      <v-btn to="/admin/projects/add" color="primary">
        New Project
      </v-btn> -->
    </div>

    <v-form ref="form" lazy-validation @submit.prevent="save">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-card>
            <v-card-title>Basic Information</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="project.name"
                label="Project Name"
                placeholder="Enter Project Name"
                :rules="[(v) => !!v || 'Name is Required']"
              ></v-text-field>
              <v-text-field
                v-model="project.add_1"
                label="Address"
                placeholder="Enter Address"
                :rules="[(v) => !!v || 'Address 1 is Required']"
              ></v-text-field>
              <v-text-field
                v-model="project.add_2"
                label="Address 2"
                placeholder="Enter Address 2"
              ></v-text-field>
              <v-text-field
                v-model="project.city"
                label="City"
                placeholder="Enter City"
                :rules="[(v) => !!v || 'City is Required']"
              ></v-text-field>
              <v-autocomplete
                v-model="project.state"
                :items="states"
                item-text="name"
                item-value="value"
                label="State"
                placeholder="Select State"
                :rules="[(v) => !!v || 'State is Required']"
              ></v-autocomplete>
              <v-text-field
                v-model="project.zip"
                label="Zip"
                type="number"
                placeholder="Enter Zip"
                :rules="[(v) => !!v || 'Zip is Required']"
              ></v-text-field>
            </v-card-text>
          </v-card>
          <v-card class="mt-3">
            <v-card-title>Additional Information</v-card-title>
            <v-card-text>
              <v-textarea
                v-model="project.notes"
                label="Notes"
                placeholder="Enter Notes"
                rows="2"
              ></v-textarea>
            </v-card-text>
          </v-card>

          <div class="mt-3">
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
              to="/admin/projects"
              :disabled="isLoading"
            >
              Cancel
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import states from '@/configs/states.json'
export default {
  data() {
    return {
      isLoading: false,
      states,
      project: {
        name: null,
        add_1: null,
        add_2: null,
        city: null,
        state: null,
        zip: null,
        notes: null
      },
      breadcrumbs: [
        {
          text: 'Administrator',
          disabled: false,
          to: '/admin/projects'
        },
        {
          text: 'Projects',
          disabled: false,
          to: '/admin/projects'
        },
        {
          text: 'Add Project',
          disabled: true
        }
      ]
    }
  },
  watch: {
    selectedProjects(val) {}
  },
  methods: {
    save() {
      if (this.$refs.form.validate()) {
        this.isLoading = true
        this.$store
          .dispatch('project/createProject', this.project)
          .then(() => {
            this.isLoading = false
            this.$router.push('/admin/projects')
          })
          .catch(() => {
            this.isLoading = false
          })
      }
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
