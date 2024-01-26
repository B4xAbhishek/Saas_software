<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Schedule Profiles</div>
      </div>
      <v-spacer></v-spacer>
      <v-btn color="primary" to="/device-admin/schedule-profile/create">
        Add Schedule
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
            placeholder="e.g. filter for name, MCU PM, etc"
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
          v-model="selectedAccounts"
          :headers="headers"
          item-key="id"
          :items="profileList"
          :search="searchQuery"
          :loading="isLoading"
          class="flex-grow-1 cursor-pointer"
          @click:row="goToProfile"
        >

          <template v-slot:[`item.is_active`]="{ item }">
            <v-chip small :color="item.is_active ? 'primary' : 'dark'" dark><span class="white--text">{{ item.is_active ?
              'Active' : 'Inactive' }}</span></v-chip>
          </template>

          <template v-slot:[`item.action`]="{ item }">
            <div class="actions">
              <v-menu bottom origin="center center" transition="scale-transition">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>

                <v-list dense>
                  <v-list-item :to="`/device-admin/schedule-profile/${item.id}`">
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>
                  <v-list-item v-if="!item.is_active" @click="activateProfile(item.id)">
                    <v-list-item-title class="green--text">Activate</v-list-item-title>
                  </v-list-item>
                  <v-list-item v-if="!item.active" @click="deleteProfile(item.id)">
                    <v-list-item-title class="red--text">Delete</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
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
  props: {
    modelId: {
      type: String,
      required: true
    },
    tab: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isLoading: false,
      profileModal: false,
      selectedProfile: null,
      searchQuery: '',
      selectedAccounts: [],
      headers: [
        { text: 'Profile Name', value: 'name' },
        { text: 'Status', value: 'is_active' },
        { text: '', sortable: false, value: 'action' }
      ],
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
      profileList: (store) => store.scheduleProfile.schedule_profiles,
      pagination: (store) => store.scheduleProfile.pagination
    })
  },
  created() {
    this.loadScheduleProfiles()
  },
  methods: {
    searchUser() { },
    open() { },
    goToProfile(item) {
      this.selectedProfile = { ...item }
      this.profileModal = true
    },
    refresh() {
      this.loadScheduleProfiles()
    },
    async loadScheduleProfiles(payload = null) {
      this.isLoading = true
      this.$store.dispatch('scheduleProfile/getScheduleProfiles', payload).then(() => {
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    },
    paginateProfiles(value) {
      this.loadScheduleProfiles({ page: value })
    },
    activateProfile(id) {
      this.isLoading = true
      const payload = { id }

      this.$store.dispatch('scheduleProfile/activateScheduleProfile', id).then(() => {
        this.loadScheduleProfiles()
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
    },

    deleteProfile(id) {
      this.isLoading = true

      this.$store.dispatch('scheduleProfile/deleteScheduleProfile', id).then(() => {
        this.loadScheduleProfiles()
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
      })
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