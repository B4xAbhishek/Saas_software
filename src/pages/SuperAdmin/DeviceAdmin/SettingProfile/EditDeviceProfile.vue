<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">Edit Device Profile</div>
        <bread-crumbs :items="breadcrumbs"></bread-crumbs>
      </div>
    </div>
    <template v-if="isLoading">
      <div class="text-center mt-4">
        <v-progress-circular
          :value="100"
          indeterminate
          color="primary"
        ></v-progress-circular>
        <h4>Loading Setting Profile...</h4>
      </div>
    </template>
    <template v-else-if="!isLoading && !update_profile.id">
      <div class="text-center mt-4">
        <h4>Setting Profile not found...</h4>
      </div>
    </template>
    <template v-else-if="!isLoading && update_profile.id && !isDeviceEditable">
      <div class="text-center mt-4">
        <h4>Setting Profile is already active. Please deactivate this profile to update...</h4>
      </div>
    </template>

    <v-form v-if="!isLoading && update_profile.id && isDeviceEditable" ref="form" lazy-validation @submit.prevent="save">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-card>
            <v-card-title>Basic Information</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="update_profile.name"
                label="Name"
                placeholder="Enter Name"
                :rules="[(v) => !!v || 'Name is Required']"
              ></v-text-field>
              <v-select
                v-model="update_profile.settings.mcu_power_mode"
                label="MCU Power Mode"
                placeholder="Select MCU Power Mode"
                :items="mcu_power_modes"
                item-text="text"
                item-value="value"
                :rules="[(v) => !!v || 'MCU Power Mode is Required']"
              ></v-select>
              <v-select
                v-model="update_profile.settings.lte_power_mode"
                label="LTE Power Mode"
                placeholder="Select LTE Power Mode"
                :items="lte_power_modes"
                :rules="[(v) => !!v || 'LTE Power Mode is Required']"
              ></v-select>
              <v-text-field
                v-model="update_profile.APN"
                label="APN"
                placeholder="Enter APN"
                :rules="[(v) => !!v || 'APN is Required']"
              ></v-text-field>
            </v-card-text>
          </v-card>
          <v-card class="mt-3">
            <v-card-title>Wifi Soft Tap</v-card-title>
            <v-card-text>
              <v-select
                v-model="update_profile.settings.wifi_state"
                label="State"
                placeholder="Select State"
                :items="[true, false]"
              ></v-select>
              <v-text-field
                v-model="update_profile.settings.wifi_ssid"
                label="SSID"
                placeholder="Enter SSID"
                :rules="[(v) => !!v || 'SSID is Required']"
              ></v-text-field>
              <v-text-field
                v-model="update_profile.settings.wifi_password"
                label="Password"
                placeholder="Enter Password"
                :rules="[
                  (v) => !!v || 'Password is Required',
                  (v) =>
                    (!!v && v.length > 7) ||
                    'Password should contain atleast 8 characters',
                ]"
              ></v-text-field>
              <label class="text-subtitle">Channel</label>
              <v-slider
                v-model="update_profile.settings.wifi_channel"
                thumb-label
                max="13"
                min="1"
              ></v-slider>
              <v-select
                v-model="update_profile.settings.wifi_ssid_hidden"
                label="SSID Visibility"
                placeholder="Select SSID Visibility"
                :items="[true, false]"
              ></v-select>
            </v-card-text>
          </v-card>

          <div class="mt-3">
            <v-btn color="primary" type="submit" :loading="editLoading">
              Save
            </v-btn>
            <v-btn
              color="gray"
              class="ml-2"
              :to="`/device-admin/details/${cameraModel.id}?tab=setting-profile`"
              :disabled="editLoading"
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
      editLoading: false,
      profileList: [],
      mcu_power_modes: [
        { text: 'Active', value: 'active' },
        { text: 'Modem Sleep', value: 'modem_sleep' },
        { text: 'Light Sleep', value: 'light_sleep' },
        { text: 'Deep Sleep', value: 'deep_sleep' },
        { text: 'Hibernation', value: 'hibernation' }
      ],
      lte_power_modes: ['PSM', 'DRX', 'eDRX'],
      update_profile: {
        name: null,
        mcu_power_mode: null,
        lte_power_mode: null,
        APN: null,
        wifi_softtap: {
          state: false,
          ssid: null,
          password: null,
          channel: null,
          ssid_hidden: false
        }
      }
    }
  },
  computed: {
    ...mapState({
      profile: (store) => store.settingProfile.device_profiles
    }),
    isDeviceEditable() {
      if (this.update_profile && !this.update_profile.is_active) {
        return true
      }

      return false
    },
    breadcrumbs() {
      return [
        {
          text: 'Settings Profile',
          disabled: false,
          to: `/device-admin/details/${this.cameraModel.id}?tab=setting-profile`
        },
        {
          text: 'Edit Setting Profile',
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

    this.loadDeviceProfile()
  },
  methods: {
    async loadDeviceProfile() {
      const { id } = this.$route.params

      this.isLoading = true
      this.$store.dispatch('settingProfile/getDeviceProfile', id).then((resp) => {
        this.update_profile = { ...resp.data }
        console.log(this.update_profile)
        this.isLoading = false
      }).finally(() => {
        this.isLoading = false
      })
    },
    findProfile() {
      const { id } = this.$route.params

      const device_profile = this.profileList.find((p) => p.id === id)

      if (device_profile) {
        this.update_profile = {
          id: device_profile.id,
          name: device_profile.name,
          APN: device_profile.APN,
          mcu_power_mode: device_profile.settings.mcu_power_mode,
          lte_power_mode: device_profile.settings.lte_power_mode,
          wifi_softtap: { ...device_profile.settings.wifi_softtap },
          active: device_profile.active || false
        }
      }
    },
    save() {
      if (this.$refs.form.validate()) {
        const data = { ...this.update_profile }

        this.editLoading = true
        this.$store
          .dispatch('settingProfile/updateDeviceProfile', data)
          .then(() => {
            this.editLoading = false
            this.$router.push(`/device-admin/details/${this.cameraModel.id}?tab=setting-profile`)
          })
          .catch(() => {
            this.editLoading = false
          })
      }
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
