<template>
  <v-dialog v-model="dialog" max-width="500" persistent>
    <v-card>
      <v-card-text>
        <div class="d-flex justify-space-between align-center pt-2 pb-2">
          <div>
            <h2 class="black--text">Camera Location</h2>
            <h4 class="black--text mt-1">SN: {{ item.device }}</h4>
          </div>
          <v-icon @click="close">mdi-close</v-icon>
        </div>
        <v-divider></v-divider>

        <div class="map mt-3 mb-0">
          <GmapMap
            ref="gMap"
            :center="{lat: item.GPS.latitude, lng: item.GPS.longitude}"
            :options="{fullscreenControl: false, streetViewControl: true, mapTypeControl: true, zoomControl: true, gestureHandling: 'cooperative'}"
            :zoom="14"
            style="height: 300px; margin-top: 20px;"
          >
            <GmapMarker
              :position="{lat: item.GPS.latitude, lng: item.GPS.longitude}"
            >
              <gmap-info-window :options="{maxWidth: 200}">
                <b>{{ item.device_location || 'Location: N/A' }}</b>
                <br>
                <br>
                <code>
                  Lat: {{ item.GPS.latitude }},
                  <br>
                  Lng: {{ item.GPS.longitude }}
                </code>
              </gmap-info-window>
            </GmapMarker >
          </GmapMap>
        </div>
        <p>Last check: <span v-if="item.GPS.timeStamp" class="px-0">{{ item.GPS.timeStamp.split('T')[0].replaceAll('-', '/') }}</span> <span v-if="item.GPS.time">{{ item.GPS.time }}</span></p>
        <v-btn color="grey lighten-2" class="ml-1" :disabled="isLoading" @click="close">Close</v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
      
<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: null
    }
  },
      
  data() {
    return {
      isLoading: false
    }
  },

  methods: {
    close() {
      this.$emit('close', true)
    }
  }
}
</script>