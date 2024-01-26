<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Edit Firmware</div>
        <bread-crumbs :items="breadcrumbs"></bread-crumbs>
      </div>
    </div>
  
    <v-row justify="center">
      <v-col cols="12" sm="10" md="6" xl="5">
        <v-card>
          <v-card-text>
            <p>
              The firmware uitility will install the latest version of the firmware and passwords
            </p>
  
            <div class="my-2">
              <strong>This tool is only compatible with, firefox and edge</strong>
              <p>installs security keys and latest firmware version</p>
              <p class="mt-2">Status: <span class="red--text">not installed</span></p>
            </div>
  
            <esp-web-install-button v-if="manifestURL" :manifest="manifestURL"></esp-web-install-button>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
  
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      isLoading: false,
      step: 1,
      selectedModel: null,
      modelVersions: [],
      manifestURL: null,
      required: [(v) => !!v || 'Required'],
      breadcrumbs: [
        {
          text: 'Inventory',
          disabled: false,
          to: '/inventory'
        },
        {
          text: 'Edit Firmware',
          disabled: true
        }
      ]
    }
  },
  created() {
    this.initESP()
  },
  methods: {
    initESP() {
      const { id } = this.$route.params

      this.isLoading = true

      // Get Device Password file
      this.$store.dispatch('device/getDevicePasswordFile', id).then((resp) => {
        const objURL = URL.createObjectURL(resp)
  
        // Get Firmware Manifest
        this.$store.dispatch('device/getPasswordFlashManifest', {
          id: id,
          blob_url: encodeURIComponent(objURL)
        }).then((response) => {
          const jsonString = JSON.stringify(response)
          // Create a Blob object from the JSON string
          const blob = new Blob([jsonString], { type: 'application/json' })
          const url = URL.createObjectURL(blob)
  
          this.manifestURL = url
        }).finally(() => {
          this.isLoading = false
        })
      })
    },
  
    printQR() {
      window.print()
    },
  
    addNewDevice() {
      this.resetForm()
      this.step = 1
    },
  
    async resetForm() {
      this.$refs.form.reset()
    }
  }
}
</script>