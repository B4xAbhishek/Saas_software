<template>
  <div>
    <v-card class="mx-auto">
      <v-list-item>
        <v-list-item-content>
          <div class="d-flex justify-space-between">
            <v-list-item-title class="headline">{{
              location.name
            }}</v-list-item-title>

            <!-- <v-btn small color="grey lighten-2" class="px-0 ml-3">
              <v-icon color="primary">mdi-clock</v-icon>
              <span class="pa-0">Resource Time Logs</span>
            </v-btn> -->

            <v-menu bottom offset-y transition="scale-transition">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list dense>
                <v-list-item icon @click="editLocation">
                  <v-list-item-icon>
                    <v-icon color="primary" size="20">mdi-pencil</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Edit Location</v-list-item-title>
                </v-list-item>
                <v-list-item icon @click="editSchedule">
                  <v-list-item-icon>
                    <v-icon color="primary" size="20">mdi-calendar</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>Schedule</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>

          <div v-if="location" class="d-flex align-end pr-1 mb-1">
            <strong v-if="selectedPosition" class="primary--text mr-2">
              {{ selectedPosition.name }}
            </strong>
            <v-autocomplete
              v-model="stages"
              class="location-stage-chips"
              label="Select a stage"
              :items="project.stages"
              dense
              multiple
              small-chips
              deletable-chips
              hide-details
              @blur="updatePosition"
            ></v-autocomplete>
          </div>

          <!-- <v-list-item-subtitle
            v-if="deviceInfo"
          >View:
            {{
              deviceInfo.label || "Location not found."
            }}</v-list-item-subtitle> -->
        </v-list-item-content>
      </v-list-item>
      <v-img
        v-if="device_images.length"
        :src="lastElement_device_image.image_url"
        height="194"
        @click="imageDialog = true"
      ></v-img>
      <v-img v-else height="194"></v-img>
      <v-card-text class="pt-2 pb-0">
        <div v-if="lastElement_device_image">
          Last image: {{ format_time(lastElement_device_image.date) }}
        </div>
        <div v-else>
          <h5><i>No image fouund.</i></h5>
        </div>
        <div v-if="!positions || !positions.length" class="text-left">
          <h5><i>No device found for this location.</i></h5>
        </div>

        <v-row v-if="positions && positions.length" no-gutters>
          <v-col cols="12" class="pt-1">
            <v-slide-group show-arrows>
              <v-slide-item
                v-for="position in positions"
                :key="position.id"
                class="text-left"
              >
                <v-btn
                  :text="selectedPosition.id !== position.id"
                  color="primary"
                  class="px-0 text-center"
                  @click.native="changeDevice(position)"
                >
                  <div class="d-flex flex-column justify-center">
                    {{ position.name }}
                    <!-- <span class="black-text subtitle-2 pa-0">HVAC</span> -->
                  </div>

                </v-btn>
                <!-- <v-btn
                  :text="selectedLabel !== position.position_name"
                  color="primary"
                  class="px-0 text-center"
                  @click.native="changeDevice(label.device_sn, label.label_name)"
                >
                  <div class="d-flex flex-column justify-center">
                    {{ position.position_name }}
                    <span class="black-text subtitle-2 pa-0">HVAC</span>
                  </div>

                </v-btn> -->
              </v-slide-item>
            </v-slide-group>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              small
              v-bind="attrs"
              v-on="on"
              @click="resourceDialog = true"
            >
              <v-icon>mdi-clock</v-icon>
            </v-btn>
          </template>
          <span class="white--text">Onsite Time Logs</span>
        </v-tooltip>
        <v-tooltip v-if="selectedPosition && selectedPosition.camera_id" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              small
              v-bind="attrs"
              v-on="on"
              @click="editPositionSchedule"
            >
              <v-icon>mdi-calendar</v-icon>
            </v-btn>
          </template>
          <span class="white--text">Set Schedule for {{ selectedPosition.name }}</span>
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

    <EditLocation
      v-if="editModal && location"
      :open="editModal"
      :location="location"
      :project="project"
      @close="editModal = false"
    />

    <ImageModal
      v-if="imageDialog && srcImag"
      :open="imageDialog"
      :location="location"
      :image-prop="srcImag"
      @loadMore="loadMoreImages"
      @close="imageDialog = false"
    />

    <ResourceModal
      v-if="resourceDialog"
      :open="resourceDialog"
      :location="location"
      @close="resourceDialog = false"
    />

    <HistoryGrid
      v-if="historyDialog && deviceInfo"
      :device-info="deviceInfo"
      :location="location"
      :positions="positions"
      :open="historyDialog"
      @close="historyDialog = false"
    />

    <ReportProblem
      v-if="reportDialog && deviceInfo"
      :open="reportDialog"
      :sn="deviceInfo.SN"
      :camera-id="selectedPosition.camera_id"
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

    <v-dialog
      v-model="dialogDetail"
      transition="dialog-top-transition"
      max-width="800"
    >
      <v-card>
        <v-toolbar color="white" flat>
          <v-toolbar-title class="ml-2">DETAIL</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialogDetail = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col md="6"> TimeStamp: {{ format_time(historyDate) }} </v-col>
          </v-row>
          <v-row>
            <v-img
              v-if="imageDetail"
              class="white--text align-end"
              height="500px"
              :src="imageDetail.image_url"
            >
              <v-card-title>{{ deviceInfo.label }}</v-card-title>
            </v-img>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn text small @click="dialogDetail = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <CameraSchedule
      v-if="scheduleModal"
      :model="scheduleModal"
      level="LOCATION"
      :target="location.id"
      @close="scheduleModal = false"
    />

    <CameraSchedule
      v-if="positionScheduleModal && selectedPosition"
      :model="positionScheduleModal"
      level="CAMERA"
      :target="selectedPosition.camera_id"
      @close="positionScheduleModal = false"
    />

  </div>
