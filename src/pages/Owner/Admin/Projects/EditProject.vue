<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Administration</div>
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
        <h4>Loading Project...</h4>
      </div>
    </template>
    <template v-if="!isLoading && !project">
      <div class="text-center mt-4">
        <h4>Project not found against {{ this.$route.params.name.replaceAll('%20', ' ') }}</h4>
      </div>
    </template>

    <v-form v-if="!isLoading && project" ref="form" lazy-validation @submit.prevent="save">
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
                v-model="project.address.street"
                label="Address"
                placeholder="Enter Address"
                :rules="[(v) => !!v || 'Address is Required']"
              ></v-text-field>
              <v-text-field
                v-model="project.address.city"
                label="City"
                placeholder="Enter City"
                :rules="[(v) => !!v || 'City is Required']"
              ></v-text-field>
              <v-autocomplete
                v-model="project.address.state"
                :items="states"
                item-text="name"
                item-value="value"
                label="State"
                placeholder="Select State"
                :rules="[(v) => !!v || 'State is Required']"
              ></v-autocomplete>
              <v-text-field
                v-model="project.address.zip"
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
              <v-select
                v-model="project.status"
                :items="[{ name: 'Active', value: 'active'}, {name: 'Finished', value: 'finished'}, { name: 'Cancelled', value: 'cancelled'}]"
                item-text="name"
                item-value="value"
                label="Status"
                placeholder="Select Status"
              ></v-select>
              <v-textarea
                v-model="project.notes"
                label="Notes"
                placeholder="Enter Notes"
                rows="2"
              ></v-textarea>
            </v-card-text>
          </v-card>

          <div class="mt-3">
            <v-btn color="primary" type="submit" :loading="editLoading">Save</v-btn>
            <v-btn color="gray" class="ml-2" :disabled="editLoading" to="/admin/projects">Cancel</v-btn>
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
      editLoading: false,
      states,
      project: null,
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
          text: 'Edit Project',
          disabled: true
        }
      ]
    }
  },
  created() {
    this.loadProject()
  },
  methods: {
    loadProject() {
      const { id } = this.$route.params
      
      this.isLoading = true

      this.$store.dispatch('project/getProject', id).then((res) => {
        this.project = { ...res }
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    },
    save() {
      if (this.$refs.form.validate()) {
        this.editLoading = true
        this.$store
          .dispatch('project/updateProject', this.project)
          .then(() => {
            this.editLoading = false
            this.$router.push('/admin/projects')
          })
          .catch(() => {
            this.editLoading = false
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
