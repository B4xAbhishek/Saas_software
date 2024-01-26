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
        <h4>Loading Camera...</h4>
      </div>
    </template>
    <template v-if="!isLoading && !deviceInfo">
      <div class="text-center mt-4">
        <h4>Camera not found.</h4>
      </div>
    </template>

    <v-form v-if="deviceInfo" ref="form" lazy-validation @submit.prevent="save">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-card>
            <v-card-title>Camera Settings</v-card-title>
            <v-card-text>
              Camera S/N {{ deviceInfo.SN }}
              <v-autocomplete
                v-model="editCamera.project_id"
                :items="projectList"
                :rules="required"
                item-text="name"
                item-value="id"
                label="Select Project"
                placeholder="Link Camera to project"
                @change="changeProject"
              ></v-autocomplete>
              <v-combobox
                v-model="editCamera.location_name"
                :items="locationList"
                :rules="required"
                item-text="name"
                item-value="name"
                label="Camera Location (List from projects)"
                placeholder="Enter Camera Location"
                @change="setLocation"
              ></v-combobox>
              <v-text-field
                v-model="editCamera.position_name"
                :rules="required"
                label="Camera Position in Lot"
                placeholder="Enter Camera Position"
              ></v-text-field>
            </v-card-text>
          </v-card>
          <v-card class="mt-3">
            <v-card-title>Camera Profiles</v-card-title>
            <v-card-text>
              Schedule the camera user to take pictures.
              <v-select
                :items="['Default']"
                label="Profile"
                placeholder="Select Profile"
              ></v-select>
            </v-card-text>
          </v-card>

          <div class="mt-3">
            <v-btn color="primary" type="submit" :loading="editLoading">Save</v-btn>
            <v-btn color="gray" class="ml-2" :disabled="editLoading" to="/admin/cameras">Cancel</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      isLoading: false,
      editLoading: false,
      deviceInfo: null,
      editCamera: {
        id: null,
        location_name: null,
        project_id: null,
        position_name: null
      },
      required: [(v) => !!v || 'Required'],
      breadcrumbs: [
        {
          text: 'Administrator',
          disabled: false,
          to: '/admin/cameras'
        },
        {
          text: 'Cameras',
          disabled: false,
          to: '/admin/cameras'
        },
        {
          text: 'Edit Camera',
          disabled: true
        }
      ]
    }
  },
  computed: {
    ...mapState({
      projects: (store) => store.project.projects,
      locations: (store) => store.project.projectLocations
    }),
    projectList() {
      return this.projects ? this.projects.projects : []
    },
    locationList() {
      return this.locations && this.locations.locations
        ? this.locations.locations
        : []
    },
    pagination() {
      return this.projects && this.projects.pagination
    }
  },
  watch: {
    selectedProjects(val) {}
  },
  created() {
    this.loadProjects()
  },
  methods: {
    async loadProjects(payload = null) {
      this.isLoading = true
      await this.$store
        .dispatch('device/getDeviceInfo', {
          id: this.$route.params.id
        })
        .then(async (resp) => {
          this.deviceInfo = { ...resp }
          this.editCamera.id = this.$route.params.id
          this.editCamera.project_id = resp.project.id
          this.editCamera.location_name = resp.location.name
          this.editCamera.position_name = resp.position.name

          if (resp.project) {
            await this.$store
              .dispatch('project/getProjects', payload)
              .then(() => {
                this.loadLocations(this.editCamera.project_id)
                this.isLoading = false
              })
          }
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    changeProject(id) {
      this.editCamera.location_name = null
      this.editCamera.position_name = null
      this.loadLocations(id)
    },
    loadLocations(id) {
      this.$store.dispatch('project/getProjectLocations', { id: id })
    },
    setLocation(loc) {
      if (typeof loc === 'object') {
        this.editCamera.location_name = loc.name
      } else {
        this.editCamera.location_name = loc
      }
    },
    async save() {
      if (this.$refs.form.validate()) {
        this.editLoading = true
        await this.$store
          .dispatch('device/updateDeviceInfo', this.editCamera)
          .then(() => {
            this.editLoading = false
            this.$router.push('/admin/cameras')
          })
          .finally(() => {
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
