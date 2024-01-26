<template>
  <v-dialog v-model="dialog" max-width="500" persistent>
    <v-card>
      <v-card-text>
        <div class="d-flex justify-space-between align-center pt-2 pb-2">
          <div>
            <h2 class="black--text">Camera Edit</h2>
            <h4 v-if="order && item" class="black--text mt-1">Customer: {{ order.user ? order.user.company : user &&
              user.first_name + ' ' + user.last_name }}</h4>
          </div>
          <v-icon @click="cancel">mdi-close</v-icon>
        </div>
        <v-divider></v-divider>

        <template v-if="isAdmin()">

          <div v-if="item" class="d-flex align-center mt-1">
            <strong class="black--text">Expires:</strong>
            <span v-if="item.service_end_date">{{ new Date(item.service_end_date).toLocaleDateString() }}</span>
            <span v-else>Service not started yet.</span>
            <v-btn
              color="primary"
              class="ml-1"
              small
              depressed
              @click="change = !change"
            >Change</v-btn>
          </div>

          <template v-if="change && item">
            <DatePicker :date="item.service_end_date" @update="changeDate" />
          </template>
        </template>

        <v-form ref="form" class="mt-3" lazy-validation @submit.prevent="save">
          <v-autocomplete
            v-model="camera.project_id"
            :items="projects"
            item-text="name"
            item-value="id"
            label="Project"
            :rules="[v => !!v || 'Project is required.']"
            @change="getProjectLocations"
          ></v-autocomplete>

          <v-combobox
            v-model="camera.location_name"
            :items="locations"
            item-text="name"
            item-value="name"
            label="Location"
            :rules="[v => !!v || 'Location is required.']"
            @change="getLocationPositions"
          >
          </v-combobox>

          <v-combobox
            v-model="camera.position"
            :items="positions"
            item-text="name"
            item-value="name"
            label="Position"
            :rules="[v => !!v || 'Position is required.']"
          ></v-combobox>

          <div class="mt-3">
            <v-btn color="primary" type="submit" :loading="isLoading">Save</v-btn>
            <v-btn color="grey lighten-2" class="ml-1" :disabled="isLoading" @click="cancel">Cancel</v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
  
