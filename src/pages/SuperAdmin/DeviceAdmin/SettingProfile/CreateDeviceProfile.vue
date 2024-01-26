<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center py-3">
      <div>
        <div class="display-1">New Device Profile</div>
        <bread-crumbs :items="breadcrumbs"></bread-crumbs>
      </div>
    </div>

    <v-form ref="form" lazy-validation @submit.prevent="save">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-card>
            <v-card-title>Basic Information</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="new_profile.name"
                label="Name"
                placeholder="Enter Name"
                :rules="[(v) => !!v || 'Name is Required']"
              ></v-text-field>
              <v-select
                v-model="new_profile.settings.mcu_power_mode"
                label="MCU Power Mode"
                placeholder="Select MCU Power Mode"
                :items="mcu_power_modes"
                item-text="text"
                item-value="value"
                :rules="[(v) => !!v || 'MCU Power Mode is Required']"
              ></v-select>
              <v-select
                v-model="new_profile.settings.lte_power_mode"
                label="LTE Power Mode"
                placeholder="Select LTE Power Mode"
                :items="lte_power_modes"
                :rules="[(v) => !!v || 'LTE Power Mode is Required']"
              ></v-select>
              <v-text-field
                v-model="new_profile.APN"
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
                v-model="new_profile.settings.wifi_state"
                label="State"
                placeholder="Select State"
                :items="[true, false]"
              ></v-select>
              <v-text-field
                v-model="new_profile.settings.wifi_ssid"
                label="SSID"
                placeholder="Enter SSID"
                :rules="[(v) => !!v || 'SSID is Required']"
              ></v-text-field>
              <v-text-field
                v-model="new_profile.settings.wifi_password"
                label="Password"
                placeholder="Enter Password"
                :rules="[
                  (v) =>
                    (!v || v.length > 7) ||
                    'Password should contain atleast 8 characters',
                ]"
              ></v-text-field>
              <label class="text-subtitle">Channel</label>
              <v-slider
                v-model="new_profile.settings.wifi_channel"
                thumb-label
                max="13"
                min="1"
              ></v-slider>
              <v-select
                v-model="new_profile.settings.wifi_ssid_hidden"
                label="SSID Visibility"
                placeholder="Select SSID Visibility"
                :items="[true, false]"
              ></v-select>
            </v-card-text>
          </v-card>

          <div class="mt-3">
            <v-btn color="primary" type="submit" :loading="isLoading">
              Save
            </v-btn>
            <v-btn
              color="gray"
              class="ml-2"
              :to="`/device-admin/details/${cameraModel.id}?tab=setting-profile`"
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
export default {
  data() {
    return {
      cameraModel: null,
      isLoading: false,
      mcu_power_modes: [
        { text: 'Active', value: 'active' },
        { text: 'Modem Sleep', value: 'modem_sleep' },
        { text: 'Light Sleep', value: 'light_sleep' },
        { text: 'Deep Sleep', value: 'deep_sleep' },
        { text: 'Hibernation', value: 'hibernation' }
      ],
      lte_power_modes: ['PSM', 'DRX', 'eDRX'],
      new_profile: {
        name: null,
        settings: {
          mcu_power_mode: null,
          lte_power_mode: null,
          wifi_state: false,
          wifi_ssid: null,
          wifi_password: null,
          wifi_channel: null,
          wifi_ssid_hidden: false
        },
        APN: null
      }
    }
  },
  created() {
    const model = this.getSelectedModel()

    if (model) {
      this.cameraModel = { ...model }
    }
  },
  computed: {
    breadcrumbs() {
      return [
        {
          text: 'Settings Profile',
          disabled: false,
          to: `/device-admin/details/${this.cameraModel.id}?tab=setting-profile`
        },
        {
          text: 'New Setting Profile',
          disabled: true
        }
      ]
    }
  },
  methods: {
    save() {
      if (this.$refs.form.validate()) {
        this.isLoading = true
        this.$store
          .dispatch('settingProfile/createDeviceProfile', this.new_profile)
          .then(() => {
            this.isLoading = false
            this.$router.push(`/device-admin/details/${this.cameraModel.id}?tab=setting-profile`)
          })
          .catch(() => {
            this.isLoading = false
          })
      }
    }
  }
}
</script>
