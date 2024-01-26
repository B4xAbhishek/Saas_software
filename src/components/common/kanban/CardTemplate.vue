<template let-data>
  <div class="e-card-content">
    <v-card class="mx-auto" flat>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="headline">
            {{ data.locationName }} - {{ data.name }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <div v-if="device_images.length" class="position-image">
        <v-img
          :src="lastElement_device_image.image_url"
          height="194"
          @click="imageDialog = true"
        ></v-img>
        <div class="image-time">
          {{ format_time(lastElement_device_image.date) }}
        </div>
      </div>
      
      <v-img v-else height="194"></v-img>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-tooltip v-if="data && data.camera_id" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              small
              v-bind="attrs"
              v-on="on"
              @click="positionScheduleModal = true"
            >
              <v-icon>mdi-calendar</v-icon>
            </v-btn>
          </template>
          <span class="white--text">Set Schedule for {{ data.name }}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              small
              v-bind="attrs"
              v-on="on"
              @click="reportDialog = true"
            >
              <v-icon>mdi-alert</v-icon>
            </v-btn>
          </template>
          <span class="white--text">Report an issue</span>
        </v-tooltip>

        <v-tooltip v-if="isGPSAvailable()" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-if="isGPSAvailable()"
              icon
              small
              v-bind="attrs"
              v-on="on"
              @click="mapDialog = true"
            >
              <v-icon>mdi-map</v-icon>
            </v-btn>
          </template>
          <span class="white--text">Location Map</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              small
              v-bind="attrs"
              v-on="on"
              @click="historyDialog = true"
            >
              <v-icon>mdi-camera-burst</v-icon>
            </v-btn>
          </template>
          <span class="white--text">View Images</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              small
              v-bind="attrs"
              v-on="on"
              @click="shareDialog = true"
            >
              <v-icon>mdi-share-variant</v-icon>
            </v-btn>
          </template>
          <span class="white--text">Share</span>
        </v-tooltip>
      </v-card-actions>
    </v-card>

    <CameraSchedule
      v-if="positionScheduleModal && data"
      :model="positionScheduleModal"
      level="CAMERA"
      :target="data.camera_id"
      @close="positionScheduleModal = false"
    />

    <ImageModal
      v-if="imageDialog && srcImag"
      :open="imageDialog"
      :location="location"
      :image-prop="srcImag"
      @loadMore="loadMoreImages"
      @close="imageDialog = false"
    />

    <HistoryGrid
      v-if="historyDialog && deviceInfo"
      :device-info="deviceInfo"
      :location="data.locationId"
      :position-info="data"
      :open="historyDialog"
      @close="historyDialog = false"
    />

    <ReportProblem
      v-if="reportDialog && deviceInfo"
      :open="reportDialog"
      :sn="deviceInfo.SN"
      @close="reportDialog = false"
    />

    <Map
      v-if="mapDialog && deviceInfo"
      :open="mapDialog"
      :coordinates="deviceInfo.GPS"
      @close="mapDialog = false"
    />

    <Share
      v-if="shareDialog"
      :open="shareDialog"
      :device-info="deviceInfo"
      @close="shareDialog = false"
    />
  </div>
</template>
  
<script>
import ImageModal from '@/components/project/ImageModal'
import CameraSchedule from '@/components/project/CameraSchedule'
import ReportProblem from '@/components/project/ReportProblem'
import HistoryGrid from '@/components/project/HistoryGrid'
import Map from '@/components/project/Map'
import Share from '@/components/project/Share'

export default {
  components: {
    ImageModal,
    CameraSchedule,
    ReportProblem,
    HistoryGrid,
    Map,
    Share
  },
  data() {
    return {
      data: {},
      deviceInfo: null,
      lastElement_device_image: null,
      imageList: [],
      device_images: [],
      location: null,
      imageDialog: false,
      historyDialog: false,
      reportDialog: false,
      mapDialog: false,
      shareDialog: false,
      positionScheduleModal: false,
      imagesPagination: null
    }
  },
  computed: {
    srcImag() {
      const images = this.device_images.length && this.device_images[0] ? [...this.device_images] : []
      
      return images
    }
  },
  watch: {
    data(val) {
      if (val) {
        this.location = {
          id: this.data.locationId
        }
        this.getDeviceImage()
        this.getDeviceInfo()
      }
    }
  },
  created() {
    if (this.data && this.data.locationId) {
      this.location = {
        id: this.data.locationId
      }
    }

    this.getDeviceImage()
    this.getDeviceInfo()
  },
  methods: {
    format_time(s) {
      return (
        new Date(new Date(s).getTime()).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        }) +
        ' ' +
        new Date(s).toLocaleDateString('en-US').slice(0, 10)
      )
    },
    isGPSAvailable() {
      const gps = this.selectedPosition && this.selectedPosition.GPS

      if (gps && gps.lat && gps.lng) {
        return true
      }

      return false
    },
    async getDeviceInfo() {
      const resp = await this.$store.dispatch('device/getDeviceInfo', {
        id: this.data.camera_id
      })

      if (resp) {
        this.deviceInfo = resp
      }
    },
    async getDeviceImage(paging = false) {
      if (this.data) {
        const payload = {
          project: this.$route.params.id,
          location: this.data.locationId,
          position: this.data && this.data.id,
          page: 1,
          size: 10
        }

        if (paging && this.imagesPagination && !this.imagesPagination.hasNextPage) {
          // Don't load more images
          return
        }

        if (paging && this.imagesPagination && this.imagesPagination.hasNextPage) {
          payload.page = this.imagesPagination.nextPage
        }

        const resp = await this.$store.dispatch('device/getProjectImages', payload)

        if (resp) {
          if (resp.data.pagination) {
            this.imagesPagination = { ...resp.data.pagination }
          }
          
          if (resp.data.images && resp.data.images.length) {
            const images = []

            resp.data.images.forEach((image) => {
              if (image.image_type === 'individual') {
                const img = {
                  date: image.date,
                  image_url: image.urls[0],
                  type: paging ? 'new' : 'old'
                }

                images.push(img)
                
              }
            })

            if (paging && this.imagesPagination && this.imagesPagination.page > 1) {
              this.device_images = [...this.device_images, ...images]
            } else {
              this.device_images = [...images]
            }
          }

          this.lastElement_device_image = this.device_images.length ? this.device_images[0] : null

          this.imageList = this.device_images.length ? [...this.device_images].reverse() : []
        }
      }
    },
    loadMoreImages() {
      this.getDeviceImage(true)
    }
  }
}
</script>

<style lang="scss" scoped>
.position-image {
  position: relative;

  .image-time {
    position: absolute;
    display: inline-block;
    bottom: 5px;
    background: #000000;
    color: #ffffff;
    border-radius: 4px;
    font-size: 10px;
    padding: 2px 4px;
  }
}
</style>