<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">OTA &amp; Firmware</div>
        <!-- <bread-crumbs :items="breadcrumbs"></bread-crumbs> -->
      </div>
      <v-spacer></v-spacer>
      <v-btn color="primary" to="/device-admin/ota-firmware/create">
        New Firmware
      </v-btn>
    </div>

    <v-card>
      <!-- users list -->
      <v-row dense class="pa-2 align-center">
        <v-col cols="6" md="4">
          <!-- <v-autocomplete
            v-model="deviceModel"
            :items="deviceModels"
            label="Select Device Model"
            hide-details
            dense
            solo
            item-text="name"
            item-value="name"
            @change="loadModelVersions"
          ></v-autocomplete> -->
        </v-col>
        <v-col cols="6" md="6" offset-md="2" class="d-flex text-right align-center">
          <v-text-field
            v-model="searchQuery"
            append-icon="mdi-magnify"
            class="flex-grow-1 mr-md-2"
            solo
            hide-details
            dense
            clearable
            placeholder="e.g. filter for model, version etc"
          ></v-text-field>
          <v-btn
            v-if="deviceModel"
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

      <template v-if="modelVersions && modelVersions.length">
        <v-data-table
          v-model="selectedAccounts"
          :headers="headers"
          item-key="version"
          :items="modelVersions"
          :search="searchQuery"
          :loading="isLoading"
          class="flex-grow-1 cursor-pointer"
          @click:row="goToProfile"
        >

          <template v-slot:[`item.version_id`]="{ item }">
            <a v-if="item.url" :href="item.url" target="_blank">File</a>
            <!-- <span v-if="item.version_id">{{ item.version_id }}.bin</span> -->
          </template>
        </v-data-table>
      </template>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      selectedModel: null,
      isLoading: false,
      profileModal: false,
      selectedProfile: null,
      searchQuery: '',
      deviceModel: null,
      modelVersions: [],
      selectedAccounts: [],
      headers: [
        { text: 'Model', value: 'name' },
        { text: 'Version', align: 'center', value: 'version' },
        { text: 'Date', value: 'posted_on' },
        { text: 'Release Notes', value: 'release_notes' },
        { text: 'Filename', value: 'version_id' }
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
      deviceModels: (store) => store.firmware.device_models
    })
  },
  created() {
    const model = this.getSelectedModel()
    
    if (model) {
      this.selectedModel = { ...model }
      this.loadModelVersions()
    }
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
      this.loadModelVersions()
    },
    async loadDeviceModels() {
      this.isLoading = true
      this.$store.dispatch('firmware/getDeviceModels').then((resp) => {
        if (resp.models && resp.models.length) {
          this.deviceModel = resp.models[0].name
          this.loadModelVersions()
        }
      }).catch(() => {
        this.isLoading = false
      })
    },
    async loadModelVersions() {
      this.isLoading = true
      this.$store.dispatch('firmware/getDeviceModelVersions', { model: this.selectedModel.id }).then((resp) => {
        const versions = resp.map((version) => {
          version.name = this.selectedModel.name
          // version.posted_on = new Date(version.posted_on).toLocaleDateString()

          return version
        })

        this.modelVersions = [...versions]

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