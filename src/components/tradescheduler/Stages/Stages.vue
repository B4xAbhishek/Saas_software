<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <!-- <div>
          <div class="display-1">Schedules</div>
        </div> -->
      <v-spacer></v-spacer>
      <!-- <v-btn color="primary" @click="addModal = true"> Add Stage</v-btn> -->
    </div>
    <v-row>
      <v-col cols="12" md="4" offset-md="8" class="d-flex text-right align-center">
        <v-text-field
          append-icon="mdi-magnify"
          class="flex-grow-1 mr-md-2"
          solo
          hide-details
          dense
          clearable
          placeholder="Search Stages"
        ></v-text-field>
        <v-btn
          icon
          small
          class="ml-2"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-card>
      <v-card-text>
        <v-row no-gutters class="px-2">
          <v-col cols="4">
            <h4>Stages</h4>
          </v-col>
          <v-col cols="6" class="px-2">
            <h4>Description</h4>
          </v-col>
          <v-col cols="2">

          </v-col>
        </v-row>

        <v-list>
          <v-list-item v-for="i in 4" :key="i" link>
            <v-list-item-content>
              <v-row no-gutters>
                <v-col cols="4" sm="4">
                  <h4>Excavation</h4>
                </v-col>
                <v-col cols="8" sm="6" class="px-2">
                  <h4>Blah, Blah, Blah</h4>
                </v-col>
                <v-col cols="12" sm="2" class="text-right">
                  <v-icon color="info">mdi-pencil</v-icon>
                  <v-icon color="red">mdi-delete</v-icon>
                </v-col>
              </v-row>
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-if="addNewStage">
            <v-list-item-content>
              <v-form>
                <v-row no-gutters align="center">
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="stage.name"
                      label="Name"
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4" class="px-2">
                    <v-text-field
                      v-model="stage.description"
                      label="Description"
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4" class="text-right text-sm-left">
                    <v-btn color="primary" class="px-4 px-sm-1 px-md-4" :small="$vuetify.breakpoint.smOnly" depressed>Submit</v-btn>
                    <v-btn
                      color="grey lighten-1"
                      class="ml-1 px-4 px-sm-1 px-md-4"
                      depressed
                      :small="$vuetify.breakpoint.smOnly"
                      @click="addNewStage = false"
                    >Cancel</v-btn>
                  </v-col>
                </v-row>
              </v-form>

            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-btn v-if="!addNewStage" color="primary" depressed @click="createStage">
          <v-icon>mdi-plus</v-icon>
          Add Stage</v-btn>
      </v-card-text>
    </v-card>

    <!-- <v-card>
      <v-row dense class="pa-2 align-center">
        <v-col cols="6" offset="6" class="d-flex text-right align-center">
          <v-text-field
            v-model="searchQuery"
            append-icon="mdi-magnify"
            class="flex-grow-1 mr-md-2"
            solo
            hide-details
            dense
            clearable
            placeholder="e.g. filter for stages"
          ></v-text-field>
          <v-btn
            :loading="isLoading"
            icon
            small
            class="ml-2"
            @click="refresh"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <template>
        <v-data-table
          :headers="headers"
          :items="stages"
          item-key="id"
          :search="searchQuery"
          :loading="isLoading"
          class="flex-grow-1 cursor-pointer"
        >
          <template v-slot:[`item.assignments`]="{}">
            <span class="text-underline primary--text px-0">view</span>
          </template>
        </v-data-table>
      </template>
    </v-card> -->

    <v-dialog v-model="addModal" max-width="550">
      <v-card>
        <v-card-text>
          <div class="d-flex justify-space-between align-center pt-2 pb-2">
            <div>
              <h2 class="black--text">Add stage profile</h2>
            </div>
            <v-icon @click="addModal = false">mdi-close</v-icon>
          </div>
          <v-divider></v-divider>
          <v-form @submit.prevent>
            <v-text-field
              v-model="profile.name"
              label="Stage profile name"
              placeholder="e.g Foundation & footings"
            ></v-text-field>

            <div class="mb-3">
              <h3 class="black--text">Stages:</h3>
              <div v-for="(stage, index) in profile.stages" :key="index" class="d-flex align-center">
                <v-text-field v-model="stage.name" label="Stage Name">
                </v-text-field>
                <div class="ml-2">
                  <v-btn
                    v-if="profile.stages.length > 1"
                    small
                    depressed
                    fab
                    color="red"
                    width="30"
                    height="30"
                    @click="removeStage(index)"
                  >
                    <v-icon color="white">mdi-close</v-icon>
                  </v-btn>
                  <v-btn
                    v-if="index === profile.stages.length - 1"
                    small
                    depressed
                    fab
                    color="primary"
                    class="ml-1"
                    width="30"
                    height="30"
                    @click="addStage"
                  >
                    <v-icon color="white">mdi-plus</v-icon>
                  </v-btn>
                </div>
              </div>
            </div>

            <v-btn color="primary" @click="addModal = false">Save</v-btn>
            <v-btn color="grey lighten-2" class="ml-1" @click="addModal = false">Cancel</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  components: {
  },
  data() {
    return {
      isLoading: false,
      add: false,
      searchQuery: '',
      addModal: false,
      addNewStage: false,
      stage: {
        name: null,
        description: null
      },
      profile: {
        name: null,
        stages: [
          { name: null }
        ]
      },
      headers: [
        { text: 'Stage Profile', value: 'profile' },
        { text: 'Status', value: 'status' }
      ],
      stages: [
        { id: 1, profile: 'Default', status: 'Active' },
        { id: 2, profile: 'Other', status: 'Inactive' }
      ]
    }
  },
  computed: {
    ...mapState({
      deviceModels: (store) => store.firmware.device_models
    })
  },
  created() {
    // this.loadDeviceModels()
  },
  methods: {
    searchUser() { },
    open() { },
    createStage() {
      this.stage.name = null
      this.stage.description = null
      this.addNewStage = true
    },
    addStage() {
      this.profile.stages.push({ name: null })
    },
    removeStage(index) {
      this.profile.stages.splice(index, 1)
    },
    goToDevice(item) {
      localStorage.setItem('model', item.name)
      this.$router.push(`/device-admin/details/${item.name}`)
    },
    refresh() {
      this.addModal = false
      // this.loadDeviceModels()
    },
    async loadDeviceModels() {
      this.$store.dispatch('firmware/getDeviceModels').then(() => {
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    }
  }
}
</script>
