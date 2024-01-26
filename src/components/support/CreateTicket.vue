<template>
  <v-dialog v-if="ticketDialog" v-model="ticketDialog" persistent max-width="950">
    <v-card>
      <v-card-text>
        <div class="pt-2 pb-2 d-flex justify-space-between align-center">
          <h2 class="black--text">Create Ticket</h2>
          <v-icon @click="close">mdi-close</v-icon>
        </div>
        <v-divider></v-divider>

        <v-form ref="form" lazy-validation @submit.prevent="submit">
          <v-row>
            <v-col cols="12" md="7" lg="8" :class="$vuetify.breakpoint.mdAndUp && 'right-border'">
              <v-row no-gutters>
                <v-col cols="12" sm="9" md="8" lg="6">
                  <!-- <strong class="mr-2 mt-2">#00013</strong> -->
                  <v-select v-model="ticket.title" label="Type of problem" :items="problem_types" :rules="required">
                  </v-select>
                </v-col>
                <v-col cols="12">
                  <!-- <v-textarea
                    label="Description"
                    outlined
                    rows="4"
                  ></v-textarea> -->
                  <div class="control-section">
                    <div class="sample-container">
                      <div class="default-section mb-3">
                        <RichTextEditor @update="onDescriptionUpdate" />
                        <p v-if="!isDescription" class="red--text ma-0">Ticket Description is required.</p>
                      </div>
                    </div>
                  </div>

                  <template v-if="$vuetify.breakpoint.mdAndUp">
                    <v-btn type="submit" color="primary" :loading="isLoading">Save</v-btn>
                    <v-btn color="grey lighten-1 ml-1" :disabled="isLoading" @click="close">Cancel</v-btn>
                  </template>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="5" lg="4">
              <v-autocomplete
                v-if="!customer"
                v-model="selectedCompany"
                label="Select Company"
                :items="users"
                item-text="company_name"
                item-value="email"
                :rules="required"
                return-object
                @change="setCompany"
              ></v-autocomplete>

              <template v-if="selectedCompany || customer">
                <template v-if="selectedCompany && !customer">
                  <p class="mb-0 mt-0 px-0"><strong>{{ selectedCompany.phone }}</strong></p>
                  <p class="mb-0 mt-0 px-0"><strong>{{ selectedCompany.email }}</strong></p>
                </template>
                <template v-if="customer">
                  <p class="mb-0 mt-0 px-0"><strong>{{ user.first_name }} {{ user.first_name }} - {{ user.company_name }}</strong></p>
                  <p class="mb-0 mt-0"><span class="px-0">{{ user.phone_number }}</span></p>
                  <p class="mb-0 mt-0"><span class="px-0">{{ user.email }}</span></p>
                </template>

                <v-autocomplete
                  v-if="!customer"
                  v-model="ticket.assigned_to"
                  label="Assigned To"
                  :items="admins"
                  item-text="email"
                  item-value="id"
                  :rules="required"
                >
                </v-autocomplete>

                <div v-else class="mt-2">
                  <strong class="black--text">Assigned To: </strong>
                  <span class="pl-1">Admin</span>
                </div>

                <v-autocomplete
                  v-model="selectedProject" 
                  :items="projects"
                  item-text="name"
                  item-value="name"
                  label="Project"
                  :rules="[v => !!v || 'Project is required.']"
                  hide-details
                  return-object
                  @change="getProjectLocations"
                ></v-autocomplete>

                <v-autocomplete
                  v-model="ticket.location"
                  :items="locations"
                  item-text="name"
                  item-value="name"
                  label="Location"
                  :rules="[v => !!v || 'Location is required.']"
                  hide-details
                  return-object
                  @change="getLocationPositions"
                >
                </v-autocomplete>

                <v-autocomplete
                  v-model="ticket.camera_id"
                  label="Position"
                  :items="positions"
                  item-text="name"
                  item-value="camera_id"
                  :rules="[v => !!v || 'Position is required.']"
                  @change="getDeviceInfo"
                ></v-autocomplete>

                <div v-if="deviceInfo" class="d-flex mb-1">
                  <strong class="black--text pa-0">Model: </strong>
                  <span class="pa-0 pl-1">{{ deviceInfo.model.name }}</span>
                </div>

                <div v-if="deviceInfo" class="d-flex mb-1">
                  <strong class="black--text">Network: </strong>
                  <span class="pa-0 pl-1 text-capitalize" :class="deviceInfo.network_status === 'active' ? 'green--text' : 'red--text'">{{ deviceInfo.network_status }}</span>
                </div>

                <v-autocomplete
                  v-model="ticket.status"
                  label="Status"
                  :items="['open', 'closed', 'overdue', 'hold']"
                  hide-details
                ></v-autocomplete>

                <v-autocomplete v-model="ticket.priority" label="Priority" :items="['none', 'high', 'medium', 'low']">
                </v-autocomplete>
              </template>

              <template v-if="$vuetify.breakpoint.smAndDown">
                <v-btn type="submit" color="primary" :loading="isLoading">Save</v-btn>
                <v-btn color="grey lighten-1 ml-1" :disabled="isLoading" @click="close">Cancel</v-btn>
              </template>
            </v-col>
          </v-row>
        </v-form>

      </v-card-text>
    </v-card>
  </v-dialog>
