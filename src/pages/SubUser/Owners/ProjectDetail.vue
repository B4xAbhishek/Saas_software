<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex flex-column flex-md-row align-md-end py-3">
      <div>
        <div class="display-1">{{ $route.params.name }} Cameras</div>
        <bread-crumbs :items="breadcrumbs"></bread-crumbs>
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

    <div class="d-flex">
      <!-- product filters -->

      <!-- product list -->
      <div class="flex-grow-1 min-w-0">
        <!-- <div class="text-h6 mb-1">{{ $t("ecommerce.results", [8, 2092]) }}</div> -->
        <template v-if="isLoading">
          <div class="text-center mt-4">
            <v-progress-circular :value="100" indeterminate color="primary"></v-progress-circular>
            <h4>Loading Locations...</h4>
          </div>
        </template>
        <template v-else-if="locationList && locationList.length && !isLoading">
        
          <v-row>
            <v-col
              v-for="(location, i) in locationList"
              :key="i"
              cols="12"
              sm="6"
              md="4"
              lg="4"
              xl="3"
            >
              <Location :location="location" />
              <!-- <v-card max-width="344" class="mx-auto">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="headline">{{ location.location_name }}</v-list-item-title>
                    <v-list-item-subtitle>View: EAST</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-img src="/images/demo/cards/mountain.jpg" height="194"></v-img>
                <v-card-text> Last image: Mon, 24th 3:30PM </v-card-text>
                <v-card-actions>
                  <v-row align="center">
                    <v-col cols="6">
                      <v-btn
                        v-for="label in location.labels"
                        :key="label.device_sn"
                        small
                        text
                        color="primary"
                      >{{ label.label_name }}</v-btn>
                    </v-col>
                    <v-col cols="6">
                      <v-btn icon small>
                        <v-icon>mdi-alert</v-icon>
                      </v-btn>
                      <v-btn icon small>
                        <v-icon>mdi-map</v-icon>
                      </v-btn>
                      <v-btn icon small>
                        <v-icon>mdi-camera-burst</v-icon>
                      </v-btn>
                      <v-btn icon small>
                        <v-icon>mdi-share-variant</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-spacer></v-spacer>
                  <v-btn icon small>
                    <v-icon>mdi-alert</v-icon>
                  </v-btn>
                  <v-btn icon small>
                    <v-icon>mdi-map</v-icon>
                  </v-btn>
                  <v-btn icon small>
                    <v-icon>mdi-camera-burst</v-icon>
                  </v-btn>
                  <v-btn icon small>
                    <v-icon>mdi-share-variant</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>  -->
            
            </v-col>
          </v-row>
          <v-pagination
            v-model="pagination.page"
            :length="pagination.pagingCounter"
            @input="onPageChange"
          ></v-pagination>
        </template>
        <template v-else>
          <div class="text-center">
            <h4>No Location Found</h4>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Location from '@/components/project/Location'
export default {
  components: { Location },
  data() {
    return {
      isLoading: false,
      breadcrumbs: [
        {
          text: 'Owners',
          disabled: false,
          to: '/owners'
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
      locations: (store) => store.project.projectLocations
    }),
    locationList() {
      return this.locations && this.locations.locations
        ? this.locations.locations
        : []
    },
    pagination() {
      return this.locations && this.locations.pagination
    }
  },
  mounted() {
    this.loadProjectLocations()
  },
  methods: {
    searchProduct() {},
    onPageChange(value) {
      this.loadProjectLocations({ page: value })
    },
    async loadProjectLocations(params) {
      const { name } = this.$route.params

      const payload = {
        name
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