<script>
import DatePicker from '@/components/common/DatePicker'
import { mapState } from 'vuex'
export default {
  components: {
    DatePicker
  },
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    order: {
      type: Object,
      default: null
    },
    item: {
      type: Object,
      default: null
    },
    user: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      isLoading: false,
      change: false,
      projects: [],
      locations: [],
      positions: [],
      camera: {
        project_id: null,
        location_name: null,
        position: null
      }
    }
  },

  computed: {
    ...mapState({
      userInfo: (state) => state.auth.user
    })
  },
  created() {
    if (this.item && this.item.camera) {
      this.camera.project_id = this.item.camera.project && this.item.camera.project.id
      // this.camera.location_id = this.item.camera.location && this.item.camera.location.id
      // this.camera.position_id = this.item.camera.position && this.item.camera.position.id

      // if (this.camera.project_id) {
      //   this.getProjectLocations()
      // }
    }
    // Get all projects
    this.getProjects()
  },
  methods: {
    getProjects() {
      this.projects = []
      if (this.isAdmin()) {
        this.$store.dispatch('project/getCustomerProjects', { id: this.order.customer.id }).then(async (resp) => {
          this.projects = [...resp.projects]
          this.setProject()
        })
      }
      if (!this.isAdmin() && this.userInfo) {
        this.$store.dispatch('project/getProjects', { page: 1, size: 100000 }).then((resp) => {
          this.projects = [...resp.projects]
          this.setProject()
        })
      }
    },

    async getProjectLocations() {
      this.locations = []
      if (this.isAdmin()) {
        const payload = {
          customer: this.order.customer.id,
          project: this.camera.project_id
        }

        this.$store.dispatch('project/getCustomerProjectLocations', payload).then(async (resp) => {
          this.locations = [...resp.locations]
          this.setProjectLocation()
        })
      }
      if (!this.isAdmin() && this.userInfo) {
        this.$store.dispatch('project/getProjectLocations', { id: this.camera.project_id, perPage: 100000 }).then((resp) => {
          if (resp.locations && resp.locations.length) {
            // const locs = resp.locations.map((loc) => {
            //   const locLables = loc.labels.map((label) => {
            //     return { name: label.label_name, device_sn: label.device_sn }
            //   })

            //   return { name: loc.location_name, desc: loc.desc, labels: locLables }
            // })

            this.locations = [...resp.locations]
            this.setProjectLocation()
          }
          
        })
      }
    },

    async setProject() {
      if (this.camera.project_id) {
        const project = this.projects.find((p) => p.id === this.camera.project_id)

        if (project) {
          await this.getProjectLocations()
          // if (!this.camera.location_id && this.item && this.item.camera && this.item.camera.location) {

          //   console.log('No LOC : ', this.locations.length)
          //   const location = this.locations.find((loc) => loc.id === this.item.camera.location.id)

          //   if (location) {
          //     this.camera.location_id = location.id
          //     console.log(this.camera.location_id)
          //   }
          // }
        }
      }

      // if (this.item && this.item.device_lot) {
      //   this.camera.label = this.item.device_lot
      // }
    },

    async setProjectLocation() {
      if (!this.camera.location_name && (this.item && this.item.camera && this.item.camera.location)) {
        const pLocation = this.locations.find((location) => location.id === this.item.camera.location.id)

        if (pLocation) {
          this.camera.location_name = pLocation.name
          this.getLocationPositions()
          // this.labels = [...pLocation.labels]
        }
      } else {
        this.getLocationPositions()
      }
    },

    async getLocationPositions() {
      const location = this.locations.find((loc) => loc.name === this.camera.location_name)

      let request = null

      if (!this.isAdmin()) {
        request = 'project/getLocationPositions'
      }

      if (this.isAdmin()) {
        request = 'project/getCustomerLocationPositions'
      }

      if (location) {
        this.$store.dispatch(request, { customer: this.order.customer.id, project: this.camera.project_id, location: location.id }).then((resp) => {
          this.positions = [...resp]
        })
      } else {
        this.positions = []
      }      
    },

    changeDate(value) {
      // Update Order Device Expiry
      const payload = {
        id: this.order.id,
        index: this.item.index,
        expiry_date: value
      }

      this.$store.dispatch('order/updateOrderDeviceExpiry', payload).then(() => {
        this.$emit('refresh', true)
      })
    },

    save() {
      if (this.$refs.form.validate()) {
        if (this.isAdmin()) {
          // update for admin
          const payload = {
            customer_id: this.order.customer.id,
            camera_id: this.item.camera.id,
            project_id: this.camera.project_id,
            location_name: this.camera.location_name,
            position_name: typeof this.camera.position === 'string' ? this.camera.position : this.camera.position.name
          }

          console.log(payload)

          this.isLoading = true
          this.$store.dispatch('device/updateDeviceInfoForAdmin', payload).then(() => {
            this.refresh()
          }).finally(() => {
            this.isLoading = false
          })
        }

        if (this.isAdmin()) {
          // update for owner

          const payload = {
            id: this.item.camera.id,
            project_id: this.camera.project_id,
            location_name: this.camera.location_name,
            position_name: typeof this.camera.position === 'string' ? this.camera.position : this.camera.position.name
          }

          console.log(payload)

          this.isLoading = true
          this.$store.dispatch('device/updateDeviceInfo', payload).then(() => {
            this.refresh()
          }).finally(() => {
            this.isLoading = false
          })
        }
      }
    },
    refresh() {
      this.$emit('refresh')
    },
    cancel() {
      this.$emit('close', true)
    }
  }
}
</script>