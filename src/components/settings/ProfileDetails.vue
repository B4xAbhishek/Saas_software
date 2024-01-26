<template>
  <div>
    <v-dialog v-model="open" persistent max-width="500">
      <v-card>
        <v-card-text>
          <div class="d-flex justify-space-between pt-2 pb-2">
            <h2>Profile Details</h2>
            <v-icon @click="$emit('close')">mdi-close</v-icon>
          </div>
          <v-divider></v-divider>

          <v-simple-table v-if="profile" class="mt-3">
            <template v-slot:default>
              <tbody>
                <tr>
                  <td class="text-left black--text">
                    ID
                  </td>
                  <td class="text-left black--text">
                    {{ profile.id }}
                  </td>
                </tr>
                <tr>
                  <td>Name</td>
                  <td>{{ profile.name }}</td>
                </tr>
                <tr>
                  <td>LTE Power Mode</td>
                  <td>{{ profile.settings.lte_power_mode }}</td>
                </tr>
                <tr>
                  <td>MCU Power Mode</td>
                  <td>{{ profile.settings.mcu_power_mode }}</td>
                </tr>
                <tr>
                  <td>APN</td>
                  <td>{{ profile.APN }}</td>
                </tr>
                <tr>
                  <td>Wifi State</td>
                  <td>{{ profile.settings.wifi_state }}</td>
                </tr>
                <tr>
                  <td>Wifi SSID</td>
                  <td>{{ profile.settings.wifi_ssid }}</td>
                </tr>
                <tr>
                  <td>Wifi Password</td>
                  <td>{{ profile.settings.wifi_password }}</td>
                </tr>
                <tr>
                  <td>Wifi Channel</td>
                  <td>{{ profile.settings.wifi_channel }}</td>
                </tr>
                <tr>
                  <td>Wifi SSID Hidden</td>
                  <td>{{ profile.settings.wifi_ssid_hidden }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="$emit('close')">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
/* eslint-disable no-useless-escape */
export default {
  name: 'PowerNetworkProfile',
  props: {
    open: {
      type: Boolean,
      default: false
    },
    profile: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
    }
  }
}
</script>
