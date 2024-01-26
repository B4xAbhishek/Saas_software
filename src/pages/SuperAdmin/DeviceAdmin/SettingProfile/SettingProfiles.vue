<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Setting Profiles</div>
        <!-- <bread-crumbs :items="breadcrumbs"></bread-crumbs> -->
      </div>
      <v-spacer></v-spacer>
      <v-btn color="primary" to="/device-admin/setting-profile/create">
        Add Settings
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
          hide-default-footer
          class="flex-grow-1 cursor-pointer"
          @click:row="goToProfile"
        >

          <template v-slot:[`item.is_active`]="{ item }">
            <v-chip
              small
              :color="item.is_active ? 'primary' : 'dark'"
              dark
            ><span class="white--text">{{ item.is_active ? 'Active' : 'Inactive' }}</span></v-chip>
          </template>

          <template v-slot:[`item.action`]="{ item }">
            <div class="actions">
              <v-menu
                bottom
                origin="center center"
                transition="scale-transition"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>

                <v-list dense>
                  <v-list-item :to="`/device-admin/setting-profile/${item.id}`">
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>
                  <v-list-item v-if="!item.is_active" @click="activateProfile(item.id)">
                    <v-list-item-title class="green--text">Activate</v-list-item-title>
                  </v-list-item>
                  <v-list-item v-if="!item.is_active" @click="deleteProfile(item.id)">
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

    <ProfileDetails
      v-if="profileModal && selectedProfile"
      :open="profileModal"
      :profile="selectedProfile"
      @close="profileModal = false"
    />
  </div>
</template>

<script>
import ProfileDetails from '@/components/settings/ProfileDetails'
import { mapState } from 'vuex'

export default {
  components: { ProfileDetails },
  data() {
    return {
      isLoading: false,
      profileModal: false,
      selectedProfile: null,
      searchQuery: '',
      selectedAccounts: [],
      profileList: [],
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'MCU PM', value: 'settings.mcu_power_mode' },
        { text: 'LTE PM', value: 'settings.lte_power_mode' },
        { text: 'APN', value: 'APN' },
        { text: 'Active', value: 'is_active' },
        { text: '', sortable: false, align: 'right', value: 'action' }
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
      profile: (store) => store.settingProfile.device_profiles
    })
  },
  watch: {
    selectedAccounts(val) {

    }
  },
  created() {
    this.loadDeviceProfiles()
  },
  methods: {
    searchUser() {},
    open() {},
    goToProfile(item) {
      this.selectedProfile = { ...item }
      this.profileModal = true
      // this.$router.push(`/device-profiles/${item.id}`)
    },
    refresh() {
      this.loadDeviceProfiles()
    },
    async loadDeviceProfiles(payload = null) {
      this.isLoading = true
      this.$store.dispatch('settingProfile/getDeviceProfiles', payload).then((resp) => {
        if (resp && !resp.pagination) {
          this.profileList = [...resp]
        }
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
    activateProfile(id) {
      this.isLoading = true

      this.$store.dispatch('settingProfile/activateDeviceProfile', id).then(() => {
        this.loadDeviceProfiles()
      }).finally(() => {
        this.isLoading = false
      })
    },

    deleteProfile(id) {
      this.isLoading = true

      this.$store.dispatch('settingProfile/deleteDeviceProfile', id).then(() => {
        this.loadDeviceProfiles()
      }).finally(() => {
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
