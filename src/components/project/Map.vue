<template>
  <v-dialog v-model="open" persistent max-width="700">
    <v-card>
      <v-card-text>
        <div class="d-flex justify-space-between pt-2 pb-2">
          <h2>Last Camera Location</h2>
          <v-icon @click="$emit('close')">mdi-close</v-icon>
        </div>
        <v-divider></v-divider>
        <GmapMap
          ref="gMap"
          :cluster="{options: {styles: clusterStyle}}"
          :center="{lat: locations[0].lat, lng: locations[0].lng}"
          :options="{fullscreenControl: false, streetViewControl: true, mapTypeControl: true, zoomControl: true, gestureHandling: 'cooperative', styles: mapStyle}"
          :zoom="14"
          style="height: 400px; margin-top: 20px;"
        >
          <GmapMarker
            v-for="location in locations"
            :key="location.id"
            :position="{lat: location.lat, lng: location.lng}"
            :options="{icon: location === currentLocation ? pins.selected : pins.notSelected}"
            @click="currentLocation = location"
          >
            <gmap-info-window :options="{maxWidth: 200}">
              <b>{{ location.name }}</b>
              <br>
              <br>
              <code>
                Lat: {{ location.lat }},
                <br>
                Lng: {{ location.lng }}
              </code>
            </gmap-info-window>
          </GmapMarker >
        </GmapMap>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="$emit('close')">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'Map',
  props: {
    open: {
      type: Boolean,
      default: false
    },
    coordinates: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      currentLocation: {},
      locationsVisibleOnMap: '',
      locations: [
        {
          // lat: this.mapCordinates.latitude,
          // lng: this.mapCordinates.longitude,
          lat: 40.65250381129056,
          lng: -111.50828916271176
          // name: "Zagreb"
        }
      ],
      pins: {
        selected:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHUSURBVHgB5VU7SwNBEJ7LmZBgMC+UdKKx0MZCG2srwcbCB2glpFDQ3to/IegvSAIWPrBJIySlipUKKqYLaHJ3iWIelzu/DTk8j71H7MQPltmZnflmZ3b3juivQ3BzCIfDI4FAYBvTRV3XR7tBglCCOIP9oFwuv/46QSwWWwfZIaaDNi7vGOlqtZqhfhPE4/EViAy5V6ljE8uVSuXYc4JkMjncarUeMR0ib5Db7fZEvV6vWBd8PG+Q73LIFYyj3lAsa1G/37/D4+JWgPbcQkybd9jpdGYVRXlmSiQSSYmieMWmhgMuwI0kSTPkpQJgzKJnDfJuKYryBJH7sVNBSPGI7BKoFl3n+GguMY4JHiz6GtoybiisRczmEtPFAM+Ifl6i5DmTKYqeX+Nssj19lUz9N2J4XNxDTiQSkwi4oz6ADU3hLdxb7dwW9RyL5B0FHrltAgZUsEce4eRrmwB3ugCRJ3fk4VvsOwEDHtcWxKeDy4emaWmHdRKdFpvNphQKhdhFmOet42D3sftTJw7X/wHgw/U8h1ywkJ/gYJeI/wi/g8kdmqqqG5Alk62Er+emG7nXBFSr1aroNSNknwOVzZnNS6xIHtFoNF6CweAbpheyLOfo3+ALfrSuzJ1F8EsAAAAASUVORK5CYII=',
        notSelected:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABHElEQVR42uVVyw4BMRQdC98lsbPwG5YSH+BzWFtLZilh0oQgFh6J54IwBmGYtrfaBREdcTvDhpM0adrec3rb+7Csn8fRdrLg7VzBubhDzmHrudRuZ2KRs/miLd6AThfNaOTTGRFIsMm8bkSuXBeGoLVaGi0g39wLI4GTf1EjdE/+E1pAAGgEAenkb/tBo1vQFUDgBbSbny6al77uSQwB/6wJSNHoAo8xj30iaYMW4Lv9wfSTpc0eH6atXtE4TKWNUS4AY2hyddY4k/lwVEZncm9QilQuBGPwnp1B5GIXGi3P0eU0c7EqKrje5hU5d7fr2P2AEJIESkNqB1XJkvhI0/GrTuqZX619tLMF/VHlfnk5/0r7ZMvVWA3rr3AF6LIMZ7PmSlUAAAAASUVORK5CYII='
      },
      clusterStyle: [
        {
          url:
            'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png',
          width: 56,
          height: 56,
          textColor: '#fff'
        }
      ],
      mapStyle: [
        {
          featureType: 'all',
          elementType: 'labels.text.fill',
          stylers: [
            {
              color: '#ffffff'
            }
          ]
        },
        {
          featureType: 'all',
          elementType: 'labels.text.stroke',
          stylers: [
            {
              visibility: 'on'
            },
            {
              color: '#3e606f'
            },
            {
              weight: 2
            },
            {
              gamma: 0.84
            }
          ]
        },
        {
          featureType: 'all',
          elementType: 'labels.icon',
          stylers: [
            {
              visibility: 'off'
            }
          ]
        },
        {
          featureType: 'administrative',
          elementType: 'geometry',
          stylers: [
            {
              weight: 0.6
            },
            {
              color: '#313536'
            }
          ]
        },
        {
          featureType: 'landscape',
          elementType: 'geometry',
          stylers: [
            {
              color: '#44a688'
            }
          ]
        },
        {
          featureType: 'poi',
          elementType: 'geometry',
          stylers: [
            {
              color: '#13876c'
            }
          ]
        },
        {
          featureType: 'poi.attraction',
          elementType: 'geometry.stroke',
          stylers: [
            {
              color: '#f5e4e4'
            },
            {
              visibility: 'off'
            }
          ]
        },
        {
          featureType: 'poi.attraction',
          elementType: 'labels',
          stylers: [
            {
              visibility: 'on'
            },
            {
              lightness: '14'
            }
          ]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [
            {
              color: '#13876c'
            },
            {
              visibility: 'simplified'
            }
          ]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [
            {
              color: '#067372'
            },
            {
              lightness: '-20'
            }
          ]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [
            {
              color: '#357374'
            }
          ]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [
            {
              color: '#004757'
            }
          ]
        }
      ]
    }
  },
  created () {
    if (this.coordinates) {
      this.locations[0].lat = this.coordinates.latitude
      this.locations[0].lng = this.coordinates.longitude
    }
  },
  methods: {
    returnToCenter() {
     
      this.$refs.gMap.map.setCenter(this.locations[0])
    },

    checkForMarkers() {
      this.locations.forEach((location, i) => {
        location.visible = this.$refs.gMap.map
          .getBounds()
          .contains(this.$refs.gMap.markers[i].getPosition())
      })

      this.locationsVisibleOnMap = this.locations
        .filter((l) => l.visible)
        .map((l) => l.name)
        .join(', ')
    }
  }
}
</script>

<style lang="scss">
* {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
}

h1 {
  color: #206569;
  margin-bottom: 5px;
  & + p {
    margin-top: 0;
    font-size: 16px;
    a {
      color: #206569;
    }
  }
}

// span,
// p,
// a {
//   color: #206569;
//   font-size: 16px;
// }

span,
p,
a {
  color: #000000;
  font-size: 14px;
  padding: 4px 8px;
}

.visibleCities {
  position: absolute;
  span {
    font-weight: bold;
  }
}

.flex {
  position: relative;
  padding-bottom: 50px;
}

.GMap,
p {
  margin-top: 30px;
}

.GMap__Wrapper {
  width: 100%;
  height: 400px;
}

.button {
  background-color: #206569;
  color: #fff;
  outline: 0;
  border: 0;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 200ms;
  backface-visibility: hidden;
  &:hover {
    background-color: #12957b;
  }
}
</style>