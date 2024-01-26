<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Add Camera</div>
        <bread-crumbs :items="breadcrumbs"></bread-crumbs>
      </div>
    </div>

    <v-row justify="center">
      <v-col cols="12" sm="10" md="6" xl="5">
        <!-- Steps -->

        <v-stepper v-model="step">
          <v-stepper-header>
            <v-stepper-step :complete="step > 1" step="1">
              Register
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="step > 2" step="2">
              Flash fw
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="step > 3" step="3">
              Print QR
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="step > 4" step="4">
              Finish
            </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <v-form ref="form" lazy-validation @submit.prevent>
                <v-row justify="center">
                  <v-col cols="12">
                    <v-card flat>
                      <v-card-text>
                        <v-text-field
                          v-model="addCamera.SN"
                          :rules="required"
                          label="S/N"
                          placeholder="000-0000-0000"
                          disabled
                        ></v-text-field>
                        <v-text-field
                          v-model="addCamera.IMEI"
                          :rules="required"
                          label="IMEI"
                          tabindex="1"
                          @blur="setIMEI"
                        ></v-text-field>
                        <v-text-field
                          v-model="addCamera.ICCID"
                          :rules="required"
                          label="ICCID"
                          tabindex="2"
                        ></v-text-field>
                        <v-autocomplete
                          v-model="selectedModel"
                          label="Device Model"
                          placeholder="Select Device Model"
                          :items="deviceModels"
                          item-text="name"
                          return-object
                          :rules="required"
                          tabindex="3"
                          @change="loadModelVersions"
                        ></v-autocomplete>
                        <v-autocomplete
                          v-if="selectedModel"
                          v-model="addCamera.firmware_id"
                          :items="modelVersions"
                          item-text="version"
                          item-value="id"
                          label="Select Firmware Version"
                          tabindex="4"
                          :rules="required"
                        ></v-autocomplete>
                      </v-card-text>
                    </v-card>

                    <div class="mt-3">
                      <v-btn
                        type="submit"
                        color="primary"
                        tabindex="6"
                        :loading="isLoading"
                        @click="submit(false)"
                      >Continue</v-btn>
                      <v-btn
                        color="gray"
                        tabindex="7"
                        class="mx-2"
                        :disabled="isLoading"
                        to="/inventory"
                      >Cancel</v-btn>
                      <!-- <v-btn
                    type="submit"
                    color="primary"
                    tabindex="5"
                    :loading="isLoading"
                    @click="submit(true)"
                  >Save/New</v-btn> -->
                    </div>
                  </v-col>
                </v-row>
              </v-form>
            </v-stepper-content>

            <!-- Flash FW -->

            <v-stepper-content step="2">
              <p>
                The firmware uitility will install the latest version of the firmware and passwords
              </p>

              <div class="my-2">
                <strong>This tool is only compatible with, firefox and edge</strong>
                <p>installs security keys and latest firmware version</p>
                <p class="mt-2">Status: <span class="red--text">not installed</span></p>
              </div>

              <esp-web-install-button v-if="manifestURL" :manifest="manifestURL"></esp-web-install-button>

              <!-- <v-btn color="grey lighten-1">Connect and install</v-btn> -->
              <span class="info--text">Logs</span>

              <div class="mt-4">
                <v-btn color="primary" @click="step = 3">Continue</v-btn>
                <v-btn color="grey lighten-2" class="ml-1" @click="step = 1">Cancel</v-btn>
              </div>
            </v-stepper-content>

            <!-- Print QR -->

            <v-stepper-content step="3">
              <div v-if="qrValue" id="printable-area" style="width: 150px">
                <qr-code :text="qrValue" :size="150" class=""></qr-code>
                <p class="mt-1 text-center">
                  <strong>{{ addCamera.SN }}</strong>
                </p>
              </div>
              
              <v-btn color="grey lighten-1" class="mt-3" @click="printQR">Print</v-btn>

              <div class="mt-4">
                <v-btn color="primary" @click="step = 4">Continue</v-btn>
                <v-btn color="grey lighten-2" class="ml-1" @click="step = 2">Cancel</v-btn>
              </div>
            </v-stepper-content>

            <!-- Finish -->

            <v-stepper-content step="4">
              <div class="text-center mt-4">
                <v-icon color="success">mdi-check</v-icon>
                Registration and firmware installation completed.
              </div>
              <div class="mt-4">
                <v-btn color="primary" @click="addNewDevice">New</v-btn>
                <v-btn color="grey lighten-2" class="ml-1" @click="step = 3">Cancel</v-btn>
              </div>
            </v-stepper-content>
          </v-stepper-items>

        </v-stepper>
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
      qrValue: null,
      manifestURL: null,
      addCamera: {
        SN: null,
        IMEI: null,
        ICCID: null,
        model_id: null,
        firmware_id: null
      },
      required: [(v) => !!v || 'Required'],
      breadcrumbs: [
        {
          text: 'Inventory',
          disabled: false,
          to: '/inventory'
        },
        {
          text: 'Add Camera',
          disabled: true
        }
      ]
    }
  },
  computed: {
    ...mapState({
      deviceModels: (store) => store.firmware.device_models
    }),
    isVersionHigher() {
      let version = this.camera.firmware_version

      if (version.includes('.') && this.selectedModel) {
        version = version.replaceAll('.', '')

        const oldVersion = this.selectedModel.latest_version.replaceAll('.', '')

        if (Number(version) > Number(oldVersion)) {
          return true
        }
      }

      return false
    },
    isFilled() {
      return this.addCamera.SN && this.addCamera.IMEI && this.addCamera.ICCID
    }
  },
  created() {
    // this.initESP()
    this.loadDeviceModels()
  },
  methods: {
    loadDeviceModels() {
      this.$store.dispatch('firmware/getDeviceModels')
    },
    loadModelVersions(model) {
      this.addCamera.model_id = model.id

      this.$store.dispatch('firmware/getDeviceModelVersions', { model: model.id }).then((resp) => {
        // const versions = resp.firmwares.map((version) => {
        //   version.name = model.name
        //   version.posted_on = new Date(version.posted_on).toLocaleDateString()

        //   return version
        // })

        this.modelVersions = [...resp]
      })
    },
    setIMEI() {
      const value = this.addCamera.IMEI

      if (value.includes('P/N') && value.includes('SN') && value.includes('IMEI') && value.includes('SW')) {
        const splitIMEI = value.split('IMEI:')
        const IMEIValue = splitIMEI.at(1).split(';')
        const IMEI = IMEIValue.at(0)

        this.addCamera.IMEI = IMEI
        this.addCamera.SN = IMEI
      } else if (this.addCamera.IMEI) {
        this.addCamera.SN = this.addCamera.IMEI
      }
    },
    async submit(saveAndNew = false) {
      if (this.$refs.form.validate()) {
        this.isLoading = true
        await this.$store
          .dispatch('device/addNewDevice', this.addCamera)
          .then((resp) => {
            this.initESP(resp.id)
            // if (saveAndNew) {
            //   this.resetForm()
            // } else {
            //   this.$router.push('/inventory')
            // }
          })
          .catch(() => {
            this.isLoading = false
          })
      }
    },

    initESP(id) {
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
          // Set QR value
          this.qrValue = this.addCamera.IMEI + '865456053736847'
          console.log(this.qrValue)
          this.step = 2
        }).catch(() => {
          this.isLoading = false
        })
      }).catch(() => {
        this.isLoading = false
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