</template>
  
<script>
import RichTextEditor from '@/components/support/RichTextEditor'
import { mapState } from 'vuex'

export default {
  components: {
    RichTextEditor
  },
  props: {
    ticketDialog: {
      type: Boolean,
      default: false
    },
    customer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      required: [(v) => !!v || 'Required'],
      isLoading: false,
      problem_types: [
        'no image',
        'image quality',
        'alignment',
        'not updating'
      ],
      ticket: {
        title: null,
        description: null,
        company: null,
        assigned_to: null,
        project: null,
        location: null,
        label: null,
        camera_id: null,
        status: 'open',
        priority: 'high'
      },
      selectedCompany: null,
      selectedProject: null,
      projects: [],
      locations: [],
      positions: [],
      admins: [],
      deviceInfo: null,
      description: null,
      isDescription: true
    }
  },
  computed: {
    ...mapState({
      user: (store) => store.auth.user,
      users: (store) => store.customer.accounts
    })
  },
  created() {
    // this.getProblemTypes()
    if (!this.customer) {
      this.loadUsers()
    } else if (this.customer) {
      this.loadProjects(null)
    }
  },
  methods: {
    getProblemTypes() {
      this.$store.dispatch('support/getProblemTypes').then((resp) => {
        this.problem_types = [...resp.data]
      })
    },
    loadUsers() {
      this.$store.dispatch('customer/getAccounts')
      this.$store.dispatch('support/getAdminUsers').then((resp) => {
        this.admins = [...resp]
      })
    },
    onDescriptionUpdate(value) {
      this.ticket.description = value
    },
    loadProjects(user) {
      this.projects = []
      this.locations = []
      this.positions = []
      this.deviceInfo = null

      if (this.customer) {
        this.$store.dispatch('project/getProjects', { page: 1, size: 999 }).then((resp) => {
          this.projects = [...resp.projects]
        })
      } else if (!this.customer) {
        this.$store.dispatch('project/getCustomerProjects', { id: user.id }).then((resp) => {
          this.projects = [...resp.projects]
        })
      }
      
    },
    getProjectLocations(project) {
      this.selectedProject = { ...project }
      this.locations = []
      this.positions = []
      this.ticket.location = null
      this.ticket.label = null
      this.deviceInfo = null

      if (this.customer) {
        const payload = {
          id: project.id
        }

        this.$store.dispatch('project/getProjectLocations', payload).then(async (resp) => {
          this.locations = [...resp.locations]
        })
      } else if (!this.customer) {
        const payload = {
          customer: this.selectedCompany.id,
          project: project.id
        }

        this.$store.dispatch('project/getCustomerProjectLocations', payload).then(async (resp) => {
          this.locations = [...resp.locations]
        })
      }
      
    },

    async getLocationPositions(location) {
      this.deviceInfo = null

      if (this.customer) {
        const payload = {
          project_id: this.selectedProject.id,
          location_id: location.id
        }

        this.$store.dispatch('project/getLocationPositions', payload).then((resp) => {
          this.positions = [...resp]
        })
      } else if (!this.customer) {
        const payload = {
          customer: this.selectedCompany.id,
          project: this.selectedProject.id,
          location: location.id
        }

        this.$store.dispatch('project/getCustomerLocationPositions', payload).then((resp) => {
          this.positions = [...resp]
        })
      }

      // this.positions = [...location.labels]
    },

    getDeviceInfo() {
      this.deviceInfo = null
      this.$store.dispatch('device/getDeviceInfo', { id: this.ticket.camera_id }).then((resp) => {
        this.deviceInfo = { ...resp }
      })
    },
    setCompany(user) {
      if (user) {
        this.ticket.company = user.company
        this.loadProjects(user)
      } else {
        this.ticket.company = null
        this.selectedCompany = null
      }
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.isDescription = true
        if (!this.ticket.description) {
          this.isDescription = false

          return
        }

        let desc = this.ticket.description.split('').reverse().join('').replace('<>rb', '')
      
        desc = desc.split('').reverse().join('')

        const payload = {
          title: this.ticket.title,
          description: desc,
          assigned_to: this.ticket.assigned_to,
          camera_id: this.ticket.camera_id,
          priority: this.ticket.priority,
          status: this.ticket.status
        }

        this.isLoading = true
        this.$store.dispatch('support/createTicket', payload).then(() => {
          this.refresh()
        }).finally(() => {
          this.isLoading = false
        })
      }
    },
    close() {
      this.$emit('close')
    },
    refresh() {
      this.$emit('refresh')
    }
  }
}
</script>

<style scoped>
.right-border {
  border-right: 1px solid #ddd;
}
</style>