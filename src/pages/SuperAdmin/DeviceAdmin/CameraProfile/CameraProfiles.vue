<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Camera Profiles</div>
        <!-- <bread-crumbs :items="breadcrumbs"></bread-crumbs> -->
      </div>
      <v-spacer></v-spacer>
      <v-btn color="primary" to="/device-admin/camera-profile/create">
        Add Camera Profile
      </v-btn>
    </div>

    <v-card>
      <!-- users list -->
      <v-row dense class="pa-2 align-center">
        <v-col cols="6">
          <v-menu offset-y left>
            <template v-slot:activator="{ on }">
              <transition name="slide-fade" mode="out-in">
                <v-btn v-show="selectedAccounts.length > 0" v-on="on">
                  Actions
                  <v-icon right>mdi-menu-down</v-icon>
                </v-btn>
              </transition>
            </template>
            <v-list dense>
              <v-list-item>
                <v-list-item-title>Verify</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Disable</v-list-item-title>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item>
                <v-list-item-title>Delete</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
        <v-col cols="6" class="d-flex text-right align-center">
          <v-text-field
            v-model="searchQuery"
            append-icon="mdi-magnify"
            class="flex-grow-1 mr-md-2"
            solo
            hide-details
            dense
            clearable
            placeholder="e.g. filter for name."
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

      <template v-if="profileList && profileList.length">
        <v-data-table
          :headers="headers"
          item-key="name"
          :items="profileList"
          :search="searchQuery"
          :loading="isLoading"
          hide-default-footer
          class="flex-grow-1 cursor-pointer"
        >

          <template v-slot:[`item.active`]="{ item }">
            <v-chip
              small
              :color="item.active ? 'primary' : 'dark'"
              dark
            ><span class="white--text">{{ item.active ? 'Active' : 'Inactive' }}</span></v-chip>
          </template>

          <template v-slot:[`item.action`]="{ item }">
            <div class="actions">
              <v-btn icon @click="goToProfile(item)">
                <v-icon color="info">mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="deleteProfile(item.id)">
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
        <v-pagination
          v-if="profileList && profileList.length && pagination"
          v-model="pagination.page"
          :length="pagination.pagingCounter"
          @input="paginateProfiles"
        ></v-pagination>
      </template>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      isLoading: false,
      profileModal: false,
      selectedProfile: null,
      searchQuery: '',
      selectedAccounts: [],
      headers: [
        { text: 'Name', value: 'name', width: '50%' },
        { text: '', sortable: false, value: 'action' }
      ],
      pagination: {
        page: 1,
        limit: 10
      },
      breadcrumbs: [{
        text: 'Device Settings',
        disabled: true
      }, {
        text: 'Device Profiles',
        disabled: true
      }]
    }
  },
  computed: {
    ...mapState({
      profileList: (store) => store.imageProfile.image_profiles || []
    })
  },
  created() {
    this.loadCameraProfiles()
  },
  methods: {
    searchUser() {},
    open() {},
    goToProfile(item) {
      this.selectedProfile = { ...item }
      this.profileModal = true
      this.$router.push(`/device-admin/camera-profile/${item.id}`)
    },
    refresh() {
      this.loadCameraProfiles()
    },
    async loadCameraProfiles(payload = null) {
      this.isLoading = true
      this.$store.dispatch('imageProfile/getImageProfiles', payload).then((resp) => {
        if (resp && resp.pagination) {
          this.pagination = { ...resp.pagination }
        }
      }).finally(() => {
        this.isLoading = false
      })
    },

    paginateProfiles(value) {
      this.loadCameraProfiles({ page: value })
    },

    deleteProfile(id) {
      this.isLoading = true

      this.$store.dispatch('imageProfile/deleteImageProfile', id).then(() => {
        this.loadCameraProfiles()
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    }
    // paginateUsers(value) {
    //   this.loadAccounts({ page: value })
    // }
  }
}
</script>
