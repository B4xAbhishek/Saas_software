<template>
  <div class="d-flex flex-column flex-grow-1">
    <v-row no-gutters align="center">
      <v-col cols="12">
        <div class="display-1">{{ $route.params.name }} Cameras</div>
      </v-col>
      <v-col cols="12" sm="5">
        <bread-crumbs :items="breadcrumbs"></bread-crumbs>
      </v-col>
      <v-col cols="12" sm="7" class="text-right">
        <v-btn text color="primary" class="px-1" @click="scheduleModal = true">
          <v-icon class="">mdi-calendar</v-icon>
          Camera Schedule
        </v-btn>
        <v-btn text color="primary" class="px-1" @click="editProject">
          <v-icon class="">mdi-pencil</v-icon>
          Edit Project
        </v-btn>
        <!-- <v-icon >mdi-menu</v-icon> -->
      </v-col>
    </v-row>
    <div class="d-flex flex-column flex-md-row mt-3">
      <div>
        <div class="mb-2 mb-md-0">
          <v-btn-toggle v-model="display" mandatory>
            <v-btn>
              <v-icon>mdi-view-grid</v-icon>
            </v-btn>
            <v-btn>
              <v-icon>mdi-view-column</v-icon>
            </v-btn>
          </v-btn-toggle>
          <v-btn
            :loading="isLoading"
            fab
            small
            class="ml-2 mb-1"
            @click="loadProjectLocations"
          >
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </div>
      </div>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="searchQuery"
        append-icon="mdi-magnify"
        solo
        rounded
        hide-details
        dense
        clearable
        placeholder="Search Records"
        @keyup.enter="searchProduct(searchQuery)"
      ></v-text-field>
    </div>

    <div>
      <template v-if="isLoading">
        <div class="text-center mt-4">
          <v-progress-circular :value="100" indeterminate color="primary"></v-progress-circular>
          <h4>Loading Locations...</h4>
        </div>
      </template>

      <template v-if="!isLoading && (!locations || !locations.length)">
        <div class="text-center">
          <h4>No Location Found</h4>
        </div>
      </template>

      <KanbanView v-if="!isLoading && projectInfo && display === 1" :project="projectInfo" />

      <div v-if="!isLoading && display === 0">
        <template v-if="locations && locations.length && !isLoading">
          <v-row no-gutters class="mb-3">
            <v-col
              v-for="(location, i) in locations"
              :key="i"
              cols="12"
              sm="6"
              md="6"
              lg="4"
              xl="4"
              class="mt-2 px-sm-1"
            >
              <Location :project="projectInfo" :location="location" />
            </v-col>
          </v-row>
          <v-pagination
            v-model="pagination.page"
            :length="pagination.pagingCounter"
            @input="onPageChange"
          ></v-pagination>
        </template>
      </div>
    </div>

    <CameraSchedule
      v-if="scheduleModal"
      :model="scheduleModal"
      level="PROJECT"
      :target="$route.params.id"
      @close="scheduleModal = false"
    />

    <AddEditProject
      v-if="addEditModal && projectInfo"
      :open="addEditModal"
      :edit="true"
      :project-info="projectInfo"
      @refresh="refreshProject"
      @close="addEditModal = false"
    />
  </div>
</template>

<script>
// eslint-disable prefer-destructuring

import { mapState } from 'vuex'
import AddEditProject from '@/components/project/AddEditProject'
import Location from '@/components/project/Location'
import KanbanView from '@/components/project/KanbanView'
import CameraSchedule from '@/components/project/CameraSchedule'
export default {
  components: { AddEditProject, Location, KanbanView, CameraSchedule },
  data() {
    return {
      isLoading: false,
      scheduleModal: false,
      addEditModal: false,
      projectInfo: null,
      
      display: 'grid',
      breadcrumbs: [
        {
          text: 'Projects',
          disabled: false,
          to: '/projects'
        },
        {
          text: 'Locations',
          disabled: true
        }
      ],

      page: 2,
      searchQuery: '',

      // filters
      priceFilter: [100, 500],
      reviewFilter: 2,
      brandFilter: ['Ardidas', 'Old Balance'],

      products: []
      // pagination: {
      //   current_page: 1,
      //   total_pages: 0,
      //   perPage: 10
      // }
    }
  },
  computed: {
    ...mapState({
      locations: (store) => store.project.projectLocations.locations,
      pagination: (store) => store.project.projectLocations.pagination
    }),
    locationList() {
      const locationsArray =  this.locations && this.locations.locations
        ? this.locations.locations
        : []

      return locationsArray

      // if (locationsArray && locationsArray.length > 0) {
      //   return locationsArray.filter((location) => location.labels && location.labels.length > 0)
      // }

      // return []
    }
    // pagination() {
    //   return this.locations && this.locations.pagination
    // }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      
      this.addEditModal = false
      this.loadProject()
      this.loadProjectLocations()
    },
    refreshProject(val) {
      if (val) {
        // if (val.name !== this.projectInfo.name) {
        //   this.$router.replace('/projects/' + val.name)
        // }
        this.init()
      }
    },
    editProject() {
      this.addEditModal = true
    },
    searchProduct() {},
    onPageChange(value) {
      this.loadProjectLocations({ page: value })
    },
    loadProject() {
      const { id } = this.$route.params

      this.isLoading = true

      this.$store.dispatch('project/getProject', id).then((resp) => {
        this.projectInfo = { ...resp }
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    },
    async loadProjectLocations(params) {
      const { id } = this.$route.params

      const payload = {
        id
      }

      if (params) {
        (payload.size = params.size || 10), (payload.page = params.page || 1)
      }

      this.isLoading = true
      await this.$store.dispatch('project/getProjectLocations', payload)
      this.isLoading = false
    }
  }
}
</script>