</template>

<script>
import EditLocation from './EditLocation'
import ReportProblem from './ReportProblem'
import ImageModal from './ImageModal'
import HistoryGrid from './HistoryGrid'
import Map from './Map'
import Share from './Share'
import CameraSchedule from '@/components/project/CameraSchedule'
import ResourceModal from '@/components/project/ResourceModal'
export default {
  name: 'Location',
  components: {
    ReportProblem,
    HistoryGrid,
    ImageModal,
    Map,
    Share,
    EditLocation,
    CameraSchedule,
    ResourceModal
  },
  props: {
    project: {
      type: Object,
      default: null
    },
    location: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      // device_serial_no: this.location && this.location.labels.length && this.location.labels[0].device_sn,
      scheduleModal: false,
      positionScheduleModal: false,
      device_serial_no: null,
      positions: [],
      device_images: [],
      lastElement_device_image: null,
      deviceInfo: null,
      reportDialog: false,
      mapDialog: false,
      shareDialog: false,
      imageDialog: false,
      historyDialog: false,
      resourceDialog: false,
      imageDetail: '',
      dialogDetail: false,
      historyDate: '',
      selectedLabel: null,
      selectedPosition: null,
      editModal: false,
      imageList: [],
      imagesPagination: null,
      stages: []
    }
  },
  computed: {
    srcImag() {
      const images = this.device_images.length && this.device_images[0] ? [...this.device_images] : []

      return images
    }
  },
  async created() {
    await this.getLocationPositions()
    this.getDeviceImage()
    this.getDeviceInfo()
  },
  methods: {
    async getLocationPositions() {
      await this.$store.dispatch('project/getLocationPositions', { project_id: this.$route.params.id, location_id: this.location.id }).then((resp) => {
        this.positions = [...resp]
        this.selectedPosition = this.positions.length && this.positions[0]

        this.stages = [...this.selectedPosition.current_stage]
      })
    },
    editLocation() {
      this.editModal = true
    },
    editSchedule() {
      this.scheduleModal = true
    },
    editPositionSchedule() {
      this.positionScheduleModal = true
    },
    updatePosition() {
      const payload = {
        ...this.selectedPosition,
        current_stage: [...this.stages],
        project_id: this.$route.params.id,
        location_id: this.location.id,
        position_id: this.selectedPosition.id
      }

      this.$store.dispatch('project/updatePosition', payload)
    },
    isGPSAvailable() {
      const gps = this.selectedPosition && this.selectedPosition.GPS

      if (gps && gps.lat && gps.lng) {
        return true
      }

      return false
    },
    showDetail(history) {
      this.historyDate =
        new Date(history.date).toISOString().slice(0, 10) +
        ' ' +
        new Date(new Date(history.date).getTime()).toLocaleTimeString()
      this.imageDetail = history
      this.dialogDetail = true
      this.historyDioalog = false
    },
    changeDevice(position) {
      // this.device_serial_no = sn
      this.selectedPosition = { ...position }
      this.stages = [...this.selectedPosition.current_stage]
      this.getDeviceImage()
      this.getDeviceInfo()
    },
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
    async getDeviceImage(paging = false) {
      if (this.positions && this.positions.length > 0) {
        const payload = {
          project: this.$route.params.id,
          location: this.location.id,
          position: this.selectedPosition ? this.selectedPosition.id : this.positions[0].id,
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
      // if (this.device_serial_no) {
      //   const resp = await this.$store.dispatch('device/getDeviceImage', {
      //     device_serial_no: this.device_serial_no
      //   })

      //   if (resp) {
      //     this.device_images = resp && resp.images.length ? resp.images : []
      //     this.lastElement_device_image = this.device_images.length ? this.device_images.at(-1) : null
      //   }
      // }
    },
    loadMoreImages() {
      this.getDeviceImage(true)
    },
    async getDeviceInfo() {
      const resp = await this.$store.dispatch('device/getDeviceInfo', {
        id: this.selectedPosition.camera_id
      })

      if (resp) {
        this.deviceInfo = resp
      }
    }
  }
}
</script>
