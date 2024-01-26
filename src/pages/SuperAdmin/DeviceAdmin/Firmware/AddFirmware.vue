<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">New Firmware</div>
        <bread-crumbs :items="breadcrumbs"></bread-crumbs>
      </div>
    </div>

    <v-form ref="form" lazy-validation @submit.prevent="save">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-card>
            <v-card-text>
              <v-select
                v-model="selectedModel"
                label="Device Model"
                placeholder="Select Device Model"
                :items="deviceModels"
                item-text="name"
                return-object
                :rules="[(v) => !!v || 'Device Model is Required']"
                @change="loadModelVersions"
              ></v-select>
              <v-text-field
                v-if="selectedModel"
                v-model="firmware.firmware_version"
                label="Firmware Version"
                placeholder="Enter Firmware Version (0.1.0)"
                :rules="[
                  (v) => !!v || 'Firmware Version is Required',
                  (v) => (!!v && isVersionHigher) || 'Firmware version should be greater than Model Latest Version.'
                ]"
              ></v-text-field>
              <v-text-field
                v-if="selectedModel"
                v-model="firmware.md5_checksum"
                label="md5 checkdum"
                placeholder="Enter Firmware md5 checksum"
                :rules="[
                  (v) => !!v || 'Firmware md5 checksum is Required'
                ]"
              ></v-text-field>
              <v-textarea
                v-model="firmware.notes"
                rows="3"
                label="Release Notes"
                placeholder="Enter Release Notes"
              ></v-textarea>
              <v-row no-gutters align="end">
                <v-col cols="12" sm="9" md="10" lg="10">
                  <v-text-field
                    v-model="firmware.filename"
                    hide-details
                    placeholder="Firmware File"
                  >
                  </v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="3"
                  md="2"
                  lg="2"
                  class="pl-sm-2 mt-2 mt-sm-0 text-lg-right"
                >
                  <v-btn
                    color="black"
                    class="px-lg-1"
                    :block="$vuetify.breakpoint.mdAndDown"
                    dark
                    @click="uploadFile"
                  >Browse...</v-btn>
                  <input
                    ref="pickFile"
                    class="d-none"
                    type="file"
                    accept=".bin"
                    @change="onFilePick"
                  >
                </v-col>
              </v-row>
              <!-- <v-text-field
                v-model="firmware.filename"
                placeholder="Firmware File"
              >
                <template v-slot:append-outer-icon>
                
                </template>
              </v-text-field> -->
            </v-card-text>
          </v-card>

          <div v-if="cameraModel" class="mt-3">
            <v-btn color="primary" type="submit" :loading="isLoading">
              Save
            </v-btn>
            <v-btn
              color="gray"
              class="ml-2"
              :to="`/device-admin/details/${cameraModel.id}?tab=ota-firmware`"
              :disabled="isLoading"
            >
              Cancel
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      cameraModel: null,
      isLoading: false,
      selectedModel: null,
      pickedFile: null,
      lastVersion: null,
      firmware: {
        firmware_version: null,
        notes: null,
        filename: null,
        md5_checksum: null
      }
    }
  },
  computed: {
    ...mapState({
      deviceModels: (store) => store.firmware.device_models
    }),
    isVersionHigher() {
      let version = this.firmware.firmware_version
      
      if (!this.lastVersion) {

        return true
      }
      else if (version.includes('.') && this.lastVersion) {
        version = version.replaceAll('.', '')

        const oldVersion = this.lastVersion.version.replaceAll('.', '')

        console.log('OLD: ', oldVersion)

        if (Number(version) > Number(oldVersion)) {
          return true
        }
      }

      return false
    },
    breadcrumbs() {
      return [
        {
          text: 'OTA and Firmare',
          disabled: false,
          to: `/device-admin/details/${this.cameraModel.id}?tab=ota-firmware`
        },
        {
          text: 'New Firmware',
          disabled: true
        }
      ]
    }
  },
  created() {
    const model = this.getSelectedModel()

    if (model) {
      this.cameraModel = { ...model }
    }

    this.loadDeviceModels()
    
  },
  methods: {
    async loadDeviceModels() {
      this.$store.dispatch('firmware/getDeviceModels')
    },
    async loadModelVersions(model) {
      this.$store.dispatch('firmware/getDeviceModelVersions', { model: model.id }).then((resp) => {
        this.lastVersion = resp.length ? resp[0] : null
      })
    },
    uploadFile() {
      this.$refs.pickFile.click()
    },
    onFilePick(e) {
      const files = [...e.target.files]

      this.pickedFile = null
      if (files && files.length) {
        this.firmware.filename = files[0].name
        this.pickedFile = files[0]
      }
    },
    save() {
      if (this.$refs.form.validate()) {
        if (!this.pickedFile) {
          this.$store.commit(
            'setToast',
            {
              message: 'Please pick Firmware File.',
              color: 'red',
              show: true
            },
            { root: true }
          )

          return
        }

        const payload = {
          version: this.firmware.firmware_version,
          firmware_file: this.pickedFile,
          md5_checksum: this.firmware.md5_checksum,
          release_notes: this.firmware.notes
        }

        const formData = new FormData()

        for (const key in payload) {
          formData.append(key, payload[key])
        }

        const data = {
          id: this.cameraModel.id,
          data: formData
        }

        this.isLoading = true
        this.$store
          .dispatch('firmware/createFirmware', data)
          .then(() => {
            this.isLoading = false
            this.$router.push(`/device-admin/details/${this.cameraModel.id}?tab=ota-firmware`)
          })
          .catch(() => {
            this.isLoading = false
          })
      }
    }
  }
}
</script>
