<template>
  <div class="d-flex flex-column flex-grow-1">
    <div class="d-flex align-center pb-3">
      <div>
        <div class="display-1">New Device Profile</div>
        <bread-crumbs :items="breadcrumbs"></bread-crumbs>
      </div>
    </div>

    <v-form ref="form" lazy-validation @submit.prevent="save">
      <v-row>
        <v-col cols="12" md="6" lg="5">
          <v-card>
            <v-card-text>
              <v-row align="end" no-gutters>
                <v-col cols="12" class="pb-3">
                  <v-text-field
                    v-model="new_profile.name"
                    label="Profile Name"
                    placeholder="Enter Profile Name"
                    :rules="[(v) => !!v || 'Name is Required']"
                  ></v-text-field>      
                </v-col>
                <v-col cols="5" class="pb-3">
                  <label for="resolution">Resolution</label>
                </v-col>
                <v-col cols="7" class="pb-3">
                  <v-select
                    v-model="new_profile.frame_size"
                    label="Resolution"
                    placeholder="Select Resolution"
                    :items="frame_sizes"
                    item-text="text"
                    item-value="value"
                    hide-details
                  ></v-select>
                </v-col>
                <v-col cols="5" class="pb-3">
                  <label for="quality">Quality</label>
                </v-col>
                <v-col cols="7" class="pb-3">
                  <v-slider
                    v-model="new_profile.jpeg_quality"
                    thumb-label
                    :max="60"
                    :min="10"
                    hide-details
                  >
                    <template v-slot:prepend>
                      <span class="info-value">10</span>
                    </template>
                    <template v-slot:append>
                      <span class="info-value">60</span>
                    </template>
                  </v-slider>
                </v-col>
                <v-col cols="5" class="pb-3">
                  <label for="brightness">Brightness</label>
                </v-col>
                <v-col cols="7" class="pb-3">
                  <v-slider
                    v-model="new_profile.set_brightness"
                    thumb-label
                    :max="2"
                    :min="-2"
                    hide-details
                  >
                    <template v-slot:prepend>
                      <span class="info-value">-2</span>
                    </template>
                    <template v-slot:append>
                      <span class="info-value">2</span>
                    </template>
                  </v-slider>
                </v-col>
                <v-col cols="5" class="pb-3">
                  <label for="contrast">Contrast</label>
                </v-col>
                <v-col cols="7" class="pb-3">
                  <v-slider
                    v-model="new_profile.set_contrast"
                    thumb-label
                    :max="2"
                    :min="-2"
                    hide-details
                  >
                    <template v-slot:prepend>
                      <span class="info-value">-2</span>
                    </template>
                    <template v-slot:append>
                      <span class="info-value">2</span>
                    </template>
                  </v-slider>
                </v-col>
                <v-col cols="5" class="pb-3">
                  <label for="saturation">Saturation</label>
                </v-col>
                <v-col cols="7" class="pb-3">
                  <v-slider
                    v-model="new_profile.set_saturation"
                    thumb-label
                    :max="2"
                    :min="-2"
                    hide-details
                  >
                    <template v-slot:prepend>
                      <span class="info-value">-2</span>
                    </template>
                    <template v-slot:append>
                      <span class="info-value">2</span>
                    </template>
                  </v-slider>
                </v-col>
                <v-col cols="5" class="pb-3">
                  <label for="special_effect">Special Effect</label>
                </v-col>
                <v-col cols="7" class="pb-3">
                  <v-select
                    v-model="new_profile.set_special_effect"
                    placeholder="Select Special Effect"
                    :items="special_effects"
                    item-text="text"
                    item-value="value"
                    hide-details
                  ></v-select>
                </v-col>
                <v-col cols="5" class="pb-3">
                  <label for="awb">AWB</label>
                </v-col>
                <v-col cols="7" class="pb-3">
                  <v-switch
                    v-model="new_profile.set_whitebal"
                    hide-details
                  ></v-switch>
                </v-col>
                <v-col cols="5" class="pb-3">
                  <label for="awb_gain">AWB Gain</label>
                </v-col>
                <v-col cols="7" class="pb-3">
                  <v-switch
                    v-model="new_profile.set_awb_gain"
                    hide-details
                  ></v-switch>
                </v-col>
                <v-col cols="5" class="pb-3">
                  <label for="wb_mode">WB Mode</label>
                </v-col>
                <v-col cols="7" class="pb-3">
                  <v-select
                    v-model="new_profile.set_wb_mode"
                    placeholder="Select WB Mode"
                    :items="white_balance_modes"
                    item-text="text"
                    item-value="value"
                    hide-details
                  ></v-select>
                </v-col>
                <v-col cols="5" class="pb-3">
                  <label for="aec_sensor">AEC Sensor</label>
                </v-col>
                <v-col cols="7" class="pb-3">
                  <v-switch
                    v-model="new_profile.set_exposure_ctrl"
                    hide-details
                  ></v-switch>
                </v-col>
                <v-col cols="5" class="pb-3">
                  <label for="aec_dsp">AEC DSP</label>
                </v-col>
                <v-col cols="7" class="pb-3">
                  <v-switch
                    v-model="new_profile.set_aec2"
                    hide-details
                  ></v-switch>
                </v-col>
                <v-col cols="5" class="pb-3">
                  <label for="ae_level">AE Level</label>
                </v-col>
                <v-col cols="7" class="pb-3">
                  <v-slider
                    v-model="new_profile.set_ae_level"
                    thumb-label
                    :max="2"
                    :min="-2"
                    hide-details
                  >
                    <template v-slot:prepend>
                      <span class="info-value">-2</span>
                    </template>
                    <template v-slot:append>
                      <span class="info-value">2</span>
                    </template>
                  </v-slider>
                </v-col>
                <v-col cols="5" class="pb-3">
                  <label for="aec_value">AEC Value</label>
                </v-col>
                <v-col cols="7" class="pb-3">
                  <v-slider
                    v-model="new_profile.set_aec_value"
                    thumb-label
                    :max="1200"
                    :min="0"
                    hide-details
                  >
                    <template v-slot:prepend>
                      <span class="info-value">0</span>
                    </template>
                    <template v-slot:append>
                      <span class="info-value">1200</span>
                    </template>
                  </v-slider>
                </v-col>
                <v-col cols="5" class="pb-3">
                  <label for="agc">AGC</label>
                </v-col>
                <v-col cols="7" class="pb-3">
                  <v-switch
                    v-model="new_profile.set_gain_ctrl"
                    hide-details
                  ></v-switch>
                </v-col>
                <v-col cols="5" class="pb-3">
                  <label for="agc_gain">AGC Gain</label>
                </v-col>
                <v-col cols="7" class="pb-3">
                  <v-slider
                    v-model="new_profile.set_agc_gain"
                    thumb-label
                    :max="30"
                    :min="0"
                    hide-details
                  >
                    <template v-slot:prepend>
                      <span class="info-value">0</span>
                    </template>
                    <template v-slot:append>
                      <span class="info-value">30</span>
                    </template>
                  </v-slider>
                </v-col>
                <v-col cols="5" class="pb-3">
                  <label for="gain_ceiling">Gain Ceiling</label>
                </v-col>
                <v-col cols="7" class="pb-3">
                  <v-slider
                    v-model="new_profile.set_gainceiling"
                    thumb-label
                    :max="6"
                    :min="0"
                    hide-details
                  >
                    <template v-slot:prepend>
                      <span class="info-value">2x</span>
                    </template>
                    <template v-slot:append>
                      <span class="info-value">128x</span>
                    </template>
                  </v-slider>
                </v-col>
                <v-col cols="5" class="pb-3">
                  <label for="bpc">BPC</label>
                </v-col>
                <v-col cols="7" class="pb-3">
                  <v-switch
                    v-model="new_profile.set_bpc"
                    hide-details
                  ></v-switch>
                </v-col>
                <v-col cols="5" class="pb-3">
                  <label for="wpc">WPC</label>
                </v-col>
                <v-col cols="7" class="pb-3">
                  <v-switch
                    v-model="new_profile.set_wpc"
                    hide-details
                  ></v-switch>
                </v-col>
                <v-col cols="5" class="pb-3">
                  <label for="aec_dsp">Raw GMA</label>
                </v-col>
                <v-col cols="7" class="pb-3">
                  <v-switch
                    v-model="new_profile.set_raw_gma"
                    hide-details
                  ></v-switch>
                </v-col>
                <v-col cols="5" class="pb-3">
                  <label for="lens_correction">Lens Correction</label>
                </v-col>
                <v-col cols="7" class="pb-3">
                  <v-switch
                    v-model="new_profile.set_lenc"
                    hide-details
                  ></v-switch>
                </v-col>
                <v-col cols="5" class="pb-3">
                  <label for="hmirror">H-Mirror</label>
                </v-col>
                <v-col cols="7" class="pb-3">
                  <v-switch
                    v-model="new_profile.set_hmirror"
                    hide-details
                  ></v-switch>
                </v-col>
                <v-col cols="5" class="pb-3">
                  <label for="v_flip">V-Flip</label>
                </v-col>
                <v-col cols="7" class="pb-3">
                  <v-switch
                    v-model="new_profile.set_vflip"
                    hide-details
                  ></v-switch>
                </v-col>
                <v-col cols="5" class="pb-3">
                  <label for="dcw">DCW (Downsize EN)</label>
                </v-col>
                <v-col cols="7" class="pb-3">
                  <v-switch
                    v-model="new_profile.set_dcw"
                    hide-details
                  ></v-switch>
                </v-col>
                <v-col cols="5" class="pb-3">
                  <label for="color_bar">Color Bar</label>
                </v-col>
                <v-col cols="7" class="pb-3">
                  <v-switch
                    v-model="new_profile.set_colorbar"
                    hide-details
                  ></v-switch>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <div class="mt-3">
            <v-btn color="primary" type="submit" :loading="isLoading">
              Save
            </v-btn>
            <v-btn
              color="gray"
              class="ml-2"
              :to="`/device-admin/details/${cameraModel.id}?tab=camera-profile`"
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
      frame_sizes: [
        { text: 'UXGA(1600 x 1200)', value: 'FRAMESIZE_UXGA' },
        { text: 'QVGA(320 x 240)', value: 'FRAMESIZE_QVGA' },
        { text: 'CIF(352 x 288)', value: 'FRAMESIZE_CIF' },
        { text: 'VGA(640 x 480)', value: 'FRAMESIZE_VGA' },
        { text: 'SVGA(800 x 600)', value: 'FRAMESIZE_SVGA' },
        { text: 'XGA(1024 x 768)', value: 'FRAMESIZE_XGA' },
        { text: 'SXVGA(1280 x 1024)', value: 'FRAMESIZE_SXGA' }
      ],
      special_effects: [
        { text: 'No Effect', value: 0 },
        { text: 'Negative', value: 1 },
        { text: 'Grayscale', value: 2 },
        { text: 'Red Tint', value: 3 },
        { text: 'Green Tint', value: 4 },
        { text: 'Blue Tint', value: 5 },
        { text: 'Sepia', value: 6 }
      ],
      white_balance_modes: [
        { text: 'Auto', value: 0 },
        { text: 'Sunny', value: 1 },
        { text: 'Cloudy', value: 2 },
        { text: 'Office', value: 3 },
        { text: 'Home', value: 4 }
      ],
      new_profile: {
        name: null,
        frame_size: 'FRAMESIZE_UXGA',
        jpeg_quality: 10,
        set_brightness: 2,
        set_contrast: 2,
        set_saturation: 2,
        set_special_effect: 0,
        set_whitebal: true,
        set_awb_gain: true,
        set_wb_mode: 0,
        set_exposure_ctrl: true,
        set_aec2: true,
        set_ae_level: true,
        set_aec_value: 300,
        set_gain_ctrl: true,
        set_agc_gain: 0,
        set_gainceiling: 0,
        set_bpc: false,
        set_wpc: true,
        set_raw_gma: true,
        set_lenc: true,
        set_hmirror: false,
        set_vflip: false,
        set_dcw: true,
        set_colorbar: false
      }
    }
  },
  computed: {
    breadcrumbs() {
      return [
        {
          text: 'Camera Profiles',
          disabled: false,
          to: `/device-admin/details/${this.cameraModel.id}?tab=camera-profile`
        },
        {
          text: 'Add Camera Profile',
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
  },
  methods: {
    save() {
      if (this.$refs.form.validate()) {
        this.isLoading = true
        this.$store
          .dispatch('imageProfile/createImageProfile', this.new_profile)
          .then(() => {
            this.isLoading = false
            this.$router.push(`/device-admin/details/${this.cameraModel.id}?tab=camera-profile`)
          })
          .catch(() => {
            this.isLoading = false
          })
      }
    }
  }
}
</script>

<style scoped>
span.info-value {
    margin: 0 !important;
    padding: 0 !important;
    margin-top: 4px !important;
}
</style>