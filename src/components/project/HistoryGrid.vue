<template>
  <div>
    <v-dialog v-model="open" persistent max-width="600">
      <v-card>
        <v-card-text>
          <div class="d-flex justify-space-between pt-2 pb-2">
            <h2>History</h2>
            <v-icon @click="$emit('close')">mdi-close</v-icon>
          </div>
          <v-divider></v-divider>
          <v-row no-gutters>
            <v-col cols="12" md="6" class="px-1">
              <v-menu
                v-model="menu1"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
                color="primary"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="startDate"
                    label="Start Date"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="startDate"
                  @input="menu1 = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" md="6" class="px-1">
              <v-menu
                v-model="menu2"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
                color="primary"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="endDate"
                    label="End Date"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="endDate"
                  @input="menu2 = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col v-if="positions" cols="12" class="px-1">
              <v-autocomplete
                v-model="position"
                label="Select Location Position"
                :items="positions"
                item-text="name"
                item-value="id"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" class="px-1">
              <template v-if="imagesLoading">
                <div class="text-center mt-4">
                  <v-progress-circular :value="100" indeterminate color="primary"></v-progress-circular>
                  <h4>Loading Images...</h4>
                </div>
              </template>
              <v-slide-group active-class="success" show-arrows>
                <v-slide-item
                  v-for="detail in device_images"
                  :key="detail.image_url"
                >
                  <v-card
                    class="ma-1 relative"
                    height="180"
                    width="150"
                    :img="detail.image_url"
                    @click="selectImage(detail)"
                  >
                    <div class="date-area black white--text">
                      {{ format_time(detail.date) }}
                    </div>
                  </v-card>
                </v-slide-item>
              </v-slide-group>
            </v-col>
            <!-- <v-col v-for="detail in device_images" :key="detail.image_url" md="12">
            <v-img
              :src="detail.image_url"
              class="white--text align-end"
              height="150px"
              @click="showDetail(detail)"
            >
            </v-img>

            <p class="mt-2">{{ format_time(detail.date) }}</p>
            <v-pagination
              v-model="pagination.current_page"
              :length="pagination.total_pages"
              @input="onPageChange"
            />
          </v-col> -->
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="$emit('close')">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="singleImage" persistent max-width="700">
      <v-card>
        <v-card-text>
          <div class="d-flex justify-space-between pt-2 pb-2">
            <h2>Image</h2>
            <v-icon @click="singleImage = !singleImage">mdi-close</v-icon>
          </div>
          <v-divider></v-divider>
          <v-card
            v-if="selectedImage"
            class="mt-3 relative"
            height="400"
            width="100%"
            :img="selectedImage.image_url"
            @click="showDetail(selectedImage)"
          >
            <div class="date-area black white--text">
              {{ format_time(selectedImage.date) }}
            </div>
          </v-card>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'HistoryGrid',
  props: {
    open: {
      type: Boolean,
      default: false
    },
    deviceInfo: {
      type: Object,
      default: null
    },
    location: {
      type: Object || String,
      default: null
    },
    positionInfo: {
      type: Object,
      default: null
    },
    positions: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      projectInfo: null,
      imagesLoading: false,
      projectDate: [],
      device_images: [],
      singleImage: false,
      selectedImage: null,
      pagination: {
        current_page: 1,
        total_pages: 0,
        perPage: 8
      },
      menu: false,
      menu1: false,
      startDate: null,
      menu2: false,
      endDate: null,
      position: null
    }
  },
  watch: {
    startDate(val) {
      this.loadProjectImages()
    },
    endDate(val) {
      this.loadProjectImages()
    },
    position(val) {
      this.loadProjectImages()
    }
  },
  created() {
    this.projectInfo = this.$store.getters['project/projectInfo']
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
    selectImage(image) {
      this.selectedImage = { ...image }
      this.singleImage = true
    },
    showDetail(history) {
      this.$emit('showDetail', history)
    },
    onPageChange() {
      this.getDeviceImage()
    },
    async loadProjectImages() {
      const payload = {
        start_date: this.startDate,
        end_date: this.endDate,
        project: this.$route.params.id,
        location: this.location && typeof this.location === 'object' ? this.location.id : this.location,
        position: this.position
      }

      if (this.positionInfo) {
        payload.position = this.positionInfo.id
      } else if (!this.positionInfo) {
        payload.position = this.position
      }

      if (this.startDate && this.endDate && payload.position) {
        this.imagesLoading = true

        this.$store.dispatch('device/getProjectImages', payload).then((resp) => {
          this.device_images = []
          if (resp.data.images && resp.data.images.length) {
            resp.data.images.forEach((image) => {
              if (image.image_type === 'individual') {
                const img = {
                  date: image.date,
                  image_url: image.urls[0]
                }

                this.device_images.push(img)
              }
            })
          }
          this.imagesLoading = false
        }).catch(() => {
          this.imagesLoading = false
        })
      }
      // const resp = await this.$store.dispatch('project/getProjectImages', payload)

      // if (resp) {
      //   this.device_images = resp.images
      //   this.pagination.total_pages = resp.pagination.totalPages
      // }
    },
    async getDeviceImage() {
      const payload = {
        device_serial_no: this.deviceInfo.SN,
        page: this.pagination.current_page,
        size: this.pagination.perPage
      }
      const resp = await this.$store.dispatch('device/getDeviceImage', payload)

      if (resp) {
        this.device_images = resp.images
        this.pagination.total_pages = resp.pagination.totalPages
      }
    }
  }
}
</script>

<style scoped>
.relative {
  position: relative;
}
.date-area {
  position: absolute;
  border-radius: 4px;
  padding: 0 4px;
  left: 5px;
  bottom: 5px;
}
</style>
