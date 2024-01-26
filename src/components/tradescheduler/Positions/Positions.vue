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
          placeholder="Search Positions"
        ></v-text-field>
        <v-btn
          icon
          small
          class="ml-2"
          @click="refresh"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  
    <v-card>
      <v-card-text>
        <v-row no-gutters class="px-2">
          <v-col cols="4">
            <h4>Position</h4>
          </v-col>
          <v-col cols="6" class="px-2">
            <h4>Tags</h4>
          </v-col>
          <v-col cols="2">
  
          </v-col>
        </v-row>
  
        <v-list>
          <v-list-item v-for="position in positions" :key="position.id" link>
            <v-list-item-content>
              <v-row no-gutters>
                <v-col cols="4" sm="4">
                  <h4>{{ position.name }}</h4>
                </v-col>
                <v-col cols="8" sm="6" class="px-2">
                  <v-chip v-for="(tag, index) in position.tags" :key="index" small class="px-1 mr-1">{{ tag }}</v-chip>
                </v-col>
                <v-col cols="12" sm="2" class="text-right">
                  <!-- <v-icon color="info">mdi-pencil</v-icon> -->
                  <!-- <v-icon color="red">mdi-delete</v-icon> -->
                </v-col>
              </v-row>
            </v-list-item-content>
          </v-list-item>
  
          <v-list-item v-if="addNewPosition">
            <v-list-item-content>
              <v-form @submit.prevent="createNewPosition">
                <v-row no-gutters align="center">
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="position.name"
                      placeholder="Name"
                      dense
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4" class="px-2">
                    <v-combobox
                      v-model="position.tags"
                      placeholder="Tags"
                      small-chips
                      deletable-chips
                      multiple
                      dense
                    ></v-combobox>
                  </v-col>
                  <v-col cols="12" sm="4" class="text-right text-sm-left">
                    <v-btn
                      color="primary"
                      type="submit"
                      :loading="addLoading"
                      class="px-4 px-sm-1 px-md-4"
                      :small="$vuetify.breakpoint.smOnly"
                      depressed
                    >Submit</v-btn>
                    <v-btn
                      color="grey lighten-1"
                      class="ml-1 px-4 px-sm-1 px-md-4"
                      depressed
                      :small="$vuetify.breakpoint.smOnly"
                      @click="addNewPosition = false"
                    >Cancel</v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-list-item-content>
          </v-list-item>
        </v-list>
  
        <v-btn v-if="!addNewPosition" color="primary" depressed @click="createPosition">
          <v-icon>mdi-plus</v-icon>
          Add Position</v-btn>
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
      addLoading: false,
      add: false,
      searchQuery: '',
      addModal: false,
      addNewPosition: false,
      positions: [],
      position: {
        name: null,
        tags: null
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
    this.loadAvailablePositions()
  },
  methods: {
    searchUser() { },
    open() { },
    createPosition() {
      this.position.name = null
      this.position.description = null
      this.addNewPosition = true
    },
    addStage() {
      this.profile.stages.push({ name: null })
    },
    // removeStage(index) {
    //   this.profile.stages.splice(index, 1)
    // },
    refresh() {
      this.addModal = false
      this.loadAvailablePositions()
    },
    async loadAvailablePositions() {
      this.isLoading = true
      this.$store.dispatch('schedule/getAvailablePositions').then((resp) => {
        this.positions = [...resp]
      }).finally(() => {
        this.isLoading = false
      })
    },

    createNewPosition() {
      this.addLoading = true
      this.$store.dispatch('schedule/createPosition', this.position).then(() => {
        this.addNewPosition = false
        this.refresh()
      }).finally(() => {
        this.addLoading = false
      })
    }
  }
}
</script>
